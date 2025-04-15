import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getPointNodeAndCSSProperties } from "./getPointNodeAndCSSProperties";
import { getElementFromPoint } from "./getElementFromPoint";
import { getCSSProperties } from "./getCSSProperties";
import { drawSelectedElement } from "./box-model/visualizer";
import type { Obj } from "./types";

// Mock the dependencies
vi.mock("./getElementFromPoint");
vi.mock("./getCSSProperties");
vi.mock("./box-model/visualizer");

describe("getPointNodeAndCSSProperties", () => {
  const mockPoint = { x: 10, y: 10 };
  const mockElement = { id: "test-element" } as HTMLElement;
  const mockCSSProperties = {
    result: {
      color: {
        value: "red",
        token: undefined,
        computed: "computed-red",
        variable: undefined,
        variableValue: undefined,
      },
      "font-size": {
        value: "16px",
        token: undefined,
        computed: "computed-16px",
        variable: undefined,
        variableValue: undefined,
      },
    },
    tokens: {} as Obj,
    variables: {} as Obj,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getElementFromPoint).mockReturnValue(mockElement);
    vi.mocked(getCSSProperties).mockReturnValue(mockCSSProperties);
    vi.mocked(drawSelectedElement).mockImplementation(vi.fn());
  });

  it("returns CSS properties when element is found", () => {
    const result = getPointNodeAndCSSProperties(mockPoint);
    expect(getElementFromPoint).toHaveBeenCalledWith(mockPoint.x, mockPoint.y);
    expect(getCSSProperties).toHaveBeenCalledWith(mockElement);
    expect(drawSelectedElement).toHaveBeenCalledWith(mockElement);
    expect(result).toEqual(mockCSSProperties.result);
  });

  it("returns undefined when no element is found", () => {
    vi.mocked(getElementFromPoint).mockReturnValue(null);
    const result = getPointNodeAndCSSProperties(mockPoint);
    expect(result).toBeUndefined();
    expect(drawSelectedElement).not.toHaveBeenCalled();
  });

  it("handles errors gracefully", () => {
    // Mock getElementFromPoint to throw an error
    (getElementFromPoint as Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    // The function should catch the error and return undefined
    const result = getPointNodeAndCSSProperties(mockPoint);
    expect(result).toBeUndefined();
  });
});
