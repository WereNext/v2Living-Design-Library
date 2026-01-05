#!/usr/bin/env node

/**
 * MCP Server for Living Design Library
 * Allows coding agents to interact with design systems, components, and export code
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getAppInfo } from "./app-info.js";
import { 
  loadAppData, 
  watchAppData, 
  getDataStats, 
  transformToMCPFormat,
  extractAvailableComponents,
  extractAvailableIntents
} from "./data-sync.js";

// Load real app data on startup
let appDataState = loadAppData();
let designSystems = appDataState.designSystems.map(transformToMCPFormat);
let activeSystemId = designSystems[0]?.id || null;
let syncMetadata = appDataState.metadata;

// Extract dynamic data from loaded systems
let availableComponents = extractAvailableComponents(appDataState.designSystems);
let availableIntents = extractAvailableIntents(appDataState.designSystems);

// Watch for data file changes
watchAppData(() => {
  appDataState = loadAppData();
  designSystems = appDataState.designSystems.map(transformToMCPFormat);
  syncMetadata = appDataState.metadata;
  availableComponents = extractAvailableComponents(appDataState.designSystems);
  availableIntents = extractAvailableIntents(appDataState.designSystems);
  console.error('✅ App data reloaded');
});

// Create server instance
const server = new Server(
  {
    name: "living-design-library",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_design_systems",
        description: "List all available design systems in the library",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_design_system",
        description: "Get details of a specific design system including all design tokens",
        inputSchema: {
          type: "object",
          properties: {
            systemId: {
              type: "string",
              description: "The ID of the design system to retrieve",
            },
          },
          required: ["systemId"],
        },
      },
      {
        name: "create_design_system",
        description: "Create a new design system with custom tokens",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the design system (e.g., 'My Product Design System')",
            },
            description: {
              type: "string",
              description: "Description of the design system",
            },
            tokens: {
              type: "object",
              description: "Design tokens object with colors, spacing, typography, etc.",
              properties: {
                colors: { type: "object" },
                spacing: { type: "object" },
                typography: { type: "object" },
                borderRadius: { type: "object" },
                shadows: { type: "object" },
              },
            },
            intents: {
              type: "array",
              description: "Array of component categories/intents (e.g., ['Web App', 'Dashboard'])",
              items: { type: "string" },
            },
          },
          required: ["name", "tokens"],
        },
      },
      {
        name: "import_figma_tokens",
        description: "Import design tokens from Figma JSON export",
        inputSchema: {
          type: "object",
          properties: {
            systemName: {
              type: "string",
              description: "Name for the new design system",
            },
            figmaJson: {
              type: "object",
              description: "Figma variables JSON export",
            },
            intents: {
              type: "array",
              description: "Component categories to include",
              items: { type: "string" },
            },
          },
          required: ["systemName", "figmaJson"],
        },
      },
      {
        name: "list_components",
        description: "List all available components, optionally filtered by category/intent",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Filter by component category/intent",
            },
          },
        },
      },
      {
        name: "get_component_code",
        description: "Get component code in specified framework using active design system tokens",
        inputSchema: {
          type: "object",
          properties: {
            componentName: {
              type: "string",
              description: "Name of the component (e.g., 'Button', 'Card', 'Modal')",
            },
            framework: {
              type: "string",
              enum: ["react", "vue", "html", "svelte"],
              description: "Target framework for code export",
            },
            systemId: {
              type: "string",
              description: "Design system ID to use for tokens (uses active system if not specified)",
            },
          },
          required: ["componentName", "framework"],
        },
      },
      {
        name: "set_active_system",
        description: "Set the active design system for component generation",
        inputSchema: {
          type: "object",
          properties: {
            systemId: {
              type: "string",
              description: "The ID of the design system to set as active",
            },
          },
          required: ["systemId"],
        },
      },
      {
        name: "get_design_tokens",
        description: "Get design tokens from active or specified design system",
        inputSchema: {
          type: "object",
          properties: {
            systemId: {
              type: "string",
              description: "Design system ID (uses active system if not specified)",
            },
            tokenType: {
              type: "string",
              enum: ["colors", "spacing", "typography", "borderRadius", "shadows", "all"],
              description: "Type of tokens to retrieve",
            },
          },
        },
      },
      {
        name: "get_page_template",
        description: "Get a complete page template with multiple composed components. Provides full page structure, layout patterns, and component composition examples based on page type and design intent.",
        inputSchema: {
          type: "object",
          properties: {
            pageType: {
              type: "string",
              enum: [
                "dashboard", "e-commerce-product", "landing-page", "blog-post", 
                "user-profile", "settings-page", "pricing-page", "login-page",
                "admin-table", "messaging-app", "calendar-view", "portfolio-showcase"
              ],
              description: "Type of page template to generate",
            },
            framework: {
              type: "string",
              enum: ["react", "vue", "html", "svelte"],
              description: "Target framework for the page code",
            },
            systemId: {
              type: "string",
              description: "Design system ID to use for tokens (uses active system if not specified)",
            },
          },
          required: ["pageType", "framework"],
        },
      },
      {
        name: "list_page_templates",
        description: "List all available page templates with descriptions of their composition and use cases",
        inputSchema: {
          type: "object",
          properties: {
            designIntent: {
              type: "string",
              description: "Filter templates by design intent (e.g., 'e-commerce', 'dashboard', 'landing')",
            },
          },
        },
      },
      {
        name: "get_composition_guide",
        description: "Get guidance on how to compose components together for specific use cases. Explains layout patterns, component combinations, and best practices.",
        inputSchema: {
          type: "object",
          properties: {
            useCase: {
              type: "string",
              enum: [
                "data-table-with-filters", "form-with-validation", "card-grid-layout",
                "sidebar-navigation", "hero-with-cta", "product-listing", "user-dashboard",
                "chat-interface", "kanban-board", "settings-panel"
              ],
              description: "The specific use case for composition guidance",
            },
          },
          required: ["useCase"],
        },
      },
      {
        name: "list_library_templates",
        description: "List available pre-built library templates (shadcn/ui, Material Design, etc.)",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "load_library_template",
        description: "Load a pre-built library template as a new design system",
        inputSchema: {
          type: "object",
          properties: {
            templateName: {
              type: "string",
              enum: ["shadcn/ui", "Material Design 3", "Chakra UI", "Ant Design", "Tailwind CSS", "Radix Colors", "Mantine", "Bootstrap 5"],
              description: "Name of the library template to load",
            },
            systemName: {
              type: "string",
              description: "Custom name for the new design system",
            },
            intents: {
              type: "array",
              description: "Component categories to include",
              items: { type: "string" },
            },
          },
          required: ["templateName"],
        },
      },
      {
        name: "get_app_info",
        description: "Get comprehensive information about the Living Design Library app architecture, data structures, and guidance for AI agents using DSPy framework. This tool provides the 'system prompt' for understanding how to interact with and parse the app effectively.",
        inputSchema: {
          type: "object",
          properties: {
            section: {
              type: "string",
              enum: ["overview", "architecture", "data-structures", "dspy-guidance", "workflows", "all"],
              description: "Which section of app information to retrieve (default: 'all')",
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_design_systems": {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                systems: designSystems.map(sys => ({
                  id: sys.id,
                  name: sys.name,
                  description: sys.description,
                  intents: sys.intents,
                  createdAt: sys.createdAt,
                })),
                activeSystemId,
                totalSystems: designSystems.length,
              }, null, 2),
            },
          ],
        };
      }

      case "get_design_system": {
        const system = designSystems.find(s => s.id === args.systemId);
        if (!system) {
          throw new Error(`Design system with ID "${args.systemId}" not found`);
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(system, null, 2),
            },
          ],
        };
      }

      case "create_design_system": {
        const newSystem = {
          id: `ds-${Date.now()}`,
          name: args.name,
          description: args.description || "",
          tokens: args.tokens,
          intents: args.intents || ["Web App"],
          createdAt: new Date().toISOString(),
        };
        designSystems.push(newSystem);
        activeSystemId = newSystem.id;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Design system "${args.name}" created successfully`,
                systemId: newSystem.id,
                system: newSystem,
              }, null, 2),
            },
          ],
        };
      }

      case "import_figma_tokens": {
        // Parse Figma JSON and convert to design tokens
        const tokens = parseFigmaTokens(args.figmaJson);
        const newSystem = {
          id: `ds-${Date.now()}`,
          name: args.systemName,
          description: "Imported from Figma",
          tokens,
          intents: args.intents || ["Web App"],
          source: "figma",
          createdAt: new Date().toISOString(),
        };
        designSystems.push(newSystem);
        activeSystemId = newSystem.id;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Figma tokens imported as "${args.systemName}"`,
                systemId: newSystem.id,
                tokensImported: {
                  colors: Object.keys(tokens.colors || {}).length,
                  spacing: Object.keys(tokens.spacing || {}).length,
                  typography: Object.keys(tokens.typography || {}).length,
                },
              }, null, 2),
            },
          ],
        };
      }

      case "list_components": {
        let components = availableComponents;
        const category = args.category;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                components,
                totalComponents: components.length,
                category: category || "all",
                availableCategories: COMPONENT_CATEGORIES,
                frameworks: FRAMEWORKS,
              }, null, 2),
            },
          ],
        };
      }

      case "get_component_code": {
        const systemId = args.systemId || activeSystemId;
        if (!systemId) {
          throw new Error("No design system specified and no active system set. Use set_active_system first.");
        }

        const system = designSystems.find(s => s.id === systemId);
        if (!system) {
          throw new Error(`Design system with ID "${systemId}" not found`);
        }

        if (!availableComponents.includes(args.componentName)) {
          throw new Error(`Component "${args.componentName}" not found. Available: ${availableComponents.join(", ")}`);
        }

        // Generate component code with design tokens
        const code = generateComponentCode(args.componentName, args.framework, system.tokens);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                component: args.componentName,
                framework: args.framework,
                designSystem: system.name,
                code,
                tokens: system.tokens,
              }, null, 2),
            },
          ],
        };
      }

      case "set_active_system": {
        const system = designSystems.find(s => s.id === args.systemId);
        if (!system) {
          throw new Error(`Design system with ID "${args.systemId}" not found`);
        }
        activeSystemId = args.systemId;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Active design system set to "${system.name}"`,
                systemId: args.systemId,
                systemName: system.name,
              }, null, 2),
            },
          ],
        };
      }

      case "get_design_tokens": {
        const systemId = args.systemId || activeSystemId;
        if (!systemId) {
          throw new Error("No design system specified and no active system set");
        }

        const system = designSystems.find(s => s.id === systemId);
        if (!system) {
          throw new Error(`Design system with ID "${systemId}" not found`);
        }

        const tokenType = args.tokenType || "all";
        const tokens = tokenType === "all" 
          ? system.tokens 
          : { [tokenType]: system.tokens[tokenType] };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                designSystem: system.name,
                systemId: system.id,
                tokenType,
                tokens,
              }, null, 2),
            },
          ],
        };
      }

      case "get_page_template": {
        const systemId = args.systemId || activeSystemId;
        if (!systemId) {
          throw new Error("No design system specified and no active system set. Use set_active_system first.");
        }

        const system = designSystems.find(s => s.id === systemId);
        if (!system) {
          throw new Error(`Design system with ID "${systemId}" not found`);
        }

        const pageTemplate = getPageTemplate(args.pageType, args.framework, system.tokens);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                pageType: args.pageType,
                framework: args.framework,
                designSystem: system.name,
                code: pageTemplate,
                tokens: system.tokens,
              }, null, 2),
            },
          ],
        };
      }

      case "list_page_templates": {
        const templates = [
          { name: "dashboard", description: "A comprehensive dashboard with data visualization and controls" },
          { name: "e-commerce-product", description: "A product detail page with images, description, and purchase options" },
          { name: "landing-page", description: "A marketing landing page with hero section, features, and call-to-action" },
          { name: "blog-post", description: "A blog post page with title, author, date, and content" },
          { name: "user-profile", description: "A user profile page with personal information and settings" },
          { name: "settings-page", description: "A settings page with configuration options and preferences" },
          { name: "pricing-page", description: "A pricing page with different plans and features" },
          { name: "login-page", description: "A login page with username and password fields" },
          { name: "admin-table", description: "An admin table with data listing and management controls" },
          { name: "messaging-app", description: "A messaging app interface with chat and message history" },
          { name: "calendar-view", description: "A calendar view with date selection and event scheduling" },
          { name: "portfolio-showcase", description: "A portfolio showcase page with project listings and details" },
        ];

        const designIntent = args.designIntent;
        if (designIntent) {
          templates.filter(template => template.name.includes(designIntent));
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                templates,
                totalTemplates: templates.length,
              }, null, 2),
            },
          ],
        };
      }

      case "get_composition_guide": {
        const useCase = args.useCase;
        const guide = getCompositionGuide(useCase);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                useCase,
                guide,
              }, null, 2),
            },
          ],
        };
      }

      case "list_library_templates": {
        const templates = [
          { name: "shadcn/ui", description: "Clean, accessible components with Radix UI primitives" },
          { name: "Material Design 3", description: "Google's latest design system" },
          { name: "Chakra UI", description: "Simple, modular component library" },
          { name: "Ant Design", description: "Enterprise-grade UI design language" },
          { name: "Tailwind CSS", description: "Utility-first CSS framework defaults" },
          { name: "Radix Colors", description: "Beautiful, accessible color system" },
          { name: "Mantine", description: "Modern React components library" },
          { name: "Bootstrap 5", description: "Popular responsive framework" },
        ];

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                templates,
                totalTemplates: templates.length,
              }, null, 2),
            },
          ],
        };
      }

      case "load_library_template": {
        const templateTokens = getLibraryTemplateTokens(args.templateName);
        const systemName = args.systemName || args.templateName;
        
        const newSystem = {
          id: `ds-${Date.now()}`,
          name: systemName,
          description: `Based on ${args.templateName}`,
          tokens: templateTokens,
          intents: args.intents || ["Web App"],
          source: "template",
          template: args.templateName,
          createdAt: new Date().toISOString(),
        };
        designSystems.push(newSystem);
        activeSystemId = newSystem.id;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Library template "${args.templateName}" loaded as "${systemName}"`,
                systemId: newSystem.id,
                system: newSystem,
              }, null, 2),
            },
          ],
        };
      }

      case "get_app_info": {
        const section = args.section || "all";
        const appInfo = getAppInfo();
        const info = section === "all" ? appInfo : { [section]: appInfo[section] };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(info, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            error: error.message,
            tool: name,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Helper: Parse Figma tokens
function parseFigmaTokens(figmaJson) {
  const tokens = {
    colors: {},
    spacing: {},
    typography: {},
    borderRadius: {},
    shadows: {},
  };

  // Basic Figma variable parsing logic
  if (figmaJson.variables) {
    figmaJson.variables.forEach(variable => {
      const { name, resolvedType, valuesByMode } = variable;
      const value = Object.values(valuesByMode)[0];

      if (resolvedType === "COLOR") {
        tokens.colors[name] = value;
      } else if (name.includes("spacing") || name.includes("gap")) {
        tokens.spacing[name] = value;
      } else if (name.includes("font") || name.includes("text")) {
        tokens.typography[name] = value;
      } else if (name.includes("radius")) {
        tokens.borderRadius[name] = value;
      } else if (name.includes("shadow")) {
        tokens.shadows[name] = value;
      }
    });
  }

  return tokens;
}

// Helper: Get library template tokens
function getLibraryTemplateTokens(templateName) {
  const templates = {
    "shadcn/ui": {
      colors: {
        primary: "hsl(222.2 47.4% 11.2%)",
        secondary: "hsl(210 40% 96.1%)",
        accent: "hsl(210 40% 96.1%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 47.4% 11.2%)",
      },
      spacing: {
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      },
      typography: {
        fontFamily: "system-ui, sans-serif",
        fontSize: "1rem",
        fontWeight: "400",
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      },
    },
    "Material Design 3": {
      colors: {
        primary: "#6750A4",
        secondary: "#625B71",
        tertiary: "#7D5260",
        background: "#FFFBFE",
        surface: "#FFFBFE",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      typography: {
        fontFamily: "Roboto, sans-serif",
        fontSize: "14px",
        fontWeight: "400",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        full: "9999px",
      },
      shadows: {
        sm: "0px 1px 2px rgba(0, 0, 0, 0.3)",
        md: "0px 2px 4px rgba(0, 0, 0, 0.3)",
        lg: "0px 4px 8px rgba(0, 0, 0, 0.3)",
      },
    },
  };

  return templates[templateName] || templates["shadcn/ui"];
}

// Helper: Generate component code
function generateComponentCode(componentName, framework, tokens) {
  const cssVars = generateCSSVariables(tokens);
  
  const componentTemplates = {
    react: {
      Button: `import React from 'react';

const Button = ({ children, variant = 'primary', ...props }) => {
  const baseStyles = {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size)',
    fontWeight: 'var(--font-weight)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-foreground)',
    },
  };

  return (
    <button 
      style={{ ...baseStyles, ...variantStyles[variant] }}
      {...props}
    >
      {children}
    </button>
  );
};

// CSS Variables (add to your global stylesheet)
/*
${cssVars}
*/

