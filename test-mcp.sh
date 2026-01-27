#!/bin/bash
cd "$(dirname "$0")/src/mcp-server"
echo "Testing MCP Server..."
echo ""
node index.js 2>&1 &
PID=$!
sleep 2
kill $PID 2>/dev/null
echo ""
echo "✅ MCP Server test complete"
