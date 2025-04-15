import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "./separator";

describe("Separator", () => {
  it("renders separator with horizontal orientation by default", () => {
    render(<Separator decorative={false} />);
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("renders separator with vertical orientation", () => {
    render(<Separator orientation="vertical" decorative={false} />);
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });

  it("forwards ref to separator element", () => {
    const ref = { current: null };
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("sets decorative prop correctly", () => {
    const { rerender } = render(<Separator decorative={false} />);
    let separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");

    // When decorative is false, the separator should be in the accessibility tree
    expect(separator).toBeInTheDocument();

    rerender(<Separator decorative={true} />);
    separator = screen.getByRole("none");

    // When decorative is true, the separator should still be in the accessibility tree
    // but with a different role
    expect(separator).toBeInTheDocument();
  });
});
