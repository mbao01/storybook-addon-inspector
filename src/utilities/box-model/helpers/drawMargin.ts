import { COLORS } from "./constants";
import type { Dimensions } from "./types";

export const drawMargin = (
  context: CanvasRenderingContext2D,
  { margin, width, height, top, left, bottom, right }: Dimensions,
) => {
  // Draw Margin
  const marginHeight = height + margin.bottom + margin.top;

  context.fillStyle = COLORS.margin;
  // Top margin rect
  context.fillRect(left, top - margin.top, width, margin.top);
  // Right margin rect
  context.fillRect(right, top - margin.top, margin.right, marginHeight);
  // Bottom margin rect
  context.fillRect(left, bottom, width, margin.bottom);
  // Left margin rect
  context.fillRect(
    left - margin.left,
    top - margin.top,
    margin.left,
    marginHeight,
  );
}