export default Button;`,
      Card: `import React from 'react';

const Card = ({ children, ...props }) => {
  const cardStyles = {
    backgroundColor: 'var(--color-background)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    boxShadow: 'var(--shadow-md)',
    fontFamily: 'var(--font-family)',
  };

  return (
    <div style={cardStyles} {...props}>
      {children}
    </div>
  );
};

// CSS Variables (add to your global stylesheet)
/*
${cssVars}
*/

export default Card;`,
    },
    vue: {
      Button: `<template>
  <button 
    :class="['button', \`button--\${variant}\`]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary'
    }
  }
}
</script>

<style scoped>
.button {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size);
  font-weight: var(--font-weight);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.button--primary {
  background-color: var(--color-primary);
  color: white;
}

.button--secondary {
  background-color: var(--color-secondary);
  color: var(--color-foreground);
}

/* CSS Variables (add to your global stylesheet) */
/*
${cssVars}
*/
</style>`,
    },
    html: {
      Button: `<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS Variables */
    ${cssVars}

    .button {
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-md);
      font-family: var(--font-family);
      font-size: var(--font-size);
      font-weight: var(--font-weight);
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .button--primary {
      background-color: var(--color-primary);
      color: white;
    }

    .button--secondary {
      background-color: var(--color-secondary);
      color: var(--color-foreground);
    }
  </style>
