/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import * as React from "react";
import clsx from "clsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { change } from "redux-form";
import { FormControlLabel } from "@mui/material";
import { CustomFieldType, DataType, EntityType } from "@api/model";
import { CheckboxField } from "../../../../../common/components/form/formFields/CheckboxField";
import EditInPlaceDateTimeField from "../../../../../common/components/form/formFields/EditInPlaceDateTimeField";
import EditInPlaceField from "../../../../../common/components/form/formFields/EditInPlaceField";
import EditInPlaceMoneyField from "../../../../../common/components/form/formFields/EditInPlaceMoneyField";
import { validateEmail, validateURL } from "../../../../../common/utils/validation";
import { mapSelectItems, sortDefaultSelectItems } from "../../../../../common/utils/common";
import ListMapRenderer from "./ListMapRenderer";
import CustomField from "./CustomField";

export const EntityTypes = Object.keys(EntityType)
  .filter(val => isNaN(Number(val)))
  .map(mapSelectItems);

EntityTypes.sort(sortDefaultSelectItems);

export const DataTypes = Object.keys(DataType)
  .filter(val => !["Record", "File", "Message template"].includes(val))
  .map(mapSelectItems);

DataTypes.sort(sortDefaultSelectItems);

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const preventStarEnter = e => {
  if (e.key.match(/\*/)) {
    e.preventDefault();
  }
};

const onDragEnd = (result, items, dispatch) => {
  // dropped outside the list
  if (!result.destination) {
    return;
  }

  // dropped on the same position
  if (result.source.index === result.destination.index) {
    return;
  }

  const reordered = reorder(items, result.source.index, result.destination.index);

  dispatch(change("CustomFieldsForm", "types", reordered));

  setTimeout(
    () =>
      reordered.forEach((item: CustomFieldType, index: number) => {
        if (item.sortOrder !== index) {
          dispatch(change("CustomFieldsForm", `types[${index}].sortOrder`, index));
        }
      }),
    500
  );
};

const validateListMap = (value, dataType) => {
  let error;
  let fields = [];

  try {
    fields = JSON.parse(value);
  } catch (e) {
    console.error(e);
  }

  if (Array.isArray(fields)) {
    fields.forEach(f => {
      if (!f.value || (dataType === "Map" && !f.value.includes("*") && !f.label)) {
        error = "Options fields are invalid";
      }
    });
  } else {
    return "At least one option is required";
  }

  return error;
};

export const CustomFieldsResolver = React.memo<{ field: CustomFieldType & { uniqid: string }; classes: any }>(
  ({ classes, field, ...props }) => {
    switch (field.dataType) {
      case "Checkbox":
        return (
          <FormControlLabel
            className={clsx(classes.checkbox)}
            control={<CheckboxField {...props} stringValue color="primary" className={undefined} />}
            label="Checked by default"
          />
        );
      case "Date":
        return <EditInPlaceDateTimeField {...props} type="date" />;
      case "Date time":
        return <EditInPlaceDateTimeField {...props} type="datetime" />;
      case "Email":
        return <EditInPlaceField {...props} />;
      case "Long text":
        return <EditInPlaceField {...props} multiline />;
      case "List":
        return (
          <ListMapRenderer
            {...(props as any)}
            dataType={field.dataType}
            key={field.id || field.uniqid}
            label="Options"
            onKeyPress={preventStarEnter}
          />
        );
      case "Map":
        return <ListMapRenderer {...(props as any)} dataType={field.dataType} key={field.id || field.uniqid} label="Options" />;
      case "Money":
        return <EditInPlaceMoneyField {...props} />;
      case "URL":
      case "Text":
      default:
        return <EditInPlaceField {...props} />;
    }
  }
);

export const validateResolver = (value, allValues, _, name) => {
  const index = name.match(/\[(\d)]/);
  const root = index && (allValues.types[Number(index[1])] as CustomFieldType);

  if (!root) {
    return undefined;
  }

  switch (root.dataType) {
    case "Email":
      return validateEmail(value);
    case "URL":
      return validateURL(value);
    case "List":
    case "Map":
      return validateListMap(value, root.dataType);
  }

  return undefined;
};

const renderCustomFields = props => {
  const {
    fields,
    classes,
    onDelete,
    dispatch,
    meta: { form }
  } = props;

  const onAddOther = (index, checked) => {
    const field = fields.get(index);
    const value = field.defaultValue ? JSON.parse(field.defaultValue) : [];

    if (checked) {
      value.push({ value: "*" });
    } else {
      const otherIndex = value.findIndex(v => v.value === "*");
      if (otherIndex !== -1) {
        value.splice(otherIndex, 1);
      }
    }

    dispatch(change(form, `${fields.name}[${index}].defaultValue`, value.length ? JSON.stringify(value) : null));
  };

  const RowInVirtualList = props => {
    const { index, style } = props;
    const item = `${fields.name}[${index}]`;
    const field: CustomFieldType = fields.get(index);

    const isListOrMap = ["List", "Map"].includes(field.dataType);

    const onDataTypeChange = () => {
      dispatch(change(form, `${item}.defaultValue`, null));
    };

    return (
      <Draggable key={index} draggableId={String(index + 1)} index={index}>
        {provided => (
          <CustomField
            index={index}
            provided={provided}
            classes={classes}
            item={item}
            field={field}
            onDataTypeChange={onDataTypeChange}
            onDelete={onDelete}
            onAddOther={onAddOther}
            isListOrMap={isListOrMap}
            style={style}
          />
        )}
      </Draggable>
    );
  };

  const RowInFieldsMap = (item: string, index: number, fields): JSX.Element => {
    const field: CustomFieldType = fields.get(index);

    const isListOrMap = ["List", "Map"].includes(field.dataType);

    const onDataTypeChange = () => {
      dispatch(change(form, `${item}.defaultValue`, null));
    };

    return (
      <Draggable key={index} draggableId={String(index + 1)} index={index}>
        {provided => (
          <CustomField
            index={index}
            provided={provided}
            classes={classes}
            item={item}
            field={field}
            onDataTypeChange={onDataTypeChange}
            onDelete={onDelete}
            onAddOther={onAddOther}
            isListOrMap={isListOrMap}
          />
        )}
      </Draggable>
    );
  };

  return (
    <DragDropContext onDragEnd={result => onDragEnd(result, fields.getAll(), dispatch)}>
      <Droppable droppableId="droppableCustomFields">
        {provided => (
          <div ref={provided.innerRef} className={classes.container}>
            {fields.map(RowInFieldsMap)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default renderCustomFields;
