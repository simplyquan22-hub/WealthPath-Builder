
"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

const CustomRadio = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("custom-radio", className)}>
        <RadioGroupPrimitive.Item ref={ref} {...props} />
        <div className="checkmark"></div>
    </div>
  );
});
CustomRadio.displayName = "CustomRadio";

export { CustomRadio };
