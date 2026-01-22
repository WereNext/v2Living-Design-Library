import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Copy, Check, ExternalLink, Terminal, Plug, Info } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MCPExport } from "./MCPExport";

export function MCPConfig() {
  const [copied, setCopied] = useState(false);
  const [copiedNPX, setCopiedNPX] = useState(false);

  // Get the absolute path - in production you'd need to configure this
  const serverPath = "/absolute/path/to/your/project/mcp-server/index.js";
  
  const mcpConfig = {
    mcpServers: {
      "living-design-library": {
        command: "node",
        args: [serverPath]
      }
    }
  };

  const npxCommand = "npx living-design-library-mcp-server";

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mcpConfig, null, 2));
    setCopied(true);
    toast.success("MCP configuration copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyNPX = () => {
    navigator.clipboard.writeText(npxCommand);
    setCopiedNPX(true);
    toast.success("Command copied to clipboard!");
    setTimeout(() => setCopiedNPX(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="mb-2">MCP Server Configuration</h1>
        <p className="text-muted-foreground">
          Connect AI coding agents like Claude Code to your Living Design Library through the Model Context Protocol (MCP).
        </p>
      </div>

      {/* Export Component - FIRST */}
      <MCPExport />

      {/* What is MCP */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>What is MCP?</strong> Model Context Protocol is an open standard that connects AI assistants 
          to external tools and data sources. Once configured, you can ask Claude or other AI agents to 
          import Figma tokens, create design systems, and export components in any framework using natural language.
        </AlertDescription>
      </Alert>

      {/* Visual-First Workflow - NEW */}
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
                <h4 className="text-sm mb-2">Step 1: Install Dependencies</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Navigate to the mcp-server directory and install packages:
                </p>
                <div className="bg-muted p-3 rounded-md relative">
                  <code className="text-xs font-mono">
                    cd mcp-server && npm install
                  </code>
                </div>
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
                  Copy this JSON and add it to your config file. <strong>Update the path</strong> to match your actual project location:
                </p>
                <div className="bg-muted p-4 rounded-md relative">
                  <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-64">
                    {JSON.stringify(mcpConfig, null, 2)}
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={handleCopy}
                  >
                    {copied ? (
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
                <Alert className="mt-2">
                  <Terminal className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Important:</strong> Replace <code>/absolute/path/to/your/project/</code> with 
                    the actual absolute path to where you've installed this design library.
                  </AlertDescription>
                </Alert>
              </div>

              <div>
                <h4 className="text-sm mb-2">Step 4: Restart Claude Code</h4>
                <p className="text-xs text-muted-foreground">
                  After saving the config file, completely quit and restart Claude Code. The MCP tools will appear automatically.
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

                <h4 className="text-sm mb-2">Server Command</h4>
                <div className="bg-muted p-3 rounded-md relative">
                  <code className="text-xs font-mono">
                    node /absolute/path/to/your/project/mcp-server/index.js
                  </code>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={handleCopyNPX}
                  >
                    {copiedNPX ? (
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

      {/* Available Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Available MCP Tools</CardTitle>
          <CardDescription>
            What AI agents can do once connected to this server
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-sm">Design System Management</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• List all design systems</li>
                <li>• Get design system details</li>
                <li>• Create new design systems</li>
                <li>• Set active system</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm">Import & Templates</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Import Figma JSON tokens</li>
                <li>• List library templates</li>
                <li>• Load shadcn/ui, Material Design, etc.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm">Components & Code</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• List components</li>
                <li>• Export in React/Vue/HTML/Svelte</li>
                <li>• Components use your tokens</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm">Design Tokens</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Get colors, spacing, typography</li>
                <li>• Access all token types</li>
                <li>• Filter by token category</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm">⭐ Page Templates</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Get complete page compositions</li>
                <li>• 12 pre-built page types</li>
                <li>• Multi-component layouts ready to use</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm">⭐ Composition Guides</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Learn component combinations</li>
                <li>• Layout pattern recommendations</li>
                <li>• Best practices for each use case</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Conversations */}
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

          <div className="border-l-2 border-primary pl-3 space-y-1">
            <p className="text-sm">"Show me all the color tokens from my active design system"</p>
            <p className="text-xs text-muted-foreground">Returns complete color palette</p>
          </div>

          <div className="border-l-2 border-primary pl-3 space-y-1">
            <p className="text-sm">"Create a dark theme with purple primary and cyan accent"</p>
            <p className="text-xs text-muted-foreground">Generates custom design system with your specs</p>
          </div>

          <div className="border-l-2 border-accent pl-3 space-y-1 bg-accent/5 p-2 rounded">
            <p className="text-sm"><strong>⭐ "Give me a complete dashboard page in React"</strong></p>
            <p className="text-xs text-muted-foreground">Returns a full page with sidebar, header, data cards, and table - all composed together with your tokens</p>
          </div>

          <div className="border-l-2 border-accent pl-3 space-y-1 bg-accent/5 p-2 rounded">
            <p className="text-sm"><strong>⭐ "How do I compose a data table with filters?"</strong></p>
            <p className="text-xs text-muted-foreground">Provides layout guidance, component recommendations, and best practices for that specific use case</p>
          </div>

          <div className="border-l-2 border-accent pl-3 space-y-1 bg-accent/5 p-2 rounded">
            <p className="text-sm"><strong>⭐ "Show me an e-commerce product page template in Vue"</strong></p>
            <p className="text-xs text-muted-foreground">Generates a complete product page with image gallery, details, add-to-cart, and reviews sections</p>
          </div>

          {/* Visual-First Examples */}
          <div className="mt-4 pt-4 border-t">
            <Badge className="mb-3">Visual-First Workflow Examples</Badge>
          </div>

          <div className="border-l-2 border-accent pl-3 space-y-1 bg-accent/10 p-2 rounded">
            <p className="text-sm"><strong>🎨 [Upload Figma screenshot] "Code this dashboard exactly as shown, using components from my MCP design library"</strong></p>
            <p className="text-xs text-muted-foreground">AI analyzes the visual layout + pulls matching components with your exact tokens → pixel-perfect result</p>
          </div>

          <div className="border-l-2 border-accent pl-3 space-y-1 bg-accent/10 p-2 rounded">
            <p className="text-sm"><strong>🎨 [Upload product page mockup] "Build this in React. Use my design system for colors and spacing"</strong></p>
            <p className="text-xs text-muted-foreground">AI sees card layouts, CTAs, and images + uses your MCP tokens for perfect brand consistency</p>
          </div>

          <div className="border-l-2 border-accent pl-3 space-y-1 bg-accent/10 p-2 rounded">
            <p className="text-sm"><strong>🎨 [Upload form design] "Create this checkout form with validation. Match the spacing and button styles exactly"</strong></p>
            <p className="text-xs text-muted-foreground">AI understands form structure visually + uses your pre-built Input, Button, and Checkbox components</p>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}