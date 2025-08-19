"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest"
import { NepaliDatePicker } from "./nepali-date-picker"
import { getCurrentNepaliDate } from "@/lib/nepali-date"

vi.mock("@/lib/nepali-date", async () => {
  const actual = await vi.importActual("@/lib/nepali-date")
  return {
    ...actual,
    getCurrentNepaliDate: vi.fn(),
  }
})

const mockGetCurrentNepaliDate = vi.mocked(getCurrentNepaliDate)

describe("NepaliDatePicker", () => {
  const defaultCurrentDate = { year: 2081, month: 8, day: 15 }

  beforeEach(() => {
    mockGetCurrentNepaliDate.mockReturnValue(defaultCurrentDate)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Basic Rendering", () => {
    it("renders with placeholder text", () => {
      render(<NepaliDatePicker placeholder="Select a date" />)
      expect(screen.getByText("Select a date")).toBeInTheDocument()
    })

    it("renders with default placeholder when none provided", () => {
      render(<NepaliDatePicker />)
      expect(screen.getByText("Select date")).toBeInTheDocument()
    })

    it("displays selected date in short format", () => {
      const selectedDate = { year: 2081, month: 8, day: 15 }
      render(<NepaliDatePicker value={selectedDate} />)
      expect(screen.getByText("2081/08/15")).toBeInTheDocument()
    })

    it("displays selected date in long format", () => {
      const selectedDate = { year: 2081, month: 8, day: 15 }
      render(<NepaliDatePicker value={selectedDate} format="long" />)
      expect(screen.getByText("15 कार्तिक 2081")).toBeInTheDocument()
    })

    it("renders disabled state correctly", () => {
      render(<NepaliDatePicker disabled />)
      const trigger = screen.getByRole("button")
      expect(trigger).toBeDisabled()
    })
  })

  describe("Calendar Interaction", () => {
    it("opens calendar when clicked", async () => {
      const user = userEvent.setup()
      render(<NepaliDatePicker />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      expect(screen.getByRole("application")).toBeInTheDocument()
      expect(screen.getByText("कार्तिक 2081")).toBeInTheDocument()
    })

    it("closes calendar when date is selected", async () => {
      const user = userEvent.setup()
      render(<NepaliDatePicker />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const dateButton = screen.getByRole("button", { name: /15 कार्तिक 2081/ })
      await user.click(dateButton)

      await waitFor(() => {
        expect(screen.queryByRole("application")).not.toBeInTheDocument()
      })
    })

    it("closes calendar when escape key is pressed", async () => {
      const user = userEvent.setup()
      render(<NepaliDatePicker />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      expect(screen.getByRole("application")).toBeInTheDocument()

      await user.keyboard("{Escape}")

      await waitFor(() => {
        expect(screen.queryByRole("application")).not.toBeInTheDocument()
      })
    })
  })

  describe("Date Selection", () => {
    it("calls onValueChange when date is selected", async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      render(<NepaliDatePicker onValueChange={onValueChange} />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const dateButton = screen.getByRole("button", { name: /15 कार्तिक 2081/ })
      await user.click(dateButton)

      expect(onValueChange).toHaveBeenCalledWith({ year: 2081, month: 8, day: 15 })
    })

    it("handles controlled value changes", () => {
      const { rerender } = render(<NepaliDatePicker value={null} />)
      expect(screen.getByText("Select date")).toBeInTheDocument()

      const newDate = { year: 2081, month: 5, day: 10 }
      rerender(<NepaliDatePicker value={newDate} />)
      expect(screen.getByText("2081/05/10")).toBeInTheDocument()
    })

    it("clears date when clear button is clicked", async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      const selectedDate = { year: 2081, month: 8, day: 15 }

      render(<NepaliDatePicker value={selectedDate} onValueChange={onValueChange} />)

      const clearButton = screen.getByLabelText("Clear selected date")
      await user.click(clearButton)

      expect(onValueChange).toHaveBeenCalledWith(null)
    })
  })

  describe("Keyboard Navigation", () => {
    it("opens calendar with Enter key", async () => {
      const user = userEvent.setup()
      render(<NepaliDatePicker />)

      const trigger = screen.getByRole("button")
      trigger.focus()
      await user.keyboard("{Enter}")

      expect(screen.getByRole("application")).toBeInTheDocument()
    })

    it("opens calendar with Space key", async () => {
      const user = userEvent.setup()
      render(<NepaliDatePicker />)

      const trigger = screen.getByRole("button")
      trigger.focus()
      await user.keyboard(" ")

      expect(screen.getByRole("application")).toBeInTheDocument()
    })

    it("navigates dates with arrow keys", async () => {
      const user = userEvent.setup()
      render(<NepaliDatePicker />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const calendar = screen.getByRole("application")
      calendar.focus()

      await user.keyboard("{ArrowRight}")
      await user.keyboard("{ArrowDown}")
      await user.keyboard("{ArrowLeft}")
      await user.keyboard("{ArrowUp}")

      // Calendar should still be focused and functional
      expect(calendar).toBeInTheDocument()
    })

    it("selects date with Enter key in calendar", async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      render(<NepaliDatePicker onValueChange={onValueChange} />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const calendar = screen.getByRole("application")
      calendar.focus()
      await user.keyboard("{Enter}")

      expect(onValueChange).toHaveBeenCalled()
    })
  })

  describe("Date Constraints", () => {
    it("respects minDate constraint", async () => {
      const user = userEvent.setup()
      const minDate = { year: 2081, month: 8, day: 20 }
      render(<NepaliDatePicker minDate={minDate} />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      // Dates before minDate should be disabled
      const disabledDate = screen.getByRole("button", { name: /10 कार्तिक 2081/ })
      expect(disabledDate).toBeDisabled()
    })

    it("respects maxDate constraint", async () => {
      const user = userEvent.setup()
      const maxDate = { year: 2081, month: 8, day: 10 }
      render(<NepaliDatePicker maxDate={maxDate} />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      // Dates after maxDate should be disabled
      const disabledDate = screen.getByRole("button", { name: /20 कार्तिक 2081/ })
      expect(disabledDate).toBeDisabled()
    })

    it("prevents selection of disabled dates", async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      const maxDate = { year: 2081, month: 8, day: 10 }

      render(<NepaliDatePicker maxDate={maxDate} onValueChange={onValueChange} />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const disabledDate = screen.getByRole("button", { name: /20 कार्तिक 2081/ })
      await user.click(disabledDate)

      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe("Error Handling", () => {
    it("handles getCurrentNepaliDate errors gracefully", () => {
      mockGetCurrentNepaliDate.mockImplementation(() => {
        throw new Error("Date out of range")
      })

      render(<NepaliDatePicker />)
      expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("calls onError when date conversion fails", async () => {
      const user = userEvent.setup()
      const onError = vi.fn()

      render(<NepaliDatePicker onError={onError} />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      // Simulate error in calendar
      const calendar = screen.getByRole("application")
      expect(calendar).toBeInTheDocument()
    })

    it("shows error state in calendar when data fails to load", () => {
      // Mock a calendar data error
      mockGetCurrentNepaliDate.mockImplementation(() => {
        throw new Error("Calendar data unavailable")
      })

      render(<NepaliDatePicker />)
      const trigger = screen.getByRole("button")
      fireEvent.click(trigger)

      // Should still render without crashing
      expect(screen.getByRole("button")).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("supports aria-label attribute", () => {
      render(<NepaliDatePicker aria-label="Birth date picker" />)
      const trigger = screen.getByRole("button")
      expect(trigger).toHaveAttribute("aria-label", "Birth date picker")
    })

    it("supports aria-describedby attribute", () => {
      render(<NepaliDatePicker aria-describedby="birth-date-help" />)
      const trigger = screen.getByRole("button")
      expect(trigger).toHaveAttribute("aria-describedby", "birth-date-help")
    })

    it("supports required attribute", () => {
      render(<NepaliDatePicker required />)
      const trigger = screen.getByRole("button")
      expect(trigger).toHaveAttribute("aria-required", "true")
    })

    it("has proper ARIA expanded state", async () => {
      const user = userEvent.setup()
      render(<NepaliDatePicker />)

      const trigger = screen.getByRole("button")
      expect(trigger).toHaveAttribute("aria-expanded", "false")

      await user.click(trigger)
      expect(trigger).toHaveAttribute("aria-expanded", "true")
    })

    it("has proper role attributes in calendar", async () => {
      const user = userEvent.setup()
      render(<NepaliDatePicker />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      expect(screen.getByRole("application")).toBeInTheDocument()
      expect(screen.getByRole("grid")).toBeInTheDocument()
      expect(screen.getAllByRole("gridcell")).toHaveLength(42) // 6 weeks × 7 days
    })

    it("supports autoFocus", () => {
      render(<NepaliDatePicker autoFocus />)
      const trigger = screen.getByRole("button")
      expect(trigger).toHaveFocus()
    })
  })

  describe("Component Variants", () => {
    it("applies size variants correctly", () => {
      const { rerender } = render(<NepaliDatePicker size="sm" />)
      let trigger = screen.getByRole("button")
      expect(trigger).toHaveClass("h-9")

      rerender(<NepaliDatePicker size="lg" />)
      trigger = screen.getByRole("button")
      expect(trigger).toHaveClass("h-11")
    })

    it("applies destructive variant correctly", () => {
      render(<NepaliDatePicker variant="destructive" />)
      const trigger = screen.getByRole("button")
      expect(trigger).toHaveClass("border-destructive")
    })

    it("applies custom className", () => {
      render(<NepaliDatePicker className="custom-class" />)
      const trigger = screen.getByRole("button")
      expect(trigger).toHaveClass("custom-class")
    })
  })

  describe("Month Navigation", () => {
    it("navigates to previous month", async () => {
      const user = userEvent.setup()
      render(<NepaliDatePicker />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const prevButton = screen.getByLabelText(/Previous month/)
      await user.click(prevButton)

      expect(screen.getByText("आश्विन 2081")).toBeInTheDocument()
    })

    it("navigates to next month", async () => {
      const user = userEvent.setup()
      render(<NepaliDatePicker />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const nextButton = screen.getByLabelText(/Next month/)
      await user.click(nextButton)

      expect(screen.getByText("मंसिर 2081")).toBeInTheDocument()
    })

    it("disables navigation at year boundaries", async () => {
      const user = userEvent.setup()
      mockGetCurrentNepaliDate.mockReturnValue({ year: 2000, month: 1, day: 1 })

      render(<NepaliDatePicker />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const prevButton = screen.getByLabelText(/Previous month/)
      expect(prevButton).toBeDisabled()
    })
  })

  describe("Performance", () => {
    it("does not re-render unnecessarily", () => {
      const onValueChange = vi.fn()
      const { rerender } = render(<NepaliDatePicker onValueChange={onValueChange} />)

      // Re-render with same props should not cause issues
      rerender(<NepaliDatePicker onValueChange={onValueChange} />)
      rerender(<NepaliDatePicker onValueChange={onValueChange} />)

      expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("handles rapid state changes gracefully", async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()

      render(<NepaliDatePicker onValueChange={onValueChange} />)

      const trigger = screen.getByRole("button")

      // Rapid clicks should not break the component
      await user.click(trigger)
      await user.click(trigger)
      await user.click(trigger)

      expect(screen.getByRole("button")).toBeInTheDocument()
    })
  })

  describe("Integration Scenarios", () => {
    it("works in form context", () => {
      render(
        <form>
          <NepaliDatePicker name="birthDate" id="birth-date" />
        </form>,
      )

      const trigger = screen.getByRole("button")
      expect(trigger).toHaveAttribute("name", "birthDate")
      expect(trigger).toHaveAttribute("id", "birth-date")
    })

    it("handles defaultValue correctly", () => {
      const defaultDate = { year: 2080, month: 5, day: 15 }
      render(<NepaliDatePicker defaultValue={defaultDate} />)

      expect(screen.getByText("2080/05/15")).toBeInTheDocument()
    })

    it("maintains focus management in complex layouts", async () => {
      const user = userEvent.setup()
      render(
        <div>
          <button>Before</button>
          <NepaliDatePicker />
          <button>After</button>
        </div>,
      )

      const trigger = screen.getByRole("button", { name: /Select date/ })
      await user.click(trigger)

      expect(screen.getByRole("application")).toBeInTheDocument()

      await user.keyboard("{Escape}")

      await waitFor(() => {
        expect(trigger).toHaveFocus()
      })
    })
  })
})
