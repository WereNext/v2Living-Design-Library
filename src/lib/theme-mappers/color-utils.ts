/**
 * Color utility functions for converting between color formats
 * Used by theme mappers to transform design tokens for different UI libraries
 */

/**
 * Parse an HSL string in the format "H S% L%" and return components
 */
export function parseHSLString(hslString: string): { h: number; s: number; l: number } | null {
  // Handle already-formatted hsl() strings
  const hslMatch = hslString.match(/hsl\(\s*([\d.]+)\s*,?\s*([\d.]+)%?\s*,?\s*([\d.]+)%?\s*\)/i);
  if (hslMatch) {
    return {
      h: parseFloat(hslMatch[1]),
      s: parseFloat(hslMatch[2]),
      l: parseFloat(hslMatch[3]),
    };
  }

  // Handle raw "H S% L%" format (used by shadcn/Tailwind)
  const parts = hslString.trim().split(/\s+/);
  if (parts.length >= 3) {
    const h = parseFloat(parts[0]);
    const s = parseFloat(parts[1].replace('%', ''));
    const l = parseFloat(parts[2].replace('%', ''));
    if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
      return { h, s, l };
    }
  }

  return null;
}

/**
 * Convert HSL components to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert an HSL string to hex color
 */
export function hslStringToHex(hslString: string): string {
  // If already hex, return as-is
  if (hslString.startsWith('#')) {
    return hslString;
  }

  // If RGB, convert to hex
  if (hslString.startsWith('rgb')) {
    return rgbStringToHex(hslString);
  }

  // Parse HSL
  const parsed = parseHSLString(hslString);
  if (!parsed) {
    console.warn('Could not parse HSL string:', hslString);
    return '#000000';
  }

  return hslToHex(parsed.h, parsed.s, parsed.l);
}

/**
 * Convert RGB string to hex
 */
export function rgbStringToHex(rgbString: string): string {
  const match = rgbString.match(/rgba?\(\s*([\d.]+)\s*,?\s*([\d.]+)\s*,?\s*([\d.]+)/i);
  if (!match) return '#000000';

  const r = Math.round(parseFloat(match[1]));
  const g = Math.round(parseFloat(match[2]));
  const b = Math.round(parseFloat(match[3]));

  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, n)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Lighten a color by a percentage
 */
export function lighten(hslString: string, amount: number): string {
  const parsed = parseHSLString(hslString);
  if (!parsed) return hslString;

  const newL = Math.min(100, parsed.l + (100 - parsed.l) * amount);
  return hslToHex(parsed.h, parsed.s, newL);
}

/**
 * Darken a color by a percentage
 */
export function darken(hslString: string, amount: number): string {
  const parsed = parseHSLString(hslString);
  if (!parsed) return hslString;

  const newL = Math.max(0, parsed.l * (1 - amount));
  return hslToHex(parsed.h, parsed.s, newL);
}

/**
 * Generate a color palette from a base color (for Chakra UI)
 * Returns colors from 50 (lightest) to 900 (darkest)
 */
export function generateColorPalette(hslString: string): Record<string, string> {
  const parsed = parseHSLString(hslString);
  if (!parsed) {
    return {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    };
  }

  const { h, s } = parsed;

  return {
    50: hslToHex(h, s * 0.1, 97),
    100: hslToHex(h, s * 0.3, 93),
    200: hslToHex(h, s * 0.5, 85),
    300: hslToHex(h, s * 0.7, 75),
    400: hslToHex(h, s * 0.85, 60),
    500: hslToHex(h, s, 50),
    600: hslToHex(h, s, 42),
    700: hslToHex(h, s, 35),
    800: hslToHex(h, s, 27),
    900: hslToHex(h, s, 20),
  };
}

/**
 * Parse a spacing value and return pixels
 */
export function parseSpacing(value: string): number {
  if (value.endsWith('rem')) {
    return parseFloat(value) * 16;
  }
  if (value.endsWith('px')) {
    return parseFloat(value);
  }
  return parseFloat(value);
}

/**
 * Parse border radius value
 */
export function parseBorderRadius(value: string): number {
  return parseSpacing(value);
}

/**
 * Default color values used across all theme mappers
 */
export const DEFAULT_COLORS = {
  primary: '221.2 83.2% 53.3%',
  'primary-foreground': '210 40% 98%',
  secondary: '210 40% 96%',
  'secondary-foreground': '222.2 47.4% 11.2%',
  background: '0 0% 100%',
  foreground: '222.2 84% 4.9%',
  card: '0 0% 100%',
  popover: '0 0% 100%',
  muted: '210 40% 96%',
  'muted-foreground': '215.4 16.3% 46.9%',
  destructive: '0 84.2% 60.2%',
  'destructive-foreground': '210 40% 98%',
  border: '214.3 31.8% 91.4%',
  accent: '210 40% 96%',
  warning: '38 92% 50%',
  info: '199 89% 48%',
  success: '142 76% 36%',
} as const;

/**
 * Determine if the theme is light or dark based on background lightness
 */
export function isLightTheme(backgroundHsl: string | undefined): boolean {
  if (!backgroundHsl) return true;

  const parts = backgroundHsl.split(' ');
  if (parts.length >= 3) {
    const lightness = parseFloat(parts[2].replace('%', ''));
    return lightness > 50;
  }

  return true;
}

/**
 * Extract a color from theme with fallback to defaults
 * Tries multiple key variations for compatibility
 */
export function getThemeColor(
  colors: Record<string, string> | undefined,
  key: keyof typeof DEFAULT_COLORS
): string {
  if (!colors) {
    return hslStringToHex(DEFAULT_COLORS[key]);
  }

  // Try the exact key first
  if (colors[key]) {
    return hslStringToHex(colors[key]);
  }

  // Try without hyphen (e.g., "primaryForeground" for "primary-foreground")
  const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  if (colors[camelKey]) {
    return hslStringToHex(colors[camelKey]);
  }

  // Fallback to default
  return hslStringToHex(DEFAULT_COLORS[key]);
}

/**
 * Safely get a value from an object with fallback
 * Tries multiple key variations
 */
export function safeGet<T>(
  obj: Record<string, T> | undefined,
  keys: string[],
  fallback: T
): T {
  if (!obj) return fallback;

  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }

  return fallback;
}

/**
 * Common extracted colors used by multiple mappers
 */
export interface ExtractedColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  card: string;
  popover: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  accent: string;
  warning: string;
  info: string;
  success: string;
  isLight: boolean;
}

/**
 * Extract all common colors from a theme
 */
export function extractThemeColors(colors: Record<string, string> | undefined): ExtractedColors {
  return {
    primary: getThemeColor(colors, 'primary'),
    primaryForeground: getThemeColor(colors, 'primary-foreground'),
    secondary: getThemeColor(colors, 'secondary'),
    secondaryForeground: getThemeColor(colors, 'secondary-foreground'),
    background: getThemeColor(colors, 'background'),
    foreground: getThemeColor(colors, 'foreground'),
    card: getThemeColor(colors, 'card'),
    popover: getThemeColor(colors, 'popover'),
    muted: getThemeColor(colors, 'muted'),
    mutedForeground: getThemeColor(colors, 'muted-foreground'),
    destructive: getThemeColor(colors, 'destructive'),
    destructiveForeground: getThemeColor(colors, 'destructive-foreground'),
    border: getThemeColor(colors, 'border'),
    accent: getThemeColor(colors, 'accent'),
    warning: getThemeColor(colors, 'warning'),
    info: getThemeColor(colors, 'info'),
    success: getThemeColor(colors, 'success'),
    isLight: isLightTheme(colors?.background),
  };
}
