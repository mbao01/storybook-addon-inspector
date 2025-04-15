import { COLORS } from "./constants";
import type { Dimensions } from "./types";

export const drawPadding = (
  context: CanvasRenderingContext2D,
  { padding, border, width, height, top, left, bottom, right }: Dimensions,
) => {
  const paddingWidth = width - border.left - border.right;
  const paddingHeight =
    height - padding.top - padding.bottom - border.top - border.bottom;

  context.fillStyle = COLORS.padding;
  // Top padding rect
  context.fillRect(
    left + border.left,
    top + border.top,
    paddingWidth,
    padding.top,
  );
  // Right padding rect
  context.fillRect(
    right - padding.right - border.right,
    top + padding.top + border.top,
    padding.right,
    paddingHeight,
  );
  // Bottom padding rect
  context.fillRect(
    left + border.left,
    bottom - padding.bottom - border.bottom,
    paddingWidth,
    padding.bottom,
  );
  // Left padding rect
  context.fillRect(
    left + border.left,
    top + padding.top + border.top,
    padding.left,
    paddingHeight,
  );
}
