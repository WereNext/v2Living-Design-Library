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

// Generate Tailwind Config
export function generateTailwindConfig(theme: Theme): string {
  const config: any = {
    theme: {
      extend: {}
    }
  };
  
  // Colors
  if (theme.colors) {
    config.theme.extend.colors = {};
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssValue = value.startsWith('hsl') || value.startsWith('#') || value.startsWith('rgb') 
        ? value 
        : `hsl(${value})`;
      config.theme.extend.colors[key] = cssValue;
    });
  }
  
  // Font Family
  if (theme.typography) {
    config.theme.extend.fontFamily = {};
    Object.entries(theme.typography).forEach(([key, value]) => {
      if (key.includes('font-')) {
        const fontName = key.replace('font-', '');
        config.theme.extend.fontFamily[fontName] = [value];
      }
    });
  }
  
  // Spacing
  if (theme.spacing) {
    config.theme.extend.spacing = {};
    Object.entries(theme.spacing).forEach(([key, value]) => {
      config.theme.extend.spacing[key] = value;
    });
  }
  
  // Border Radius
  if (theme.borderRadius) {
    config.theme.extend.borderRadius = {};
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      const radiusName = key.replace('radius-', '');
      config.theme.extend.borderRadius[radiusName] = value;
    });
  }
  
  // Box Shadow
  if (theme.shadows) {
    config.theme.extend.boxShadow = {};
    Object.entries(theme.shadows).forEach(([key, value]) => {
      const shadowName = key.replace('shadow-', '');
      config.theme.extend.boxShadow[shadowName] = value;
    });
  }
  
  return `/** @type {import('tailwindcss').Config} */\nexport default ${JSON.stringify(config, null, 2)}`;
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
