// import { definePreview } from "storybook/preview-api";

// import { PARAM_KEY } from "./constants";
// import { withInspector } from "./withInspector";

// export const decorators = [withInspector];

// export const initialGlobals = {
//   [PARAM_KEY]: false,
// };

// export default () =>
//   definePreview({
//     decorators,
//     initialGlobals,
//   });

/**
 * A decorator is a way to wrap a story in extra “rendering” functionality. Many addons define decorators
 * in order to augment stories:
 * - with extra rendering
 * - gather details about how a story is rendered
 *
 * When writing stories, decorators are typically used to wrap stories with extra markup or context mocking.
 *
 * https://storybook.js.org/docs/react/writing-stories/decorators
 */
import type { ProjectAnnotations, Renderer } from "@storybook/types";

import { PARAM_KEY } from "./constants";
import { withInspector } from "./withInspector";

/**
 * Note: if you want to use JSX in this file, rename it to `preview.tsx`
 * and update the entry prop in vite.config.ts to use "src/preview.tsx",
 */

const preview: ProjectAnnotations<Renderer> = {
  decorators: [withInspector],
  globals: {
    [PARAM_KEY]: false,
  },
  globalTypes: {
    [PARAM_KEY]: {
      name: PARAM_KEY,
      description: "Enable or disable the inspector addon",
      control: "boolean",
    },
  },
  initialGlobals: {
    [PARAM_KEY]: false,
  },
};

export default preview;
