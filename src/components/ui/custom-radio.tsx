
"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

const CustomRadio = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <div className="custom-radio">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(className)}
        {...props}
      />
      <div className="checkmark"></div>
    </div>
  );
});
CustomRadio.displayName = "CustomRadio";

export { CustomRadio };
