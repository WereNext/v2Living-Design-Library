import { Theme } from "../hooks/useDesignSystems";
import { branding } from "../config";
import { hslStringToHex } from "../lib/theme-mappers/color-utils";

export type ExportFormat =
  | "css"
  | "scss"
  | "tailwind"
  | "json"
  | "ios-swift"
  | "android-xml"
  | "figma-tokens"
  | "ldl-web-components";

/**
 * Convert a color value to hex (uppercase)
 * Uses centralized color-utils for conversion
 */
function toHex(colorValue: string): string {
  return hslStringToHex(colorValue).toUpperCase();
}

/**
 * Convert a color value to RGB components (0-1) for Swift
 */
function toSwiftRgb(colorValue: string): { r: number; g: number; b: number } {
  const hex = toHex(colorValue);
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

// Type for nested token data structure
type TokenData = Theme | TokenRecord;
type TokenRecord = Record<string, string | TokenRecord>;
type TokenValue = string | TokenRecord;

interface ExportOptions {
  theme: Theme;
  changesOnly?: boolean;
  changes?: TokenRecord;
}

export function exportTokens(format: ExportFormat, options: ExportOptions): string {
  const { theme, changesOnly, changes } = options;
  const dataToExport = changesOnly && changes ? changes : theme;

  switch (format) {
    case "css":
      return exportToCSS(dataToExport, theme.name);
    case "scss":
      return exportToSCSS(dataToExport, theme.name);
    case "tailwind":
      return exportToTailwind(dataToExport);
    case "json":
      return exportToJSON(dataToExport);
    case "ios-swift":
      return exportToIOSSwift(dataToExport, theme.name);
    case "android-xml":
      return exportToAndroidXML(dataToExport, theme.name);
    case "figma-tokens":
      return exportToFigmaTokens(dataToExport, theme.name);
    case "ldl-web-components":
      return exportToLDLWebComponents(dataToExport, theme.name);
    default:
      return exportToJSON(dataToExport);
  }
}

function exportToCSS(data: TokenData, themeName: string): string {
  let css = `/* ${themeName} Theme - CSS Variables */\n:root {\n`;

  const processObject = (obj: TokenData, prefix: string = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        processObject(value as TokenRecord, prefix ? `${prefix}-${key}` : key);
      } else if (typeof value === "string") {
        const varName = prefix ? `--${prefix}-${key}` : `--${key}`;
        css += `  ${varName}: ${value};\n`;
      }
    });
  };

  processObject(data);
  css += "}\n";
  return css;
}

function exportToSCSS(data: TokenData, themeName: string): string {
  let scss = `// ${themeName} Theme - SCSS Variables\n\n`;

  const processObject = (obj: TokenData, prefix: string = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        processObject(value as TokenRecord, prefix ? `${prefix}-${key}` : key);
      } else if (typeof value === "string") {
        const varName = prefix ? `$${prefix}-${key}` : `$${key}`;
        scss += `${varName}: ${value};\n`;
      }
    });
  };

  processObject(data);
  return scss;
}

interface TailwindConfig {
  theme: {
    extend: {
      colors?: Record<string, string>;
      spacing?: Record<string, string>;
      borderRadius?: Record<string, string>;
      fontFamily?: Record<string, string>;
      boxShadow?: Record<string, string>;
    };
  };
}

function exportToTailwind(data: TokenData): string {
  const config: TailwindConfig = {
    theme: {
      extend: {}
    }
  };

  const dataRecord = data as Record<string, unknown>;

  if (dataRecord.colors && typeof dataRecord.colors === 'object') {
    config.theme.extend.colors = dataRecord.colors as Record<string, string>;
  }

  if (dataRecord.spacing && typeof dataRecord.spacing === 'object') {
    config.theme.extend.spacing = dataRecord.spacing as Record<string, string>;
  }

  if (dataRecord.borderRadius && typeof dataRecord.borderRadius === 'object') {
    config.theme.extend.borderRadius = dataRecord.borderRadius as Record<string, string>;
  }

  if (dataRecord.typography && typeof dataRecord.typography === 'object') {
    config.theme.extend.fontFamily = dataRecord.typography as Record<string, string>;
  }

  if (dataRecord.shadows && typeof dataRecord.shadows === 'object') {
    config.theme.extend.boxShadow = dataRecord.shadows as Record<string, string>;
  }

  return `// Tailwind CSS Configuration\nmodule.exports = ${JSON.stringify(config, null, 2)}`;
}

