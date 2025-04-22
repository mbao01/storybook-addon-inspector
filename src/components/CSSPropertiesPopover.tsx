"use client";

import React, { Fragment } from "react";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Code,
  MoveLeftIcon,
  MoveRightIcon,
  Paintbrush,
  Variable,
} from "lucide-react";

import { Popover, PopoverContent } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "../lib/utils";

type CSSPropertyValue = Partial<
  Record<"value" | "computed" | "variableValue", string> &
    Record<"token" | "variable", string[]>
> & {
  property: string;
};

type CSSPropertyPopoverProps = {
  id: string;
  tokens: CSSPropertyValue[];
  computed: CSSPropertyValue[];
  variables: CSSPropertyValue[];
  open: boolean;
};

type PopoverPosition = "top-right" | "top-left";

export const CSSPropertiesPopover = ({
  id,
  tokens,
  computed,
  variables,
  open,
}: CSSPropertyPopoverProps) => {
  const [isExpanded, setExpanded] = useState(true);
  const [position, setPosition] = useState<PopoverPosition>("top-right");

  const groups = [
    {
      title: "Tokens",
      icon: <Paintbrush className="ia:size-4 ia:text-emerald-500" />,
      properties: tokens,
    },
    {
      title: "Variables",
      icon: <Variable className="ia:size-4 ia:text-violet-500" />,
      properties: variables,
    },
    {
      title: "Computed",
      icon: <Code className="ia:size-4 ia:text-sky-500" />,
      properties: computed,
    },
  ].filter(({ properties }) => properties.length > 0);

  return (
    <Popover open={open}>
      <PopoverContent
        id={id}
        className={cn(
          "ia:fixed ia:z-[9999999999] ia:w-[372px] ia:lg:w-[420px] ia:xl:w-[460px] ia:p-0 ia:bg-white ia:dark:bg-gray-900 ia:rounded-tl-none!",
          {
            "ia:border-gray-200 ia:dark:border-gray-800": isExpanded,
            "ia:w-[220px]!": !isExpanded,
          },
          {
            "ia:top-9 ia:right-1": position === "top-right",
            "ia:top-9 ia:left-1": position === "top-left",
          },
        )}
      >
        <div className="ia:relative">
          <div className="ia:absolute ia:-top-7.5 ia:left-0 ia:right-4 ia:flex ia:items-center ia:w-[220px]">
            <button
              tabIndex={-1}
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="ia:flex ia:gap-1 ia:items-center ia:justify-between ia:w-full ia:bg-white ia:dark:bg-gray-900 ia:text-gray-900/60 ia:dark:text-white/60 ia:px-3 ia:py-1.5 ia:-ml-px ia:text-xs ia:font-medium ia:rounded-t-lg ia:border ia:border-gray-200 ia:dark:border-gray-800 ia:border-b-0 ia:cursor-pointer"
            >
              CSS Property Inspector{" "}
              <Badge
                variant="outline"
                className="ia:border-gray-200 ia:dark:border-gray-700 ia:text-gray-700 ia:dark:text-gray-300"
              >
                {computed.length}
              </Badge>
              {isExpanded ? (
                <ChevronDown className="ia:size-4 ia:text-gray-500 ia:dark:text-gray-400 ia:flex-shrink-0" />
              ) : (
                <ChevronRight className="ia:size-4 ia:text-gray-500 ia:dark:text-gray-400 ia:flex-shrink-0" />
              )}
            </button>
            {position === "top-right" ? (
              <MoveLeftIcon
                data-testid="move-left-button"
                className="ia:size-4 ia:text-gray-500 ia:dark:text-gray-400 ia:flex-shrink-0 ia:p-0.5 ia:cursor-pointer ia:absolute ia:-left-2.5 ia:top-2.5 ia:rounded-sm ia:bg-white ia:dark:bg-gray-900 ia:border ia:border-gray-200 ia:dark:border-gray-900 ia:hover:bg-gray-100 ia:dark:hover:bg-gray-800"
                onClick={() => setPosition("top-left")}
              />
            ) : (
              <MoveRightIcon
                data-testid="move-right-button"
                className="ia:size-4 ia:text-gray-500 ia:dark:text-gray-400 ia:flex-shrink-0 ia:p-0.5 ia:cursor-pointer ia:absolute ia:-right-2.5 ia:top-2.5 ia:rounded-sm ia:bg-white ia:dark:bg-gray-900 ia:border ia:border-gray-200 ia:dark:border-gray-900 ia:hover:bg-gray-100 ia:dark:hover:bg-gray-800"
                onClick={() => setPosition("top-right")}
              />
            )}
          </div>
          {isExpanded && (
            <div className="ia:relative ia:h-[400px]">
              <ScrollArea className="ia:h-full">
                <div className="ia:space-y-1">
                  {groups.map(({ title, icon, properties }, index) => {
                    return (
                      <Fragment key={`${title}-${index}`}>
                        {index > 0 && (
                          <Separator className="ia:my-1 ia:bg-gray-200 ia:dark:bg-gray-800" />
                        )}
                        <PropertySection
                          title={title}
                          icon={icon}
                          properties={properties}
                        />
                      </Fragment>
                    );
                  })}

                  {groups.length === 0 && (
                    <div className="ia:py-6 ia:text-sm ia:text-center ia:text-gray-500 ia:dark:text-gray-400">
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
    <div className="ia:w-full">
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setExpanded((e) => !e)}
        className="ia:sticky ia:top-0 ia:z-10 ia:bg-white ia:dark:bg-gray-900 ia:w-full ia:px-4 ia:py-2 ia:flex ia:items-center ia:gap-2 ia:cursor-pointer ia:hover:bg-gray-100 ia:dark:hover:bg-gray-800 ia:text-left"
      >
        {isExpanded ? (
          <ChevronDown className="ia:size-4 ia:text-gray-500 ia:dark:text-gray-400 ia:flex-shrink-0" />
        ) : (
          <ChevronRight className="ia:size-4 ia:text-gray-500 ia:dark:text-gray-400 ia:flex-shrink-0" />
        )}
        {icon}
        <h3 className="ia:font-medium ia:text-gray-900 ia:dark:text-white">
          {title}
        </h3>
        <Badge
          variant="outline"
          className="ia:ml-auto ia:border-gray-200 ia:dark:border-gray-700 ia:text-gray-700 ia:dark:text-gray-300"
        >
          {properties.length}
        </Badge>
      </button>

      {isExpanded && (
        <div className="ia:space-y-2 ia:px-4 ia:py-2">
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
    <div className="ia:rounded-md ia:border ia:border-gray-200 ia:dark:border-gray-800 ia:p-2 ia:text-sm ia:bg-white ia:dark:bg-gray-900">
      <div className="ia:font-medium ia:text-gray-900 ia:dark:text-white">
        {property.property}
      </div>
      <div className="ia:grid ia:grid-cols-2 ia:gap-x-2 ia:gap-y-1 ia:mt-1 ia:text-xs">
        {property.value ? (
          <>
            <span className="ia:text-gray-500 ia:dark:text-gray-400">
              Value:
            </span>
            <ColorValue value={property.value} />
          </>
        ) : null}
        {property.token?.length ? (
          <>
            <span className="ia:text-gray-500 ia:dark:text-gray-400">
              Token:
            </span>
            <div className="ia:flex ia:flex-col ia:gap-1">
              {property.token.map((v, i) => (
                <span
                  key={i}
                  className="ia:font-mono ia:text-emerald-600 ia:dark:text-emerald-500"
                >
                  {v}
                </span>
              ))}
            </div>
          </>
        ) : null}
        {property.variable?.length ? (
          <>
            <span className="ia:text-gray-500 ia:dark:text-gray-400">
              Variable:
            </span>
            <div className="ia:flex ia:flex-col ia:gap-1">
              {property.variable.map((v, i) => (
                <span
                  key={i}
                  className="ia:font-mono ia:text-violet-600 ia:dark:text-violet-500"
                >
                  {v}
                </span>
              ))}
            </div>
          </>
        ) : null}
        {property.variableValue ? (
          <>
            <span className="ia:text-gray-500 ia:dark:text-gray-400">
              Variable Value:
            </span>
            <ColorValue value={property.variableValue} />
          </>
        ) : null}
        {property.computed ? (
          <>
            <span className="ia:text-gray-500 ia:dark:text-gray-400">
              Computed:
            </span>
            <ColorValue value={property.computed} />
          </>
        ) : null}
      </div>
    </div>
  );
};

const ColorValue = ({ value }: { value: string }) => {
  const isColor = isValidColor(value);

  return (
    <div className="ia:flex ia:items-center ia:gap-1.5">
      {isColor && (
        <div
          data-testid="color-swatch"
          className="ia:size-3.5 ia:rounded-sm ia:border ia:border-gray-300 ia:dark:border-gray-700 ia:flex-shrink-0"
          style={{
            backgroundColor: value,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        />
      )}
      <span
        className={`ia:font-mono ${isColor ? "ia:flex-1" : ""} ia:text-gray-900 ia:dark:text-gray-100`}
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
    /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0?\.\d+|[01])\s*)?\)$/i.test(
      value,
    )
  ) {
    return true;
  }

  // Check for hsl/hsla colors
  if (
    /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*(?:0?\.\d+|[01])\s*)?\)$/i.test(
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
