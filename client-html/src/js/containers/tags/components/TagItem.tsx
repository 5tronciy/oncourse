/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import React, { useCallback } from "react";
import { FieldArray } from "redux-form";
import { Draggable } from "react-beautiful-dnd";
import { withStyles, createStyles } from "@mui/styles";
import TagItemsRenderer from "./TagItemsRenderer";
import { TagItemRenderer } from "./TagItemRenderer";

const styles = theme =>
  createStyles({
    dragIcon: {
      margin: theme.spacing(0, 2)
    },
    actionButton: {
      marginRight: "10px"
    },
    actionIcon: {
      fontSize: "20px"
    },
    card: {
      borderRadius: `${theme.shape.borderRadius}px`,
      padding: "2px 0",
      margin: "2px 0",
      "&:hover": {
        boxShadow: theme.shadows[2]
      },
      gridTemplateColumns: "auto auto 1fr 40% auto auto"
    },
    dragOver: {
      boxShadow: theme.shadows[2]
    },
    tagColorDot: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      borderRadius: "100%"
    }
  });

type PropsFromDroppable = {
  classes: any;
  parent: any;
  onDelete: any;
  index: any;
  item: any;
  noTransformClass: any;
  openTagEditView: any;
  validatTagsNames: any;
  key: any;
};

type PropsFromList = {
  data: PropsFromDroppable[];
  index: number;
  isScrolling: boolean;
  style: Object;
};

const TagItem = React.memo<any>(props => {
  const { classes, parent, onDelete, index, item, noTransformClass, openTagEditView, validatTagsNames, key } = props;
  // const { data, index, style } = props;
  // const { classes, parent, onDelete, index: droppableIndex, item, noTransformClass, openTagEditView, validatTagsNames, key } = data;
  if (!item.parent) {
    item.parent = parent;
  }

  const onEditClick = useCallback(() => openTagEditView(item, parent), [item, parent]);

  const onDeleteClick = useCallback(() => onDelete(parent, index, item), [item, parent, index]);

  const row = (provided, snapshot) => (
    <TagItemRenderer
      snapshot={snapshot}
      provided={provided}
      noTransformClass={noTransformClass}
      classes={classes}
      item={item}
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
    />
  );

  return (
    <>
      <Draggable key={key} draggableId={parent || "ROOT"} index={item.dragIndex} isDragDisabled={!parent}>
        {row}
      </Draggable>

      <div className="ml-2">
        <FieldArray
          noTransformClass={noTransformClass}
          name={parent ? `${parent}.childTags` : "childTags"}
          component={TagItemsRenderer}
          onDelete={onDelete}
          openTagEditView={openTagEditView}
          validate={validatTagsNames}
          rerenderOnEveryChange
        />
      </div>
    </>
  );
});

export default withStyles(styles)(TagItem);