</head>
<body>
  <button class="button button--primary">Primary Button</button>
  <button class="button button--secondary">Secondary Button</button>
</body>
</html>`,
    },
    svelte: {
      Button: `<script>
  export let variant = 'primary';
</script>

<button class="button button--{variant}">
  <slot />
</button>

<style>
  .button {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    font-family: var(--font-family);
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .button--primary {
    background-color: var(--color-primary);
    color: white;
  }

  .button--secondary {
    background-color: var(--color-secondary);
    color: var(--color-foreground);
  }

  /* CSS Variables (add to your global stylesheet) */
  /*
  ${cssVars}
  */
</style>`,
    },
  };

  return componentTemplates[framework]?.[componentName] || 
    `// ${componentName} component for ${framework}\n// Component template not yet available`;
}

// Helper: Generate CSS variables from tokens
function generateCSSVariables(tokens) {
  let css = ':root {\n';
  
  if (tokens.colors) {
    Object.entries(tokens.colors).forEach(([key, value]) => {
      css += `  --color-${key}: ${value};\n`;
    });
  }
  
  if (tokens.spacing) {
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      css += `  --spacing-${key}: ${value};\n`;
    });
  }
  
  if (tokens.typography) {
    Object.entries(tokens.typography).forEach(([key, value]) => {
      css += `  --${key}: ${value};\n`;
    });
  }
  
  if (tokens.borderRadius) {
    Object.entries(tokens.borderRadius).forEach(([key, value]) => {
      css += `  --radius-${key}: ${value};\n`;
    });
  }
  
  if (tokens.shadows) {
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      css += `  --shadow-${key}: ${value};\n`;
    });
  }
  
  css += '}';
  return css;
}

