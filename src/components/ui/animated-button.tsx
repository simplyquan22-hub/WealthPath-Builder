"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn("uiverse", className)}
        ref={ref}
        {...props}
      >
        <div className="wrapper">
          <span>{children}</span>
          <div className="circle circle-12"></div>
          <div className="circle circle-11"></div>
          <div className="circle circle-10"></div>
          <div className="circle circle-9"></div>
          <div className="circle circle-8"></div>
          <div className="circle circle-7"></div>
          <div className="circle circle-6"></div>
          <div className="circle circle-5"></div>
          <div className="circle circle-4"></div>
          <div className="circle circle-3"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-1"></div>
        </div>
      </Comp>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
