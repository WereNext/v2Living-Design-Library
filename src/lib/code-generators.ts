import { Theme } from '../hooks/useDesignSystems';

// Generate CSS Variables from theme tokens
export function generateCSSVariables(theme: Theme): string {
  const lines: string[] = [':root {'];
  
  // Colors
  if (theme.colors) {
    lines.push('  /* Colors */');
    Object.entries(theme.colors).forEach(([key, value]) => {
      // Check if value already has hsl() wrapper
      const cssValue = value.startsWith('hsl') || value.startsWith('#') || value.startsWith('rgb') 
        ? value 
        : `hsl(${value})`;
      lines.push(`  --${key}: ${cssValue};`);
    });
  }
  
  // Typography
  if (theme.typography) {
    lines.push('\n  /* Typography */');
    Object.entries(theme.typography).forEach(([key, value]) => {
      lines.push(`  --${key}: ${value};`);
    });
  }
  
  // Spacing
  if (theme.spacing) {
    lines.push('\n  /* Spacing */');
    Object.entries(theme.spacing).forEach(([key, value]) => {
      lines.push(`  --${key}: ${value};`);
    });
  }
  
  // Border Radius
  if (theme.borderRadius) {
    lines.push('\n  /* Border Radius */');
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      lines.push(`  --${key}: ${value};`);
    });
  }
  
  // Shadows
  if (theme.shadows) {
    lines.push('\n  /* Shadows */');
    Object.entries(theme.shadows).forEach(([key, value]) => {
      lines.push(`  --${key}: ${value};`);
    });
  }
  
  lines.push('}');
  return lines.join('\n');
}

// Helper to normalize color values for Tailwind
function normalizeTailwindColor(value: string): string {
  if (value.startsWith('hsl') || value.startsWith('#') || value.startsWith('rgb')) {
    return value;
  }
  // Raw HSL values like "221.2 83.2% 53.3%" -> wrap in hsl()
  return `hsl(${value})`;
}

// Helper to build nested color structure for Tailwind
// Converts flat keys like "primary", "primary-foreground" into nested { primary: { DEFAULT, foreground } }
function buildNestedColors(colors: Record<string, string>): Record<string, string | Record<string, string>> {
  const result: Record<string, string | Record<string, string>> = {};
  const processed = new Set<string>();

  // First pass: identify base colors and their variants
  const colorGroups: Record<string, Record<string, string>> = {};

  Object.entries(colors).forEach(([key, value]) => {
    const normalized = normalizeTailwindColor(value);

    // Check if this is a variant (contains hyphen that's not at the start)
    const lastHyphen = key.lastIndexOf('-');
    if (lastHyphen > 0) {
      const potentialBase = key.substring(0, lastHyphen);
      const variant = key.substring(lastHyphen + 1);

      // Check if the base color exists
      if (colors[potentialBase] !== undefined) {
        if (!colorGroups[potentialBase]) {
          colorGroups[potentialBase] = {};
        }
        colorGroups[potentialBase][variant] = normalized;
        processed.add(key);
        return;
      }
    }

    // This is a base color
    if (!colorGroups[key]) {
      colorGroups[key] = {};
    }
    colorGroups[key]['DEFAULT'] = normalized;
    processed.add(key);
  });

  // Build the result
  Object.entries(colorGroups).forEach(([base, variants]) => {
    if (Object.keys(variants).length === 1 && variants['DEFAULT']) {
      // Single color, no variants - keep flat
      result[base] = variants['DEFAULT'];
    } else {
      // Has variants - use nested structure
      result[base] = variants;
    }
  });

  return result;
}

