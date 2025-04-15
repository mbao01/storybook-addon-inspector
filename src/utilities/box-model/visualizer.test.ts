import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { drawSelectedElement } from "./visualizer";
import { draw } from "./canvas";
import { global } from "@storybook/global";

// Mock the canvas module
vi.mock("./canvas", () => ({
  draw: vi.fn(),
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
});
