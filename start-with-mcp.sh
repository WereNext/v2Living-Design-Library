#!/bin/bash

# Living Design Library - Start with MCP Server
# This script launches both the app and the MCP server

set -e

echo "🚀 Starting Living Design Library with MCP Server..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_DIR="$SCRIPT_DIR/src/mcp-server"

# Check if MCP server dependencies are installed
if [ ! -d "$MCP_DIR/node_modules" ]; then
    echo "📦 Installing MCP server dependencies..."
    cd "$MCP_DIR"
    npm install
    cd "$SCRIPT_DIR"
    echo "✅ MCP dependencies installed"
    echo ""
fi

# Start MCP server in background
echo "🔧 Starting MCP server..."
cd "$MCP_DIR"
node index.js > /tmp/ldl-mcp-server.log 2>&1 &
MCP_PID=$!
cd "$SCRIPT_DIR"

# Save PID for cleanup
echo $MCP_PID > /tmp/ldl-mcp-server.pid

# Give server time to start
sleep 2

# Check if MCP server started successfully
if ps -p $MCP_PID > /dev/null 2>&1; then
    echo "✅ MCP server running (PID: $MCP_PID)"
    echo "   Log: /tmp/ldl-mcp-server.log"
else
    echo "❌ MCP server failed to start"
    echo "   Check log: /tmp/ldl-mcp-server.log"
    exit 1
fi

echo ""
echo "🎨 Starting app..."
echo ""

# Start the app (this will block)
npm run dev

# Cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down MCP server..."
    if [ -f /tmp/ldl-mcp-server.pid ]; then
        MCP_PID=$(cat /tmp/ldl-mcp-server.pid)
        kill $MCP_PID 2>/dev/null || true
        rm /tmp/ldl-mcp-server.pid
        echo "✅ MCP server stopped"
    fi
}

trap cleanup EXIT INT TERM
