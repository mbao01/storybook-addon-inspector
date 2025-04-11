import type { StorybookConfig } from "@storybook/react-vite";
import { managerEntries, previewAnnotations } from "./local-preset.js";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  managerEntries,
  previewAnnotations,
};

export default config;
