import { describe, it, expect, vi, beforeEach } from "vitest";
import { drawContent } from "./drawContent";
import { COLORS } from "./constants";
import type { Dimensions } from "./types";

describe("drawContent", () => {
  const mockContext = {
    fillStyle: "",
    fillRect: vi.fn(),
    canvas: {
      style: {
        touchAction: "",
        pointerEvents: "",
      },
    },
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
    drawContent(mockContext, mockDimensions);

    expect(mockContext.fillStyle).toBe(COLORS.content);
  });

  it("should draw the content rect with correct dimensions", () => {
    drawContent(mockContext, mockDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      100, // left
      100, // top
      100, // width
      100 // height
    );
  });

  it("should set the correct canvas styles", () => {
    drawContent(mockContext, mockDimensions);

    expect(mockContext.canvas.style.touchAction).toBe("none");
    expect(mockContext.canvas.style.pointerEvents).toBe("none");
  });

  it("should handle zero dimensions", () => {
    const zeroDimensions: Dimensions = {
      ...mockDimensions,
      width: 0,
      height: 0,
    };

    drawContent(mockContext, zeroDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      100, // left
      100, // top
      0, // width
      0 // height
    );
  });

  it("should handle negative dimensions", () => {
    const negativeDimensions: Dimensions = {
      ...mockDimensions,
      width: -50,
      height: -50,
    };

    drawContent(mockContext, negativeDimensions);

    expect(mockContext.fillRect).toHaveBeenCalledWith(
      100, // left
      100, // top
      -50, // width
      -50 // height
    );
  });
}); 