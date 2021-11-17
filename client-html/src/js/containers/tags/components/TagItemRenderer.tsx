import React from "react";
import clsx from "clsx";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import DragIndicator from "@mui/icons-material/DragIndicator";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

export const TagItemRenderer = ({
  snapshot,
  provided,
  noTransformClass,
  classes,
  item,
  onEditClick,
  onDeleteClick,
}) => {
  const isDragging = snapshot.isDragging;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={noTransformClass}
    >
      <div
        className={clsx(
          "cursor-pointer d-grid align-items-center",
          classes.card,
          {
            [clsx("paperBackgroundColor", classes.dragOver)]:
              isDragging || Boolean(snapshot.combineTargetFor),
          }
        )}
      >
        <div>
          <DragIndicator
            className={clsx({
              dndActionIcon: true,
              [clsx("d-flex", classes.dragIcon)]: true,
            })}
          />
        </div>

        <div className="pr-2">
          <div
            className={classes.tagColorDot}
            style={{ background: "#" + item.color }}
          />
        </div>

        <div>
          <div>
            <Typography variant="caption" color="textSecondary">
              Name
            </Typography>

            <Typography
              variant="body2"
              color={item.name ? undefined : "error"}
              noWrap
            >
              {item.name || "Name is mandatory"}
            </Typography>
          </div>
        </div>

        <div className="centeredFlex">
          <div className="pr-1 flex-fill overflow-hidden">
            <Typography variant="caption" color="textSecondary">
              URL path
            </Typography>

            <Typography
              variant="body2"
              className={item.urlPath ? undefined : "placeholderContent"}
              noWrap
            >
              {item.urlPath || "No Value"}
            </Typography>
          </div>

          <div className="flex-fill">
            <Typography variant="caption" color="textSecondary">
              Visibility
            </Typography>

            <Typography variant="body2">{item.status}</Typography>
          </div>
        </div>

        <IconButton
          className={clsx(classes.actionButton, "dndActionIconButton")}
          onClick={onEditClick}
        >
          <Edit className={clsx(classes.actionIcon, "dndActionIcon")} />
        </IconButton>

        <IconButton
          className={clsx(classes.actionButton, {
            invisible: !parent,
            dndActionIconButton: true,
          })}
          onClick={onDeleteClick}
        >
          <Delete className={clsx(classes.actionIcon, "dndActionIcon")} />
        </IconButton>
      </div>
    </div>
  );
};
