import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock the global object from @storybook/global
vi.mock("@storybook/global", () => ({
  global: {
    document: {
      documentElement: {
        scrollHeight: 1000,
        offsetHeight: 800,
        scrollWidth: 1000,
        offsetWidth: 800,
      },
      createElement: vi.fn(),
      elementFromPoint: vi.fn(),
      styleSheets: [],
      getElementById: vi.fn(),
    },
    window: {
      scrollY: 0,
      scrollX: 0,
      innerHeight: 800,
      innerWidth: 1000,
      devicePixelRatio: 1,
    },
    getComputedStyle: vi.fn(() => ({
      getPropertyValue: vi.fn(),
    })),
  },
}));