function exportToJSON(data: TokenData): string {
  return JSON.stringify(data, null, 2);
}

function exportToIOSSwift(data: TokenData, themeName: string): string {
  const enumName = themeName.replace(/[^a-zA-Z0-9]/g, "");
  let swift = `// ${themeName} Theme - iOS Swift
// ${branding.exportComment}
import SwiftUI
import UIKit

// MARK: - SwiftUI Colors
enum ${enumName}Colors {
`;
  const dataRecord = data as Record<string, unknown>;

  if (dataRecord.colors && typeof dataRecord.colors === 'object') {
    Object.entries(dataRecord.colors as Record<string, string>).forEach(([key, value]) => {
      const colorName = key.replace(/-/g, "_").replace(/^(\d)/, '_$1');
      const { r, g, b } = toSwiftRgb(value);
      swift += `    static let ${colorName} = Color(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)})\n`;
    });
  }

  swift += `}

// MARK: - UIKit Colors
enum ${enumName}UIColors {
`;

  if (dataRecord.colors && typeof dataRecord.colors === 'object') {
    Object.entries(dataRecord.colors as Record<string, string>).forEach(([key, value]) => {
      const colorName = key.replace(/-/g, "_").replace(/^(\d)/, '_$1');
      const { r, g, b } = toSwiftRgb(value);
      swift += `    static let ${colorName} = UIColor(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)}, alpha: 1.0)\n`;
    });
  }

  swift += `}

// MARK: - Spacing
enum ${enumName}Spacing {
`;

  if (dataRecord.spacing && typeof dataRecord.spacing === 'object') {
    Object.entries(dataRecord.spacing as Record<string, string>).forEach(([key, value]) => {
      const spacingName = key.replace(/-/g, "_").replace(/^(\d)/, '_$1');
      // Parse rem/px values
      let numValue = parseFloat(value) || 0;
      if (value.includes('rem')) {
        numValue = numValue * 16; // Convert rem to px
      }
      swift += `    static let ${spacingName}: CGFloat = ${numValue}\n`;
    });
  }

  swift += `}

// MARK: - Border Radius
enum ${enumName}Radius {
`;

  if (dataRecord.borderRadius && typeof dataRecord.borderRadius === 'object') {
    Object.entries(dataRecord.borderRadius as Record<string, string>).forEach(([key, value]) => {
      const radiusName = key.replace(/-/g, "_").replace(/^(\d)/, '_$1').replace('radius_', '');
      let numValue = parseFloat(value) || 0;
      if (value.includes('rem')) {
        numValue = numValue * 16;
      }
      swift += `    static let ${radiusName}: CGFloat = ${numValue}\n`;
    });
  }

  swift += `}

// MARK: - Typography
enum ${enumName}Typography {
`;

  if (dataRecord.typography && typeof dataRecord.typography === 'object') {
    Object.entries(dataRecord.typography as Record<string, string>).forEach(([key, value]) => {
      const typeName = key.replace(/-/g, "_").replace(/^(\d)/, '_$1');
      // Font family values
      if (key.includes('font')) {
        swift += `    static let ${typeName} = "${value}"\n`;
      }
    });
  }

  swift += `}
`;
  return swift;
}

