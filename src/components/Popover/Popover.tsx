import React from "react";
import * as Popover from "@radix-ui/react-popover";
import type { CSSPropertiesObj, CSSPropertyValue } from "../../utilities/types";

interface PopoverDemoProps {
  tokens: (CSSPropertyValue & { property: string })[];
  computed: (CSSPropertyValue & { property: string })[];
  variables: (CSSPropertyValue & { property: string })[];
}

interface GroupedData {
  tokens: Array<CSSPropertyValue & { property: string }>;
  computed: Array<CSSPropertyValue & { property: string }>;
  variables: Array<CSSPropertyValue & { property: string }>;
}

const RESULT = {
  all: {
    value: "unset",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "",
  },
  "font-family": {
    value: '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  "font-weight": {
    value: "700",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "700",
  },
  cursor: {
    value: "pointer",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "pointer",
  },
  display: {
    value: "inline-block",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "inline-block",
  },
  "line-height": {
    value: "1",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "14px",
  },
  color: {
    value: "white",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "rgb(255, 255, 255)",
  },
  "background-color": {
    value: "var(--background)",
    token: undefined,
    variable: "--background",
    variableValue: "#8e7ffd",
    computed: "rgb(142, 127, 253)",
  },
  "font-size": {
    value: "14px",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "14px",
  },
  "margin-left": {
    value: "10px",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "10px",
  },
  border: {
    value: "0px",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "0px none rgb(255, 255, 255)",
  },
  "border-top": {
    value: "0px",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "0px none rgb(255, 255, 255)",
  },
  "border-right": {
    value: "0px",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "0px none rgb(255, 255, 255)",
  },
  "border-bottom": {
    value: "0px",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "0px none rgb(255, 255, 255)",
  },
  "border-left": {
    value: "0px",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "0px none rgb(255, 255, 255)",
  },
  "border-width": {
    value: "0px",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "0px",
  },
  "border-style": {
    value: "initial",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "none",
  },
  "border-color": {
    value: "initial",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "rgb(255, 255, 255)",
  },
  "border-radius": {
    value: "var(--nk-button-border-radius)",
    token: "BUTTON_BORDER_RADIUS",
    variable: "--nk-button-border-radius",
    variableValue: "2rem",
    computed: "32px",
  },
  "border-image": {
    value: "initial",
    token: undefined,
    variable: undefined,
    variableValue: "",
    computed: "none",
  },
  padding: {
    value: "var(--padding)",
    token: undefined,
    variable: "--padding",
    variableValue: "3rem",
    computed: "48px",
  },
};

export const PopoverDemo = ({
  tokens,
  computed,
  variables,
}: PopoverDemoProps) => {
  if (!(tokens || computed || variables)) {
    return null;
  }

  return (
    <Popover.Root defaultOpen>
      <Popover.Portal>
        <Popover.Content className="PopoverContent" sideOffset={5}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p className="Text" style={{ marginBottom: 10 }}>
              Dimensions
            </p>
            <details open>
              <summary>Tokens</summary>
              <div>
                {tokens.map(({ property, token, variableValue }) => (
                  <>
                    <span>{property}</span>:
                    <span>
                      {token} ({variableValue})
                    </span>
                  </>
                ))}
              </div>
            </details>

            <details>
              <summary>Variables</summary>
              <div>
                {variables.map(({ property, variable, variableValue }) => (
                  <>
                    <span>{property}</span>:
                    <span>
                      {variable} ({variableValue})
                    </span>
                  </>
                ))}
              </div>
            </details>

            <details>
              <summary>Computed</summary>
              <div>
                {computed.map(({ property, computed }) => (
                  <>
                    <span>{property}</span>:<span>{computed}</span>
                  </>
                ))}
              </div>
            </details>

            <fieldset className="Fieldset">
              <label className="Label" htmlFor="width">
                Width
              </label>
              <input className="Input" id="width" defaultValue="100%" />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="maxWidth">
                Max. width
              </label>
              <input className="Input" id="maxWidth" defaultValue="300px" />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="height">
                Height
              </label>
              <input className="Input" id="height" defaultValue="25px" />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="maxHeight">
                Max. height
              </label>
              <input className="Input" id="maxHeight" defaultValue="none" />
            </fieldset>
          </div>
          <Popover.Close className="PopoverClose" aria-label="Close">
            Close
          </Popover.Close>
          <Popover.Arrow className="PopoverArrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default PopoverDemo;
