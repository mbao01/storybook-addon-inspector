import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Tool } from "./Tool";
import { PARAM_KEY } from "./constants";

// Mock Storybook hooks
const mockUpdateGlobals = vi.fn();
const mockSetAddonShortcut = vi.fn();
let mockGlobals = { [PARAM_KEY]: false };

vi.mock("@storybook/manager-api", () => ({
  useGlobals: () => [mockGlobals, mockUpdateGlobals],
  useStorybookApi: () => ({
    setAddonShortcut: mockSetAddonShortcut,
  }),
}));

// Mock Storybook components
vi.mock("@storybook/icons", () => ({
  EyeIcon: () => <div data-testid="eye-icon" />,
}));

vi.mock("@storybook/components", () => ({
  IconButton: ({
    children,
    onClick,
    active,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
  }) => (
    <button onClick={onClick} data-testid="tool-button" data-active={active}>
      {children}
    </button>
  ),
}));

describe("Tool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGlobals = { [PARAM_KEY]: false };
  });

  it("renders the eye icon button", () => {
    const { getByTestId } = render(<Tool />);
    expect(getByTestId("tool-button")).toBeInTheDocument();
    expect(getByTestId("eye-icon")).toBeInTheDocument();
  });

  it("toggles inspector when clicked", () => {
    const { getByTestId } = render(<Tool />);
    fireEvent.click(getByTestId("tool-button"));
    expect(mockUpdateGlobals).toHaveBeenCalledWith({ [PARAM_KEY]: true });
  });

  it("registers keyboard shortcut on mount", () => {
    render(<Tool />);
    expect(mockSetAddonShortcut).toHaveBeenCalledWith(
      "storybook-addon-inspector",
      expect.objectContaining({
        label: "Toggle Inspector [P]",
        defaultShortcut: ["P"],
        actionName: "inspector",
        showInMenu: false,
      }),
    );
  });

  it("updates shortcut when toggle function changes", () => {
    const { rerender } = render(<Tool />);
    expect(mockSetAddonShortcut).toHaveBeenCalledTimes(1);

    // Force a re-render with new globals
    mockGlobals = { [PARAM_KEY]: true };
    rerender(<Tool key="force-rerender" />);
    expect(mockSetAddonShortcut).toHaveBeenCalledTimes(2);
  });
});
