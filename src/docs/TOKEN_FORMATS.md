# Supported Token Formats

The Living Design Library supports **any well-structured design token format** through its universal token parser. This document shows all supported formats and examples.

## 📋 Supported Formats

### 1️⃣ **W3C Design Tokens Format** (Recommended)
The official Community Group specification with `$value` and `$type`.

```json
{
  "color": {
    "primary": {
      "$value": "#3B82F6",
      "$type": "color",
      "$description": "Primary brand color"
    },
    "secondary": {
      "$value": "#8B5CF6",
      "$type": "color"
    }
  },
  "spacing": {
    "md": {
      "$value": "16px",
      "$type": "dimension"
    }
  },
  "border-radius": {
    "md": {
      "$value": "8px",
      "$type": "borderRadius"
    }
  }
}
```

### 2️⃣ **Style Dictionary Format**
Amazon's popular token format with `value` and `type`.

```json
{
  "color": {
    "base": {
      "red": { "value": "#FF0000", "type": "color" },
      "blue": { "value": "#0000FF", "type": "color" }
    },
    "brand": {
      "primary": { "value": "{color.base.blue}", "type": "color" }
    }
  },
  "size": {
    "spacing": {
      "small": { "value": "8px", "type": "dimension" },
      "medium": { "value": "16px", "type": "dimension" }
    }
  }
}
```

### 3️⃣ **Tokens Studio (Figma Plugin) Format**
Popular Figma tokens plugin format.

```json
{
  "global": {
    "colors": {
      "primary": {
        "value": "#3B82F6",
        "type": "color"
      },
      "secondary": {
        "value": "#8B5CF6",
        "type": "color"
      }
    },
    "spacing": {
      "sm": { "value": "8", "type": "spacing" },
      "md": { "value": "16", "type": "spacing" }
    }
  }
}
```

### 4️⃣ **Figma Variables Export**
Direct export from Figma's Variables API.

```json
{
  "name": "Design System",
  "variables": [
    {
      "id": "123",
      "name": "colors/primary",
      "resolvedType": "COLOR",
      "valuesByMode": {
        "mode1": "#3B82F6"
      }
    },
    {
      "id": "456",
      "name": "spacing/md",
      "resolvedType": "FLOAT",
      "valuesByMode": {
        "mode1": 16
      }
    }
  ]
}
```

### 5️⃣ **Simple Nested Format**
Clean, minimal nested structure.

```json
{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#8B5CF6",
    "background": "#FFFFFF",
    "text": "#1F2937"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px"
  },
  "typography": {
    "font-family": "Inter, sans-serif",
    "font-size-base": "16px",
    "line-height": "1.5"
  },
  "shadows": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 4px 6px rgba(0,0,0,0.1)"
  }
}
```

### 6️⃣ **Flat Format with Categories**
Simple flat structure with top-level categories.

```json
{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#8B5CF6"
  },
  "spacing": {
    "md": "16px",
    "lg": "24px"
  },
  "borderRadius": {
    "md": "8px"
  }
}
```

### 7️⃣ **CSS Variables Format**
Standard CSS custom properties.

```css
:root {
  --primary: #3B82F6;
  --secondary: #8B5CF6;
  --background: #FFFFFF;
  --foreground: #1F2937;
  
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}
```

### 8️⃣ **Deeply Nested Format**
Unlimited nesting depth supported.

```json
{
  "brand": {
    "colors": {
      "primary": {
        "100": "#E0F2FE",
        "500": "#3B82F6",
        "900": "#1E3A8A"
      },
      "secondary": {
        "light": "#C4B5FD",
        "base": "#8B5CF6",
        "dark": "#5B21B6"
      }
    }
  },
  "semantic": {
    "colors": {
      "success": "#10B981",
      "error": "#EF4444",
      "warning": "#F59E0B"
    }
  }
}
```

### 9️⃣ **Theme-Aware Format**
Multi-theme systems with naming convention `{Theme}/{Category}/{Token}`.

```json
{
  "Light/colors/primary": "#3B82F6",
  "Light/colors/background": "#FFFFFF",
  "Light/spacing/md": "16px",
  
  "Dark/colors/primary": "#60A5FA",
  "Dark/colors/background": "#1F2937",
  "Dark/spacing/md": "16px",
  
  "HighContrast/colors/primary": "#000000",
  "HighContrast/colors/background": "#FFFFFF",
  "HighContrast/spacing/md": "20px"
}
```

## 🎯 Automatic Detection

The parser **automatically detects** the format and converts it to the standard internal format:

