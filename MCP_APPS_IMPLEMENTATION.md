# MCP Apps Implementation Plan

## Overview

Integrate the new MCP Apps extension with Living Design Library's existing MCP server to provide **interactive UI components** that render directly in AI conversations (Claude, ChatGPT, VS Code, etc.).

## Current State

- **HTTP MCP Server**: `src/mcp-server/http-server.js` running on port 3005
- **Tools Available**:
  - `list_design_systems` - List all design systems
  - `get_design_system` - Get specific system details
  - `get_design_tokens` - Get tokens (colors, spacing, etc.)
  - `export_css_variables` - Export as CSS
  - `list_patterns` - List UI patterns
  - `search_patterns` - Search patterns
  - `get_pattern` - Get pattern code

## MCP Apps Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Host (Claude/ChatGPT)                │
├─────────────────────────────────────────────────────────────┤
│  Tool Call: get_design_tokens                               │
│  → Returns: { data: {...}, _meta: { ui: { resourceUri } } } │
│  → Host fetches ui://living-design-library/token-viewer     │
│  → Renders interactive UI in sandboxed iframe               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              MCP Server (http-server.js)                    │
├─────────────────────────────────────────────────────────────┤
│  /mcp                  - MCP JSON-RPC endpoint              │
│  /ui/token-viewer      - Token Viewer UI bundle             │
│  /ui/pattern-gallery   - Pattern Gallery UI bundle          │
│  /ui/dashboard         - Design System Dashboard            │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Phases

### Phase 1: Infrastructure Setup
- [ ] Add `@modelcontextprotocol/ext-apps` dependency
- [ ] Create UI apps folder structure
- [ ] Set up Vite build for UI bundles
- [ ] Update http-server.js with resource handlers

### Phase 2: Token Viewer UI
- [ ] Interactive color swatches with hex/hsl values
- [ ] Spacing scale visualization
- [ ] Typography preview
- [ ] Border radius preview
- [ ] Shadow visualization
- [ ] Copy-to-clipboard functionality

### Phase 3: Pattern Gallery UI
- [ ] Visual pattern cards with thumbnails
- [ ] Category filtering
- [ ] Search functionality
- [ ] Code preview panel
- [ ] "Use this pattern" action

### Phase 4: Design System Dashboard
- [ ] Overview stats (token counts, themes)
- [ ] Theme switcher
- [ ] Live component preview
- [ ] Export options

## Folder Structure

```
src/mcp-server/
├── http-server.js          # Main MCP server (update)
├── package.json            # Add ext-apps dependency
├── ui-apps/                # NEW: UI applications
│   ├── token-viewer/
│   │   ├── index.html
│   │   ├── app.ts
│   │   └── styles.css
│   ├── pattern-gallery/
│   │   ├── index.html
│   │   ├── app.ts
│   │   └── styles.css
│   └── dashboard/
│       ├── index.html
│       ├── app.ts
│       └── styles.css
├── dist/                   # Built UI bundles
│   ├── token-viewer.html
│   ├── pattern-gallery.html
│   └── dashboard.html
└── vite.config.ts          # Build config
```

## Tool Updates

Each tool that returns visual data will include `_meta.ui`:

```javascript
{
  name: 'get_design_tokens',
  description: 'Get design tokens with interactive preview',
  inputSchema: { /* ... */ },
  _meta: {
    ui: {
      resourceUri: "ui://living-design-library/token-viewer"
    }
  }
}
```

## UI Component Communication

```typescript
// In UI app (e.g., token-viewer/app.ts)
import { App } from "@modelcontextprotocol/ext-apps";

const app = new App();
await app.connect();

// Receive data from tool result
app.ontoolresult = (result) => {
  const tokens = result.tokens;
  renderColorSwatches(tokens.colors);
  renderSpacingScale(tokens.spacing);
};

// User clicks a color → update model context
colorSwatch.onclick = () => {
  app.updateModelContext({
    content: [{
      type: "text",
      text: `User selected color: ${colorName} (${colorValue})`
    }]
  });
};

// User wants more details → call server tool
const details = await app.callServerTool({
  name: "get_design_system",
  arguments: { systemId: currentSystemId }
});
```

## Security Considerations

MCP Apps run in sandboxed iframes with:
- Restricted permissions (no parent access)
- Pre-declared templates
- Auditable JSON-RPC messages
- User consent for tool calls from UI

## Testing

1. Build UI apps: `npm run build:ui`
2. Start MCP server: `npm run start`
3. Connect from Claude Desktop or VS Code
4. Call tool: "Show me the design tokens for my SaaS Dashboard system"
5. Verify interactive UI renders

## Resources

- [MCP Apps Blog Post](http://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)
- [MCP Apps GitHub](https://github.com/modelcontextprotocol/ext-apps)
- [API Docs](https://modelcontextprotocol.github.io/ext-apps/api/)
- [Quickstart](https://modelcontextprotocol.github.io/ext-apps/api/documents/Quickstart.html)
