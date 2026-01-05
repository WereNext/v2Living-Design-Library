import { Theme } from "../hooks/useDesignSystems";

export type ExportFormat = 
  | "css"
  | "scss"
  | "tailwind"
  | "json"
  | "ios-swift"
  | "android-xml"
  | "figma-tokens";

interface ExportOptions {
  theme: Theme;
  changesOnly?: boolean;
  changes?: Record<string, any>;
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

function exportToCSS(data: any, themeName: string): string {
  let css = `/* ${themeName} Theme - CSS Variables */\n:root {\n`;
  
  const processObject = (obj: any, prefix: string = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        processObject(value, prefix ? `${prefix}-${key}` : key);
      } else {
        const varName = prefix ? `--${prefix}-${key}` : `--${key}`;
        css += `  ${varName}: ${value};\n`;
      }
    });
  };

  processObject(data);
  css += "}\n";
  return css;
}

function exportToSCSS(data: any, themeName: string): string {
  let scss = `// ${themeName} Theme - SCSS Variables\n\n`;
  
  const processObject = (obj: any, prefix: string = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        processObject(value, prefix ? `${prefix}-${key}` : key);
      } else {
        const varName = prefix ? `$${prefix}-${key}` : `$${key}`;
        scss += `${varName}: ${value};\n`;
      }
    });
  };

  processObject(data);
  return scss;
}

function exportToTailwind(data: any): string {
  const config = {
    theme: {
      extend: {}
    }
  };

  const processColors = (colors: any) => {
    const result: any = {};
    Object.entries(colors).forEach(([key, value]) => {
      result[key] = value;
    });
    return result;
  };

  if (data.colors) {
    (config.theme.extend as any).colors = processColors(data.colors);
  }

  if (data.spacing) {
    (config.theme.extend as any).spacing = data.spacing;
  }

  if (data.borderRadius) {
    (config.theme.extend as any).borderRadius = data.borderRadius;
  }

  if (data.typography) {
    (config.theme.extend as any).fontFamily = data.typography;
  }

  if (data.shadows) {
    (config.theme.extend as any).boxShadow = data.shadows;
  }

  return `// Tailwind CSS Configuration\nmodule.exports = ${JSON.stringify(config, null, 2)}`;
}

function exportToJSON(data: any): string {
  return JSON.stringify(data, null, 2);
}

function exportToIOSSwift(data: any, themeName: string): string {
  let swift = `// ${themeName} Theme - iOS Swift\nimport UIKit\n\nenum ${themeName.replace(/\s+/g, "")}Theme {\n`;

  if (data.colors) {
    swift += "    // Colors\n";
    Object.entries(data.colors).forEach(([key, value]) => {
      const colorName = key.replace(/-/g, "_");
      swift += `    static let ${colorName} = UIColor(/* ${value} */)\n`;
    });
  }

  if (data.spacing) {
    swift += "\n    // Spacing\n";
    Object.entries(data.spacing).forEach(([key, value]) => {
      const spacingName = key.replace(/-/g, "_");
      swift += `    static let spacing_${spacingName}: CGFloat = ${parseFloat(value as string) || 0}\n`;
    });
  }

  swift += "}\n";
  return swift;
}

function exportToAndroidXML(data: any, themeName: string): string {
  let xml = `<?xml version="1.0" encoding="utf-8"?>\n<!-- ${themeName} Theme - Android Resources -->\n<resources>\n`;

  if (data.colors) {
    xml += "    <!-- Colors -->\n";
    Object.entries(data.colors).forEach(([key, value]) => {
      const colorName = key.replace(/-/g, "_");
      xml += `    <color name="${colorName}"><!-- ${value} --></color>\n`;
    });
  }

  if (data.spacing) {
    xml += "\n    <!-- Spacing -->\n";
    Object.entries(data.spacing).forEach(([key, value]) => {
      const spacingName = key.replace(/-/g, "_");
      xml += `    <dimen name="spacing_${spacingName}">${value}</dimen>\n`;
    });
  }

  xml += "</resources>\n";
  return xml;
}

function exportToFigmaTokens(data: any, themeName: string): string {
  const figmaTokens: any = {
    [themeName]: {}
  };

  const convertToFigmaFormat = (obj: any, category: string) => {
    const result: any = {};
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
    if (typeof values === "object" && values !== null) {
      figmaTokens[themeName][category] = convertToFigmaFormat(values, category);
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
