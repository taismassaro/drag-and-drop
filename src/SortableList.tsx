import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { SortableItem } from "./SortableItem";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";

export type Item = {
  id: string;
  label: string;
};

type SortableListProps = {
  /**
   * The items to render in the list.
   */
  items: Item[];
  /**
   * Callback fired when an item is dropped.
   */
  onDrop?: (items: Item[]) => void;
};

export type ItemPosition = "first" | "last" | "middle" | "only";

const getItemPosition = ({
  index,
  items,
}: {
  index: number;
  items: Item[];
}): ItemPosition => {
  if (items.length === 1) {
    return "only";
  }

  if (index === 0) {
    return "first";
  }

  if (index === items.length - 1) {
    return "last";
  }

  return "middle";
};

const SortableList = ({ items, onDrop }: SortableListProps) => {
  const [listItems, setListItems] = useState(items);

  // should be moved into a context instead of passed as prop
  // add usecallback to prevent rerender
  const reorderItem = ({
    startIndex,
    indexOfTarget,
  }: {
    startIndex: number;
    indexOfTarget: number;
  }) => {
    const finishIndex = getReorderDestinationIndex({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget: null,
      axis: "vertical",
    });

    if (finishIndex === startIndex) {
      return;
    }

    setListItems((prevItems) => {
      return reorder({
        list: prevItems,
        startIndex,
        finishIndex,
      });
    });
  };

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ location, source }) => {
        const target = location.current.dropTargets[0];

        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;

        const indexOfSource = listItems.findIndex(
          (item) => item.id === sourceData.id
        );
        const indexOfTarget = listItems.findIndex(
          (item) => item.id === targetData.id
        );

        if (indexOfTarget < 0 || indexOfSource < 0) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        const reorderedItems = reorderWithEdge({
          list: listItems,
          startIndex: indexOfSource,
          indexOfTarget,
          closestEdgeOfTarget,
          axis: "vertical",
        });

        setListItems(reorderedItems);

        // trigger an animation to indicate the item has been moved
        const element = document.querySelector(
          `[data-item-id="${sourceData.id}"]`
        );
        if (element instanceof HTMLElement) {
          triggerPostMoveFlash(element);
        }

        if (onDrop) {
          onDrop(reorderedItems);
        }
      },
    });
  }, [listItems]);

  return (
    <ol style={{ marginInline: "50px" }}>
      {listItems.map((item, index) => (
        <SortableItem
          key={item.id}
          item={item}
          index={index}
          position={getItemPosition({ index, items })}
          reorderItem={reorderItem}
        />
      ))}
    </ol>
  );
};

export { SortableList };
