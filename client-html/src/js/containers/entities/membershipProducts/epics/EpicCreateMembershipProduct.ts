/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { Epic } from "redux-observable";

import { initialize } from "redux-form";
import { MembershipProduct } from "@api/model";
import * as EpicUtils from "../../../../common/epics/EpicUtils";
import { CREATE_MEMBERSHIP_PRODUCT_ITEM, CREATE_MEMBERSHIP_PRODUCT_ITEM_FULFILLED } from "../actions";
import { FETCH_SUCCESS } from "../../../../common/actions";
import FetchErrorHandler from "../../../../common/api/fetch-errors-handlers/FetchErrorHandler";
import {
  clearListNestedEditRecord,
  GET_RECORDS_REQUEST,
  setListSelection
} from "../../../../common/components/list-view/actions";
import membershipProductService from "../services/MembershipProductService";
import { LIST_EDIT_VIEW_FORM_NAME } from "../../../../common/components/list-view/constants";
import { processCustomFields } from "../../customFieldTypes/utils";

let savedItem: MembershipProduct;

const request: EpicUtils.Request = {
  type: CREATE_MEMBERSHIP_PRODUCT_ITEM,
  getData: payload => {
    savedItem = payload.membershipProduct;
    processCustomFields(payload.membershipProduct);
    return membershipProductService.createMembershipProduct(payload.membershipProduct);
  },
  processData: () => [
      {
        type: CREATE_MEMBERSHIP_PRODUCT_ITEM_FULFILLED
      },
      {
        type: FETCH_SUCCESS,
        payload: { message: "Membership Product Record created" }
      },
      {
        type: GET_RECORDS_REQUEST,
        payload: { entity: "MembershipProduct" }
      },
      setListSelection([]),
      clearListNestedEditRecord(0),
      initialize(LIST_EDIT_VIEW_FORM_NAME, null)
    ],
  processError: response => [
    ...FetchErrorHandler(response, "Membership Product Record was not created"),
    initialize(LIST_EDIT_VIEW_FORM_NAME, savedItem)
  ]
};

export const EpicCreateMembershipProduct: Epic<any, any> = EpicUtils.Create(request);
