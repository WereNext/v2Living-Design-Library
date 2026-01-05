# LDL Token Specification v1.0

**Living Design Library Token Format**

A tool-agnostic, CSS-native design token specification for the modern web.

---

## Abstract

The LDL Token Specification defines a JSON-based format for design tokens that is:

- **Tool-agnostic** - Works with Figma, Penpot, Affinity, or no design tool at all
- **CSS-native** - Values are production-ready CSS, no transformation required
- **Semantic-first** - Names describe intent and purpose, not appearance
- **Foreground-paired** - Every background color includes its accessible text color
- **Mode-aware** - Built-in support for light/dark themes without file duplication
- **Human-readable** - Designed to be authored and reviewed by humans

---

## 1. File Format

### 1.1 Media Type

```
application/ldl-tokens+json
```

### 1.2 File Extensions

- `.ldl.json` (recommended)
- `.tokens.json` (compatible)

### 1.3 Encoding

UTF-8 without BOM.

---

## 2. Document Structure

An LDL token file is a JSON object with the following top-level structure:

```json
{
  "$schema": "https://ldl.dev/schema/v1",
  "$name": "My Design System",
  "$description": "Optional description of the token set",
  "$version": "1.0.0",

  "color": { },
  "space": { },
  "radius": { },
  "shadow": { },
  "font": { },
  "duration": { },
  "ease": { },

  "mode": { }
}
```

### 2.1 Metadata Properties

Properties prefixed with `$` are metadata:

| Property | Required | Description |
|----------|----------|-------------|
| `$schema` | No | URL to the LDL schema for validation |
| `$name` | Yes | Human-readable name of the token set |
| `$description` | No | Description of the token set's purpose |
| `$version` | No | Semantic version of the token set |

### 2.2 Token Categories

| Category | Description | CSS Output |
|----------|-------------|------------|
| `color` | Color tokens with foreground pairing | `--color-*` |
| `space` | Spacing and sizing values | `--space-*` |
| `radius` | Border radius values | `--radius-*` |
| `shadow` | Box shadow definitions | `--shadow-*` |
| `font` | Typography tokens | `--font-*` |
| `duration` | Animation/transition durations | `--duration-*` |
| `ease` | Easing/timing functions | `--ease-*` |
| `mode` | Theme mode overrides (light/dark) | Contextual |

---

## 3. Color Tokens

Colors are the foundation of visual design. LDL uses a **semantic + foreground pairing** approach.

### 3.1 Structure

```json
{
  "color": {
    "primary": {
      "value": "#3b82f6",
      "foreground": "#ffffff",
      "description": "Primary brand color for actions and emphasis"
    },
    "background": {
      "value": "#ffffff",
      "foreground": "#0a0a0a"
    }
  }
}
```

### 3.2 Semantic Color Roles

LDL defines these semantic color roles:

#### Core Colors (Required)

| Token | Purpose | Usage |
|-------|---------|-------|
| `primary` | Brand color, primary actions | Buttons, links, focus states |
| `secondary` | Supporting actions | Secondary buttons, less prominent UI |
| `background` | Page/app background | Body background |
| `foreground` | Default text on background | Body text (alias for background.foreground) |

#### Surface Colors (Recommended)

| Token | Purpose | Usage |
|-------|---------|-------|
| `card` | Elevated surface | Cards, panels, modals |
| `popover` | Floating surface | Dropdowns, tooltips, popovers |
| `muted` | Subdued surface | Disabled states, subtle backgrounds |

#### Semantic Colors (Recommended)

| Token | Purpose | Usage |
|-------|---------|-------|
| `destructive` | Dangerous actions | Delete buttons, error states |
| `success` | Positive feedback | Success messages, valid states |
| `warning` | Caution indicators | Warning messages, pending states |
| `info` | Informational | Info banners, help text |

#### UI Colors (Recommended)

| Token | Purpose | Usage |
|-------|---------|-------|
| `border` | Default borders | Dividers, input borders |
| `input` | Form input backgrounds | Text fields, selects |
| `ring` | Focus ring color | Keyboard focus indicators |
| `accent` | Accent highlights | Hover states, active indicators |

### 3.3 Color Value Formats

LDL accepts any valid CSS color value:

