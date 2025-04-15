import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCSSProperties } from "./getCSSProperties";

describe("getCSSProperties", () => {
  let mockElement: HTMLElement;
  let mockStyleSheets: StyleSheetList;
  let mockComputedStyle: CSSStyleDeclaration;

  beforeEach(() => {
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

    // Mock CSSRule with style
    const mockRule = {
      selectorText: ".test",
      style: mockStyle,
      type: 1,
      cssText: "",
      parentRule: null,
      parentStyleSheet: null,
    } as unknown as CSSStyleRule;

    // Mock stylesheet with rules
    const mockStyleSheet = {
      cssRules: [mockRule],
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

    // Mock StyleSheetList
    mockStyleSheets = {
      length: 1,
      item: vi.fn().mockReturnValue(mockStyleSheet),
      [0]: mockStyleSheet,
      [Symbol.iterator]: function* () {
        yield mockStyleSheet;
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
    expect(result.variables["--custom-var"]).toBe("--value");
  });

  it("handles CSS tokens", () => {
    const result = getCSSProperties(mockElement);
    expect(result.tokens).toHaveProperty("--token-var");
    expect(result.tokens["--token-var"]).toBe("TEST_TOKEN");
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
