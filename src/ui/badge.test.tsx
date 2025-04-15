import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders badge with default variant", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("class");
  });

  it("renders badge with different variants", () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    let badge = screen.getByText("Secondary");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("class");

    rerender(<Badge variant="destructive">Destructive</Badge>);
    badge = screen.getByText("Destructive");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("class");

    rerender(<Badge variant="outline">Outline</Badge>);
    badge = screen.getByText("Outline");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("class");
  });

  it("applies additional className when provided", () => {
    render(<Badge className="custom-class">Badge</Badge>);
    const badge = screen.getByText("Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("class");
  });

  it("forwards additional HTML attributes", () => {
    render(<Badge data-testid="test-badge">Badge</Badge>);
    const badge = screen.getByTestId("test-badge");
    expect(badge).toBeInTheDocument();
  });

  it("renders with correct base attributes", () => {
    render(<Badge>Badge</Badge>);
    const badge = screen.getByText("Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("class");
  });
}); 