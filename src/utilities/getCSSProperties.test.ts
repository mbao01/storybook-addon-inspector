import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCSSProperties } from "./getCSSProperties";
class MockCSSStyleRule {
  cssRules = [];
  type = 1; // STYLE_RULE
  selectorText: string;
  style: Record<string, string>;

  constructor({
    cssRules,
    selectorText,
    style,
  }: {
    cssRules: any;
    selectorText: string;
    type: number;
    cssText: string;
    parentRule: null;
    parentStyleSheet: null;
    style: Record<string, string>;
  }) {
    this.cssRules = cssRules;
    this.selectorText = selectorText;
    this.style = style;
  }

  // Simulate setting a style property
  setProperty(property: string, value: string) {
    this.style[property] = value;
  }

  // Simulate removing a style property
  removeProperty(property: string) {
    delete this.style[property];
  }

  // toString simulation (optional)
  toString() {
    const styleString = Object.entries(this.style)
      .map(([k, v]) => `${k}: ${v};`)
      .join(" ");
    return `${this.selectorText} { ${styleString} }`;
  }
}

// Create a simple mock class
class MockCSSLayerBlockRule {
  name = "mock-layer";
  insertRule = vi.fn();
  deleteRule = vi.fn();

  cssRules = [];
  type = 0; // STYLE_RULE
  selectorText: string;
  style: Record<string, string>;

  constructor({
    cssRules,
    selectorText,
    style,
  }: {
    cssRules: any;
    selectorText: string;
    type: number;
    cssText: string;
    parentRule: null;
    parentStyleSheet: null;
    style: Record<string, string>;
  }) {
    this.cssRules = cssRules;
    this.selectorText = selectorText;
    this.style = style;
  }
}

describe("getCSSProperties", () => {
  let mockElement: HTMLElement;
  let mockStyleSheets: StyleSheetList;
  let mockComputedStyle: CSSStyleDeclaration;

  beforeEach(() => {
    // Assign to global window
    // @ts-ignore
    global.CSSStyleRule = MockCSSStyleRule;

    // Assign to global window
    // @ts-ignore
    global.CSSLayerBlockRule = MockCSSLayerBlockRule;

    // Mock element with matches method
    mockElement = {
      matches: vi.fn().mockReturnValue(true),
    } as unknown as HTMLElement;

    // Mock style object with properties and iterator
    const mockStyle = {
      color: "red",
      "font-size": "16px",
      margin: "10px",
      padding: "20px",
      "--custom-var": "var(--value)",
      "--token-var": "var(--nk-test-token)",
      getPropertyValue: vi.fn().mockImplementation((prop) => {
        const values = {
          color: "red",
          "font-size": "16px",
          margin: "10px",
          padding: "20px",
          "--custom-var": "var(--value)",
          "--token-var": "var(--nk-test-token)",
          "--value": "computed-value",
        };
        return values[prop] ?? "";
      }),
      [Symbol.iterator]: function* () {
        yield* [
          "color",
          "font-size",
          "margin",
          "padding",
          "--custom-var",
          "--token-var",
        ];
      },
    };

    const mockLayerBlockRule = new (global.CSSStyleRule as any)({
      cssRules: [],
      selectorText: ".test",
      style: { ...mockStyle, color: "pink" },
      type: 1,
      cssText: "",
      parentRule: null,
      parentStyleSheet: null,
    }) as unknown as CSSStyleRule;

    // Mock CSSRule with style
    const mockLayerBlockStyleRule = new (global.CSSLayerBlockRule as any)({
      cssRules: [mockLayerBlockRule],
      selectorText: ".test",
      type: 1,
      cssText: "",
      parentRule: null,
      parentStyleSheet: null,
    }) as unknown as CSSStyleRule;

    const mockLayerBlockStyleRule2 = new (global.CSSLayerBlockRule as any)({
      cssRules: null,
      rules: [mockLayerBlockRule],
      selectorText: ".test",
      type: 1,
      cssText: "",
      parentRule: null,
      parentStyleSheet: null,
    }) as unknown as CSSStyleRule;

    // Mock CSSRule with style
    const mockRule = new (global.CSSStyleRule as any)({
      cssRules: [],
      selectorText: ".test",
      style: mockStyle,
      type: 1,
      cssText: "",
      parentRule: null,
      parentStyleSheet: null,
    }) as unknown as CSSStyleRule;

    // Mock stylesheet with rules
    const mockStyleSheet = {
      cssRules: [mockRule, mockLayerBlockStyleRule],
      rules: [mockRule],
      ownerRule: null,
      type: "",
      href: null,
      ownerNode: null,
      parentStyleSheet: null,
      title: null,
      media: {} as MediaList,
      disabled: false,
      insertRule: vi.fn(),
      deleteRule: vi.fn(),
    } as unknown as CSSStyleSheet;

    const mockStyleSheet2 = {
      ...mockStyleSheet,
      cssRules: null,
      rules: [mockLayerBlockStyleRule2],
    };

    // Mock StyleSheetList
    mockStyleSheets = {
      length: 2,
      item: vi.fn().mockReturnValue(mockStyleSheet),
      [0]: mockStyleSheet,
      [1]: mockStyleSheet2,
      [Symbol.iterator]: function* () {
        yield mockStyleSheet;
        yield mockStyleSheet2;
      },
    } as unknown as StyleSheetList;

    // Mock document
    global.document = {
      styleSheets: mockStyleSheets,
    } as unknown as Document;

    // Mock getComputedStyle
    mockComputedStyle = {
      getPropertyValue: vi.fn().mockImplementation((prop) => {
        const values = {
          color: "computed-red",
          "font-size": "computed-16px",
          margin: "computed-10px",
          padding: "computed-20px",
          "--value": "computed-value",
          "--custom-var": "var(--value)",
          "--token-var": "var(--nk-test-token)",
        };
        return values[prop] ?? "";
      }),
    } as unknown as CSSStyleDeclaration;

    global.getComputedStyle = vi.fn().mockReturnValue(mockComputedStyle);
  });

  it("returns computed styles for matching elements", () => {
    const result = getCSSProperties(mockElement);
    expect(result.result).toHaveProperty("color");
    expect(result.result.color.value).toBe("red");
    expect(result.result.color.computed).toBe("computed-red");
  });

  it("handles CSS variables", () => {
    const result = getCSSProperties(mockElement);
    expect(result.variables).toHaveProperty("--custom-var");
    expect(result.variables["--custom-var"]).toStrictEqual(["--value"]);
  });

  it("handles CSS tokens", () => {
    const result = getCSSProperties(mockElement);
    expect(result.tokens).toHaveProperty("--token-var");
    expect(result.tokens["--token-var"]).toStrictEqual(["TEST_TOKEN"]);
  });

  it("returns empty result when no matching rules found", () => {
    vi.mocked(mockElement.matches).mockReturnValue(false);
    const result = getCSSProperties(mockElement);
    expect(result.result).toEqual({});
  });

  it("handles shorthand properties", () => {
    const result = getCSSProperties(mockElement);
    expect(result.result).toHaveProperty("margin");
    expect(result.result.margin.value).toBe("10px");
  });
});
