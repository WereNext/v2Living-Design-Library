# @living-design-library/components

Framework-agnostic Web Components powered by design tokens. Works in React, Vue, Angular, Svelte, or vanilla HTML.

## Installation

```bash
npm install @living-design-library/components
```

## Quick Start

### 1. Import the styles (optional - provides defaults)

```css
@import '@living-design-library/components/styles';
```

### 2. Import and use components

```html
<script type="module">
  import '@living-design-library/components';
</script>

<ldl-button>Click me</ldl-button>
<ldl-card>
  <span slot="header">Card Title</span>
  <p>Card content goes here</p>
</ldl-card>
```

## Framework Usage

### React

```jsx
import '@living-design-library/components';

function App() {
  return (
    <ldl-button variant="primary" onClick={() => alert('clicked')}>
      Click me
    </ldl-button>
  );
}
```

### Vue

```vue
<script setup>
import '@living-design-library/components';
</script>

<template>
  <ldl-button variant="primary" @click="handleClick">
    Click me
  </ldl-button>
</template>
```

### Svelte

```svelte
<script>
  import '@living-design-library/components';
</script>

<ldl-button variant="primary" on:click={handleClick}>
  Click me
</ldl-button>
```

### Vanilla HTML

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@living-design-library/components/dist/styles/tokens.css">
  <script type="module" src="node_modules/@living-design-library/components/dist/index.js"></script>
</head>
<body>
  <ldl-button>Click me</ldl-button>
</body>
</html>
```

## Components

### `<ldl-button>`

A versatile button component.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state |
| `full` | `boolean` | `false` | Full width |

```html
<ldl-button variant="destructive" size="lg">Delete</ldl-button>
```

### `<ldl-card>`

A flexible card container.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outline' \| 'ghost'` | `'default'` | Card style variant |
| `interactive` | `boolean` | `false` | Make card hoverable/clickable |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Content padding |

Slots: `header`, `default`, `footer`

```html
<ldl-card variant="elevated" interactive>
  <span slot="header">Title</span>
  <p>Content</p>
  <span slot="footer">Footer</span>
</ldl-card>
```

### `<ldl-input>`

A text input component.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | `''` | Input label |
| `type` | `'text' \| 'email' \| 'password' \| ...` | `'text'` | Input type |
| `placeholder` | `string` | `''` | Placeholder text |
| `value` | `string` | `''` | Current value |
| `required` | `boolean` | `false` | Required field |
| `disabled` | `boolean` | `false` | Disabled state |
| `error` | `boolean` | `false` | Error state |
| `helperText` | `string` | `''` | Helper/error text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |

Events: `ldl-input`, `ldl-change`

```html
<ldl-input
  label="Email"
  type="email"
  placeholder="Enter email"
  required
></ldl-input>
```

### `<ldl-badge>`

A badge/tag component.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'success' \| 'warning'` | `'default'` | Badge style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |

```html
<ldl-badge variant="success">Active</ldl-badge>
```

## Customizing with Design Tokens

Components use CSS custom properties (tokens) that you can override:

```css
:root {
  /* Colors */
  --ldl-color-primary: hsl(262, 83%, 58%);
  --ldl-color-primary-foreground: white;

  /* Spacing */
  --ldl-space-md: 1.25rem;

  /* Typography */
  --ldl-font-family: 'Inter', sans-serif;

  /* Border Radius */
  --ldl-radius-md: 0.5rem;
}
```

### Using with Living Design Library App

When you export tokens from the Living Design Library app, you get a CSS file that sets all these custom properties. Just import it before using components:

```css
/* Your exported design system tokens */
@import './my-design-system-tokens.css';

/* Component defaults (optional, provides fallbacks) */
@import '@living-design-library/components/styles';
```

## Token Reference

| Token | Description | Default |
|-------|-------------|---------|
| `--ldl-color-primary` | Primary brand color | `hsl(221, 83%, 53%)` |
| `--ldl-color-primary-foreground` | Text on primary | `white` |
| `--ldl-color-secondary` | Secondary color | `hsl(210, 40%, 96%)` |
| `--ldl-color-background` | Page background | `white` |
| `--ldl-color-foreground` | Default text color | `hsl(222, 47%, 11%)` |
| `--ldl-color-border` | Border color | `hsl(214, 32%, 91%)` |
| `--ldl-color-destructive` | Error/destructive color | `hsl(0, 84%, 60%)` |
| `--ldl-space-*` | Spacing scale (xs, sm, md, lg, xl) | `0.25rem` - `2rem` |
| `--ldl-radius-*` | Border radius scale | `0.25rem` - `9999px` |
| `--ldl-font-family` | Font family | `system-ui` |
| `--ldl-font-size-*` | Font sizes | `0.75rem` - `1.5rem` |
| `--ldl-shadow-*` | Box shadows | Various |

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## License

MIT
