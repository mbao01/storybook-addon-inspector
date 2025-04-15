"use client";

import React from "react";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Code,
  Paintbrush,
  Variable,
} from "lucide-react";

import { Popover, PopoverContent } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "../lib/utils";

type CSSPropertyValue = Record<
  "value" | "token" | "computed" | "variable" | "variableValue",
  string | undefined
> & {
  property: string;
};

type Data = {
  tokens: CSSPropertyValue[];
  computed: CSSPropertyValue[];
  variables: CSSPropertyValue[];
};

type CSSPropertyPopoverProps = {
  id: string;
  data: Data;
  open: boolean;
};

export const CSSPropertiesPopover = ({
  id,
  data,
  open,
}: CSSPropertyPopoverProps) => {
  const [isExpanded, setExpanded] = useState(true);

  const tokens = data.tokens ?? [];
  const computed = data.computed ?? [];
  const variables = data.variables ?? [];

  const hasNoProperties =
    tokens.length === 0 && variables.length === 0 && computed.length === 0;

  return (
    <Popover open={open}>
      <PopoverContent
        id={id}
        className={cn(
          "fixed top-9 right-1 z-50 w-[350px] p-0 bg-white dark:bg-gray-900 rounded-tl-none!",
          {
            "border-gray-200 dark:border-gray-800": isExpanded,
            "w-[172px]": !isExpanded,
          },
        )}
      >
        <div className="relative">
          <div className="absolute -top-7.5 left-0 right-4 flex items-center w-[172px]">
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="bg-white dark:bg-gray-900 text-gray-900/60 dark:text-white/60 px-3 py-1.5 -ml-px text-xs font-medium rounded-t-lg border border-gray-200 dark:border-gray-800 border-b-0 cursor-pointer"
            >
              CSS Property Inspector{" "}
              {isExpanded ? (
                <ChevronDown className="size-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronRight className="size-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="relative h-[400px]">
              <ScrollArea className="h-full pr-3">
                <div className="space-y-1">
                  {tokens.length > 0 && (
                    <PropertySection
                      title="Tokens"
                      icon={<Paintbrush className="size-4 text-emerald-500" />}
                      properties={tokens}
                    />
                  )}

                  {variables.length > 0 && (
                    <>
                      {tokens.length > 0 && (
                        <Separator className="my-1 bg-gray-200 dark:bg-gray-800" />
                      )}
                      <PropertySection
                        title="Variables"
                        icon={<Variable className="size-4 text-violet-500" />}
                        properties={variables}
                      />
                    </>
                  )}

                  {computed.length > 0 && (
                    <>
                      {(tokens.length > 0 || variables.length > 0) && (
                        <Separator className="my-1 bg-gray-200 dark:bg-gray-800" />
                      )}
                      <PropertySection
                        title="Computed"
                        icon={<Code className="size-4 text-sky-500" />}
                        properties={computed}
                      />
                    </>
                  )}

                  {hasNoProperties && (
                    <div className="py-6 text-sm text-center text-gray-500 dark:text-gray-400">
                      No CSS properties found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

type PropertySectionProps = {
  title: string;
  icon: React.ReactNode;
  properties: CSSPropertyValue[];
};

const PropertySection = ({ title, icon, properties }: PropertySectionProps) => {
  const [isExpanded, setExpanded] = useState(true);
  return (
    <div className="w-full">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="sticky top-0 z-10 bg-white dark:bg-gray-900 w-full px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
        type="button"
      >
        {isExpanded ? (
          <ChevronDown className="size-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="size-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        )}
        {icon}
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <Badge
          variant="outline"
          className="ml-auto border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
        >
          {properties.length}
        </Badge>
      </button>

      {isExpanded && (
        <div className="space-y-2 px-4 py-2">
          {properties.map((prop, index) => (
            <PropertyItem key={`${prop.property}-${index}`} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
};

const PropertyItem = ({ property }: { property: CSSPropertyValue }) => {
  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-800 p-2 text-sm bg-white dark:bg-gray-900">
      <div className="font-medium text-gray-900 dark:text-white">
        {property.property}
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-xs">
        {property.value && (
          <>
            <span className="text-gray-500 dark:text-gray-400">Value:</span>
            <ColorValue value={property.value} />
          </>
        )}
        {property.token && (
          <>
            <span className="text-gray-500 dark:text-gray-400">Token:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-500">
              {property.token}
            </span>
          </>
        )}
        {property.variable && (
          <>
            <span className="text-gray-500 dark:text-gray-400">Variable:</span>
            <span className="font-mono text-violet-600 dark:text-violet-500">
              {property.variable}
            </span>
          </>
        )}
        {property.variableValue && (
          <>
            <span className="text-gray-500 dark:text-gray-400">
              Variable Value:
            </span>
            <ColorValue value={property.variableValue} />
          </>
        )}
        {property.computed && (
          <>
            <span className="text-gray-500 dark:text-gray-400">Computed:</span>
            <ColorValue value={property.computed} />
          </>
        )}
      </div>
    </div>
  );
};

const ColorValue = ({ value }: { value: string }) => {
  const isColor = isValidColor(value);

  return (
    <div className="flex items-center gap-1.5">
      {isColor && (
        <div
          className="size-3.5 rounded-sm border border-gray-300 dark:border-gray-700 flex-shrink-0"
          style={{
            backgroundColor: value,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        />
      )}
      <span
        className={`font-mono ${isColor ? "flex-1" : ""} text-gray-900 dark:text-gray-100`}
      >
        {value}
      </span>
    </div>
  );
};

// Helper function to check if a string is a valid CSS color
const isValidColor = (value: string): boolean => {
  // Check for hex colors (3, 4, 6, or 8 digits)
  if (/^#([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(value)) {
    return true;
  }

  // Check for rgb/rgba colors
  if (
    /^rgba?$$\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0?\.\d+|[01])\s*)?$$$/i.test(
      value,
    )
  ) {
    return true;
  }

  // Check for hsl/hsla colors
  if (
    /^hsla?$$\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*(?:0?\.\d+|[01])\s*)?$$$/i.test(
      value,
    )
  ) {
    return true;
  }

  // Check for named colors (simplified check - we're just checking for common color names)
  const namedColors = [
    "black",
    "white",
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown",
    "gray",
    "grey",
    "cyan",
    "magenta",
    "lime",
    "olive",
    "navy",
    "teal",
    "aqua",
    "silver",
    "gold",
    "indigo",
    "violet",
  ];

  return namedColors.some((color) => value.toLowerCase() === color);
};
