import { describe, it, expect } from "vitest";
import { groupCSSProperties } from "./groupCSSProperties";
import type { CSSPropertiesObj } from "./types";

describe("groupCSSProperties", () => {
  it("should group properties into tokens, computed, and variables", () => {
    const properties: CSSPropertiesObj = {
      "color": {
        value: "red",
        token: "COLOR_PRIMARY",
        computed: "rgb(255, 0, 0)",
        variable: undefined,
        variableValue: undefined
      },
      "background-color": {
        value: "var(--bg-color)",
        token: undefined,
        computed: "rgb(0, 0, 0)",
        variable: "--bg-color",
        variableValue: "rgb(0, 0, 0)"
      },
      "font-size": {
        value: "16px",
        token: undefined,
        computed: "16px",
        variable: undefined,
        variableValue: undefined
      }
    };

    const result = groupCSSProperties({ properties });

    // Check tokens array
    expect(result.tokens).toHaveLength(1);
    expect(result.tokens[0]).toEqual({
      property: "color",
      value: "red",
      token: "COLOR_PRIMARY",
      computed: "rgb(255, 0, 0)",
      variable: undefined,
      variableValue: undefined
    });

    // Check variables array
    expect(result.variables).toHaveLength(1);
    expect(result.variables[0]).toEqual({
      property: "background-color",
      value: "var(--bg-color)",
      token: undefined,
      computed: "rgb(0, 0, 0)",
      variable: "--bg-color",
      variableValue: "rgb(0, 0, 0)"
    });

    // Check computed array (should include all properties)
    expect(result.computed).toHaveLength(3);
    expect(result.computed).toEqual(expect.arrayContaining([
      expect.objectContaining({ property: "color" }),
      expect.objectContaining({ property: "background-color" }),
      expect.objectContaining({ property: "font-size" })
    ]));
  });

  it("should handle empty properties object", () => {
    const properties: CSSPropertiesObj = {};
    const result = groupCSSProperties({ properties });

    expect(result.tokens).toHaveLength(0);
    expect(result.variables).toHaveLength(0);
    expect(result.computed).toHaveLength(0);
  });

  it("should handle properties with no tokens or variables", () => {
    const properties: CSSPropertiesObj = {
      "margin": {
        value: "10px",
        token: undefined,
        computed: "10px",
        variable: undefined,
        variableValue: undefined
      },
      "padding": {
        value: "20px",
        token: undefined,
        computed: "20px",
        variable: undefined,
        variableValue: undefined
      }
    };

    const result = groupCSSProperties({ properties });

    expect(result.tokens).toHaveLength(0);
    expect(result.variables).toHaveLength(0);
    expect(result.computed).toHaveLength(2);
    expect(result.computed).toEqual(expect.arrayContaining([
      expect.objectContaining({ property: "margin" }),
      expect.objectContaining({ property: "padding" })
    ]));
  });

  it("should handle properties with both tokens and variables", () => {
    const properties: CSSPropertiesObj = {
      "color": {
        value: "var(--color)",
        token: "COLOR_PRIMARY",
        computed: "rgb(255, 0, 0)",
        variable: "--color",
        variableValue: "rgb(255, 0, 0)"
      }
    };

    const result = groupCSSProperties({ properties });

    expect(result.tokens).toHaveLength(1);
    expect(result.variables).toHaveLength(1);
    expect(result.computed).toHaveLength(1);
    expect(result.tokens[0].property).toBe("color");
    expect(result.variables[0].property).toBe("color");
    expect(result.computed[0].property).toBe("color");
  });
}); 