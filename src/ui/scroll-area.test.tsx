import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollArea, ScrollBar } from "./scroll-area";

describe("ScrollArea", () => {
  it("renders scroll area with children", () => {
    render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>,
    );

    const content = screen.getByText("Content");
    expect(content).toBeInTheDocument();
  });

  it("forwards ref to scroll area element", () => {
    const ref = { current: null };
    render(
      <ScrollArea ref={ref}>
        <div>Content</div>
      </ScrollArea>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("ScrollBar", () => {
  it("renders scroll bar with vertical orientation by default", () => {
    const { asFragment } = render(
      <ScrollArea>
        <ScrollBar orientation="vertical" />
      </ScrollArea>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders scroll bar with vertical orientation", () => {
    const { asFragment } = render(
      <ScrollArea>
        <ScrollBar orientation="vertical" />
      </ScrollArea>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders scroll bar with horizontal orientation", () => {
    const { asFragment } = render(
      <ScrollArea>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
