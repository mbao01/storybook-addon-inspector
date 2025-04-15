import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Popover,
  PopoverAnchor,
  PopoverTrigger,
  PopoverContent,
} from "./popover";

describe("Popover", () => {
  it("renders popover with trigger and content", async () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>Popover Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByText("Open Popover");
    expect(trigger).toBeInTheDocument();

    // Content should not be visible initially
    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();

    // Click trigger to show content
    await userEvent.click(trigger);
    const content = screen.getByText("Popover Content");
    expect(content).toBeInTheDocument();
  });

  it("renders with custom anchor", () => {
    render(
      <Popover>
        <PopoverAnchor>
          <div data-testid="custom-anchor">Custom Anchor</div>
        </PopoverAnchor>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>Popover Content</PopoverContent>
      </Popover>,
    );

    const anchor = screen.getByTestId("custom-anchor");
    expect(anchor).toBeInTheDocument();
  });

  it("renders content with custom alignment", async () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent align="end" sideOffset={8}>
          Aligned Content
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByText("Open Popover");
    await userEvent.click(trigger);

    const content = screen.getByText("Aligned Content");
    expect(content).toHaveAttribute("data-align", "end");
  });

  it("forwards ref to content element", async () => {
    const ref = { current: null };
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent ref={ref}>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByText("Open Popover");
    await userEvent.click(trigger);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
