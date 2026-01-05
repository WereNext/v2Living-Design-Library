import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Download, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useDesignSystems } from "../hooks/useDesignSystems";

export function MCPExport() {
  const { designSystems } = useDesignSystems();
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastExportTime, setLastExportTime] = useState<string | null>(null);

  // Safety check for undefined designSystems
  const systems = designSystems || [];

  const handleExport = () => {
    try {
      const exportData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          exportedFrom: 'Living Design Library',
          version: '1.0.0',
          format: 'mcp-sync',
          totalSystems: systems.length,
        },
        designSystems: systems
      };

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

      setExportStatus('success');
      setLastExportTime(new Date().toISOString());
      
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          MCP Server Sync
        </CardTitle>
        <CardDescription>
          Export your design systems to sync with the MCP server for AI agent integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">
            The MCP (Model Context Protocol) server allows AI coding agents like Claude, Cline, and Continue.dev to access your design systems and generate components.
          </p>
          <p>
            Export your design systems to <code className="bg-muted px-1.5 py-0.5 rounded">app-data.json</code> and place it in the <code className="bg-muted px-1.5 py-0.5 rounded">/mcp-server</code> directory.
          </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium">
              {systems.length} Design System{systems.length !== 1 ? 's' : ''} Ready
            </p>
            {lastExportTime && (
              <p className="text-xs text-muted-foreground mt-1">
                Last export: {formatTime(lastExportTime)}
              </p>
            )}
          </div>
          <Button onClick={handleExport} className="gap-2">
            {exportStatus === 'success' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Exported!
              </>
            ) : exportStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Failed
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export for MCP
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">What gets exported:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>All design systems with their themes</li>
            <li>Design tokens (colors, spacing, typography, etc.)</li>
            <li>Component intents and categories</li>
            <li>Version history</li>
          </ul>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-xs">
          <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">💡 Quick Setup</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
            <li>Click "Export for MCP" to download app-data.json</li>
            <li>Move the file to /mcp-server/ directory</li>
            <li>Restart your MCP server (or it will auto-reload)</li>
            <li>AI agents can now access your design systems!</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}