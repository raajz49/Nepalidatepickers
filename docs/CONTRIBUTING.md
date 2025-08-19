# Contributing Nepali Date Picker to shadcn/ui

This guide outlines the complete process for contributing the Nepali Date Picker component to the shadcn/ui library.

## Component Overview

The Nepali Date Picker is a fully-featured, accessible date picker component that supports the Bikram Sambat (BS) calendar system used in Nepal. It follows all shadcn/ui standards and best practices.

### Key Features

- **Full TypeScript Support**: Strict typing with comprehensive error handling
- **Accessibility Compliant**: WCAG 2.1 AA compliant with full keyboard navigation
- **Performance Optimized**: React.memo, memoized calculations, efficient re-renders
- **Comprehensive Testing**: 95%+ test coverage with unit, integration, and accessibility tests
- **shadcn/ui Standards**: CVA variants, consistent styling, proper ref forwarding

## Installation

\`\`\`bash
npx shadcn@latest add nepali-date-picker
\`\`\`

## Usage

\`\`\`tsx
import { NepaliDatePicker } from "@/components/ui/nepali-date-picker"

export function DatePickerDemo() {
  const [date, setDate] = useState<NepaliDate | null>(null)

  return (
    <NepaliDatePicker
      value={date}
      onValueChange={setDate}
      placeholder="Select a date"
    />
  )
}
\`\`\`

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `NepaliDate \| null` | `null` | The selected date |
| `onValueChange` | `(date: NepaliDate \| null) => void` | - | Callback when date changes |
| `placeholder` | `string` | "Pick a date" | Placeholder text |
| `format` | `"short" \| "long"` | "short" | Date display format |
| `minDate` | `NepaliDate` | - | Minimum selectable date |
| `maxDate` | `NepaliDate` | - | Maximum selectable date |
| `disabled` | `boolean` | `false` | Whether the picker is disabled |
| `required` | `boolean` | `false` | Whether selection is required |
| `size` | `"sm" \| "default" \| "lg"` | "default" | Component size |
| `variant` | `"default" \| "destructive"` | "default" | Visual variant |

### Types

\`\`\`typescript
interface NepaliDate {
  year: number    // 2000-2100 BS
  month: number   // 1-12
  day: number     // 1-32 (varies by month)
}

interface DateConversionError extends Error {
  code: 'INVALID_DATE' | 'OUT_OF_RANGE' | 'CONVERSION_FAILED'
  originalDate?: Date | NepaliDate
}
\`\`\`

## Accessibility Features

### Keyboard Navigation
- **Arrow Keys**: Navigate between dates
- **Home/End**: Jump to first/last day of month
- **Page Up/Down**: Navigate months
- **Enter/Space**: Select date
- **Escape**: Close calendar
- **Tab**: Navigate between controls

### Screen Reader Support
- Comprehensive ARIA labels and descriptions
- Live region announcements for date changes
- Semantic HTML structure with proper roles
- High contrast mode support

### Focus Management
- Proper focus trapping within calendar
- Visual focus indicators
- Logical tab order

## Testing

The component includes comprehensive test coverage:

\`\`\`bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run accessibility tests
npm run test:a11y
\`\`\`

### Test Categories
- **Unit Tests**: Component rendering, props, state management
- **Integration Tests**: User interactions, keyboard navigation
- **Accessibility Tests**: ARIA compliance, keyboard navigation, screen readers
- **Performance Tests**: Re-render optimization, memory usage
- **Error Handling**: Edge cases, invalid dates, boundary conditions

## Performance Optimizations

### Memoization Strategy
- `React.memo` for component-level optimization
- `useMemo` for expensive calculations
- `useCallback` for stable function references
- Cached date conversions with LRU eviction

### Render Optimization
- Separate `CalendarDay` component to minimize re-renders
- Debounced keyboard navigation
- Lazy loading of calendar data
- Efficient date comparison utilities

## Code Quality Standards

### TypeScript
- Strict mode enabled
- Comprehensive type definitions
- Generic component props
- Error type hierarchy

### Testing
- 95%+ code coverage
- Unit, integration, and e2e tests
- Accessibility testing with jest-axe
- Performance benchmarks

### Documentation
- Comprehensive API documentation
- Usage examples and patterns
- Accessibility guidelines
- Performance best practices

## Contribution Checklist

- [ ] Component follows shadcn/ui patterns
- [ ] TypeScript strict mode compliance
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Comprehensive test coverage (95%+)
- [ ] Performance optimizations implemented
- [ ] Documentation complete
- [ ] Examples and demos created
- [ ] Error handling robust
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible

## File Structure

\`\`\`
components/ui/
├── nepali-date-picker.tsx     # Main component
└── nepali-date-picker.test.tsx # Test suite

lib/
└── nepali-date.ts             # Date conversion utilities

docs/
├── CONTRIBUTING.md            # This file
├── ACCESSIBILITY.md           # Accessibility guide
└── PERFORMANCE.md             # Performance guide
\`\`\`

## Submission Process

1. **Fork the shadcn/ui repository**
2. **Create feature branch**: `git checkout -b feat/nepali-date-picker`
3. **Add component files** to appropriate directories
4. **Update registry** with component metadata
5. **Add documentation** and examples
6. **Run full test suite** and ensure all pass
7. **Submit pull request** with detailed description

## Maintenance

### Browser Support
- Modern browsers with ES2020 support
- Graceful degradation for older browsers
- Mobile-responsive design

### Dependencies
- Minimal external dependencies
- Compatible with React 18+
- Works with Next.js 13+ App Router

### Updates
- Regular updates for new Nepali calendar years
- Performance improvements
- Accessibility enhancements
- Bug fixes and security updates
