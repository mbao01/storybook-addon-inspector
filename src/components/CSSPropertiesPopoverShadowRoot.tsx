"use client";

import root from "react-shadow";

import type { CSSPropertyPopoverProps } from "./types";
import { CSSPropertiesPopover } from "./CSSPropertiesPopover";
import styles from "../stylesheets/index.css?inline";

export const CSSPropertiesPopoverShadowRoot = ({
  id,
  tokens,
  computed,
  variables,
  open,
}: CSSPropertyPopoverProps) => {
  return (
    <root.div id={`${id}-shadow-root`} data-testid={`${id}-shadow-root`}>
      <CSSPropertiesPopover
        id={id}
        tokens={tokens}
        computed={computed}
        variables={variables}
        open={open}
      />
      <style type="text/css">{styles}</style>
    </root.div>
  );
};
