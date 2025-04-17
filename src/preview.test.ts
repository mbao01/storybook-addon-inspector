import { describe, it, expect } from "vitest";
import { PARAM_KEY } from "./constants";
import { withInspector } from "./withInspector";
import preview from "./preview";

describe("Preview", () => {
  it("exports the correct preview configuration", () => {
    // Check that the preview object has the expected structure
    expect(preview).toEqual({
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
    });
  });
  
  it("includes the withInspector decorator", () => {
    // Check that the decorators array includes the withInspector decorator
    expect(preview.decorators).toContain(withInspector);
  });
  
  it("sets the initial global parameter to false", () => {
    // Check that the initialGlobals object has the correct value for PARAM_KEY
    expect((preview.initialGlobals as Record<string, boolean>)[PARAM_KEY]).toBe(false);
  });
}); 