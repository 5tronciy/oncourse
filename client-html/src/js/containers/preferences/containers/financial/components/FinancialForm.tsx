/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import * as React from "react";
import {
  Form, getFormInitialValues, initialize, reduxForm
} from "redux-form";
import { connect } from "react-redux";
import isEmpty from "lodash.isempty";
import { AccountType } from "@api/model";
import Grid from "@mui/material/Grid";
import Hidden from "@mui/material/Hidden";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormField from "../../../../../common/components/form/formFields/FormField";
import * as Model from "../../../../../model/preferences/Financial";
import { currency, postPrepaidFees } from "../ListItems";
import { validateMultipleMandatoryFields } from "../../../../../common/utils/validation";
import { FormModelSchema } from "../../../../../model/preferences/FormModelShema";
import RouteChangeConfirm from "../../../../../common/components/dialog/confirm/RouteChangeConfirm";
import { State } from "../../../../../reducers/state";
import { getManualLink } from "../../../../../common/utils/getManualLink";
import { PREFERENCES_AUDITS_LINK } from "../../../constants";
import { getAccountsList } from "../../../utils";
import { onSubmitFail } from "../../../../../common/utils/highlightFormErrors";
import AppBarContainer from "../../../../../common/components/layout/AppBarContainer";
import { ACCOUNT_DEFAULT_INVOICELINE_ID } from "../../../../../constants/Config";
const manualUrl = getManualLink("generalPrefs_financial");

class FinancialBaseForm extends React.Component<any, any> {
  private formModel: FormModelSchema;

  constructor(props) {
    super(props);

    // Initializing form with values
    if (!isEmpty(props.formData)) {
      props.dispatch(initialize("FinancialForm", props.formData));
    }

    this.formModel = props.formatModel(Model);
  }

  componentDidUpdate(prevProps) {
    const {formData, dispatch, initialized, initialValues, defaultInvoiceLineAccount} = this.props;

    // Initializing form with values
    if (!isEmpty(formData) && !initialized) {
      dispatch(initialize("FinancialForm", formData));
    }

    if (initialValues && (initialValues.defaultInvoiceLineAccount !== defaultInvoiceLineAccount)) {
      dispatch(initialize("FinancialForm", {...formData, defaultInvoiceLineAccount}));
    }
  }

  public render() {
    const {
      handleSubmit, onSave, accounts = [], dirty, data, invalid, form, formRoleName
    } = this.props;


    return (
      <Form className="container" onSubmit={handleSubmit(onSave)} role={formRoleName}>
        <RouteChangeConfirm form={form} when={dirty}/>

        <AppBarContainer
          values={data}
          manualUrl={manualUrl}
          getAuditsUrl={PREFERENCES_AUDITS_LINK}
          disabled={!dirty}
          invalid={invalid}
          title="Financial"
          disableInteraction
          createdOn={values => values.created}
          modifiedOn={values => values.modified}
        >
          <Grid container columnSpacing={3} rowSpacing={2}>
            <Grid item sm={8} xs={12}>
              <FormField
                type="multilineText"
                name={this.formModel.PaymentInfo.uniqueKey}
                label="Invoice remittance instructions"
                              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" className="heading mb-2 mt-1">
                Default accounts
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormField
                type="select"
                name={this.formModel.AccountDebtors.uniqueKey}
                label="Debtors (Asset)"
                items={getAccountsList(accounts, AccountType.asset)}
                              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormField
                type="select"
                name={this.formModel.AccountBank.uniqueKey}
                label="Bank (Asset)"
                items={getAccountsList(accounts, AccountType.asset)}
                              />
            </Grid>

            <Hidden smDown>
              <Grid item md={4} />
            </Hidden>

            <Grid item xs={12} sm={6} md={4}>
              <FormField
                type="select"
                name={this.formModel.AccountTax.uniqueKey}
                label="Tax (Liability)"
                items={getAccountsList(accounts, AccountType.liability)}
                              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormField
                type="select"
                name={this.formModel.AccountStudentEnrolments.uniqueKey}
                label="Student enrolments (Income)"
                items={getAccountsList(accounts, AccountType.income)}
                              />
            </Grid>

            <Hidden smDown>
              <Grid item md={4} />
            </Hidden>

            <Grid item xs={12} sm={6} md={4}>
              <FormField
                type="select"
                name={this.formModel.AccountPrepaidFees.uniqueKey}
                label="Prepaid fees account (Liability)"
                items={getAccountsList(accounts, AccountType.liability)}
                              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormField
                type="select"
                name={this.formModel.AccountPrepaidFeesPostAt.uniqueKey}
                label="Post prepaid fees (When)"
                items={postPrepaidFees}
                              />
            </Grid>

            <Hidden smDown>
              <Grid item md={4} />
            </Hidden>

            <Grid item xs={12} sm={6} md={4}>
              <FormField
                type="select"
                name={this.formModel.AccountVoucherLiability.uniqueKey}
                label="Voucher liability account (Liability)"
                items={getAccountsList(accounts, AccountType.liability)}
                />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormField
                type="select"
                name={this.formModel.AccountVoucherUnderpayment.uniqueKey}
                label="Default voucher underpayment account"
                items={getAccountsList(accounts, AccountType.expense)}
                              />
            </Grid>

            <Hidden smDown>
              <Grid item sm={6} md={4} />
            </Hidden>

            <Grid item xs={12} sm={6} md={4}>
              <FormField
                type="select"
                name="defaultInvoiceLineAccount"
                label="Default invoice line income account"
                items={getAccountsList(accounts, AccountType.income)}
                debounced={false}
                              />
            </Grid>

            <Hidden smDown>
              <Grid item md={4} />
            </Hidden>

            <Grid item xs={12} sm={8} className="mb-2">
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" className="heading mb-2 mt-1">
                Other
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormField
                type="select"
                name={this.formModel.AccountDefaultCurrency.uniqueKey}
                label="Default currency"
                items={currency}
                              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormField
                type="number"
                name={this.formModel.AccountInvoiceTerms.uniqueKey}
                label="Default invoice terms (days)"
                              />
            </Grid>
          </Grid>
        </AppBarContainer>
      </Form>
    );
  }
}

const mapStateToProps = (state: State) => ({
  initialValues: getFormInitialValues("FinancialForm")(state),
  defaultInvoiceLineAccount: state.userPreferences[ACCOUNT_DEFAULT_INVOICELINE_ID]
});

const FinancialForm = reduxForm({
  form: "FinancialForm",
  validate: validateMultipleMandatoryFields,
  onSubmitFail
})(connect<any, any, any>(mapStateToProps, null)(FinancialBaseForm));

export default FinancialForm;