import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getPointNodeAndCSSProperties, drawHoverElementOnPoint } from "./getPointNodeAndCSSProperties";
import { getElementFromPoint } from "./getElementFromPoint";
import { getCSSProperties } from "./getCSSProperties";
import { drawHoverElement, drawSelectedElement } from "./box-model/visualizer";
import type { Obj, ObjList } from "./types";

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
    tokens: {} as ObjList,
    variables: {} as ObjList,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getElementFromPoint).mockReturnValue(mockElement);
    vi.mocked(getCSSProperties).mockReturnValue(mockCSSProperties);
    vi.mocked(drawSelectedElement).mockImplementation(vi.fn());
  });

  it("returns node and CSS properties when element is found", () => {
    const result = getPointNodeAndCSSProperties(mockPoint);
    expect(getElementFromPoint).toHaveBeenCalledWith(mockPoint.x, mockPoint.y);
    expect(getCSSProperties).toHaveBeenCalledWith(mockElement);
    expect(drawSelectedElement).toHaveBeenCalledWith(mockElement);
    expect(result).toEqual({
      node: mockElement,
      properties: mockCSSProperties.result,
    });
  });

  it("returns null values when no element is found", () => {
    vi.mocked(getElementFromPoint).mockReturnValue(null);
    const result = getPointNodeAndCSSProperties(mockPoint);
    expect(result).toEqual({ node: null, properties: null });
    expect(drawSelectedElement).not.toHaveBeenCalled();
  });

  it("handles errors gracefully", () => {
    // Mock getElementFromPoint to throw an error
    (getElementFromPoint as Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    // The function should catch the error and return null values
    const result = getPointNodeAndCSSProperties(mockPoint);
    expect(result).toEqual({ node: null, properties: null });
  });
});

describe("drawHoverElementOnPoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should draw hover element when element is found and not contained by current node", () => {
    const mockElement = document.createElement("div");
    const currentNode = document.createElement("div");
    
    vi.mocked(getElementFromPoint).mockReturnValue(mockElement);
    vi.spyOn(mockElement, "contains").mockReturnValue(false);
    
    drawHoverElementOnPoint({ x: 0, y: 0 }, currentNode);
    
    expect(drawHoverElement).toHaveBeenCalledWith(mockElement);
  });

  it("should not draw hover element when element is found and contained by current node", () => {
    const mockElement = document.createElement("div");
    const currentNode = document.createElement("div");
    
    vi.mocked(getElementFromPoint).mockReturnValue(mockElement);
    vi.spyOn(mockElement, "contains").mockReturnValue(true);
    
    drawHoverElementOnPoint({ x: 0, y: 0 }, currentNode);
    
    expect(drawHoverElement).not.toHaveBeenCalled();
  });

  it("should call draw hover element when no element is found", () => {
    vi.mocked(getElementFromPoint).mockReturnValue(null);
    
    drawHoverElementOnPoint({ x: 0, y: 0 }, document.createElement("div"));
    
    expect(drawHoverElement).toHaveBeenCalledWith(null);
  });
});
