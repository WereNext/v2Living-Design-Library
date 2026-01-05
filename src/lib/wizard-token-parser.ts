import type { DesignTokens } from "../types/design-tokens";

interface ParseResult {
  success: boolean;
  tokens?: DesignTokens;
  error?: string;
}

/**
 * Extracts token values from various formats (string, object with .value)
 */
function extractTokenValues(
  obj: Record<string, unknown>
): Record<string, string> {
  const result: Record<string, string> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      result[key] = value;
    } else if (value && typeof value === 'object' && 'value' in value) {
      const v = (value as { value: unknown }).value;
      if (typeof v === 'string') {
        result[key] = v;
      }
    }
  });

  return result;
}

/**
 * Parses JSON input and transforms it to our DesignTokens format.
 * Supports multiple input formats including Figma-style tokens.
 */
export function parseJsonToTokens(jsonString: string): ParseResult {
  try {
    const parsed = JSON.parse(jsonString);

    if (typeof parsed !== 'object' || parsed === null) {
      return { success: false, error: 'Invalid JSON structure' };
    }

    const tokens: DesignTokens = {};

    // Handle colors (supports: colors, color)
    const colorObj = parsed.colors || parsed.color;
    if (colorObj && typeof colorObj === 'object') {
      tokens.colors = extractTokenValues(colorObj);
    }

    // Handle typography (supports: typography, fontSize)
    const typoObj = parsed.typography || parsed.fontSize;
    if (typoObj && typeof typoObj === 'object') {
      tokens.typography = extractTokenValues(typoObj);
    }

    // Handle spacing (supports: spacing, space)
    const spacingObj = parsed.spacing || parsed.space;
    if (spacingObj && typeof spacingObj === 'object') {
      tokens.spacing = extractTokenValues(spacingObj);
    }

    // Handle border radius (supports: borderRadius, radii)
    const radiusObj = parsed.borderRadius || parsed.radii;
    if (radiusObj && typeof radiusObj === 'object') {
      tokens.borderRadius = extractTokenValues(radiusObj);
    }

    // Handle shadows (supports: shadows, boxShadow)
    const shadowObj = parsed.shadows || parsed.boxShadow;
    if (shadowObj && typeof shadowObj === 'object') {
      tokens.shadows = extractTokenValues(shadowObj);
    }

    return { success: true, tokens };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON format';
    return { success: false, error: message };
  }
}

/**
 * Validates that tokens have at least some content
 */
export function hasTokenContent(tokens: DesignTokens | null): boolean {
  if (!tokens) return false;

  return Object.values(tokens).some(
    category => category && Object.keys(category).length > 0
  );
}

/**
 * Gets a summary of token counts by category
 */
export function getTokenSummary(tokens: DesignTokens): Record<string, number> {
  return {
    colors: Object.keys(tokens.colors || {}).length,
    spacing: Object.keys(tokens.spacing || {}).length,
    typography: Object.keys(tokens.typography || {}).length,
    borderRadius: Object.keys(tokens.borderRadius || {}).length,
    shadows: Object.keys(tokens.shadows || {}).length,
  };
}
