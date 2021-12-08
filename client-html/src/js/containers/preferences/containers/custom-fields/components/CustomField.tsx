import * as React from "react";
import clsx from "clsx";
import { Field } from "redux-form";
import { FormControlLabel, Grid, Button, Collapse, Card } from "@mui/material";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { CustomFieldType } from "@api/model";
import { DraggableProvided } from "react-beautiful-dnd";
import { StyledCheckbox } from "../../../../../common/components/form/formFields/CheckboxField";
import FormField from "../../../../../common/components/form/formFields/FormField";
import { validateSingleMandatoryField, validateUniqueNamesInArray, validateRegex } from "../../../../../common/utils/validation";
import { DataTypes, EntityTypes, CustomFieldsResolver, validateResolver } from "./CustomFieldsRenderer";

type Props = {
  index: number;
  provided: DraggableProvided;
  classes: any;
  item: string;
  field?: CustomFieldType;
  onDataTypeChange?: () => void;
  onDelete?: (item, index) => void;
  onAddOther?: (index: number, checked: any) => void;
  isListOrMap?: boolean;
  style?: Object;
};

const CustomField = ({ index, provided, classes, item, field, onDataTypeChange, onDelete, onAddOther, isListOrMap, style }: Props) => {
  return (
    <div
      id={`custom-field-${index}`}
      key={index}
      ref={provided.innerRef}
      style={{ ...style, ...provided.draggableProps.style }}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Card className="card d-flex">
        <div className="centeredFlex mr-2">
          <DragIndicator className={clsx("dndActionIcon", classes.dragIcon)} />
        </div>

        <Grid container columnSpacing={3} spacing={2} className="relative">
          <Grid item xs={12}>
            <Grid container columnSpacing={3}>
              <Grid item xs={3}>
                <FormField
                  type="text"
                  name={`${item}.name`}
                  label="Name"
                  fullWidth
                  className={classes.field}
                  validate={[validateSingleMandatoryField, validateUniqueNamesInArray]}
                />
              </Grid>

              <Grid item xs={4}>
                <FormField
                  type="text"
                  name={`${item}.fieldKey`}
                  label="Custom field key"
                  fullWidth
                  disabled={field.id}
                  className={classes.field}
                  required
                />
              </Grid>

              <Grid item xs={4}>
                <FormField
                  type="select"
                  name={`${item}.dataType`}
                  label="Data Type"
                  items={DataTypes}
                  disabled={field.id}
                  onChange={onDataTypeChange}
                  className={classes.field}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={1}>
                <Button
                  size="small"
                  classes={{
                    root: classes.deleteButton
                  }}
                  onClick={() => onDelete(field, index)}
                >
                  Delete
                </Button>
              </Grid>

              <Grid item xs={3}>
                <FormField
                  type="select"
                  name={`${item}.entityType`}
                  label="Record Type"
                  items={EntityTypes}
                  disabled={field.id}
                  className={classes.field}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={4}>
                <FormControlLabel
                  className={classes.checkbox}
                  control={<FormField type="checkbox" name={`${item}.mandatory`} color="primary" value="true" fullWidth />}
                  label="Mandatory"
                />

                {field.dataType === "List" && (
                  <FormControlLabel
                    className={classes.checkbox}
                    control={
                      <StyledCheckbox
                        checked={field.defaultValue && field.defaultValue.includes("*")}
                        onChange={(e, checked) => onAddOther(index, checked)}
                        color="primary"
                      />
                    }
                    label="Add 'other' option"
                  />
                )}
              </Grid>

              <Grid item xs={5}>
                <Collapse in={isListOrMap} mountOnEnter unmountOnExit>
                  <Field
                    name={`${item}.defaultValue`}
                    label="Default value"
                    field={field}
                    component={CustomFieldsResolver}
                    className={classes.field}
                    classes={classes}
                    validate={validateResolver}
                  />
                </Collapse>
                <Collapse in={field.dataType === "Pattern text"} mountOnEnter unmountOnExit>
                  <FormField
                    type="text"
                    name={`${item}.pattern`}
                    label="Pattern"
                    disabled={field.id}
                    className={classes.field}
                    validate={validateRegex}
                    required
                  />
                </Collapse>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default CustomField;
