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
          color: "computed-red",
          "font-size": "computed-16px",
          margin: "computed-10px",
          padding: "computed-20px",
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
    };

    // Mock StyleSheet with rules
    const mockStyleSheet = {
      cssRules: [mockRule],
    };

    // Mock StyleSheetList with array-like behavior
    mockStyleSheets = {
      length: 1,
      item: vi.fn().mockReturnValue(mockStyleSheet),
      [0]: mockStyleSheet,
    } as unknown as StyleSheetList;

    // Mock computed style
    mockComputedStyle = {
      getPropertyValue: vi.fn().mockImplementation((prop) => {
        const values = {
          color: "computed-red",
          "font-size": "computed-16px",
          margin: "computed-10px",
          padding: "computed-20px",
          "--value": "computed-value",
        };
        return values[prop] ?? "";
      }),
    } as unknown as CSSStyleDeclaration;

    // Setup document and window mocks
    Object.defineProperty(document, "styleSheets", {
      get: () => mockStyleSheets,
      configurable: true,
    });
    window.getComputedStyle = vi.fn().mockReturnValue(mockComputedStyle);

    // Clear all mocks
    vi.clearAllMocks();
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
    (mockElement.matches as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const result = getCSSProperties(mockElement);
    expect(result.result).toEqual({});
    expect(result.variables).toEqual({});
    expect(result.tokens).toEqual({});
  });

  it("handles shorthand properties", () => {
    const result = getCSSProperties(mockElement);
    expect(result.result).toHaveProperty("margin");
    expect(result.result.margin.value).toBe("10px");
  });
});
