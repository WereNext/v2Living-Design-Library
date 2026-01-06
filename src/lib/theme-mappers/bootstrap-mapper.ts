/**
 * Maps Living Design Library tokens to Bootstrap CSS variables
 * Bootstrap uses CSS custom properties for theming
 */
import type { Theme } from '../../hooks/useDesignSystems';
import { extractThemeColors } from './color-utils';

export interface BootstrapThemeVars {
  cssVariables: Record<string, string>;
  colorMode: 'light' | 'dark';
}

export function mapTokensToBootstrap(theme: Theme): BootstrapThemeVars {
  const c = extractThemeColors(theme.colors);

  // Parse border radius
  const borderRadius = theme.borderRadius?.['radius-md'] || theme.borderRadius?.md || '0.5rem';

  // Parse typography
  const fontFamily = theme.typography?.['font-sans'] || theme.typography?.['font-family'] || 'Inter, system-ui, sans-serif';

  // Determine color mode
  const colorMode = c.isLight ? 'light' : 'dark';

  // Map to Bootstrap CSS variables
  const cssVariables: Record<string, string> = {
    // Theme colors
    '--bs-primary': c.primary,
    '--bs-secondary': c.secondary,
    '--bs-success': c.success,
    '--bs-info': c.info,
    '--bs-warning': c.warning,
    '--bs-danger': c.destructive,
    '--bs-light': c.muted,
    '--bs-dark': c.foreground,

    // Background and body
    '--bs-body-bg': c.background,
    '--bs-body-color': c.foreground,
    '--bs-body-font-family': fontFamily,

    // Border
    '--bs-border-color': c.border,
    '--bs-border-radius': borderRadius,
    '--bs-border-radius-sm': `calc(${borderRadius} * 0.5)`,
    '--bs-border-radius-lg': `calc(${borderRadius} * 1.5)`,
    '--bs-border-radius-xl': `calc(${borderRadius} * 2)`,
    '--bs-border-radius-xxl': `calc(${borderRadius} * 3)`,
    '--bs-border-radius-pill': '50rem',

    // Card
    '--bs-card-bg': c.card,
    '--bs-card-border-color': c.border,
    '--bs-card-cap-bg': c.muted,

    // Modal
    '--bs-modal-bg': c.popover,
    '--bs-modal-border-color': c.border,

    // Links
    '--bs-link-color': c.primary,
    '--bs-link-hover-color': c.primary,

    // Form controls
    '--bs-form-control-bg': c.background,
    '--bs-form-control-border-color': c.border,

    // Component colors
    '--bs-component-active-bg': c.primary,
    '--bs-component-active-color': c.primaryForeground,

    // Shadows
    '--bs-box-shadow': theme.shadows?.md || theme.shadows?.['shadow-md'] || '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    '--bs-box-shadow-sm': theme.shadows?.sm || theme.shadows?.['shadow-sm'] || '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    '--bs-box-shadow-lg': theme.shadows?.lg || theme.shadows?.['shadow-lg'] || '0 10px 15px -3px rgb(0 0 0 / 0.1)',

    // Spacing (if needed)
    '--bs-spacer': theme.spacing?.md || theme.spacing?.['space-md'] || '1rem',
  };

  return {
    cssVariables,
    colorMode,
  };
}

/**
 * Generate CSS string from Bootstrap theme vars
 */
export function generateBootstrapCSS(themeVars: BootstrapThemeVars): string {
  const { cssVariables, colorMode } = themeVars;

  const variableDeclarations = Object.entries(cssVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `
:root,
[data-bs-theme="${colorMode}"] {
${variableDeclarations}
}
`.trim();
}