// Generate Tailwind Config
export function generateTailwindConfig(theme: Theme): string {
  const config: Record<string, unknown> = {
    theme: {
      extend: {} as Record<string, unknown>
    }
  };

  const extend = (config.theme as Record<string, unknown>).extend as Record<string, unknown>;

  // Colors - properly nested structure
  if (theme.colors) {
    extend.colors = buildNestedColors(theme.colors);
  }

  // Font Family
  if (theme.typography) {
    const fontFamily: Record<string, string[]> = {};
    Object.entries(theme.typography).forEach(([key, value]) => {
      if (key.includes('font-')) {
        const fontName = key.replace('font-', '');
        fontFamily[fontName] = [value, 'system-ui', 'sans-serif'];
      }
    });
    if (Object.keys(fontFamily).length > 0) {
      extend.fontFamily = fontFamily;
    }
  }

  // Spacing - clean up keys
  if (theme.spacing) {
    const spacing: Record<string, string> = {};
    Object.entries(theme.spacing).forEach(([key, value]) => {
      // Remove prefixes like "space-" or "spacing-"
      const cleanKey = key.replace(/^(space-|spacing-)/, '');
      spacing[cleanKey] = value;
    });
    extend.spacing = spacing;
  }

  // Border Radius
  if (theme.borderRadius) {
    const borderRadius: Record<string, string> = {};
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      const radiusName = key.replace('radius-', '');
      borderRadius[radiusName] = value;
    });
    extend.borderRadius = borderRadius;
  }

  // Box Shadow
  if (theme.shadows) {
    const boxShadow: Record<string, string> = {};
    Object.entries(theme.shadows).forEach(([key, value]) => {
      const shadowName = key.replace('shadow-', '');
      boxShadow[shadowName] = value;
    });
    extend.boxShadow = boxShadow;
  }

  // Animation tokens (if present)
  if (theme.effects) {
    const transitionDuration: Record<string, string> = {};
    const transitionTimingFunction: Record<string, string> = {};

    Object.entries(theme.effects).forEach(([key, value]) => {
      if (key.includes('duration')) {
        const name = key.replace(/^(duration-|transition-)/, '');
        transitionDuration[name] = value;
      } else if (key.includes('ease') || key.includes('timing')) {
        const name = key.replace(/^(ease-|timing-)/, '');
        transitionTimingFunction[name] = value;
      }
    });

    if (Object.keys(transitionDuration).length > 0) {
      extend.transitionDuration = transitionDuration;
    }
    if (Object.keys(transitionTimingFunction).length > 0) {
      extend.transitionTimingFunction = transitionTimingFunction;
    }
  }

  return `/** @type {import('tailwindcss').Config} */
export default ${JSON.stringify(config, null, 2)}`;
}

// Generate React Component using tokens
export function generateReactComponent(theme: Theme): string {
  return `import React from 'react';
import './styles.css'; // Import your CSS variables

export function Button({ children, variant = 'primary' }) {
  return (
    <button
      style={{
        backgroundColor: variant === 'primary' 
          ? 'var(--primary)' 
          : 'var(--secondary)',
        color: variant === 'primary' 
          ? 'var(--primary-foreground)' 
          : 'var(--secondary-foreground)',
        padding: 'var(--md) var(--lg)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        border: 'none',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {children}
    </button>
  );
}

export function Card({ title, description, children }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--card)',
        color: 'var(--card-foreground)',
        padding: 'var(--xl)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border)',
      }}
    >
      {title && <h3 style={{ marginBottom: 'var(--sm)' }}>{title}</h3>}
      {description && (
        <p style={{ 
          color: 'var(--muted-foreground)',
          marginBottom: 'var(--md)' 
        }}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}`;
}

// Generate Vue Component
export function generateVueComponent(theme: Theme): string {
  return `<template>
  <button
    :class="['btn', \`btn--\${variant}\`]"
    :style="buttonStyles"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  }
});

const buttonStyles = computed(() => ({
  backgroundColor: props.variant === 'primary' 
    ? 'var(--primary)' 
    : 'var(--secondary)',
  color: props.variant === 'primary' 
    ? 'var(--primary-foreground)' 
    : 'var(--secondary-foreground)',
  padding: 'var(--md) var(--lg)',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-sans)',
  border: 'none',
  cursor: 'pointer',
  boxShadow: 'var(--shadow-sm)',
}));
</script>

<style scoped>
.btn {
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.9;
}
</style>`;
}

// Generate Svelte Component
export function generateSvelteComponent(theme: Theme): string {
  return `<script>
  export let variant = 'primary';
</script>

<button class="btn btn--{variant}">
  <slot />
</button>

<style>
  .btn {
    padding: var(--md) var(--lg);
    border-radius: var(--radius-md);
    font-family: var(--font-sans);
    border: none;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: opacity 0.2s;
  }

  .btn:hover {
    opacity: 0.9;
  }

  .btn--primary {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  .btn--secondary {
    background-color: var(--secondary);
    color: var(--secondary-foreground);
  }
</style>`;
}