```json
{
  "color": {
    "hex": { "value": "#3b82f6", "foreground": "#ffffff" },
    "rgb": { "value": "rgb(59, 130, 246)", "foreground": "#ffffff" },
    "hsl": { "value": "hsl(217, 91%, 60%)", "foreground": "#ffffff" },
    "oklch": { "value": "oklch(0.623 0.214 259)", "foreground": "#ffffff" },
    "named": { "value": "rebeccapurple", "foreground": "#ffffff" }
  }
}
```

### 3.4 Foreground Pairing Rationale

Every color that can be used as a background MUST include a `foreground` value that provides accessible contrast (minimum WCAG AA 4.5:1 for normal text).

This eliminates:
- Manual contrast checking
- Accessibility bugs in production
- Guesswork about text colors

```json
{
  "color": {
    "primary": {
      "value": "#3b82f6",
      "foreground": "#ffffff"
    }
  }
}
```

Generates:
```css
:root {
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
}
```

Usage:
```css
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
}
```

### 3.5 Simple Color Syntax

For tokens that don't need foregrounds (borders, rings), use simple string values:

```json
{
  "color": {
    "border": "#e4e4e7",
    "ring": "#3b82f6"
  }
}
```

---

## 4. Space Tokens

Spacing tokens define consistent rhythm throughout the UI.

### 4.1 Structure

```json
{
  "space": {
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem",
    "12": "3rem",
    "16": "4rem",
    "24": "6rem",
    "32": "8rem"
  }
}
```

### 4.2 Semantic Spacing (Alternative)

For teams preferring semantic names:

```json
{
  "space": {
    "none": "0",
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem",
    "3xl": "4rem"
  }
}
```

### 4.3 Generated Output

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  /* ... */
}
```

---

## 5. Radius Tokens

Border radius tokens for consistent corner rounding.

### 5.1 Structure

```json
{
  "radius": {
    "none": "0",
    "sm": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "2xl": "1rem",
    "full": "9999px"
  }
}
```

### 5.2 Generated Output

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;
}
```

---

## 6. Shadow Tokens

Box shadow definitions for elevation and depth.

### 6.1 Structure

```json
{
  "shadow": {
    "none": "none",
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"
  }
}
```

### 6.2 Generated Output

```css
:root {
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  /* ... */
}
```

---

## 7. Font Tokens

Typography tokens for consistent text styling.

### 7.1 Structure

```json
{
  "font": {
    "family": {
      "sans": "Inter, system-ui, sans-serif",
      "serif": "Georgia, Times New Roman, serif",
      "mono": "JetBrains Mono, Consolas, monospace"
    },
    "size": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    },
    "weight": {
      "thin": "100",
      "light": "300",
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700",
      "black": "900"
    },
    "leading": {
      "none": "1",
      "tight": "1.25",
      "snug": "1.375",
      "normal": "1.5",
      "relaxed": "1.625",
      "loose": "2"
    },
    "tracking": {
      "tighter": "-0.05em",
      "tight": "-0.025em",
      "normal": "0",
      "wide": "0.025em",
      "wider": "0.05em",
      "widest": "0.1em"
    }
  }
}
```

### 7.2 Generated Output

```css
:root {
  --font-family-sans: Inter, system-ui, sans-serif;
  --font-family-serif: Georgia, Times New Roman, serif;
  --font-family-mono: JetBrains Mono, Consolas, monospace;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  /* ... */

  --font-weight-thin: 100;
  --font-weight-normal: 400;
  --font-weight-bold: 700;
  /* ... */

  --font-leading-normal: 1.5;
  --font-tracking-normal: 0;
}
```

---

## 8. Duration Tokens

Animation and transition timing.

### 8.1 Structure

```json
{
  "duration": {
    "instant": "0ms",
    "fast": "100ms",
    "normal": "200ms",
    "slow": "300ms",
    "slower": "500ms"
  }
}
```

### 8.2 Generated Output

```css
:root {
  --duration-instant: 0ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
}
```

---

## 9. Ease Tokens

Easing functions for animations.

### 9.1 Structure

```json
{
  "ease": {
    "linear": "linear",
    "in": "cubic-bezier(0.4, 0, 1, 1)",
    "out": "cubic-bezier(0, 0, 0.2, 1)",
    "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
    "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
  }
}
```

### 9.2 Generated Output

