"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-lam-terracotta-500 text-lam-cream-50 hover:bg-lam-terracotta-600 active:bg-lam-terracotta-700 focus-visible:ring-lam-terracotta-500 shadow-sm hover:shadow-md",
        secondary:
          "bg-lam-green-800 text-lam-cream-50 hover:bg-lam-green-900 active:bg-lam-green-950 focus-visible:ring-lam-green-700 shadow-sm",
        outline:
          "border-2 border-lam-green-800 text-lam-green-800 bg-transparent hover:bg-lam-green-800 hover:text-lam-cream-50 focus-visible:ring-lam-green-700",
        ghost:
          "text-lam-green-800 bg-transparent hover:bg-lam-green-800/10 focus-visible:ring-lam-green-700",
        gold:
          "bg-lam-gold-500 text-lam-green-950 hover:bg-lam-gold-600 focus-visible:ring-lam-gold-500 shadow-sm font-semibold",
        "admin-primary":
          "bg-admin-gold text-admin-bg hover:bg-amber-400 focus-visible:ring-admin-gold font-semibold shadow-glow-gold",
        "admin-ghost":
          "text-admin-muted bg-transparent hover:bg-admin-surface2 hover:text-admin-text focus-visible:ring-admin-border border border-admin-border",
        "admin-danger":
          "bg-admin-rose/10 text-admin-rose border border-admin-rose/30 hover:bg-admin-rose hover:text-white focus-visible:ring-admin-rose",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-5 text-sm rounded-lg",
        lg: "h-12 px-7 text-base rounded-xl",
        xl: "h-14 px-9 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
