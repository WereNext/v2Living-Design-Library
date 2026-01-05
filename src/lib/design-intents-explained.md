# Design Intents Explained

## What are Design Intents?

**Design Intents** are **component categories** that organize your component library by use case. They help you:

- Group components by purpose (e.g., Web App, E-commerce, Mobile)
- Create focused component sets for specific project types
- Organize your design system based on your actual use cases

---

## How Design Intents Work

### They are NOT about uploading components

Design Intents are **organizational labels**, not component uploads. You're not uploading custom component code.

Instead, you're choosing which **pre-built component categories** make sense for your design system.

### Think of them as "Tabs" or "Sections"

When you select design intents, you're essentially saying:

> "My design system includes components for Web Apps, E-commerce, and Landing Pages"

The Living Design Library will then show you components organized under those categories.

---

## The Workflow

### 1. Create a Design System

Go to **Design System Builder** and start creating your system:

```
Design System Name: "Acme Corp Design System"
Description: "Our enterprise design system for all products"
```

### 2. Add Themes (Optional but Recommended)

Themes are the actual design tokens (colors, spacing, typography):

```
Themes:
- Light Theme (primary: #3B82F6, background: #FFFFFF)
- Dark Theme (primary: #60A5FA, background: #000000)
- Brand A (custom brand colors)
```

### 3. Choose Design Intents

Select which component categories you need:

```
Design Intents:
☑ Web App - General purpose web application components
☑ E-commerce - Shopping cart, product cards, checkout flows
☑ Dashboard - Charts, metrics, data tables
☐ Mobile Experience - Touch-optimized components
☐ Landing Page - Hero sections, CTAs, testimonials
```

### 4. Save & Apply

Your design system is saved with:
- Multiple themes
- Selected design intents
- All your design tokens

---

## Pre-built Design Intents

The system comes with these pre-built intent categories:

| Intent | Description | Example Components |
|--------|-------------|-------------------|
| **Web App** | General purpose web applications | Buttons, Forms, Modals, Navigation |
| **E-commerce** | Shopping and product-focused | Product Cards, Shopping Cart, Checkout |
| **Mobile Experience** | Touch-optimized for mobile | Bottom Nav, Swipe Actions, Touch Gestures |
| **Landing Page** | Marketing and conversion | Hero Sections, CTAs, Testimonials |
| **Dashboard** | Data visualization and analytics | Charts, Metrics, Data Tables |
| **SaaS Platform** | Multi-tenant SaaS applications | User Management, Billing, Settings |
| **Social Media** | Social and community features | Posts, Comments, Likes, Shares |
| **Blog & Content** | Content management | Article Cards, Rich Text Editor |
| **Portfolio** | Showcase and gallery | Project Cards, Image Galleries |
| **Admin Panel** | Backend administration | User Tables, CRUD Forms, Permissions |
| **Documentation** | Technical documentation | Code Blocks, API References, Search |
| **Authentication** | Login and signup flows | Login Forms, Password Reset, 2FA |

---

## Custom Design Intents

You can also create **custom design intents**:

1. Click **"+ Add Custom"** in the Design System Builder
2. Name your custom category (e.g., "Healthcare Forms", "Financial Dashboards")
3. Save your system

**Note:** Custom intents are organizational only. They don't change the actual components shown, but they help you organize your design system for your specific use case.

---

## How Intents Affect the Sidebar

When you **apply a design system** with specific intents:

### Default System (All Intents)
```
Sidebar:
- Web App
- E-commerce  
- Mobile Experience
- Landing Page
```

### Custom System (Selected Intents Only)
```
Sidebar:
- Web App
- Dashboard
- SaaS Platform
```

The sidebar will **only show the intents you selected** for that design system.

---

## Example: Complete Design System

Here's a complete design system setup:

```json
{
  "name": "Acme Corp Design System",
  "description": "Enterprise design system for all Acme products",
  
  "themes": [
    {
      "name": "Light",
      "colors": {
        "primary": "221 83% 53%",
        "background": "0 0% 100%"
      },
      "spacing": { ... },
      "typography": { ... }
    },
    {
      "name": "Dark",
      "colors": {
        "primary": "210 100% 60%",
        "background": "222 84% 5%"
      },
      "spacing": { ... },
      "typography": { ... }
    }
  ],
  
  "intents": [
    {
      "id": "web-app",
      "label": "Web App",
      "description": "General web application components"
    },
    {
      "id": "dashboard",
      "label": "Dashboard",
      "description": "Analytics and data visualization"
    },
    {
      "id": "custom-healthcare",
      "label": "Healthcare Forms",
      "description": "Medical intake and patient forms"
    }
  ]
}
```

---

## FAQ

### Q: Can I upload my own custom components?

**A:** Not directly. Design Intents are organizational categories. The components themselves are pre-built in the Living Design Library. However, you can:
1. Copy component code to your project
2. Modify the components as needed
3. Use the exported code as a starting point

### Q: What if I need a component that doesn't exist?

**A:** Use the **Live Code Playground** to:
1. Find the closest matching component
2. Copy the code
3. Modify it for your specific needs
4. Export to your framework (React, Vue, Svelte, HTML)

### Q: Can I change intents after creating a system?

**A:** Yes! You can edit any saved design system and add/remove intents at any time.

### Q: Do intents affect exported code?

**A:** No. Intents are purely organizational. When you export component code, it includes your design tokens (colors, spacing, etc.) but not the intent categories.

### Q: How many intents should I choose?

**A:** Choose only the intents you actually need! Don't overwhelm yourself by selecting all categories. Pick 2-4 intents that match your project type.

---

## Best Practices

### ✅ DO:
- Choose intents that match your actual project needs
- Use semantic names for custom intents
- Keep it focused (2-4 intents is ideal)
- Name custom intents based on use case, not visual style

### ❌ DON'T:
- Select all intents "just in case"
- Create custom intents for visual styles (use Themes for that)
- Expect to upload custom component code
- Overthink it - you can always change intents later

---

## Summary

**Design Intents = Component Categories**

- They organize the component library by use case
- They're labels, not uploads
- They control what shows in the sidebar
- They help you focus on relevant components

**Themes = Design Tokens**

- Colors, spacing, typography, etc.
- The actual visual design
- Can have multiple themes (Light, Dark, Brand A, etc.)
- Applied globally across all components

**Together:** Design System = Themes + Intents + Metadata
