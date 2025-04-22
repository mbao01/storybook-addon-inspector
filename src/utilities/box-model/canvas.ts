import { global } from "@storybook/global";

import invariant from "tiny-invariant";

type Size = {
  width: number;
  height: number;
};

type CanvasType = "selected" | "hover";

type CanvasState = {
  canvas?: HTMLCanvasElement;
  context?: CanvasRenderingContext2D;
  width?: number;
  height?: number;
};

function getDocumentWidthAndHeight() {
  const container = global.document.documentElement;

  const height = Math.max(container.scrollHeight, container.offsetHeight);
  const width = Math.max(container.scrollWidth, container.offsetWidth);
  return { width, height };
}

function createCanvas(type): CanvasState {
  const canvas = global.document.createElement("canvas");
  canvas.id = `storybook-addon-inspector-${type}`;
  const context = canvas.getContext("2d");
  invariant(context != null);
  // Set canvas width & height
  const { width, height } = getDocumentWidthAndHeight();
  setCanvasWidthAndHeight(canvas, context, { width, height });
  // Position canvas
  canvas.style.position = "absolute";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.zIndex = "999999999";
  // Disable any user interactions
  canvas.style.pointerEvents = "none";
  global.document.body.appendChild(canvas);

  return { canvas, context, width, height };
}

function setCanvasWidthAndHeight(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  { width, height }: Size,
) {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Scale
  const scale = global.window.devicePixelRatio;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);

  // Normalize coordinate system to use css pixels.
  context.scale(scale, scale);
}

let state: { hover: CanvasState; selected: CanvasState } = {
  hover: {},
  selected: {},
};

export function init() {
  if (!state.selected.canvas) {
    state.selected = createCanvas("selected");
  }

  if (!state.hover.canvas) {
    state.hover = createCanvas("hover");
  }
}

export function clear(type: CanvasType) {
  if (state[type].context) {
    state[type].context.clearRect(
      0,
      0,
      // NB there can be NaN or non nullish value here
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      state[type].width || 0,
      // NB there can be NaN or non nullish value here
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      state[type].height || 0,
    );
  }
}

export function draw(
  type: CanvasType,
  callback: (context?: CanvasRenderingContext2D) => void,
) {
  clear(type);
  callback(state[type].context);
}

export function rescale() {
  invariant(state.selected.canvas, "Canvas should exist in the state.");
  invariant(state.selected.context, "Context should exist in the state.");

  const { width, height } = getDocumentWidthAndHeight();
  setCanvasWidthAndHeight(state.selected.canvas, state.selected.context, {
    width,
    height,
  });

  // First reset so that the canvas size doesn't impact the container size
  setCanvasWidthAndHeight(state.selected.canvas, state.selected.context, {
    width: 0,
    height: 0,
  });
  setCanvasWidthAndHeight(state.hover.canvas, state.hover.context, {
    width: 0,
    height: 0,
  });

  // update state
  state.selected.width = width;
  state.selected.height = height;
}

export function destroy(type: CanvasType) {
  if (state[type].canvas) {
    clear(type);
    state[type].canvas.parentNode?.removeChild(state[type].canvas);
    state = { ...state, [type]: {} };
  }
}

export function destroyAll() {
  destroy("selected");
  destroy("hover");
}