```css
:root {
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

## 10. Mode Overrides

Modes allow tokens to have different values in different contexts (light/dark themes, brands).

### 10.1 Structure

```json
{
  "color": {
    "background": { "value": "#ffffff", "foreground": "#0a0a0a" },
    "card": { "value": "#ffffff", "foreground": "#0a0a0a" },
    "primary": { "value": "#3b82f6", "foreground": "#ffffff" }
  },

  "mode": {
    "dark": {
      "color": {
        "background": { "value": "#0a0a0a", "foreground": "#fafafa" },
        "card": { "value": "#18181b", "foreground": "#fafafa" }
      },
      "shadow": {
        "md": "0 4px 6px -1px rgb(0 0 0 / 0.3)"
      }
    },

    "high-contrast": {
      "color": {
        "primary": { "value": "#0000ff", "foreground": "#ffffff" },
        "border": "#000000"
      }
    }
  }
}
```

### 10.2 Generated Output

```css
:root {
  --color-background: #ffffff;
  --color-background-foreground: #0a0a0a;
  --color-card: #ffffff;
  --color-card-foreground: #0a0a0a;
}

.dark, [data-mode="dark"] {
  --color-background: #0a0a0a;
  --color-background-foreground: #fafafa;
  --color-card: #18181b;
  --color-card-foreground: #fafafa;
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3);
}

.high-contrast, [data-mode="high-contrast"] {
  --color-primary: #0000ff;
  --color-primary-foreground: #ffffff;
  --color-border: #000000;
}
```

---

## 11. Component Tokens (Optional)

For design systems that need component-level customization.

### 11.1 Structure

```json
{
  "component": {
    "button": {
      "radius": "{radius.md}",
      "padding-x": "{space.4}",
      "padding-y": "{space.2}",
      "font-weight": "{font.weight.medium}"
    },
    "card": {
      "radius": "{radius.lg}",
      "padding": "{space.6}",
      "shadow": "{shadow.md}"
    },
    "input": {
      "radius": "{radius.md}",
      "border-color": "{color.border}",
      "focus-ring": "{color.ring}"
    }
  }
}
```

### 11.2 Token References

Use curly braces `{category.token}` to reference other tokens:

```json
{
  "color": {
    "primary": { "value": "#3b82f6", "foreground": "#ffffff" },
    "button-bg": "{color.primary}"
  }
}
```

---

## 12. Complete Example

```json
{
  "$schema": "https://ldl.dev/schema/v1",
  "$name": "Acme Design System",
  "$version": "2.0.0",

  "color": {
    "primary": { "value": "#3b82f6", "foreground": "#ffffff" },
    "secondary": { "value": "#6b7280", "foreground": "#ffffff" },
    "background": { "value": "#ffffff", "foreground": "#0a0a0a" },
    "card": { "value": "#ffffff", "foreground": "#0a0a0a" },
    "muted": { "value": "#f4f4f5", "foreground": "#71717a" },
    "destructive": { "value": "#ef4444", "foreground": "#ffffff" },
    "success": { "value": "#22c55e", "foreground": "#ffffff" },
    "warning": { "value": "#f59e0b", "foreground": "#000000" },
    "border": "#e4e4e7",
    "ring": "#3b82f6"
  },

  "space": {
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem",
    "12": "3rem",
    "16": "4rem"
  },

  "radius": {
    "none": "0",
    "sm": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },

  "shadow": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)"
  },

  "font": {
    "family": {
      "sans": "Inter, system-ui, sans-serif",
      "mono": "JetBrains Mono, monospace"
    },
    "size": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem"
    },
    "weight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    }
  },

  "duration": {
    "fast": "100ms",
    "normal": "200ms",
    "slow": "300ms"
  },

  "ease": {
    "out": "cubic-bezier(0, 0, 0.2, 1)",
    "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
  },

  "mode": {
    "dark": {
      "color": {
        "background": { "value": "#0a0a0a", "foreground": "#fafafa" },
        "card": { "value": "#18181b", "foreground": "#fafafa" },
        "muted": { "value": "#27272a", "foreground": "#a1a1aa" },
        "border": "#27272a"
      },
      "shadow": {
        "md": "0 4px 6px -1px rgb(0 0 0 / 0.4)"
      }
    }
  }
}
```

---

## 13. Design Principles

### 13.1 Semantic Over Visual

**Bad:** `blue-500`, `gray-200`, `large`
**Good:** `primary`, `muted`, `lg`

Names should describe purpose, not appearance. This enables theming without renaming.

### 13.2 Flat Over Nested

**Bad:** `colors.brand.primary.base.default`
**Good:** `color.primary`

Minimize nesting. Most systems don't need more than 2 levels.

### 13.3 CSS-Native Values

**Bad:** `{ "value": 16, "unit": "px" }`
**Good:** `"16px"` or `"1rem"`

Values should be copy-pasteable into CSS.

### 13.4 Foreground Pairing

**Bad:** Separate `text-on-primary` token that might get out of sync
**Good:** `primary.foreground` bundled with `primary.value`

Accessibility is built in, not bolted on.

### 13.5 Scales Use Consistent Names

| Scale | Options |
|-------|---------|
| Size | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` |
| Numeric | `0`, `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`, `24`, `32` |
| Semantic | `none`, `tight`, `normal`, `relaxed`, `loose` |

