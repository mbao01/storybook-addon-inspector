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

import type { CSSPropertiesObj, Obj } from "./types";

const SHORTHAND_PROPERTIES = Object.keys(SHORTHAND_PROPERTIES_MAP);

const getOutputAndShorthandOutput = (node: HTMLElement) => {
  const stylesheets = document.styleSheets;
  const output: Obj = {};
  const shorthandOutput: Obj = {};

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let sIndex = 0; sIndex < stylesheets.length; sIndex++) {
    const stylesheet = stylesheets[sIndex];
    const rules = stylesheet.cssRules || stylesheet.rules;

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let rIndex = 0; rIndex < rules.length; rIndex++) {
      const { selectorText, style } = rules[rIndex] as CSSStyleRule;
      if (node?.matches(selectorText)) {
        // Get all property names from the style object
        const properties = Array.from(style).filter((prop) =>
          style.getPropertyValue(prop),
        );

        for (const property of SHORTHAND_PROPERTIES) {
          const value = style.getPropertyValue(property);
          if (value) {
            shorthandOutput[property] = value;
          }
        }

        for (const property of properties) {
          const value = style.getPropertyValue(property);
          if (value) {
            output[property] = value;
          }
        }
      }
    }
  }

  return { output, shorthandOutput };
};

type MarryShorthandOutputParams = {
  output: Obj;
  shorthandOutput: Obj;
};

const marryShorthandOutput = ({
  output,
  shorthandOutput,
}: MarryShorthandOutputParams) => {
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

type CSSVariableStylesParams = {
  output: Obj;
};

const getCSSVariableStyles = ({ output }: CSSVariableStylesParams) => {
  const styles = Object.entries(output).reduce((acc, [property, value]) => {
    if (value.startsWith("var(")) {
      acc[property] = value;
    }
    return acc;
  }, {} as Obj);

  return { styles };
};

type AppliedCSSVariablesParams = {
  styles: Obj;
};

const getAppliedCSSVariables = ({ styles }: AppliedCSSVariablesParams) => {
  const variables = Object.entries(styles).reduce((acc, [property, value]) => {
    const regex = /var\((.*)\)/;
    const match = value.match(regex);

    if (match?.[1]) {
      acc[property] = match[1];
    }
    return acc;
  }, {} as Obj);

  return { variables };
};

type AppliedTokensParams = {
  styles: Obj;
};

const getAppliedTokens = ({ styles }: AppliedTokensParams) => {
  const tokens = Object.entries(styles).reduce((acc, [property, value]) => {
    const regex = /var\(--nk-(.*)\)/;
    const match = value.match(regex);

    if (match?.[1]) {
      acc[property] = match[1].replaceAll("-", "_").toUpperCase();
    }
    return acc;
  }, {} as Obj);

  return { tokens };
};

export const getCSSProperties = (node: HTMLElement) => {
  const { output } = marryShorthandOutput(getOutputAndShorthandOutput(node));
  const { styles } = getCSSVariableStyles({ output });
  const { variables } = getAppliedCSSVariables({ styles });
  const { tokens } = getAppliedTokens({ styles });

  const computed = getComputedStyle(node);

  const result = Object.entries(output).reduce((acc, [property, value]) => {
    const token = tokens[property];
    const variable = variables[property];
    const variableValue = computed.getPropertyValue(variable);
    acc[property] = {
      value,
      token,
      variable,
      variableValue,
      computed: computed.getPropertyValue(property),
    };
    return acc;
  }, {} as CSSPropertiesObj);

  return {
    result,
    tokens,
    variables,
  };
};