// Generate plain HTML/CSS
export function generateHTMLComponent(theme: Theme): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design System Components</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <button class="btn btn--primary">Primary Button</button>
    <button class="btn btn--secondary">Secondary Button</button>
    
    <div class="card">
      <h3 class="card__title">Card Title</h3>
      <p class="card__description">This is a card component using your design tokens.</p>
    </div>
  </div>
</body>
</html>`;
}

// Generate CSS for HTML
export function generateCSS(theme: Theme): string {
  const cssVars = generateCSSVariables(theme);
  
  return `${cssVars}

/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  background-color: var(--background);
  color: var(--foreground);
  padding: var(--xl);
}

/* Button Component */
.btn {
  padding: var(--md) var(--lg);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: opacity 0.2s;
  margin-right: var(--sm);
}

.btn:hover {
  opacity: 0.9;
}

.btn--primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

.btn--secondary {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
}

/* Card Component */
.card {
  background-color: var(--card);
  color: var(--card-foreground);
  padding: var(--xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
  margin-top: var(--lg);
}

.card__title {
  margin-bottom: var(--sm);
}

.card__description {
  color: var(--muted-foreground);
  margin-bottom: var(--md);
}`;
}

// Generate JSON tokens
export function generateJSONTokens(theme: Theme): string {
  const tokens = {
    name: theme.name,
    description: theme.description,
    colors: theme.colors || {},
    typography: theme.typography || {},
    spacing: theme.spacing || {},
    borderRadius: theme.borderRadius || {},
    shadows: theme.shadows || {},
  };
  
  return JSON.stringify(tokens, null, 2);
}

// Generate SCSS Variables
export function generateSCSSVariables(theme: Theme): string {
  const lines: string[] = ['// Design System Tokens\n'];
  
  // Colors
  if (theme.colors) {
    lines.push('// Colors');
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssValue = value.startsWith('hsl') || value.startsWith('#') || value.startsWith('rgb') 
        ? value 
        : `hsl(${value})`;
      lines.push(`$${key}: ${cssValue};`);
    });
  }
  
  // Typography
  if (theme.typography) {
    lines.push('\n// Typography');
    Object.entries(theme.typography).forEach(([key, value]) => {
      lines.push(`$${key}: ${value};`);
    });
  }
  
  // Spacing
  if (theme.spacing) {
    lines.push('\n// Spacing');
    Object.entries(theme.spacing).forEach(([key, value]) => {
      lines.push(`$${key}: ${value};`);
    });
  }
  
  // Border Radius
  if (theme.borderRadius) {
    lines.push('\n// Border Radius');
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      lines.push(`$${key}: ${value};`);
    });
  }
  
  // Shadows
  if (theme.shadows) {
    lines.push('\n// Shadows');
    Object.entries(theme.shadows).forEach(([key, value]) => {
      lines.push(`$${key}: ${value};`);
    });
  }
  
  return lines.join('\n');
}

// Generate Angular Component
export function generateAngularComponent(theme: Theme): string {
  return `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: \`
    <button 
      [class]="'btn btn--' + variant"
      [ngStyle]="buttonStyles"
    >
      <ng-content></ng-content>
    </button>
  \`,
  styles: [\`
    .btn {
      padding: var(--md) var(--lg);
      border-radius: var(--radius-md);
      font-family: var(--font-sans);
      border: none;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition: opacity 0.2s;
    }
    
    .btn:hover {
      opacity: 0.9;
    }
    
    .btn--primary {
      background-color: var(--primary);
      color: var(--primary-foreground);
    }
    
    .btn--secondary {
      background-color: var(--secondary);
      color: var(--secondary-foreground);
    }
  \`]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  
  get buttonStyles() {
    return {
      backgroundColor: this.variant === 'primary' 
        ? 'var(--primary)' 
        : 'var(--secondary)',
      color: this.variant === 'primary' 
        ? 'var(--primary-foreground)' 
        : 'var(--secondary-foreground)',
    };
  }
}`;
}
