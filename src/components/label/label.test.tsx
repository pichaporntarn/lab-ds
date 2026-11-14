import { render, screen } from "@testing-library/react";

import { Label } from "./label";

describe("Label", () => {
  it("labels its control", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByText("Email")).toHaveClass("ui-label");
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });
});
