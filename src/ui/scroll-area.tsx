"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "../lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("ia:relative ia:overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="ia:h-full ia:w-full ia:rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "ia:flex ia:touch-none ia:select-none ia:transition-colors ia:bg-gray-50 ia:hover:bg-gray-100 ia:dark:bg-gray-50/10 ia:dark:hover:bg-gray-100/20",
      orientation === "vertical" &&
        "ia:h-full ia:w-2.5 ia:border-l ia:border-l-transparent ia:p-[1px]",
      orientation === "horizontal" &&
        "ia:h-2.5 ia:flex-col ia:border-t ia:border-t-transparent ia:p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="ia:relative ia:flex-1 ia:rounded-full ia:bg-gray-400 ia:dark:bg-muted" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
