"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "../../lib/utils";

type BadgeVariant =
  "default" | "secondary" | "destructive" | "success" | "outline" | "ghost" | "link";

type BadgeProps = useRender.ComponentProps<"span"> & {
  variant?: BadgeVariant;
};

function Badge({ className, variant = "default", render, ...props }: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn("ui-badge", className),
      },
      props,
    ),
    render,
    // Base UI renders state as data attributes: data-slot and data-variant.
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge };
export type { BadgeProps, BadgeVariant };
