# 🎨 Figma Variables Import Guide

## Complete End-to-End Workflow

This guide explains how to properly export design tokens from Figma and import them into the Living Design Library for seamless code generation.

---

## 📊 Supported Token Formats

The Living Design Library accepts **3 different formats** for importing design tokens:

### 1. **Standard JSON Format** (Recommended)
```json
{
  "name": "My Design System",
  "description": "Company design system",
  "tokens": {
    "colors": {
      "primary": "221.2 83.2% 53.3%",
      "secondary": "210 40% 96.1%",
      "accent": "210 40% 96.1%",
      "destructive": "0 84.2% 60.2%",
      "background": "0 0% 100%",
      "foreground": "222.2 84% 4.9%",
      "border": "214.3 31.8% 91.4%",
      "ring": "221.2 83.2% 53.3%"
    },
    "spacing": {
      "xs": "0.5rem",
      "sm": "0.75rem",
      "md": "1rem",
      "lg": "1.5rem",
      "xl": "2rem"
    },
    "typography": {
      "font-sans": "Inter, system-ui, sans-serif",
      "font-mono": "JetBrains Mono, monospace",
      "fontSize-sm": "0.875rem",
      "fontSize-base": "1rem",
      "fontSize-lg": "1.125rem"
    },
    "borderRadius": {
      "sm": "0.375rem",
      "md": "0.625rem",
      "lg": "1rem",
      "full": "9999px"
    },
    "shadows": {
      "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)"
    }
  }
}
```

### 2. **Figma Variables JSON** (Direct Export)
```json
{
  "name": "My Figma Design System",
  "variables": [
    {
      "id": "VariableID:1",
      "name": "primary",
      "resolvedType": "COLOR",
      "valuesByMode": {
        "mode1": "221.2 83.2% 53.3%"
      }
    },
    {
      "id": "VariableID:2",
      "name": "spacing-sm",
      "resolvedType": "FLOAT",
      "valuesByMode": {
        "mode1": "0.75rem"
      }
    }
  ]
}
```

### 3. **CSS Variables Format**
```css
--primary: 221.2 83.2% 53.3%;
--secondary: 210 40% 96.1%;
--spacing-sm: 0.75rem;
--spacing-md: 1rem;
--radius: 0.625rem;
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

---

## 🚀 Step-by-Step: Exporting from Figma

### Method 1: Using Figma Variables (Native)

1. **Open Your Figma File**
   - Navigate to the file with your design system

2. **Access Variables Panel**
   - Click the **Local Variables** icon in the toolbar
   - Or press `Option + Shift + K` (Mac) / `Alt + Shift + K` (Windows)

3. **Export Variables**
   - Currently, Figma doesn't have native JSON export
   - You'll need to use a plugin (see Method 2)

### Method 2: Using Figma Plugins (Recommended)

#### **Option A: Figma Tokens Studio**
1. Install "Figma Tokens" plugin
2. Open the plugin in your file
3. Click **Export** → **JSON**
4. Copy the generated JSON

#### **Option B: Variables to Code**
1. Install "Variables to Code" plugin
2. Select your variable collections
3. Export as **JSON** format
4. Copy the output

#### **Option C: Design Tokens**
1. Install "Design Tokens" plugin
2. Configure token mappings
3. Export as **JSON**

---

## 📥 Importing to Living Design Library

### Step 1: Navigate to Import Screen

1. Open the Living Design Library
2. Go to **Design System** tab
3. Click **Import Tokens**

### Step 2: Choose Import Method

#### **Method A: Paste JSON**

1. Select the **JSON** tab
2. Paste your Figma JSON export
3. Click **Preview** to validate
4. Click **Import JSON** to apply

#### **Method B: Upload File**

1. Click the **Import from File** section
2. Upload your `.json` or `.css` file
3. Tokens are automatically applied

#### **Method C: Use Design System Builder**

1. Click **Create Design System**
2. Fill in the form with your token values
3. Choose to apply immediately or save to library

---

## 🔍 Token Mapping & Validation

### Color Format Requirements

The library supports **3 color formats**:

1. **HSL (Recommended)**
   ```json
   "primary": "221.2 83.2% 53.3%"
   ```
   - Used for theme switching
   - Best for Tailwind integration

2. **Hex**
   ```json
   "primary": "#3B82F6"
   ```
   - Automatically converted to HSL

3. **RGB**
   ```json
   "primary": "59 130 246"
   ```
   - Automatically converted to HSL

### Required Color Tokens

For full component support, include these semantic colors:

- `primary` - Primary brand color
- `secondary` - Secondary brand color
- `accent` - Accent/highlight color
- `destructive` - Error/danger color
- `background` - Page background
- `foreground` - Primary text color
- `border` - Border color
- `ring` - Focus ring color

### Optional but Recommended

- `primary-foreground` - Text on primary background
- `secondary-foreground` - Text on secondary background
- `muted` - Muted background color
- `muted-foreground` - Muted text color
- `card` - Card background
- `card-foreground` - Card text

---

## 🎯 How Tokens Flow Through the System

### 1. Import → CSS Variables
```javascript
// Your imported JSON:
{
  "colors": {
    "primary": "221.2 83.2% 53.3%"
  }
}