function exportToAndroidXML(data: TokenData, themeName: string): string {
  const dataRecord = data as Record<string, unknown>;

  // Colors file
  let colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<!-- ${themeName} Theme - Android Colors -->
<!-- ${branding.exportComment} -->
<resources>
`;

  if (dataRecord.colors && typeof dataRecord.colors === 'object') {
    Object.entries(dataRecord.colors as Record<string, string>).forEach(([key, value]) => {
      const colorName = key.replace(/-/g, "_");
      const hexColor = toHex(value);
      colorsXml += `    <color name="${colorName}">${hexColor}</color>\n`;
    });
  }

  colorsXml += `</resources>`;

  // Dimens file
  let dimensXml = `

<!-- ${themeName} Theme - Android Dimensions -->
<!-- Save this as res/values/dimens.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
`;

  if (dataRecord.spacing && typeof dataRecord.spacing === 'object') {
    dimensXml += "    <!-- Spacing -->\n";
    Object.entries(dataRecord.spacing as Record<string, string>).forEach(([key, value]) => {
      const spacingName = key.replace(/-/g, "_");
      // Convert rem to dp (assuming 1rem = 16dp)
      let dpValue = value;
      if (value.includes('rem')) {
        const remVal = parseFloat(value);
        dpValue = `${remVal * 16}dp`;
      } else if (value.includes('px')) {
        const pxVal = parseFloat(value);
        dpValue = `${pxVal}dp`;
      } else if (!value.includes('dp')) {
        dpValue = `${parseFloat(value) || 0}dp`;
      }
      dimensXml += `    <dimen name="spacing_${spacingName}">${dpValue}</dimen>\n`;
    });
  }

  if (dataRecord.borderRadius && typeof dataRecord.borderRadius === 'object') {
    dimensXml += "\n    <!-- Corner Radius -->\n";
    Object.entries(dataRecord.borderRadius as Record<string, string>).forEach(([key, value]) => {
      const radiusName = key.replace(/-/g, "_").replace('radius_', '');
      let dpValue = value;
      if (value.includes('rem')) {
        const remVal = parseFloat(value);
        dpValue = `${remVal * 16}dp`;
      } else if (value.includes('px')) {
        const pxVal = parseFloat(value);
        dpValue = `${pxVal}dp`;
      } else if (!value.includes('dp')) {
        dpValue = `${parseFloat(value) || 0}dp`;
      }
      dimensXml += `    <dimen name="radius_${radiusName}">${dpValue}</dimen>\n`;
    });
  }

  dimensXml += `</resources>`;

  // Theme style file
  let themeXml = `

<!-- ${themeName} Theme - Android Theme Style -->
<!-- Save this as res/values/themes.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="${themeName.replace(/[^a-zA-Z0-9]/g, '')}Theme" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <!-- Primary brand color -->
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryVariant">@color/primary</item>
        <item name="colorOnPrimary">@color/primary_foreground</item>

        <!-- Secondary brand color -->
        <item name="colorSecondary">@color/secondary</item>
        <item name="colorSecondaryVariant">@color/secondary</item>
        <item name="colorOnSecondary">@color/secondary_foreground</item>

        <!-- Background -->
        <item name="android:colorBackground">@color/background</item>
        <item name="colorSurface">@color/card</item>
        <item name="colorOnSurface">@color/foreground</item>

        <!-- Error -->
        <item name="colorError">@color/destructive</item>
        <item name="colorOnError">@color/destructive_foreground</item>
    </style>
</resources>`;

  return colorsXml + dimensXml + themeXml;
}

interface FigmaToken {
  value: string;
  type: string;
}

type FigmaTokenCategory = Record<string, FigmaToken>;
type FigmaTokenTheme = Record<string, FigmaTokenCategory>;
type FigmaTokensOutput = Record<string, FigmaTokenTheme>;

function exportToFigmaTokens(data: TokenData, themeName: string): string {
  const figmaTokens: FigmaTokensOutput = {
    [themeName]: {}
  };

  const convertToFigmaFormat = (obj: Record<string, string>, category: string): FigmaTokenCategory => {
    const result: FigmaTokenCategory = {};
    Object.entries(obj).forEach(([key, value]) => {
      result[key] = {
        value: value,
        type: getCategoryType(category)
      };
    });
    return result;
  };

  const getCategoryType = (category: string): string => {
    const typeMap: Record<string, string> = {
      colors: "color",
      spacing: "spacing",
      borderRadius: "borderRadius",
      typography: "fontFamily",
      shadows: "boxShadow",
      opacity: "opacity"
    };
    return typeMap[category] || "other";
  };

  Object.entries(data).forEach(([category, values]) => {
    if (typeof values === "object" && values !== null && !Array.isArray(values)) {
      figmaTokens[themeName][category] = convertToFigmaFormat(values as Record<string, string>, category);
    }
  });

  return JSON.stringify(figmaTokens, null, 2);
}

/**
 * Export tokens in LDL Web Components format
 * Generates CSS custom properties with --ldl-* prefix for use with
 * @living-design-library/components Web Components package
 */
function exportToLDLWebComponents(data: TokenData, themeName: string): string {
  const dataRecord = data as Record<string, unknown>;
  const timestamp = new Date().toISOString();

  let css = `/**
 * ${themeName} - Living Design Library Web Components Tokens
 * Generated: ${timestamp}
 *
 * Use these tokens with @living-design-library/components
 * Import this file before the component styles to customize your design system.
 */

:root {
`;

  // Colors - convert HSL values to hsl() format
  if (dataRecord.colors && typeof dataRecord.colors === 'object') {
    css += '  /* Colors */\n';
    Object.entries(dataRecord.colors as Record<string, string>).forEach(([key, value]) => {
      const tokenName = `--ldl-color-${key}`;
      // Check if value is in "H S% L%" format (without hsl wrapper)
      const hslValue = value.includes('hsl') ? value : `hsl(${value})`;
      css += `  ${tokenName}: ${hslValue};\n`;
    });
    css += '\n';
  }

  // Spacing
  if (dataRecord.spacing && typeof dataRecord.spacing === 'object') {
    css += '  /* Spacing */\n';
    Object.entries(dataRecord.spacing as Record<string, string>).forEach(([key, value]) => {
      css += `  --ldl-space-${key}: ${value};\n`;
    });
    css += '\n';
  }

  // Border Radius
  if (dataRecord.borderRadius && typeof dataRecord.borderRadius === 'object') {
    css += '  /* Border Radius */\n';
    Object.entries(dataRecord.borderRadius as Record<string, string>).forEach(([key, value]) => {
      // Normalize key: "radius-sm" -> "sm", keep as-is otherwise
      const normalizedKey = key.replace(/^radius-/, '');
      css += `  --ldl-radius-${normalizedKey}: ${value};\n`;
    });
    // Add full radius for pills/circles
    css += '  --ldl-radius-full: 9999px;\n';
    css += '\n';
  }

  // Typography
  if (dataRecord.typography && typeof dataRecord.typography === 'object') {
    css += '  /* Typography */\n';
    Object.entries(dataRecord.typography as Record<string, string>).forEach(([key, value]) => {
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
  if (dataRecord.shadows && typeof dataRecord.shadows === 'object') {
    css += '  /* Shadows */\n';
    Object.entries(dataRecord.shadows as Record<string, string>).forEach(([key, value]) => {
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

  // Add dark mode variant if applicable (check for dark-themed colors)
  const isDarkTheme = themeName.toLowerCase().includes('dark') ||
    themeName.toLowerCase().includes('midnight') ||
    themeName.toLowerCase().includes('cyber');

  if (!isDarkTheme && dataRecord.colors) {
    css += `
/* Dark mode support - customize as needed */
@media (prefers-color-scheme: dark) {
  :root {
    /* Override colors for dark mode here */
  }
}
`;
  }

  return css;
}

export function downloadTokens(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
