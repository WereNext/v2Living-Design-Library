# 🎨 Design Token Flow: Figma to Variable Code

## How This App Transforms Figma Tokens into Variable Code

This design library uses a powerful token-based system that transforms Figma design tokens into live, variable code that can be used across any framework.

---

## 📊 The Token Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIGMA DESIGN SYSTEM                          │
│  • Variables (colors, spacing, typography, etc.)                │
│  • Collections (Light/Dark themes)                              │
│  • Component properties                                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Export as JSON
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    JSON TOKEN FORMAT                            │
│  {                                                              │
│    "colors": {                                                  │
│      "primary": "221.2 83.2% 53.3%",                           │
│      "secondary": "210 40% 96.1%"                              │
│    },                                                           │
│    "spacing": {                                                 │
│      "xs": "0.5rem",                                           │
│      "sm": "0.75rem"                                           │
│    }                                                            │
│  }                                                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Import via ImportConfig component
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                 CSS CUSTOM PROPERTIES (CSS Variables)           │
│  :root {                                                        │
│    --primary: 221.2 83.2% 53.3%;                               │
│    --secondary: 210 40% 96.1%;                                 │
│    --space-xs: 0.5rem;                                         │
│    --space-sm: 0.75rem;                                        │
│    --radius: 0.625rem;                                         │
│  }                                                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Referenced in Tailwind v4
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                TAILWIND CSS UTILITY CLASSES                     │
│  @theme inline {                                                │
│    --color-primary: var(--primary);                            │
│    --color-secondary: var(--secondary);                        │
│  }                                                              │
│                                                                 │
│  → bg-primary   = background: hsl(var(--primary))              │
│  → text-primary = color: hsl(var(--primary))                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Used in Components
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REACT COMPONENTS                             │
│  <Button className="bg-primary text-primary-foreground">       │
│    Click Me                                                     │
│  </Button>                                                      │
│                                                                 │
│  → The component uses tokens, NOT hard-coded values            │
│  → Changing tokens updates ALL components automatically        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Step-by-Step Token Transformation

### **Step 1: Figma Variables Export**

In Figma, you create variables:
```
Color/Primary = #3B82F6
Spacing/Small = 8px
Border Radius/Medium = 10px
```

Export these as JSON using Figma's Variables API or plugins like:
- Figma Tokens Studio
- Design Tokens
- Variables to Code

**Example Export:**
```json
{
  "name": "My Design System",
  "tokens": {
    "colors": {
      "primary": "221.2 83.2% 53.3%",
      "secondary": "210 40% 96.1%",
      "destructive": "0 84.2% 60.2%"
    },
    "spacing": {
      "xs": "0.5rem",
      "sm": "0.75rem",
      "md": "1rem",
      "lg": "1.5rem",
      "xl": "2rem"
    },
    "borderRadius": {
      "sm": "0.375rem",
      "md": "0.625rem",
      "lg": "1rem"
    },
    "typography": {
      "fontSizes": {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.125rem"
      }
    }
  }
}
```

---

### **Step 2: Import to Design Library**

Navigate to: **Design System → Import Tokens**

Paste your JSON and the `ImportConfig.tsx` component:

1. **Validates** the JSON structure
2. **Parses** token values
3. **Applies** them to CSS custom properties
4. **Saves** to localStorage for persistence

**Code from `/components/ImportConfig.tsx`:**
```typescript
const applyTokens = (tokens: any) => {
  const root = document.documentElement;
  
  // Apply colors
  if (tokens.colors) {
    Object.entries(tokens.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value as string);
    });
  }

  // Apply spacing
  if (tokens.spacing) {
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--space-${key}`, value as string);
    });
  }

  // Apply border radius
  if (tokens.borderRadius) {
    Object.entries(tokens.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value as string);
    });
  }
};
```

---

### **Step 3: CSS Variables in Action**

After import, tokens are stored as CSS custom properties in `/styles/globals.css`:

```css
:root {
  /* Tokens from Figma become CSS variables */
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  
  --radius: 0.625rem;
  --radius-sm: 0.375rem;
  --radius-lg: 1rem;
}

/* Dark mode overrides */
.dark {
  --primary: 210 40% 98%;
  --secondary: 217.2 32.6% 17.5%;
}

/* Tailwind v4 theme integration */
@theme inline {
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-destructive: var(--destructive);
}
```

---

### **Step 4: Components Reference Variables**

Instead of hard-coding colors, components use semantic tokens:

**Button Component (`/components/ui/button.tsx`):**
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        secondary: "bg-secondary text-secondary-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
  }
)
```

**Key Point:** 
- `bg-primary` → `background: hsl(var(--primary))`
- When you change `--primary`, ALL buttons update instantly!

---

### **Step 5: Multi-Framework Export**

The Live Code Playground can export to any framework because it uses **semantic tokens**:

#### **React/TypeScript** (Native)
```tsx
<Button className="bg-primary text-primary-foreground">
  Click Me
</Button>
```

