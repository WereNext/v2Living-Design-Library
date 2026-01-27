/**
 * Code Template Registry
 *
 * Dynamic code generation templates for each component type and framework.
 * Components can register their own code snippets for different frameworks.
 */

import type { Theme } from '../hooks/useDesignSystems';

export type Framework = 'react' | 'vue' | 'svelte' | 'angular' | 'html' | 'css' | 'tailwind' | 'scss' | 'json';

export interface CodeTemplate {
  /** The generated code */
  code: string;
  /** Language for syntax highlighting */
  language: string;
  /** Suggested filename */
  filename: string;
}

export type TemplateGenerator = (theme: Theme) => CodeTemplate;

interface ComponentTemplates {
  [framework: string]: TemplateGenerator;
}

// =============================================================================
// TEMPLATE REGISTRY
// =============================================================================

const templateRegistry = new Map<string, ComponentTemplates>();

/**
 * Register code templates for a component type
 */
export function registerTemplates(componentId: string, templates: ComponentTemplates): void {
  templateRegistry.set(componentId, templates);
}

/**
 * Get a code template for a specific component and framework
 */
export function getTemplate(componentId: string, framework: Framework, theme: Theme): CodeTemplate | null {
  const templates = templateRegistry.get(componentId);
  if (!templates) return null;

  const generator = templates[framework];
  if (!generator) return null;

  return generator(theme);
}

/**
 * Check if templates exist for a component
 */
export function hasTemplates(componentId: string): boolean {
  return templateRegistry.has(componentId);
}

/**
 * Get all frameworks available for a component
 */
