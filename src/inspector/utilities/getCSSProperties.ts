/**
 * Exhaustive mapping of CSS Shorthand Properties to their Expanded Longhand Properties.
 *
 * Format: { shorthandProperty: string[] }
 *
 * Sources:
 * - MDN Web Docs CSS Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference
 * - MDN Shorthand properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties
 * - W3C CSS Specifications (various modules)
 *
 * Note: The order of longhand properties in the arrays generally follows the
 * common order specified in documentation (e.g., TRBL for box model properties,
 * specific order for font, animation, transition, etc.). Some shorthands also
 * reset other related properties not listed here (e.g., `font` resets
 * `font-size-adjust`, `font-kerning`). This list focuses on the properties
 * whose values can be *set* via the shorthand.
 */
import SHORTHAND_PROPERTIES_MAP from "./data/css-shorthands.json";

import type { TObj } from "./types";

const SHORTHAND_PROPERTIES = Object.keys(SHORTHAND_PROPERTIES_MAP);

const getOutputAndShorthandOutput = (node) => {
  const stylesheets = document.styleSheets;
  const output: TObj = {};
  const shorthandOutput: TObj = {};

  for (let sIndex = 0; sIndex < stylesheets.length; sIndex++) {
    const stylesheet = stylesheets[sIndex];
    const rules = stylesheet.cssRules || stylesheet.rules;
    for (let rIndex = 0; rIndex < rules.length; rIndex++) {
      const { selectorText, style } = rules[rIndex] as any;
      if (node?.matches(selectorText)) {
        const properties = [...style];
        for (let property of SHORTHAND_PROPERTIES) {
          const value = style[property];
          if (value) {
            shorthandOutput[property] = style[property];
          }
        }

        for (let property of properties) {
          const value = style[property];
          if (value) {
            output[property] = value;
          }
        }
      }
    }
  }

  return { output, shorthandOutput };
};

const marryShorthandOutput = ({
  output,
  shorthandOutput,
}: {
  output: TObj;
  shorthandOutput: TObj;
}) => {
  const result = { ...output };
  Object.entries(shorthandOutput).forEach(([shorthand, shorthandValue]) => {
    if (shorthandValue) {
      const properties = SHORTHAND_PROPERTIES_MAP[shorthand];
      properties.forEach((property) => {
        delete result[property];
      });
      result[shorthand] = shorthandValue;
    }
  });

  return { output: result };
};

const getCSSVariableStyles = ({ output }: { output: TObj }) => {
  const styles = Object.entries(output).reduce((acc, [property, value]) => {
    if (value.startsWith("var(")) {
      acc[property] = value;
    }
    return acc;
  }, {} as TObj);

  return { styles };
};

const getAppliedCSSVariables = ({ styles }: { styles: TObj }) => {
  const variables = Object.entries(styles).reduce((acc, [property, value]) => {
    const regex = /var\((.*)\)/;
    const match = value.match(regex);

    if (match?.[1]) {
      acc[property] = match[1];
    }
    return acc;
  }, {} as TObj);

  return { variables };
};

const getAppliedTokens = ({ styles }: { styles: TObj }) => {
  const tokens = Object.entries(styles).reduce((acc, [property, value]) => {
    const regex = /var\(--nk-(.*)\)/;
    const match = value.match(regex);

    if (match?.[1]) {
      acc[property] = match[1].replaceAll("-", "_").toUpperCase();
    }
    return acc;
  }, {} as TObj);

  return { tokens };
};

export const getCSSProperties = (node) => {
  const { output } = marryShorthandOutput(getOutputAndShorthandOutput(node));
  const { styles } = getCSSVariableStyles({ output });
  const { variables } = getAppliedCSSVariables({ styles });
  const { tokens } = getAppliedTokens({ styles });

  const computed = getComputedStyle(node);

  const result = Object.entries(output).reduce(
    (acc, [property, value]) => {
      const token = tokens[property];
      const variable = variables[property];
      const variableValue = computed.getPropertyValue(variable);
      acc[property] = {
        value,
        token,
        variable,
        variableValue,
        computed: computed[property],
      };
      return acc;
    },
    {} as Record<
      string,
      Record<
        "value" | "token" | "computed" | "variable" | "variableValue",
        string | undefined
      >
    >,
  );

  return {
    result,
    tokens,
    variables,
  };
};
