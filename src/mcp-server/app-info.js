/**
 * Comprehensive app information for AI agents and DSPy framework
 * This provides the "system prompt" for understanding how to interact with Living Design Library
 */

export function getAppInfo() {
  return {
    overview: {
      name: "Living Design Library",
      version: "1.0.0",
      purpose: "A complete design system infrastructure combining Git, Figma, Storybook, and design tokens",
      description: "The Living Design Library serves as a complete design system infrastructure that allows designers to export design tokens from Figma as JSON, import them into the library, and automatically generate interactive component documentation with multi-framework code export (React, Vue, Svelte, Angular, iOS, Android).",
      keyFeatures: [
        "Universal token parsing from Figma JSON",
        "Git-like versioning with semantic versioning and rollback capabilities",
        "MCP server for AI coding agent integration",
        "Complete template builder system",
        "Multi-framework code export (React, Vue, HTML, Svelte)",
        "Supports multiple design systems with multiple themes each",
        "6-tab token editor interface",
        "Works entirely offline with no backend dependencies",
        "Dynamic theming engine - app adapts to user's design system in real-time"
      ],
      designPhilosophy: "The app itself has NO design opinion - it features ultra-minimal neutral chrome (like Figma or Storybook) that gets out of the way so users' design systems can be the star of the show."
    },
    
    architecture: {
      description: "React-based web application with Electron desktop distribution, built using Model Context Protocol (MCP) for AI agent integration",
      coreComponents: {
        "Dynamic Theme Engine": "Converts design system tokens into live CSS variables that style the entire app (/lib/dynamic-theme-engine.ts)",
        "Token System": "Universal parser that handles colors, spacing, typography, borderRadius, shadows, opacity, and effects",
        "Design System Manager": "Multi-system support with theme switching and versioning (/hooks/useDesignSystems.ts)",
        "Component Registry": "32+ UI components with auto-generation capabilities (/lib/component-registry.ts)",
        "Code Generators": "Multi-framework code export system (/lib/code-generators.ts)",
        "MCP Server": "Allows AI coding agents to interact with design systems (/mcp-server/index.js)"
      },
      contexts: {
        "AppStateContext": "Global state management for design systems, themes, and UI state",
        "TokenEditorContext": "Manages token editing and validation",
        "ActiveThemeContext": "Tracks and applies the currently active theme"
      },
      storage: "LocalStorage-based persistence (key: 'designSystems') - completely offline"
    },
    
    "data-structures": {
      "Theme": {
        description: "A theme is a variable set within a design system",
        structure: {
          id: "string - Unique identifier",
          name: "string - Theme name",
          description: "string - Optional description",
          colors: "Record<string, string> - Color tokens (e.g., primary: 'hsl(222 47% 11%)')",
          spacing: "Record<string, string> - Spacing tokens (e.g., md: '1rem')",
          typography: "Record<string, string> - Typography tokens",
          borderRadius: "Record<string, string> - Border radius tokens",
          shadows: "Record<string, string> - Shadow tokens",
          opacity: "Record<string, string> - Optional opacity tokens",
          effects: "Record<string, string> - Optional visual effects (backdrop-blur, etc.)",
          componentStyles: "object - Component-specific configurations",
          colorTheme: "'neo' | 'brutalist' | 'glassmorphism' | 'candy' | 'material' | 'minimal'",
          fontFamily: "'inter' | 'spaceGrotesk' | 'jetbrainsMono' | etc.",
          visualFeel: "'modern' | 'classic' | 'playful' | 'minimal' | 'bold'"
        },
        example: {
          id: "apple-theme",
          name: "Apple Theme",
          colors: {
            primary: "221 83% 53%",
            secondary: "217 91% 60%",
            background: "0 0% 100%"
          },
          spacing: {
            xs: "0.5rem",
            sm: "0.75rem",
            md: "1rem"
          }
        }
      },
      "DesignSystem": {
        description: "A design system is a container with multiple themes and intents",
        structure: {
          id: "string - Unique identifier",
          name: "string - Design system name",
          description: "string - Optional description",
          createdAt: "string - ISO timestamp",
          useIcons: "boolean - Whether to display icons in UI (default: true)",
          themes: "Theme[] - Array of themes",
          activeThemeId: "string - ID of currently active theme",
          intents: "Array<Intent> - Component categories/intents",
          versions: "DesignSystemVersion[] - Version history",
          currentVersionId: "string - Active version ID"
        }
      },
      "TokenTypes": {
        colors: "Color values in HSL or HEX format",
        spacing: "CSS units (rem, px, em)",
        typography: "Font families, sizes, weights",
        borderRadius: "Corner radius values",
        shadows: "Box-shadow CSS values",
        opacity: "0-1 values for transparency",
        effects: "Visual effects like backdrop-blur"
      },
      "CSSVariableNaming": {
        colors: "--theme-color-{name}",
        spacing: "--theme-space-{size}",
        typography: "--theme-typography-{property}",
        borderRadius: "--theme-radius-{size}",
        shadows: "--theme-shadow-{size}",
        effects: "--theme-effect-{name}"
      }
    },
    
    "dspy-guidance": {
      description: "Comprehensive guidance for AI agents using DSPy framework to interact with and parse the Living Design Library",
      
      "understanding-the-app": {
        corePhilosophy: "The app is a 'living preview' - it has NO design identity of its own. When a user imports or creates a design system, the ENTIRE app updates to match their tokens. Think of it like Figma or Storybook's neutral chrome.",
        dataFlow: [
          "1. User imports/creates design system → Stored in localStorage",
          "2. User selects theme → ActiveThemeContext updates",
          "3. Dynamic theme engine injects CSS variables → Entire app re-styles",
          "4. All components render using --theme-* variables"
        ],
        keyFiles: [
          "/lib/dynamic-theme-engine.ts - Converts tokens to CSS",
          "/hooks/useDesignSystems.ts - Design system management",
          "/contexts/AppStateContext.tsx - Global state",
          "/lib/code-generators.ts - Multi-framework export",
          "/mcp-server/index.js - This file"
        ]
      },
      
      "parsing-strategies": {
        "For Design System Operations": {
          recommendation: "Use DSPy Chain-of-Thought or ReAct pattern",
          steps: [
            "1. Call list_design_systems to see available systems",
            "2. Identify target system or create new one",
            "3. Call get_design_system to retrieve full token structure",
            "4. Parse tokens object - look for: colors, spacing, typography, borderRadius, shadows",
            "5. Generate components using get_component_code with parsed tokens"
          ],
          example: "If user says 'use my design system to build a dashboard', retrieve their active system, parse the tokens, then request dashboard components with those tokens"
        },
        "For Code Generation": {
          recommendation: "Use DSPy Signature for structured output",
          inputSchema: {
            componentName: "Button | Card | Modal | etc.",
            framework: "react | vue | html | svelte",
            systemId: "Optional - uses active system if omitted"
          },
          outputParsing: "Response includes 'code' (string), 'tokens' (object), and 'framework' (string). Extract code block and save to file."
        },
        "For Token Parsing": {
          recommendation: "Use DSPy Predict with schema validation",
          approach: [
            "1. Tokens are flat key-value pairs (not nested)",
            "2. Colors use HSL format: 'primary': '221 83% 53%'",
            "3. Spacing uses CSS units: 'md': '1rem'",
            "4. Typography can be font families, sizes, or weights",
            "5. BorderRadius and shadows follow same pattern"
          ],
          validation: "Ensure all token values are valid CSS - no units in HSL colors, units required for spacing"
        },
        "For Multi-System Support": {
          recommendation: "DSPy Program with memory",
          pattern: [
            "Track activeSystemId in agent state",
            "When user switches systems, update activeSystemId",
            "All subsequent operations use active system",
            "Can override with explicit systemId parameter"
          ]
        }
      },
      
      "common-patterns": {
        "Pattern 1: Import Figma Tokens": {
          dspyModule: "Chain (import_figma_tokens → set_active_system → list_components)",
          prompt: "'Import my Figma design tokens and show me what components I can generate'",
          steps: [
            "1. Parse Figma JSON structure",
            "2. Call import_figma_tokens with systemName and figmaJson",
            "3. Receive systemId in response",
            "4. Call set_active_system with returned systemId",
            "5. Call list_components to show available components"
          ]
        },
        "Pattern 2: Generate Component Suite": {
          dspyModule: "RetrieveParallel (multiple get_component_code calls)",
          prompt: "'Give me Button, Card, Input in React using my active design system'",
          steps: [
            "1. Verify active system exists (list_design_systems)",
            "2. Call get_component_code 3 times in parallel",
            "3. Parse each response's 'code' field",
            "4. Save to separate files (Button.tsx, Card.tsx, Input.tsx)"
          ]
        },
        "Pattern 3: Build Full Page": {
          dspyModule: "ChainOfThought (analyze → get_page_template → refine)",
          prompt: "'Build me a dashboard page with charts and cards'",
          steps: [
            "1. Analyze which page template fits (dashboard)",
            "2. Call get_page_template with pageType='dashboard' and framework='react'",
            "3. Receive full page code with composed components",
            "4. Optionally refine by requesting individual components"
          ]
        },
        "Pattern 4: Theme Comparison": {
          dspyModule: "Parallel (get_design_tokens with different systemIds)",
          prompt: "'Compare the color palettes of my two design systems'",
          steps: [
            "1. Call list_design_systems to get all system IDs",
            "2. Call get_design_tokens twice in parallel with tokenType='colors'",
            "3. Parse both responses and compare color values",
            "4. Present differences in structured format"
          ]
        }
      },
      
      "dspy-modules-recommended": {
        "dspy.ChainOfThought": "For sequential operations like import → customize → export",
        "dspy.ReAct": "For exploratory tasks like 'find the best theme for a dashboard'",
        "dspy.Signature": "For type-safe requests to MCP tools with schema validation",
        "dspy.Predict": "For single-step operations like get_component_code",
        "dspy.Program": "For complex workflows involving multiple systems"
      },
      
      "error-handling": {
        commonErrors: [
          "Design system not found → Call list_design_systems to get valid IDs",
          "No active system → Call set_active_system before requesting components",
          "Component not found → Call list_components to see available options",
          "Framework not supported → Use: react | vue | html | svelte"
        ],
        dspyRetryStrategy: "Use dspy.Retry with backoff when MCP server returns errors"
      },
      
      "optimization-tips": {
        parallelization: "MCP tools are stateless - safe to call multiple tools in parallel (except set_active_system)",
        caching: "Design system data rarely changes - cache list_design_systems response",
        batching: "When generating multiple components, request all at once rather than sequentially"
      }
    },
    
    workflows: {
      "Basic Workflow": [
        "1. User opens app (loads saved design systems from localStorage)",
        "2. User selects or imports design system",
        "3. App applies tokens to entire UI via dynamic theme engine",
        "4. User browses components (32+ pre-built)",
        "5. User exports code in their chosen framework"
      ],
      "AI Agent Workflow (via MCP)": [
        "1. Agent calls get_app_info to understand structure",
        "2. Agent calls list_design_systems to see available systems",
        "3. Agent identifies target system or creates new one",
        "4. Agent calls get_design_tokens to retrieve tokens",
        "5. Agent generates components using get_component_code",
        "6. Agent can also request full page templates or composition guides"
      ],
      "Figma Integration Workflow": [
        "1. Designer exports Figma variables as JSON",
        "2. User imports JSON via Import Config page",
        "3. App parses Figma structure and creates design system",
        "4. App generates components using imported tokens",
        "5. User can version and iterate on design"
      ],
      "Version Control Workflow": [
        "1. User makes changes to tokens",
        "2. User creates version with semantic versioning (major.minor.patch)",
        "3. Version snapshot stored with timestamp",
        "4. User can rollback to previous versions",
        "5. Git-like branch/merge coming in future"
      ]
    },
    
    "mcp-tools-reference": {
      "Design System Management": [
        "list_design_systems - Get all systems",
        "get_design_system - Get full system with tokens",
        "create_design_system - Create new system",
        "set_active_system - Set which system to use"
      ],
      "Token Operations": [
        "get_design_tokens - Retrieve tokens (colors, spacing, etc.)",
        "import_figma_tokens - Import from Figma JSON"
      ],
      "Component Generation": [
        "list_components - See available components",
        "get_component_code - Generate component in framework",
        "get_page_template - Generate full page"
      ],
      "Guidance & Templates": [
        "get_composition_guide - Learn how to compose components",
        "list_page_templates - See available page templates",
        "list_library_templates - See pre-built libraries (shadcn, Material, etc.)",
        "load_library_template - Load pre-built library as system"
      ],
      "Meta": [
        "get_app_info - This tool! Comprehensive app documentation"
      ]
    }
  };
}
