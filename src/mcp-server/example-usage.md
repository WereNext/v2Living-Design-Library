# Example Usage with AI Coding Agents

## Real Conversation Examples

Here are real examples of how you can interact with the design library through AI coding agents once the MCP server is connected.

---

## Example 1: Starting from Scratch

**You:** "I want to build a SaaS dashboard. Load the shadcn/ui template and set it up for Dashboard components."

**AI Assistant:**
```
I'll load the shadcn/ui template and configure it for Dashboard components.

[Uses load_library_template tool]

✓ Created design system "shadcn/ui" with:
  - Colors: neutral palette with hsl values
  - Spacing: 0.5rem to 2rem scale
  - Typography: system-ui font family
  - Border radius: 0.25rem to 0.75rem
  - Intent: Dashboard & Analytics

Your design system is now active! You can customize tokens or start exporting components.
```

---

## Example 2: Importing from Figma

**You:** "I exported my Figma variables to JSON. Can you import this and create a design system called 'AcmeApp Design System'?"

```json
{
  "variables": [
    {
      "name": "color-primary",
      "resolvedType": "COLOR",
      "valuesByMode": { "1": "#6366f1" }
    },
    {
      "name": "spacing-base",
      "resolvedType": "FLOAT",
      "valuesByMode": { "1": "8" }
    }
  ]
}
```

**AI Assistant:**
```
I'll import your Figma tokens and create the AcmeApp Design System.

[Uses import_figma_tokens tool]

✓ Successfully imported Figma tokens:
  - System name: "AcmeApp Design System"
  - Tokens imported:
    • 12 colors
    • 8 spacing values
    • 6 typography tokens
  - Source: Figma

Your Figma design is now a working design system! Would you like to see the available components?
```

---

## Example 3: Exporting Components

**You:** "Give me a Button component in React using my current design system."

**AI Assistant:**
```
I'll generate a React Button component with your design tokens.

[Uses get_component_code tool]

Here's your Button component:
```

```jsx
import React from 'react';

const Button = ({ children, variant = 'primary', ...props }) => {
  const baseStyles = {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size)',
    border: 'none',
    cursor: 'pointer',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-foreground)',
    },
  };

  return (
    <button 
      style={{ ...baseStyles, ...variantStyles[variant] }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

```
The component uses CSS variables from your AcmeApp Design System. Add the CSS variables to your global stylesheet.
```

---

## Example 4: Multi-Component Export

**You:** "I need Button, Card, and Modal components in Vue for my e-commerce site."

**AI Assistant:**
```
I'll export all three components in Vue format with your design tokens.

[Uses get_component_code tool 3 times]

✓ Generated components:
  1. Button.vue
  2. Card.vue  
  3. Modal.vue

All components use your AcmeApp Design System tokens. Here they are:
```

[Provides all three Vue components with SFC format]

---

## Example 5: Managing Multiple Design Systems

**You:** "List all my design systems."

**AI Assistant:**
```
[Uses list_design_systems tool]

You have 3 design systems:

1. "AcmeApp Design System" (ds-1702345678)
   - Source: Figma import
   - Intents: Web App, Dashboard & Analytics
   - Created: 2024-12-10

2. "shadcn/ui" (ds-1702345890)  
   - Source: Template
   - Intents: Dashboard & Analytics
   - Created: 2024-12-10

3. "Marketing Site Theme" (ds-1702346000) [ACTIVE]
   - Source: Custom
   - Intents: Landing Page, Blog & Content
   - Created: 2024-12-10

The "Marketing Site Theme" is currently active.
```

---

## Example 6: Switching Systems

**You:** "Switch to the AcmeApp Design System and show me the color tokens."

**AI Assistant:**
```
[Uses set_active_system and get_design_tokens tools]

✓ Active system changed to "AcmeApp Design System"

Color tokens:
{
  "primary": "#6366f1",
  "secondary": "#8b5cf6", 
  "tertiary": "#ec4899",
  "background": "#ffffff",
  "foreground": "#1f2937",
  "muted": "#f3f4f6",
  "accent": "#fbbf24",
  "destructive": "#ef4444",
  "success": "#10b981",
  "warning": "#f59e0b"
}

