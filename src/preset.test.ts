import { describe, it, expect, vi } from "vitest";
import { viteFinal, webpack } from "./preset";

// Mock console.log to prevent output during tests
vi.spyOn(console, "log").mockImplementation(vi.fn());

describe("Preset", () => {
  describe("viteFinal", () => {
    it("returns the provided config unchanged", async () => {
      const mockConfig = { someConfig: "value" };
      const result = await viteFinal(mockConfig);
      
      expect(result).toBe(mockConfig);
      expect(console.log).toHaveBeenCalledWith("Inspector: This addon is augmenting the Vite config");
    });
  });
  
  describe("webpack", () => {
    it("returns the provided config unchanged", async () => {
      const mockConfig = { someConfig: "value" };
      const result = await webpack(mockConfig);
      
      expect(result).toBe(mockConfig);
      expect(console.log).toHaveBeenCalledWith("Inspector: This addon is augmenting the Webpack config");
    });
  });
}); 