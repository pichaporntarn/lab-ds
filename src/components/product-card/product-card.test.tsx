import { render, screen } from "@testing-library/react";

import { ProductCard } from "./product-card";

describe("ProductCard", () => {
  it("renders image, brand, name and a formatted price", () => {
    const { container } = render(
      <ProductCard image="/p.svg" productName="Gift card" brandName="Acme" price={500} />,
    );
    const root = container.querySelector('[data-slot="product-card"]');
    expect(root).toHaveAttribute("data-size", "default");
    expect(root).toHaveAttribute("data-currency", "THB");
    expect(screen.getByRole("img", { name: "Gift card" })).toHaveAttribute("src", "/p.svg");
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Gift card" })).toBeInTheDocument();
    expect(screen.getByText(/500/)).toHaveClass("ui-product-card-price");
  });

  it("uses imageAlt, size and currency", () => {
    const { container } = render(
      <ProductCard
        image="/p.svg"
        imageAlt="Card artwork"
        productName="Gift card"
        brandName="Acme"
        price={10}
        currency="USD"
        size="sm"
      />,
    );
    expect(screen.getByRole("img", { name: "Card artwork" })).toBeInTheDocument();
    const root = container.querySelector('[data-slot="product-card"]');
    expect(root).toHaveAttribute("data-size", "sm");
    expect(root).toHaveAttribute("data-currency", "USD");
  });
});
