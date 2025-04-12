import React from "react";

/* eslint-env browser */
import type { DecoratorFunction } from "@storybook/types";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "@storybook/preview-api";

import type { CSSPropertiesObj, Point } from "./utilities/types";
import { destroy, init, rescale } from "./utilities/box-model/canvas";
import { PARAM_KEY } from "./constants";
import { getPointNodeAndCSSProperties, groupCSSProperties } from "./utilities";
import { Popover } from "./components/Popover";

const pointer: Point = { x: 0, y: 0 };

export const withInspector: DecoratorFunction = (StoryFn, context) => {
  const isActive = context.globals?.[PARAM_KEY];
  const [{ node, properties }, setNodeProperties] = useState<{
    node: HTMLElement | null;
    properties: CSSPropertiesObj | null;
  }>({
    node: null,
    properties: null,
  });

  const { tokens, computed, variables } = useMemo(() => {
    if (!properties) {
      return { tokens: null, computed: null, variables: null };
    }

    const { tokens, computed, variables } = groupCSSProperties({
      properties,
    });

    return { tokens, computed, variables };
  }, [properties]);

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
      const { node, properties } = getPointNodeAndCSSProperties({
        x: event.clientX,
        y: event.clientY,
      });
      setNodeProperties({ node, properties });
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
    setNodeProperties({ node: null, properties: null });
  };

  useEffect(() => {
    if (context.viewMode === "story" && isActive) {
      handleInit();
      const { node, properties } = getPointNodeAndCSSProperties(pointer); // Draw the element below the pointer when first enabled
      setNodeProperties({ node, properties });
    } else {
      handleDestroy();
    }

    return handleDestroy;
  }, [isActive, context.viewMode]);

  console.log("Node: ", node);

  return (
    <>
      {StoryFn()}
      <Popover tokens={tokens} computed={computed} variables={variables} />
      <pre>Tokens: {JSON.stringify(tokens, null, 2)}</pre>
      {/* <pre>Variables: {JSON.stringify(variables, null, 2)}</pre>
      <pre>Computed: {JSON.stringify(computed, null, 2)}</pre>
      <pre>{JSON.stringify(properties, null, 2)}</pre> */}
    </>
  );
};
