/**
 * HTTP-based MCP Server for Living Design Library
 * Allows AI coding tools to connect directly to the browser app via HTTP
 * Uses StreamableHTTP transport for browser compatibility
 *
 * NEW: MCP Apps support - Interactive UI components that render in AI conversations
 * See: https://modelcontextprotocol.io/docs/extensions/apps
 */

import { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Cache file for offline support
const CACHE_FILE = join(__dirname, 'data-cache.json');
const DATA_BRIDGE_FILE = join(__dirname, 'data-bridge.json');

// Create MCP server instance with MCP Apps support
const mcpServer = new McpServer({
  name: "living-design-library",
  version: "2.0.0"
}, {
  capabilities: {
    tools: {},
    resources: {
      // Enable UI resources for MCP Apps
      subscribe: false,
      listChanged: false
    }
  }
});

// UI App definitions for MCP Apps extension
const UI_APPS = {
  'library-menu': {
    uri: 'ui://living-design-library/library-menu',
    name: 'Design Library',
    description: 'Browse available design systems and themes',
    mimeType: 'text/html',
    filePath: join(__dirname, 'ui-apps/library-menu/index.html')
  },
  'token-viewer': {
    uri: 'ui://living-design-library/token-viewer',
    name: 'Design Token Viewer',
    description: 'Interactive visualization of design tokens (colors, spacing, typography, etc.)',
    mimeType: 'text/html',
    filePath: join(__dirname, 'ui-apps/token-viewer/index.html')
  },
  'pattern-gallery': {
    uri: 'ui://living-design-library/pattern-gallery',
    name: 'Pattern Gallery',
    description: 'Visual gallery of UI patterns with code snippets',
    mimeType: 'text/html',
    filePath: join(__dirname, 'ui-apps/pattern-gallery/index.html')
  },
  'dashboard': {
    uri: 'ui://living-design-library/dashboard',
    name: 'Design System Dashboard',
    description: 'Overview dashboard for the design system',
    mimeType: 'text/html',
    filePath: join(__dirname, 'ui-apps/dashboard/index.html')
  }
};

// Store for live design systems data
let liveDesignSystems = [];
let livePatterns = { version: "1.0.0", lastUpdated: null, categories: [] };
let lastSyncTime = null;
let syncFailureCount = 0;
let dataSource = 'none';

/**
 * Load cached data from file (for offline support)
 */
function loadCachedData() {
  // Try data-bridge.json first (written by React app)
  if (existsSync(DATA_BRIDGE_FILE)) {
    try {
      const data = JSON.parse(readFileSync(DATA_BRIDGE_FILE, 'utf8'));
      if (data.designSystems?.length > 0) {
        liveDesignSystems = data.designSystems;
        livePatterns = data.patterns || livePatterns;
        dataSource = 'data-bridge';
        console.error(`📂 Loaded ${liveDesignSystems.length} design systems from data-bridge.json`);
        return true;
      }
    } catch (e) {
      console.error('⚠️  Could not read data-bridge.json:', e.message);
    }
  }

  // Fallback to cache file
  if (existsSync(CACHE_FILE)) {
    try {
      const data = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
      if (data.designSystems?.length > 0) {
        liveDesignSystems = data.designSystems;
        livePatterns = data.patterns || livePatterns;
        lastSyncTime = data.cachedAt;
        dataSource = 'cache';
        console.error(`📂 Loaded ${liveDesignSystems.length} design systems from cache`);
        return true;
      }
    } catch (e) {
      console.error('⚠️  Could not read cache:', e.message);
    }
  }

  return false;
}

/**
 * Save data to cache file
 */
function saveToCache() {
  try {
    writeFileSync(CACHE_FILE, JSON.stringify({
      designSystems: liveDesignSystems,
      patterns: livePatterns,
      cachedAt: lastSyncTime
    }, null, 2));
  } catch (e) {
    // Silently fail - caching is optional
  }
}

/**
 * Fetch live data from React app API with retry logic
 */
async function fetchLiveData() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const response = await fetch('http://localhost:3000/api/mcp/data', {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();

      // Validate data structure
      if (data && typeof data === 'object') {
        liveDesignSystems = Array.isArray(data.designSystems) ? data.designSystems : [];
        livePatterns = data.patterns || { version: "1.0.0", lastUpdated: null, categories: [] };
        lastSyncTime = new Date().toISOString();
        syncFailureCount = 0;
        dataSource = 'live';

        // Cache for offline use
        saveToCache();

        console.error(`🔄 Synced ${liveDesignSystems.length} design systems, ${livePatterns.categories?.length || 0} pattern categories`);
        return data;
      }
    }
  } catch (error) {
    syncFailureCount++;

    // Only log every 5th failure to reduce noise
    if (syncFailureCount === 1 || syncFailureCount % 5 === 0) {
      console.error(`⚠️  Sync attempt ${syncFailureCount} failed: ${error.message}`);
    }

    // Try to load from cache/data-bridge on first failure
    if (syncFailureCount === 1 && liveDesignSystems.length === 0) {
      loadCachedData();
    }
  }

  return null;
}

