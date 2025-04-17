export type Obj<T = string> = Record<string, T>;

export type ObjList<T = string[]> = Record<string, T>;

export type Point = {
  x: number;
  y: number;
};

export type CSSPropertyValue = Record<
  "value" | "computed" | "variableValue",
  string | undefined
> &
  Record<"token" | "variable", string[] | undefined>;

export type CSSPropertiesObj = Obj<CSSPropertyValue>;
