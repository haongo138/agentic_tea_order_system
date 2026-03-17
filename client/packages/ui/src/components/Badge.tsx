import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-lam-green-800 text-lam-cream-50 px-3 py-0.5 text-xs",
        gold: "bg-lam-gold-500 text-lam-green-950 px-3 py-0.5 text-xs",
        terracotta: "bg-lam-terracotta-500 text-white px-3 py-0.5 text-xs",
        outline:
          "border border-lam-green-800 text-lam-green-800 px-3 py-0.5 text-xs",
        new: "bg-emerald-500 text-white px-3 py-0.5 text-xs",
        seasonal: "bg-lam-gold-400 text-lam-green-950 px-3 py-0.5 text-xs",
        bestseller:
          "bg-lam-terracotta-500/10 text-lam-terracotta-600 border border-lam-terracotta-500/30 px-3 py-0.5 text-xs",
        // Admin variants
        pending:
          "bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 text-xs",
        preparing:
          "bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 text-xs",
        ready:
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-xs",
        completed:
          "bg-admin-muted/20 text-admin-muted border border-admin-border px-2.5 py-0.5 text-xs",
        cancelled:
          "bg-admin-rose/15 text-admin-rose border border-admin-rose/30 px-2.5 py-0.5 text-xs",
        bronze:
          "bg-amber-700/20 text-amber-600 border border-amber-700/30 px-3 py-0.5 text-xs",
        silver:
          "bg-slate-400/20 text-slate-500 border border-slate-400/30 px-3 py-0.5 text-xs",
        gold_tier:
          "bg-yellow-400/20 text-yellow-600 border border-yellow-400/30 px-3 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
