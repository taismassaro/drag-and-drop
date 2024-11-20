import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import styles from "./DropIndicator.module.css";
import { CSSProperties } from "react";

const strokeSize = 2;
const terminalSize = 8;
const offsetToAlignTerminalWithLine = (strokeSize - terminalSize) / 2;

const DropIndicator = ({ edge }: { edge: Edge }) => {
  const lineOffset = `calc(-0.5 * ${strokeSize}px)`;

  return (
    <div
      className={`${styles.dropIndicator} ${styles[edge]}`}
      style={
        {
          "--line-thickness": `${strokeSize}px`,
          "--line-offset": `${lineOffset}`,
          "--terminal-size": `${terminalSize}px`,
          "--terminal-radius": `${terminalSize / 2}px`,
          "--negative-terminal-size": `-${terminalSize}px`,
          "--offset-terminal": `${offsetToAlignTerminalWithLine}px`,
        } as CSSProperties
      }
    />
  );
};

export { DropIndicator };
