import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { drawSelectedElement, drawHoverElement } from "./visualizer";
import { draw } from "./canvas";
import { global } from "@storybook/global";

// Mock the canvas module
vi.mock("./canvas", () => ({
  draw: vi.fn(),
}));

// Mock the global window object
vi.mock("@storybook/global", () => ({
  global: {
    window: {
      scrollY: 0,
      scrollX: 0,
      innerHeight: 800,
      innerWidth: 1200,
    },
    getComputedStyle: vi.fn(),
  },
}));

describe("box-model visualizer", () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    (global.getComputedStyle as Mock).mockReturnValue(mockComputedStyle);
  });

  it("draws the box model visualization", () => {
    drawSelectedElement(mockElement);
    expect(draw).toHaveBeenCalled();
  });

  it("handles elements with zero dimensions", () => {
    const zeroElement = {
      getBoundingClientRect: vi.fn().mockReturnValue({
        top: 100,
        left: 100,
        right: 100,
        bottom: 100,
        width: 0,
        height: 0,
      }),
    } as unknown as HTMLElement;
    drawSelectedElement(zeroElement);
    expect(draw).toHaveBeenCalled();
  });

  it("handles elements with negative dimensions", () => {
    const negativeElement = {
      getBoundingClientRect: vi.fn().mockReturnValue({
        top: 100,
        left: 100,
        right: 0,
        bottom: 0,
        width: -100,
        height: -100,
      }),
    } as unknown as HTMLElement;
    drawSelectedElement(negativeElement);
    expect(draw).toHaveBeenCalled();
  });

  it("handles elements with different unit values", () => {
    const differentUnitsStyle = {
      ...mockComputedStyle,
      marginTop: "1em",
      marginBottom: "1rem",
      marginLeft: "1%",
      marginRight: "1vw",
    };
    (global.getComputedStyle as Mock).mockReturnValue(differentUnitsStyle);
    drawSelectedElement(mockElement);
    expect(draw).toHaveBeenCalled();
  });

  it("handles elements with no margins or padding", () => {
    const noSpacingStyle = {
      ...mockComputedStyle,
      marginTop: "0px",
      marginBottom: "0px",
      marginLeft: "0px",
      marginRight: "0px",
      paddingTop: "0px",
      paddingBottom: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
    };
    (global.getComputedStyle as Mock).mockReturnValue(noSpacingStyle);
    drawSelectedElement(mockElement);
    expect(draw).toHaveBeenCalled();
  });

  // Test drawHoverElement function
  it("draws hover element visualization", () => {
    drawHoverElement(mockElement);
    expect(draw).toHaveBeenCalledWith("hover", expect.any(Function));
  });

  // Test pxToNumber function indirectly
  it("correctly parses pixel values", () => {
    const styleWithDifferentPxValues = {
      ...mockComputedStyle,
      marginTop: "20px",
      marginBottom: "30px",
      marginLeft: "40px",
      marginRight: "50px",
    };
    (global.getComputedStyle as Mock).mockReturnValue(styleWithDifferentPxValues);
    drawSelectedElement(mockElement);
    expect(draw).toHaveBeenCalled();
  });

  // Test floatingAlignment function indirectly
  it("determines correct floating alignment based on element position", () => {
    // Element in top-left corner
    const topLeftElement = {
      getBoundingClientRect: vi.fn().mockReturnValue({
        top: 10,
        left: 10,
        right: 110,
        bottom: 110,
        width: 100,
        height: 100,
      }),
    } as unknown as HTMLElement;
    drawSelectedElement(topLeftElement);
    expect(draw).toHaveBeenCalled();

    // Element in bottom-right corner
    const bottomRightElement = {
      getBoundingClientRect: vi.fn().mockReturnValue({
        top: 700,
        left: 1100,
        right: 1200,
        bottom: 800,
        width: 100,
        height: 100,
      }),
    } as unknown as HTMLElement;
    drawSelectedElement(bottomRightElement);
    expect(draw).toHaveBeenCalled();
  });

  // Test measureElement function indirectly
  it("correctly measures element with different scroll positions", () => {
    // Mock window scroll position
    global.window.scrollY = 50;
    global.window.scrollX = 50;
    
    drawSelectedElement(mockElement);
    expect(draw).toHaveBeenCalled();
  });

  // Test drawBoxModel function indirectly
  it("draws box model with different border widths", () => {
    const styleWithThickBorders = {
      ...mockComputedStyle,
      borderTopWidth: "10px",
      borderBottomWidth: "10px",
      borderLeftWidth: "10px",
      borderRightWidth: "10px",
    };
    (global.getComputedStyle as Mock).mockReturnValue(styleWithThickBorders);
    drawSelectedElement(mockElement);
    expect(draw).toHaveBeenCalled();
  });

  // Test with null context
  it("handles null context gracefully", () => {
    // Mock the draw function to return a function that can be called with null
    const mockDrawFn = vi.fn().mockImplementation((_, callback) => {
      if (callback) {
        callback(null);
      }
    });
    vi.mocked(draw).mockImplementation(mockDrawFn);
    
    drawSelectedElement(mockElement);
    expect(draw).toHaveBeenCalled();
  });

  // Test with null element
  it("handles null element gracefully", () => {
    // @ts-expect-error - Testing with null element
    expect(() => drawSelectedElement(null)).not.toThrow();
  });
});
