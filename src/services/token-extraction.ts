/**
 * Token Extraction Engine
 *
 * Extracts design tokens from various configuration formats:
 * - Tailwind CSS configs
 * - CSS variables
 * - Theme files
 * - Component styles
 */

import { Theme } from '../types';

export interface ExtractedTokens {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
  };
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<string, string>;
}

export class TokenExtractor {
  /**
   * Extract tokens from Tailwind config content
   */
  extractFromTailwind(configContent: string): Partial<ExtractedTokens> {
    try {
      // Remove comments
      const cleaned = configContent.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');

      const tokens: Partial<ExtractedTokens> = {
        colors: {},
        spacing: {},
        typography: {
          fontFamily: {},
          fontSize: {},
          fontWeight: {},
          lineHeight: {},
        },
        borderRadius: {},
        shadows: {},
      };

      // Extract colors from theme.extend.colors or theme.colors
      const colorMatch = cleaned.match(/colors:\s*{([^}]+)}/s);
      if (colorMatch) {
        const colorBlock = colorMatch[1];
        const colorPairs = colorBlock.matchAll(/['"]?(\w+)['"]?\s*:\s*['"]([^'"]+)['"]/g);
        for (const match of colorPairs) {
          tokens.colors![match[1]] = match[2];
        }
      }

      // Extract spacing
      const spacingMatch = cleaned.match(/spacing:\s*{([^}]+)}/s);
      if (spacingMatch) {
        const spacingBlock = spacingMatch[1];
        const spacingPairs = spacingBlock.matchAll(/['"]?(\w+)['"]?\s*:\s*['"]([^'"]+)['"]/g);
        for (const match of spacingPairs) {
          tokens.spacing![match[1]] = match[2];
        }
      }

      // Extract font families
      const fontFamilyMatch = cleaned.match(/fontFamily:\s*{([^}]+)}/s);
      if (fontFamilyMatch) {
        const fontBlock = fontFamilyMatch[1];
        const fontPairs = fontBlock.matchAll(/['"]?(\w+)['"]?\s*:\s*\[([^\]]+)\]/g);
        for (const match of fontPairs) {
          tokens.typography!.fontFamily[match[1]] = match[2];
        }
      }

      // Extract border radius
      const radiusMatch = cleaned.match(/borderRadius:\s*{([^}]+)}/s);
      if (radiusMatch) {
        const radiusBlock = radiusMatch[1];
        const radiusPairs = radiusBlock.matchAll(/['"]?(\w+)['"]?\s*:\s*['"]([^'"]+)['"]/g);
        for (const match of radiusPairs) {
          tokens.borderRadius![match[1]] = match[2];
        }
      }

      return tokens;
    } catch (error) {
      console.error('Error extracting Tailwind tokens:', error);
      return {};
    }
  }

  /**
   * Extract CSS variables from CSS content
   */
  extractFromCSS(cssContent: string): Partial<ExtractedTokens> {
    const tokens: Partial<ExtractedTokens> = {
      colors: {},
      spacing: {},
      typography: {
        fontFamily: {},
        fontSize: {},
        fontWeight: {},
        lineHeight: {},
      },
      borderRadius: {},
      shadows: {},
    };

    try {
      // Find :root block
      const rootMatch = cssContent.match(/:root\s*{([^}]+)}/s);
      if (!rootMatch) return tokens;

      const rootBlock = rootMatch[1];
      const variables = rootBlock.matchAll(/--([^:]+):\s*([^;]+);/g);

      for (const match of variables) {
        const varName = match[1].trim();
        const varValue = match[2].trim();

        // Categorize by variable name
        if (varName.includes('color') || varName.includes('background') || varName.includes('foreground') || varName.includes('border')) {
          tokens.colors![varName] = varValue;
        } else if (varName.includes('spacing') || varName.includes('gap') || varName.includes('padding') || varName.includes('margin')) {
          tokens.spacing![varName] = varValue;
        } else if (varName.includes('font-family')) {
          tokens.typography!.fontFamily[varName] = varValue;
        } else if (varName.includes('font-size')) {
          tokens.typography!.fontSize[varName] = varValue;
        } else if (varName.includes('font-weight')) {
          tokens.typography!.fontWeight[varName] = varValue;
        } else if (varName.includes('line-height')) {
          tokens.typography!.lineHeight[varName] = varValue;
        } else if (varName.includes('radius')) {
          tokens.borderRadius![varName] = varValue;
        } else if (varName.includes('shadow')) {
          tokens.shadows![varName] = varValue;
        }
      }

      return tokens;
    } catch (error) {
      console.error('Error extracting CSS tokens:', error);
      return tokens;
    }
  }

  /**
   * Extract tokens from shadcn/ui globals.css or app.css
   */
  extractFromShadcnCSS(cssContent: string): Partial<ExtractedTokens> {
    const tokens: Partial<ExtractedTokens> = {
      colors: {},
    };

    try {
      // Extract all CSS custom properties from :root and .dark
      const rootMatch = cssContent.match(/:root\s*{([^}]+)}/s);
      const darkMatch = cssContent.match(/\.dark\s*{([^}]+)}/s);

      const extractColors = (block: string, prefix: string = '') => {
        const variables = block.matchAll(/--([^:]+):\s*([^;]+);/g);
        for (const match of variables) {
          const varName = match[1].trim();
          const varValue = match[2].trim();
          tokens.colors![`${prefix}${varName}`] = varValue;
        }
      };

      if (rootMatch) {
        extractColors(rootMatch[1], 'light-');
      }

      if (darkMatch) {
        extractColors(darkMatch[1], 'dark-');
      }

      return tokens;
    } catch (error) {
      console.error('Error extracting shadcn tokens:', error);
      return tokens;
    }
  }

  /**
   * Convert extracted tokens to Theme format
   */
  tokensToTheme(tokens: Partial<ExtractedTokens>, themeName: string): Theme {
    const theme: Theme = {
      id: `imported-${Date.now()}`,
      name: themeName,
      colors: {},
      spacing: {},
      typography: {
        fontFamily: {},
        fontSize: {},
        fontWeight: {},
        lineHeight: {},
      },
      borderRadius: {},
      shadows: {},
    };

    // Map colors
    if (tokens.colors) {
      theme.colors = { ...tokens.colors };
    }

    // Map spacing
    if (tokens.spacing) {
      theme.spacing = { ...tokens.spacing };
    }

    // Map typography
    if (tokens.typography) {
      theme.typography = {
        fontFamily: tokens.typography.fontFamily || {},
        fontSize: tokens.typography.fontSize || {},
        fontWeight: tokens.typography.fontWeight || {},
        lineHeight: tokens.typography.lineHeight || {},
      };
    }

    // Map border radius
    if (tokens.borderRadius) {
      theme.borderRadius = { ...tokens.borderRadius };
    }

    // Map shadows
    if (tokens.shadows) {
      theme.shadows = { ...tokens.shadows };
    }

    return theme;
  }

  /**
   * Merge multiple token sources
   */
  mergeTokens(...tokenSources: Partial<ExtractedTokens>[]): Partial<ExtractedTokens> {
    const merged: Partial<ExtractedTokens> = {
      colors: {},
      spacing: {},
      typography: {
        fontFamily: {},
        fontSize: {},
        fontWeight: {},
        lineHeight: {},
      },
      borderRadius: {},
      shadows: {},
    };

    for (const source of tokenSources) {
      if (source.colors) {
        merged.colors = { ...merged.colors, ...source.colors };
      }
      if (source.spacing) {
        merged.spacing = { ...merged.spacing, ...source.spacing };
      }
      if (source.typography) {
        merged.typography = {
          fontFamily: { ...merged.typography!.fontFamily, ...source.typography.fontFamily },
          fontSize: { ...merged.typography!.fontSize, ...source.typography.fontSize },
          fontWeight: { ...merged.typography!.fontWeight, ...source.typography.fontWeight },
          lineHeight: { ...merged.typography!.lineHeight, ...source.typography.lineHeight },
        };
      }
      if (source.borderRadius) {
        merged.borderRadius = { ...merged.borderRadius, ...source.borderRadius };
      }
      if (source.shadows) {
        merged.shadows = { ...merged.shadows, ...source.shadows };
      }
    }

    return merged;
  }
}

export const tokenExtractor = new TokenExtractor();
