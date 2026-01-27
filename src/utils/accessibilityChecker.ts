import { parseHSLString, hslToRgbTuple } from "../lib/theme-mappers/color-utils";

export interface ContrastResult {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
}

export interface AccessibilityIssue {
  tokenPath: string;
  issue: string;
  severity: "error" | "warning" | "info";
  suggestion?: string;
}

export function checkContrast(foreground: string, background: string): ContrastResult {
  const fgLuminance = getRelativeLuminance(foreground);
  const bgLuminance = getRelativeLuminance(background);

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
                (Math.min(fgLuminance, bgLuminance) + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
  };
}

function getRelativeLuminance(color: string): number {
  const rgb = parseColor(color);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map(channel => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Parse a color string to RGB tuple
 * Uses centralized parseHSLString for HSL parsing
 */
function parseColor(color: string): [number, number, number] | null {
  // Try parsing as HSL using centralized utility
  const hsl = parseHSLString(color);
  if (hsl) {
    return hslToRgbTuple(hsl.h, hsl.s, hsl.l);
  }

  // Handle RGB format
  const rgbMatch = color.match(/rgb\(?\s*(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)\s*\)?/);
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }

  // Handle hex format
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
  }

  return null;
}

interface ThemeWithColors {
  colors?: Record<string, string>;
}

export function validateThemeAccessibility(theme: ThemeWithColors): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  if (!theme.colors) return issues;

  // Check common contrast combinations
  const combinations = [
    { fg: "foreground", bg: "background", name: "Text on Background" },
    { fg: "primary-foreground", bg: "primary", name: "Primary Button Text" },
    { fg: "secondary-foreground", bg: "secondary", name: "Secondary Button Text" },
    { fg: "muted-foreground", bg: "muted", name: "Muted Text" },
    { fg: "card-foreground", bg: "card", name: "Card Text" },
  ];

  combinations.forEach(({ fg, bg, name }) => {
    const fgColor = theme.colors[fg];
    const bgColor = theme.colors[bg];

    if (fgColor && bgColor) {
      const result = checkContrast(fgColor, bgColor);
      
      if (!result.aa) {
        issues.push({
          tokenPath: `colors.${fg} on colors.${bg}`,
          issue: `${name} fails WCAG AA (${result.ratio}:1)`,
          severity: "error",
          suggestion: "Increase contrast to at least 4.5:1 for normal text",
        });
      } else if (!result.aaa) {
        issues.push({
          tokenPath: `colors.${fg} on colors.${bg}`,
          issue: `${name} passes AA but fails AAA (${result.ratio}:1)`,
          severity: "warning",
          suggestion: "Consider increasing contrast to 7:1 for AAA compliance",
        });
      }
    }
  });

  // Check for sufficient color variation
  if (theme.colors.primary && theme.colors.secondary) {
    const primaryLum = getRelativeLuminance(theme.colors.primary);
    const secondaryLum = getRelativeLuminance(theme.colors.secondary);
    
    if (Math.abs(primaryLum - secondaryLum) < 0.1) {
      issues.push({
        tokenPath: "colors.primary vs colors.secondary",
        issue: "Primary and secondary colors are too similar",
        severity: "warning",
        suggestion: "Ensure sufficient visual distinction between primary and secondary colors",
      });
    }
  }

  return issues;
}

export function suggestAccessibleColor(
  originalColor: string, 
  backgroundColor: string, 
  targetRatio: number = 4.5
): string | null {
  const bgLum = getRelativeLuminance(backgroundColor);
  const rgb = parseColor(originalColor);
  
  if (!rgb) return null;

  // Convert to HSL for easier manipulation
  const [r, g, b] = rgb.map(v => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  // Adjust lightness to meet target ratio
  let newL = l;
  const step = bgLum > 0.5 ? -0.05 : 0.05; // Darken on light bg, lighten on dark bg

  for (let i = 0; i < 20; i++) {
    newL += step;
    if (newL < 0 || newL > 1) break;

    // This is simplified - would need full HSL to RGB conversion
    const testColor = `hsl(0, 50%, ${newL * 100}%)`;
    const result = checkContrast(testColor, backgroundColor);
    
    if (result.ratio >= targetRatio) {
      return testColor;
    }
  }

  return null;
}
