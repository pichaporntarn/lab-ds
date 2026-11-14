import { render, screen } from "@testing-library/react";

import { Progress, ProgressLabel, ProgressValue } from "./progress";

describe("Progress", () => {
  it("renders a progressbar with its label, value and track", () => {
    const { container } = render(
      <Progress value={42}>
        <ProgressLabel>Calories</ProgressLabel>
        <ProgressValue />
      </Progress>,
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveClass("ui-progress");
    expect(screen.getByText("Calories")).toHaveClass("ui-progress-label");
    expect(container.querySelector('[data-slot="progress-indicator"]')).toHaveClass(
      "ui-progress-indicator",
    );
  });
});
