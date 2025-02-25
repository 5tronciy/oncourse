/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import React from "react";
import clsx from "clsx";
import { change, Field, Validator } from "redux-form";
import Search from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { StyledCheckbox } from "../../../common/components/form/formFields/CheckboxField";
import { FormTextField } from "../../../common/components/form/formFields/TextField";
import { formatCurrency } from "../../../common/utils/numbers/numbersNormalizing";
import { NoArgFunction } from "../../../model/common/CommonFunctions";
import { AppTheme } from "../../../model/common/Theme";
import { makeAppStyles } from "../../../common/styles/makeStyles";

const styles = (theme: AppTheme) => createStyles({
  headerRoot: {
    background: "transparent"
  },
  contentRoot: {
    paddingTop: 0,
    "&:last-child": {
      paddingBottom: theme.spacing(4),
      paddingTop: 0
    }
  }
});

interface Props {
  classes?: any;
  heading?: string;
  subHeading?: React.ReactNode;
  name?: string;
  placeholder?: string;
  items?: any[];
  SelectedItemView?: any;
  onFocus?: any;
  form?: string;
  dispatch?: any;
  onSearch?: (name: string, value: string) => void;
  onClearSearch?: NoArgFunction;
  onDeleteSelectedItem?: any;
  openRow?: any;
  value?: any;
  showArrowButton?: boolean;
  disabled?: boolean;
  validate?: Validator;
}

const HeaderField: React.FC<Props> = props => {
  const {
    classes,
    children,
    form,
    dispatch,
    heading,
    subHeading,
    SelectedItemView,
    name,
    placeholder,
    onFocus,
    onSearch,
    onClearSearch,
    value,
    showArrowButton,
    disabled,
    validate
  } = props;

  const handleTextChange = value => {
    if (value.trim() === "" && onClearSearch) {
      onClearSearch();
    }
    if (onSearch) {
      onSearch(name, value);
    }
  };

  const onClear = () => {
    dispatch(change(form, name, ""));

    if (onClearSearch) {
      onClearSearch();
    }
  };

  return (
    <Card classes={{ root: "overflow-visible" }} elevation={0}>
      <CardHeader
        title={(
          <div className="centeredFlex">
            <div className="secondaryHeading flex-fill">{heading}</div>
            {subHeading && <Typography variant="body2">{subHeading}</Typography>}
          </div>
        )}
        classes={{ root: classes.headerRoot }}
      />
      <CardContent classes={{ root: classes.contentRoot }}>
        {children || (
          <Field
            name={name}
            placeholder={placeholder}
            component={FormTextField}
            disabled={disabled}
            onFocus={onFocus}
            onChange={handleTextChange}
            InputProps={{
              startAdornment: !showArrowButton && (
                <Search className="inputAdornmentIcon textSecondaryColor mr-1" />
              ),
              endAdornment: value && value[name] && (
                <>
                  {showArrowButton ? (
                    <IconButton className="closeAndClearButton" onClick={onClear}>
                      <ArrowForward className="inputAdornmentIcon" />
                    </IconButton>
                  ) : (
                    <IconButton className="closeAndClearButton" onClick={onClear}>
                      <Close className="inputAdornmentIcon" />
                    </IconButton>
                  )}
                </>
              )
            }}
            validate={validate}
          />
        )}
        <div className="mt-2">
          {SelectedItemView}
        </div>
      </CardContent>
    </Card>
  );
};

const useHeaderTypoStyles = makeAppStyles()(() => ({
  checkboxRoot: {
    width: 19,
    height: 19,
    marginLeft: 0,
    padding: 0,
    "& svg": {
      width: "0.8em",
      height: "0.8em"
    }
  }
}));

interface HeaderFieldTypoProps {
  title: React.ReactNode;
  amount: number;
  currencySymbol: string;
  disabled?: boolean;
  activeField?: string;
  field?: string;
  onClick?: any;
  caption?: any,
  className?: any;
  checkbox?: boolean;
  checkboxChecked?: boolean;
  disabledCheckbox?: boolean;
  onCheckboxClick?: (e: any) => void;
}

export const HeaderFieldTypo = React.memo<HeaderFieldTypoProps>(props => {
  const {
    className,
    title,
    caption,
    activeField,
    field,
    onClick,
    amount,
    currencySymbol,
    disabled,
    checkbox,
    checkboxChecked,
    disabledCheckbox,
    onCheckboxClick
  } = props;

  const { classes } = useHeaderTypoStyles();

  return (
    <div
      className={clsx("centeredFlex cursor-pointer relative", className)}
      onClick={!disabled ? onClick : () => {}}
    >
      {checkbox && (
        <StyledCheckbox
          disabled={disabled || disabledCheckbox}
          onClick={onCheckboxClick}
          checked={checkboxChecked}
          className={classes.checkboxRoot}
        />
      )}
      <Typography
        className={clsx(
          "centeredFlex flex-fill",
          {
            fontWeight600: activeField === field,
            selectedItemArrow: activeField === field
          },
          { "disabled": disabled }
        )}
        variant="body2"
        component="div"
      >
        <div className="flex-fill">
          <span className="d-flex">{title}</span>
          {caption && (
            <Typography variant="caption">
              {caption}
            </Typography>
          )}
        </div>
        {" "}
        <div className="money">{formatCurrency(amount, currencySymbol)}</div>
      </Typography>
    </div>
  );
});

export default withStyles(styles)(HeaderField);