// Load cached data immediately on startup
loadCachedData();

// Poll React app for updates every 5 seconds
setInterval(fetchLiveData, 5000);

// Initial fetch attempt
await fetchLiveData();

// ============================================================================
// MCP Resources - UI Apps for interactive visualizations
// ============================================================================

mcpServer.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.values(UI_APPS).map(app => ({
      uri: app.uri,
      name: app.name,
      description: app.description,
      mimeType: app.mimeType
    }))
  };
});

mcpServer.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  // Find the UI app by URI
  const app = Object.values(UI_APPS).find(a => a.uri === uri);

  if (!app) {
    throw new Error(`UI resource not found: ${uri}`);
  }

  // Read the HTML file
  let content = '';
  if (existsSync(app.filePath)) {
    content = readFileSync(app.filePath, 'utf-8');
  } else {
    // Check dist folder for built version
    const distPath = app.filePath.replace('ui-apps/', 'dist/').replace('/index.html', '.html');
    if (existsSync(distPath)) {
      content = readFileSync(distPath, 'utf-8');
    } else {
      throw new Error(`UI app file not found: ${app.filePath}`);
    }
  }

  return {
    contents: [{
      uri: app.uri,
      mimeType: app.mimeType,
      text: content
    }]
  };
});

// ============================================================================
// MCP Tools - Same as stdio server but fetches live data
// Now with _meta.ui for MCP Apps integration
// ============================================================================

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_design_systems',
        description: 'List all available design systems with their themes and metadata. Shows an interactive library menu.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        },
        // MCP Apps: Show library menu UI when listing systems
        _meta: {
          ui: {
            resourceUri: UI_APPS['library-menu'].uri
          }
        }
      },
      {
        name: 'get_design_system',
        description: 'Get detailed information about a specific design system including all tokens. Returns an interactive token viewer UI.',
        inputSchema: {
          type: 'object',
          properties: {
            systemId: {
              type: 'string',
              description: 'The ID of the design system to retrieve'
            }
          },
          required: ['systemId']
        },
        // MCP Apps: Show token viewer UI
        _meta: {
          ui: {
            resourceUri: UI_APPS['token-viewer'].uri
          }
        }
      },
      {
        name: 'get_design_tokens',
        description: 'Get design tokens (colors, spacing, typography, etc.) from a design system. Returns an interactive token viewer UI.',
        inputSchema: {
          type: 'object',
          properties: {
            systemId: {
              type: 'string',
              description: 'The ID of the design system'
            },
            tokenType: {
              type: 'string',
              enum: ['colors', 'spacing', 'typography', 'borderRadius', 'shadows', 'all'],
              description: 'Type of tokens to retrieve, or "all" for everything'
            }
          },
          required: ['systemId']
        },
        // MCP Apps: Show interactive token viewer
        _meta: {
          ui: {
            resourceUri: UI_APPS['token-viewer'].uri
          }
        }
      },
      {
        name: 'search_components',
        description: 'Search for components across all design systems by name or category',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search term for component name or category'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'get_theme_tokens',
        description: 'Get tokens from a specific theme within a design system',
        inputSchema: {
          type: 'object',
          properties: {
            systemId: {
              type: 'string',
              description: 'The ID of the design system'
            },
            themeId: {
              type: 'string',
              description: 'The ID of the theme'
            }
          },
          required: ['systemId', 'themeId']
        }
      },
      {
        name: 'export_css_variables',
        description: 'Export design tokens as CSS custom properties (variables)',
        inputSchema: {
          type: 'object',
          properties: {
            systemId: {
              type: 'string',
              description: 'The ID of the design system'
            },
            themeId: {
              type: 'string',
              description: 'The ID of the theme (optional, uses active theme if not specified)'
            }
          },
          required: ['systemId']
        }
      },
      {
        name: 'get_sync_status',
        description: 'Get the current sync status and metadata about loaded design systems',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      // Pattern tools for AI code generation - with MCP Apps UI
      {
        name: 'list_patterns',
        description: 'List all available UI patterns organized by category. Returns an interactive pattern gallery UI. Patterns include ready-to-use JSX code, token usage info, and guidance on when to use each pattern.',
        inputSchema: {
          type: 'object',
          properties: {
            intent: {
              type: 'string',
              enum: ['web-app', 'ecommerce', 'mobile', 'landing', 'web-editorial', 'dashboard', 'saas', 'auth'],
              description: 'Optional: Filter patterns by design intent'
            }
          },
          required: []
        },
        // MCP Apps: Show pattern gallery UI
        _meta: {
          ui: {
            resourceUri: UI_APPS['pattern-gallery'].uri
          }
        }
      },
      {
        name: 'search_patterns',
        description: 'Search for UI patterns by keyword. Returns an interactive pattern gallery UI with matching patterns. Use this to find patterns for specific use cases like "newsletter", "discount popup", "waitlist", etc.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search term (e.g., "newsletter", "modal", "banner", "signup")'
            }
          },
          required: ['query']
        },
        // MCP Apps: Show pattern gallery UI with search results
        _meta: {
          ui: {
            resourceUri: UI_APPS['pattern-gallery'].uri
          }
        }
      },
      {
        name: 'get_pattern',
        description: 'Get a specific pattern variant with full JSX code, token usage, component list, and usage guidance. Use this when you need the actual code for a pattern.',
        inputSchema: {
          type: 'object',
          properties: {
            categoryId: {
              type: 'string',
              description: 'The category ID (e.g., "email-capture")'
            },
            variantId: {
              type: 'string',
              description: 'The variant ID (e.g., "simple-card", "popup-discount")'
            }
          },
          required: ['categoryId', 'variantId']
        }
      },
      {
        name: 'get_patterns_using_token',
        description: 'Find patterns that use a specific design token. Useful for understanding how tokens are used in practice.',
        inputSchema: {
          type: 'object',
          properties: {
            tokenClass: {
              type: 'string',
              description: 'The token class to search for (e.g., "gap-lg", "primary", "shadow-xl")'
            }
          },
          required: ['tokenClass']
        }
      }
    ]
  };
});

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Fetch latest data before processing
  await fetchLiveData();

  switch (name) {
    case 'list_design_systems': {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            designSystems: liveDesignSystems.map(system => ({
              id: system.id,
              name: system.name,
              description: system.description,
              uiLibrary: system.uiLibrary || 'custom',
              themes: system.themes?.map(t => ({ id: t.id, name: t.name })),
              activeThemeId: system.activeThemeId,
              intents: system.intents,
              createdAt: system.createdAt
            })),
            total: liveDesignSystems.length,
            lastSync: lastSyncTime
          }, null, 2)
        }]
      };
    }

    case 'get_design_system': {
      const system = liveDesignSystems.find(s => s.id === args.systemId);
      if (!system) {
        throw new Error(`Design system '${args.systemId}' not found`);
      }

      const activeTheme = system.themes?.find(t => t.id === system.activeThemeId) || system.themes?.[0];

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            ...system,
            tokens: activeTheme ? {
              colors: activeTheme.colors || {},
              spacing: activeTheme.spacing || {},
              typography: activeTheme.typography || {},
              borderRadius: activeTheme.borderRadius || {},
              shadows: activeTheme.shadows || {}
            } : {}
          }, null, 2)
        }]
      };
    }

    case 'get_design_tokens': {
      const system = liveDesignSystems.find(s => s.id === args.systemId);
      if (!system) {
        throw new Error(`Design system '${args.systemId}' not found`);
      }

      const activeTheme = system.themes?.find(t => t.id === system.activeThemeId) || system.themes?.[0];
      if (!activeTheme) {
        throw new Error(`No active theme found for system '${args.systemId}'`);
      }

      const tokenType = args.tokenType || 'all';

      if (tokenType === 'all') {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              colors: activeTheme.colors || {},
              spacing: activeTheme.spacing || {},
              typography: activeTheme.typography || {},
              borderRadius: activeTheme.borderRadius || {},
              shadows: activeTheme.shadows || {}
            }, null, 2)
          }]
        };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(activeTheme[tokenType] || {}, null, 2)
        }]
      };
    }

    case 'search_components': {
      const query = args.query.toLowerCase();
      const results = [];

      liveDesignSystems.forEach(system => {
        if (system.intents) {
          system.intents.forEach(intent => {
            const intentStr = typeof intent === 'string' ? intent : intent.category || '';
            if (intentStr.toLowerCase().includes(query)) {
              results.push({
                systemId: system.id,
                systemName: system.name,
                intent: intentStr,
                type: 'intent'
              });
            }
          });
        }
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            query: args.query,
            results,
            totalResults: results.length
          }, null, 2)
        }]
      };
    }

    case 'get_theme_tokens': {
      const system = liveDesignSystems.find(s => s.id === args.systemId);
      if (!system) {
        throw new Error(`Design system '${args.systemId}' not found`);
      }

      const theme = system.themes?.find(t => t.id === args.themeId);
      if (!theme) {
        throw new Error(`Theme '${args.themeId}' not found in system '${args.systemId}'`);
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            themeId: theme.id,
            themeName: theme.name,
            tokens: {
              colors: theme.colors || {},
              spacing: theme.spacing || {},
              typography: theme.typography || {},
              borderRadius: theme.borderRadius || {},
              shadows: theme.shadows || {}
            }
          }, null, 2)
        }]
      };
    }

    case 'export_css_variables': {
      const system = liveDesignSystems.find(s => s.id === args.systemId);
      if (!system) {
        throw new Error(`Design system '${args.systemId}' not found`);
      }

      const theme = args.themeId
        ? system.themes?.find(t => t.id === args.themeId)
        : system.themes?.find(t => t.id === system.activeThemeId) || system.themes?.[0];

      if (!theme) {
        throw new Error(`Theme not found`);
      }

      let css = `:root {\n  /* ${system.name} - ${theme.name} */\n\n`;

      // Colors
      if (theme.colors) {
        css += `  /* Colors */\n`;
        Object.entries(theme.colors).forEach(([key, value]) => {
          css += `  --color-${key}: ${value};\n`;
        });
        css += '\n';
      }

      // Spacing
      if (theme.spacing) {
        css += `  /* Spacing */\n`;
        Object.entries(theme.spacing).forEach(([key, value]) => {
          css += `  --spacing-${key}: ${value};\n`;
        });
        css += '\n';
      }

      // Typography
      if (theme.typography) {
        css += `  /* Typography */\n`;
        Object.entries(theme.typography).forEach(([key, value]) => {
          css += `  --typography-${key}: ${value};\n`;
        });
        css += '\n';
      }

      // Border Radius
      if (theme.borderRadius) {
        css += `  /* Border Radius */\n`;
        Object.entries(theme.borderRadius).forEach(([key, value]) => {
          css += `  --radius-${key}: ${value};\n`;
        });
        css += '\n';
      }

      // Shadows
      if (theme.shadows) {
        css += `  /* Shadows */\n`;
        Object.entries(theme.shadows).forEach(([key, value]) => {
          css += `  --shadow-${key}: ${value};\n`;
        });
      }

      css += `}\n`;

      return {
        content: [{
          type: 'text',
          text: css
        }]
      };
    }

    case 'get_sync_status': {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'connected',
            transport: 'http',
            lastSync: lastSyncTime,
            totalSystems: liveDesignSystems.length,
            totalPatternCategories: livePatterns.categories?.length || 0,
            serverUrl: activePort ? `http://localhost:${activePort}/mcp` : 'not started',
            reactAppUrl: 'http://localhost:3000'
          }, null, 2)
        }]
      };
    }

    // ========================================================================
    // Pattern Tools
    // ========================================================================

    case 'list_patterns': {
      let categories = livePatterns.categories || [];

      // Filter by intent if specified
      if (args.intent) {
        categories = categories.filter(cat =>
          cat.intents && cat.intents.includes(args.intent)
        );
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            categories: categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              description: cat.description,
              intents: cat.intents,
              icon: cat.icon,
              variantCount: cat.variants?.length || 0,
              variants: cat.variants?.map(v => ({
                id: v.id,
                name: v.name,
                description: v.description,
                useWhen: v.useWhen
              }))
            })),
            totalCategories: categories.length,
            totalVariants: categories.reduce((sum, cat) => sum + (cat.variants?.length || 0), 0)
          }, null, 2)
        }]
      };
    }

    case 'search_patterns': {
      const query = (args.query || '').toLowerCase();
      const results = [];

      for (const category of (livePatterns.categories || [])) {
        for (const variant of (category.variants || [])) {
          let score = 0;

          // Check name match
          if (variant.name.toLowerCase().includes(query)) score += 10;

          // Check description match
          if (variant.description.toLowerCase().includes(query)) score += 5;

          // Check useWhen matches
          for (const useCase of (variant.useWhen || [])) {
            if (useCase.toLowerCase().includes(query)) score += 8;
          }

          // Check component matches
          for (const component of (variant.components || [])) {
            if (component.toLowerCase().includes(query)) score += 3;
          }

          if (score > 0) {
            results.push({
              categoryId: category.id,
              categoryName: category.name,
              variantId: variant.id,
              variantName: variant.name,
              description: variant.description,
              useWhen: variant.useWhen,
              components: variant.components,
              relevanceScore: score
            });
          }
        }
      }

      // Sort by relevance
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            query: args.query,
            results,
            totalResults: results.length
          }, null, 2)
        }]
      };
    }

    case 'get_pattern': {
      const category = (livePatterns.categories || []).find(c => c.id === args.categoryId);
      if (!category) {
        throw new Error(`Pattern category '${args.categoryId}' not found. Available: ${(livePatterns.categories || []).map(c => c.id).join(', ')}`);
      }

      const variant = (category.variants || []).find(v => v.id === args.variantId);
      if (!variant) {
        throw new Error(`Pattern variant '${args.variantId}' not found in category '${args.categoryId}'. Available: ${(category.variants || []).map(v => v.id).join(', ')}`);
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            categoryId: category.id,
            categoryName: category.name,
            pattern: {
              id: variant.id,
              name: variant.name,
              description: variant.description,
              code: variant.code,
              tokens: variant.tokens,
              components: variant.components,
              useWhen: variant.useWhen,
              customizable: variant.customizable,
              addedBy: variant.addedBy
            }
          }, null, 2)
        }]
      };
    }

    case 'get_patterns_using_token': {
      const tokenClass = args.tokenClass || '';
      const results = [];

      for (const category of (livePatterns.categories || [])) {
        for (const variant of (category.variants || [])) {
          const allTokens = [
            ...(variant.tokens?.spacing || []),
            ...(variant.tokens?.colors || []),
            ...(variant.tokens?.radius || []),
            ...(variant.tokens?.shadows || []),
            ...(variant.tokens?.typography || []),
          ];

          if (allTokens.some(t => t.includes(tokenClass))) {
            results.push({
              categoryId: category.id,
              categoryName: category.name,
              variantId: variant.id,
              variantName: variant.name,
              matchingTokens: allTokens.filter(t => t.includes(tokenClass))
            });
          }
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            tokenClass,
            results,
            totalResults: results.length
          }, null, 2)
        }]
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// ============================================================================
// HTTP Transport Setup
// ============================================================================

