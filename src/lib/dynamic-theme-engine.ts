/**
 * Dynamic Theme Engine
 * Converts design system tokens into live CSS variables
 * This is the CORE of how the app becomes a "living library"
 */

import { Theme, ColorScheme } from '../types/design-system';

export interface ThemeVariables {
  css: string;
  variables: Record<string, string>;
  colorScheme?: ColorScheme;
}

/**
 * Detect if a theme is intended to be dark based on its colors or name
 */
export function isThemeDark(theme: Theme | null): boolean {
  if (!theme) return false;

  // Explicit colorScheme takes precedence
  if (theme.colorScheme === 'dark') return true;
  if (theme.colorScheme === 'light') return false;

  // Check theme name for dark indicators
  const nameLower = theme.name.toLowerCase();
  if (nameLower.includes('dark') || nameLower.includes('night') || nameLower.includes('midnight')) {
    return true;
  }

  // Analyze background color luminance
  const bgColor = theme.colors?.background || theme.colors?.bg;
  if (bgColor) {
    const luminance = getColorLuminance(bgColor);
    return luminance < 0.5; // Dark if luminance is below 50%
  }

  return false;
}

/**
 * Calculate relative luminance of a color (0 = black, 1 = white)
 */
function getColorLuminance(color: string): number {
  // Handle hex colors
  let hex = color;
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }

  // Handle shorthand hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Parse RGB values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  // Calculate relative luminance using sRGB
  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
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

  // Determine color scheme
  const colorScheme: ColorScheme = theme.colorScheme || (isThemeDark(theme) ? 'dark' : 'light');

  return { css, variables, colorScheme };
}

/**
 * Inject theme CSS into the document
 * This makes the design system LIVE
 * Returns the detected color scheme so callers can sync dark mode
 */
export function injectThemeCSS(theme: Theme | null): ColorScheme | undefined {
  // Remove existing theme style tag
  const existingStyle = document.getElementById('dynamic-theme-variables');
  if (existingStyle) {
    existingStyle.remove();
  }

  if (!theme) return undefined;

  // Generate and inject new CSS
  const { css, colorScheme } = generateThemeCSS(theme);

  // Only inject if we have actual variables
  if (css && css.trim() !== ':root {\n\n}') {
    const styleTag = document.createElement('style');
    styleTag.id = 'dynamic-theme-variables';
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
  }

  // Dispatch event so DarkModeProvider can sync
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('theme-color-scheme-change', {
      detail: { colorScheme }
    }));
  }

  return colorScheme;
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
