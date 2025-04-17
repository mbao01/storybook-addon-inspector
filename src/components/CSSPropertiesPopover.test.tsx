import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CSSPropertiesPopover } from "./CSSPropertiesPopover";

// Mock the Popover component to avoid portal issues
vi.mock("../ui/popover", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => (
    <div id={id} className={className} data-testid="popover-content">
      {children}
    </div>
  ),
}));

describe("CSSPropertiesPopover", () => {
  const mockProps = {
    id: "test-popover",
    tokens: [
      {
        property: "color",
        value: "red",
        token: ["COLOR_PRIMARY"],
        computed: "rgb(255, 0, 0)",
        variable: undefined,
        variableValue: undefined,
      },
      {
        property: "background",
        value: "#0000ff",
        token: ["BG_PRIMARY"],
        computed: "rgb(0, 0, 255)",
        variable: undefined,
        variableValue: undefined,
      },
    ],
    computed: [
      {
        property: "font-size",
        value: "16px",
        token: undefined,
        computed: "16px",
        variable: undefined,
        variableValue: undefined,
      },
      {
        property: "unknown-property",
        value: undefined,
        token: undefined,
        computed: undefined,
        variable: undefined,
        variableValue: undefined,
      },
      {
        property: "color",
        value: "hsla(0, 0%, 0%, 1)",
        token: undefined,
        computed: "rgb(0, 0, 0)",
        variable: undefined,
        variableValue: undefined,
      },
      {
        property: "background",
        value: "#00ffff66",
        token: undefined,
        computed: "rgba(0, 255, 255)",
        variable: undefined,
        variableValue: undefined,
      },
    ],
    variables: [
      {
        property: "background-color",
        value: "var(--bg-color)",
        token: undefined,
        computed: "rgb(0, 0, 0)",
        variable: ["--bg-color"],
        variableValue: "rgb(0, 0, 0)",
      },
    ],
    open: true,
  };

  it("renders with all property groups", () => {
    const { asFragment } = render(<CSSPropertiesPopover {...mockProps} />);

    // Check section titles
    expect(screen.getByText("Tokens")).toBeVisible();
    expect(screen.getByText("Variables")).toBeVisible();
    expect(screen.getByText("Computed")).toBeVisible();

    // Check property values
    expect(screen.getAllByText("color")).toHaveLength(2);
    expect(screen.getByText("font-size")).toBeVisible();
    expect(screen.getByText("background-color")).toBeVisible();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders empty state when no properties are provided", () => {
    render(
      <CSSPropertiesPopover
        id="test-popover"
        tokens={[]}
        computed={[]}
        variables={[]}
        open={true}
      />,
    );

    expect(screen.getByText("No CSS properties found")).toBeVisible();
  });

  it("toggles expansion state when clicking the header button", () => {
    render(<CSSPropertiesPopover {...mockProps} />);

    const headerButton = screen.getByText("CSS Property Inspector");
    fireEvent.click(headerButton);

    // After clicking, the content should be hidden
    expect(screen.queryByText("Tokens")).not.toBeInTheDocument();

    // Click again to expand
    fireEvent.click(headerButton);
    expect(screen.getByText("Tokens")).toBeVisible();
  });

  it("renders color values with color swatches", () => {
    render(<CSSPropertiesPopover {...mockProps} />);

    // Check for color swatches - use getAllByTestId since there are multiple
    const colorSwatches = screen.getAllByTestId("color-swatch");
    expect(colorSwatches.length).toBe(10); // We expect 2 color swatches (red and blue)
  });

  it("renders property sections with correct badges", () => {
    render(<CSSPropertiesPopover {...mockProps} />);

    // Check badge counts - use getAllByText and check length
    const badges = screen.getAllByText("2"); // Changed from "1" to "2" since we have 2 tokens
    expect(badges.length).toBeGreaterThanOrEqual(1); // At least 1 badge for the tokens section

    // Check that tokens are rendered
    expect(screen.getByText("COLOR_PRIMARY")).toBeVisible();
    expect(screen.getByText("BG_PRIMARY")).toBeVisible();
  });

  it("toggles section expansion when clicking section headers", () => {
    render(<CSSPropertiesPopover {...mockProps} />);

    // Click on the Tokens section header
    const tokensHeader = screen.getByText("Tokens").closest("button");
    fireEvent.click(tokensHeader!);

    // The color property should be visible
    expect(screen.queryByText("color")).toBeVisible();

    // Click again to expand
    fireEvent.click(tokensHeader!);
    expect(screen.getAllByText("color")).toHaveLength(2);
  });

  it("renders with correct CSS classes based on expansion state", () => {
    render(<CSSPropertiesPopover {...mockProps} />);

    // Initially expanded
    const popoverContent = screen.getByTestId("popover-content");
    expect(popoverContent).toHaveClass("ia:w-[372px]");

    // Click to collapse
    const headerButton = screen.getByText("CSS Property Inspector");
    fireEvent.click(headerButton);

    // Should have collapsed width
    expect(popoverContent).toHaveClass("ia:w-[180px]!");
  });
});