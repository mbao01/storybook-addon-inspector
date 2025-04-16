import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "ia:inline-flex ia:items-center ia:justify-center ia:gap-2 ia:whitespace-nowrap ia:rounded-md ia:text-sm ia:font-medium ia:ring-offset-background ia:transition-colors ia:focus-visible:outline-none ia:focus-visible:ring-2 ia:focus-visible:ring-ring ia:focus-visible:ring-offset-2 ia:disabled:pointer-events-none ia:disabled:opacity-50 ia:[&_svg]:pointer-events-none ia:[&_svg]:size-4 ia:[&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "ia:bg-primary ia:text-primary-foreground ia:hover:bg-primary/90",
        destructive:
          "ia:bg-destructive ia:text-destructive-foreground ia:hover:bg-destructive/90",
        outline:
          "ia:border ia:border-input ia:bg-background ia:hover:bg-accent ia:hover:text-accent-foreground",
        secondary:
          "ia:bg-secondary ia:text-secondary-foreground ia:hover:bg-secondary/80",
        ghost: "ia:hover:bg-accent ia:hover:text-accent-foreground",
        link: "ia:text-primary ia:underline-offset-4 ia:hover:underline",
      },
      size: {
        default: "ia:h-10 ia:px-4 ia:py-2",
        sm: "ia:h-9 ia:rounded-md ia:px-3",
        lg: "ia:h-11 ia:rounded-md ia:px-8",
        icon: "ia:h-10 ia:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

