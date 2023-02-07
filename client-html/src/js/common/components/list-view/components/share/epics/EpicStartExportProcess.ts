/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { Epic } from "redux-observable";

import { ExportRequest, OutputType } from "@api/model";
import * as EpicUtils from "../../../../../epics/EpicUtils";
import ExportService from "../services/ExportService";
import { getExportResult, getExportTemplates, POST_EXPORT_REQUEST } from "../actions";
import { clearProcess, START_PROCESS, UPDATE_PROCESS } from "../../../../../actions";
import FetchErrorHandler from "../../../../../api/fetch-errors-handlers/FetchErrorHandler";

const request: EpicUtils.Request<any, { exportRequest: ExportRequest; outputType: OutputType, isClipboard: boolean }> = {
  type: POST_EXPORT_REQUEST,
  hideLoadIndicator: true,
  getData: ({ exportRequest }) => ExportService.runExport(exportRequest),
  processData: (processId: string, state, { exportRequest: { entityName, createPreview }, outputType, isClipboard }) => [
      {
        type: UPDATE_PROCESS,
        payload: { processId }
      },
      {
        type: START_PROCESS,
        payload: {
          processId,
          actions: [
            ...(createPreview ? [getExportTemplates(entityName)] : []),
            getExportResult(entityName, processId, outputType, isClipboard)
          ]
        }
      }
    ],
  processError: response => [
    clearProcess(),
    ...FetchErrorHandler(response)
  ]
};

export const EpicStartExportProcess: Epic<any, any> = EpicUtils.Create(request);
