# Auto-Launch MCP Server with the App

You now have **3 ways** to automatically start the MCP server when launching the Living Design Library app.

---

## Option 1: Use `npm run dev:full` (Recommended)

**Best for:** Development with real-time logs and easy debugging

### Usage
```bash
npm run dev:full
```

### What It Does
- Launches **both** the app and MCP server in parallel
- Shows color-coded logs (cyan for APP, magenta for MCP)
- Both processes run in the same terminal
- Press `Ctrl+C` to stop both

### Example Output
```
[APP]  VITE v6.3.5  ready in 457 ms
[APP]  ➜  Local:   http://localhost:3001/
[MCP]  ✅ Loaded 1 design systems from app
[MCP]  Living Design Library MCP Server running on stdio
```

---

## Option 2: Use the Launch Script

**Best for:** Background MCP server with clean separation

### Usage
```bash
./start-with-mcp.sh
# or
npm run dev:with-mcp
```

### What It Does
- Starts MCP server in background first
- Then launches the app in foreground
- MCP logs saved to `/tmp/ldl-mcp-server.log`
- Automatically cleans up MCP server when you exit

### Example Output
```
🚀 Starting Living Design Library with MCP Server...

🔧 Starting MCP server...
✅ MCP server running (PID: 12345)
   Log: /tmp/ldl-mcp-server.log

🎨 Starting app...

  VITE v6.3.5  ready in 457 ms
  ➜  Local:   http://localhost:3001/
```

### Check MCP Logs
```bash
tail -f /tmp/ldl-mcp-server.log
```

---

## Option 3: Claude Code Auto-Starts It

**Best for:** When using Claude Code

### What Happens
- Claude Code automatically launches the MCP server when it starts
- The server runs as long as Claude Code is open
- No manual startup needed
- Configured in: `~/Library/Application Support/Claude/claude_desktop_config.json`

### Verify It's Running
In Claude Code, ask:
> "What MCP servers are available?"

Should show `living-design-library` in the list.

---

## Comparison Table

| Method | When to Use | Pros | Cons |
|--------|------------|------|------|
| **`npm run dev:full`** | Active development | Parallel logs, easy debugging | Both in same terminal |
| **`./start-with-mcp.sh`** | Background MCP | Clean separation, background logs | Extra script |
| **Claude Code** | Using AI agent | Auto-starts, no manual work | Only when Claude Code is open |

---

## Available npm Scripts

```bash
npm run dev              # App only (no MCP)
npm run dev:full         # App + MCP (parallel, color-coded logs)
npm run dev:with-mcp     # App + MCP (background MCP)
npm run mcp:start        # MCP server only
npm run mcp:dev          # MCP server with auto-reload on file changes
npm run build            # Build for production
npm run test             # Run tests
```

---

## How It Works Under the Hood

### Option 1: `npm run dev:full`
Uses `concurrently` package to run both processes in parallel:
```json
{
  "scripts": {
    "dev:full": "concurrently \"npm:dev\" \"npm:mcp:start\" --names \"APP,MCP\" --prefix-colors \"cyan,magenta\""
  }
}
```

### Option 2: `./start-with-mcp.sh`
Bash script that:
1. Checks MCP dependencies installed
2. Starts MCP server in background
3. Saves PID to `/tmp/ldl-mcp-server.pid`
4. Launches app in foreground
5. Traps EXIT signal to cleanup

### Option 3: Claude Code
Claude Code config:
```json
{
  "mcpServers": {
    "living-design-library": {
      "command": "node",
      "args": ["/full/path/to/src/mcp-server/index.js"]
    }
  }
}
```

---

## Troubleshooting

### Issue: "MCP server not starting"
**Check if port is in use:**
```bash
ps aux | grep "mcp-server"
kill <PID>  # if found
```

**Check logs:**
```bash
# For launch script method
cat /tmp/ldl-mcp-server.log

# For dev:full method
# Logs show inline
```

### Issue: "concurrently command not found"
**Solution:**
```bash
npm install --save-dev concurrently
```

### Issue: "Permission denied: ./start-with-mcp.sh"
**Solution:**
```bash
chmod +x start-with-mcp.sh
```

### Issue: "MCP server exits immediately"
**Check if app-data.json exists:**
```bash
ls -la src/mcp-server/app-data.json
```

If missing, export from the app or use demo data.

---

## Recommended Workflow

### For Development
```bash
# Terminal 1: App + MCP with color-coded logs
npm run dev:full

# Terminal 2: Watch tests
npm test
```

### For Production Build
```bash
npm run build
# MCP server is separate for production deployments
```

### For AI Agent Development
1. Open Claude Code (MCP auto-starts)
2. Open Living Design Library in another terminal:
   ```bash
   npm run dev
   ```
3. Both are now running independently

---

## File Structure

```
v2Living-Design-Library/
├── package.json                    # Updated with new scripts
├── start-with-mcp.sh              # Launch script
├── test-mcp.sh                    # Test script
├── src/
│   └── mcp-server/
│       ├── index.js               # MCP server entry point
│       ├── app-data.json          # Design system data
│       └── package.json           # MCP dependencies
└── ~/Library/Application Support/Claude/
    └── claude_desktop_config.json # Claude Code config
```

---

## Advanced: Auto-Start on System Boot (Optional)

### macOS LaunchAgent
Create `~/Library/LaunchAgents/com.livingdesignlibrary.mcp.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.livingdesignlibrary.mcp</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/marce/Documents/GitHub/v2Living-Design-Library/src/mcp-server/index.js</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/ldl-mcp-server.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/ldl-mcp-server-error.log</string>
</dict>
</plist>
```

**Load it:**
```bash
launchctl load ~/Library/LaunchAgents/com.livingdesignlibrary.mcp.plist
```

**Note:** Usually not needed since Claude Code starts it automatically.

---

## Testing Auto-Launch

### Test Option 1
```bash
npm run dev:full
# Should see both APP and MCP logs
# Press Ctrl+C to exit
```

### Test Option 2
```bash
./start-with-mcp.sh
# Should see MCP start message, then app
# Check logs: tail -f /tmp/ldl-mcp-server.log
```

### Test Option 3
```bash
# Open Claude Code
# Check: ps aux | grep mcp-server
# Should see the MCP server process
```

---

## Quick Reference

| Command | What It Does |
|---------|-------------|
| `npm run dev:full` | **Recommended:** App + MCP in parallel |
| `./start-with-mcp.sh` | App + MCP (background MCP) |
| `npm run dev` | App only |
| `npm run mcp:start` | MCP server only |
| `ps aux \| grep mcp` | Check if MCP is running |
| `tail -f /tmp/ldl-mcp-server.log` | View MCP logs |
| `kill $(cat /tmp/ldl-mcp-server.pid)` | Stop background MCP |

---

## Summary

✅ **3 auto-launch methods available**
✅ **Color-coded parallel logs with `dev:full`**
✅ **Background mode with launch script**
✅ **Claude Code auto-starts for AI workflows**
✅ **Easy debugging and monitoring**
✅ **Graceful cleanup on exit**

**Recommended:** Use `npm run dev:full` for most development work.

---

**Last Updated:** January 22, 2026