// Helper: Get page template
function getPageTemplate(pageType, framework, tokens) {
  const cssVars = generateCSSVariables(tokens);
  
  const pageTemplates = {
    react: {
      dashboard: `import React from 'react';

const Dashboard = () => {
  const baseStyles = {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size)',
    fontWeight: 'var(--font-weight)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-foreground)',
    },
  };

  return (
    <div style={{ ...baseStyles, ...variantStyles['primary'] }}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard</p>
    </div>
  );
};

// CSS Variables (add to your global stylesheet)
/*
${cssVars}
*/

export default Dashboard;`,
      "e-commerce-product": `import React from 'react';

const ProductDetail = () => {
  const baseStyles = {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size)',
    fontWeight: 'var(--font-weight)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-foreground)',
    },
  };

  return (
    <div style={{ ...baseStyles, ...variantStyles['primary'] }}>
      <h1>Product Detail</h1>
      <p>Product description and purchase options</p>
    </div>
  );
};

// CSS Variables (add to your global stylesheet)
/*
${cssVars}
*/

export default ProductDetail;`,
    },
    vue: {
      dashboard: `<template>
  <div 
    :class="['dashboard', \`dashboard--\${variant}\`]"
    v-bind="$attrs"
  >
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard</p>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  props: {
    variant: {
      type: String,
      default: 'primary'
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size);
  font-weight: var(--font-weight);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.dashboard--primary {
  background-color: var(--color-primary);
  color: white;
}

.dashboard--secondary {
  background-color: var(--color-secondary);
  color: var(--color-foreground);
}

/* CSS Variables (add to your global stylesheet) */
/*
${cssVars}
*/
</style>`,
    },
    html: {
      dashboard: `<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS Variables */
    ${cssVars}

    .dashboard {
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-md);
      font-family: var(--font-family);
      font-size: var(--font-size);
      font-weight: var(--font-weight);
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .dashboard--primary {
      background-color: var(--color-primary);
      color: white;
    }

    .dashboard--secondary {
      background-color: var(--color-secondary);
      color: var(--color-foreground);
    }
  </style>
</head>
<body>
  <div class="dashboard dashboard--primary">
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard</p>
  </div>
</body>
</html>`,
    },
    svelte: {
      dashboard: `<script>
  export let variant = 'primary';
</script>

<div class="dashboard dashboard--{variant}">
  <h1>Dashboard</h1>
  <p>Welcome to your dashboard</p>
</div>

<style>
  .dashboard {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    font-family: var(--font-family);
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .dashboard--primary {
    background-color: var(--color-primary);
    color: white;
  }

  .dashboard--secondary {
    background-color: var(--color-secondary);
    color: var(--color-foreground);
  }

  /* CSS Variables (add to your global stylesheet) */
  /*
  ${cssVars}
  */
</style>`,
    },
  };

  return pageTemplates[framework]?.[pageType] || 
    `// ${pageType} page template for ${framework}\n// Page template not yet available`;
}