const transport = new StreamableHTTPServerTransport();

// Connect transport to MCP server
await mcpServer.connect(transport);

// Create Node.js HTTP server
// Try ports in sequence to find an available one
const PREFERRED_PORTS = [3005, 3006, 3007, 3008];
let activePort = null;

const server = createServer(async (req, res) => {
  // Add CORS headers to all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, mcp-session-id, Last-Event-ID',
    'Access-Control-Expose-Headers': 'mcp-session-id, mcp-protocol-version'
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Handle MCP requests with StreamableHTTPServerTransport
  if (req.url === '/mcp' && req.method === 'POST') {
    await transport.handleRequest(req, res);
    return;
  }

  // Handle health check
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      server: 'living-design-library-mcp',
      version: '2.0.0',
      port: activePort,
      transport: 'http-streamable',
      mcpApps: true,
      uiApps: Object.keys(UI_APPS),
      lastSync: lastSyncTime,
      designSystems: liveDesignSystems.length,
      dataSource: dataSource,
      syncFailures: syncFailureCount
    }));
    return;
  }

  // Handle token sync for Web Components package
  if (req.url === '/api/sync-component-tokens' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { tokens, themeName, themeId } = JSON.parse(body);

        if (!tokens) {
          res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing tokens in request body' }));
          return;
        }

        // Write tokens to the Web Components package
        const tokensPath = join(__dirname, '..', '..', 'packages', 'components', 'src', 'styles', 'tokens.css');

        // Ensure directory exists
        const tokensDir = dirname(tokensPath);
        if (!existsSync(tokensDir)) {
          const { mkdirSync } = await import('node:fs');
          mkdirSync(tokensDir, { recursive: true });
        }

        writeFileSync(tokensPath, tokens, 'utf-8');

        console.error(`✅ Synced tokens for theme "${themeName || themeId}" to Web Components package`);

        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Tokens synced successfully to ${tokensPath}`,
          themeName: themeName || themeId,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('❌ Token sync error:', error.message);
        res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // Serve UI Apps directly (for testing and preview)
  if (req.url?.startsWith('/ui/') && req.method === 'GET') {
    const appName = req.url.replace('/ui/', '').replace('.html', '').split('?')[0];
    const app = UI_APPS[appName];

    if (app) {
      let content = '';
      if (existsSync(app.filePath)) {
        content = readFileSync(app.filePath, 'utf-8');
      } else {
        const distPath = app.filePath.replace('ui-apps/', 'dist/').replace('/index.html', '.html');
        if (existsSync(distPath)) {
          content = readFileSync(distPath, 'utf-8');
        }
      }

      if (content) {
        // Inject live data for standalone testing/preview
        const dataScript = `
          <script>
            window.__MCP_DATA__ = {
              designSystems: ${JSON.stringify(liveDesignSystems)},
              patterns: ${JSON.stringify(livePatterns)},
              systemName: '${liveDesignSystems[0]?.name || 'Demo Design System'}',
              tokens: ${JSON.stringify(getActiveTokens())}
            };
          </script>
        `;
        content = content.replace('</head>', `${dataScript}</head>`);

        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'text/html' });
        res.end(content);
        return;
      }
    }

    res.writeHead(404, { ...corsHeaders, 'Content-Type': 'text/plain' });
    res.end(`UI App not found: ${appName}. Available: ${Object.keys(UI_APPS).join(', ')}`);
    return;
  }

  // List available UI apps
  if (req.url === '/ui' && req.method === 'GET') {
    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      apps: Object.entries(UI_APPS).map(([id, app]) => ({
        id,
        name: app.name,
        description: app.description,
        previewUrl: `http://localhost:${PORT}/ui/${id}`,
        resourceUri: app.uri
      }))
    }, null, 2));
    return;
  }

  // 404 for other routes
  res.writeHead(404, { ...corsHeaders, 'Content-Type': 'text/plain' });
  res.end('Not Found. Available endpoints: /mcp, /health, /ui, /ui/{app-name}');
});

