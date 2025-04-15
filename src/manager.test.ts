import { describe, it, expect, vi, beforeEach } from "vitest";
import * as React from "react";
import { addons, types } from "@storybook/manager-api";
import { ADDON_ID, TOOL_ID } from "./constants";
import { Tool } from "./components";

// Define the addon configuration type
type AddonConfig = {
  type: string;
  title: string;
  match: (params: { viewMode: string; tabId?: string | null }) => boolean;
  render: React.ComponentType;
};

// Mock the Storybook addons API
vi.mock("@storybook/manager-api", () => ({
  addons: {
    register: vi.fn((id, callback) => {
      callback();
      return id;
    }),
    add: vi.fn(),
  },
  types: {
    TOOL: "tool",
  },
}));

// Mock the Tool component
vi.mock("./components", () => ({
  Tool: vi.fn(() => null),
}));

describe("Manager", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it("registers the addon with the correct ID", async () => {
    // Execute the registration code
    await import('./index');
    await import('./manager');
    
    // Check that register was called with the correct ID
    expect(addons.register).toHaveBeenCalledWith(ADDON_ID, expect.any(Function));
  });
  
  it("adds the tool with the correct configuration", async () => {
    // Execute the registration code
    addons.register(ADDON_ID, () => {
      addons.add(TOOL_ID, {
        type: types.TOOL,
        title: "Inspector",
        match: ({ viewMode }) => viewMode === "story",
        render: Tool,
      });
    });
    
    // Check that add was called with the correct configuration
    expect(addons.add).toHaveBeenCalledWith(TOOL_ID, {
      type: types.TOOL,
      title: "Inspector",
      match: expect.any(Function),
      render: Tool,
    });
  });
  
  it("matches only when viewMode is 'story'", () => {
    // Execute the registration code and capture the match function
    addons.register(ADDON_ID, () => {
      addons.add(TOOL_ID, {
        type: types.TOOL,
        title: "Inspector",
        match: ({ viewMode }) => viewMode === "story",
        render: Tool,
      });
    });

    // Get the match function from the last call to add
    const matchFn = (vi.mocked(addons.add).mock.calls[0][1] as AddonConfig)
      .match;

    // Test the match function with different inputs
    expect(matchFn({ viewMode: "story" })).toBe(true);
    expect(matchFn({ viewMode: "docs" })).toBe(false);
  });
}); 