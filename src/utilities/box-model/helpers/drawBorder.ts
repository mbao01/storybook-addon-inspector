import { COLORS } from "./constants";
import type { Dimensions } from "./types";

export const drawBorder = (
  context: CanvasRenderingContext2D,
  { border, width, height, top, left, bottom, right }: Dimensions,
) => {
  const borderHeight = height - border.top - border.bottom;

  context.fillStyle = COLORS.border;
  // Top border rect
  context.fillRect(left, top, width, border.top);
  // Bottom border rect
  context.fillRect(left, bottom - border.bottom, width, border.bottom);
  // Left border rect
  context.fillRect(left, top + border.top, border.left, borderHeight);
  // Right border rect
  context.fillRect(
    right - border.right,
    top + border.top,
    border.right,
    borderHeight,
  );
}