```typescript
import { parseTokens } from './lib/token-utilities';

// Works with ANY of the above formats!
const tokens = parseTokens(yourTokenData);
```

## 🔄 Format Conversion

### Supported Input Types:
- ✅ **W3C Design Tokens** - `$value`, `$type`
- ✅ **Style Dictionary** - `value`, `type`
- ✅ **Tokens Studio** - Nested with `value`, `type`
- ✅ **Figma Variables** - `variables` array
- ✅ **CSS Variables** - `--token: value`
- ✅ **Flat Objects** - Direct key-value pairs
- ✅ **Nested Objects** - Unlimited depth
- ✅ **Theme-Aware** - Path-based themes

### Supported Type Detection:
- 🎨 **Colors** - Hex, RGB, HSL (auto-converted to HSL)
- 📏 **Spacing** - px, rem, em (auto-converted to rem)
- ✍️ **Typography** - Font families, sizes, weights, line-heights
- 🔲 **Border Radius** - px, rem (auto-converted to rem)
- 🌫️ **Shadows** - Box shadows, elevations

## 🚀 Usage Examples

### Import Standard Format
```typescript
const tokens = {
  colors: {
    primary: "#3B82F6",
    secondary: "#8B5CF6"
  },
  spacing: {
    md: "16px"
  }
};

const parsed = parseTokens(tokens);
applyTokensToDocument(parsed);
```

### Import W3C Format
```typescript
const tokens = {
  color: {
    primary: { $value: "#3B82F6", $type: "color" }
  }
};

const parsed = parseTokens(tokens);
applyTokensToDocument(parsed);
```

### Import Figma Variables
```typescript
const figmaExport = {
  variables: [
    {
      name: "colors/primary",
      resolvedType: "COLOR",
      valuesByMode: { mode1: "#3B82F6" }
    }
  ]
};

const parsed = parseTokens(figmaExport);
applyTokensToDocument(parsed);
```

### Import Multi-Theme
```typescript
const themeTokens = {
  "Light/colors/primary": "#3B82F6",
  "Dark/colors/primary": "#60A5FA"
};

const system = parseThemeAwareTokens(themeTokens);
// Returns: { name: "Imported Design System", themes: [...] }
```

## 📤 Export Formats

The library can export tokens to multiple formats:

```typescript
import { 
  tokenSetToCSS,
  exportToStyleDictionary,
  exportToTailwind,
  exportToSCSS,
  exportToJSON,
  exportToiOS,
  exportToAndroid,
  exportToFigma
} from './lib/export-utilities';

// Export to CSS
const css = tokenSetToCSS(tokens);

// Export to JSON
const json = exportToJSON(tokens, { format: 'w3c' });

// Export to Tailwind config
const tailwind = exportToTailwind(tokens);
```

## 🎨 Color Format Support

### Input Formats:
- `#3B82F6` - Hex
- `rgb(59, 130, 246)` - RGB
- `hsl(217, 92%, 60%)` - HSL
- `217 92% 60%` - Space-separated HSL

### Output Format:
All colors normalized to **space-separated HSL** for consistency:
```
217 92% 60%
```

## 📏 Spacing Format Support

### Input Formats:
- `16` - Number (treated as pixels)
- `16px` - Pixels
- `1rem` - Rem units
- `1em` - Em units

### Output Format:
All spacing normalized to **rem** units:
```
1rem
```

## 🔍 Type Inference

The parser uses intelligent type inference based on:

1. **Explicit Type** (`$type` or `type` field)
2. **Property Name** (e.g., "color-primary" → color)
3. **Parent Path** (e.g., "colors/primary" → color)
4. **Value Format** (e.g., "#000" → color)

## ✨ Best Practices

1. **Use W3C Format** for maximum compatibility
2. **Include `$type`** for explicit categorization
3. **Use Semantic Names** (primary, secondary, not blue, purple)
4. **Organize by Category** (colors, spacing, typography)
5. **Version Your Tokens** (include version number)
6. **Document References** (note any token aliases)

## 🆘 Troubleshooting

### "Unable to parse token format"
- Ensure JSON is valid
- Check that at least one token exists
- Verify structure matches one of the supported formats

### Colors not applying correctly
- Ensure color values are valid hex, rgb, or hsl
- Check for typos in color names

### Spacing values incorrect
- Verify units are included (px, rem)
- Check for numeric values without units

## 📚 Resources

- [W3C Design Tokens Specification](https://design-tokens.github.io/community-group/format/)
- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [Tokens Studio Documentation](https://docs.tokens.studio/)
- [Figma Variables API](https://www.figma.com/plugin-docs/api/variables/)
