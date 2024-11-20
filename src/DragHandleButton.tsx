/**
 * Button that can be used as a drag handle for reordering items
 * when the entire item is not draggable.
 * (e.g. if dragging isn't the main action)
 */

import { GripVertical } from "lucide-react";
import { DragState } from "./SortableItem";
import React from "react";

type DragHandleButtonProps = {
  dragHandleRef?: React.RefObject<HTMLButtonElement>;
  state: DragState;
  setItemState: React.Dispatch<React.SetStateAction<DragState>>;
  isMoveUpEnabled: boolean;
  moveItemUp: () => void;
  isMoveDownEnabled: boolean;
  moveItemDown: () => void;
};

const DragHandleButton = ({
  dragHandleRef,
  isMoveUpEnabled,
  moveItemUp,
  isMoveDownEnabled,
  moveItemDown,
  state,
  setItemState,
}: DragHandleButtonProps) => {
  return (
    <button
      ref={dragHandleRef}
      style={{
        width: "16px",
        height: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "8px",
        cursor: "grab",
      }}
      aria-label="Drag and reorder"
      onKeyDown={(event) => {
        // prevent changing focus when dragging
        if (event.key === "Tab" && state.type === "is-dragging") {
          event.preventDefault();
          // press space to start dragging
        } else if (event.key === " " && state.type === "idle") {
          setItemState({ type: "is-dragging" });
          // press space again to stop dragging
        } else if (event.key === " " && state.type === "is-dragging") {
          setItemState({ type: "idle" });
          // press arrow keys to reorder
        } else if (
          event.key === "ArrowDown" &&
          state.type === "is-dragging" &&
          isMoveDownEnabled
        ) {
          moveItemDown();
        } else if (
          event.key === "ArrowUp" &&
          state.type === "is-dragging" &&
          isMoveUpEnabled
        ) {
          moveItemUp();
        }
      }}
    >
      <GripVertical size={10} />
    </button>
  );
};

export { DragHandleButton };
