import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders button with default variant", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("bg-primary");
  });

  it("renders button with different variants", () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    let button = screen.getByRole("button", { name: /delete/i });
    expect(button.className).toContain("bg-destructive");

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole("button", { name: /outline/i });
    expect(button.className).toContain("border-input");

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole("button", { name: /secondary/i });
    expect(button.className).toContain("bg-secondary");

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole("button", { name: /ghost/i });
    expect(button.className).toContain("hover:bg-accent");

    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole("button", { name: /link/i });
    expect(button.className).toContain("text-primary");
  });

  it("renders button with different sizes", () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    let button = screen.getByRole("button", { name: /default/i });
    expect(button.className).toContain("h-10");

    rerender(<Button size="sm">Small</Button>);
    button = screen.getByRole("button", { name: /small/i });
    expect(button.className).toContain("h-9");

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole("button", { name: /large/i });
    expect(button.className).toContain("h-11");

    rerender(<Button size="icon">Icon</Button>);
    button = screen.getByRole("button", { name: /icon/i });
    expect(button.className).toContain("w-10");
  });

  it("renders as child when asChild prop is true", () => {
    render(
      <Button asChild>
        <a href="#">Link Button</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
  });

  it("forwards ref to button element", () => {
    const ref = { current: null };
    render(<Button ref={ref}>Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("applies additional className when provided", () => {
    render(<Button className="custom-class">Button</Button>);
    const button = screen.getByRole("button", { name: /button/i });
    expect(button.className).toContain("custom-class");
  });
}); 