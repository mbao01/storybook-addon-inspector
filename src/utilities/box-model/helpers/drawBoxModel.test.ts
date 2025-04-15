import { describe, it, expect, vi, beforeEach } from "vitest";
import { drawBoxModel } from "./drawBoxModel";
import { drawMargin } from "./drawMargin";
import { drawPadding } from "./drawPadding";
import { drawBorder } from "./drawBorder";
import { measureElement } from "./measureElement";
import type { ElementMeasurements } from "./types";

// Mock the helper functions
vi.mock("./drawMargin", () => ({
  drawMargin: vi.fn(),
}));

vi.mock("./drawPadding", () => ({
  drawPadding: vi.fn(),
}));

vi.mock("./drawBorder", () => ({
  drawBorder: vi.fn(),
}));

vi.mock("./measureElement", () => ({
  measureElement: vi.fn(),
}));

describe("drawBoxModel", () => {
  const mockElement = {} as HTMLElement;
  const mockContext = {} as CanvasRenderingContext2D;
  const mockMeasurements: ElementMeasurements = {
    margin: { top: 10, bottom: 10, left: 10, right: 10 },
    padding: { top: 5, bottom: 5, left: 5, right: 5 },
    border: { top: 1, bottom: 1, left: 1, right: 1 },
    width: 100,
    height: 100,
    top: 100,
    left: 100,
    bottom: 200,
    right: 200,
    extremities: {
      top: 90,
      bottom: 210,
      left: 90,
      right: 210,
    },
    floatingAlignment: {
      x: "left" as const,
      y: "top" as const,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(measureElement).mockReturnValue(mockMeasurements);
  });

  it("should return a function that draws the box model when called with context", () => {
    const drawFn = drawBoxModel(mockElement);
    drawFn(mockContext);

    expect(measureElement).toHaveBeenCalledWith(mockElement);
    expect(drawMargin).toHaveBeenCalledWith(mockContext, mockMeasurements);
    expect(drawPadding).toHaveBeenCalledWith(mockContext, mockMeasurements);
    expect(drawBorder).toHaveBeenCalledWith(mockContext, mockMeasurements);
  });

  it("should not draw anything when called without context", () => {
    const drawFn = drawBoxModel(mockElement);
    drawFn(undefined);

    expect(measureElement).not.toHaveBeenCalled();
    expect(drawMargin).not.toHaveBeenCalled();
    expect(drawPadding).not.toHaveBeenCalled();
    expect(drawBorder).not.toHaveBeenCalled();
  });

  it("should not draw anything when element is null", () => {
    // @ts-expect-error - Testing with null element
    const drawFn = drawBoxModel(null);
    drawFn(mockContext);

    expect(measureElement).not.toHaveBeenCalled();
    expect(drawMargin).not.toHaveBeenCalled();
    expect(drawPadding).not.toHaveBeenCalled();
    expect(drawBorder).not.toHaveBeenCalled();
  });
}); 