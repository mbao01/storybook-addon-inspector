import type { Point } from "./types";
import { getCSSProperties } from "./getCSSProperties";
import { getElementFromPoint } from "./getElementFromPoint";
import { drawSelectedElement } from "./box-model/visualizer";

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
  } catch (e: unknown) {
    return { node: null, properties: null };
  }
};



export const drawElementOnPoint = (point: Point) => {
  const nodeAtPointerRef = getElementFromPoint(point.x, point.y);

  drawSelectedElement(nodeAtPointerRef);
};
