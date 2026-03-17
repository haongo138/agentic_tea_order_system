import * as React from "react";
import { cn } from "../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  theme?: "light" | "dark";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, theme = "light", ...props }, ref) => {
    const isLight = theme === "light";

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            className={cn(
              "text-sm font-medium",
              isLight ? "text-lam-green-800" : "text-admin-muted",
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                isLight ? "text-lam-green-600/60" : "text-admin-muted",
              )}
            >
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              isLight
                ? [
                    "border-lam-cream-300 bg-white text-lam-green-950 placeholder:text-lam-green-600/40",
                    "focus:border-lam-green-600 focus:ring-lam-green-600/20",
                    error && "border-red-400 focus:ring-red-400/20",
                  ]
                : [
                    "border-admin-border bg-admin-surface text-admin-text placeholder:text-admin-muted/50",
                    "focus:border-admin-gold/50 focus:ring-admin-gold/10",
                    error && "border-admin-rose/50 focus:ring-admin-rose/20",
                  ],
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p
            className={cn(
              "text-xs",
              isLight ? "text-red-500" : "text-admin-rose",
            )}
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
