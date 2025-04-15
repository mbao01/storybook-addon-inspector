import { describe, it, expect, vi, beforeEach } from "vitest";
import { measureElement } from "./measureElement";
import { floatingAlignment } from "./floatingAlignment";
import { global } from "@storybook/global";

// Mock the global object
vi.mock("@storybook/global", () => ({
  global: {
    getComputedStyle: vi.fn(),
    window: {
      scrollY: 0,
      scrollX: 0,
      innerHeight: 800,
      innerWidth: 1200,
    },
  },
}));

// Mock the floatingAlignment function
vi.mock("./floatingAlignment", () => ({
  floatingAlignment: vi.fn(),
}));

describe("measureElement", () => {
  const mockElement = {
    getBoundingClientRect: vi.fn().mockReturnValue({
      top: 100,
      left: 100,
      right: 300,
      bottom: 200,
      width: 200,
      height: 100,
    }),
  } as unknown as HTMLElement;

  const mockComputedStyle = {
    marginTop: "10px",
    marginBottom: "10px",
    marginLeft: "10px",
    marginRight: "10px",
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingLeft: "5px",
    paddingRight: "5px",
    borderTopWidth: "1px",
    borderBottomWidth: "1px",
    borderLeftWidth: "1px",
    borderRightWidth: "1px",
  };

  const mockFloatingAlignment = {
    x: "left" as const,
    y: "top" as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(global.getComputedStyle).mockReturnValue(mockComputedStyle as CSSStyleDeclaration);
    vi.mocked(floatingAlignment).mockReturnValue(mockFloatingAlignment);
  });

  it("should measure an element correctly", () => {
    const result = measureElement(mockElement);

    expect(mockElement.getBoundingClientRect).toHaveBeenCalled();
    expect(global.getComputedStyle).toHaveBeenCalledWith(mockElement);
    expect(floatingAlignment).toHaveBeenCalled();

    expect(result).toEqual({
      margin: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5,
      },
      border: {
        top: 1,
        bottom: 1,
        left: 1,
        right: 1,
      },
      top: 100,
      left: 100,
      bottom: 200,
      right: 300,
      width: 200,
      height: 100,
      extremities: {
        top: 90,
        bottom: 210,
        left: 90,
        right: 310,
      },
      floatingAlignment: mockFloatingAlignment,
    });
  });

  it("should handle different scroll positions", () => {
    // Mock window scroll position
    (global.window as any).scrollY = 50;
    (global.window as any).scrollX = 50;

    const result = measureElement(mockElement);

    expect(result.top).toBe(150); // 100 + 50
    expect(result.left).toBe(150); // 100 + 50
    expect(result.bottom).toBe(250); // 200 + 50
    expect(result.right).toBe(350); // 300 + 50
  });

  it("should handle different unit values", () => {
    const differentUnitsStyle = {
      ...mockComputedStyle,
      marginTop: "1em",
      marginBottom: "1rem",
      marginLeft: "1%",
      marginRight: "1vw",
    };
    vi.mocked(global.getComputedStyle).mockReturnValue(differentUnitsStyle as CSSStyleDeclaration);

    const result = measureElement(mockElement);

    // The pxToNumber function should handle these values by extracting the numeric part
    expect(result.margin.top).toBe(1);
    expect(result.margin.bottom).toBe(1);
    expect(result.margin.left).toBe(1);
    expect(result.margin.right).toBe(1);
  });

  it("should handle zero values", () => {
    const zeroStyle = {
      ...mockComputedStyle,
      marginTop: "0px",
      marginBottom: "0px",
      marginLeft: "0px",
      marginRight: "0px",
      paddingTop: "0px",
      paddingBottom: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
      borderTopWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderRightWidth: "0px",
    };
    vi.mocked(global.getComputedStyle).mockReturnValue(zeroStyle as CSSStyleDeclaration);

    const result = measureElement(mockElement);

    expect(result.margin).toEqual({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
    expect(result.padding).toEqual({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
    expect(result.border).toEqual({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
  });
}); 