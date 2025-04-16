import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  "ia:inline-flex ia:items-center ia:rounded-full ia:border ia:px-2.5 ia:py-0.5 ia:text-xs ia:font-semibold ia:transition-colors ia:focus:outline-none ia:focus:ring-2 ia:focus:ring-ring ia:focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "ia:border-transparent ia:bg-primary ia:text-primary-foreground ia:hover:bg-primary/80",
        secondary:
          "ia:border-transparent ia:bg-secondary ia:text-secondary-foreground ia:hover:bg-secondary/80",
        destructive:
          "ia:border-transparent ia:bg-destructive ia:text-destructive-foreground ia:hover:bg-destructive/80",
        outline: "ia:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};

