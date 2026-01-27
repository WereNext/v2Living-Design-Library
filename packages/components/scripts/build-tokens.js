#!/usr/bin/env node

/**
 * Build script to sync tokens from the main Living Design Library app
 * to the Web Components package.
 *
 * This reads design system tokens and generates CSS custom properties
 * in the --ldl-* format for use with LDL Web Components.
 *
 * Usage:
 *   npm run build:styles              # Copy tokens.css from src to dist
 *   npm run build:styles -- --sync    # Generate tokens from data-bridge.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src', 'styles');
const distDir = path.join(__dirname, '..', 'dist', 'styles');
const bridgePath = path.join(__dirname, '..', '..', '..', 'src', 'mcp-server', 'data-bridge.json');

// Check for --sync flag
const shouldSync = process.argv.includes('--sync');

// Ensure dist/styles exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

/**
 * Generate LDL Web Components tokens CSS from a theme
 */
function generateLDLTokensCSS(theme, systemName) {
  const timestamp = new Date().toISOString();

  let css = `/**
 * ${theme.name} - Living Design Library Web Components Tokens
 * Design System: ${systemName}
 * Generated: ${timestamp}
 *
 * Use these tokens with @living-design-library/components
 * Import this file before the component styles to customize your design system.
 */

:root {
`;

  // Colors - convert HSL values to hsl() format
  if (theme.colors) {
    css += '  /* Colors */\n';
    Object.entries(theme.colors).forEach(([key, value]) => {
      const tokenName = `--ldl-color-${key}`;
      // Check if value is in "H S% L%" format (without hsl wrapper)
      const hslValue = value.includes('hsl') ? value : `hsl(${value})`;
      css += `  ${tokenName}: ${hslValue};\n`;
    });
    css += '\n';
  }

  // Spacing
  if (theme.spacing) {
    css += '  /* Spacing */\n';
    Object.entries(theme.spacing).forEach(([key, value]) => {
      css += `  --ldl-space-${key}: ${value};\n`;
    });
    css += '\n';
  }

  // Border Radius
  if (theme.borderRadius) {
    css += '  /* Border Radius */\n';
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      // Normalize key: "radius-sm" -> "sm", keep as-is otherwise
      const normalizedKey = key.replace(/^radius-/, '');
      css += `  --ldl-radius-${normalizedKey}: ${value};\n`;
    });
    // Add full radius for pills/circles
    css += '  --ldl-radius-full: 9999px;\n';
    css += '\n';
  }

  // Typography
  if (theme.typography) {
    css += '  /* Typography */\n';
    Object.entries(theme.typography).forEach(([key, value]) => {
      const normalizedKey = key.replace(/^font-/, '');
      css += `  --ldl-font-${normalizedKey}: ${value};\n`;
    });
    // Add default font sizes
    css += '  --ldl-font-size-xs: 0.75rem;\n';
    css += '  --ldl-font-size-sm: 0.875rem;\n';
    css += '  --ldl-font-size-base: 1rem;\n';
    css += '  --ldl-font-size-lg: 1.125rem;\n';
    css += '  --ldl-font-size-xl: 1.25rem;\n';
    css += '  --ldl-font-size-2xl: 1.5rem;\n';
    css += '  --ldl-font-weight-normal: 400;\n';
    css += '  --ldl-font-weight-medium: 500;\n';
    css += '  --ldl-font-weight-semibold: 600;\n';
    css += '  --ldl-font-weight-bold: 700;\n';
    css += '\n';
  }

  // Shadows
  if (theme.shadows) {
    css += '  /* Shadows */\n';
    Object.entries(theme.shadows).forEach(([key, value]) => {
      // Normalize key: "shadow-sm" -> "sm"
      const normalizedKey = key.replace(/^shadow-/, '');
      css += `  --ldl-shadow-${normalizedKey}: ${value};\n`;
    });
    css += '\n';
  }

  // Transition defaults
  css += '  /* Transitions */\n';
  css += '  --ldl-transition-fast: 150ms ease;\n';
  css += '  --ldl-transition-normal: 200ms ease;\n';
  css += '  --ldl-transition-slow: 300ms ease;\n';

  css += '}\n';

  // Add dark mode variant placeholder
  css += `
/* Dark mode support - customize as needed */
@media (prefers-color-scheme: dark) {
  :root {
    /* Override colors for dark mode here */
  }
}
`;

  return css;
}

// Main build logic
if (shouldSync && fs.existsSync(bridgePath)) {
  // Generate tokens from data-bridge.json
  try {
    const bridgeData = JSON.parse(fs.readFileSync(bridgePath, 'utf-8'));
    const designSystems = bridgeData.designSystems || [];

    if (designSystems.length === 0) {
      console.warn('⚠️  No design systems found in data-bridge.json');
      process.exit(1);
    }

    // Use first design system and its active theme
    const system = designSystems[0];
    const activeTheme = system.themes?.find(t => t.id === system.activeThemeId) || system.themes?.[0];

    if (!activeTheme) {
      console.warn('⚠️  No active theme found in design system');
      process.exit(1);
    }

    const tokensCSS = generateLDLTokensCSS(activeTheme, system.name);

    // Write to both src and dist
    const srcPath = path.join(srcDir, 'tokens.css');
    const distPath = path.join(distDir, 'tokens.css');

    fs.writeFileSync(srcPath, tokensCSS);
    fs.writeFileSync(distPath, tokensCSS);

    console.log(`✅ Generated tokens from "${system.name}" - "${activeTheme.name}"`);
    console.log(`   → ${srcPath}`);
    console.log(`   → ${distPath}`);
  } catch (e) {
    console.error('❌ Failed to generate tokens from data-bridge.json:', e.message);
    process.exit(1);
  }
} else {
  // Standard copy from src to dist
  const tokensSource = path.join(srcDir, 'tokens.css');
  const tokensDest = path.join(distDir, 'tokens.css');

  if (fs.existsSync(tokensSource)) {
    fs.copyFileSync(tokensSource, tokensDest);
    console.log('✅ Copied tokens.css to dist/styles/');
  } else {
    console.warn('⚠️  tokens.css not found in src/styles/');
  }
}

console.log('✅ Token build complete');
