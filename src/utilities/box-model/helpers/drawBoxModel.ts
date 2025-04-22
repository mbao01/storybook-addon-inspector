import { drawBorder } from "./drawBorder";
import { drawContent } from "./drawContent";
import { drawMargin } from "./drawMargin";
import { drawPadding } from "./drawPadding";
import { measureElement } from "./measureElement";

export const drawBoxModel = (element: HTMLElement | null) => {
  return (context?: CanvasRenderingContext2D) => {
    if (element && context) {
      const measurements = measureElement(element);

      drawMargin(context, measurements);
      drawPadding(context, measurements);
      drawBorder(context, measurements);
      drawContent(context, measurements);
    }
  };
};
