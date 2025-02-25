/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { Epic } from "redux-observable";
import { ImportModel } from "@api/model";
import * as EpicUtils from "../../../../../common/epics/EpicUtils";
import {
  GET_IMPORT_TEMPLATE,
  GET_IMPORT_TEMPLATES_LIST,
  UPDATE_IMPORT_TEMPLATE,
  UPDATE_IMPORT_TEMPLATE_FULFILLED
} from "../actions/index";
import FetchErrorHandler from "../../../../../common/api/fetch-errors-handlers/FetchErrorHandler";
import ImportTemplatesService from "../services/ImportTemplatesService";
import { FETCH_SUCCESS } from "../../../../../common/actions";
import { State } from "../../../../../reducers/state";

const request: EpicUtils.Request<State, { importTemplate: ImportModel }> = {
  type: UPDATE_IMPORT_TEMPLATE,
  getData: ({ importTemplate }) => ImportTemplatesService.update(importTemplate.id, importTemplate),
  processData: (v, s, { importTemplate: { id } }) => [
      {
        type: UPDATE_IMPORT_TEMPLATE_FULFILLED
      },
      {
        type: GET_IMPORT_TEMPLATE,
        payload: id
      },
      {
        type: GET_IMPORT_TEMPLATES_LIST
      },
      {
        type: FETCH_SUCCESS,
        payload: { message: "Import template updated" }
      }
    ],
  processError: response => FetchErrorHandler(response, "Failed to update  import template")
};

export const EpicUpdateImportTemplate: Epic<any, any> = EpicUtils.Create(request);
