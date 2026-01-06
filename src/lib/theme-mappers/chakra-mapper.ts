/**
 * Maps Living Design Library tokens to Chakra UI theme config
 */
import type { ThemeConfig } from '@chakra-ui/react';
import type { Theme } from '../../hooks/useDesignSystems';
import { generateColorPalette, extractThemeColors, safeGet, DEFAULT_COLORS } from './color-utils';

export function mapTokensToChakra(theme: Theme): ThemeConfig & {
  colors: Record<string, unknown>;
  fonts: Record<string, string>;
  radii: Record<string, string>;
  space: Record<string, string>;
  shadows: Record<string, string>;
  transition: Record<string, unknown>;
} {
  const c = extractThemeColors(theme.colors);

  // Safely get primary/secondary with fallbacks
  const primary = safeGet(theme.colors, ['primary'], DEFAULT_COLORS.primary);
  const secondary = safeGet(theme.colors, ['secondary'], DEFAULT_COLORS.secondary);

  // Generate color palettes
  const brandColors = generateColorPalette(primary);

  // Parse typography (with multiple key fallbacks)
  const fontFamily = safeGet(theme.typography, ['font-sans', 'font-family', 'fontFamily', 'sans'], 'Inter, system-ui, sans-serif');

  // Parse spacing
  const spacing: Record<string, string> = {};
  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([key, value]) => {
      // Convert spacing keys to Chakra format
      const chakraKey = key.replace('space-', '').replace('spacing-', '');
      spacing[chakraKey] = value;
    });
  }

  // Parse radii
  const radii: Record<string, string> = {};
  if (theme.borderRadius) {
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      const chakraKey = key.replace('radius-', '');
      radii[chakraKey] = value;
    });
  }

  // Parse shadows
  const shadows: Record<string, string> = {};
  if (theme.shadows) {
    Object.entries(theme.shadows).forEach(([key, value]) => {
      const chakraKey = key.replace('shadow-', '');
      shadows[chakraKey] = value;
    });
  }

  // Parse animation/transition tokens
  const durations: Record<string, string> = {
    'ultra-fast': safeGet(theme.effects, ['duration-instant', 'duration-fastest'], '50ms'),
    faster: safeGet(theme.effects, ['duration-faster', 'transition-faster'], '100ms'),
    fast: safeGet(theme.effects, ['duration-fast', 'transition-fast'], '150ms'),
    normal: safeGet(theme.effects, ['duration-normal', 'duration-base', 'transition-normal'], '200ms'),
    slow: safeGet(theme.effects, ['duration-slow', 'transition-slow'], '300ms'),
    slower: safeGet(theme.effects, ['duration-slower', 'transition-slower'], '400ms'),
    'ultra-slow': safeGet(theme.effects, ['duration-slowest'], '500ms'),
  };

  const easings: Record<string, string> = {
    'ease-in': safeGet(theme.effects, ['ease-in', 'easing-accelerate'], 'cubic-bezier(0.4, 0, 1, 1)'),
    'ease-out': safeGet(theme.effects, ['ease-out', 'easing-decelerate'], 'cubic-bezier(0, 0, 0.2, 1)'),
    'ease-in-out': safeGet(theme.effects, ['ease-in-out', 'easing-default'], 'cubic-bezier(0.4, 0, 0.2, 1)'),
  };

  return {
    initialColorMode: c.isLight ? 'light' : 'dark',
    useSystemColorMode: false,
    colors: {
      brand: brandColors,
      primary: brandColors,
      secondary: generateColorPalette(secondary),
      background: c.background,
      foreground: c.foreground,
      muted: c.muted,
      accent: c.accent,
      destructive: c.destructive,
      border: c.border,
      card: c.card,
    },
    fonts: {
      heading: fontFamily,
      body: fontFamily,
      mono: theme.typography?.['font-mono'] || 'JetBrains Mono, monospace',
    },
    radii: {
      none: '0',
      sm: radii.sm || '0.25rem',
      base: radii.md || '0.5rem',
      md: radii.md || '0.5rem',
      lg: radii.lg || '0.75rem',
      xl: radii.xl || '1rem',
      '2xl': radii['2xl'] || '1.5rem',
      '3xl': radii['3xl'] || '2rem',
      full: '9999px',
    },
    space: {
      px: '1px',
      0.5: spacing.xs || '0.125rem',
      1: spacing.xs || '0.25rem',
      2: spacing.sm || '0.5rem',
      3: spacing.sm || '0.75rem',
      4: spacing.md || '1rem',
      5: spacing.md || '1.25rem',
      6: spacing.lg || '1.5rem',
      8: spacing.xl || '2rem',
      10: spacing.xl || '2.5rem',
      12: spacing['2xl'] || '3rem',
      16: spacing['3xl'] || '4rem',
      ...spacing,
    },
    shadows: {
      xs: shadows.xs || '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      sm: shadows.sm || '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      base: shadows.md || '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      md: shadows.md || '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: shadows.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: shadows.xl || '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      '2xl': shadows['2xl'] || '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      ...shadows,
    },
    transition: {
      duration: durations,
      easing: easings,
      property: {
        common: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
        colors: 'background-color, border-color, color, fill, stroke',
        dimensions: 'width, height',
        position: 'left, right, top, bottom',
        background: 'background-color, background-image, background-position',
      },
    },
  };
}
