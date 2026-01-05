/**
 * LDL Token System Tests
 *
 * Tests for parser, validator, and generator
 */

import { describe, it, expect } from 'vitest';
import {
  parse,
  parseOrThrow,
  detectFormat,
  validate,
  isValid,
  getErrors,
  formatIssues,
  generate,
  toCSS,
  toTailwind,
  processTokens,
  convertToCSS,
  createDocument,
  mergeDocuments,
  LDLTokenDocument,
  ValidationIssue
} from '../lib/ldl';

// =============================================================================
// Parser Tests
// =============================================================================

describe('LDL Parser', () => {
  describe('detectFormat', () => {
    it('detects LDL format', () => {
      const input = {
        $name: 'Test',
        color: { primary: { value: '#000', foreground: '#fff' } }
      };
      expect(detectFormat(input)).toBe('ldl');
    });

    it('detects W3C DTCG format', () => {
      const input = {
        color: {
          primary: { $value: '#000', $type: 'color' }
        }
      };
      expect(detectFormat(input)).toBe('w3c-dtcg');
    });

    it('detects Figma Variables format', () => {
      const input = {
        meta: {
          variables: {
            'var1': { name: 'primary', resolvedType: 'COLOR', valuesByMode: {} }
          }
        }
      };
      expect(detectFormat(input)).toBe('figma-variables');
    });

    it('detects Tokens Studio format', () => {
      const input = {
        $themes: [],
        global: { colors: { primary: { value: '#000', type: 'color' } } }
      };
      expect(detectFormat(input)).toBe('tokens-studio');
    });

    it('detects Style Dictionary format', () => {
      const input = {
        color: {
          primary: { value: '#000' }
        }
      };
      expect(detectFormat(input)).toBe('style-dictionary');
    });

    it('returns unknown for invalid input', () => {
      expect(detectFormat(null)).toBe('unknown');
      expect(detectFormat(undefined)).toBe('unknown');
      expect(detectFormat('string')).toBe('unknown');
    });
  });

  describe('parse', () => {
    it('parses valid LDL JSON string', () => {
      const input = JSON.stringify({
        $name: 'Test System',
        color: {
          primary: { value: '#3b82f6', foreground: '#ffffff' }
        }
      });

      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.format).toBe('ldl');
      expect(result.document?.$name).toBe('Test System');
      expect(result.document?.color?.primary).toEqual({
        value: '#3b82f6',
        foreground: '#ffffff'
      });
    });

    it('parses valid LDL object', () => {
      const input = {
        $name: 'Test',
        space: { '4': '1rem' }
      };

      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.document?.space?.['4']).toBe('1rem');
    });

    it('handles invalid JSON string', () => {
      const result = parse('not valid json');
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('converts W3C DTCG to LDL', () => {
      const input = {
        'color-primary': {
          $value: '#3b82f6',
          $type: 'color'
        },
        'space-4': {
          $value: '1rem',
          $type: 'dimension'
        }
      };

      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.format).toBe('w3c-dtcg');
      expect(result.document?.color?.['color-primary']).toBeDefined();
    });

    it('converts Tokens Studio to LDL', () => {
      const input = {
        $themes: [],
        global: {
          colors: {
            primary: { value: '#3b82f6', type: 'color' }
          },
          spacing: {
            md: { value: '1rem', type: 'spacing' }
          }
        }
      };

      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.format).toBe('tokens-studio');
    });
  });

  describe('parseOrThrow', () => {
    it('returns document for valid input', () => {
      const doc = parseOrThrow({ $name: 'Test', color: {} });
      expect(doc.$name).toBe('Test');
    });

    it('throws for invalid input', () => {
      expect(() => parseOrThrow('invalid')).toThrow();
    });
  });
});

// =============================================================================
// Validator Tests
// =============================================================================

