import React from "react";

/* eslint-env browser */
import type { DecoratorFunction } from "@storybook/types";
import { useCallback, useEffect, useState } from "@storybook/preview-api";

import type { Point } from "./utilities/types";
import { destroy, init, rescale } from "./utilities/box-model/canvas";
import { PARAM_KEY } from "./constants";
import { getPointElementCSSProperties } from "./utilities";

const pointer: Point = { x: 0, y: 0 };

export const withInspector: DecoratorFunction = (StoryFn, context) => {
  const isActive = context.globals?.[PARAM_KEY];
  const [result, setResult] = useState(null);

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
      const result = getPointElementCSSProperties({
        x: event.clientX,
        y: event.clientY,
      });
      setResult(result);
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
    setResult(null);
  };

  useEffect(() => {
    if (context.viewMode === "story" && isActive) {
      handleInit();
      const result = getPointElementCSSProperties(pointer); // Draw the element below the pointer when first enabled
      setResult(result);
    } else {
      handleDestroy();
    }

    return handleDestroy;
  }, [isActive, context.viewMode]);

  return (
    <>
      {StoryFn()}
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </>
  );
};
