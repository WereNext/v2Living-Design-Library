import { Theme } from "../hooks/useDesignSystems";

export type ExportFormat =
  | "css"
  | "scss"
  | "tailwind"
  | "json"
  | "ios-swift"
  | "android-xml"
  | "figma-tokens";

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
  let swift = `// ${themeName} Theme - iOS Swift\nimport UIKit\n\nenum ${themeName.replace(/\s+/g, "")}Theme {\n`;
  const dataRecord = data as Record<string, unknown>;

  if (dataRecord.colors && typeof dataRecord.colors === 'object') {
    swift += "    // Colors\n";
    Object.entries(dataRecord.colors as Record<string, string>).forEach(([key, value]) => {
      const colorName = key.replace(/-/g, "_");
      swift += `    static let ${colorName} = UIColor(/* ${value} */)\n`;
    });
  }

  if (dataRecord.spacing && typeof dataRecord.spacing === 'object') {
    swift += "\n    // Spacing\n";
    Object.entries(dataRecord.spacing as Record<string, string>).forEach(([key, value]) => {
      const spacingName = key.replace(/-/g, "_");
      swift += `    static let spacing_${spacingName}: CGFloat = ${parseFloat(value) || 0}\n`;
    });
  }

  swift += "}\n";
  return swift;
}

function exportToAndroidXML(data: TokenData, themeName: string): string {
  let xml = `<?xml version="1.0" encoding="utf-8"?>\n<!-- ${themeName} Theme - Android Resources -->\n<resources>\n`;
  const dataRecord = data as Record<string, unknown>;

  if (dataRecord.colors && typeof dataRecord.colors === 'object') {
    xml += "    <!-- Colors -->\n";
    Object.entries(dataRecord.colors as Record<string, string>).forEach(([key, value]) => {
      const colorName = key.replace(/-/g, "_");
      xml += `    <color name="${colorName}"><!-- ${value} --></color>\n`;
    });
  }

  if (dataRecord.spacing && typeof dataRecord.spacing === 'object') {
    xml += "\n    <!-- Spacing -->\n";
    Object.entries(dataRecord.spacing as Record<string, string>).forEach(([key, value]) => {
      const spacingName = key.replace(/-/g, "_");
      xml += `    <dimen name="spacing_${spacingName}">${value}</dimen>\n`;
    });
  }

  xml += "</resources>\n";
  return xml;
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
