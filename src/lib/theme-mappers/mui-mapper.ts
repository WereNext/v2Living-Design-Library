/**
 * Maps Living Design Library tokens to MUI ThemeOptions
 */
import type { ThemeOptions } from '@mui/material/styles';
import type { Theme } from '../../hooks/useDesignSystems';
import { parseBorderRadius, parseSpacing, extractThemeColors } from './color-utils';

export function mapTokensToMUI(theme: Theme): ThemeOptions {
  const c = extractThemeColors(theme.colors);

  // Parse spacing - use the theme's spacing values or defaults
  const baseSpacing = parseSpacing(theme.spacing?.md || theme.spacing?.['space-md'] || '1rem');

  // Parse border radius
  const borderRadius = parseBorderRadius(theme.borderRadius?.['radius-md'] || theme.borderRadius?.md || '0.5rem');

  // Parse typography
  const fontFamily = theme.typography?.['font-sans'] || theme.typography?.['font-family'] || 'Inter, system-ui, sans-serif';

  return {
    palette: {
      mode: c.isLight ? 'light' : 'dark',
      primary: {
        main: c.primary,
        contrastText: c.primaryForeground,
      },
      secondary: {
        main: c.secondary,
        contrastText: c.secondaryForeground,
      },
      error: {
        main: c.destructive,
        contrastText: c.destructiveForeground,
      },
      warning: {
        main: c.warning,
      },
      info: {
        main: c.info,
      },
      success: {
        main: c.success,
      },
      background: {
        default: c.background,
        paper: c.card,
      },
      text: {
        primary: c.foreground,
        secondary: c.mutedForeground,
        disabled: c.mutedForeground,
      },
      divider: c.border,
      action: {
        hover: c.accent,
        selected: c.accent,
        disabled: c.muted,
        disabledBackground: c.muted,
      },
    },
    shape: {
      borderRadius: borderRadius,
    },
    typography: {
      fontFamily: fontFamily,
      fontSize: 14,
      h1: {
        fontFamily: fontFamily,
      },
      h2: {
        fontFamily: fontFamily,
      },
      h3: {
        fontFamily: fontFamily,
      },
      h4: {
        fontFamily: fontFamily,
      },
      h5: {
        fontFamily: fontFamily,
      },
      h6: {
        fontFamily: fontFamily,
      },
      body1: {
        fontFamily: fontFamily,
      },
      body2: {
        fontFamily: fontFamily,
      },
      button: {
        fontFamily: fontFamily,
        textTransform: 'none', // Don't uppercase buttons by default
      },
    },
    spacing: baseSpacing / 4, // MUI uses factor * spacing, so we need the base unit
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius,
            textTransform: 'none',
          },
        },
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius,
            border: `1px solid ${c.border}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: borderRadius,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: borderRadius,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius / 2,
          },
        },
      },
    },
  };
}
