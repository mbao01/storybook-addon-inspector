type Margin = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type Padding = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type Border = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type Dimensions = {
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

type Extremities = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type FloatingAlignment = {
  x: "left" | "right";
  y: "top" | "bottom";
};

type ElementMeasurements = Dimensions & {
  extremities: Extremities;
  floatingAlignment: FloatingAlignment;
};