// Becomes CSS variable:
:root {
  --primary: 221.2 83.2% 53.3%;
}
```

### 2. CSS Variables → Tailwind
```css
/* Tailwind v4 automatically maps CSS variables */
.bg-primary {
  background-color: hsl(var(--primary));
}
```

### 3. Tailwind → Components
```tsx
// Button component uses Tailwind classes
<Button className="bg-primary text-primary-foreground">
  Click Me
</Button>

// Which resolves to:
<button style="background-color: hsl(221.2 83.2% 53.3%)">
  Click Me
</button>
```

---

## 🔄 Multi-Framework Export

Once tokens are imported, you can export components to any framework with your tokens included:

### React (Native)
```tsx
import { Button } from './components/ui/button';

<Button className="bg-primary text-primary-foreground">
  My Button
</Button>

// CSS Variables needed:
// --primary: 221.2 83.2% 53.3%;
// --primary-foreground: 210 40% 98%;
```

### Vue
```vue
<template>
  <button class="bg-primary text-primary-foreground">
    My Button
  </button>
</template>

<style>
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}
</style>
```

### Svelte
```svelte
<button class="bg-primary text-primary-foreground">
  My Button
</button>

<style>
:global(:root) {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}
</style>
```

### Pure CSS
```css
.button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
}
```

---

## 🛠️ Using MCP for AI-Powered Import

The Living Design Library includes **Model Context Protocol (MCP)** tools for AI agents:

### Tool: `import_figma_tokens`

```typescript
// AI Agent can import tokens directly
{
  "tool": "import_figma_tokens",
  "arguments": {
    "systemName": "My Product Design System",
    "figmaJson": {
      "variables": [/* Figma variables */]
    },
    "intents": ["Web App", "E-commerce"]
  }
}
```

### Tool: `get_component_code`

```typescript
// AI Agent can generate components with your tokens
{
  "tool": "get_component_code",
  "arguments": {
    "componentName": "Button",
    "framework": "react",
    "systemId": "ds-123456789"
  }
}

// Returns:
{
  "code": "...",
  "tokens": {
    "colors": { /* your imported colors */ },
    "spacing": { /* your imported spacing */ }
  }
}
```

---

## 🎨 Example: Complete Workflow

### 1. Export from Figma

**Figma Variables:**
```
Color/Primary = #3B82F6 (Blue)
Color/Secondary = #F3F4F6 (Gray)
Spacing/Small = 8px
Spacing/Medium = 16px
Border Radius/Default = 10px
```

**Export as JSON:**
```json
{
  "name": "My Product Design System",
  "tokens": {
    "colors": {
      "primary": "217.2 91.2% 59.8%",
      "secondary": "214.3 31.8% 91.4%"
    },
    "spacing": {
      "sm": "0.5rem",
      "md": "1rem"
    },
    "borderRadius": {
      "default": "0.625rem"
    }
  }
}
```

### 2. Import to Library

1. Copy JSON
2. Navigate to **Design System → Import Tokens**
3. Paste in **JSON** tab
4. Click **Import JSON**
5. ✅ Tokens applied!

### 3. Use in Components

```tsx
// All components now use your brand colors
<Button className="bg-primary">Primary Button</Button>
// Renders with your exact #3B82F6 blue!

<Card className="p-md rounded-[var(--radius-default)]">
  Card Content
</Card>
// Uses your spacing and border radius!
```

### 4. Export to Your Framework

1. Click any component in Live Code Playground
2. Click **Export**
3. Select framework (React/Vue/Svelte/Angular/CSS)
4. Copy code with your tokens included!

---

## 🐛 Troubleshooting

### Problem: Colors Don't Apply

**Solution 1:** Check HSL Format
```json
// ✅ Correct
"primary": "221.2 83.2% 53.3%"

// ❌ Wrong
"primary": "hsl(221.2, 83.2%, 53.3%)"
```

**Solution 2:** Use Hex and Let Library Convert
```json
"primary": "#3B82F6"
```

### Problem: Tokens Not Appearing in Components

**Solution:** Make sure you're using **semantic names**:
```json
// ✅ Correct - matches component expectations
"primary": "221.2 83.2% 53.3%"

// ❌ Wrong - custom names won't map
"myBrandBlue": "221.2 83.2% 53.3%"
```

### Problem: Figma Export Has Wrong Structure

**Solution:** Transform to standard format:
```javascript
// Figma format:
{
  "variables": [
    { "name": "primary", "resolvedType": "COLOR", "valuesByMode": { "mode1": "#3B82F6" } }
  ]
}

// Transform to:
{
  "tokens": {
    "colors": {
      "primary": "#3B82F6"
    }
  }
}
```

---

## 📚 Additional Resources

- **Token Structure Guide**: See the "Token Structure Guide" section in Import Config
- **Quick Start Guide**: Navigate to the Quick Start tab for interactive tutorial
- **MCP Documentation**: `/mcp-server/README.md` for AI agent integration
- **Design Token Flow**: `/DESIGN_TOKEN_FLOW.md` for technical details

---

## ✅ Validation Checklist

Before exporting from Figma:
- [ ] Colors use consistent naming (primary, secondary, accent)
- [ ] Spacing values are in rem or px
- [ ] Border radius values are defined
- [ ] All semantic colors are included

After importing to library:
- [ ] Preview tokens before applying
- [ ] Check that colors render correctly
- [ ] Test components reflect new tokens
- [ ] Export a sample component to verify

---

**Need Help?** 
Check the Quick Start Guide in the app or review the DESIGN_TOKEN_FLOW.md for technical architecture details.