Pick one scale pattern and use it consistently.

---

## 14. Conversion from Other Formats

### 14.1 From W3C DTCG

```json
// W3C DTCG
{
  "color-primary": {
    "$value": "#3b82f6",
    "$type": "color"
  }
}

// LDL
{
  "color": {
    "primary": { "value": "#3b82f6", "foreground": "#ffffff" }
  }
}
```

### 14.2 From Figma Variables API

```json
// Figma Variables API
{
  "meta": {
    "variables": {
      "VariableID:123": {
        "name": "colors/primary",
        "resolvedType": "COLOR",
        "valuesByMode": {
          "ModeID:456": { "r": 0.231, "g": 0.51, "b": 0.965, "a": 1 }
        }
      }
    }
  }
}

// LDL
{
  "color": {
    "primary": { "value": "#3b82f6", "foreground": "#ffffff" }
  }
}
```

### 14.3 From Tokens Studio

```json
// Tokens Studio
{
  "colors": {
    "primary": {
      "value": "#3b82f6",
      "type": "color"
    }
  }
}

// LDL
{
  "color": {
    "primary": { "value": "#3b82f6", "foreground": "#ffffff" }
  }
}
```

---

## 15. Export Targets

LDL files can be transformed to:

| Target | Description |
|--------|-------------|
| CSS Variables | Native CSS custom properties |
| SCSS Variables | Sass/SCSS `$variable` format |
| Tailwind Config | `tailwind.config.js` theme extension |
| Tailwind v4 CSS | `@theme` directive format |
| JSON | Normalized JSON for JavaScript consumption |
| TypeScript | Type-safe token constants |
| iOS Swift | `UIColor` and `CGFloat` constants |
| Android XML | `colors.xml` and `dimens.xml` resources |
| React Native | StyleSheet-compatible objects |
| W3C DTCG | Standard format for tool interop |
| Figma Variables | Figma REST API format |

---

## 16. Validation Rules

1. `$name` is required
2. All color tokens used as backgrounds MUST have a `foreground` property
3. Token names must not contain: `$`, `{`, `}`, `.` (except in references)
4. References (`{category.token}`) must point to existing tokens
5. Mode overrides must only override existing base tokens
6. Values must be valid CSS for their category

---

## 17. Versioning

This specification follows semantic versioning:

- **MAJOR**: Breaking changes to structure or validation
- **MINOR**: New optional features, new categories
- **PATCH**: Clarifications, typo fixes

Current version: **1.0.0**

---

## 18. License

This specification is released under the MIT License.

---

## 19. Acknowledgments

LDL Token Specification draws inspiration from:

- [W3C Design Tokens Community Group](https://www.designtokens.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix Colors](https://www.radix-ui.com/colors)
- [Open Props](https://open-props.style/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [IBM Carbon Design System](https://carbondesignsystem.com/)

---

## Appendix A: Quick Reference

### Minimal Valid File

```json
{
  "$name": "My Tokens",
  "color": {
    "primary": { "value": "#3b82f6", "foreground": "#ffffff" },
    "background": { "value": "#ffffff", "foreground": "#000000" }
  }
}
```

### CSS Variable Naming

| LDL Path | CSS Variable |
|----------|--------------|
| `color.primary.value` | `--color-primary` |
| `color.primary.foreground` | `--color-primary-foreground` |
| `space.4` | `--space-4` |
| `radius.md` | `--radius-md` |
| `font.family.sans` | `--font-family-sans` |
| `font.size.base` | `--font-size-base` |

### Reserved Token Names

These names have semantic meaning and should be used consistently:

**Colors:** `primary`, `secondary`, `background`, `foreground`, `card`, `popover`, `muted`, `accent`, `destructive`, `success`, `warning`, `info`, `border`, `input`, `ring`

**Scales:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`

**Font Families:** `sans`, `serif`, `mono`

**States:** `none`, `normal`, `full`