export function getAvailableFrameworks(componentId: string): Framework[] {
  const templates = templateRegistry.get(componentId);
  if (!templates) return [];
  return Object.keys(templates) as Framework[];
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Helper to wrap HSL values */
function hsl(value: string): string {
  if (value.startsWith('hsl') || value.startsWith('#') || value.startsWith('rgb')) {
    return value;
  }
  return `hsl(${value})`;
}

// =============================================================================
// BUTTON TEMPLATES
// =============================================================================

registerTemplates('buttons', {
  react: (theme) => ({
    code: `import React from 'react';
import './styles.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick
}: ButtonProps) {
  const baseStyles = {
    fontFamily: 'var(--font-sans)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
  };

  const sizeStyles = {
    sm: { padding: 'var(--space-xs) var(--space-sm)', fontSize: '0.875rem' },
    md: { padding: 'var(--space-sm) var(--space-md)', fontSize: '1rem' },
    lg: { padding: 'var(--space-md) var(--space-lg)', fontSize: '1.125rem' },
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: 'var(--primary-foreground)',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      backgroundColor: 'var(--secondary)',
      color: 'var(--secondary-foreground)',
    },
    destructive: {
      backgroundColor: 'var(--destructive)',
      color: 'var(--destructive-foreground)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--foreground)',
    },
  };

  return (
    <button
      onClick={onClick}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
    >
      {children}
    </button>
  );
}`,
    language: 'tsx',
    filename: 'Button.tsx',
  }),

  vue: (theme) => ({
    code: `<template>
  <button :class="['btn', \`btn--\${variant}\`, \`btn--\${size}\`]">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}>();
</script>

<style scoped>
.btn {
  font-family: var(--font-sans);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn--sm { padding: var(--space-xs) var(--space-sm); font-size: 0.875rem; }
.btn--md { padding: var(--space-sm) var(--space-md); font-size: 1rem; }
.btn--lg { padding: var(--space-md) var(--space-lg); font-size: 1.125rem; }

.btn--primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
  box-shadow: var(--shadow-sm);
}

.btn--secondary {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
}

.btn--destructive {
  background-color: var(--destructive);
  color: var(--destructive-foreground);
}

.btn--outline {
  background-color: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
}

.btn--ghost {
  background-color: transparent;
  color: var(--foreground);
}

.btn:hover { opacity: 0.9; }
</style>`,
    language: 'vue',
    filename: 'Button.vue',
  }),

  svelte: (theme) => ({
    code: `<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<button class="btn btn--{variant} btn--{size}">
  <slot />
</button>

<style>
  .btn {
    font-family: var(--font-sans);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .btn--sm { padding: var(--space-xs) var(--space-sm); font-size: 0.875rem; }
  .btn--md { padding: var(--space-sm) var(--space-md); font-size: 1rem; }
  .btn--lg { padding: var(--space-md) var(--space-lg); font-size: 1.125rem; }

  .btn--primary {
    background-color: var(--primary);
    color: var(--primary-foreground);
    box-shadow: var(--shadow-sm);
  }

  .btn--secondary {
    background-color: var(--secondary);
    color: var(--secondary-foreground);
  }

  .btn--destructive {
    background-color: var(--destructive);
    color: var(--destructive-foreground);
  }

  .btn--outline {
    background-color: transparent;
    color: var(--foreground);
    border: 1px solid var(--border);
  }

  .btn--ghost {
    background-color: transparent;
    color: var(--foreground);
  }

  .btn:hover { opacity: 0.9; }
</style>`,
    language: 'svelte',
    filename: 'Button.svelte',
  }),

  html: (theme) => ({
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Button Components</title>
  <link rel="stylesheet" href="tokens.css">
  <style>
    .btn {
      font-family: var(--font-sans);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      padding: var(--space-sm) var(--space-md);
    }

    .btn--primary {
      background-color: var(--primary);
      color: var(--primary-foreground);
      box-shadow: var(--shadow-sm);
    }

    .btn--secondary {
      background-color: var(--secondary);
      color: var(--secondary-foreground);
    }

    .btn--outline {
      background-color: transparent;
      color: var(--foreground);
      border: 1px solid var(--border);
    }

    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div style="display: flex; gap: var(--space-md); padding: var(--space-lg);">
    <button class="btn btn--primary">Primary</button>
    <button class="btn btn--secondary">Secondary</button>
    <button class="btn btn--outline">Outline</button>
  </div>
</body>
</html>`,
    language: 'html',
    filename: 'buttons.html',
  }),
});

// =============================================================================
// CARD TEMPLATES
// =============================================================================

registerTemplates('cards', {
  react: (theme) => ({
    code: `import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ title, description, children, variant = 'default' }: CardProps) {
  const baseStyles = {
    backgroundColor: 'var(--card)',
    color: 'var(--card-foreground)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
  };

  const variantStyles = {
    default: {
      border: '1px solid var(--border)',
    },
    elevated: {
      boxShadow: 'var(--shadow-lg)',
    },
    outlined: {
      border: '2px solid var(--border)',
      backgroundColor: 'transparent',
    },
  };

  return (
    <div style={{ ...baseStyles, ...variantStyles[variant] }}>
      {title && (
        <h3 style={{ marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
          {title}
        </h3>
      )}
      {description && (
        <p style={{ color: 'var(--muted-foreground)', marginBottom: 'var(--space-md)' }}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 'var(--space-md)' }}>{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 'var(--space-md)',
      paddingTop: 'var(--space-md)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      gap: 'var(--space-sm)',
    }}>
      {children}
    </div>
  );
}`,
    language: 'tsx',
    filename: 'Card.tsx',
  }),

  vue: (theme) => ({
    code: `<template>
  <div :class="['card', \`card--\${variant}\`]">
    <div v-if="title || $slots.header" class="card__header">
      <slot name="header">
        <h3 v-if="title" class="card__title">{{ title }}</h3>
        <p v-if="description" class="card__description">{{ description }}</p>
      </slot>
    </div>
    <div class="card__content">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}>();
</script>

<style scoped>
.card {
  background-color: var(--card);
  color: var(--card-foreground);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.card--default { border: 1px solid var(--border); }
.card--elevated { box-shadow: var(--shadow-lg); }
.card--outlined { border: 2px solid var(--border); background: transparent; }

.card__title { font-weight: 600; margin-bottom: var(--space-sm); }
.card__description { color: var(--muted-foreground); margin-bottom: var(--space-md); }
.card__footer {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border);
  display: flex;
  gap: var(--space-sm);
}
</style>`,
    language: 'vue',
    filename: 'Card.vue',
  }),
});

// =============================================================================
// FORM TEMPLATES
// =============================================================================

registerTemplates('forms', {
  react: (theme) => ({
    code: `import React, { useState } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function Input({ label, placeholder, type = 'text', error, value, onChange }: InputProps) {
  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: 'var(--space-xs)',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          width: '100%',
          padding: 'var(--space-sm) var(--space-md)',
          borderRadius: 'var(--radius-md)',
          border: error ? '1px solid var(--destructive)' : '1px solid var(--border)',
          backgroundColor: 'var(--input-background)',
          color: 'var(--foreground)',
          fontSize: '1rem',
        }}
      />
      {error && (
        <p style={{ color: 'var(--destructive)', fontSize: '0.875rem', marginTop: 'var(--space-xs)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function Form({ children, onSubmit }: { children: React.ReactNode; onSubmit?: () => void }) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}
      style={{
        backgroundColor: 'var(--card)',
        padding: 'var(--space-lg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
      }}
    >
      {children}
    </form>
  );
}`,
    language: 'tsx',
    filename: 'Form.tsx',
  }),
});

// =============================================================================
// HERO TEMPLATES
// =============================================================================

registerTemplates('hero', {
  react: (theme) => ({
    code: `import React from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaSecondaryText?: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
}

export function Hero({
  title,
  subtitle,
  ctaText = 'Get Started',
  ctaSecondaryText,
  onCtaClick,
  backgroundImage
}: HeroProps) {
  return (
    <section
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-2xl)',
        backgroundColor: 'var(--background)',
        backgroundImage: backgroundImage ? \`url(\${backgroundImage})\` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: 'var(--space-md)',
          color: 'var(--foreground)',
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            color: 'var(--muted-foreground)',
            maxWidth: '600px',
            marginBottom: 'var(--space-xl)',
          }}
        >
          {subtitle}
        </p>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <button
          onClick={onCtaClick}
          style={{
            padding: 'var(--space-md) var(--space-xl)',
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontSize: '1.125rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {ctaText}
        </button>

        {ctaSecondaryText && (
          <button
            style={{
              padding: 'var(--space-md) var(--space-xl)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontSize: '1.125rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {ctaSecondaryText}
          </button>
        )}
      </div>
    </section>
  );
}`,
    language: 'tsx',
    filename: 'Hero.tsx',
  }),

  html: (theme) => ({
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hero Section</title>
  <link rel="stylesheet" href="tokens.css">
  <style>
    .hero {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--space-2xl);
      background-color: var(--background);
    }

    .hero__title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: var(--space-md);
      color: var(--foreground);
    }

    .hero__subtitle {
      font-size: clamp(1.125rem, 2vw, 1.5rem);
      color: var(--muted-foreground);
      max-width: 600px;
      margin-bottom: var(--space-xl);
    }

    .hero__cta {
      display: flex;
      gap: var(--space-md);
    }

    .btn-primary {
      padding: var(--space-md) var(--space-xl);
      background-color: var(--primary);
      color: var(--primary-foreground);
      border-radius: var(--radius-md);
      border: none;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--shadow-md);
    }

    .btn-secondary {
      padding: var(--space-md) var(--space-xl);
      background-color: transparent;
      color: var(--foreground);
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      font-size: 1.125rem;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <section class="hero">
    <h1 class="hero__title">Build Something Amazing</h1>
    <p class="hero__subtitle">
      Create beautiful, responsive designs with our design system tokens.
    </p>
    <div class="hero__cta">
      <button class="btn-primary">Get Started</button>
      <button class="btn-secondary">Learn More</button>
    </div>
  </section>
</body>
</html>`,
    language: 'html',
    filename: 'hero.html',
  }),
});

// =============================================================================
// PRICING TEMPLATES
// =============================================================================

registerTemplates('pricing', {
  react: (theme) => ({
    code: `import React from 'react';

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
}

interface PricingTableProps {
  tiers: PricingTier[];
  onSelect?: (tier: PricingTier) => void;
}

export function PricingCard({ tier, onSelect }: { tier: PricingTier; onSelect?: () => void }) {
  return (
    <div
      style={{
        backgroundColor: tier.highlighted ? 'var(--primary)' : 'var(--card)',
        color: tier.highlighted ? 'var(--primary-foreground)' : 'var(--card-foreground)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        border: tier.highlighted ? 'none' : '1px solid var(--border)',
        boxShadow: tier.highlighted ? 'var(--shadow-lg)' : 'none',
        transform: tier.highlighted ? 'scale(1.05)' : 'none',
      }}
    >
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
        {tier.name}
      </h3>

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>{tier.price}</span>
        {tier.period && (
          <span style={{ opacity: 0.7 }}>/{tier.period}</span>
        )}
      </div>

      {tier.description && (
        <p style={{ opacity: 0.8, marginBottom: 'var(--space-lg)' }}>
          {tier.description}
        </p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 'var(--space-lg)' }}>
        {tier.features.map((feature, i) => (
          <li key={i} style={{
            padding: 'var(--space-xs) 0',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
          }}>
            <span>✓</span> {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        style={{
          width: '100%',
          padding: 'var(--space-sm) var(--space-md)',
          backgroundColor: tier.highlighted ? 'var(--background)' : 'var(--primary)',
          color: tier.highlighted ? 'var(--foreground)' : 'var(--primary-foreground)',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {tier.ctaText || 'Get Started'}
      </button>
    </div>
  );
}

export function PricingTable({ tiers, onSelect }: PricingTableProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(\${tiers.length}, 1fr)\`,
        gap: 'var(--space-lg)',
        alignItems: 'center',
        padding: 'var(--space-xl)',
      }}
    >
      {tiers.map((tier, i) => (
        <PricingCard key={i} tier={tier} onSelect={() => onSelect?.(tier)} />
      ))}
    </div>
  );
}`,
    language: 'tsx',
    filename: 'PricingTable.tsx',
  }),
});

// =============================================================================
// PRODUCT CARD TEMPLATES (E-commerce)
// =============================================================================

registerTemplates('product-cards', {
  react: (theme) => ({
    code: `import React from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onQuickView?: () => void;
}

export function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div
      style={{
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {product.badge && (
          <span
            style={{
              position: 'absolute',
              top: 'var(--space-sm)',
              left: 'var(--space-sm)',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              padding: 'var(--space-xs) var(--space-sm)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {product.badge}
          </span>
        )}

        {discount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 'var(--space-sm)',
              right: 'var(--space-sm)',
              backgroundColor: 'var(--destructive)',
              color: 'var(--destructive-foreground)',
              padding: 'var(--space-xs) var(--space-sm)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-md)' }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 500,
          marginBottom: 'var(--space-xs)',
          color: 'var(--foreground)',
        }}>
          {product.name}
        </h3>

        {product.rating && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            marginBottom: 'var(--space-sm)',
          }}>
            <span style={{ color: '#fbbf24' }}>{'★'.repeat(Math.floor(product.rating))}</span>
            <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
              ({product.reviews})
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)' }}>
            \${product.price}
          </span>
          {product.originalPrice && (
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--muted-foreground)',
              textDecoration: 'line-through',
            }}>
              \${product.originalPrice}
            </span>
          )}
        </div>

        <button
          onClick={onAddToCart}
          style={{
            width: '100%',
            marginTop: 'var(--space-md)',
            padding: 'var(--space-sm)',
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}`,
    language: 'tsx',
    filename: 'ProductCard.tsx',
  }),
});

// =============================================================================
// NAVIGATION TEMPLATES
// =============================================================================

registerTemplates('navigation', {
  react: (theme) => ({
    code: `import React, { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface NavigationProps {
  logo?: React.ReactNode;
  items: NavItem[];
  actions?: React.ReactNode;
}

export function Navigation({ logo, items, actions }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-md) var(--space-lg)',
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>
        {logo || 'Logo'}
      </div>

      {/* Desktop Nav */}
      <ul
        style={{
          display: 'flex',
          gap: 'var(--space-lg)',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, i) => (
          <li key={i}>
            <a
              href={item.href}
              style={{
                color: 'var(--foreground)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        {actions}
      </div>
    </nav>
  );
}`,
    language: 'tsx',
    filename: 'Navigation.tsx',
  }),
});

// =============================================================================
// MOBILE MENU TEMPLATES
// =============================================================================

registerTemplates('mobile-menu', {
  react: (theme) => ({
    code: `import React, { useState } from 'react';

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface MobileMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ items, isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 40,
        }}
      />

      {/* Menu Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          backgroundColor: 'var(--background)',
          zIndex: 50,
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-lg)',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'var(--space-md)',
            right: 'var(--space-md)',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--foreground)',
          }}
        >
          ×
        </button>

        <nav style={{ marginTop: 'var(--space-xl)' }}>
          {items.map((item, i) => (
            <a
              key={i}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: 'var(--space-md)',
                color: 'var(--foreground)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-xs)',
                transition: 'background-color 0.2s',
              }}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: 'var(--space-sm)',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <span style={{ width: '24px', height: '2px', backgroundColor: 'var(--foreground)' }} />
      <span style={{ width: '24px', height: '2px', backgroundColor: 'var(--foreground)' }} />
      <span style={{ width: '24px', height: '2px', backgroundColor: 'var(--foreground)' }} />
    </button>
  );
}`,
    language: 'tsx',
    filename: 'MobileMenu.tsx',
  }),
});

// =============================================================================
// DEFAULT FALLBACK TEMPLATE
// =============================================================================

/**
 * Generate a fallback template when no specific template exists
 */
export function generateFallbackTemplate(componentId: string, framework: Framework, theme: Theme): CodeTemplate {
  const componentName = componentId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

  switch (framework) {
    case 'react':
      return {
        code: `import React from 'react';

// ${componentName} Component
// Using design tokens from your theme: ${theme.name}

export function ${componentName}({ children }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--card)',
        color: 'var(--card-foreground)',
        padding: 'var(--space-lg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
      }}
    >
      <h2 style={{ marginBottom: 'var(--space-md)' }}>${componentName}</h2>
      {children}
    </div>
  );
}`,
        language: 'tsx',
        filename: `${componentName}.tsx`,
      };

    case 'css':
      return {
        code: `/* ${componentName} Styles */
/* Using design tokens from: ${theme.name} */

.${componentId} {
  background-color: var(--card);
  color: var(--card-foreground);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.${componentId}__title {
  margin-bottom: var(--space-md);
  font-weight: 600;
}

.${componentId}__content {
  color: var(--muted-foreground);
}`,
        language: 'css',
        filename: `${componentId}.css`,
      };

    default:
      return {
        code: `// ${componentName} template for ${framework}
// Component: ${componentId}
// Theme: ${theme.name}

// Template not yet available for this framework.
// Using design tokens:
// - Colors: var(--primary), var(--background), etc.
// - Spacing: var(--space-sm), var(--space-md), etc.
// - Radius: var(--radius-sm), var(--radius-md), etc.`,
        language: 'javascript',
        filename: `${componentId}.js`,
      };
  }
}
