
"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

interface CustomRadioProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
    onCheckedChange: (checked: boolean) => void;
}

export const CustomRadio = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  CustomRadioProps
>(({ className, onCheckedChange, ...props }, ref) => {
  return (
    <label className="custom-radio">
        <RadioGroupPrimitive.Item
            ref={ref}
            {...props}
            onCheckedChange={onCheckedChange}
        />
        <div className="checkmark"></div>
    </label>
  );
});
CustomRadio.displayName = "CustomRadio";
