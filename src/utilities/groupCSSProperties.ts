import type { CSSPropertiesObj, CSSPropertyValue } from "./types";

type GroupCSSPropertiesParams = {
  properties: CSSPropertiesObj;
};

export const groupCSSProperties = ({ properties }: GroupCSSPropertiesParams) => {
  type Item = CSSPropertyValue & { property: string };
  const computed: Item[] = [];
  const tokens: Item[] = [];
  const variables: Item[] = [];

  Object.entries(properties).forEach(([property, value]) => {
    const item = { ...value, property };
    computed.push(item);

    if (item.token) {
      tokens.push(item);
    }
    if (item.variable) {
      variables.push(item);
    }
  });

  return { tokens, computed, variables };
};
