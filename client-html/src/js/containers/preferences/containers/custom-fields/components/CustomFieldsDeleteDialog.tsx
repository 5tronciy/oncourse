/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { CustomFieldType } from "@api/model";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormValues, initialize, InjectedFormProps, reduxForm } from "redux-form";
import Button from "@mui/material/Button";
import FormField from "../../../../../common/components/form/formFields/FormField";
import { stubFunction } from "../../../../../common/utils/common";
import { validateSingleMandatoryField } from "../../../../../common/utils/validation";
import { NoArgFunction } from "../../../../../model/common/CommonFunctions";
import { State } from "../../../../../reducers/state";

interface CustomFieldsDeleteDialogProps {
  item?: CustomFieldType;
  setFieldToDelete?: any;
  onConfirm?: NoArgFunction;
}

const FORM: string = "DELETE_CUSTOM_FIELD_FORM";

const initialValues = {
  customFieldName: ""
};

const validateName = (value, item) => {
  if (!item || !item.name || !value) return undefined;
  return item.name.toLowerCase() === value.toLowerCase() ? undefined : "Type in correct value";
};

const CustomFieldsDeleteDialog = React.memo<CustomFieldsDeleteDialogProps & InjectedFormProps>(props => {
  const { handleSubmit, item, setFieldToDelete, invalid, onConfirm = stubFunction } = props;

  const value: string | {} = useSelector((state: State) => getFormValues(FORM)(state));

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(initialize(FORM, initialValues));
  }, [item]);

  const onClose = useCallback(() => {
    setFieldToDelete(null);
  }, []);

  const onSubmit = useCallback(() => {
    setFieldToDelete(null);
    onConfirm();
  }, [value]);

  const validateCustomFieldName = useCallback(value => validateName(value, item), [item]);

  return (
    <Dialog open={Boolean(item)} onClose={onClose} fullWidth maxWidth="xs">
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <div className="heading pt-1">Delete custom field</div>
          <div className="centeredFlex pt-1">
            {item && (
              <Typography variant="body2">
                {`You are about to delete the custom field "${item.name}". This is permanent and you will lose all the data in that field.
                Type "${item.name}" in the box below to continue.`}
              </Typography>
            )}
          </div>
          <Grid item xs={12}>
            <FormField type="text" name="customFieldName" label="" validate={[validateSingleMandatoryField, validateCustomFieldName]} />
          </Grid>
        </DialogContent>
        <DialogActions className="p-3">
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={invalid}>
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

export default reduxForm<any, CustomFieldsDeleteDialogProps>({
  form: FORM
})(CustomFieldsDeleteDialog);
