/* eslint-env browser */
import type { DecoratorFunction } from "@storybook/types";
import { useEffect } from "@storybook/preview-api";

import { destroy, init, rescale } from "./box-model/canvas";
import { drawSelectedElement } from "./box-model/visualizer";
import { deepElementFromPoint } from "./util";
import { PARAM_KEY } from "./constants";

let nodeAtPointerRef;
const pointer = { x: 0, y: 0 };

function findAndDrawElement(x: number, y: number) {
  nodeAtPointerRef = deepElementFromPoint(x, y);
  drawSelectedElement(nodeAtPointerRef);
}

export const withInspector: DecoratorFunction = (StoryFn, context) => {
  const isActive = context.globals?.[PARAM_KEY];

  useEffect(() => {
    const onPointerMove = (event: MouseEvent) => {
      window.requestAnimationFrame(() => {
        event.stopPropagation();
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      });
    };

    document.addEventListener("pointermove", onPointerMove);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useEffect(() => {
    const onPointerOver = (event: MouseEvent) => {
      window.requestAnimationFrame(() => {
        event.stopPropagation();
        findAndDrawElement(event.clientX, event.clientY);
      });
    };

    const onResize = () => {
      window.requestAnimationFrame(() => {
        rescale();
      });
    };

    if (context.viewMode === "story" && isActive) {
      document.addEventListener("pointerover", onPointerOver);
      init();
      window.addEventListener("resize", onResize);
      // Draw the element below the pointer when first enabled
      findAndDrawElement(pointer.x, pointer.y);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      destroy();
    };
  }, [isActive, context.viewMode]);

  return StoryFn();
};
