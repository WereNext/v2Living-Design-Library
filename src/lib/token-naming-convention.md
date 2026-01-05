# Design Token Naming Convention

## Overview

For the Living Design Library to properly parse and organize your Figma design tokens, **designers must follow a strict naming convention**. This convention allows the system to:

1. **Group tokens by theme** (Light, Dark, Brand A, etc.)
2. **Categorize tokens by type** (colors, spacing, typography, etc.)
3. **Auto-generate multi-theme design systems**

---

## Required Format

### Theme-Aware Tokens (Recommended)

When you have multiple themes (Light/Dark, Brand variants, etc.):

```
{ThemeName}/{Category}/{TokenName}
```

**Examples:**
- `Light/colors/primary`
- `Light/colors/background`
- `Light/spacing/md`
- `Dark/colors/primary`
- `Dark/colors/background`
- `BrandA/colors/accent`
- `BrandB/colors/accent`

### Single-Theme Tokens (Fallback)

If you only have one theme, you can use flat naming:

```
{Category}/{TokenName}
```

**Examples:**
- `colors/primary`
- `spacing/md`
- `typography/font-sans`

---

## Token Categories

The system recognizes these categories:

| Category | Purpose | Example Tokens |
|----------|---------|----------------|
| `colors` | Color values (HSL, RGB, hex) | `primary`, `background`, `text`, `border` |
| `spacing` | Spacing scale | `xs`, `sm`, `md`, `lg`, `xl`, `2xl` |
| `typography` | Font families | `font-sans`, `font-mono`, `font-serif` |
| `borderRadius` | Border radius values | `radius-sm`, `radius-md`, `radius-lg` |
| `shadows` | Shadow definitions | `shadow-sm`, `shadow-md`, `shadow-lg` |

---

## Figma Variables Setup

### Option 1: Variable Collections (Recommended)

1. **Create Collections for each theme:**
   - Collection: `Light Theme`
   - Collection: `Dark Theme`
   - Collection: `Brand A`

2. **Inside each collection, organize by category:**
   ```
   Light Theme/
   ├── colors/
   │   ├── primary
   │   ├── background
   │   └── foreground
   ├── spacing/
   │   ├── xs
   │   ├── sm
   │   └── md
   └── typography/
       ├── font-sans
       └── font-mono
   ```

3. **Export using Figma Variables Export:**
   - The system will detect collection names as themes
   - Category grouping will be preserved

### Option 2: Manual Naming

If using flat variable names, follow the convention:

```
Light/colors/primary
Light/spacing/md
Dark/colors/primary
Dark/spacing/md
```

---

## Example: Complete Multi-Theme System

### Light Theme
```json
{
  "Light/colors/background": "#FFFFFF",
  "Light/colors/foreground": "#000000",
  "Light/colors/primary": "#3B82F6",
  "Light/spacing/xs": "0.25rem",
  "Light/spacing/sm": "0.5rem",
  "Light/spacing/md": "1rem",
  "Light/typography/font-sans": "Inter, sans-serif",
  "Light/borderRadius/radius-md": "0.5rem",
  "Light/shadows/shadow-sm": "0 1px 2px rgba(0,0,0,0.05)"
}
```

### Dark Theme
```json
{
  "Dark/colors/background": "#000000",
  "Dark/colors/foreground": "#FFFFFF",
  "Dark/colors/primary": "#60A5FA",
  "Dark/spacing/xs": "0.25rem",
  "Dark/spacing/sm": "0.5rem",
  "Dark/spacing/md": "1rem",
  "Dark/typography/font-sans": "Inter, sans-serif",
  "Dark/borderRadius/radius-md": "0.5rem",
  "Dark/shadows/shadow-sm": "0 0 10px rgba(255,255,255,0.1)"
}
```

---

## Parsing Logic

The system will:

1. **Detect theme separator** (`/`)
2. **Extract theme name** (first segment before `/`)
3. **Extract category** (second segment)
4. **Extract token name** (remaining segments)

```javascript
// Input: "Light/colors/primary"
const [themeName, category, ...tokenParts] = path.split('/');
// themeName = "Light"
// category = "colors"
// tokenName = "primary"
```

---

## What Happens if Naming is Incorrect?

❌ **Incorrect naming will result in:**
- Tokens not being grouped into themes
- Variables appearing in wrong categories
- System failing to create multi-theme design systems
- Export errors

✅ **Correct naming ensures:**
- Automatic theme detection
- Proper categorization
- Seamless import/export
- Multi-theme support out of the box

---

## Best Practices

1. **Be Consistent:** Use the same naming pattern across all tokens
2. **Use Semantic Names:** `primary`, `background`, `text` > `blue-500`, `gray-100`
3. **Theme Prefix First:** Always start with theme name for multi-theme systems
4. **Category Second:** Use recognized categories (`colors`, `spacing`, etc.)
5. **Avoid Special Characters:** Use only letters, numbers, hyphens, and underscores in token names

---

## Quick Reference

### ✅ Correct Examples
- `Light/colors/primary`
- `Dark/spacing/md`
- `BrandA/typography/font-sans`
- `Mobile/borderRadius/radius-lg`

### ❌ Incorrect Examples
- `primary-light` (no category)
- `Light-colors-primary` (wrong separator)
- `primary/Light/colors` (wrong order)
- `colors.primary.light` (wrong separator)

---

## Support for Figma Plugin Exports

The system supports tokens from:

1. **Figma Variables Export** (native)
2. **Tokens Studio (Figma Tokens)**
3. **Design Tokens Plugin**
4. **Custom JSON exports**

All must follow the naming convention above!
