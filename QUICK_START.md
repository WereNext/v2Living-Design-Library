# Living Design Library - Quick Start with MCP

Get up and running in 30 seconds! 🚀

---

## The Fastest Way

```bash
npm run dev:full
```

That's it! Both the app and MCP server are now running.

- **App:** http://localhost:3001 (or 3002, 3003 if port busy)
- **MCP Server:** Running in parallel, ready for Claude Code

---

## What You Get

### ✅ App Running
- Design System Builder
- Component Library
- Figma Token Import
- Multi-Theme Support
- Code Export (React, Vue, HTML, Svelte)

### ✅ MCP Server Running
- 13 AI agent tools available
- Real-time data sync
- Component code generation
- Claude Code integration active

---

## Verify It's Working

### Check the App
Open http://localhost:3001 (check terminal for exact port)

### Check MCP Server
In Claude Code, ask:
> "List my design systems using the MCP server"

Should return the Demo Design System.

---

## Your Options

| Command | Use Case |
|---------|----------|
| `npm run dev:full` | **Recommended:** App + MCP together |
| `npm run dev` | App only (no MCP) |
| `npm run mcp:start` | MCP only |
| `./start-with-mcp.sh` | Background MCP + App |

---

## First Steps

### 1. Create a Design System
```
In the app:
→ Click "Design System Builder"
→ Add your colors, spacing, typography
→ Click "Generate Design System"
```

### 2. Export for MCP
```
→ Click "MCP Config" in sidebar
→ Click "Export for MCP"
→ Save app-data.json to src/mcp-server/
→ MCP server auto-reloads!
```

### 3. Generate Components with AI
```
In Claude Code:
"Generate a React Button component using my design system"
```

---

## Stop the Servers

Press `Ctrl+C` in the terminal

Both app and MCP server will stop gracefully.

---

## Next Steps

- **Read:** [MCP_AUTO_LAUNCH.md](MCP_AUTO_LAUNCH.md) for all launch options
- **Read:** [MCP_SETUP_COMPLETE.md](MCP_SETUP_COMPLETE.md) for full setup guide
- **Read:** [src/mcp-server/README.md](src/mcp-server/README.md) for MCP documentation

---

## Troubleshooting

**App won't start?**
```bash
# Check if port is busy
lsof -i :3001
# Kill process if needed
```

**MCP not working?**
```bash
# Check if app-data.json exists
ls src/mcp-server/app-data.json
# Should exist with demo data
```

**Need help?**
Check the full documentation in the files above.

---

## Architecture at a Glance

```
┌─────────────────────────────────────────┐
│  Living Design Library App              │
│  http://localhost:3001                  │
│  ├─ Design System Builder               │
│  ├─ Component Library                   │
│  ├─ Figma Import                        │
│  └─ Export to MCP                       │
└─────────────────────────────────────────┘
              ↓ exports
┌─────────────────────────────────────────┐
│  app-data.json                          │
│  (Design systems + themes + tokens)    │
└─────────────────────────────────────────┘
              ↓ reads
┌─────────────────────────────────────────┐
│  MCP Server                             │
│  13 AI agent tools                      │
│  ├─ list_design_systems                 │
│  ├─ get_component_code                  │
│  ├─ import_figma_tokens                 │
│  └─ ... 10 more tools                   │
└─────────────────────────────────────────┘
              ↓ connects to
┌─────────────────────────────────────────┐
│  Claude Code                            │
│  "Generate a Button using my tokens"   │
└─────────────────────────────────────────┘
```

---

## That's It!

You're ready to build design systems and generate components with AI.

**Have fun!** 🎨✨

---

**Last Updated:** January 22, 2026