describe('LDL Validator', () => {
  describe('validate', () => {
    it('validates minimal valid document', () => {
      const doc: LDLTokenDocument = {
        $name: 'Test'
      };

      const result = validate(doc);
      expect(result.valid).toBe(true);
    });

    it('requires $name', () => {
      const doc = {} as LDLTokenDocument;

      const result = validate(doc);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.path === '$name')).toBe(true);
    });

    it('validates color tokens', () => {
      const doc: LDLTokenDocument = {
        $name: 'Test',
        color: {
          primary: { value: '#3b82f6', foreground: '#ffffff' },
          border: '#e4e4e7'
        }
      };

      const result = validate(doc);
      expect(result.valid).toBe(true);
    });

    it('warns about missing foreground on background colors', () => {
      const doc: LDLTokenDocument = {
        $name: 'Test',
        color: {
          primary: '#3b82f6' // Should have foreground
        }
      };

      const result = validate(doc);
      expect(result.issues.some(i =>
        i.severity === 'warning' &&
        i.message.includes('foreground')
      )).toBe(true);
    });

    it('errors on invalid color values', () => {
      const doc: LDLTokenDocument = {
        $name: 'Test',
        color: {
          primary: { value: 'not-a-color', foreground: '#fff' }
        }
      };

      const result = validate(doc);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i =>
        i.severity === 'error' &&
        i.message.includes('Invalid color')
      )).toBe(true);
    });

    it('validates semver format', () => {
      const doc: LDLTokenDocument = {
        $name: 'Test',
        $version: 'not-semver'
      };

      const result = validate(doc);
      expect(result.issues.some(i =>
        i.severity === 'warning' &&
        i.message.includes('semver')
      )).toBe(true);
    });

    it('validates token names', () => {
      const doc: LDLTokenDocument = {
        $name: 'Test',
        color: {
          '$invalid': '#fff',
          'has.dot': '#fff',
          'has{brace': '#fff'
        } as any
      };

      const result = validate(doc);
      expect(result.issues.filter(i => i.severity === 'error').length).toBeGreaterThanOrEqual(3);
    });

    it('validates mode overrides', () => {
      const doc: LDLTokenDocument = {
        $name: 'Test',
        color: {
          primary: { value: '#000', foreground: '#fff' }
        },
        mode: {
          dark: {
            color: {
              primary: { value: '#fff', foreground: '#000' },
              nonexistent: { value: '#000', foreground: '#fff' } // Doesn't exist in base
            }
          }
        }
      };

      const result = validate(doc);
      expect(result.issues.some(i =>
        i.severity === 'warning' &&
        i.message.includes('nonexistent')
      )).toBe(true);
    });

    it('validates token references', () => {
      const doc: LDLTokenDocument = {
        $name: 'Test',
        color: {
          primary: { value: '#3b82f6', foreground: '#fff' },
          link: '{color.nonexistent}' as any
        }
      };

      const result = validate(doc);
      expect(result.issues.some(i =>
        i.severity === 'error' &&
        i.message.includes('non-existent')
      )).toBe(true);
    });
  });

  describe('isValid', () => {
    it('returns true for valid document', () => {
      expect(isValid({ $name: 'Test' })).toBe(true);
    });

    it('returns false for invalid document', () => {
      expect(isValid({} as LDLTokenDocument)).toBe(false);
    });
  });

  describe('getErrors', () => {
    it('returns only errors', () => {
      const doc: LDLTokenDocument = {
        $name: 'Test',
        color: {
          primary: '#3b82f6' // Warning, not error
        }
      };

      const errors = getErrors(doc);
      expect(errors.every(e => e.severity === 'error')).toBe(true);
    });
  });

  describe('formatIssues', () => {
    it('formats issues as readable string', () => {
      const issues: ValidationIssue[] = [
        { severity: 'error', path: 'color.primary', message: 'Invalid color' },
        { severity: 'warning', path: 'space.4', message: 'Unusual value', suggestion: 'Use rem' }
      ];

      const formatted = formatIssues(issues);
      expect(formatted).toContain('❌');
      expect(formatted).toContain('⚠️');
      expect(formatted).toContain('Invalid color');
      expect(formatted).toContain('Use rem');
    });
  });
});

// =============================================================================
// Generator Tests
// =============================================================================

