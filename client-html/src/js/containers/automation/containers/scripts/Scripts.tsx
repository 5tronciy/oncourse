/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormInitialValues, getFormValues, initialize, reduxForm } from "redux-form";
import { withRouter } from "react-router";
import { ScheduleType, Script } from "@api/model";
import { onSubmitFail } from "../../../../common/utils/highlightFormClassErrors";
import { State } from "../../../../reducers/state";
import ScriptsForm from "./containers/ScriptsForm";
import { createScriptItem, deleteScriptItem, getScriptItem as getScriptItemAction, saveScriptItem } from "./actions";
import { SCRIPT_EDIT_VIEW_FORM_NAME } from "./constants";
import { mapSelectItems } from "../../../../common/utils/common";
import { setNextLocation as setNextLocationAction, showConfirm } from "../../../../common/actions";

const ScheduleTypeItems = Object.keys(ScheduleType).map(mapSelectItems);

const Initial: Script = { enabled: false, content: "", keyCode: null };

const ScriptsBase = React.memo<any>(props => {
  const {
    history,
    pdfReports,
    pdfBackgrounds,
    match: {
      params: { id }
    },
    ...rest
  } = props;

  const dispatch = useDispatch();

  const scripts = useSelector((state: State) => state.automation.script.scripts);
  const getScriptItem = useCallback((id: number) => dispatch(getScriptItemAction(id)), []);

  const values = useSelector((state: State) => getFormValues(SCRIPT_EDIT_VIEW_FORM_NAME)(state));
  const initialValues = useSelector((state: State) => getFormInitialValues(SCRIPT_EDIT_VIEW_FORM_NAME)(state));
  const formsState = useSelector((state: State) => state.form);
  const emailTemplates = useSelector((state: State) => state.automation.emailTemplate.emailTemplates);
  const nextLocation = useSelector((state: State) => state.nextLocation);
  const timeZone = useSelector((state: State) => state.automation.timeZone);
  const onSave = useCallback((id, script, method, viewMode) => dispatch(saveScriptItem(id, script, method, viewMode)), []);
  const onCreate = useCallback((script, viewMode) => dispatch(createScriptItem(script, viewMode)), []);
  const onDelete = useCallback((id: number) => dispatch(deleteScriptItem(id)), []);
  const openConfirm = useCallback(props => dispatch(showConfirm(props)), []);
  const setNextLocation = useCallback((nextLocation: string) => dispatch(setNextLocationAction(nextLocation)), []);
  const hasUpdateAccess = true;

  const [isNew, setIsNew] = useState<boolean>(false);

  useEffect(() => {
    const newId = id === "new";

    if (!id && scripts.length) {
      history.push(`/automation/script/${scripts[0].id}`);
      return;
    }

    if (newId && !isNew) {
      setIsNew(true);
      dispatch(initialize(SCRIPT_EDIT_VIEW_FORM_NAME, Initial));
    }
    if (!newId && id) {
      getScriptItem(id);
      if (isNew) {
        setIsNew(false);
      }
    }
  }, [id, isNew, scripts]);

  return (
    <ScriptsForm
      ScheduleTypeItems={ScheduleTypeItems}
      dispatch={dispatch}
      isNew={isNew}
      form={SCRIPT_EDIT_VIEW_FORM_NAME}
      emailTemplates={emailTemplates}
      pdfReports={pdfReports}
      pdfBackgrounds={pdfBackgrounds}
      history={history}
      timeZone={timeZone}
      values={values}
      initialValues={initialValues}
      formsState={formsState}
      nextLocation={nextLocation}
      onSave={onSave}
      onCreate={onCreate}
      onDelete={onDelete}
      openConfirm={openConfirm}
      setNextLocation={setNextLocation}
      hasUpdateAccess={hasUpdateAccess}
      {...rest}
    />
  );
});

export default reduxForm({
  form: SCRIPT_EDIT_VIEW_FORM_NAME,
  onSubmitFail
})(withRouter(ScriptsBase));
