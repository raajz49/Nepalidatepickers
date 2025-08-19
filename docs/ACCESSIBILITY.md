# Accessibility Guide - Nepali Date Picker

This document outlines the comprehensive accessibility features implemented in the Nepali Date Picker component to ensure WCAG 2.1 AA compliance.

## Overview

The Nepali Date Picker is designed to be fully accessible to users with disabilities, including those who rely on screen readers, keyboard navigation, or other assistive technologies.

## WCAG 2.1 AA Compliance

### Perceivable
- **High Contrast**: Meets 4.5:1 contrast ratio for normal text, 3:1 for large text
- **Scalable Text**: Supports zoom up to 200% without horizontal scrolling
- **Color Independence**: Information is not conveyed by color alone
- **Focus Indicators**: Clear visual focus indicators for all interactive elements

### Operable
- **Keyboard Accessible**: Full functionality available via keyboard
- **No Seizures**: No flashing content that could trigger seizures
- **Sufficient Time**: No time limits on interactions
- **Navigation**: Consistent and predictable navigation patterns

### Understandable
- **Readable**: Clear, simple language in labels and instructions
- **Predictable**: Consistent behavior across all interactions
- **Input Assistance**: Clear error messages and validation feedback

### Robust
- **Compatible**: Works with current and future assistive technologies
- **Valid HTML**: Semantic, valid HTML structure
- **Progressive Enhancement**: Core functionality works without JavaScript

## Keyboard Navigation

### Calendar Navigation
\`\`\`
Arrow Keys    → Navigate between dates
Home          → First day of current month
End           → Last day of current month
Page Up       → Previous month
Page Down     → Next month
Ctrl+Page Up  → Previous year
Ctrl+Page Down → Next year
\`\`\`

### Actions
\`\`\`
Enter/Space   → Select focused date
Escape        → Close calendar
Tab           → Move to next control
Shift+Tab     → Move to previous control
\`\`\`

### Implementation
\`\`\`tsx
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      navigateDate(-7) // Previous week
      break
    case 'ArrowDown':
      event.preventDefault()
      navigateDate(7) // Next week
      break
    // ... other key handlers
  }
}
\`\`\`

## Screen Reader Support

### ARIA Labels and Descriptions
\`\`\`tsx
<button
  aria-label={`Select ${formatNepaliDate(date, 'long')}`}
  aria-describedby="calendar-instructions"
  aria-pressed={isSelected}
  role="gridcell"
>
  {date.day}
</button>
\`\`\`

### Live Regions
\`\`\`tsx
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {announcement}
</div>
\`\`\`

### Semantic Structure
\`\`\`tsx
<div role="dialog" aria-label="Choose date">
  <div role="grid" aria-label="Calendar">
    <div role="row">
      <div role="columnheader">Sun</div>
      {/* ... other headers */}
    </div>
    <div role="row">
      <button role="gridcell">1</button>
      {/* ... other dates */}
    </div>
  </div>
</div>
\`\`\`

## Focus Management

### Focus Trapping
- Focus is trapped within the calendar when open
- Tab cycles through calendar controls only
- Escape returns focus to trigger button

### Focus Restoration
- Focus returns to trigger button when calendar closes
- Focus is maintained on selected date when navigating months
- Initial focus goes to selected date or today's date

### Visual Focus Indicators
\`\`\`css
.calendar-day:focus {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  z-index: 10;
}
\`\`\`

## Error Handling and Validation

### Clear Error Messages
\`\`\`tsx
{error && (
  <div
    role="alert"
    aria-live="assertive"
    className="text-destructive text-sm"
  >
    {error.message}
  </div>
)}
\`\`\`

### Input Validation
- Real-time validation with clear feedback
- Error messages are announced to screen readers
- Invalid dates are clearly marked and explained

### Graceful Degradation
- Component works without JavaScript (basic input)
- Progressive enhancement adds calendar functionality
- Fallback to native date input on unsupported browsers

## Testing Accessibility

### Automated Testing
\`\`\`tsx
import { axe, toHaveNoViolations } from 'jest-axe'

test('should not have accessibility violations', async () => {
  const { container } = render(<NepaliDatePicker />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
\`\`\`

### Manual Testing Checklist
- [ ] Navigate entire component using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify high contrast mode compatibility
- [ ] Test with browser zoom at 200%
- [ ] Validate HTML structure and semantics
- [ ] Check color contrast ratios
- [ ] Test focus management and trapping
- [ ] Verify ARIA labels and descriptions

### Screen Reader Testing
\`\`\`bash
# Test with different screen readers
npm run test:sr:nvda     # NVDA (Windows)
npm run test:sr:jaws     # JAWS (Windows)
npm run test:sr:voiceover # VoiceOver (macOS)
npm run test:sr:orca     # Orca (Linux)
\`\`\`

## Best Practices

### Labeling
- Use descriptive labels for all interactive elements
- Provide context for complex interactions
- Include format hints and examples

### Instructions
- Provide clear usage instructions
- Include keyboard shortcut information
- Explain date format and constraints

### Feedback
- Announce important state changes
- Provide confirmation for selections
- Clear error messages with solutions

### Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced experience with full JavaScript support
- Graceful fallbacks for unsupported features

## Common Accessibility Issues and Solutions

### Issue: Focus Lost on Month Navigation
**Solution**: Maintain focus on equivalent date in new month
\`\`\`tsx
const navigateMonth = (direction: number) => {
  const newDate = addMonths(focusedDate, direction)
  const equivalentDate = findEquivalentDate(newDate, focusedDate.day)
  setFocusedDate(equivalentDate)
}
\`\`\`

### Issue: Screen Reader Not Announcing Date Changes
**Solution**: Use live regions with proper timing
\`\`\`tsx
const announceDate = useCallback((date: NepaliDate) => {
  setAnnouncement(`Selected ${formatNepaliDate(date, 'long')}`)
  // Clear announcement after screen reader processes it
  setTimeout(() => setAnnouncement(''), 1000)
}, [])
\`\`\`

### Issue: Calendar Not Keyboard Accessible
**Solution**: Implement comprehensive keyboard handlers
\`\`\`tsx
const keyboardHandlers = {
  ArrowUp: () => navigateDate(-7),
  ArrowDown: () => navigateDate(7),
  ArrowLeft: () => navigateDate(-1),
  ArrowRight: () => navigateDate(1),
  Home: () => navigateToStartOfMonth(),
  End: () => navigateToEndOfMonth(),
  PageUp: () => navigateMonth(-1),
  PageDown: () => navigateMonth(1),
  Enter: () => selectDate(focusedDate),
  Space: () => selectDate(focusedDate),
  Escape: () => closeCalendar()
}
\`\`\`

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Date Picker Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/datepicker/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
