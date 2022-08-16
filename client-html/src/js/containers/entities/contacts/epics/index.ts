/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { combineEpics } from "redux-observable";
import { EpicGetContact } from "./EpicGetContact";
import { EpicGetMergeContacts } from "./EpicGetMergeContacts";
import { EpicPostMergeContacts } from "./EpicPostMergeContacts";
import { EpicGetContactsRelationTypes } from "./EpicGetContactsRelationTypes";
import { EpicGetContactsConcessionTypes } from "./EpicGetContactsConcessionTypes";
import { EpicGetContactsTaxTypes } from "./EpicGetContactsTaxTypes";
import { EpicVerifyUSI } from "./EpicVerifyUSI";
import { EpicGetContactTags } from "./EpicGetContactTags";
import { EpicGetContactEnrolments } from "./EpicGetContactEnrolments";
import { EpicGetContactPriorLearnings } from "./EpicGetContactPriorLearnings";
import { EpicGetContactOutcomes } from "./EpicGetContactOutcomes";
import { EpicGetContactCertificates } from "./EpicGetContactCertificates";
import { EpicGetContactsStoredCC } from "./EpicGetContactsStoredCC";

export const EpicContacts = combineEpics(
  EpicGetMergeContacts,
  EpicPostMergeContacts,
  EpicGetContact,
  EpicGetContactEnrolments,
  EpicGetContactPriorLearnings,
  EpicGetContactOutcomes,
  EpicGetContactCertificates,
  EpicGetContactsRelationTypes,
  EpicGetContactsConcessionTypes,
  EpicGetContactsTaxTypes,
  EpicVerifyUSI,
  EpicGetContactTags,
  EpicGetContactsStoredCC
);