import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CSSPropertiesPopoverShadowRoot } from "./CSSPropertiesPopoverShadowRoot";

describe("CSSPropertiesPopoverShadowRoot", () => {
  const mockProps = {
    id: "test-popover",
    tokens: [],
    computed: [],
    variables: [],
    open: true,
  };

  it("renders shadow root", () => {
    const { asFragment } = render(
      <CSSPropertiesPopoverShadowRoot {...mockProps} />,
    );

    expect(screen.getByTestId("test-popover-shadow-root")).toBeVisible();
    expect(asFragment()).toMatchSnapshot();
  });
});
