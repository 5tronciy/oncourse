/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import * as React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// import { FixedSizeList as List } from "react-window";
import Grid from "@mui/material/Grid";
import { FormControlLabel } from "@mui/material";
import { WrappedFieldArrayProps } from "redux-form";
import { Dispatch } from "redux";
import FormField from "../../../../../../common/components/form/formFields/FormField";
import { ScriptComponent } from "../../../../../../model/scripts";
import ScriptCard from "./CardBase";
import QueryCardContent from "./QueryCardContent";
import MessageCardContent from "./MessageCardContent";
import ReportCardContent from "./ReportCardContent";
import { getType } from "../../utils";
import { ShowConfirmCaller } from "../../../../../../model/common/Confirm";

const onDragEnd = ({ destination, source, fields }) => {
  if (destination && destination.index !== source.index) {
    fields.swap(source.index, destination.index);
  }
};

interface Props {
  dispatch: Dispatch;
  classes: any;
  showConfirm: ShowConfirmCaller;
  hasUpdateAccess: boolean;
  isInternal: boolean;
  onInternalSaveClick: any;
  emailTemplates: any[];
}

const CardsRenderer: React.FC<Props & WrappedFieldArrayProps> = props => {
  const {
    fields,
    dispatch,
    meta: { form },
    classes,
    showConfirm,
    hasUpdateAccess,
    isInternal,
    onInternalSaveClick,
    emailTemplates
  } = props;

  const onDelete = (e, index) => {
    e.stopPropagation();
    showConfirm({
      onConfirm: () => {
        fields.remove(index);
      },
      confirmMessage: "Script component will be deleted permanently"
    });
  };

  const renderVariables = (variables, name, disabled) => (
    <>
      {variables.map(elem =>
        elem.type === "Checkbox" ? (
          <Grid key={getType(elem.type) + elem.label} item xs={12}>
            <FormControlLabel
              control={<FormField type={elem.type.toLowerCase()} name={`${name}.${elem.name}`} label={elem.label} />}
              disabled={disabled}
              label={elem.label}
            />
          </Grid>
        ) : (
          <Grid key={getType(elem.type) + elem.label} item xs={12}>
            <FormField type={getType(elem.type)} name={`${name}.${elem.name}`} label={elem.label} disabled={disabled} required />
          </Grid>
        )
      )}
    </>
  );

  const Item = ({ component, provided, index, item }) => {
    switch (component.type) {
      case "Script": {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <ScriptCard
              heading="Script"
              className="mb-3"
              onDelete={!isInternal && hasUpdateAccess ? e => onDelete(e, index) : null}
              dragHandlerProps={provided.dragHandleProps}
              expanded
              noPadding
              onDetailsClick={isInternal ? onInternalSaveClick : undefined}
            >
              <FormField type="code" name={`${item}.content`} disabled={isInternal || !hasUpdateAccess} className="mt-3" />
            </ScriptCard>
          </div>
        );
      }
      case "Query": {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <ScriptCard
              heading="Query"
              className="mb-3"
              onDelete={!isInternal ? e => onDelete(e, index) : null}
              dragHandlerProps={provided.dragHandleProps}
              expanded
              onDetailsClick={isInternal ? onInternalSaveClick : undefined}
            >
              <QueryCardContent dispatch={dispatch} field={component} name={item} classes={classes} disabled={isInternal} />
            </ScriptCard>
          </div>
        );
      }
      case "Message": {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <ScriptCard
              heading="Message"
              className="mb-3"
              onDelete={!isInternal ? e => onDelete(e, index) : null}
              dragHandlerProps={provided.dragHandleProps}
              expanded
              onDetailsClick={isInternal ? onInternalSaveClick : undefined}
            >
              <MessageCardContent
                dispatch={dispatch}
                field={component}
                name={item}
                classes={classes}
                emailTemplates={emailTemplates}
                renderVariables={renderVariables}
                form={form}
                disabled={isInternal}
              />
            </ScriptCard>
          </div>
        );
      }
      case "Report": {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <ScriptCard
              heading="Report"
              className="mb-3"
              onDelete={!isInternal ? e => onDelete(e, index) : null}
              dragHandlerProps={provided.dragHandleProps}
              expanded
              onDetailsClick={isInternal ? onInternalSaveClick : undefined}
            >
              <ReportCardContent
                dispatch={dispatch}
                field={component}
                name={item}
                form={form}
                disabled={isInternal}
                renderVariables={renderVariables}
              />
            </ScriptCard>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const Row = (item, index) => {
    const component: ScriptComponent = fields.get(index);
    return (
      <Draggable key={component.id} draggableId={index + component.id} index={index} isDragDisabled={isInternal}>
        {provided => <Item component={component} provided={provided} index={index} item={item} />}
      </Draggable>
    );
  };

  // const RowVirtualised = ({ index, style }) => {
  //   const component: ScriptComponent = fields.get(index);
  //   const item = `${fields.name}[${index}]`;
  //   return (
  //     <Draggable key={component.id} draggableId={index + component.id} index={index} isDragDisabled={isInternal}>
  //       {provided => <Item component={component} provided={provided} index={index} item={item} style={style} />}
  //     </Draggable>
  //   );
  // };

  return (
    <DragDropContext onDragEnd={args => onDragEnd({ ...args, fields })}>
      <Droppable
        droppableId="droppable"
        // mode="virtual" renderClone={(provided,snapshot,rubric)=>(<Item component={fields.get(rubric.source.index)} provided={provided} index={rubric.source.index} item={`${fields.name}[${rubric.source.index}]`} />)}
      >
        {provided => (
          // <List height={700} itemCount={fields.length} itemSize={200} width={300} outerRef={provided.innerRef}>{Row}</List>
          <div ref={provided.innerRef} className="pt-3 pb-3">
            {fields.map(Row)}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CardsRenderer;
