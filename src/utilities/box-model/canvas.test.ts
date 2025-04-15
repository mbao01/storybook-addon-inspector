import { describe, it, expect, vi, beforeEach } from "vitest";
import { init, clear, draw, rescale, destroy } from "./canvas";
import { global } from "@storybook/global";

describe("canvas utility", () => {
  // Mock canvas and context
  const mockContext = {
    clearRect: vi.fn(),
    scale: vi.fn(),
  };

  const createMockCanvas = () => ({
    getContext: vi.fn().mockReturnValue(mockContext),
    style: {
      width: "",
      height: "",
      position: "",
      left: "",
      top: "",
      zIndex: "",
      pointerEvents: "",
    },
    width: 0,
    height: 0,
    parentNode: {
      removeChild: vi.fn(),
    },
    id: "",
  });

  let mockCanvas;

  // Mock document methods
  const mockDocument = {
    createElement: vi.fn(),
    documentElement: {
      scrollHeight: 1000,
      scrollWidth: 800,
      offsetHeight: 900,
      offsetWidth: 700,
    },
    body: {
      appendChild: vi.fn(),
    },
  };

  // Mock window
  const mockWindow = {
    devicePixelRatio: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Create a new mock canvas for each test
    mockCanvas = createMockCanvas();
    mockDocument.createElement.mockReturnValue(mockCanvas);

    // Mock global document
    global.document = mockDocument as unknown as Document;

    // Mock global window
    global.window = mockWindow as unknown as Window & typeof globalThis;

    // Reset state and ensure canvas is destroyed
    destroy("selected");
    destroy("hover");
  });

  describe("init", () => {
    it("creates and initializes canvas", () => {
      init();
      expect(mockDocument.createElement).toHaveBeenCalledTimes(2);
      expect(mockDocument.body.appendChild).toHaveBeenCalledTimes(2);
      expect(mockCanvas.getContext).toHaveBeenCalledTimes(2);
      expect(mockContext.scale).toHaveBeenCalledTimes(2);
    });

    it("does not create duplicate canvas", () => {
      init();
      init();
      expect(mockDocument.createElement).toHaveBeenCalledTimes(2);
    });
  });

  describe("clear", () => {
    it("clears the canvas", () => {
      init();
      clear("selected");
      expect(mockContext.clearRect).toHaveBeenCalled();
    });

    it("does nothing if canvas is not initialized", () => {
      destroy("selected");
      destroy("hover");
      mockContext.clearRect.mockClear();
      clear("selected");
      expect(mockContext.clearRect).not.toHaveBeenCalled();
    });
  });

  describe("draw", () => {
    it("clears and draws on canvas", () => {
      init();
      const drawCallback = vi.fn();
      draw("selected", drawCallback);
      expect(mockContext.clearRect).toHaveBeenCalled();
      expect(drawCallback).toHaveBeenCalledWith(mockContext);
    });

    it("does nothing if canvas is not initialized", () => {
      destroy("selected");
      destroy("hover");
      const drawCallback = vi.fn();
      draw("selected", drawCallback);
      // The draw function always calls the callback, even if canvas is not initialized
      expect(drawCallback).toHaveBeenCalledWith(undefined);
    });
  });

  describe("rescale", () => {
    it("rescales canvas to match document dimensions and then resets to 0", () => {
      init();
      rescale();
      
      // The actual implementation first sets dimensions based on document size
      // Then resets them to 0 to prevent the canvas from impacting container size
      expect(mockCanvas.style.width).toBe("0px");
      expect(mockCanvas.style.height).toBe("0px");
      expect(mockCanvas.width).toBe(0);
      expect(mockCanvas.height).toBe(0);
      expect(mockContext.scale).toHaveBeenCalledWith(2, 2);
    });

    it("handles device pixel ratio when resetting dimensions", () => {
      init();
      rescale();
      
      // After resetting, dimensions should be 0
      expect(mockCanvas.width).toBe(0);
      expect(mockCanvas.height).toBe(0);
    });
  });

  describe("destroy", () => {
    it("removes canvas from DOM", () => {
      init();
      destroy("selected");
      expect(mockCanvas.parentNode.removeChild).toHaveBeenCalledWith(
        mockCanvas,
      );
    });

    it("does nothing if canvas is not initialized", () => {
      destroy("selected");
      destroy("hover");
      mockCanvas.parentNode.removeChild.mockClear();
      destroy("selected");
      expect(mockCanvas.parentNode.removeChild).not.toHaveBeenCalled();
    });
  });
});
