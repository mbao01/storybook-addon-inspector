import { describe, it, expect, vi, beforeEach } from "vitest";
import { init, clear, draw, rescale, destroy } from "./canvas";
import { global } from "@storybook/global";

describe("canvas utility", () => {
  // Mock canvas and context
  const mockContext = {
    clearRect: vi.fn(),
    scale: vi.fn(),
  };

  const mockCanvas = {
    getContext: vi.fn().mockReturnValue(mockContext),
    style: {},
    width: 0,
    height: 0,
    parentNode: {
      removeChild: vi.fn(),
    },
  };

  // Mock document methods
  const mockDocument = {
    createElement: vi.fn().mockReturnValue(mockCanvas),
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

    // Mock global document
    global.document = mockDocument as any;

    // Mock global window
    global.window = mockWindow as any;

    // Reset state and ensure canvas is destroyed
    destroy();
  });

  describe("init", () => {
    it("creates and initializes canvas", () => {
      const canvas = init();
      expect(mockDocument.createElement).toHaveBeenCalledWith("canvas");
      expect(mockCanvas.getContext).toHaveBeenCalledWith("2d");
      expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockCanvas);
      expect(mockContext.scale).toHaveBeenCalledWith(2, 2);
      expect(canvas).toBe(mockCanvas);
    });

    it("does not create duplicate canvas", () => {
      const canvas1 = init();
      const canvas2 = init();
      expect(mockDocument.createElement).toHaveBeenCalledTimes(1);
      expect(canvas1).toBe(canvas2);
    });
  });

  describe("clear", () => {
    it("clears the canvas", () => {
      init();
      clear();
      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 1000);
    });

    it("does nothing if canvas is not initialized", () => {
      // Ensure canvas is destroyed first
      destroy();
      // Reset mock to ensure it's clean
      mockContext.clearRect.mockClear();
      clear();
      expect(mockContext.clearRect).not.toHaveBeenCalled();
    });
  });

  describe("draw", () => {
    it("clears and draws on canvas", () => {
      init();
      const drawCallback = vi.fn();
      draw(drawCallback);
      expect(mockContext.clearRect).toHaveBeenCalled();
      expect(drawCallback).toHaveBeenCalledWith(mockContext);
    });

    it("does nothing if canvas is not initialized", () => {
      // Ensure canvas is destroyed first
      destroy();
      // Reset mock to ensure it's clean
      mockContext.clearRect.mockClear();
      const drawCallback = vi.fn();
      draw(drawCallback);
      expect(mockContext.clearRect).not.toHaveBeenCalled();
      expect(drawCallback).not.toHaveBeenCalled();
    });
  });

  describe("rescale", () => {
    it("rescales canvas to match document dimensions", () => {
      init();
      rescale();
      expect(mockCanvas.width).toBe(1600); // 800 * 2 (devicePixelRatio)
      expect(mockCanvas.height).toBe(2000); // 1000 * 2 (devicePixelRatio)
      expect(mockContext.scale).toHaveBeenCalledWith(2, 2);
    });

    it("handles device pixel ratio", () => {
      global.window.devicePixelRatio = 3;
      init();
      rescale();
      expect(mockCanvas.width).toBe(2400); // 800 * 3 (devicePixelRatio)
      expect(mockCanvas.height).toBe(3000); // 1000 * 3 (devicePixelRatio)
      expect(mockContext.scale).toHaveBeenCalledWith(3, 3);
    });
  });

  describe("destroy", () => {
    it("removes canvas from DOM", () => {
      init();
      destroy();
      expect(mockCanvas.parentNode.removeChild).toHaveBeenCalledWith(
        mockCanvas,
      );
    });

    it("does nothing if canvas is not initialized", () => {
      destroy();
      destroy();
      expect(mockCanvas.parentNode.removeChild).not.toHaveBeenCalled();
    });
  });
});
