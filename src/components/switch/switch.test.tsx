import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Switch } from "./switch";

describe("Switch", () => {
  it("toggles and exposes its size", async () => {
    render(<Switch aria-label="Reminders" size="sm" />);
    const sw = screen.getByRole("switch", { name: "Reminders" });
    expect(sw).toHaveClass("ui-switch");
    expect(sw).toHaveAttribute("data-size", "sm");
    expect(sw).toHaveAttribute("aria-checked", "false");
    await userEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("defaults to the default size", () => {
    render(<Switch aria-label="Default" />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-size", "default");
  });
});
