"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "../lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverPortal = PopoverPrimitive.Portal;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align, sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "ia:z-50 ia:w-72 ia:rounded-md ia:border ia:bg-popover ia:p-4 ia:text-popover-foreground ia:shadow-md ia:outline-none ia:data-[state=open]:animate-in ia:data-[state=closed]:animate-out ia:data-[state=closed]:fade-out-0 ia:data-[state=open]:fade-in-0 ia:data-[state=closed]:zoom-out-95 ia:data-[state=open]:zoom-in-95 ia:data-[side=bottom]:slide-in-from-top-2 ia:data-[side=left]:slide-in-from-right-2 ia:data-[side=right]:slide-in-from-left-2 ia:data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export {
  Popover,
  PopoverAnchor,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
};
