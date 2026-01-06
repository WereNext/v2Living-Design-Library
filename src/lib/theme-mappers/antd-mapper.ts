/**
 * Maps Living Design Library tokens to Ant Design ConfigProvider theme
 */
import type { ThemeConfig } from 'antd';
import type { Theme } from '../../hooks/useDesignSystems';
import { parseBorderRadius, parseSpacing, extractThemeColors } from './color-utils';

export function mapTokensToAntd(theme: Theme): ThemeConfig {
  const c = extractThemeColors(theme.colors);

  // Parse border radius
  const borderRadius = parseBorderRadius(theme.borderRadius?.['radius-md'] || theme.borderRadius?.md || '0.5rem');

  // Parse typography
  const fontFamily = theme.typography?.['font-sans'] || theme.typography?.['font-family'] || 'Inter, system-ui, sans-serif';

  // Parse font size
  const fontSize = parseSpacing(theme.typography?.['font-size-base'] || '14px');

  // Parse spacing for control heights
  const controlHeight = parseSpacing(theme.spacing?.lg || theme.spacing?.['space-lg'] || '2.5rem');

  return {
    token: {
      // Colors
      colorPrimary: c.primary,
      colorBgBase: c.background,
      colorTextBase: c.foreground,
      colorBorder: c.border,
      colorError: c.destructive,
      colorSuccess: c.success,
      colorWarning: c.warning,
      colorInfo: c.info,
      colorLink: c.primary,

      // Background colors
      colorBgContainer: c.card,
      colorBgElevated: c.popover,
      colorBgLayout: c.background,
      colorBgSpotlight: c.muted,

      // Text colors
      colorText: c.foreground,
      colorTextSecondary: c.mutedForeground,
      colorTextTertiary: c.mutedForeground,
      colorTextQuaternary: c.mutedForeground,

      // Shape
      borderRadius: borderRadius,
      borderRadiusLG: borderRadius * 1.5,
      borderRadiusSM: borderRadius * 0.5,
      borderRadiusXS: borderRadius * 0.25,

      // Typography
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontSizeHeading1: fontSize * 2.5,
      fontSizeHeading2: fontSize * 2,
      fontSizeHeading3: fontSize * 1.75,
      fontSizeHeading4: fontSize * 1.5,
      fontSizeHeading5: fontSize * 1.25,

      // Sizing
      controlHeight: controlHeight,
      controlHeightLG: controlHeight * 1.2,
      controlHeightSM: controlHeight * 0.8,

      // Motion
      motionDurationFast: '0.1s',
      motionDurationMid: '0.2s',
      motionDurationSlow: '0.3s',

      // Shadows
      boxShadow: theme.shadows?.md || theme.shadows?.['shadow-md'] || '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      boxShadowSecondary: theme.shadows?.lg || theme.shadows?.['shadow-lg'] || '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
    components: {
      Button: {
        borderRadius: borderRadius,
        controlHeight: controlHeight,
        fontFamily: fontFamily,
      },
      Card: {
        borderRadius: borderRadius,
      },
      Input: {
        borderRadius: borderRadius,
        controlHeight: controlHeight,
      },
      Select: {
        borderRadius: borderRadius,
        controlHeight: controlHeight,
      },
      Modal: {
        borderRadius: borderRadius,
      },
      Drawer: {
        borderRadius: borderRadius,
      },
      Tag: {
        borderRadius: borderRadius / 2,
      },
      Badge: {
        borderRadius: borderRadius / 2,
      },
      Table: {
        borderRadius: borderRadius,
      },
      Tabs: {
        borderRadius: borderRadius,
      },
    },
    algorithm: c.isLight ? undefined : undefined, // Could use theme.darkAlgorithm for dark mode
  };
}
