import { describe, it, expect, vi, beforeEach } from "vitest";
import { drawPadding } from "./drawPadding";
import { COLORS } from "./constants";
import type { Dimensions } from "./types";

describe("drawPadding", () => {
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
    drawPadding(mockContext, mockDimensions);

    expect(mockContext.fillStyle).toBe(COLORS.padding);
  });

  it("should draw the top padding rect", () => {
    drawPadding(mockContext, mockDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      101, // left + border.left
      101, // top + border.top
      98, // width - border.left - border.right
      5 // padding.top
    );
  });

  it("should draw the right padding rect", () => {
    drawPadding(mockContext, mockDimensions);

    // Check that one of the fillRect calls matches our expected parameters
    const calls = vi.mocked(mockContext.fillRect).mock.calls;
    const rightPaddingCall = calls.find(
      call => 
        call[0] === 194 && // right - padding.right - border.right
        call[1] === 106 && // top + padding.top + border.top
        call[2] === 5 && // padding.right
        call[3] === 88 // height - padding.top - padding.bottom - border.top - border.bottom
    );
    
    expect(rightPaddingCall).toBeDefined();
  });

  it("should draw the bottom padding rect", () => {
    drawPadding(mockContext, mockDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      101, // left + border.left
      194, // bottom - padding.bottom - border.bottom
      98, // width - border.left - border.right
      5 // padding.bottom
    );
  });

  it("should draw the left padding rect", () => {
    drawPadding(mockContext, mockDimensions);

    // Check that one of the fillRect calls matches our expected parameters
    const calls = vi.mocked(mockContext.fillRect).mock.calls;
    const leftPaddingCall = calls.find(
      call => 
        call[0] === 101 && // left + border.left
        call[1] === 106 && // top + padding.top + border.top
        call[2] === 5 && // padding.left
        call[3] === 88 // height - padding.top - padding.bottom - border.top - border.bottom
    );
    
    expect(leftPaddingCall).toBeDefined();
  });

  it("should handle zero padding", () => {
    const zeroPadding: Dimensions = {
      ...mockDimensions,
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    };

    drawPadding(mockContext, zeroPadding);

    // Should still call fillRect for all sides, but with zero dimensions
    expect(mockContext.fillRect).toHaveBeenCalledTimes(4);
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

    drawPadding(mockContext, zeroBorders);

    // Should still call fillRect for all sides
    expect(mockContext.fillRect).toHaveBeenCalledTimes(4);
  });
}); 