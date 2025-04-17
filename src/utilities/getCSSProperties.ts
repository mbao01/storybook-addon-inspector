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

import type { CSSPropertiesObj, Obj, ObjList } from "./types";

const SHORTHAND_PROPERTIES = Object.keys(SHORTHAND_PROPERTIES_MAP);

const getOutputAndShorthandOutput = (node: HTMLElement) => {
  const stylesheets = document.styleSheets;
  const output: Obj = {};
  const shorthandOutput: Obj = {};

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let sIndex = 0; sIndex < stylesheets.length; sIndex++) {
    const stylesheet = stylesheets[sIndex];
    const rules = stylesheet.cssRules || stylesheet.rules;

    processCSSRules(node, rules, output, shorthandOutput);
  }

  return { output, shorthandOutput };
};

type MarryShorthandOutputParams = {
  output: Obj;
  shorthandOutput: Obj;
};

const mergeShorthandOutput = ({
  output,
  shorthandOutput,
}: MarryShorthandOutputParams) => {
  const entries = { ...output };
  const shorthandEntries = { ...shorthandOutput };
  Object.entries(shorthandOutput).forEach(([shorthand, shorthandValue]) => {
    if (shorthandValue) {
      const properties = SHORTHAND_PROPERTIES_MAP[shorthand];
      properties.forEach((property) => {
        delete entries[property];
        delete shorthandEntries[property];
      });
    }
  });

  return { output: { ...entries, ...shorthandEntries } };
};

type CSSVariableStylesParams = {
  output: Obj;
};

const getCSSVariableStyles = ({ output }: CSSVariableStylesParams) => {
  const styles = Object.entries(output).reduce((acc, [property, value]) => {
    if (value.includes("var(")) {
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
    const matches = value.toString().matchAll(/var\(([0-9a-zA-Z_\-]*)\)/gi);
    const values = [...matches].map(([, v]) => v);

    if (values.length > 0) {
      acc[property] = values;
    }

    return acc;
  }, {} as ObjList);

  return { variables };
};

type AppliedTokensParams = {
  styles: Obj;
};

const getAppliedTokens = ({ styles }: AppliedTokensParams) => {
  const tokens = Object.entries(styles).reduce((acc, [property, value]) => {
    const matches = value
      .toString()
      .matchAll(/var\(--nk-([0-9a-zA-Z_\-]*)\)/gi);
    const values = [...matches].map(([, v]) =>
      v.replaceAll("-", "_").toUpperCase(),
    );

    if (values.length > 0) {
      acc[property] = values;
    }

    return acc;
  }, {} as ObjList);

  return { tokens };
};

export const getCSSProperties = (node: HTMLElement) => {
  const { output } = mergeShorthandOutput(getOutputAndShorthandOutput(node));
  const { styles } = getCSSVariableStyles({ output });
  const { variables } = getAppliedCSSVariables({ styles });
  const { tokens } = getAppliedTokens({ styles });

  console.log("APplied tokens: ", tokens);

  const computed = getComputedStyle(node);
  const result = Object.entries(output).reduce((acc, [property, value]) => {
    const token = tokens[property];
    const variable = variables[property];
    const variableValue =
      variable?.length === 1
        ? computed.getPropertyValue(variable[0])
        : undefined;
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

const isSelectorValid = (selector: string) => {
  return selector && !selector.startsWith("--") && !selector.startsWith("*");
};

const isPropertyValid = (property: string) => {
  return !property.startsWith("--") && property !== "*";
};

const isValueValid = (value: string) => {
  return (
    value &&
    !["initial", "all", "inherit"].includes(value.toString().toLowerCase())
  );
};

const processCSSRules = (
  node: HTMLElement,
  ruleList: CSSRuleList,
  output = {},
  shorthandOutput = {},
) => {
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let rIndex = 0; rIndex < ruleList.length; rIndex++) {
    const styleRule = ruleList[rIndex] as CSSStyleRule;
    if (styleRule instanceof CSSStyleRule) {
      const { selectorText, style } = styleRule;
      const isValidSelector = isSelectorValid(selectorText);
      if (isValidSelector && node?.matches(selectorText)) {
        // Get all property names from the style object
        const properties = Array.from(style).filter((prop) =>
          style.getPropertyValue(prop),
        );

        for (const property of SHORTHAND_PROPERTIES) {
          const value = style.getPropertyValue(property);
          const isValidValue = isValueValid(value);

          if (isValidValue) {
            shorthandOutput[property] = value;
            // } else {
            // delete shorthandOutput[property];
          }
        }

        for (const property of properties) {
          // const isValidProperty = isPropertyValid(property);
          // if (isValidProperty) {
          const value = style.getPropertyValue(property);
          const isValidValue = isValueValid(value);
          if (isValidValue) {
            output[property] = value;
            // } else {
            // delete shorthandOutput[property];
          }
          // }
        }
      }
    }

    if (styleRule instanceof CSSLayerBlockRule) {
      const childRuleList =
        styleRule.cssRules || (styleRule as unknown as CSSStyleSheet).rules;
      if (childRuleList) {
        processCSSRules(node, childRuleList, output, shorthandOutput);
      }
    }
  }

  return { output, shorthandOutput };
};