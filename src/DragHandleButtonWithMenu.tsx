/**
 * Exploration for adding a dropdown menu to the drag handle button
 * instead of using arrow keys to reorder items. #a11y
 *
 * This could be an interesting option for the list view columns
 * because it would allow users to move items directly to the top
 * or bottom of the list.
 */

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { GripVertical } from "lucide-react";
import { ItemPosition } from "./SortableList";

const AccessibleDragHandle = ({
  position,
  index,
  // @ts-expect-error (so we can build and deploy)
  reorderItem,
  // @ts-expect-error (so we can build and deploy)
  dragHandleRef,
}: {
  position: ItemPosition;
  index: number;
}) => {
  const isMoveUpDisabled = position === "first" || position === "only";
  const isMoveDownDisabled = position === "last" || position === "only";

  const moveToTop = () => {
    reorderItem({
      startIndex: index,
      indexOfTarget: 0,
    });
  };
  const moveUp = () => {
    reorderItem({
      startIndex: index,
      indexOfTarget: index - 1,
    });
  };
  const moveDown = () => {
    reorderItem({
      startIndex: index,
      indexOfTarget: index + 1,
    });
  };
  const moveToBottom = () => {
    reorderItem({
      startIndex: index,
      indexOfTarget: 8,
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {/* <DragHandleButton ref={dragHandleRef} label="Drag and reorder" /> */}
        <button ref={dragHandleRef} aria-label="Drag and reorder">
          <GripVertical size={10} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={moveToTop} disabled={isMoveUpDisabled}>
            Move to top
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={moveUp} disabled={isMoveUpDisabled}>
            Move up
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={moveDown} disabled={isMoveDownDisabled}>
            Move down
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={moveToBottom}
            disabled={isMoveDownDisabled}
          >
            Move to bottom
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export { AccessibleDragHandle };
