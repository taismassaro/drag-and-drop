import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { Item, ItemPosition } from "./SortableList";
import { DragPreview } from "./DragPreview";
import { DropIndicator } from "./DropIndicator";
import { DragHandleIcon } from "./DragHandleIcon";

export type DragState =
  | {
      type: "idle";
    }
  | {
      type: "preview";
      container: HTMLElement;
    }
  | {
      type: "is-dragging";
    }
  | {
      type: "is-dragging-over";
      closestEdge: Edge | null;
    };

const stateStyles: {
  [Key in DragState["type"]]?: HTMLAttributes<HTMLDivElement>["style"];
} = {
  "is-dragging": { opacity: 0.4 },
};

const SortableItem = ({
  item,
  position,
  index,
  reorderItem,
}: {
  item: Item;
  position: ItemPosition;
  index: number;
  reorderItem: (args: { startIndex: number; indexOfTarget: number }) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  // const dragHandleRef = useRef<HTMLButtonElement>(null);

  const [state, setState] = useState<DragState>({ type: "idle" });

  const isMoveUpEnabled = !(position === "first" || position === "only");
  const isMoveDownEnabled = !(position === "last" || position === "only");

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

  // console.log("state", state);

  useEffect(() => {
    const element = ref.current;
    // const dragHandle = dragHandleRef.current;

    // if (!element || !dragHandle) {
    if (!element) {
      return;
    }

    return combine(
      // make item draggable
      draggable({
        // make only the drag handle draggable
        element,
        getInitialData: () => ({ ...item, index }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            render: ({ container }) => {
              setState({ type: "preview", container });
            },
          });
        },
        onDragStart: () => {
          setState({ type: "is-dragging" });
        },
        onDrop: () => {
          setState({ type: "idle" });
        },
      }),
      // make it possible to drop on the item
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          // don't allow dropping on the same element
          if (source.element === element) {
            return false;
          }

          return true;
        },
        getData: ({ input }) => {
          return attachClosestEdge(
            { ...item, index },
            {
              element,
              input,
              allowedEdges: ["top", "bottom"],
            }
          );
        },
        getIsSticky: () => true,
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);

          // only update state if the closest edge has changed
          setState((current) => {
            if (
              current.type === "is-dragging-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return { type: "is-dragging-over", closestEdge };
          });
        },
        onDragLeave: () => {
          setState({ type: "idle" });
        },
        onDrop: () => {
          setState({ type: "idle" });
        },
      })
    );
  }, [item]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    switch (event.key) {
      case " ":
        // press space to start dragging
        if (state.type === "idle") {
          setState({ type: "is-dragging" });
          // press space again to drop
        } else if (state.type === "is-dragging") {
          setState({ type: "idle" });
        }
        break;
      case "Tab":
        // prevent changing focus when dragging
        if (state.type === "is-dragging") {
          event.preventDefault();
        }
        break;
      case "Escape":
        // should probably return the item to its original position
        if (state.type === "is-dragging") {
          setState({ type: "idle" });
        }
        break;
      // press arrow keys to reorder
      case "ArrowDown":
        if (state.type === "is-dragging" && isMoveDownEnabled) {
          moveDown();
        }
        break;
      case "ArrowUp":
        if (state.type === "is-dragging" && isMoveUpEnabled) {
          moveUp();
        }
        break;
    }
  };

  return (
    <>
      <li
        role="option"
        tabIndex={0}
        style={{ position: "relative" }}
        onKeyDown={handleKeyDown}
      >
        <div
          // used to query for the element and trigger a flash animation on drop
          data-item-id={item.id}
          ref={ref}
          // dim the item being dragged
          style={{
            display: "flex",
            alignItems: "center",
            ...(stateStyles[state.type] ?? {}),
          }}
        >
          <DragHandleIcon />
          <span>{item.label}</span>
        </div>
        {state.type === "is-dragging-over" && state.closestEdge ? (
          <DropIndicator edge={state.closestEdge} />
        ) : null}
      </li>
      {state.type === "preview"
        ? createPortal(<DragPreview item={item} />, state.container)
        : null}
    </>
  );
};

export { SortableItem };
