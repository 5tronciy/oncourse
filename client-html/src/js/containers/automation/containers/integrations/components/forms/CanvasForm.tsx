/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import * as React from "react";
import {
 change, getFormValues, initialize, reduxForm 
} from "redux-form";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import FormField from "../../../../../../common/components/form/formFields/FormField";
import CustomAppBar from "../../../../../../common/components/layout/CustomAppBar";
import RouteChangeConfirm from "../../../../../../common/components/dialog/confirm/RouteChangeConfirm";

import { onSubmitFail } from "../../../../../../common/utils/highlightFormClassErrors";
import { State } from "../../../../../../reducers/state";
import { validateSingleMandatoryField } from "../../../../../../common/utils/validation";

class CanvasBaseForm extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    // Initializing form with values
    props.dispatch(initialize("CanvasForm", props.item));
  }

  componentDidMount() {
    const { location: { search }, dispatch } = this.props;

    if (search) {
      const params = new URLSearchParams(search);
      const code = params.get("code");
      const state = params.get("state");

      if (code && state) {
        const newValues = { ...JSON.parse(state) };
        newValues.fields.redirectUrl = window.location.origin;

        dispatch(initialize("CanvasForm", newValues));
        dispatch(change("CanvasForm", "fields.verificationCode", code));
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.item.id !== this.props.item.id) {
      // Reinitializing form with values
      this.props.dispatch(initialize("CanvasForm", this.props.item));
    }
  }

  configure = () => {
    const { values } = this.props;
    this.setState({
      loading: true
    });

    window.open(
      // eslint-disable-next-line max-len
      `https://${values.fields.baseUrl}/login/oauth2/auth?client_id=${values.fields.clientToken}&response_type=code&state=${JSON.stringify(values)}&redirect_uri=${window.location.href}`,
      "_self"
    );
  };

  render() {
    const {
     handleSubmit, onSubmit, AppBarContent, dirty, item, values, form
    } = this.props;

    const { loading } = this.state;

    const configured = values && values.fields.verificationCode;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {dirty && <RouteChangeConfirm form={form} when={dirty} />}
        <CustomAppBar>
          <AppBarContent />
        </CustomAppBar>

        {
          !values?.id && (
            <FormField
              type="stub"
              name="fields.verificationCode"
              validate={validateSingleMandatoryField}
            />
          )
        }

        <FormField disabled={configured} type="text" name="fields.baseUrl" label="Base url" fullWidth />
        <FormField disabled={configured} type="text" name="fields.accountId" label="Account id" fullWidth />
        <FormField disabled={configured} type="text" name="fields.clientToken" label="Client id" fullWidth />
        <FormField
          disabled={configured}
          type="password"
          name="fields.clientSecret"
          label="Client secret"
          fullWidth
        />
        {values && values.fields && values.fields.baseUrl && values.fields.clientToken && values.fields.clientSecret ? (
          configured
            ? (
              <Typography variant="caption">
                Canvas access has been set up
                {
                  item && item.id ? "" : ". Press Save to finish"
                }
              </Typography>
              )
            : (
              <>
                <Typography variant="caption">
                  Press ‘Configure’ to proceed with authorising onCourse to access your Canvas account.
                </Typography>
                <div>
                  <LoadingButton
                    loading={loading}
                    variant="contained"
                    className="mt-1"
                    onClick={this.configure}
                  >
                    Configure
                  </LoadingButton>
                </div>
              </>
            )
      ) : (
        <Typography variant="caption">Fill all fields to proceed proceed with authorising</Typography>
      )}

      </form>
    );
  }
}

const mapStateToProps = (state: State) => ({
  values: getFormValues("CanvasForm")(state)
});

export const CanvasForm = reduxForm({
  form: "CanvasForm",
  onSubmitFail
})(connect<any, any, any>(mapStateToProps, null)(CanvasBaseForm));
