/**
 * Maps Living Design Library tokens to MUI ThemeOptions
 */
import type { ThemeOptions } from '@mui/material/styles';
import type { Theme } from '../../hooks/useDesignSystems';
import { parseBorderRadius, parseSpacing, extractThemeColors, safeGet } from './color-utils';

/**
 * Parse transition duration string to number (ms)
 */
function parseTransitionDuration(value: string): number {
  if (value.endsWith('ms')) {
    return parseFloat(value);
  }
  if (value.endsWith('s')) {
    return parseFloat(value) * 1000;
  }
  return parseFloat(value) || 300;
}

export function mapTokensToMUI(theme: Theme): ThemeOptions {
  const c = extractThemeColors(theme.colors);

  // Parse spacing - use the theme's spacing values or defaults (with multiple key fallbacks)
  const spacingValue = safeGet(theme.spacing, ['md', 'space-md', 'spacing-md', '4'], '1rem');
  const baseSpacing = parseSpacing(spacingValue);

  // Parse border radius (with multiple key fallbacks)
  const radiusValue = safeGet(theme.borderRadius, ['radius-md', 'md', 'base'], '0.5rem');
  const borderRadius = parseBorderRadius(radiusValue);

  // Parse typography (with multiple key fallbacks)
  const fontFamily = safeGet(theme.typography, ['font-sans', 'font-family', 'fontFamily', 'sans'], 'Inter, system-ui, sans-serif');

  // Parse animation/transition tokens
  const durationShortest = parseTransitionDuration(safeGet(theme.effects, ['duration-instant', 'duration-fastest', 'transition-fastest'], '150ms'));
  const durationShort = parseTransitionDuration(safeGet(theme.effects, ['duration-fast', 'transition-fast'], '200ms'));
  const durationStandard = parseTransitionDuration(safeGet(theme.effects, ['duration-normal', 'duration-base', 'transition-normal'], '300ms'));
  const durationComplex = parseTransitionDuration(safeGet(theme.effects, ['duration-slow', 'transition-slow'], '375ms'));

  // Parse easing functions
  const easingEaseInOut = safeGet(theme.effects, ['ease-in-out', 'easing-default'], 'cubic-bezier(0.4, 0, 0.2, 1)');
  const easingEaseOut = safeGet(theme.effects, ['ease-out', 'easing-decelerate'], 'cubic-bezier(0.0, 0, 0.2, 1)');
  const easingEaseIn = safeGet(theme.effects, ['ease-in', 'easing-accelerate'], 'cubic-bezier(0.4, 0, 1, 1)');
  const easingSharp = safeGet(theme.effects, ['ease-sharp', 'easing-sharp'], 'cubic-bezier(0.4, 0, 0.6, 1)');

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
    transitions: {
      duration: {
        shortest: durationShortest,
        shorter: durationShort,
        short: durationShort,
        standard: durationStandard,
        complex: durationComplex,
        enteringScreen: durationStandard,
        leavingScreen: durationShort,
      },
      easing: {
        easeInOut: easingEaseInOut,
        easeOut: easingEaseOut,
        easeIn: easingEaseIn,
        sharp: easingSharp,
      },
    },
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
