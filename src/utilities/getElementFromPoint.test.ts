import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getElementFromPoint } from "./getElementFromPoint";
import { global } from "@storybook/global";

describe("getElementFromPoint", () => {
  let mockElement;
  let mockShadowElement;
  let mockNestedShadowElement;
  let mockStorybookRoot;

  beforeEach(() => {
    // Create fresh DOM elements for each test
    mockElement = document.createElement("div");
    mockShadowElement = document.createElement("div");
    mockNestedShadowElement = document.createElement("div");
    mockStorybookRoot = document.createElement("div");
    mockStorybookRoot.id = "storybook-root";

    // Add storybook root to DOM
    document.body.appendChild(mockStorybookRoot);

    // Mock element methods
    mockElement.matches = vi.fn().mockReturnValue(true);
    mockElement.isEqualNode = vi.fn().mockReturnValue(false);
    mockShadowElement.matches = vi.fn().mockReturnValue(true);
    mockShadowElement.isEqualNode = vi.fn().mockReturnValue(false);
    mockNestedShadowElement.matches = vi.fn().mockReturnValue(true);
    mockNestedShadowElement.isEqualNode = vi.fn().mockReturnValue(false);

    // Mock document.elementFromPoint and getElementById
    global.document.elementFromPoint = vi.fn().mockReturnValue(mockElement);
    global.document.getElementById = vi.fn().mockReturnValue(mockStorybookRoot);
  });

  afterEach(() => {
    // Clean up DOM after each test
    document.body.removeChild(mockStorybookRoot);
    vi.clearAllMocks();
  });

  it("returns null when no element is found at point", () => {
    global.document.elementFromPoint = vi.fn().mockReturnValue(null);
    const result = getElementFromPoint(10, 10);
    expect(result).toBeNull();
  });

  it("returns null when element is not within storybook root", () => {
    document.body.appendChild(mockElement);
    mockStorybookRoot.contains = vi.fn().mockReturnValue(false);
    const result = getElementFromPoint(10, 10);
    expect(result).toBeNull();
    document.body.removeChild(mockElement);
  });

  it("returns the element when it is within storybook root", () => {
    mockStorybookRoot.appendChild(mockElement);
    mockStorybookRoot.contains = vi.fn().mockReturnValue(true);
    const result = getElementFromPoint(10, 10);
    expect(result).toBe(mockElement);
    mockStorybookRoot.removeChild(mockElement);
  });

  it("handles shadow DOM elements", () => {
    mockStorybookRoot.appendChild(mockElement);
    mockStorybookRoot.contains = vi.fn().mockReturnValue(true);

    // Mock shadow root without actually creating it
    const mockShadowRoot = {
      elementFromPoint: vi.fn().mockReturnValue(mockShadowElement),
    };

    Object.defineProperty(mockElement, "shadowRoot", {
      configurable: true,
      get: () => mockShadowRoot,
    });

    // Mock that mockShadowElement is within storybook root
    mockStorybookRoot.contains = vi.fn().mockImplementation((node) => {
      return node === mockElement || node === mockShadowElement;
    });

    const result = getElementFromPoint(10, 10);
    expect(result).toBe(mockShadowElement);
    mockStorybookRoot.removeChild(mockElement);
  });

  it("returns parent element when shadow element equals root", () => {
    mockStorybookRoot.appendChild(mockElement);
    mockStorybookRoot.contains = vi.fn().mockReturnValue(true);

    // Mock shadow root without actually creating it
    const mockShadowRoot = {
      elementFromPoint: vi.fn().mockReturnValue(mockElement),
    };

    Object.defineProperty(mockElement, "shadowRoot", {
      configurable: true,
      get: () => mockShadowRoot,
    });

    mockElement.isEqualNode = vi.fn().mockReturnValue(true);

    const result = getElementFromPoint(10, 10);
    expect(result).toBe(mockElement);
    mockStorybookRoot.removeChild(mockElement);
  });

  it("handles nested shadow DOM elements", () => {
    mockStorybookRoot.appendChild(mockElement);
    mockStorybookRoot.contains = vi.fn().mockReturnValue(true);

    // Mock first level shadow root
    const mockFirstShadowRoot = {
      elementFromPoint: vi.fn().mockReturnValue(mockShadowElement),
    };

    // Mock second level shadow root
    const mockSecondShadowRoot = {
      elementFromPoint: vi.fn().mockReturnValue(mockNestedShadowElement),
    };

    Object.defineProperty(mockElement, "shadowRoot", {
      configurable: true,
      get: () => mockFirstShadowRoot,
    });

    Object.defineProperty(mockShadowElement, "shadowRoot", {
      configurable: true,
      get: () => mockSecondShadowRoot,
    });

    // Mock that all elements are within storybook root
    mockStorybookRoot.contains = vi.fn().mockImplementation((node) => {
      return (
        node === mockElement ||
        node === mockShadowElement ||
        node === mockNestedShadowElement
      );
    });

    const result = getElementFromPoint(10, 10);
    expect(result).toBe(mockNestedShadowElement);
    mockStorybookRoot.removeChild(mockElement);
  });
});
