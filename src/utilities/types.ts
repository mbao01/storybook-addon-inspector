export type Obj<T = string> = Record<string, T>;

export type Point = {
  x: number;
  y: number;
};

export type CSSPropertyValue = Record<
  "value" | "token" | "computed" | "variable" | "variableValue",
  string | undefined
>;

export type CSSPropertiesObj = Obj<CSSPropertyValue>;