These tokens will be used for all component exports.
```

---

## Example 7: Creating Custom Design System

**You:** "Create a dark theme design system called 'Midnight Dashboard' with dark blue background (#0f172a), purple primary (#a78bfa), and cyan accent (#22d3ee). Use it for Dashboard and Admin Panel components."

**AI Assistant:**
```
[Uses create_design_system tool]

✓ Created "Midnight Dashboard" design system:

Design tokens:
- Colors:
  • Primary: #a78bfa (purple)
  • Accent: #22d3ee (cyan)
  • Background: #0f172a (dark blue)
  • Foreground: #f8fafc (light text)
  
- Intents: 
  • Dashboard & Analytics
  • Admin Panel

- System ID: ds-1702346123
- Status: Active (ready for component export)

Your dark theme is ready! Want to export some dashboard components?
```

---

## Example 8: Exploring Components

**You:** "What components are available for Dashboard apps?"

**AI Assistant:**
```
[Uses list_components tool]

Available components (32 total):

📊 Dashboard-relevant components:
- Table (data display)
- Card (metric cards)
- Progress (loading/metrics)
- Badge (status indicators)
- Avatar (user profiles)
- Tabs (navigation)
- Modal (dialogs/forms)
- Alert (notifications)
- Chart components (via recharts)
- DatePicker (date ranges)
- Select (filters)
- Pagination (data tables)

🎨 UI Primitives:
- Button, Input, Checkbox, Radio, Switch, Slider
- Dropdown, Tooltip, Popover, Accordion

🔧 Layout:
- Sidebar, Navbar, Footer, Hero, Breadcrumb

All components can be exported in React, Vue, HTML, or Svelte.
```

---

## Example 9: Getting All Tokens

**You:** "Show me all the design tokens from my Midnight Dashboard system."

**AI Assistant:**
```
[Uses get_design_tokens tool]

Complete token set for "Midnight Dashboard":

{
  "colors": {
    "primary": "#a78bfa",
    "accent": "#22d3ee",
    "background": "#0f172a",
    "foreground": "#f8fafc",
    "secondary": "#334155",
    "muted": "#1e293b"
  },
  "spacing": {
    "xs": "0.5rem",
    "sm": "0.75rem", 
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem"
  },
  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "fontSize": "1rem",
    "fontWeight": "400",
    "lineHeight": "1.5"
  },
  "borderRadius": {
    "sm": "0.25rem",
    "md": "0.5rem", 
    "lg": "0.75rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
  }
}

These tokens are applied as CSS variables to all exported components.
```

---

## Example 10: Complete Workflow

**You:** "I'm building an e-commerce site. Load Tailwind CSS as the base, customize it for e-commerce components, then give me Product Card, Add to Cart Button, and Price Badge components in React."

**AI Assistant:**
```
I'll set up a complete e-commerce design system for you.

Step 1: Loading Tailwind CSS template
[Uses load_library_template tool]
✓ Loaded Tailwind CSS tokens

Step 2: Configuring for e-commerce
[Uses create_design_system tool with e-commerce intent]
✓ Created "E-commerce Site" system with E-commerce intent

Step 3: Exporting components
[Uses get_component_code tool 3 times]
✓ Generated:
  - ProductCard.jsx
  - AddToCartButton.jsx  
  - PriceBadge.jsx

Here are your e-commerce components:
```

[Provides all three React components with Tailwind-based tokens]

```
All components use your Tailwind-based tokens and are ready for production!
```

---

## Tips for AI Interactions

**Be specific about:**
- Framework preference (React, Vue, HTML, Svelte)
- Component categories/intents
- Design token values (colors, spacing, etc.)
- Library template names

**You can ask for:**
- Multiple components at once
- Token customizations
- System comparisons
- Component recommendations for specific use cases

**Natural language works great:**
- "Make the buttons bigger" → AI adjusts spacing tokens
- "Dark mode version" → AI creates new system with dark colors
- "Material Design style" → AI loads MD3 template
- "Show me card components" → AI filters component list

---

## Integration with Your Workflow

1. **Design in Figma** → Export variables as JSON
2. **Import to MCP Server** → AI creates design system  
3. **Customize via AI** → Natural language token edits
4. **Export Components** → Get code in your framework
5. **Integrate in Project** → Copy-paste production code

The MCP server bridges Figma → Design System → Production Code through conversational AI!
