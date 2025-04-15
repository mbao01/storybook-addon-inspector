export type Margin = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type Padding = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type Border = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type Dimensions = {
  margin: Margin;
  padding: Padding;
  border: Border;
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
};

export type Extremities = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type FloatingAlignment = {
  x: "left" | "right";
  y: "top" | "bottom";
};

export type ElementMeasurements = Dimensions & {
  extremities: Extremities;
  floatingAlignment: FloatingAlignment;
};
