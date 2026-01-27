# In-App MCP Documentation Updates

All in-app MCP instructions and JSON configurations have been updated to reflect the current setup.

---

## Files Updated

### 1. MCPConfig.tsx ✅
**Location:** `src/components/MCPConfig.tsx`

**Updates Made:**
- ✅ Updated server path to actual location: `/Users/marce/Documents/GitHub/v2Living-Design-Library/src/mcp-server/index.js`
- ✅ Changed Step 1 from manual install to `npm run dev:full` command
- ✅ Added info about color-coded parallel logs
- ✅ Updated Step 3 to show pre-configured path (no need to change)
- ✅ Added alert about Claude Code auto-starting MCP server
- ✅ Clarified that MCP runs independently when using Claude Code
- ✅ Updated AI tool list to include Claude Code, Cline, Continue.dev, Zed
- ✅ Kept all 13 MCP tools documentation
- ✅ Kept visual-first workflow examples
- ✅ Kept page templates and composition guides info

**JSON Configuration Shown:**
```json
{
  "mcpServers": {
    "living-design-library": {
      "command": "node",
      "args": [
        "/Users/marce/Documents/GitHub/v2Living-Design-Library/src/mcp-server/index.js"
      ]
    }
  }
}
```

### 2. MCPExport.tsx ✅
**Location:** `src/components/MCPExport.tsx`

**Updates Made:**
- ✅ Updated description to list all 4 supported AI tools: Claude Code, Cline, Continue.dev, Zed
- ✅ Changed directory path from `/mcp-server` to `src/mcp-server/`
- ✅ Added note about MCP server auto-reload feature
- ✅ Updated Quick Setup steps to mention `npm run dev:full`
- ✅ Added step 5 about running both app and MCP together
- ✅ Clarified that exported file replaces demo data

**Quick Setup Steps Now Show:**
1. Click "Export for MCP" to download app-data.json
2. Move the file to `src/mcp-server/` directory (replaces demo data)
3. MCP server auto-reloads - no restart needed!
4. AI agents can now access your real design systems
5. Run `npm run dev:full` to start both app and MCP together

---

## What Users Will See

### In the MCP Config Page

**Step 1: Launch the App with MCP**
```bash
npm run dev:full
```
This starts both the app (on http://localhost:3001) and the MCP server in parallel with color-coded logs.

**Step 2: Find Configuration File**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

**Step 3: Add MCP Server Configuration**
Copy this JSON (path already configured):
```json
{
  "mcpServers": {
    "living-design-library": {
      "command": "node",
      "args": [
        "/Users/marce/Documents/GitHub/v2Living-Design-Library/src/mcp-server/index.js"
      ]
    }
  }
}
```

**Step 4: Restart Claude Code**
The MCP server will auto-start when Claude Code launches. No need to run `npm run dev:full` separately!

---

## Supported AI Tools (All Documented)

### ✅ Claude Code
- Full native support
- Auto-starts MCP server
- 13 tools available
- Setup instructions included

### ✅ Cline
- VS Code extension
- Copy-paste MCP config UI
- Setup instructions included

### ✅ Continue.dev
- VS Code & JetBrains
- Config file setup
- Setup instructions included

### ✅ Zed
- Native editor support
- Context servers config
- Setup instructions included

---

## Available MCP Tools (All 13 Documented)

### Design System Management
- list_design_systems
- get_design_system
- create_design_system
- set_active_system

### Import & Templates
- import_figma_tokens
- list_library_templates
- load_library_template

### Components & Code
- list_components
- get_component_code

### Design Tokens
- get_design_tokens

### Page Templates
- get_page_template
- list_page_templates

### Composition Guides
- get_composition_guide

---

## Example Conversations (Shown in App)

### Basic Examples
- "Import my Figma design tokens and create a design system called 'AcmeApp'"
- "Load the shadcn/ui template for my dashboard project"
- "Give me Button, Card, and Modal components in React"
- "Show me all the color tokens from my active design system"

### Page Template Examples (⭐ Highlighted)
- "Give me a complete dashboard page in React"
- "How do I compose a data table with filters?"
- "Show me an e-commerce product page template in Vue"

### Visual-First Examples (🎨 Highlighted)
- [Upload screenshot] "Code this dashboard exactly as shown, using components from my MCP design library"
- [Upload mockup] "Build this in React. Use my design system for colors and spacing"
- [Upload form] "Create this checkout form with validation. Match the spacing and button styles exactly"

---

## Visual-First Workflow (Prominently Featured)

The app now prominently features the **Visual-First Agentic Coding** workflow:

### Traditional Approach ❌
- Developer guesses spacing values
- Colors don't match design
- Typography is inconsistent
- Components reinvented each time

### With MCP + Screenshot ✅
- AI sees exact visual design
- Uses your design system tokens
- Pulls pre-built components
- Pixel-perfect to original

### Complete Workflow
1. Design high-fidelity mockup in Figma
2. Export Figma variables as JSON, import to this library
3. Take screenshot of your Figma frame
4. Upload to MCP-compatible AI tool with instruction: "Code this using my MCP design library"
5. AI sees the visual + accesses your tokens/components + generates pixel-perfect code

---

## Key Paths Referenced

### Configuration
- `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)
- `%APPDATA%/Claude/claude_desktop_config.json` (Windows)

### MCP Server
- `src/mcp-server/index.js` (Server entry point)
- `src/mcp-server/app-data.json` (Data file - replaces demo)

### Commands
- `npm run dev:full` (Start app + MCP together)
- `npm run dev` (App only)
- `npm run mcp:start` (MCP only)

---

## Auto-Reload Feature

**Highlighted in the app:**
> The MCP server watches `app-data.json` and auto-reloads when it changes!

This means:
1. Export from app
2. Replace file
3. MCP server detects change
4. Automatically reloads new data
5. No manual restart needed

---

## Status

✅ **All in-app MCP documentation is now accurate and up-to-date**
✅ **JSON configurations show correct paths**
✅ **All 4 supported AI tools documented**
✅ **All 13 MCP tools listed**
✅ **Visual-first workflow prominently featured**
✅ **Auto-reload feature explained**
✅ **npm run dev:full command recommended**

---

## User Journey

1. **User opens MCP Config page** → Sees updated instructions
2. **Clicks Export for MCP** → Downloads app-data.json with clear instructions
3. **Follows setup** → `npm run dev:full` command
4. **Copies JSON** → Pre-configured path, no editing needed
5. **Restarts Claude Code** → MCP auto-starts
6. **Starts coding** → 13 tools available immediately

---

**Last Updated:** January 22, 2026
**Status:** Complete and production-ready
