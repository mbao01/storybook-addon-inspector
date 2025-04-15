import { describe, it, expect, vi, beforeEach } from "vitest";
import { floatingAlignment } from "./floatingAlignment";
import { global } from "@storybook/global";

// Mock the global object
vi.mock("@storybook/global", () => ({
  global: {
    window: {
      scrollY: 0,
      scrollX: 0,
      innerHeight: 800,
      innerWidth: 1200,
    },
  },
}));

describe("floatingAlignment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 'right' for x when element is closer to the left edge", () => {
    const extremities = {
      top: 100,
      bottom: 200,
      left: 50,
      right: 150,
    };

    const result = floatingAlignment(extremities);

    expect(result.x).toBe("right");
  });

  it("should return 'left' for x when element is closer to the right edge", () => {
    const extremities = {
      top: 100,
      bottom: 200,
      left: 1000,
      right: 1100,
    };

    const result = floatingAlignment(extremities);

    expect(result.x).toBe("left");
  });

  it("should return 'bottom' for y when element is closer to the top edge", () => {
    const extremities = {
      top: 50,
      bottom: 150,
      left: 100,
      right: 200,
    };

    const result = floatingAlignment(extremities);

    expect(result.y).toBe("bottom");
  });

  it("should return 'top' for y when element is closer to the bottom edge", () => {
    const extremities = {
      top: 700,
      bottom: 800,
      left: 100,
      right: 200,
    };

    const result = floatingAlignment(extremities);

    expect(result.y).toBe("top");
  });

  it("should handle different scroll positions", () => {
    // Mock window scroll position
    global.window.scrollY = 100;
    global.window.scrollX = 100;

    const extremities = {
      top: 150,
      bottom: 250,
      left: 150,
      right: 250,
    };

    const result = floatingAlignment(extremities);

    // With scroll position, the element is closer to the top-left
    expect(result.x).toBe("right");
    expect(result.y).toBe("bottom");
  });

  it("should handle elements at the center of the viewport", () => {
    const extremities = {
      top: 350,
      bottom: 450,
      left: 550,
      right: 650,
    };

    const result = floatingAlignment(extremities);

    // When equidistant, it defaults to right and bottom
    expect(result.x).toBe("right");
    expect(result.y).toBe("bottom");
  });
}); 