describe('LDL Generator', () => {
  const testDoc: LDLTokenDocument = {
    $name: 'Test System',
    $description: 'A test design system',
    $version: '1.0.0',
    color: {
      primary: { value: '#3b82f6', foreground: '#ffffff' },
      background: { value: '#ffffff', foreground: '#0a0a0a' },
      border: '#e4e4e7'
    },
    space: {
      '0': '0',
      '4': '1rem',
      '8': '2rem'
    },
    radius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem'
    },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    },
    font: {
      family: {
        sans: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, monospace'
      },
      size: {
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem'
      }
    },
    duration: {
      fast: '100ms',
      normal: '200ms'
    },
    ease: {
      out: 'cubic-bezier(0, 0, 0.2, 1)'
    },
    mode: {
      dark: {
        color: {
          background: { value: '#0a0a0a', foreground: '#fafafa' }
        }
      }
    }
  };

  describe('generate CSS', () => {
    it('generates valid CSS variables', () => {
      const result = generate(testDoc, { format: 'css' });

      expect(result.success).toBe(true);
      expect(result.output).toContain(':root {');
      expect(result.output).toContain('--color-primary: #3b82f6');
      expect(result.output).toContain('--color-primary-foreground: #ffffff');
      expect(result.output).toContain('--space-4: 1rem');
      expect(result.output).toContain('--radius-md: 0.375rem');
      expect(result.output).toContain('--shadow-sm:');
      expect(result.output).toContain('--font-family-sans:');
    });

    it('generates mode overrides', () => {
      const result = generate(testDoc, { format: 'css', includeModes: true });

      expect(result.output).toContain('.dark {');
      expect(result.output).toContain('--color-background: #0a0a0a');
    });

    it('supports custom prefix', () => {
      const result = generate(testDoc, { format: 'css', prefix: 'ldl-' });

      expect(result.output).toContain('--ldl-color-primary');
      expect(result.output).toContain('--ldl-space-4');
    });

    it('supports data-attribute mode selector', () => {
      const result = generate(testDoc, {
        format: 'css',
        modeSelector: 'data-attribute'
      });

      expect(result.output).toContain('[data-mode="dark"]');
    });

    it('can exclude comments', () => {
      const result = generate(testDoc, { format: 'css', includeComments: false });

      expect(result.output).not.toContain('/* Colors */');
      expect(result.output).not.toContain('/* Spacing */');
    });
  });

  describe('generate SCSS', () => {
    it('generates SCSS variables', () => {
      const result = generate(testDoc, { format: 'scss' });

      expect(result.success).toBe(true);
      expect(result.output).toContain('$color-primary: #3b82f6');
      expect(result.output).toContain('$space-4: 1rem');
    });
  });

  describe('generate Tailwind config', () => {
    it('generates valid Tailwind config', () => {
      const result = generate(testDoc, { format: 'tailwind-config' });

      expect(result.success).toBe(true);
      expect(result.output).toContain('module.exports');
      expect(result.output).toContain('"extend"');
      expect(result.output).toContain('"colors"');

      // Should be valid JS (basic check)
      expect(result.output).toContain('{');
      expect(result.output).toContain('}');
    });
  });

  describe('generate Tailwind v4 CSS', () => {
    it('generates @theme directive', () => {
      const result = generate(testDoc, { format: 'tailwind-css' });

      expect(result.success).toBe(true);
      expect(result.output).toContain('@import "tailwindcss"');
      expect(result.output).toContain('@theme {');
      expect(result.output).toContain('--color-primary:');
      expect(result.output).toContain('--spacing-4:');
    });
  });

  describe('generate TypeScript', () => {
    it('generates typed token object', () => {
      const result = generate(testDoc, { format: 'typescript' });

      expect(result.success).toBe(true);
      expect(result.output).toContain('export const tokens');
      expect(result.output).toContain('as const');
      expect(result.output).toContain('color:');
      expect(result.output).toContain('space:');
    });
  });

  describe('generate iOS Swift', () => {
    it('generates Swift UIColor definitions', () => {
      const result = generate(testDoc, { format: 'ios-swift' });

      expect(result.success).toBe(true);
      expect(result.output).toContain('import UIKit');
      expect(result.output).toContain('enum');
      expect(result.output).toContain('UIColor(red:');
      expect(result.output).toContain('CGFloat');
    });
  });

  describe('generate Android XML', () => {
    it('generates Android resource XML', () => {
      const result = generate(testDoc, { format: 'android-xml' });

      expect(result.success).toBe(true);
      expect(result.output).toContain('<?xml');
      expect(result.output).toContain('<resources>');
      expect(result.output).toContain('<color name=');
      expect(result.output).toContain('<dimen name=');
    });
  });

  describe('generate W3C DTCG', () => {
    it('generates W3C-compliant JSON', () => {
      const result = generate(testDoc, { format: 'w3c-dtcg' });

      expect(result.success).toBe(true);

      const parsed = JSON.parse(result.output);
      expect(parsed.color.primary.$value).toBe('#3b82f6');
      expect(parsed.color.primary.$type).toBe('color');
      expect(parsed.space['4'].$value).toBe('1rem');
      expect(parsed.space['4'].$type).toBe('dimension');
    });
  });

  describe('toCSS helper', () => {
    it('generates CSS directly', () => {
      const css = toCSS(testDoc);
      expect(css).toContain(':root');
      expect(css).toContain('--color-primary');
    });
  });

  describe('toTailwind helper', () => {
    it('generates Tailwind config directly', () => {
      const config = toTailwind(testDoc);
      expect(config).toContain('module.exports');
    });
  });
});

