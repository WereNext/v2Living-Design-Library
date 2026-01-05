/**
 * Dynamic Theme Engine
 * Converts design system tokens into live CSS variables
 * This is the CORE of how the app becomes a "living library"
 */

import { Theme } from '../hooks/useDesignSystems';

export interface ThemeVariables {
  css: string;
  variables: Record<string, string>;
}

/**
 * Generates CSS variables from design system tokens
 * This makes the user's design system LIVE in the app
 */
export function generateThemeCSS(theme: Theme | null): ThemeVariables {
  if (!theme) {
    return { css: '', variables: {} };
  }

  const variables: Record<string, string> = {};
  const cssLines: string[] = [];

  // COLORS - Convert token structure to CSS variables
  if (theme.colors) {
    Object.entries(theme.colors).forEach(([name, value]) => {
      const varName = `--theme-color-${name}`;
      variables[varName] = value as string;
      cssLines.push(`  ${varName}: ${value};`);
    });
  }

  // TYPOGRAPHY
  if (theme.typography) {
    Object.entries(theme.typography).forEach(([name, value]) => {
      const varName = `--theme-typography-${name}`;
      variables[varName] = value as string;
      cssLines.push(`  ${varName}: ${value};`);
    });
  }

  // SPACING
  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([size, value]) => {
      const varName = `--theme-space-${size}`;
      variables[varName] = value as string;
      cssLines.push(`  ${varName}: ${value};`);
    });
  }

  // BORDER RADIUS
  if (theme.borderRadius) {
    Object.entries(theme.borderRadius).forEach(([size, value]) => {
      const varName = `--theme-radius-${size}`;
      variables[varName] = value as string;
      cssLines.push(`  ${varName}: ${value};`);
    });
  }

  // SHADOWS
  if (theme.shadows) {
    Object.entries(theme.shadows).forEach(([size, value]) => {
      const varName = `--theme-shadow-${size}`;
      variables[varName] = value as string;
      cssLines.push(`  ${varName}: ${value};`);
    });
  }

  // OPACITY
  if (theme.opacity) {
    Object.entries(theme.opacity).forEach(([level, value]) => {
      const varName = `--theme-opacity-${level}`;
      variables[varName] = value as string;
      cssLines.push(`  ${varName}: ${value};`);
    });
  }

  // EFFECTS
  if (theme.effects) {
    Object.entries(theme.effects).forEach(([name, value]) => {
      const varName = `--theme-effect-${name}`;
      variables[varName] = value as string;
      cssLines.push(`  ${varName}: ${value};`);
    });
  }

  // Build final CSS
  const css = `:root {\n${cssLines.join('\n')}\n}`;

  return { css, variables };
}

/**
 * Inject theme CSS into the document
 * This makes the design system LIVE
 */
export function injectThemeCSS(theme: Theme | null): void {
  // Remove existing theme style tag
  const existingStyle = document.getElementById('dynamic-theme-variables');
  if (existingStyle) {
    existingStyle.remove();
  }

  if (!theme) return;

  // Generate and inject new CSS
  const { css } = generateThemeCSS(theme);
  
  // Only inject if we have actual variables
  if (css && css.trim() !== ':root {\n\n}') {
    const styleTag = document.createElement('style');
    styleTag.id = 'dynamic-theme-variables';
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
  }
}

/**
 * Get a semantic color mapping
 * Maps design tokens to common UI concepts
 */
export function getSemanticColors(theme: Theme | null): Record<string, string> {
  if (!theme?.colors) return {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    danger: '#ef4444',
    background: '#ffffff',
    foreground: '#000000',
    border: '#e5e7eb',
  };

  const colors = theme.colors;
  
  return {
    // Primary actions
    primary: colors.primary || colors.brand || '#3b82f6',
    primaryHover: colors.primaryHover || colors.brandHover || '#2563eb',
    
    // Secondary actions
    secondary: colors.secondary || colors.muted || '#6b7280',
    
    // Success states
    success: colors.success || colors.green || '#10b981',
    
    // Warning states
    warning: colors.warning || colors.yellow || colors.orange || '#f59e0b',
    
    // Error states
    error: colors.error || colors.danger || colors.red || '#ef4444',
    danger: colors.danger || colors.error || colors.red || '#ef4444',
    
    // Neutral/Background
    background: colors.background || colors.bg || '#ffffff',
    foreground: colors.foreground || colors.text || colors.fg || '#000000',
    
    // Borders
    border: colors.border || colors.divider || '#e5e7eb',
  };
}

/**
 * Create component-specific styles from tokens
 */
export function createComponentStyles(theme: Theme | null) {
  if (!theme) return {
    button: {
      primary: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: '0.5rem 1.5rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '#000000',
        padding: '0.5rem 1.5rem',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        fontWeight: '500',
      }
    },
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
    input: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      fontSize: '1rem',
    }
  };

  const semanticColors = getSemanticColors(theme);
  const spacing = theme.spacing || {};
  const borderRadius = theme.borderRadius || {};
  const shadows = theme.shadows || {};

  return {
    button: {
      primary: {
        backgroundColor: semanticColors.primary,
        color: '#ffffff',
        padding: `${spacing.sm || '0.5rem'} ${spacing.lg || '1.5rem'}`,
        borderRadius: borderRadius.md || borderRadius.default || '0.375rem',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500',
        boxShadow: shadows.sm || '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: semanticColors.foreground,
        padding: `${spacing.sm || '0.5rem'} ${spacing.lg || '1.5rem'}`,
        borderRadius: borderRadius.md || borderRadius.default || '0.375rem',
        border: `1px solid ${semanticColors.border}`,
        cursor: 'pointer',
        fontWeight: '500',
      }
    },
    card: {
      backgroundColor: semanticColors.background,
      border: `1px solid ${semanticColors.border}`,
      borderRadius: borderRadius.lg || borderRadius.default || '0.5rem',
      padding: spacing.lg || '1.5rem',
      boxShadow: shadows.md || '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
    input: {
      backgroundColor: semanticColors.background,
      border: `1px solid ${semanticColors.border}`,
      borderRadius: borderRadius.md || borderRadius.default || '0.375rem',
      padding: `${spacing.sm || '0.5rem'} ${spacing.md || '1rem'}`,
      fontSize: theme.typography?.base || '1rem',
    }
  };
}
