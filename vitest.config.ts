import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/inspector/**/*.{ts,tsx}"],
      exclude: ["src/inspector/**/*.d.ts", "src/inspector/**/*.test.{ts,tsx}"],
    },
  },
});
