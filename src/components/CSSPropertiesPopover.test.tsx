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
        token: "COLOR_PRIMARY",
        computed: "rgb(255, 0, 0)",
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
    ],
    variables: [
      {
        property: "background-color",
        value: "var(--bg-color)",
        token: undefined,
        computed: "rgb(0, 0, 0)",
        variable: "--bg-color",
        variableValue: "rgb(0, 0, 0)",
      },
    ],
    open: true,
  };

  it("renders with all property groups", () => {
    const { asFragment } = render(<CSSPropertiesPopover {...mockProps} />);

    // Check section titles
    expect(screen.getByText("Tokens")).toBeInTheDocument();
    expect(screen.getByText("Variables")).toBeInTheDocument();
    expect(screen.getByText("Computed")).toBeInTheDocument();

    // Check property values
    expect(screen.getByText("color")).toBeInTheDocument();
    expect(screen.getByText("font-size")).toBeInTheDocument();
    expect(screen.getByText("background-color")).toBeInTheDocument();
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

    expect(screen.getByText("No CSS properties found")).toBeInTheDocument();
  });

  it("toggles expansion state when clicking the header button", () => {
    render(<CSSPropertiesPopover {...mockProps} />);

    const headerButton = screen.getByText("CSS Property Inspector");
    fireEvent.click(headerButton);

    // After clicking, the content should be hidden
    expect(screen.queryByText("Tokens")).not.toBeInTheDocument();

    // Click again to expand
    fireEvent.click(headerButton);
    expect(screen.getByText("Tokens")).toBeInTheDocument();
  });

  it("renders color values with color swatches", () => {
    render(<CSSPropertiesPopover {...mockProps} />);

    // Check for color swatch
    const colorSwatch = screen.getByTestId("color-swatch");
    expect(colorSwatch).toBeInTheDocument();
  });

  it("renders property sections with correct badges", () => {
    render(<CSSPropertiesPopover {...mockProps} />);

    // Check badge counts - use getAllByText and check length
    const badges = screen.getAllByText("1");
    expect(badges.length).toBeGreaterThanOrEqual(3); // At least 3 badges (one for each section)
  });

  it("toggles section expansion when clicking section headers", () => {
    render(<CSSPropertiesPopover {...mockProps} />);

    // Click on the Tokens section header
    const tokensHeader = screen.getByText("Tokens").closest("button");
    fireEvent.click(tokensHeader!);

    // The color property should be hidden
    expect(screen.queryByText("color")).not.toBeInTheDocument();

    // Click again to expand
    fireEvent.click(tokensHeader!);
    expect(screen.getByText("color")).toBeInTheDocument();
  });

  it("renders with correct CSS classes based on expansion state", () => {
    render(<CSSPropertiesPopover {...mockProps} />);

    // Initially expanded
    const popoverContent = screen.getByTestId("popover-content");
    expect(popoverContent).toHaveClass("ia:w-[350px]");

    // Click to collapse
    const headerButton = screen.getByText("CSS Property Inspector");
    fireEvent.click(headerButton);

    // Should have collapsed width
    expect(popoverContent).toHaveClass("ia:w-[172px]");
  });
});