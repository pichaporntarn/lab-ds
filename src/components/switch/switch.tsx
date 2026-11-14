"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "../../lib/utils";

type SwitchSize = "sm" | "default";

type SwitchProps = SwitchPrimitive.Root.Props & {
  size?: SwitchSize;
};

function Switch({ className, size = "default", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn("ui-switch", className)}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className="ui-switch-thumb" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
export type { SwitchProps, SwitchSize };
