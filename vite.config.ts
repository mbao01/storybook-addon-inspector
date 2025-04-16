import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { globalPackages as globalManagerPackages } from "storybook/internal/manager/globals";
import { globalPackages as globalPreviewPackages } from "storybook/internal/preview/globals";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cssInjectedByJsPlugin({
      jsAssetsFilterFunction: function customJsAssetsfilterFunction(
        outputChunk,
      ) {
        return outputChunk.fileName.startsWith("preview.");
      },
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        preview: resolve(__dirname, "src/preview.ts"),
        manager: resolve(__dirname, "src/manager.tsx"),
        preset: resolve(__dirname, "src/preset.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "storybook",
        ...globalManagerPackages,
        ...globalPreviewPackages,
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          storybook: "Storybook",
          "react/jsx-runtime": "ReactJsxRuntime",
        },
      },
    },
  },
});
