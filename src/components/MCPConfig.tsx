import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Copy, Check, ExternalLink, Terminal, Info, Zap, Layout, Palette, Grid3X3 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MCPExport } from "./MCPExport";

interface ServerStatus {
  detected: boolean;
  checking: boolean;
  port: number | null;
  version: string | null;
  designSystems: number;
  error: string | null;
}

export function MCPConfig() {
  const [copiedStdio, setCopiedStdio] = useState(false);
  const [copiedHttp, setCopiedHttp] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    detected: false,
    checking: true,
    port: null,
    version: null,
    designSystems: 0,
    error: null,
  });

  // Check for running MCP server on common ports
  useEffect(() => {
    const checkPorts = [3005, 3006, 3007, 3008];

    const checkServer = async () => {
      for (const port of checkPorts) {
        try {
          const response = await fetch(`http://localhost:${port}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(2000),
          });
          if (response.ok) {
            const data = await response.json();
            if (data.server === 'living-design-library-mcp') {
              setServerStatus({
                detected: true,
                checking: false,
                port,
                version: data.version || null,
                designSystems: data.designSystems || 0,
                error: null,
              });
              return;
            }
          }
        } catch {
          // Port not responding or wrong server, try next
        }
      }
      // No server found on any port
      setServerStatus({
        detected: false,
        checking: false,
        port: null,
        version: null,
        designSystems: 0,
        error: 'MCP server not detected',
      });
    };

    checkServer();
    // Re-check every 10 seconds
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  // Template path - users replace with their actual project location
  const templatePath = "/path/to/your/project/src/mcp-server/index.js";

  // stdio transport config (requires path to server)
  const stdioConfig = {
    mcpServers: {
      "living-design-library": {
        command: "node",
        args: [templatePath]
      }
    }
  };

  // HTTP transport config - only valid when server is detected
  const httpConfig = serverStatus.detected && serverStatus.port ? {
    mcpServers: {
      "living-design-library": {
        transport: "http",
        url: `http://localhost:${serverStatus.port}/mcp`
      }
    }
  } : null;

  const handleCopyStdio = () => {
    navigator.clipboard.writeText(JSON.stringify(stdioConfig, null, 2));
    setCopiedStdio(true);
    toast.success("stdio config copied - remember to update the path!");
    setTimeout(() => setCopiedStdio(false), 2000);
  };

  const handleCopyHttp = () => {
    navigator.clipboard.writeText(JSON.stringify(httpConfig, null, 2));
    setCopiedHttp(true);
    toast.success("HTTP config copied!");
    setTimeout(() => setCopiedHttp(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="mb-2">MCP Server Configuration</h1>
        <p className="text-muted-foreground">
          Connect AI coding agents like Claude Code to your Living Design Library through the Model Context Protocol (MCP).
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* What is MCP */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>What is MCP?</strong> Model Context Protocol is an open standard that connects AI assistants
              to external tools and data sources. Once configured, you can ask Claude or other AI agents to
              import Figma tokens, create design systems, and export components in any framework using natural language.
            </AlertDescription>
          </Alert>

          {/* MCP Apps - Interactive UI Components */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            MCP Apps
          </CardTitle>
          <CardDescription>
            Interactive UI components that display directly in AI conversations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            MCP Apps are rich, interactive UI components that AI agents can render inline during conversations.
            Instead of just text responses, the AI can show you visual previews, color palettes, and interactive galleries.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-background">
              <Layout className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Library Menu</h4>
                <p className="text-xs text-muted-foreground">Browse all design systems with theme previews and color swatches</p>
                <code className="text-xs text-muted-foreground">/ui/library-menu</code>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border bg-background">
              <Palette className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Token Viewer</h4>
                <p className="text-xs text-muted-foreground">Visual display of all design tokens with live values</p>
                <code className="text-xs text-muted-foreground">/ui/token-viewer</code>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border bg-background">
              <Grid3X3 className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Pattern Gallery</h4>
                <p className="text-xs text-muted-foreground">Browse component patterns with code examples</p>
                <code className="text-xs text-muted-foreground">/ui/pattern-gallery</code>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border bg-background">
              <Layout className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Dashboard</h4>
                <p className="text-xs text-muted-foreground">Overview of your design system at a glance</p>
                <code className="text-xs text-muted-foreground">/ui/dashboard</code>
              </div>
            </div>
          </div>

          {/* Visual Preview */}
          <div className="rounded-lg border bg-slate-900 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg">
                🎨
              </div>
              <div>
                <h4 className="text-white font-medium">Design Library</h4>
                <p className="text-slate-400 text-xs">Available design systems & themes</p>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-3 space-y-2">
              <p className="text-slate-400 text-xs uppercase tracking-wide">Design Systems</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-slate-800/50 border-l-2 border-blue-500">
                  <div>
                    <span className="text-white text-sm">Default Design System</span>
                    <Badge variant="default" className="ml-2 text-[10px]">Active</Badge>
                    <p className="text-slate-400 text-xs">6 themes available</p>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded bg-slate-600"></div>
                    <div className="w-4 h-4 rounded bg-slate-900"></div>
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-800/30">
                  <div>
                    <span className="text-slate-300 text-sm">Material Design System</span>
                    <p className="text-slate-500 text-xs">3 themes available</p>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded bg-slate-500"></div>
                    <div className="w-4 h-4 rounded bg-purple-500"></div>
                    <div className="w-4 h-4 rounded bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-xs text-center pt-2 border-t border-slate-700">
              4 systems • 15 themes • <span className="text-blue-400">↻ Refresh</span>
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>How it works:</strong> When you ask the AI about design systems, it can respond with an interactive UI
              instead of plain text. For example, asking "show me available design systems" might display the Library Menu
              with clickable themes and color swatches.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Available Tools - Moved to Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Available MCP Tools</CardTitle>
          <CardDescription>
            What AI agents can do once connected to this server
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Design System Management</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• List all design systems</li>
                <li>• Get design system details</li>
                <li>• Create new design systems</li>
                <li>• Set active system</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Import & Templates</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Import Figma JSON tokens</li>
                <li>• List library templates</li>
                <li>• Load shadcn/ui, Material Design, etc.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Components & Code</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• List components</li>
                <li>• Export in React/Vue/HTML/Svelte</li>
                <li>• Components use your tokens</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Design Tokens</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Get colors, spacing, typography</li>
                <li>• Access all token types</li>
                <li>• Filter by token category</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">⭐ Page Templates</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Get complete page compositions</li>
                <li>• 12 pre-built page types</li>
                <li>• Multi-component layouts</li>
              </ul>
            </div>
            <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                MCP Apps
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Interactive Library Menu</li>
                <li>• Visual Token Viewer</li>
                <li>• Pattern Gallery</li>
                <li>• Design System Dashboard</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Conversations - Moved to Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Example Conversations</CardTitle>
          <CardDescription>
            What you can ask AI once the MCP server is connected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border-l-2 border-primary pl-3 space-y-1">
            <p className="text-sm">"Import my Figma design tokens and create a design system called 'AcmeApp'"</p>
            <p className="text-xs text-muted-foreground">Imports JSON and creates a working design system</p>
          </div>
          <div className="border-l-2 border-primary pl-3 space-y-1">
            <p className="text-sm">"Load the shadcn/ui template for my dashboard project"</p>
            <p className="text-xs text-muted-foreground">Loads pre-built library with all tokens</p>
          </div>
          <div className="border-l-2 border-primary pl-3 space-y-1">
            <p className="text-sm">"Give me Button, Card, and Modal components in React"</p>
            <p className="text-xs text-muted-foreground">Exports multiple components with your design tokens</p>
          </div>
          <div className="border-l-2 border-accent pl-3 space-y-1 bg-accent/5 p-2 rounded">
            <p className="text-sm"><strong>⭐ "Give me a complete dashboard page in React"</strong></p>
            <p className="text-xs text-muted-foreground">Returns a full page with sidebar, header, data cards, and table</p>
          </div>
          <div className="border-l-2 border-accent pl-3 space-y-1 bg-accent/10 p-2 rounded">
            <p className="text-sm"><strong>🎨 [Upload Figma screenshot] "Code this using my MCP design library"</strong></p>
            <p className="text-xs text-muted-foreground">AI analyzes the visual + pulls matching components with your exact tokens</p>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          {/* MCP Server Configuration - Universal */}
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                MCP Server Configuration
              </CardTitle>
              <CardDescription>
                Choose a transport method and copy the configuration to your AI coding tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Transport Options */}
              <Tabs defaultValue="http" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="http">
                    <span className="flex items-center gap-1">
                      HTTP Transport
                      <Badge variant="secondary" className="text-[10px] ml-1">Recommended</Badge>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="stdio">stdio Transport</TabsTrigger>
                </TabsList>

                <TabsContent value="http" className="space-y-3 mt-4">
                  {/* Server Status Indicator */}
                  {serverStatus.checking ? (
                    <div className="p-3 rounded-lg bg-muted border animate-pulse">
                      <p className="text-xs text-muted-foreground">
                        Detecting MCP server...
                      </p>
                    </div>
                  ) : serverStatus.detected ? (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-green-700 dark:text-green-400">
                          <strong>Server detected on port {serverStatus.port}</strong>
                          {serverStatus.version && <span className="ml-2">v{serverStatus.version}</span>}
                        </p>
                        <Badge variant="outline" className="text-[10px] bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                          {serverStatus.designSystems} design system{serverStatus.designSystems !== 1 ? 's' : ''} loaded
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        <strong>MCP server not detected.</strong> Start the app with <code className="bg-background px-1 rounded">npm run dev</code> to enable HTTP transport.
                      </p>
                    </div>
                  )}
                  {httpConfig ? (
                    <div className="bg-muted p-4 rounded-md relative">
                      <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-48">
                        {JSON.stringify(httpConfig, null, 2)}
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={handleCopyHttp}
                      >
                        {copiedHttp ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-muted/50 p-4 rounded-md border-2 border-dashed border-muted-foreground/20">
                      <p className="text-xs text-muted-foreground text-center">
                        Config will appear here once the MCP server is detected
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {serverStatus.detected && serverStatus.port ? (
                      <>The AI tool connects to the running MCP server at <code className="bg-muted px-1 rounded">localhost:{serverStatus.port}</code>.</>
                    ) : (
                      <>Start the app to detect the server port. The config will update automatically.</>
                    )}
                  </p>
                </TabsContent>

                <TabsContent value="stdio" className="space-y-3 mt-4">
                  <Alert variant="default" className="border-amber-500/30 bg-amber-500/5">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-xs">
                      <strong>Path required:</strong> Replace <code className="bg-background px-1 rounded">/path/to/your/project</code> with your actual project directory.
                    </AlertDescription>
                  </Alert>
                  <div className="bg-muted p-4 rounded-md relative">
                    <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-48">
                      {JSON.stringify(stdioConfig, null, 2)}
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={handleCopyStdio}
                    >
                      {copiedStdio ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The AI tool spawns the MCP server as a subprocess. Works even when the app isn't running,
                    but requires the correct absolute path to the server script.
                  </p>
                </TabsContent>
              </Tabs>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Where does this go?</strong> Each AI tool has a different config location:
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>• <strong>Claude Code:</strong> <code className="bg-background px-1 rounded">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
                    <li>• <strong>Cline:</strong> Settings → MCP Servers → Paste config</li>
                    <li>• <strong>Continue.dev:</strong> <code className="bg-background px-1 rounded">~/.continue/config.json</code> → mcpServers section</li>
                    <li>• <strong>Project-level:</strong> Some tools support <code className="bg-background px-1 rounded">.mcp/config.json</code> in your project root</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Export Component */}
          <MCPExport />

          {/* Visual-First Workflow */}
      <Card className="border-accent bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">Recommended</Badge>
            Visual-First Agentic Coding
          </CardTitle>
          <CardDescription>
            The most powerful way to use this library with AI coding assistants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            <strong>Best Practice:</strong> Upload a screenshot of your high-fidelity Figma design to 
            an MCP-compatible AI tool like Claude Code, Cline, Continue.dev, or Zed, then tell the AI to use this MCP server 
            to access your design system tokens and components.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Badge variant="outline" className="mb-1">Traditional Approach</Badge>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>❌ Developer guesses spacing values</p>
                <p>❌ Colors don't match design</p>
                <p>❌ Typography is inconsistent</p>
                <p>❌ Components reinvented each time</p>
              </div>
            </div>

            <div className="space-y-2">
              <Badge variant="default" className="mb-1">With MCP + Screenshot</Badge>
              <div className="text-xs space-y-1">
                <p>✅ AI sees exact visual design</p>
                <p>✅ Uses your design system tokens</p>
                <p>✅ Pulls pre-built components</p>
                <p>✅ Pixel-perfect to original</p>
              </div>
            </div>
          </div>

          <div className="bg-background p-4 rounded-md border space-y-3">
            <h4 className="text-sm">The Complete Workflow:</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 text-xs">1</Badge>
                <p className="text-xs flex-1">Design high-fidelity mockup in Figma</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 text-xs">2</Badge>
                <p className="text-xs flex-1">Export Figma variables as JSON, import to this library</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 text-xs">3</Badge>
                <p className="text-xs flex-1">Take screenshot of your Figma frame</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 text-xs">4</Badge>
                <p className="text-xs flex-1">Upload to MCP-compatible AI tool (Claude Code, Cline, Continue.dev, Zed) with instruction: "Code this using my MCP design library"</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 text-xs">5</Badge>
                <p className="text-xs flex-1">AI sees the visual + accesses your tokens/components + generates pixel-perfect code</p>
              </div>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Why this works:</strong> AI coding assistants can analyze images to understand layouts, 
              but they need your design system for accurate tokens and components. MCP bridges this gap perfectly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Configuration Instructions */}
      <Tabs defaultValue="claude" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="claude">Claude Code</TabsTrigger>
          <TabsTrigger value="other">Other AI Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="claude" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Claude Code Setup</CardTitle>
              <CardDescription>
                Add the MCP server to Claude Code's configuration file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm mb-2">Step 1: Launch the App with MCP</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  The easiest way to get started is to run both the app and MCP server together:
                </p>
                <div className="bg-muted p-3 rounded-md relative">
                  <code className="text-xs font-mono">
                    npm run dev:full
                  </code>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This starts both the app (on http://localhost:3001) and the MCP server in parallel with color-coded logs.
                </p>
              </div>

              <div>
                <h4 className="text-sm mb-2">Step 2: Find Configuration File</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Open your Claude Code configuration file:
                </p>
                <div className="space-y-2">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs mb-1"><strong>macOS:</strong></p>
                    <code className="text-xs font-mono">
                      ~/Library/Application Support/Claude/claude_desktop_config.json
                    </code>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs mb-1"><strong>Windows:</strong></p>
                    <code className="text-xs font-mono">
                      %APPDATA%/Claude/claude_desktop_config.json
                    </code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm mb-2">Step 3: Add MCP Server Configuration</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Copy the configuration from the "MCP Server Configuration" card above and paste it into your config file.
                </p>
                <Alert className="mt-2">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Recommended:</strong> Use the <strong>HTTP transport</strong> config - it's simpler and doesn't require path configuration.
                    Just make sure the Living Design Library app is running.
                  </AlertDescription>
                </Alert>
              </div>

              <div>
                <h4 className="text-sm mb-2">Step 4: Restart Claude Code</h4>
                <p className="text-xs text-muted-foreground">
                  After saving the config file, completely quit and restart Claude Code. The MCP server will be available automatically.
                </p>
              </div>

              <div>
                <h4 className="text-sm mb-2">Step 5: Test the Connection</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Try these example prompts in Claude:
                </p>
                <div className="space-y-2">
                  <div className="bg-muted/50 p-2 rounded text-xs">
                    "List all available design systems in the library"
                  </div>
                  <div className="bg-muted/50 p-2 rounded text-xs">
                    "Load the shadcn/ui template and show me what components are available"
                  </div>
                  <div className="bg-muted/50 p-2 rounded text-xs">
                    "Give me a Button component in React"
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          {/* Cline Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Cline Setup</CardTitle>
              <CardDescription>
                Autonomous AI coding agent for VS Code with easy MCP configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm mb-2">Step 1: Install Cline</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Install the Cline extension from the VS Code marketplace.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 2: Open MCP Settings</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Click the Cline icon in VS Code sidebar → Click settings gear → Scroll to "MCP Servers" section
                  </p>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 3: Copy & Paste MCP Config</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Cline has a convenient copy-paste interface. Simply paste this configuration:
                  </p>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs font-mono overflow-x-auto">
{`{
  "mcpServers": {
    "design-library": {
      "command": "node",
      "args": ["/absolute/path/to/your/project/mcp-server/index.js"]
    }
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 4: Restart Cline</h4>
                  <p className="text-xs text-muted-foreground">
                    Click "Restart MCP Servers" button in Cline settings or reload VS Code. The design library tools will appear in Cline chat.
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Tip:</strong> Cline makes MCP setup easy with its built-in copy-paste configuration UI. 
                    You can also upload screenshots directly in the Cline chat for visual-first coding.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Continue.dev Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Continue.dev Setup</CardTitle>
              <CardDescription>
                Open-source AI assistant for VS Code and JetBrains IDEs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm mb-2">Step 1: Install Continue.dev</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Install the Continue extension from your IDE's marketplace (VS Code or JetBrains).
                  </p>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 2: Open Continue Config</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Click the Continue icon in your IDE sidebar, then click the gear icon to open <code className="text-xs bg-muted px-1 py-0.5 rounded">config.json</code>
                  </p>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 3: Add MCP Server to Config</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Add the MCP server to the <code className="text-xs bg-muted px-1 py-0.5 rounded">mcpServers</code> section:
                  </p>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs font-mono overflow-x-auto">
{`{
  "mcpServers": {
    "design-library": {
      "command": "node",
      "args": ["/absolute/path/to/your/project/mcp-server/index.js"]
    }
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 4: Reload Extension</h4>
                  <p className="text-xs text-muted-foreground">
                    Reload the Continue extension or restart your IDE. The MCP tools will be available in the Continue chat.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kiro Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Kiro Setup</CardTitle>
              <CardDescription>
                AI coding agent for VS Code with MCP integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm mb-2">Step 1: Install Kiro</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Install the Kiro extension from the VS Code marketplace.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 2: Open Kiro Settings</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Click the Kiro icon in VS Code sidebar → Open settings
                  </p>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 3: Add MCP Server</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Add the MCP server configuration:
                  </p>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs font-mono overflow-x-auto">
{`{
  "mcpServers": {
    "design-library": {
      "command": "node",
      "args": ["/absolute/path/to/your/project/src/mcp-server/index.js"]
    }
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 4: Restart Kiro</h4>
                  <p className="text-xs text-muted-foreground">
                    Reload VS Code or restart the Kiro extension. The design library tools will be available in Kiro chat.
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Tip:</strong> Kiro supports screenshot uploads for visual-first coding.
                    Upload your Figma designs and ask Kiro to code them using your MCP design library!
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Antigravity Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Antigravity Setup</CardTitle>
              <CardDescription>
                AI coding assistant with MCP support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm mb-2">Step 1: Install Antigravity</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Install Antigravity from your platform's marketplace or follow the official installation guide.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 2: Configure MCP Server</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Add the MCP server to Antigravity's configuration:
                  </p>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs font-mono overflow-x-auto">
{`{
  "mcpServers": {
    "design-library": {
      "command": "node",
      "args": ["/absolute/path/to/your/project/src/mcp-server/index.js"]
    }
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 3: Restart Antigravity</h4>
                  <p className="text-xs text-muted-foreground">
                    Restart Antigravity for the changes to take effect. The design library tools will be available automatically.
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Tip:</strong> Antigravity works great with visual-first workflows.
                    Combine your design system tokens with AI-generated code for pixel-perfect results.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Zed Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Zed Editor Setup</CardTitle>
              <CardDescription>
                High-performance code editor with native MCP support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm mb-2">Step 1: Install Zed</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Download and install Zed from <code className="text-xs bg-muted px-1 py-0.5 rounded">zed.dev</code>
                  </p>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 2: Open Settings</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Press <code className="text-xs bg-muted px-1 py-0.5 rounded">Cmd+,</code> (macOS) or <code className="text-xs bg-muted px-1 py-0.5 rounded">Ctrl+,</code> (Windows/Linux) to open settings.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 3: Configure MCP Server</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Add to your Zed settings.json:
                  </p>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs font-mono overflow-x-auto">
{`{
  "context_servers": {
    "design-library": {
      "command": {
        "path": "node",
        "args": ["/absolute/path/to/your/project/mcp-server/index.js"]
      }
    }
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Step 4: Restart Zed</h4>
                  <p className="text-xs text-muted-foreground">
                    Restart Zed for the changes to take effect. Access MCP tools through the AI assistant panel.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generic Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Other MCP-Compatible Tools</CardTitle>
              <CardDescription>
                Generic configuration for any tool that supports MCP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Most MCP-compatible AI tools follow a similar configuration pattern. You'll need to provide the command and path to the server.
                </p>

                <h4 className="text-sm mb-2">Use the Configuration Above</h4>
                <p className="text-xs text-muted-foreground">
                  Copy the JSON config from the "MCP Server Configuration" card at the top of this page.
                  The HTTP transport is recommended as it doesn't require path configuration.
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Note:</strong> Cursor, Windsurf, and GitHub Copilot do not currently support MCP natively. 
                  For these tools, you can manually copy component code from the library or use their built-in AI features separately.
                </AlertDescription>
              </Alert>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Check your AI tool's documentation for specific MCP configuration instructions. 
                  Most tools will have a "Tools", "Integrations", or "Extensions" section in their settings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

          {/* Documentation Link */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm mb-1">Full Documentation</h4>
                  <p className="text-xs text-muted-foreground">
                    Complete setup guide, API reference, and troubleshooting tips
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/mcp-server/README.md" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Docs
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}