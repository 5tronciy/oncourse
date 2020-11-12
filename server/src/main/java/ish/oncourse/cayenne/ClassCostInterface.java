/*
 * Copyright ish group pty ltd 2020.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License version 3 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 */
package ish.oncourse.cayenne;

import ish.common.types.ClassCostFlowType;
import ish.common.types.ClassCostRepetitionType;
import ish.math.Money;
import ish.messaging.ICourseClass;
import ish.messaging.ICourseClassTutor;
import ish.messaging.ITax;

import java.math.BigDecimal;
import java.util.Date;

/**
 */
public interface ClassCostInterface<C extends ICourseClass, D extends IDiscountCourseClass> {

	ICourseClass getCourseClass();

	void setCourseClass(C courseClass);

	ClassCostRepetitionType getRepetitionType();

	void setRepetitionType(ClassCostRepetitionType type);

	BigDecimal getUnitCount();

	void setUnitCount(BigDecimal unitCount);

	Money getPerUnitAmountExTax();

	BigDecimal getOnCostRate();

	Money getMaximumCost();

	Money getMinimumCost();

	Integer getSessionCount(Date until);

	BigDecimal getSessionPayableHours(Date until);

	ClassCostFlowType getFlowType();

	void setFlowType(ClassCostFlowType type);

	int getSessionsCountForTutor();

	BigDecimal getCurrentOncostRate();

	Boolean getInvoiceToStudent();

	Boolean getPayableOnEnrolment();

	int getPersistenceState();

	Boolean getIsSunk();

	IDiscountCourseClass getDiscountCourseClass();

	void setDiscountCourseClass(D discountCourseClass);

	ITax getTax();

	ICourseClassTutor getTutorRole();

	void setDescription(String description);
}
