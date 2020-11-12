/*
 * Copyright ish group pty ltd. All rights reserved. http://www.ish.com.au No copying or use of this code is allowed without permission in writing from ish.
 */
package ish.oncourse.server.cayenne.glue

import ish.CayenneIshTestCase
import ish.oncourse.cayenne.TaggableClasses
import ish.oncourse.server.ICayenneService
import ish.oncourse.server.cayenne.Course
import ish.oncourse.server.cayenne.Tag
import ish.oncourse.server.cayenne.TagRelation
import org.apache.cayenne.exp.Expression
import org.apache.cayenne.query.SelectQuery
import org.dbunit.dataset.ReplacementDataSet
import org.dbunit.dataset.xml.FlatXmlDataSet
import org.dbunit.dataset.xml.FlatXmlDataSetBuilder
import org.junit.After
import static org.junit.Assert.assertEquals
import static org.junit.Assert.assertFalse
import static org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class TaggableAPITest extends CayenneIshTestCase {

	private ICayenneService cayenneService

    @Before
    void setup() throws Exception {
		wipeTables()

        cayenneService = injector.getInstance(ICayenneService.class)

        InputStream st = TaggableAPITest.class.getClassLoader().getResourceAsStream("ish/oncourse/server/cayenne/glue/TaggableAPITestDataSet.xml")

        FlatXmlDataSetBuilder builder = new FlatXmlDataSetBuilder()
        builder.setColumnSensing(true)
        FlatXmlDataSet dataSet = builder.build(st)

        ReplacementDataSet rDataSet = new ReplacementDataSet(dataSet)
        rDataSet.addReplacementObject("[null]", null)

        executeDatabaseOperation(rDataSet)
        super.setup()

    }

	//cleanup was added to avoid MySQLIntegrityConstraintViolationException during the deleting from table 'Node'
	@After
    void tearDown() {
		wipeTables()
    }
	
	@Test
    void testHasTag() {
		List<Course> courses = cayenneService.getNewContext().select(SelectQuery.query(Course.class))
        Course course = courses.get(0)
        // we can say that if a user specifies a string which contains the "/" char,
		// then it must be a full path (eg. starts with 'Subjects')
		assertTrue(course.hasTag("Subjects/Health & Wellbeing/Personal-Development"))
        assertTrue(course.hasTag("/Subjects/Health & Wellbeing/Personal-Development/"))
        assertFalse(course.hasTag("Health & Wellbeing/Personal-Development"))
        assertFalse(course.hasTag("Subjects/Health & Wellbeing"))
        //else only checking for the presence of some tag with the right name
		assertTrue(course.hasTag("Personal-Development"))
    }

	@Test
    void testHasTagWithChildren(){
		List<Course> courses = cayenneService.getNewContext().select(SelectQuery.query(Course.class))
        Course course = courses.get(0)
        //course has one Tag with name 'Personal-Development'

		// we can say that if a user specifies a string which contains the "/" char,
		// then it must be a full path (eg. starts with 'Subjects')
		assertTrue(course.hasTag("Subjects/Health & Wellbeing", true))
        assertTrue(course.hasTag("/Subjects/Health & Wellbeing/", true))
        assertFalse(course.hasTag("Health & Wellbeing/Personal-Development", true))
        assertTrue(course.hasTag("Subjects/Health & Wellbeing", true))
        assertTrue(course.hasTag("Personal-Development", true))
        assertTrue(course.hasTag("Subjects", true))
        assertTrue(course.hasTag("Health & Wellbeing/", true))

        //next will work the same as 'hasTag()' with one parameter
		assertTrue(course.hasTag("/Subjects/Health & Wellbeing/Personal-Development/", false))
        assertFalse(course.hasTag("Subjects/Health & Wellbeing", false))
    }
	
	@Test
    void testAddTag() {
		List<Course> courses = cayenneService.getNewContext().select(SelectQuery.query(Course.class))
        Course course = courses.get(0)

        //is not allowed to add tags which do not have special TagRequirement (Enrolment's tag can not be added to a Course)
		assertFalse(course.addTag("Employment Status/Contractor"))

        //try to add already added tag
		assertFalse(course.addTag("Subjects/Health & Wellbeing/Personal-Development"))

        //check that other tag is not added yet
		assertFalse(course.hasTag("Subjects/Computing, Business & Professional/The Law & You"))
        //add this one
		assertTrue(course.addTag("Subjects/Computing, Business & Professional/The Law & You"))
        //check that tag was added successfully
		assertTrue(course.hasTag("Subjects/Computing, Business & Professional/The Law & You"))

        course.getContext().commitChanges()

        Expression expression = TagRelation.ENTITY_IDENTIFIER.eq(TaggableClasses.COURSE.getDatabaseValue())
				.andExp(TagRelation.ENTITY_ANGEL_ID.eq(course.getId()))
				.andExp(TagRelation.TAG.dot(Tag.ID).eq(212L))
        assertEquals(1,course.getContext().performQuery(new SelectQuery<>(TagRelation.class, expression)).size())

    }

	@Test
    void testRemoveTag() {
		List<Course> courses = cayenneService.getNewContext().select(SelectQuery.query(Course.class))
        Course course = courses.get(0)

        //try to delete tag which is not relate to course
		assertFalse(course.removeTag("Subjects/Computing, Business & Professional/The Law & You"))

        //try to delete tag which is relate to course
		assertTrue(course.removeTag("Subjects/Health & Wellbeing/Personal-Development"))
        //make sure that tag was really deleted
		assertFalse(course.hasTag("Subjects/Health & Wellbeing/Personal-Development"))

        course.getContext().commitChanges()

        Expression expression = TagRelation.ENTITY_IDENTIFIER.eq(TaggableClasses.COURSE.getDatabaseValue()).andExp(TagRelation.ENTITY_ANGEL_ID.eq(course.getId()))
        assertEquals(0,course.getContext().performQuery(new SelectQuery<>(TagRelation.class, expression)).size())

    }
	
}
