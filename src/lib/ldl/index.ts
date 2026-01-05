/**
 * LDL - Living Design Library Token System
 *
 * A tool-agnostic, CSS-native design token specification
 *
 * @version 1.0.0
 * @see https://ldl.dev/spec
 */

// Types
export * from './types';

// Parser
export {
  parse,
  parseOrThrow,
  tryParse,
  detectFormat
} from './parser';

// Validator
export {
  validate,
  isValid,
  getErrors,
  formatIssues
} from './validator';

// Generator
export {
  generate,
  toCSS,
  toTailwind,
  toTypeScript
} from './generator';

// =============================================================================
// Convenience API
// =============================================================================

import { parse, ParseResult } from './parser';
import { validate, ValidationResult } from './validator';
import { generate, GeneratorResult, GeneratorOptions } from './generator';
import { LDLTokenDocument, OutputFormat } from './types';

/**
 * Parse, validate, and generate in one call
 */
export function processTokens(
  input: string | object,
  outputFormat: OutputFormat = 'css'
): {
  parseResult: ParseResult;
  validationResult?: ValidationResult;
  generatorResult?: GeneratorResult;
} {
  // Parse
  const parseResult = parse(input);
  if (!parseResult.success || !parseResult.document) {
    return { parseResult };
  }

  // Validate
  const validationResult = validate(parseResult.document);

  // Generate (even if there are warnings)
  let generatorResult: GeneratorResult | undefined;
  if (validationResult.valid || !validationResult.issues.some(i => i.severity === 'error')) {
    generatorResult = generate(parseResult.document, { format: outputFormat });
  }

  return {
    parseResult,
    validationResult,
    generatorResult
  };
}

/**
 * Quick convert: input -> CSS
 */
export function convertToCSS(input: string | object): string {
  const result = processTokens(input, 'css');
  if (result.generatorResult?.success) {
    return result.generatorResult.output;
  }
  throw new Error(
    result.parseResult.errors.join(', ') ||
    result.validationResult?.issues.map(i => i.message).join(', ') ||
    'Conversion failed'
  );
}

/**
 * Quick convert: input -> Tailwind config
 */
export function convertToTailwind(input: string | object): string {
  const result = processTokens(input, 'tailwind-config');
  if (result.generatorResult?.success) {
    return result.generatorResult.output;
  }
  throw new Error(
    result.parseResult.errors.join(', ') ||
    result.validationResult?.issues.map(i => i.message).join(', ') ||
    'Conversion failed'
  );
}

/**
 * Create a minimal valid LDL document
 */
export function createDocument(name: string, options?: {
  description?: string;
  version?: string;
}): LDLTokenDocument {
  return {
    $schema: 'https://ldl.dev/schema/v1',
    $name: name,
    $description: options?.description,
    $version: options?.version || '1.0.0',
    color: {
      primary: { value: '#3b82f6', foreground: '#ffffff' },
      background: { value: '#ffffff', foreground: '#0a0a0a' }
    },
    space: {
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '4': '1rem',
      '8': '2rem'
    },
    radius: {
      none: '0',
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px'
    }
  };
}

/**
 * Merge two LDL documents (second overrides first)
 */
export function mergeDocuments(
  base: LDLTokenDocument,
  override: Partial<LDLTokenDocument>
): LDLTokenDocument {
  return {
    ...base,
    ...override,
    $name: override.$name || base.$name,
    color: { ...base.color, ...override.color },
    space: { ...base.space, ...override.space },
    radius: { ...base.radius, ...override.radius },
    shadow: { ...base.shadow, ...override.shadow },
    font: base.font || override.font ? {
      family: { ...base.font?.family, ...override.font?.family },
      size: { ...base.font?.size, ...override.font?.size },
      weight: { ...base.font?.weight, ...override.font?.weight },
      leading: { ...base.font?.leading, ...override.font?.leading },
      tracking: { ...base.font?.tracking, ...override.font?.tracking }
    } : undefined,
    duration: { ...base.duration, ...override.duration },
    ease: { ...base.ease, ...override.ease },
    mode: { ...base.mode, ...override.mode }
  };
}
