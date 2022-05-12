/*
 * Copyright ish group pty ltd 2022.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License version 3 as published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 */
import React, {
 useCallback, useEffect, useMemo, useState 
} from "react";
import { createStringEnum } from "@api/model";
import { BaseFieldProps, Field, WrappedFieldProps } from "redux-form";
import debounce from "lodash.debounce";
import { validateSingleMandatoryField } from "../../../utils/validation";
import SimpleTagList from "../simpleTagListComponent/SimpleTagList";
import { CheckboxField } from "./CheckboxField";
import CodeEditorField from "./CodeEditorField";
import HeaderTextField from "./HeaderTextField";
import EditInPlaceDateTimeField from "./EditInPlaceDateTimeField";
import EditInPlaceDurationField from "./EditInPlaceDurationField";
import EditInPlaceField from "./EditInPlaceField";
import EditInPlaceFileField from "./EditInPlaceFileField";
import EditInPlaceMoneyField from "./EditInPlaceMoneyField";
import EditInPlaceQuerySelect from "./EditInPlaceQuerySelect";
import EditInPlaceRemoteDataSearchSelect from "./EditInPlaceRemoteDataSearchSelect";
import EditInPlaceSearchSelect from "./EditInPlaceSearchSelect";
import { FormSwitch } from "./Switch";
import { validateTagsList } from "../simpleTagListComponent/validateTagsList";
import EditInPlacePhoneField from "./EditInPlacePhoneField";

const EditInPlaceTypes = createStringEnum([
  "text",
  "multilineText",
  "headerText",
  "date",
  "dateTime",
  "duration",
  "time",
  "file",
  "money",
  "password",
  "aql",
  "select",
  "searchSelect",
  "remoteDataSearchSelect",
  "number",
  "persent",
  "code",
  "checkbox",
  "switch",
  "stub",
  "tags",
  "phone"
]);

interface Props extends Partial<WrappedFieldProps> {
  type?: keyof typeof EditInPlaceTypes;
  required?: boolean;
}

const FormFieldBase = React.forwardRef<any, Props>(({
 type,
 required,
 ...rest
}, ref) => {
  // TODO: make redux form onChange handlers work correct with this update
  // const [value, setValue] = useState(rest.input?.value);
  //
  // const debounceChange = useCallback(debounce(rest.input.onChange, 600), [rest.input.onChange]);
  //
  // const debounceBlur = useCallback(debounce(rest.input.onBlur, 600), [rest.input.onBlur]);
  //
  // const inputProxy = useMemo(() => ({
  //   ...rest.input || {},
  //   value,
  //   onChange: e => {
  //     setValue(e.target ? e.target.value : e);
  //     debounceChange(e);
  //   },
  //   onBlur: e => {
  //     setValue(e.target ? e.target.value : e);
  //     debounceBlur(e);
  //   },
  // }), [value, rest.input]);
  //
  // useEffect(() => {
  //   if (rest.input?.value !== value) {
  //     setValue(rest.input?.value);
  //   }
  // }, [rest.input?.value]);
  
  switch (type) {
    case "phone":
      // return <EditInPlacePhoneField ref={ref} {...rest} input={inputProxy}  />;
      return <EditInPlacePhoneField ref={ref} {...rest} />;
    case "duration":
      return <EditInPlaceDurationField ref={ref} {...rest} />;
    case "file":
      return <EditInPlaceFileField ref={ref} {...rest} />;
    case "money":
      return <EditInPlaceMoneyField ref={ref} {...rest} />;
    case "select":
      return <EditInPlaceField select ref={ref} {...rest} />;
    case "searchSelect":
      return <EditInPlaceSearchSelect ref={ref} {...rest} />;
    case "remoteDataSearchSelect":
      return <EditInPlaceRemoteDataSearchSelect ref={ref} {...rest} />;
    case "number":
      return <EditInPlaceField ref={ref} {...rest} type="number" />;
    case "persent":
      return <EditInPlaceField ref={ref} {...rest} type="percentage" />;
    case "date":
      return <EditInPlaceDateTimeField ref={ref} {...rest} type="date" />;
    case "time":
      return <EditInPlaceDateTimeField ref={ref} {...rest} type="time" />;
    case "dateTime":
      return <EditInPlaceDateTimeField ref={ref} {...rest} type="datetime" />;
    case "aql":
      return <EditInPlaceQuerySelect ref={ref} {...rest as any} />;
    case "headerText":
      return <HeaderTextField ref={ref} {...rest} />;
    case "code":
      return <CodeEditorField ref={ref} {...rest} />;
    case "password":
      return <EditInPlaceField ref={ref} {...rest} type="password" />;
    case "switch":
      return <FormSwitch ref={ref} {...rest} />;
    case "checkbox":
      return <CheckboxField ref={ref} {...rest} />;
    case "multilineText":
      return <EditInPlaceField ref={ref} {...rest} multiline />;
    case "stub":
      return <div className="invisible" ref={ref} />;
    case "tags":
      return <SimpleTagList ref={ref} {...rest} />;
    case "text":
    default:
      return <EditInPlaceField ref={ref} {...rest} />;
  }
});

type BaseProps = Props & BaseFieldProps<Props> & {
  [prop: string]: any;
  props?: any;
};

const FormField:React.FC<BaseProps> = React.forwardRef<any, BaseProps>(({
  name,
  required,
  validate,
  tags,
  type,
  ...rest
  }, ref) => {
  const validateTags = useCallback((...args: [any, any, any]) => validateTagsList(tags && tags.length > 0 ? tags : [], ...args), [tags]);
  
  const validateResolver = useMemo(() => {
    const result = [];
    if (required) {
      result.push(validateSingleMandatoryField);
    }
    if (validate) {
      result.push(validate);
    }
    if (type === "tags") {
      result.push(validateTags);
    }

    return result.length > 1 ? result : result.length ? result[0] : undefined;
  }, [validate, required, type, validateTags]);

  return (
    <Field
      type={type}
      name={name}
      component={FormFieldBase}
      validate={validateResolver}
      props={{
        ref
      }}
      tags={tags}
      {...rest}
    />
  );
});

export default FormField;

