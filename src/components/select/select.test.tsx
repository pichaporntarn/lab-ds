import { render, screen } from "@testing-library/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const meals = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
];

describe("Select", () => {
  it("renders the trigger with the selected value", () => {
    render(
      <Select items={meals} defaultValue="lunch">
        <SelectTrigger className="w-full" aria-label="Meal">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Meal type</SelectLabel>
            {meals.map((meal) => (
              <SelectItem key={meal.value} value={meal.value}>
                {meal.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Meal" });
    expect(trigger).toHaveClass("ui-select-trigger", "w-full");
    expect(trigger).toHaveAttribute("data-size", "default");
    expect(trigger).toHaveTextContent("Lunch");
  });
});
