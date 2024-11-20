/**
 * Component to display next to the cursor when dragging an item.
 */

import { Item } from "./SortableList";

const DragPreview = ({ item }: { item: Item }) => {
  return (
    <div
      style={{
        backgroundColor: "cornflowerblue",
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
      }}
    >
      {item.label}
    </div>
  );
};

export { DragPreview };