#### **Vue** (Exported)
```vue
<template>
  <button class="bg-primary text-primary-foreground">
    Click Me
  </button>
</template>
```

#### **Svelte** (Exported)
```svelte
<button class="bg-primary text-primary-foreground">
  Click Me
</button>
```

#### **CSS Variables** (Exported)
```css
.button {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
  padding: var(--space-sm) var(--space-md);
}
```

#### **Angular** (Exported)
```typescript
@Component({
  selector: 'app-button',
  template: '<button class="bg-primary text-primary-foreground">Click Me</button>'
})
```

---

## 🎯 Why This System is Powerful

### **1. Single Source of Truth**
- Change one token value → Updates everywhere
- No need to find/replace colors across 100+ files
- Figma = source of truth, code reflects it perfectly

### **2. Theme Switching**
```css
/* Light theme */
:root {
  --primary: 221.2 83.2% 53.3%;  /* Blue */
}

/* Dark theme - just override! */
.dark {
  --primary: 210 40% 98%;  /* Light blue for dark mode */
}
```

All components automatically adapt - no code changes needed!

### **3. Design System Templates**

The app includes 8 pre-built design systems:
- **shadcn/ui** - Modern and minimal
- **Material Design 3** - Google's design language
- **Chakra UI** - Accessible components
- **Ant Design** - Enterprise UI
- **Carbon Design** - IBM's design system
- **Fluent UI** - Microsoft 365
- **Tailwind UI** - Official Tailwind components
- **Bootstrap 5** - Classic framework

Each template is a JSON file with tokens that can be applied instantly!

---

## 🚀 Practical Example: Changing Primary Color

### **Figma:**
1. Open Figma Variables
2. Change `Color/Primary` from blue to purple
3. Export JSON

### **Design Library:**
1. Paste JSON in Import Tokens
2. Click "Import"
3. **BOOM!** All buttons, links, badges, and primary-colored elements are now purple

### **The Code:**
```typescript
// Before import:
--primary: 221.2 83.2% 53.3%;  // Blue

// After import:
--primary: 271 91% 65%;  // Purple

// Component code NEVER changes:
<Button className="bg-primary">Click Me</Button>
// Now renders with purple background automatically!
```

---

## 🔧 How to Use in Your Project

### **1. Export from Figma**
```json
{
  "tokens": {
    "colors": {
      "brand-primary": "#6366F1",
      "brand-secondary": "#EC4899"
    }
  }
}
```

### **2. Import to App**
- Navigate to **Design System** tab
- Paste JSON in "Import JSON" tab
- Click "Apply Tokens"

### **3. Use in Components**
```tsx
// The tokens automatically map to Tailwind classes:
<div className="bg-primary text-white">
  {/* Uses your imported brand-primary color */}
</div>
```

### **4. Export to Your Framework**
- Select component in Live Code Playground
- Choose framework (React/Vue/Svelte/Angular/CSS)
- Click "Export"
- Copy code with your tokens included!

---

## 📖 Token Naming Convention

The app uses this naming pattern:

| Token Type | Figma Name | CSS Variable | Tailwind Class |
|------------|-----------|--------------|----------------|
| Color | `Color/Primary` | `--primary` | `bg-primary` |
| Spacing | `Spacing/Medium` | `--space-md` | Custom: `p-[var(--space-md)]` |
| Radius | `Radius/Large` | `--radius-lg` | Custom: `rounded-[var(--radius-lg)]` |
| Font Size | `Typography/Base` | `--font-size-base` | `text-base` |
| Shadow | `Shadow/Medium` | `--shadow-md` | `shadow-md` |

---

## 🎨 MCP Integration for AI Code Generation

The design library includes **Model Context Protocol (MCP)** tools that allow AI coding agents to:

1. **Read your design tokens** from the active system
2. **Generate pixel-perfect components** using your exact tokens
3. **Export to any framework** with design system variables included

**Example MCP Tool: `generate-component`**
```typescript
// AI Agent request: "Create a purple button using our design tokens"

// MCP reads tokens:
const tokens = {
  primary: "271 91% 65%",  // Purple from your Figma
  radius: "0.625rem"
}

// AI generates:
<Button className="bg-primary rounded-[var(--radius)]">
  Purple Button
</Button>
```

The AI knows your design system and generates code that matches perfectly!

---

## 🎯 Summary

**Figma Tokens → JSON → CSS Variables → Tailwind → React Components**

- ✅ **Design in Figma** with variables
- ✅ **Export as JSON** with token values
- ✅ **Import to app** via Design System Builder
- ✅ **CSS variables update** automatically
- ✅ **All components reflect changes** instantly
- ✅ **Export to any framework** with tokens intact
- ✅ **AI agents use tokens** for perfect code generation

This creates a **true design-to-code workflow** where your Figma designs and code stay perfectly in sync! 🚀
