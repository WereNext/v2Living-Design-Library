import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Download, RefreshCw, CheckCircle2, AlertCircle, Activity, Zap, Database, Clock, TrendingUp, Copy, X, FileJson, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useDesignSystems } from "../hooks/useDesignSystems";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { syncToMCPBridge, initializeMCPBridge } from "../services/mcp-bridge";

export function MCPExport() {
  const { systems } = useDesignSystems();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportData, setExportData] = useState<any>(null);
  const [httpServerStatus, setHttpServerStatus] = useState<'checking' | 'running' | 'offline'>('checking');

  // Real-time stats calculated from systems
  const stats = React.useMemo(() => {
    const totalThemes = systems.reduce((acc, sys) => acc + (sys.themes?.length || 0), 0);
    const totalTokens = systems.reduce((acc, sys) => {
      return acc + sys.themes.reduce((themeAcc, theme) => {
        return themeAcc +
          Object.keys(theme.colors || {}).length +
          Object.keys(theme.spacing || {}).length +
          Object.keys(theme.typography || {}).length +
          Object.keys(theme.borderRadius || {}).length +
          Object.keys(theme.shadows || {}).length;
      }, 0);
    }, 0);

    // Estimate component availability (rough calculation)
    const totalComponents = systems.reduce((acc, sys) => {
      const intents = sys.intents || [];
      return acc + (intents.length * 15); // ~15 components per intent
    }, 0);

    return {
      totalDesignSystems: systems.length,
      totalThemes,
      totalTokens,
      totalComponents,
    };
  }, [systems]);

  // Update current time every second for live timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize MCP bridge and check HTTP server status on load
  useEffect(() => {
    initializeMCPBridge();
    checkHttpServerStatus();
  }, []);

  // Check if HTTP MCP server is running
  const checkHttpServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3005/health', {
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      });
      if (response.ok) {
        setHttpServerStatus('running');
      } else {
        setHttpServerStatus('offline');
      }
    } catch {
      setHttpServerStatus('offline');
    }
  };

  // Sync to MCP bridge whenever systems change
  useEffect(() => {
    if (systems.length > 0) {
      syncToMCPBridge(systems);
    }
  }, [systems]);

  const handleExport = () => {
    const data = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedFrom: 'Living Design Library',
        version: '1.0.0',
        format: 'mcp-sync',
        totalSystems: systems.length,
      },
      designSystems: systems
    };

    setExportData(data);
    setShowExportDialog(true);
  };

  const handleDownload = () => {
    if (!exportData) return;

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'app-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('app-data.json downloaded!');
  };

  const handleCopyJSON = (jsonData: any, label: string) => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    toast.success(`${label} copied to clipboard!`);
  };

  const getMCPConfig = () => {
    return {
      mcpServers: {
        "living-design-library": {
          url: "http://localhost:3005/mcp",
          transport: "streamablehttp"
        }
      }
    };
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  const formatRelativeTime = (isoString: string) => {
    const now = currentTime.getTime();
    const then = new Date(isoString).getTime();
    const diffSeconds = Math.floor((now - then) / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  };

  const getServerStatusBadge = () => {
    if (httpServerStatus === 'running') {
      return <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-300"><CheckCircle2 className="w-3 h-3" /> Live</Badge>;
    }
    return <Badge variant="outline" className="gap-1 bg-gray-50 text-gray-700 border-gray-300"><AlertCircle className="w-3 h-3" /> Offline</Badge>;
  };

  return (
    <>
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary animate-pulse" />
              <CardTitle>Live MCP Dashboard</CardTitle>
            </div>
            {getServerStatusBadge()}
          </div>
          <CardDescription>
            Real-time monitoring and HTTP gateway for AI agent integration
          </CardDescription>
        </CardHeader>
      <CardContent className="space-y-6">
        {/* Live Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">Systems</span>
            </div>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalDesignSystems}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Design systems</div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase">Themes</span>
            </div>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalThemes}</div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Theme variations</div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase">Tokens</span>
            </div>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.totalTokens}</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">Design tokens</div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase">Components</span>
            </div>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.totalComponents}</div>
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">Available via MCP</div>
          </div>
        </div>

        {/* HTTP Server Status */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className={`w-5 h-5 ${httpServerStatus === 'running' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                  HTTP MCP Server
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  {httpServerStatus === 'running' ? 'Running on http://localhost:3005/mcp' : 'Not running (start with npm run dev:full)'}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={`gap-1 ${httpServerStatus === 'running' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-50 text-gray-700 border-gray-300'}`}>
              {httpServerStatus === 'checking' ? (
                <>
                  <Clock className="w-3 h-3 animate-spin" />
                  Checking...
                </>
              ) : httpServerStatus === 'running' ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Online
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  Offline
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Sync Status & Actions */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${httpServerStatus === 'offline' ? 'text-yellow-600' : 'text-green-600'}`} />
                Data Sync Status
              </p>
              <div className="text-xs text-muted-foreground mt-1">
                <p>Auto-syncing to HTTP server via bridge</p>
              </div>
            </div>
            <Button
              onClick={handleExport}
              className="gap-2"
              variant="outline"
              size="sm"
            >
              <FileJson className="w-4 h-4" />
              View Export Config
            </Button>
          </div>

          {httpServerStatus === 'running' && (
            <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md text-xs text-green-800 dark:text-green-200">
              <p className="font-medium mb-1">✅ Live sync active</p>
              <p>Design systems are automatically syncing to the HTTP MCP server. Changes are available instantly to connected AI tools.</p>
            </div>
          )}

          {httpServerStatus === 'offline' && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md text-xs text-amber-800 dark:text-amber-200">
              <p className="font-medium mb-1">⚠️ HTTP server not running</p>
              <p>Start the HTTP MCP server with <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded font-mono">npm run dev:full</code> to enable live sync.</p>
            </div>
          )}
        </div>

        {/* Real-time Activity Feed */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="w-4 h-4" />
            <span>System Activity</span>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg border border-border/50 space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
              <span className="text-muted-foreground">Current time</span>
              <span className="font-mono font-medium">{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
              <span className="text-muted-foreground">HTTP Server</span>
              <Badge variant="outline" className={`gap-1 text-xs ${httpServerStatus === 'running' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-50 text-gray-700 border-gray-300'}`}>
                {httpServerStatus === 'running' ? 'Online' : 'Offline'}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Design Systems</span>
              <span className="font-medium text-muted-foreground">
                {stats.totalDesignSystems} {stats.totalDesignSystems === 1 ? 'system' : 'systems'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="text-xs text-muted-foreground space-y-1 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">📊 What's being tracked:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-blue-800 dark:text-blue-200">
            <li>All design systems with their themes</li>
            <li>Design tokens (colors, spacing, typography, etc.)</li>
            <li>Component intents and categories</li>
            <li>Real-time sync status</li>
          </ul>
        </div>

        {/* Setup Instructions */}
        <div className="p-3 bg-muted/30 border border-border/50 rounded-lg text-xs space-y-2">
          <p className="font-medium">💡 Quick Setup</p>
          <ol className="list-decimal list-inside space-y-1.5 ml-2 text-muted-foreground">
            <li>Start the app with <code className="bg-muted px-1 py-0.5 rounded font-mono">npm run dev:full</code></li>
            <li>Your design systems automatically sync to the HTTP MCP server</li>
            <li>Configure your AI tool to connect (click "View Export Config" above)</li>
            <li>Changes in the app are instantly available to AI tools!</li>
          </ol>
        </div>
      </CardContent>
    </Card>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[80vh] overflow-hidden flex flex-col gap-0">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5" />
              MCP Export & Configuration
            </DialogTitle>
            <DialogDescription>
              Copy and paste these configurations into your AI coding tools
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="mcp-config" className="flex-1 min-h-0 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="mcp-config">MCP Config</TabsTrigger>
              <TabsTrigger value="backup">Backup Export</TabsTrigger>
            </TabsList>

            <TabsContent value="mcp-config" className="flex-1 min-h-0 flex flex-col space-y-3 mt-0">
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                      HTTP MCP Server
                    </h3>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Live connection to your design systems
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">Status</div>
                    <div className="text-sm font-bold text-green-900 dark:text-green-100">
                      {httpServerStatus === 'running' ? '🟢 Running' : '🔴 Offline'}
                    </div>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">URL</div>
                    <div className="text-xs font-mono font-bold text-green-900 dark:text-green-100">
                      :3005/mcp
                    </div>
                  </div>
                </div>

                {httpServerStatus === 'offline' && (
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-800 dark:text-amber-200">
                    ⚠️ Server offline. Run <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded font-mono">npm run dev:full</code> to start it.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Claude Code Configuration</p>
                  <p className="text-xs">Add this to your MCP settings</p>
                </div>
                <Button
                  onClick={() => handleCopyJSON(getMCPConfig(), 'MCP config')}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Config
                </Button>
              </div>

              <div className="max-h-48 overflow-auto bg-muted/50 rounded-lg border border-border">
                <pre className="p-4 text-xs font-mono leading-relaxed">
                  {JSON.stringify(getMCPConfig(), null, 2)}
                </pre>
              </div>

              <div className="space-y-3 flex-shrink-0">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-xs">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">📝 Setup Instructions:</p>
                  <ol className="list-decimal list-inside ml-2 space-y-1.5 text-blue-800 dark:text-blue-200">
                    <li>Copy the MCP config above</li>
                    <li>Open <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
                    <li>Paste the config into the file</li>
                    <li>Restart Claude Code</li>
                    <li>The MCP server connects automatically!</li>
                  </ol>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-xs">
                  <p className="font-medium text-green-900 dark:text-green-100 mb-1">✨ Benefits of HTTP Transport</p>
                  <ul className="list-disc list-inside ml-2 space-y-1 text-green-800 dark:text-green-200">
                    <li>Real-time sync - changes appear instantly</li>
                    <li>No manual file exports needed</li>
                    <li>Works with any MCP-compatible tool</li>
                    <li>Browser-based MCP gateway</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="backup" className="flex-1 min-h-0 flex flex-col space-y-4 mt-0">
              {/* Export Summary */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Ready to Export
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Your design systems are packaged and ready for the MCP server
                    </p>
                  </div>
                  <FileJson className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Design Systems</div>
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{stats.totalDesignSystems}</div>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Themes</div>
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{stats.totalThemes}</div>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Design Tokens</div>
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{stats.totalTokens}</div>
                  </div>
                  <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">File Size</div>
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {(JSON.stringify(exportData).length / 1024).toFixed(1)}KB
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleDownload}
                    className="flex-1 gap-2"
                    size="sm"
                  >
                    <Download className="w-4 h-4" />
                    Download app-data.json
                  </Button>
                  <Button
                    onClick={() => handleCopyJSON(exportData, 'App data')}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-xs font-medium">⚡ Quick Actions</p>
                <div className="grid gap-2">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText('/Users/marce/Documents/GitHub/v2Living-Design-Library/src/mcp-server/app-data.json');
                      toast.success('Target path copied!');
                    }}
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2 text-xs h-auto py-2"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="font-mono text-xs">src/mcp-server/app-data.json</span>
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 bg-muted/30 border border-border/50 rounded-lg text-xs space-y-2">
                <p className="font-medium">📝 Manual Backup (Optional)</p>
                <p className="text-muted-foreground">
                  Download a JSON snapshot of your design systems for backup purposes or manual file-based workflows.
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-muted-foreground">
                  <li>Click "Download app-data.json" above</li>
                  <li>Save to your preferred location</li>
                  <li>Use for backup, version control, or legacy stdio MCP servers</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
