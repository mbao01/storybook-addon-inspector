import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "**/types.ts",
        "src/withInspector.tsx",
        "src/**/*.test.{ts,tsx}",
        "src/manager.ts",
        "src/stories",
      ],
    },
  },
});
