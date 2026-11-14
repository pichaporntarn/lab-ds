import { render, screen } from "@testing-library/react";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders a span with slot and variant data attributes", () => {
    render(<Badge variant="success">On track</Badge>);
    const badge = screen.getByText("On track");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveClass("ui-badge");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveAttribute("data-variant", "success");
  });

  it("defaults to the default variant and merges className", () => {
    render(<Badge className="uppercase">New</Badge>);
    const badge = screen.getByText("New");
    expect(badge).toHaveAttribute("data-variant", "default");
    expect(badge).toHaveClass("ui-badge", "uppercase");
  });

  it("renders through the render prop", () => {
    render(<Badge render={<a href="#badges" />}>Link badge</Badge>);
    expect(screen.getByRole("link", { name: "Link badge" })).toHaveClass("ui-badge");
  });
});
