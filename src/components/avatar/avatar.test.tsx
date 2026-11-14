import { render, screen } from "@testing-library/react";

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "./avatar";

describe("Avatar", () => {
  it("renders the fallback with size data attribute", () => {
    const { container } = render(
      <Avatar size="lg" className="ring-2">
        <AvatarFallback>PS</AvatarFallback>
        <AvatarBadge />
      </Avatar>,
    );
    const root = container.querySelector('[data-slot="avatar"]');
    expect(root).toHaveAttribute("data-size", "lg");
    expect(root).toHaveClass("ui-avatar", "ring-2");
    expect(screen.getByText("PS")).toHaveClass("ui-avatar-fallback");
    expect(container.querySelector('[data-slot="avatar-badge"]')).toHaveClass("ui-avatar-badge");
  });

  it("defaults to the default size", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute("data-size", "default");
  });

  it("renders a group with a count", () => {
    render(
      <AvatarGroup>
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>,
    );
    expect(screen.getByText("+4")).toHaveClass("ui-avatar-group-count");
  });
});