// =============================================================================
// Integration Tests
// =============================================================================

describe('LDL Integration', () => {
  describe('processTokens', () => {
    it('parses, validates, and generates in one call', () => {
      const input = {
        $name: 'Integration Test',
        color: {
          primary: { value: '#3b82f6', foreground: '#ffffff' }
        }
      };

      const result = processTokens(input, 'css');

      expect(result.parseResult.success).toBe(true);
      expect(result.validationResult?.valid).toBe(true);
      expect(result.generatorResult?.success).toBe(true);
      expect(result.generatorResult?.output).toContain('--color-primary');
    });

    it('handles invalid input', () => {
      const result = processTokens('not valid json');

      expect(result.parseResult.success).toBe(false);
      expect(result.validationResult).toBeUndefined();
      expect(result.generatorResult).toBeUndefined();
    });
  });

  describe('convertToCSS', () => {
    it('converts valid input to CSS', () => {
      const input = {
        $name: 'Test',
        color: { primary: { value: '#000', foreground: '#fff' } }
      };

      const css = convertToCSS(input);
      expect(css).toContain('--color-primary');
    });

    it('throws on invalid input', () => {
      expect(() => convertToCSS('invalid')).toThrow();
    });
  });

  describe('createDocument', () => {
    it('creates minimal valid document', () => {
      const doc = createDocument('My System');

      expect(doc.$name).toBe('My System');
      expect(doc.color?.primary).toBeDefined();
      expect(doc.space).toBeDefined();
      expect(isValid(doc)).toBe(true);
    });

    it('accepts options', () => {
      const doc = createDocument('My System', {
        description: 'Test description',
        version: '2.0.0'
      });

      expect(doc.$description).toBe('Test description');
      expect(doc.$version).toBe('2.0.0');
    });
  });

  describe('mergeDocuments', () => {
    it('merges two documents', () => {
      const base: LDLTokenDocument = {
        $name: 'Base',
        color: {
          primary: { value: '#000', foreground: '#fff' },
          secondary: { value: '#333', foreground: '#fff' }
        },
        space: { '4': '1rem' }
      };

      const override: Partial<LDLTokenDocument> = {
        color: {
          primary: { value: '#3b82f6', foreground: '#ffffff' }
        },
        space: { '8': '2rem' }
      };

      const merged = mergeDocuments(base, override);

      expect(merged.$name).toBe('Base');
      expect(merged.color?.primary).toEqual({ value: '#3b82f6', foreground: '#ffffff' });
      expect(merged.color?.secondary).toEqual({ value: '#333', foreground: '#fff' });
      expect(merged.space?.['4']).toBe('1rem');
      expect(merged.space?.['8']).toBe('2rem');
    });
  });
});

// =============================================================================
// Format Conversion Tests
// =============================================================================

describe('Format Conversions', () => {
  it('W3C DTCG -> LDL -> CSS roundtrip', () => {
    const w3cInput = {
      color: {
        primary: { $value: '#3b82f6', $type: 'color' }
      },
      spacing: {
        md: { $value: '1rem', $type: 'dimension' }
      }
    };

    const parseResult = parse(w3cInput);
    expect(parseResult.success).toBe(true);
    expect(parseResult.format).toBe('w3c-dtcg');

    const css = toCSS(parseResult.document!);
    expect(css).toContain('--color');
  });

  it('Tokens Studio -> LDL -> Tailwind roundtrip', () => {
    const tsInput = {
      $themes: [],
      global: {
        colors: {
          brand: { value: '#ff0000', type: 'color' }
        }
      }
    };

    const parseResult = parse(tsInput);
    expect(parseResult.success).toBe(true);

    const tailwind = toTailwind(parseResult.document!);
    expect(tailwind).toContain('colors');
  });

  it('LDL -> W3C DTCG export', () => {
    const ldlDoc: LDLTokenDocument = {
      $name: 'Test',
      color: {
        primary: { value: '#3b82f6', foreground: '#ffffff' }
      },
      space: { '4': '1rem' }
    };

    const result = generate(ldlDoc, { format: 'w3c-dtcg' });
    const parsed = JSON.parse(result.output);

    expect(parsed.color.primary.$value).toBe('#3b82f6');
    expect(parsed.color.primary.$type).toBe('color');
    expect(parsed.space['4'].$type).toBe('dimension');
  });
});
