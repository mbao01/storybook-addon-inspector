import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { globalPackages as globalManagerPackages } from "storybook/internal/manager/globals";
import { globalPackages as globalPreviewPackages } from "storybook/internal/preview/globals";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        preview: resolve(__dirname, "src/preview.ts"),
        manager: resolve(__dirname, "src/manager.ts"),
        preset: resolve(__dirname, "src/preset.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "storybook",
        ...globalManagerPackages,
        ...globalPreviewPackages,
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          storybook: "Storybook",
        },
      },
    },
  },
});
