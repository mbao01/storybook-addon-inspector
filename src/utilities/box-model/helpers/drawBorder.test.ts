import { describe, it, expect, vi, beforeEach } from "vitest";
import { drawBorder } from "./drawBorder";
import { COLORS } from "./constants";
import type { Dimensions } from "./types";

describe("drawBorder", () => {
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
    drawBorder(mockContext, mockDimensions);

    expect(mockContext.fillStyle).toBe(COLORS.border);
  });

  it("should draw the top border rect", () => {
    drawBorder(mockContext, mockDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      100, // left
      100, // top
      100, // width
      1 // border.top
    );
  });

  it("should draw the bottom border rect", () => {
    drawBorder(mockContext, mockDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      100, // left
      199, // bottom - border.bottom
      100, // width
      1 // border.bottom
    );
  });

  it("should draw the left border rect", () => {
    drawBorder(mockContext, mockDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      100, // left
      101, // top + border.top
      1, // border.left
      98 // height - border.top - border.bottom
    );
  });

  it("should draw the right border rect", () => {
    drawBorder(mockContext, mockDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      199, // right - border.right
      101, // top + border.top
      1, // border.right
      98 // height - border.top - border.bottom
    );
  });

  it("should handle zero borders", () => {
    const zeroBorders: Dimensions = {
      ...mockDimensions,
      border: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    };

    drawBorder(mockContext, zeroBorders);

    // Should still call fillRect for all sides, but with zero dimensions
    expect(mockContext.fillRect).toHaveBeenCalledTimes(4);
  });

  it("should handle thick borders", () => {
    const thickBorders: Dimensions = {
      ...mockDimensions,
      border: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
    };

    drawBorder(mockContext, thickBorders);

    // Should call fillRect for all sides with thicker dimensions
    expect(mockContext.fillRect).toHaveBeenCalledTimes(4);
  });
}); 