// Helper to get active tokens from first design system
function getActiveTokens() {
  if (liveDesignSystems.length === 0) {
    return {
      colors: { primary: '221 83% 53%', background: '0 0% 100%' },
      spacing: { sm: '0.5rem', md: '1rem' },
      typography: {},
      borderRadius: { md: '0.375rem' },
      shadows: { md: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
    };
  }

  const system = liveDesignSystems[0];
  const theme = system.themes?.find(t => t.id === system.activeThemeId) || system.themes?.[0];

  return {
    colors: theme?.colors || {},
    spacing: theme?.spacing || {},
    typography: theme?.typography || {},
    borderRadius: theme?.borderRadius || {},
    shadows: theme?.shadows || {}
  };
}

// Try to start server on available port
function tryListen(portIndex = 0) {
  if (portIndex >= PREFERRED_PORTS.length) {
    console.error(`\n❌ Could not start MCP server - all ports (${PREFERRED_PORTS.join(', ')}) are in use`);
    process.exit(1);
  }

  const port = PREFERRED_PORTS[portIndex];

  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`   Port ${port} in use, trying next...`);
      server.removeAllListeners('error');
      tryListen(portIndex + 1);
    } else {
      console.error(`\n❌ Server error:`, err);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    activePort = port;
    console.error(`\n✅ Living Design Library MCP HTTP Server v2.0.0`);
    console.error(`   ┌─────────────────────────────────────────────────┐`);
    console.error(`   │  MCP Endpoint:  http://localhost:${port}/mcp       │`);
    console.error(`   │  Health Check:  http://localhost:${port}/health    │`);
    console.error(`   │  UI Apps List:  http://localhost:${port}/ui        │`);
    console.error(`   └─────────────────────────────────────────────────┘`);
    console.error(`\n   🎨 MCP Apps (Interactive UIs):`);
    Object.entries(UI_APPS).forEach(([id, app]) => {
      console.error(`      • ${app.name}: http://localhost:${port}/ui/${id}`);
    });
    console.error(`\n   Transport: StreamableHTTP`);
    console.error(`   Syncing from: http://localhost:3000/api/mcp/data\n`);
  });
}

tryListen();
