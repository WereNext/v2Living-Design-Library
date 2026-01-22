import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Download, Copy, Check, FileCode, Code2 } from "lucide-react";
import { Theme } from "../../hooks/useDesignSystems";
import { ExportFormat, exportTokens, downloadTokens, copyToClipboard } from "../../utils/tokenExporter";
import { toast } from "sonner";
import { useTokenEditor } from "../../contexts/TokenEditorContext";

interface TokenExporterProps {
  theme: Theme;
}

const EXPORT_FORMATS: { value: ExportFormat; label: string; ext: string; icon: string }[] = [
  { value: "css", label: "CSS Variables", ext: "css", icon: "🎨" },
  { value: "scss", label: "SCSS Variables", ext: "scss", icon: "💎" },
  { value: "tailwind", label: "Tailwind Config", ext: "js", icon: "🌊" },
  { value: "json", label: "JSON", ext: "json", icon: "📦" },
  { value: "ios-swift", label: "iOS Swift", ext: "swift", icon: "🍎" },
  { value: "android-xml", label: "Android XML", ext: "xml", icon: "🤖" },
  { value: "figma-tokens", label: "Figma Tokens", ext: "json", icon: "🎯" },
];

export function TokenExporter({ theme }: TokenExporterProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("css");
  const [exportMode, setExportMode] = useState<"full" | "changes">("full");
  const [copied, setCopied] = useState(false);
  const { hasChanges, exportChanges } = useTokenEditor();

  const handleCopy = async () => {
    const content = exportTokens(selectedFormat, {
      theme,
      changesOnly: exportMode === "changes",
      changes: exportMode === "changes" ? exportChanges() : undefined,
    });

    try {
      await copyToClipboard(content);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const format = EXPORT_FORMATS.find(f => f.value === selectedFormat);
    const content = exportTokens(selectedFormat, {
      theme,
      changesOnly: exportMode === "changes",
      changes: exportMode === "changes" ? exportChanges() : undefined,
    });

    const filename = `${theme.name.toLowerCase().replace(/\s+/g, "-")}-${exportMode}.${format?.ext || "txt"}`;
    downloadTokens(filename, content);
    toast.success(`Downloaded ${filename}`);
  };

  const previewContent = exportTokens(selectedFormat, {
    theme,
    changesOnly: exportMode === "changes",
    changes: exportMode === "changes" ? exportChanges() : undefined,
  });

  const selectedFormatData = EXPORT_FORMATS.find(f => f.value === selectedFormat);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-5 h-5" />
          Multi-Format Export
        </CardTitle>
        <CardDescription>
          Export design tokens to any framework or platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Format & Mode Selection */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <Select value={selectedFormat} onValueChange={(v) => setSelectedFormat(v as ExportFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_FORMATS.map(format => (
                  <SelectItem key={format.value} value={format.value}>
                    <span className="flex items-center gap-2">
                      <span>{format.icon}</span>
                      <span>{format.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Export Mode</label>
            <Select value={exportMode} onValueChange={(v) => setExportMode(v as "full" | "changes")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Theme</SelectItem>
                <SelectItem value="changes" disabled={!hasChanges}>
                  Changes Only {!hasChanges && "(No changes)"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline" className="flex-1">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </>
            )}
          </Button>
          <Button onClick={handleDownload} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download File
          </Button>
        </div>

        <Separator />

        {/* Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Preview</label>
            <Badge variant="outline" className="font-mono text-xs">
              {selectedFormatData?.ext}
            </Badge>
          </div>
          <div className="relative">
            <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto max-h-96 font-mono">
              <code>{previewContent}</code>
            </pre>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Lines: {previewContent.split("\n").length}</span>
          <span>•</span>
          <span>Size: {new Blob([previewContent]).size} bytes</span>
          {exportMode === "changes" && hasChanges && (
            <>
              <span>•</span>
              <span className="text-primary font-medium">Modified tokens only</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
