
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, icon, value, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          {React.cloneElement(icon as React.ReactElement, {
            className: "h-4 w-4 text-muted-foreground",
          })}
        </div>
        <Input
          ref={ref}
          value={value ?? ""}
          className={cn("pl-10 h-12 text-base md:text-sm", className)}
          {...props}
        />
      </div>
    );
  }
);
IconInput.displayName = "IconInput";

export { IconInput };
