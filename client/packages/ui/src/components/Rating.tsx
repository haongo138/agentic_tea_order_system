"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: RatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  const displayValue = hovered ?? value;

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="group"
      aria-label={`Rating: ${value} out of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= displayValue;
        const partial =
          !filled && starValue - 1 < displayValue && displayValue < starValue;
        const partialPercent = partial
          ? Math.round((displayValue - (starValue - 1)) * 100)
          : 0;

        return (
          <div
            key={i}
            className={cn(
              "relative",
              sizeClasses[size],
              interactive && "cursor-pointer transition-transform hover:scale-110",
            )}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHovered(starValue)}
            onMouseLeave={() => interactive && setHovered(null)}
          >
            {/* Background star */}
            <svg
              viewBox="0 0 24 24"
              className="absolute inset-0 w-full h-full"
              fill="none"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                className="fill-lam-cream-300 stroke-lam-cream-300"
                strokeWidth="1"
              />
            </svg>
            {/* Filled star */}
            {(filled || partial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : `${partialPercent}%` }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                  style={{ minWidth: sizeClasses[size].split(" ")[0].replace("w-", "") + "px" }}
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    className="fill-lam-gold-500 stroke-lam-gold-500"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
