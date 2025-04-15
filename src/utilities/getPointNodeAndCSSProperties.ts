import type { Point } from "./types";
import { getCSSProperties } from "./getCSSProperties";
import { getElementFromPoint } from "./getElementFromPoint";
import { drawHoverElement, drawSelectedElement } from "./box-model/visualizer";

export const getPointNodeAndCSSProperties = (point: Point) => {
  try {
    const nodeAtPointerRef = getElementFromPoint(point.x, point.y);

    if (nodeAtPointerRef) {
      const { result } = getCSSProperties(nodeAtPointerRef);

      drawSelectedElement(nodeAtPointerRef);
      return {
        node: nodeAtPointerRef,
        properties: result,
      };
    }

    return { node: null, properties: null };
  } catch (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e: unknown
  ) {
    return { node: null, properties: null };
  }
};

export const drawHoverElementOnPoint = (point: Point, currentNode) => {
  const nodeAtPointerRef = getElementFromPoint(point.x, point.y);

  if (nodeAtPointerRef && !nodeAtPointerRef.contains(currentNode)) {
    drawHoverElement(nodeAtPointerRef);
  }
};
