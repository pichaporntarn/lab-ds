import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("toggles when clicked", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Remember me" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "Remember me" });
    expect(checkbox).toHaveClass("ui-checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledOnce();
  });

  it("marks disabled with data-disabled", () => {
    render(<Checkbox aria-label="Disabled" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-disabled");
  });
});
