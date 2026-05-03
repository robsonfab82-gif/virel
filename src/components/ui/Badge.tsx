import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium text-xs px-2.5 py-0.5",
  {
    variants: {
      variant: {
        success: "bg-green-500/15 text-green-400 border border-green-500/20",
        warning: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
        error: "bg-red-500/15 text-red-400 border border-red-500/20",
        info: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
        purple: "bg-virel-purple-500/15 text-virel-purple-300 border border-virel-purple-500/20",
        ghost: "bg-white/10 text-white/70 border border-white/10",
      },
    },
    defaultVariants: {
      variant: "purple",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
