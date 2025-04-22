import { COLORS } from "./constants";
import type { Dimensions } from "./types";

export const drawContent = (
  context: CanvasRenderingContext2D,
  { width, height, top, left }: Dimensions,
) => {
  // prevent default pointer events on canvas
  context.canvas.style.touchAction = "none";
  context.canvas.style.pointerEvents = "none";
  context.fillStyle = COLORS.content;
  // Content rect
  context.fillRect(left, top, width, height);
};
