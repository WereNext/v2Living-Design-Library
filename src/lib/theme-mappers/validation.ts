/**
 * Theme Validation Utilities
 * Validates theme structure and provides helpful error messages
 */
import type { Theme } from '../../hooks/useDesignSystems';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  path: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  path: string;
  suggestion?: string;
}

// Required color tokens for a complete theme
const REQUIRED_COLORS = [
  'primary',
  'background',
  'foreground',
] as const;

// Recommended color tokens for better UI library compatibility
const RECOMMENDED_COLORS = [
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
] as const;

// Recommended spacing tokens
const RECOMMENDED_SPACING = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

// Recommended border radius tokens
const RECOMMENDED_RADIUS = ['sm', 'md', 'lg'] as const;

/**
 * Validate a theme structure
 */
export function validateTheme(theme: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check if theme is an object
  if (!theme || typeof theme !== 'object') {
    errors.push({
      code: 'INVALID_THEME',
      message: 'Theme must be an object',
      path: '',
    });
    return { valid: false, errors, warnings };
  }

  const t = theme as Record<string, unknown>;

  // Check for required properties
  if (!t.id || typeof t.id !== 'string') {
    errors.push({
      code: 'MISSING_ID',
      message: 'Theme must have a string id',
      path: 'id',
    });
  }

  if (!t.name || typeof t.name !== 'string') {
    errors.push({
      code: 'MISSING_NAME',
      message: 'Theme must have a string name',
      path: 'name',
    });
  }

  // Validate colors
  if (!t.colors || typeof t.colors !== 'object') {
    errors.push({
      code: 'MISSING_COLORS',
      message: 'Theme must have a colors object',
      path: 'colors',
    });
  } else {
    const colors = t.colors as Record<string, unknown>;

    // Check required colors
    for (const colorKey of REQUIRED_COLORS) {
      if (!colors[colorKey] || typeof colors[colorKey] !== 'string') {
        errors.push({
          code: 'MISSING_REQUIRED_COLOR',
          message: `Missing required color: ${colorKey}`,
          path: `colors.${colorKey}`,
        });
      }
    }

    // Check recommended colors
    for (const colorKey of RECOMMENDED_COLORS) {
      if (!colors[colorKey]) {
        warnings.push({
          code: 'MISSING_RECOMMENDED_COLOR',
          message: `Missing recommended color: ${colorKey}`,
          path: `colors.${colorKey}`,
          suggestion: `Add "${colorKey}" for better UI library compatibility`,
        });
      }
    }

    // Validate color format
    for (const [key, value] of Object.entries(colors)) {
      if (typeof value === 'string') {
        if (!isValidColorFormat(value)) {
          warnings.push({
            code: 'INVALID_COLOR_FORMAT',
            message: `Color "${key}" has an unusual format: ${value}`,
            path: `colors.${key}`,
            suggestion: 'Use HSL (e.g., "221.2 83.2% 53.3%"), hex (e.g., "#6366f1"), or rgb format',
          });
        }
      }
    }
  }

  // Validate spacing (optional but recommended)
  if (!t.spacing || typeof t.spacing !== 'object') {
    warnings.push({
      code: 'MISSING_SPACING',
      message: 'Theme has no spacing tokens',
      path: 'spacing',
      suggestion: 'Add spacing tokens for consistent layout',
    });
  } else {
    const spacing = t.spacing as Record<string, unknown>;
    for (const key of RECOMMENDED_SPACING) {
      const hasKey = spacing[key] || spacing[`space-${key}`] || spacing[`spacing-${key}`];
      if (!hasKey) {
        warnings.push({
          code: 'MISSING_RECOMMENDED_SPACING',
          message: `Missing recommended spacing: ${key}`,
          path: `spacing.${key}`,
        });
      }
    }
  }

  // Validate typography (optional but recommended)
  if (!t.typography || typeof t.typography !== 'object') {
    warnings.push({
      code: 'MISSING_TYPOGRAPHY',
      message: 'Theme has no typography tokens',
      path: 'typography',
      suggestion: 'Add font-family tokens for consistent typography',
    });
  }

  // Validate border radius (optional but recommended)
  if (!t.borderRadius || typeof t.borderRadius !== 'object') {
    warnings.push({
      code: 'MISSING_BORDER_RADIUS',
      message: 'Theme has no border radius tokens',
      path: 'borderRadius',
      suggestion: 'Add border radius tokens for consistent corners',
    });
  } else {
    const borderRadius = t.borderRadius as Record<string, unknown>;
    for (const key of RECOMMENDED_RADIUS) {
      const hasKey = borderRadius[key] || borderRadius[`radius-${key}`];
      if (!hasKey) {
        warnings.push({
          code: 'MISSING_RECOMMENDED_RADIUS',
          message: `Missing recommended border radius: ${key}`,
          path: `borderRadius.${key}`,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if a color string is in a valid format
 */
function isValidColorFormat(color: string): boolean {
  // Hex format
  if (/^#[0-9a-fA-F]{3,8}$/.test(color)) {
    return true;
  }

  // HSL format: hsl(h, s%, l%) or hsl(h s% l%)
  if (/^hsl\([\d.\s,/%]+\)$/i.test(color)) {
    return true;
  }

  // Raw HSL: "h s% l%" (shadcn format)
  if (/^[\d.]+\s+[\d.]+%?\s+[\d.]+%?$/.test(color)) {
    return true;
  }

  // RGB format
  if (/^rgba?\([\d.\s,/%]+\)$/i.test(color)) {
    return true;
  }

  // OKLCH format
  if (/^oklch\([\d.\s,/%]+\)$/i.test(color)) {
    return true;
  }

  return false;
}

/**
 * Safely get a theme value with fallback
 */
export function getThemeValue<T>(
  obj: Record<string, T> | undefined,
  keys: string[],
  fallback: T
): T {
  if (!obj) return fallback;

  for (const key of keys) {
    if (obj[key] !== undefined) {
      return obj[key];
    }
  }

  return fallback;
}

/**
 * Format validation results for display
 */
export function formatValidationResults(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.valid) {
    lines.push('✓ Theme validation passed');
  } else {
    lines.push('✗ Theme validation failed');
  }

  if (result.errors.length > 0) {
    lines.push('');
    lines.push('Errors:');
    for (const error of result.errors) {
      lines.push(`  ✗ [${error.code}] ${error.message}`);
      if (error.path) {
        lines.push(`    at: ${error.path}`);
      }
    }
  }

  if (result.warnings.length > 0) {
    lines.push('');
    lines.push('Warnings:');
    for (const warning of result.warnings) {
      lines.push(`  ⚠ [${warning.code}] ${warning.message}`);
      if (warning.suggestion) {
        lines.push(`    → ${warning.suggestion}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Assert that a theme is valid, throw if not
 */
export function assertValidTheme(theme: unknown): asserts theme is Theme {
  const result = validateTheme(theme);
  if (!result.valid) {
    const errorMessages = result.errors.map(e => e.message).join('; ');
    throw new Error(`Invalid theme: ${errorMessages}`);
  }
}
