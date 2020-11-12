/*
 * Copyright ish group pty ltd. All rights reserved. http://www.ish.com.au No copying or use of this code is allowed without permission in writing from ish.
 */
package ish.oncourse.server.export.avetmiss

import static org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.Parameterized

@RunWith(Parameterized.class)
class AddressParserTest {


	private String input
    private String expectedBuilding
    private String expectedUnit
    private String expectedNumber
    private String expectedStreet

    AddressParserTest(String input, String expectedBuilding, String expectedUnit, String expectedNumber, String expectedStreet) {
		this.expectedBuilding = expectedBuilding
        this.expectedUnit = expectedUnit
        this.expectedNumber = expectedNumber
        this.expectedStreet = expectedStreet
        this.input = input
    }

	@Test
    void testParseAdress() throws Exception {
		AddressParser addressParser = new AddressParser(input)

        assertEquals("building", expectedBuilding, addressParser.getBuilding())
        assertEquals("unit", expectedUnit, addressParser.getUnit())
        assertEquals("number", expectedNumber, addressParser.getStreetNumber())
        assertEquals("street", expectedStreet, addressParser.getStreetName())
    }

	@Parameterized.Parameters(name= "{index}-- {0}")
    static Collection<Object[]> data() {
		Object[][] data = [
				[null, "", "", "", "not specified"],
				["", "", "", "", "not specified"],

				["30 Wilson St", "", "", "30", "Wilson St"],

				["3,30 Wilson St", "", "3", "30", "Wilson St"],
				["3-30 Wilson St", "", "3", "30", "Wilson St"],
				["3/30a Wilson St", "", "3", "30a", "Wilson St"],
				["3a-30 Wilson St", "", "3a", "30", "Wilson St"],
				["3a-30b Wilson St", "", "3a", "30b", "Wilson St"],
				["5/4 Halt Rd", "", "5", "4", "Halt Rd"],
				["3-30 Wilson St", "", "3", "30", "Wilson St"],
				["3- 30 Wilson St", "", "3", "30", "Wilson St"],
				["3 -30 Wilson St", "", "3", "30", "Wilson St"],
				["3 - 30 Wilson St", "", "3", "30", "Wilson St"],
				["3 30 Wilson St", "", "3", "30", "Wilson St"],
				["3/30, Wilson St", "", "3", "30", "Wilson St"],

				["Basement 30 Wilson St", "", "Basement", "30", "Wilson St"],

				["UNIT 1, LEVEL 3, 6 HILK AVE", "", "UNIT 1,LEVEL 3", "6", "HILK AVE"],
				["Building A UNIT 1, LEVEL 3, 6 HILK AVE", "Building A", "UNIT 1,LEVEL 3", "6", "HILK AVE"],
				["Building A UNIT 1a, LEVEL 3, 6b HILK AVE", "Building A", "UNIT 1a,LEVEL 3", "6b", "HILK AVE"],
				["Unit 3 30 Wilson St", "", "Unit 3", "30", "Wilson St"],
				["Shop 3, 30 Wilson St", "", "Shop 3", "30", "Wilson St"],
				["Building C 3/30 Wilson St", "Building C", "3", "30", "Wilson St"],
				["The Clouds, Wilson St", "The Clouds", "", "", "Wilson St"],
				["The Clouds, 6 Wilson St", "The Clouds", "", "6", "Wilson St"],
				["Wilson St", "", "", "", "Wilson St"],
				["Wilson   St", "", "", "", "Wilson St"],
				["Wilson St\n", "", "", "", "Wilson St"],
				["The Ponds,\n17 Market St ", "The Ponds", "", "17", "Market St"], // squish #21838
				["Unit 3\r\n17 Market  St", "", "Unit 3", "17", "Market St"],
				["Unit 3\r17 Market  St", "", "Unit 3", "17", "Market St"],
				["5/4 Halt Rd\r\n", "", "5", "4", "Halt Rd"],
				["Unit 3\n17 Market  St", "", "Unit 3", "17", "Market St"], // squish #21838

				["30 Wilson St\nPO Box 149", "", "", "", "30 Wilson St PO Box 149"],
				["77 Frasers Rd Po Box 140", "", "", "", "77 Frasers Rd Po Box 140"],
				["PO BOX 1234", "", "", "", "not specified"],
				["Post Office Box 738", "", "", "", "not specified"],
				["P.O.Box Po Box 92", "", "", "", "not specified"],
				["P.O BOX 922", "", "", "", "not specified"],
				["P.O. BOX 324", "", "", "", "not specified"],
				["GPO 456", "", "", "", "not specified"],
				["GO BOX 434", "", "", "", "not specified"],
				["go box 798", "", "", "", "not specified"],
				["(MOVING HOUSES)  Po Box 571", "MOVING HOUSES", "", "", "not specified"],
				["The Hermitage, 1 Gorod Cred", "The Hermitage", "", "1", "Gorod Cred"],
				["The Cage, 12 Port Veil", "The Cage", "", "12", "Port Veil"]
		]
        return Arrays.asList(data)
    }
}
