/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import * as React from "react";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormValues } from "redux-form";
import { CustomFieldType } from "@api/model";
import { getCustomFields } from "../../actions";
import { State } from "../../../../reducers/state";
import { Fetch } from "../../../../model/common/Fetch";
import CustomFieldsForm from "./components/CustomFieldsForm";
import getTimestamps from "../../../../common/utils/timestamps/getTimestamps";

const CustomFields = () => {
  useEffect(() => {
    getFields();
  }, []);

  const customFields: CustomFieldType[] = useSelector((state: State) => state.preferences.customFields);

  const fetch: Fetch = useSelector((state: State) => state.fetch);

  const data = useSelector((state: State) => getFormValues("CustomFieldsForm")(state));

  const timestamps: Date[] = useSelector((state: State) => state.preferences.customFields && getTimestamps(state.preferences.customFields));

  const dispatch = useDispatch();

  const getFields: () => void = useCallback(() => dispatch(getCustomFields()), []);

  const updateCustomFields: (customFields: CustomFieldType[]) => void = useCallback(
    (customFields: CustomFieldType[]): void => dispatch(updateCustomFields(customFields)),
    []
  );

  const deleteCustomField: (id: string) => void = useCallback((id: string) => dispatch(deleteCustomField(id)), []);

  const created = timestamps && timestamps[0];
  const modified = timestamps && timestamps[1];

  const form = <CustomFieldsForm />;

  const componentForm = React.cloneElement(form, {
    created,
    modified,
    customFields,
    data,
    fetch,
    onUpdate: updateCustomFields,
    onDelete: deleteCustomField
  });

  return <div>{customFields && componentForm}</div>;
};

export default CustomFields;
