# Live Component Preview in Design System Builder

## Overview

The Live Component Preview feature provides real-time visual feedback as users create and customize design tokens in the Design System Builder. It shows how tokens look on actual UI components, making it easier to understand the impact of token changes.

## Features

### 🎨 Real-Time Preview
- **Instant Updates**: Preview updates automatically as tokens are edited
- **No Manual Refresh**: Changes apply immediately via CSS custom properties
- **Full Token Coverage**: Shows colors, spacing, typography, borders, and shadows

### 📦 Component Categories

The preview includes examples from all major UI component categories:

1. **Buttons** - Primary, secondary, outline, ghost, destructive variants
2. **Cards** - Product cards, notifications, content blocks
3. **Forms** - Inputs, labels, form elements
4. **Badges & Tags** - Status indicators, labels, counts
5. **Alerts** - Success, error, info, warning messages
6. **Interactive Elements** - Icon buttons, action buttons
7. **Typography** - Headings (H1-H3), body text, muted text
8. **Color Palette** - All semantic color swatches
9. **Shadows & Borders** - Different elevation levels

### 🎯 User Experience

**Collapsible by Default**
- Preview is collapsed initially to avoid overwhelming new users
- Click header to expand/collapse
- Smooth animation for better UX

**Clear Visual Hierarchy**
- Organized into logical sections
- Each section labeled with icon and title
- Consistent spacing and layout

**Helpful Context**
- Real-time badge to indicate live updates
- Description text explaining the feature
- Alert at bottom explaining how it works

## Integration

### Location
The Live Component Preview is integrated directly into the Design System Builder at [DesignSystemBuilder.tsx:368](src/components/design-system-builder/DesignSystemBuilder.tsx#L368), positioned after the token editing tabs and before the system summary.

### Props

```typescript
interface LiveTokenPreviewProps {
  /** Whether the preview is expanded by default */
  defaultExpanded?: boolean;
}
```

**Usage:**
```tsx
<LiveTokenPreview defaultExpanded={false} />
```

## Technical Implementation

### How It Works

1. **CSS Custom Properties**: All components use CSS custom properties (CSS variables) for styling
2. **Dynamic Theme Engine**: The `injectThemeCSS` function updates CSS variables in real-time
3. **Live Updates**: As users edit tokens, CSS variables update, and the preview re-renders
4. **No Props Needed**: Preview doesn't need token props - it reads from the active theme automatically

### Code Example

```tsx
// Token update flow
User edits color → useVariables hook updates state → handleGenerate creates system
  → injectThemeCSS updates CSS variables → Preview components re-render with new styles
```

### Performance

- **No Re-renders**: Only CSS updates, no React re-renders needed
- **Instant Updates**: CSS variable changes are instant
- **Lightweight**: All components are already imported (no lazy loading overhead)

## User Flow

### For New Users
1. User navigates to Design System Builder
2. Sees "Live Component Preview" card (collapsed)
3. Can expand to see examples whenever ready
4. Preview helps understand what tokens control

### For Power Users
1. Open preview at start
2. Edit tokens in tabs above
3. Watch preview update in real-time
4. Quickly iterate on design decisions

## Benefits

### 🎓 Educational
- **Learn Token Mapping**: See which tokens affect which components
- **Understand Impact**: Visualize changes before committing
- **Discover Patterns**: Learn design system conventions

### ⚡ Productivity
- **Faster Iteration**: No need to navigate to component pages
- **Immediate Feedback**: See results instantly
- **Context Switching**: Reduce mental overhead

### ✅ Quality Assurance
- **Spot Issues Early**: See contrast problems immediately
- **Test Combinations**: Try different token combinations quickly
- **Validate Accessibility**: Check readability and usability

## Component Library

The preview uses shadcn/ui components:
- Button (all variants)
- Card, CardHeader, CardTitle, CardDescription, CardContent
- Input, Label
- Badge (all variants)
- Alert, AlertDescription

All components respect the design system tokens being edited.

## Future Enhancements

### 1. Interactive Mode
Allow users to interact with components (click buttons, type in inputs)

### 2. Dark Mode Toggle
Show preview in both light and dark modes simultaneously

### 3. Responsive Preview
Show how components look at different breakpoints

### 4. Custom Component Import
Allow users to add their own components to the preview

### 5. Comparison View
Show before/after when loading templates

### 6. Export Screenshot
Generate preview screenshots for documentation

### 7. Accessibility Checker
Real-time contrast ratio and WCAG compliance checking

### 8. Animation Preview
Show transitions and animations with current timing tokens

## Keyboard Shortcuts

Future enhancement:
- `Cmd/Ctrl + P`: Toggle preview visibility
- `Cmd/Ctrl + E`: Expand all preview sections
- `Cmd/Ctrl + C`: Collapse all preview sections

## Mobile Responsiveness

The preview is fully responsive:
- **Desktop**: 2-column grid for cards
- **Tablet**: 2-column grid with adjusted spacing
- **Mobile**: Single column, stacked layout

## Accessibility

- ✅ Keyboard navigable (collapsible header is focusable)
- ✅ Screen reader friendly (semantic HTML)
- ✅ High contrast support (respects system preferences)
- ✅ Reduced motion support (respects prefers-reduced-motion)

## Testing Scenarios

### Basic Functionality
1. ✅ Preview collapses/expands on header click
2. ✅ All component variants render correctly
3. ✅ Preview respects current theme tokens
4. ✅ Layout is responsive on all screen sizes

### Token Updates
1. ✅ Color changes reflect immediately
2. ✅ Spacing changes update layout
3. ✅ Typography changes affect text
4. ✅ Border radius updates corners
5. ✅ Shadow changes update elevation

### Edge Cases
1. ✅ Works with minimal token set
2. ✅ Works with full token set
3. ✅ Handles invalid color values gracefully
4. ✅ Handles missing tokens (fallback to defaults)

## Known Limitations

1. **No Animation Preview**: Static preview only (no hover states, animations)
2. **Limited Variants**: Shows common variants, not all possible combinations
3. **No Custom Components**: Can't preview user's own components
4. **Single Theme**: Shows only active theme (no side-by-side comparison)

## Usage Statistics (Future)

Track how users interact with the preview:
- Expansion rate (% of users who expand)
- Time spent viewing preview
- Correlation between preview usage and system quality
- Most viewed component categories

## Related Documentation

- [Design System Builder](src/components/design-system-builder/DesignSystemBuilder.tsx)
- [Dynamic Theme Engine](src/lib/dynamic-theme-engine.ts)
- [Token Variables Hook](src/components/design-system-builder/useVariables.ts)
- [Design System Types](src/components/design-system-builder/types.ts)

## Changelog

### Version 1.0 (2026-01-22)
- ✅ Initial implementation with all major component categories
- ✅ Collapsible UI with smooth animations
- ✅ Fully responsive layout
- ✅ Integrated into Design System Builder
- ✅ Real-time updates via CSS custom properties
- ✅ Comprehensive component coverage (buttons, cards, forms, badges, alerts, typography, colors, shadows)
