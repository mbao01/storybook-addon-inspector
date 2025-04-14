/** Based on https://gist.github.com/awestbro/e668c12662ad354f02a413205b65fce7 */
import { global } from '@storybook/global';
import { draw } from "./canvas";

const colors = {
  margin: "#f6b26ba8",
  border: "#ffe599a8",
  padding: "#93c47d8c",
  content: "#6fa8dca8",
};

function pxToNumber(px: string): number {
  return parseInt(px.replace("px", ""), 10);
}

function floatingAlignment(extremities: Extremities): FloatingAlignment {
  const windowExtremities = {
    top: global.window.scrollY,
    bottom: global.window.scrollY + global.window.innerHeight,
    left: global.window.scrollX,
    right: global.window.scrollX + global.window.innerWidth,
  };

  const distances = {
    top: Math.abs(windowExtremities.top - extremities.top),
    bottom: Math.abs(windowExtremities.bottom - extremities.bottom),
    left: Math.abs(windowExtremities.left - extremities.left),
    right: Math.abs(windowExtremities.right - extremities.right),
  };

  return {
    x: distances.left > distances.right ? "left" : "right",
    y: distances.top > distances.bottom ? "top" : "bottom",
  };
}

function measureElement(element: HTMLElement): ElementMeasurements {
  const style = global.getComputedStyle(element);
  // eslint-disable-next-line prefer-const
  let { top, left, right, bottom, width, height } =
    element.getBoundingClientRect();

  const {
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    borderBottomWidth,
    borderTopWidth,
    borderLeftWidth,
    borderRightWidth,
  } = style;

  top = top + global.window.scrollY;
  left = left + global.window.scrollX;
  bottom = bottom + global.window.scrollY;
  right = right + global.window.scrollX;

  const margin = {
    top: pxToNumber(marginTop),
    bottom: pxToNumber(marginBottom),
    left: pxToNumber(marginLeft),
    right: pxToNumber(marginRight),
  };

  const padding = {
    top: pxToNumber(paddingTop),
    bottom: pxToNumber(paddingBottom),
    left: pxToNumber(paddingLeft),
    right: pxToNumber(paddingRight),
  };

  const border = {
    top: pxToNumber(borderTopWidth),
    bottom: pxToNumber(borderBottomWidth),
    left: pxToNumber(borderLeftWidth),
    right: pxToNumber(borderRightWidth),
  };

  const extremities = {
    top: top - margin.top,
    bottom: bottom + margin.bottom,
    left: left - margin.left,
    right: right + margin.right,
  };

  return {
    margin,
    padding,
    border,
    top,
    left,
    bottom,
    right,
    width,
    height,
    extremities,
    floatingAlignment: floatingAlignment(extremities),
  };
}

function drawMargin(
  context: CanvasRenderingContext2D,
  { margin, width, height, top, left, bottom, right }: Dimensions,
) {
  // Draw Margin
  const marginHeight = height + margin.bottom + margin.top;

  context.fillStyle = colors.margin;
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

function drawPadding(
  context: CanvasRenderingContext2D,
  { padding, border, width, height, top, left, bottom, right }: Dimensions,
) {
  const paddingWidth = width - border.left - border.right;
  const paddingHeight =
    height - padding.top - padding.bottom - border.top - border.bottom;

  context.fillStyle = colors.padding;
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

function drawBorder(
  context: CanvasRenderingContext2D,
  { border, width, height, top, left, bottom, right }: Dimensions,
) {
  const borderHeight = height - border.top - border.bottom;

  context.fillStyle = colors.border;
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

function drawBoxModel(element: HTMLElement) {
  return (context?: CanvasRenderingContext2D) => {
    if (element && context) {
      const measurements = measureElement(element);

      drawMargin(context, measurements);
      drawPadding(context, measurements);
      drawBorder(context, measurements);
    }
  };
}

export function drawSelectedElement(element: HTMLElement) {
  draw("selected", drawBoxModel(element));
}

export function drawHoverElement(element: HTMLElement) {
  draw("hover", drawBoxModel(element));
}
