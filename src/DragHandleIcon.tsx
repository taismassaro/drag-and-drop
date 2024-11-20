/**
 * Only the drag handle icon, without any functionality,
 * to be used when the entire item is draggable as an
 * indicator that it can be dragged.
 */

import { GripVertical } from "lucide-react";

const DragHandleIcon = () => {
  return (
    <div
      style={{
        width: "16px",
        height: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <GripVertical size={10} />
    </div>
  );
};

export { DragHandleIcon };
