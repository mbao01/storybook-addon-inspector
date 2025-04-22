export type CSSPropertyValue = Partial<
  Record<"value" | "computed" | "variableValue", string> &
    Record<"token" | "variable", string[]>
> & {
  property: string;
};

export type CSSPropertyPopoverProps = {
  id: string;
  tokens: CSSPropertyValue[];
  computed: CSSPropertyValue[];
  variables: CSSPropertyValue[];
  open: boolean;
};
