import { global } from "@storybook/global";

import type { Extremities, FloatingAlignment } from "./types";

export const floatingAlignment = (
  extremities: Extremities,
): FloatingAlignment => {
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
};
