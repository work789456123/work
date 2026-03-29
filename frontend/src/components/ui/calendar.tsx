import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames, type DayPickerProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  const defaults = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        ...defaults,
        ...classNames,
        root: cn("p-3", defaults.root, classNames?.root),
        months: cn(
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          defaults.months,
          classNames?.months
        ),
        month: cn("space-y-4", defaults.month, classNames?.month),
        month_caption: cn(
          "flex justify-center pt-1 relative items-center",
          defaults.month_caption,
          classNames?.month_caption
        ),
        caption_label: cn("text-sm font-medium", defaults.caption_label, classNames?.caption_label),
        nav: cn("space-x-1 flex items-center", defaults.nav, classNames?.nav),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1",
          defaults.button_previous,
          classNames?.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1",
          defaults.button_next,
          classNames?.button_next
        ),
        month_grid: cn("w-full border-collapse space-y-1", defaults.month_grid, classNames?.month_grid),
        weekdays: cn("flex", defaults.weekdays, classNames?.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          defaults.weekday,
          classNames?.weekday
        ),
        week: cn("flex w-full mt-2", defaults.week, classNames?.week),
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
          defaults.day,
          classNames?.day
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
          defaults.day_button,
          classNames?.day_button
        ),
        range_start: cn("day-range-start", defaults.range_start, classNames?.range_start),
        range_end: cn("day-range-end", defaults.range_end, classNames?.range_end),
        selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          defaults.selected,
          classNames?.selected
        ),
        today: cn("bg-accent text-accent-foreground", defaults.today, classNames?.today),
        outside: cn(
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          defaults.outside,
          classNames?.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaults.disabled, classNames?.disabled),
        range_middle: cn(
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
          defaults.range_middle,
          classNames?.range_middle
        ),
        hidden: cn("invisible", defaults.hidden, classNames?.hidden),
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />
          ) : orientation === "right" ? (
            <ChevronRight className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />
          ),
        ...props.components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
