"use client";

import * as React from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  type NepaliDate,
  type DateConversionError,
  nepaliToEnglish,
  formatNepaliDate,
  getCurrentNepaliDate,
  getDaysInNepaliMonth,
  isValidNepaliDate,
  nepaliMonthNames,
  nepaliDayNames,
  createDateConversionError,
} from "@/lib/nepali-date";

const nepaliDatePickerVariants = cva(
  "flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        destructive: "border-destructive focus:ring-destructive",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-2 text-xs",
        lg: "h-11 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface NepaliDatePickerProps
  extends Omit<
      React.ComponentProps<typeof PopoverTrigger>,
      "asChild" | "value"
    >,
    VariantProps<typeof nepaliDatePickerVariants> {
  value?: NepaliDate | null;
  defaultValue?: NepaliDate | null;
  onValueChange?: (date: NepaliDate | null) => void;
  onError?: (error: DateConversionError) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: NepaliDate;
  maxDate?: NepaliDate;
  format?: "short" | "long";
  className?: string;
  calendarClassName?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  autoFocus?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
}

const NepaliCalendar = React.memo<{
  selectedDate: NepaliDate | null;
  onDateSelect: (date: NepaliDate) => void;
  minDate?: NepaliDate;
  maxDate?: NepaliDate;
  className?: string;
}>(({ selectedDate, onDateSelect, minDate, maxDate, className }) => {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (selectedDate && isValidNepaliDate(selectedDate)) {
      return selectedDate;
    }

    try {
      const currentDate = getCurrentNepaliDate();
      if (isValidNepaliDate(currentDate)) {
        return currentDate;
      }
    } catch (error) {
      console.warn("Failed to get current Nepali date:", error);
    }

    return { year: 2081, month: 8, day: 15 }; // Kartik 2081 (around November 2024)
  });

  const [error, setError] = React.useState<string | null>(null);
  const [focusedDate, setFocusedDate] = React.useState<NepaliDate | null>(null);

  const calendarData = React.useMemo(() => {
    try {
      const daysInMonth = getDaysInNepaliMonth(
        currentMonth.year,
        currentMonth.month
      );
      const firstDayOfMonth = nepaliToEnglish({ ...currentMonth, day: 1 });
      const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

      const days: (NepaliDate | null)[] = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push({ year: currentMonth.year, month: currentMonth.month, day });
      }

      setError(null);
      return { days, daysInMonth };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate calendar";
      setError(errorMessage);
      console.error("Calendar generation error:", err);
      return { days: [], daysInMonth: 0 };
    }
  }, [currentMonth]);

  const navigateMonth = React.useCallback((direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      let newMonth = prev.month + (direction === "next" ? 1 : -1);
      let newYear = prev.year;

      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }

      if (newYear < 2000 || newYear > 2100) {
        console.warn(`Year ${newYear} is out of supported range (2000-2100)`);
        return prev;
      }

      return { year: newYear, month: newMonth, day: 1 };
    });
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!focusedDate) return;

      const newFocusedDate = { ...focusedDate };

      try {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            newFocusedDate.day = Math.max(1, newFocusedDate.day - 1);
            break;
          case "ArrowRight":
            e.preventDefault();
            const maxDay = getDaysInNepaliMonth(
              newFocusedDate.year,
              newFocusedDate.month
            );
            newFocusedDate.day = Math.min(maxDay, newFocusedDate.day + 1);
            break;
          case "ArrowUp":
            e.preventDefault();
            newFocusedDate.day = Math.max(1, newFocusedDate.day - 7);
            break;
          case "ArrowDown":
            e.preventDefault();
            const maxDayDown = getDaysInNepaliMonth(
              newFocusedDate.year,
              newFocusedDate.month
            );
            newFocusedDate.day = Math.min(maxDayDown, newFocusedDate.day + 7);
            break;
          case "Enter":
          case " ":
            e.preventDefault();
            if (
              isValidNepaliDate(newFocusedDate) &&
              !isDateDisabled(newFocusedDate)
            ) {
              onDateSelect(newFocusedDate);
            }
            return;
          case "Home":
            e.preventDefault();
            newFocusedDate.day = 1;
            break;
          case "End":
            e.preventDefault();
            newFocusedDate.day = getDaysInNepaliMonth(
              newFocusedDate.year,
              newFocusedDate.month
            );
            break;
          default:
            return;
        }

        if (isValidNepaliDate(newFocusedDate)) {
          setFocusedDate(newFocusedDate);
        }
      } catch (error) {
        console.warn("Keyboard navigation error:", error);
      }
    },
    [focusedDate, onDateSelect]
  );

  const isDateDisabled = React.useCallback(
    (date: NepaliDate): boolean => {
      if (
        minDate &&
        (date.year < minDate.year ||
          (date.year === minDate.year && date.month < minDate.month) ||
          (date.year === minDate.year &&
            date.month === minDate.month &&
            date.day < minDate.day))
      ) {
        return true;
      }

      if (
        maxDate &&
        (date.year > maxDate.year ||
          (date.year === maxDate.year && date.month > maxDate.month) ||
          (date.year === maxDate.year &&
            date.month === maxDate.month &&
            date.day > maxDate.day))
      ) {
        return true;
      }

      return false;
    },
    [minDate, maxDate]
  );

  const isDateSelected = React.useCallback(
    (date: NepaliDate): boolean => {
      return selectedDate
        ? date.year === selectedDate.year &&
            date.month === selectedDate.month &&
            date.day === selectedDate.day
        : false;
    },
    [selectedDate]
  );

  const isDateFocused = React.useCallback(
    (date: NepaliDate): boolean => {
      return focusedDate
        ? date.year === focusedDate.year &&
            date.month === focusedDate.month &&
            date.day === focusedDate.day
        : false;
    },
    [focusedDate]
  );

  if (error) {
    return (
      <div
        className={cn("p-4 text-center text-destructive", className)}
        role="alert"
        aria-live="polite"
      >
        <p className="text-sm">Error loading calendar: {error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 bg-transparent"
          onClick={() => {
            setCurrentMonth({ year: 2081, month: 8, day: 15 });
            setError(null);
          }}
          aria-label="Reset calendar to default date"
        >
          Reset Calendar
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn("p-3 bg-background", className)}
      role="application"
      aria-label="Nepali Date Picker Calendar"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateMonth("prev")}
          disabled={currentMonth.year <= 2000 && currentMonth.month <= 1}
          aria-label={`Previous month. Current month: ${
            nepaliMonthNames[currentMonth.month - 1]
          } ${currentMonth.year}`}
          tabIndex={-1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <div
          className="text-sm font-medium"
          aria-live="polite"
          id="calendar-heading"
        >
          {nepaliMonthNames[currentMonth.month - 1]} {currentMonth.year}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateMonth("next")}
          disabled={currentMonth.year >= 2100 && currentMonth.month >= 12}
          aria-label={`Next month. Current month: ${
            nepaliMonthNames[currentMonth.month - 1]
          } ${currentMonth.year}`}
          tabIndex={-1}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2" role="row">
        {nepaliDayNames.map((dayName, index) => (
          <div
            key={index}
            className="text-center text-xs font-medium text-muted-foreground p-2"
            role="columnheader"
            aria-label={dayName}
          >
            {dayName.slice(0, 2)}
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-1"
        role="grid"
        aria-labelledby="calendar-heading"
      >
        {calendarData.days.map((date, index) => (
          <div key={index} role="gridcell">
            {date ? (
              <Button
                variant={isDateSelected(date) ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "w-full h-8 p-0 font-normal",
                  isDateSelected(date) && "bg-primary text-primary-foreground",
                  isDateDisabled(date) && "opacity-50 cursor-not-allowed",
                  isDateFocused(date) && "ring-2 ring-ring ring-offset-2"
                )}
                onClick={() => {
                  if (!isDateDisabled(date)) {
                    setFocusedDate(date);
                    onDateSelect(date);
                  }
                }}
                onFocus={() => setFocusedDate(date)}
                disabled={isDateDisabled(date)}
                aria-label={`${date.day} ${nepaliMonthNames[date.month - 1]} ${
                  date.year
                }${isDateSelected(date) ? ", selected" : ""}${
                  isDateDisabled(date) ? ", disabled" : ""
                }`}
                aria-selected={isDateSelected(date)}
                aria-disabled={isDateDisabled(date)}
                tabIndex={
                  isDateSelected(date) || (!selectedDate && date.day === 1)
                    ? 0
                    : -1
                }
              >
                {date.day}
              </Button>
            ) : (
              <div className="w-full h-8" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

NepaliCalendar.displayName = "NepaliCalendar";

export const NepaliDatePicker = React.forwardRef<
  React.ElementRef<typeof PopoverTrigger>,
  NepaliDatePickerProps
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      onError,
      placeholder = "Select date",
      disabled = false,
      minDate,
      maxDate,
      format = "short",
      variant,
      size,
      className,
      calendarClassName,
      autoFocus,
      required,
      name,
      id,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const [selectedDate, setSelectedDate] = React.useState<NepaliDate | null>(
      value ?? defaultValue ?? null
    );
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedDate(value);
      }
    }, [value]);

    const handleDateSelect = React.useCallback(
      (date: NepaliDate) => {
        try {
          if (!isValidNepaliDate(date)) {
            throw createDateConversionError(
              "INVALID_NEPALI_DATE",
              "Selected date is invalid",
              `Date: ${date.year}/${date.month}/${date.day}`
            );
          }

          setSelectedDate(date);
          onValueChange?.(date);
          setIsOpen(false);
        } catch (error) {
          const dateError = error as DateConversionError;
          onError?.(dateError);
          console.error("Date selection error:", dateError);
        }
      },
      [onValueChange, onError]
    );

    const handleClear = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedDate(null);
        onValueChange?.(null);
      },
      [onValueChange]
    );

    const displayValue = React.useMemo(() => {
      if (!selectedDate) return placeholder;

      try {
        return formatNepaliDate(selectedDate, format);
      } catch (error) {
        const dateError = error as DateConversionError;
        onError?.(dateError);
        console.warn("Date formatting error:", dateError);
        return placeholder;
      }
    }, [selectedDate, format, placeholder, onError]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(!isOpen);
        } else if (e.key === "Escape" && isOpen) {
          e.preventDefault();
          setIsOpen(false);
        } else if (e.key === "ArrowDown" && !isOpen) {
          e.preventDefault();
          setIsOpen(true);
        }
      },
      [isOpen]
    );

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              nepaliDatePickerVariants({ variant, size }),
              !selectedDate && "text-muted-foreground",
              className
            )}
            disabled={disabled}
            autoFocus={autoFocus}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-label={
              ariaLabel ||
              (selectedDate ? `Selected date: ${displayValue}` : "Select date")
            }
            aria-describedby={ariaDescribedBy}
            aria-required={required}
            aria-invalid={variant === "destructive"}
            onKeyDown={handleKeyDown}
            name={name}
            id={id}
            {...props}
          >
            <span className="truncate">{displayValue}</span>
            <div className="flex items-center gap-1">
              {selectedDate && !disabled && (
                <span
                  className="inline-flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  onClick={handleClear}
                  aria-label="Clear selected date"
                  tabIndex={-1}
                  role="button"
                >
                  ×
                </span>
              )}
              <CalendarIcon className="h-4 w-4 opacity-50" aria-hidden="true" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0"
          align="start"
          role="dialog"
          aria-label="Date picker"
        >
          <NepaliCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            minDate={minDate}
            maxDate={maxDate}
            className={calendarClassName}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

NepaliDatePicker.displayName = "NepaliDatePicker";

export { nepaliDatePickerVariants };
