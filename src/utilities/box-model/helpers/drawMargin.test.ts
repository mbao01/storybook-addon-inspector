import { describe, it, expect, vi, beforeEach } from "vitest";
import { drawMargin } from "./drawMargin";
import { COLORS } from "./constants";
import type { Dimensions } from "./types";

describe("drawMargin", () => {
  const mockContext = {
    fillStyle: "",
    fillRect: vi.fn(),
  } as unknown as CanvasRenderingContext2D;

  const mockDimensions: Dimensions = {
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
    width: 100,
    height: 100,
    top: 100,
    left: 100,
    bottom: 200,
    right: 200,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set the correct fill style", () => {
    drawMargin(mockContext, mockDimensions);

    expect(mockContext.fillStyle).toBe(COLORS.margin);
  });

  it("should draw the top margin rect", () => {
    drawMargin(mockContext, mockDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      100, // left
      90, // top - margin.top
      100, // width
      10 // margin.top
    );
  });

  it("should draw the right margin rect", () => {
    drawMargin(mockContext, mockDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      200, // right
      90, // top - margin.top
      10, // margin.right
      120 // height + margin.bottom + margin.top
    );
  });

  it("should draw the bottom margin rect", () => {
    drawMargin(mockContext, mockDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      100, // left
      200, // bottom
      100, // width
      10 // margin.bottom
    );
  });

  it("should draw the left margin rect", () => {
    drawMargin(mockContext, mockDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      90, // left - margin.left
      90, // top - margin.top
      10, // margin.left
      120 // height + margin.bottom + margin.top
    );
  });

  it("should handle zero margins", () => {
    const zeroMargins: Dimensions = {
      ...mockDimensions,
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    };

    drawMargin(mockContext, zeroMargins);

    // Should still call fillRect for all sides, but with zero dimensions
    expect(mockContext.fillRect).toHaveBeenCalledTimes(4);
  });

  it("should handle negative margins", () => {
    const negativeMargins: Dimensions = {
      ...mockDimensions,
      margin: {
        top: -5,
        bottom: -5,
        left: -5,
        right: -5,
      },
    };

    drawMargin(mockContext, negativeMargins);

    // Should still call fillRect for all sides
    expect(mockContext.fillRect).toHaveBeenCalledTimes(4);
  });
}); 