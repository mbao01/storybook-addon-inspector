import type { Point } from "./types";
import { drawSelectedElement } from "./box-model/visualizer";
import { getCSSProperties } from "./getCSSProperties";
import { getElementFromPoint } from "./getElementFromPoint";

export const getPointElementCSSProperties = (point: Point) => {
  try {
    const nodeAtPointerRef = getElementFromPoint(point.x, point.y);

    if (nodeAtPointerRef) {
      const { result } = getCSSProperties(nodeAtPointerRef);

      drawSelectedElement(nodeAtPointerRef);
      return result;
    }
  } catch (e) {
    return;
  }
};
