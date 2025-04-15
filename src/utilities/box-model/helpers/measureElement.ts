import { global } from "@storybook/global";

import type { ElementMeasurements } from "./types";
import { floatingAlignment } from "./floatingAlignment";

const pxToNumber = (px: string): number => {
  return parseInt(px.replace("px", ""), 10);
};

export const measureElement = (element: HTMLElement): ElementMeasurements => {
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
};
