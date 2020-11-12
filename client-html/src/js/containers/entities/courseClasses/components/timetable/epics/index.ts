/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { combineEpics } from "redux-observable";
import { EpicGetCourseClassSessions } from "./EpicGetCourseClassSessions";
import { EpicPostCourseClassSessions } from "./EpicPostCourseClassSessions";

export const EpicCourseClassTimeTable = combineEpics(EpicGetCourseClassSessions, EpicPostCourseClassSessions);
