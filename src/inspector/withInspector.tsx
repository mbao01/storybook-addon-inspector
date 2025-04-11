import React from "react";

/* eslint-env browser */
import type { DecoratorFunction } from "@storybook/types";
import { useCallback, useEffect } from "@storybook/preview-api";

import { destroy, init, rescale } from "./utilities/box-model/canvas";
import { drawSelectedElement } from "./utilities/box-model/visualizer";
import { PARAM_KEY } from "./constants";
import { getCSSProperties, getElementFromPoint } from "./utilities";

const pointer = { x: 0, y: 0 };

function findAndDrawElement(x: number, y: number) {
  const nodeAtPointerRef = getElementFromPoint(x, y);

  if (nodeAtPointerRef) {
    const { result, tokens, variables } = getCSSProperties(nodeAtPointerRef);

    console.log("Hello: ", {
      result,
      tokens,
      variables,
    });

    drawSelectedElement(nodeAtPointerRef);
  }
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

  const onPointerOver = useCallback((event: MouseEvent) => {
    window.requestAnimationFrame(() => {
      event.stopPropagation();
      findAndDrawElement(event.clientX, event.clientY);
    });
  }, []);

  const onResize = useCallback(() => {
    window.requestAnimationFrame(() => {
      rescale();
    });
  }, []);

  const handleInit = () => {
    document.addEventListener("pointerover", onPointerOver);
    init();
    window.addEventListener("resize", onResize);
  };

  const handleDestroy = () => {
    window.removeEventListener("resize", onResize);
    document.removeEventListener("pointerover", onPointerOver);
    destroy();
  };

  useEffect(() => {
    if (context.viewMode === "story" && isActive) {
      handleInit();
      findAndDrawElement(pointer.x, pointer.y); // Draw the element below the pointer when first enabled
    } else {
      handleDestroy();
    }

    return handleDestroy;
  }, [isActive, context.viewMode]);

  return StoryFn();
};
