import * as React from "react";
import { useState, useEffect, useCallback, memo } from "react";
import ClassNames from "clsx";
import { withRouter } from "react-router";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { withStyles, createStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { Form, FieldArray, reduxForm, SubmissionError, arrayRemove, change, initialize } from "redux-form";
import { CustomFieldType } from "@api/model";
import isEqual from "lodash.isequal";
import Fab from "@mui/material/Fab";

import FormSubmitButton from "../../../../../common/components/form/FormSubmitButton";
import CustomAppBar from "../../../../../common/components/layout/CustomAppBar";
import RouteChangeConfirm from "../../../../../common/components/dialog/confirm/RouteChangeConfirm";
import AppBarHelpMenu from "../../../../../common/components/form/AppBarHelpMenu";
import { onSubmitFail } from "../../../../../common/utils/highlightFormClassErrors";
import { formCommonStyles } from "../../../styles/formCommonStyles";
import CustomFieldsDeleteDialog from "./CustomFieldsDeleteDialog";
import CustomFieldsRenderer from "./CustomFieldsRenderer";
import { getManualLink } from "../../../../../common/utils/getManualLink";
import { idsToString } from "../../../../../common/utils/numbers/numbersNormalizing";
import { getCustomFields } from "../../../actions";
import { Fetch } from "../../../../../model/common/Fetch";
import uniqid from "../../../../../common/utils/uniqid";
import { State } from "../../../../../reducers/state";
import { setNextLocation } from "../../../../../common/actions";

const manualLink = getManualLink("generalPrefs_customFields");

const styles = () =>
  createStyles({
    dragIcon: {
      fill: "#e0e0e0"
    },
    container: {
      width: "100%"
    }
  });

const setOrder = items =>
  items.forEach((i, index) => {
    i.sortOrder = index;
  });

interface Props {
  data: any;
  classes: any;
  customFields: CustomFieldType[];
  created: Date;
  modified: Date;
  fetch: Fetch;
  handleSubmit: any;
  dirty: boolean;
  invalid: boolean;
  form: string;
  onDelete: (id: string) => void;
  onUpdate: (customFields: CustomFieldType[]) => void;
  history?: any;
}

const CustomFieldsBaseForm = memo<any>(props => {
  const { classes, handleSubmit, data, dirty, created, modified, invalid, form } = props;

  const dispatch = useDispatch();

  const [fieldToDelete, setFieldToDelete] = useState(null);

  const nextLocation: string = useSelector((state: State) => state.nextLocation);

  const setNext: (nextLocation: string) => void = useCallback(nextLocation => dispatch(setNextLocation(nextLocation)), []);

  let resolvePromise;

  let rejectPromise;

  let isPending: boolean;

  let onDeleteConfirm;

  useEffect(() => {
    props.dispatch(initialize("CustomFieldsForm", { types: props.customFields }));
  }, []);

  useEffect(() => {
    const { fetch } = props;

    if (isPending && fetch?.success === false && rejectPromise) {
      rejectPromise(fetch.formError);
    }

    if (isPending && fetch?.success && resolvePromise) {
      resolvePromise();
      isPending = false;
    }
  });

  const findIndex = id => props.data.types.findIndex(item => item.id === id);

  const getTouchedAndNew = items => {
    const fistNewItemIndex = items.findIndex(item => item.id === null);

    return fistNewItemIndex === -1
      ? items.filter((item, index) => !isEqual(item, props.customFields[index]))
      : [
          ...items.slice(0, fistNewItemIndex).filter((item, index) => item.id != props.customFields[index].id),
          ...items.slice(fistNewItemIndex, items.length)
        ];
  };

  const onSave = value => {
    isPending = true;

    setOrder(value.types);

    return new Promise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
      props.onUpdate(getTouchedAndNew(value.types));
    })
      .then(() => {
        const { history, data } = props;

        props.dispatch(initialize("CustomFieldsForm", data));
        props.dispatch(getCustomFields());

        nextLocation && history.push(nextLocation);
        setNext("");
      })
      .catch(error => {
        isPending = false;
        const errors: any = {
          types: []
        };

        if (error?.id) {
          const index = findIndex(error.id);
          errors.types[index] = { [error.propertyName]: error.errorMessage };
          throw new SubmissionError(errors);
        }
      });
  };

  const onAddNew = () => {
    const {
      data: { types }
    } = props;
    const item = {} as CustomFieldType & { uniqid: string };

    item.id = null;
    item.name = null;
    item.defaultValue = null;
    item.fieldKey = null;
    item.mandatory = false;
    item.uniqid = uniqid();

    const updated = [item, ...types];

    updated.forEach((field, index) => (field.sortOrder = index));

    dispatch(change("CustomFieldsForm", "types", updated));
    const domNode = document.getElementById("types[0].name");
    if (domNode) domNode.scrollIntoView({ behavior: "smooth" });
  };

  const onClickDelete = (item, index) => {
    const onConfirm = () => {
      if (item.id) {
        props.onDelete(item.id);
      } else {
        dispatch(arrayRemove("CustomFieldsForm", "types", index));
      }
    };

    if (!item.id) {
      onConfirm();
      return;
    }

    setFieldToDelete(item);
    onDeleteConfirm = onConfirm;
  };

  return (
    <>
      <CustomFieldsDeleteDialog setFieldToDelete={setFieldToDelete} item={fieldToDelete} onConfirm={onDeleteConfirm} />
      <Form className={classes.container} onSubmit={handleSubmit(onSave)} noValidate autoComplete="off">
        <RouteChangeConfirm form={form} when={dirty} />
        <CustomAppBar>
          <Grid container columnSpacing={3}>
            <Grid item xs={12} className={ClassNames("centeredFlex", "relative")}>
              <Fab
                type="button"
                size="small"
                color="primary"
                classes={{
                  sizeSmall: "appBarFab"
                }}
                onClick={() => onAddNew()}
              >
                <AddIcon />
              </Fab>
              <Typography variant="body1" color="inherit" noWrap className="appHeaderFontSize pl-2">
                Custom Fields
              </Typography>

              <div className="flex-fill" />

              {data && (
                <AppBarHelpMenu
                  created={created}
                  modified={modified}
                  auditsUrl={`audit?search=~"CustomFieldType" and entityId in (${idsToString(data.types)})`}
                  manualUrl={manualLink}
                />
              )}

              <FormSubmitButton disabled={!dirty} invalid={invalid} />
            </Grid>
          </Grid>
        </CustomAppBar>

        <Grid container columnSpacing={3} className={classes.marginTop}>
          <Grid item lg={10}>
            {data?.types && (
              <FieldArray name="types" component={CustomFieldsRenderer} dispatch={dispatch} onDelete={onClickDelete} classes={classes} />
            )}
          </Grid>
        </Grid>
      </Form>
    </>
  );
});

const CustomFieldsForm = reduxForm({
  onSubmitFail,
  form: "CustomFieldsForm"
})(withStyles(theme => ({ ...formCommonStyles(theme), ...styles() }))(withRouter(CustomFieldsBaseForm) as any));

export default CustomFieldsForm;
