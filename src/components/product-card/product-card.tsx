import * as React from "react";
import { cn } from "../../lib/utils";

type ProductCardSize = "default" | "sm";

type ProductCardProps = Omit<React.ComponentProps<"div">, "children"> & {
  image: string;
  imageAlt?: string;
  productName: string;
  brandName: string;
  price: number;
  currency?: string;
  size?: ProductCardSize;
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("th-TH", { style: "currency", currency }).format(price);
}

function ProductCard({
  className,
  image,
  imageAlt,
  productName,
  brandName,
  price,
  currency = "THB",
  size = "default",
  ...props
}: ProductCardProps) {
  return (
    <div
      data-slot="product-card"
      data-size={size}
      data-currency={currency}
      className={cn("ui-product-card", className)}
      {...props}
    >
      <div data-slot="product-card-media" className="ui-product-card-media">
        <img src={image} alt={imageAlt ?? productName} className="ui-product-card-image" />
      </div>
      <div data-slot="product-card-body" className="ui-product-card-body">
        <span data-slot="product-card-brand" className="ui-product-card-brand">
          {brandName}
        </span>
        <h3 data-slot="product-card-name" className="ui-product-card-name">
          {productName}
        </h3>
        <span data-slot="product-card-price" className="ui-product-card-price">
          {formatPrice(price, currency)}
        </span>
      </div>
    </div>
  );
}

export { ProductCard };
export type { ProductCardProps, ProductCardSize };
