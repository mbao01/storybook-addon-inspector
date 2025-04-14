import type { Preview } from "@storybook/react";
import "../src/stylesheets/index.css";


const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  initialGlobals: {
    background: { value: "light" },
  },
};

export default preview;
