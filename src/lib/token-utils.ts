/**
 * Token Application Utilities
 * 
 * Enhanced utilities for applying design tokens with support for:
 * - Dynamic token categories (colors, spacing, typography, borderRadius, shadows, opacity, effects)
 * - Sidebar-specific theming
 * - CSS custom properties
 */

import type { Theme } from '../hooks/useDesignSystems';

/**
 * Apply theme tokens to the document root
 * Supports all dynamic token categories
 */
export function applyTokens(theme: Theme | null): void {
  if (!theme) return;

  const root = document.documentElement;

  // Apply colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    // Don't add prefix if it already has one
    const cssKey = key.startsWith('space-') ? key : `space-${key}`;
    root.style.setProperty(`--${cssKey}`, value);
  });

  // Apply typography
  Object.entries(theme.typography).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    const cssKey = key.startsWith('radius-') ? key : `radius-${key}`;
    root.style.setProperty(`--${cssKey}`, value);
  });

  // Apply shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    const cssKey = key.startsWith('shadow-') ? key : `shadow-${key}`;
    root.style.setProperty(`--${cssKey}`, value);
  });

  // Apply sidebar tokens (if present)
  if (theme.sidebar) {
    Object.entries(theme.sidebar).forEach(([key, value]) => {
      root.style.setProperty(`--sidebar-${key}`, value);
    });
  }

  // Apply opacity tokens (if present)
  if (theme.opacity) {
    Object.entries(theme.opacity).forEach(([key, value]) => {
      const cssKey = key.startsWith('opacity-') ? key : `opacity-${key}`;
      root.style.setProperty(`--${cssKey}`, value);
    });
  }

  // Apply effects tokens (if present) - backdrop-filter, filter, etc.
  if (theme.effects) {
    Object.entries(theme.effects).forEach(([key, value]) => {
      const cssKey = key.startsWith('effect-') ? key : `effect-${key}`;
      root.style.setProperty(`--${cssKey}`, value);
    });
  }

  console.log('🎨 Applied theme tokens:', {
    themeName: theme.name,
    colors: Object.keys(theme.colors).length,
    spacing: Object.keys(theme.spacing).length,
    typography: Object.keys(theme.typography).length,
    borderRadius: Object.keys(theme.borderRadius).length,
    shadows: Object.keys(theme.shadows).length,
    sidebar: theme.sidebar ? Object.keys(theme.sidebar).length : 0,
    opacity: theme.opacity ? Object.keys(theme.opacity).length : 0,
    effects: theme.effects ? Object.keys(theme.effects).length : 0,
  });
}
