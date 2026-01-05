# Living Design Library MCP Server - Data Sync Guide

## Overview

The MCP server now **dynamically syncs with your actual app data** instead of using dummy in-memory storage. This means AI agents can access your real design systems, themes, components, and intents.

## How It Works

### 1. Export from App
- Open the Living Design Library web app
- Navigate to Settings > MCP Config
- Click "Export for MCP" button
- Downloads `app-data.json` file

### 2. Place File
- Move `app-data.json` to `/mcp-server/` directory (same folder as `index.js`)
- The MCP server watches for this file

### 3. Auto-Sync
- MCP server loads data on startup
- File watcher auto-reloads when you export again
- No manual restarts needed!

## What Gets Synced

The exported `app-data.json` contains:

```json
{
  "metadata": {
    "exportedAt": "2026-01-03T12:00:00.000Z",
    "exportedFrom": "Living Design Library",
    "version": "1.0.0",
    "format": "mcp-sync",
    "totalSystems": 3
  },
  "designSystems": [
    {
      "id": "system-123",
      "name": "My Design System",
      "description": "Production design tokens",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "themes": [
        {
          "id": "theme-456",
          "name": "Light Theme",
          "colors": { "primary": "221 83% 53%", ... },
          "spacing": { "md": "1rem", ... },
          "typography": { ... },
          "borderRadius": { ... },
          "shadows": { ... }
        }
      ],
      "activeThemeId": "theme-456",
      "intents": ["Web App", "Dashboard"],
      "versions": [...]
    }
  ]
}
```

## For AI Agents

When an AI agent connects to the MCP server, it can now:

### ✅ Access Real Systems
```
Agent: "List all my design systems"
→ Returns your actual systems from app
```

### ✅ Use Real Tokens
```
Agent: "Get tokens from 'My Design System'"
→ Returns actual colors, spacing, etc. from your active theme
```

### ✅ Export Real Components
```
Agent: "Give me Button in React using my design tokens"
→ Uses your actual token values in generated code
```

### ✅ See Real Intents
```
Agent: "What components are available?"
→ Returns components from your configured intents
```

## Data Transformation

The MCP server automatically transforms your app data:

### Theme → Tokens
Your app uses **themes within design systems**. The MCP server flattens the active theme's tokens for component generation:

```javascript
// App Structure
designSystem = {
  themes: [
    { name: "Light", colors: {...}, spacing: {...} },
    { name: "Dark", colors: {...}, spacing: {...} }
  ],
  activeThemeId: "light-theme-id"
}

// MCP Format (auto-transformed)
mcpSystem = {
  tokens: {
    colors: { /* from active theme */ },
    spacing: { /* from active theme */ },
    // ... etc
  }
}
```

### Dynamic Components
Instead of hardcoded components, the server extracts:
- All components from your intents
- All intent categories you've defined
- Custom components you've imported

## Best Practices

### 1. Regular Exports
Export your data whenever you:
- Create a new design system
- Add/modify themes
- Change active theme
- Add new component intents

### 2. DSPy Framework Usage
AI agents using DSPy should:

**Step 1:** Get app info
```python
response = call_tool("get_app_info", { "section": "all" })
```

**Step 2:** List real systems
```python
systems = call_tool("list_design_systems", {})
# Returns actual user systems, not dummy data
```

**Step 3:** Work with real data
```python
tokens = call_tool("get_design_tokens", {
  "systemId": systems[0]["id"],
  "tokenType": "colors"
})
# Returns user's actual color palette
```

## Troubleshooting

### "No design systems found"
→ You haven't exported from the app yet. Go to Settings > MCP Config > Export for MCP

### "Design system not found"
→ The exported data doesn't include that system. Re-export from the app

### "Components not matching"
→ Export again - the component list is dynamic based on your intents

### Data Not Updating
→ The file watcher should auto-reload, but you can also restart the MCP server:
```bash
# Kill the server process and restart
```

## For Developers

### Data Sync Module
See `/mcp-server/data-sync.js` for:
- `loadAppData()` - Loads and validates JSON
- `watchAppData()` - File system watcher
- `transformToMCPFormat()` - Converts app format to MCP format
- `extractAvailableComponents()` - Dynamically extracts components
- `extractAvailableIntents()` - Dynamically extracts intents

### File Location
The MCP server looks for:
```
/mcp-server/app-data.json
```

Must be in the same directory as `index.js`

### Programmatic Export
If building integrations, export format:
```javascript
const exportData = {
  metadata: {
    exportedAt: new Date().toISOString(),
    exportedFrom: 'Living Design Library',
    version: '1.0.0',
    format: 'mcp-sync'
  },
  designSystems: [...] // Full array from useDesignSystems hook
};
```

## Security Note

The MCP server runs **locally on your machine** and reads from a **local JSON file**. Your design system data never leaves your computer unless you explicitly share the MCP configuration with an AI service.

The exported `app-data.json` should be treated as **source code** - it contains your design system but not sensitive user data.

## Future Enhancements

Potential improvements:
- [ ] Bi-directional sync (AI creates systems → imported to app)
- [ ] WebSocket live sync (no export needed)
- [ ] Git integration (commit on export)
- [ ] Conflict resolution for multi-user teams
- [ ] Encrypted export for sensitive tokens

## Questions?

See the main [README.md](./README.md) for full MCP server documentation.