// Helper: Get composition guide
function getCompositionGuide(useCase) {
  const guides = {
    "data-table-with-filters": {
      description: "A data table with filtering capabilities",
      layout: "Grid layout with a header row and multiple data rows",
      components: ["Table", "Input", "Button"],
      bestPractices: [
        "Use clear and concise column headers",
        "Implement filter inputs for each column",
        "Provide sorting options for each column",
        "Use pagination for large datasets",
      ],
    },
    "form-with-validation": {
      description: "A form with validation to ensure correct input",
      layout: "Vertical form layout with labels and input fields",
      components: ["Input", "Button", "Alert"],
      bestPractices: [
        "Use descriptive labels for each input field",
        "Provide real-time validation feedback",
        "Highlight required fields with an asterisk",
        "Use consistent error messages",
      ],
    },
    "card-grid-layout": {
      description: "A grid layout of cards for displaying information",
      layout: "Responsive grid with multiple cards",
      components: ["Card", "Button"],
      bestPractices: [
        "Use consistent card sizes and styles",
        "Include a title and description in each card",
        "Add action buttons to each card for interactivity",
        "Ensure cards are easily scannable",
      ],
    },
    "sidebar-navigation": {
      description: "A sidebar navigation menu for easy access to different sections",
      layout: "Vertical sidebar with navigation links",
      components: ["Sidebar", "Button"],
      bestPractices: [
        "Use clear and concise labels for navigation links",
        "Highlight the current active link",
        "Provide icons for each link for better recognition",
        "Ensure the sidebar is easily accessible and responsive",
      ],
    },
    "hero-with-cta": {
      description: "A hero section with a call-to-action button",
      layout: "Full-width hero section with a title, description, and CTA button",
      components: ["Hero", "Button"],
      bestPractices: [
        "Use a large and bold title to grab attention",
        "Provide a clear and concise description",
        "Use a prominent CTA button with a clear label",
        "Ensure the hero section is visually appealing",
      ],
    },
    "product-listing": {
      description: "A product listing page with multiple product cards",
      layout: "Grid layout with product cards",
      components: ["Card", "Button"],
      bestPractices: [
        "Use high-quality product images",
        "Include product name, price, and description",
        "Add action buttons for purchase or details",
        "Ensure the layout is responsive and user-friendly",
      ],
    },
    "user-dashboard": {
      description: "A user dashboard with personal information and settings",
      layout: "Vertical layout with sections for different information",
      components: ["Card", "Input", "Button"],
      bestPractices: [
        "Display user profile information clearly",
        "Provide input fields for editing information",
        "Add action buttons for saving changes",
        "Ensure the dashboard is secure and private",
      ],
    },
    "chat-interface": {
      description: "A chat interface for messaging and communication",
      layout: "Vertical chat interface with message history and input field",
      components: ["Card", "Input", "Button"],
      bestPractices: [
        "Display message history in a readable format",
        "Provide an input field for typing messages",
        "Add action buttons for sending and clearing messages",
        "Ensure the chat interface is responsive and user-friendly",
      ],
    },
    "kanban-board": {
      description: "A kanban board for task management and organization",
      layout: "Grid layout with columns and cards",
      components: ["Card", "Button"],
      bestPractices: [
        "Use clear and concise column headers",
        "Add cards for each task with details",
        "Provide action buttons for moving cards between columns",
        "Ensure the kanban board is visually organized",
      ],
    },
    "settings-panel": {
      description: "A settings panel for configuring application preferences",
      layout: "Vertical layout with sections for different settings",
      components: ["Card", "Input", "Button"],
      bestPractices: [
        "Display current settings clearly",
        "Provide input fields for editing settings",
        "Add action buttons for saving changes",
        "Ensure the settings panel is user-friendly and intuitive",
      ],
    },
  };

  return guides[useCase] || {
    description: "No composition guide available for this use case",
    layout: "N/A",
    components: [],
    bestPractices: [],
  };
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Living Design Library MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});