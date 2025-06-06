/* eslint-disable react-hooks/rules-of-hooks */
import type { DecoratorFunction } from "@storybook/types";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "@storybook/preview-api";

import type { CSSPropertiesObj, Point } from "./utilities/types";
import { destroyAll, init, rescale } from "./utilities/box-model/canvas";
import { PARAM_KEY } from "./constants";
import { getPointNodeAndCSSProperties, groupCSSProperties } from "./utilities";
import { CSSPropertiesPopoverShadowRoot } from "./components";
import { drawHoverElementOnPoint } from "./utilities/getPointNodeAndCSSProperties";

const pointer: Point = { x: 0, y: 0 };

export const withInspector: DecoratorFunction = (StoryFn, context) => {
  const CSS_PROPERTIES_POPOVER_ID =
    "storybook-addon-inspector-css-properties-popover";
  const isActive = context.globals?.[PARAM_KEY];
  const isEnabled = context.viewMode === "story" && isActive;
  const [nodeProperties, setNodeProperties] = useState<{
    node: HTMLElement | null;
    properties: CSSPropertiesObj | null;
  }>({
    node: null,
    properties: null,
  });
  const [open, setOpen] = useState(false);

  const { tokens, computed, variables } = useMemo(() => {
    const { properties } = nodeProperties;
    if (!properties) {
      return { tokens: null, computed: null, variables: null };
    }

    const { tokens, computed, variables } = groupCSSProperties({
      properties,
    });

    return { tokens, computed, variables };
  }, [nodeProperties]);

  const onPointerMove = useCallback((event: MouseEvent) => {
    window.requestAnimationFrame(() => {
      event.stopPropagation();
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      drawHoverElementOnPoint(pointer, nodeProperties.node);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseDown = useCallback((event: MouseEvent) => {
    window.requestAnimationFrame(() => {
      event.stopPropagation();
      const { node, properties } = getPointNodeAndCSSProperties({
        x: event.clientX,
        y: event.clientY,
      });
      if (node) {
        setNodeProperties({ node, properties });
        setOpen(true);
      }
    });
  }, []);

  const onDisableClick = useCallback((event: MouseEvent) => {
    // Check if the click target is not the popover shadow root (or inside it)
    const popoverShadowRoot = document.getElementById(
      `${CSS_PROPERTIES_POPOVER_ID}-shadow-root`,
    );
    if (!popoverShadowRoot?.contains(event.target as Node)) {
      event.stopPropagation();
      event.preventDefault();
    }
  }, []);

  const onResize = useCallback(() => {
    window.requestAnimationFrame(() => {
      rescale();
    });
  }, []);

  const handleInit = () => {
    document.addEventListener("mousedown", onMouseDown);
    init();
    window.addEventListener("resize", onResize);
    document
      .getElementById("storybook-root")
      ?.addEventListener("click", onDisableClick, true);
  };

  const handleDestroy = () => {
    window.removeEventListener("resize", onResize);
    document.removeEventListener("mousedown", onMouseDown);
    document
      .getElementById("storybook-root")
      ?.removeEventListener("click", onDisableClick, true);
    destroyAll();
    setNodeProperties({ node: null, properties: null });
    setOpen(false);
  };

  useEffect(() => {
    if (isEnabled) {
      document.addEventListener("pointermove", onPointerMove);
    }

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled]);

  useEffect(() => {
    if (isEnabled) {
      handleInit();
    } else {
      handleDestroy();
    }

    return handleDestroy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled]);

  return (
    <>
      <StoryFn />
      {isEnabled && (
        <CSSPropertiesPopoverShadowRoot
          id={CSS_PROPERTIES_POPOVER_ID}
          open={open}
          tokens={tokens ?? []}
          computed={computed ?? []}
          variables={variables ?? []}
        />
      )}
    </>
  );
};
