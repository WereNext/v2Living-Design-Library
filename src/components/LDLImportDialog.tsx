/**
 * LDL Import Dialog
 *
 * Smart token import with auto-format detection, validation, and preview
 * Supports: LDL, W3C DTCG, Figma Variables, Tokens Studio, Style Dictionary, CSS
 */

import { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import {
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Download,
  Copy,
  Check,
  Loader2,
  FileCode,
  Palette,
  Box,
  Type,
  Layers
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

import {
  parse,
  validate,
  generate,
  detectFormat,
  formatIssues,
  LDLTokenDocument,
  ValidationIssue,
  InputFormat,
  OutputFormat,
  isColorWithForeground
} from '../lib/ldl';

interface LDLImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (document: LDLTokenDocument, css: string) => void;
}

const FORMAT_LABELS: Record<InputFormat, { label: string; icon: string; color: string }> = {
  'ldl': { label: 'LDL', icon: '🎨', color: 'bg-blue-500' },
  'w3c-dtcg': { label: 'W3C Design Tokens', icon: '🌐', color: 'bg-green-500' },
  'figma-variables': { label: 'Figma Variables', icon: '🎨', color: 'bg-purple-500' },
  'tokens-studio': { label: 'Tokens Studio', icon: '🔧', color: 'bg-orange-500' },
  'style-dictionary': { label: 'Style Dictionary', icon: '📖', color: 'bg-yellow-500' },
  'unknown': { label: 'Unknown', icon: '❓', color: 'bg-gray-500' }
};

const EXAMPLE_TEMPLATES = {
  ldl: `{
  "$name": "My Design System",
  "$version": "1.0.0",
  "color": {
    "primary": { "value": "#3b82f6", "foreground": "#ffffff" },
    "secondary": { "value": "#6b7280", "foreground": "#ffffff" },
    "background": { "value": "#ffffff", "foreground": "#0a0a0a" },
    "muted": { "value": "#f4f4f5", "foreground": "#71717a" },
    "destructive": { "value": "#ef4444", "foreground": "#ffffff" },
    "border": "#e4e4e7"
  },
  "space": {
    "1": "0.25rem",
    "2": "0.5rem",
    "4": "1rem",
    "8": "2rem"
  },
  "radius": {
    "sm": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem"
  },
  "shadow": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  }
}`,
  w3c: `{
  "color": {
    "primary": {
      "$value": "#3b82f6",
      "$type": "color"
    },
    "background": {
      "$value": "#ffffff",
      "$type": "color"
    }
  },
  "spacing": {
    "md": {
      "$value": "1rem",
      "$type": "dimension"
    }
  }
}`,
  figma: `{
  "meta": {
    "variables": {
      "var1": {
        "id": "var1",
        "name": "colors/primary",
        "resolvedType": "COLOR",
        "valuesByMode": {
          "mode1": { "r": 0.231, "g": 0.51, "b": 0.965, "a": 1 }
        }
      }
    }
  }
}`,
  tokensStudio: `{
  "$themes": [],
  "global": {
    "colors": {
      "primary": { "value": "#3b82f6", "type": "color" },
      "background": { "value": "#ffffff", "type": "color" }
    },
    "spacing": {
      "md": { "value": "16px", "type": "spacing" }
    }
  }
}`
};

export function LDLImportDialog({ open, onOpenChange, onImport }: LDLImportDialogProps) {
  const [input, setInput] = useState('');
  const [detectedFormat, setDetectedFormat] = useState<InputFormat>('unknown');
  const [parsedDocument, setParsedDocument] = useState<LDLTokenDocument | null>(null);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'paste' | 'preview' | 'export'>('paste');
  const [copied, setCopied] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<OutputFormat>('css');

  // Process input whenever it changes
  const processInput = useCallback((text: string) => {
    if (!text.trim()) {
      setDetectedFormat('unknown');
      setParsedDocument(null);
      setValidationIssues([]);
      setParseErrors([]);
      return;
    }

    setIsProcessing(true);

    try {
      // Detect format first
      const parsed = JSON.parse(text);
      const format = detectFormat(parsed);
      setDetectedFormat(format);

      // Parse to LDL
      const parseResult = parse(parsed);

      if (!parseResult.success || !parseResult.document) {
        setParseErrors(parseResult.errors);
        setParsedDocument(null);
        setValidationIssues([]);
      } else {
        setParseErrors([]);
        setParsedDocument(parseResult.document);

        // Validate
        const validationResult = validate(parseResult.document);
        setValidationIssues(validationResult.issues);
      }
    } catch (e) {
      setParseErrors([e instanceof Error ? e.message : 'Invalid JSON']);
      setDetectedFormat('unknown');
      setParsedDocument(null);
      setValidationIssues([]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Debounced processing
  useEffect(() => {
    const timer = setTimeout(() => {
      processInput(input);
    }, 300);

    return () => clearTimeout(timer);
  }, [input, processInput]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      toast.success(`Loaded ${file.name}`);
    };
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!parsedDocument) {
      toast.error('No valid tokens to import');
      return;
    }

    const hasErrors = validationIssues.some(i => i.severity === 'error');
    if (hasErrors) {
      toast.error('Please fix validation errors before importing');
      return;
    }

    // Generate CSS
    const cssResult = generate(parsedDocument, { format: 'css', includeModes: true });

    if (!cssResult.success) {
      toast.error('Failed to generate CSS');
      return;
    }

    onImport(parsedDocument, cssResult.output);
    toast.success(`Imported "${parsedDocument.$name}" successfully!`);
    onOpenChange(false);

    // Reset state
    setInput('');
    setParsedDocument(null);
  };

  const handleCopyExport = async () => {
    if (!parsedDocument) return;

    const result = generate(parsedDocument, { format: selectedExportFormat });
    if (result.success) {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard!');
    }
  };

  const handleDownloadExport = () => {
    if (!parsedDocument) return;

    const result = generate(parsedDocument, { format: selectedExportFormat });
    if (!result.success) {
      toast.error('Export failed');
      return;
    }

    const extensions: Record<OutputFormat, string> = {
      'css': 'css',
      'scss': 'scss',
      'tailwind-config': 'js',
      'tailwind-css': 'css',
      'json': 'json',
      'typescript': 'ts',
      'ios-swift': 'swift',
      'android-xml': 'xml',
      'w3c-dtcg': 'tokens.json'
    };

    const blob = new Blob([result.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsedDocument.$name.toLowerCase().replace(/\s+/g, '-')}.${extensions[selectedExportFormat]}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const loadTemplate = (template: keyof typeof EXAMPLE_TEMPLATES) => {
    setInput(EXAMPLE_TEMPLATES[template]);
    toast.success('Template loaded');
  };

  const errorCount = validationIssues.filter(i => i.severity === 'error').length;
  const warningCount = validationIssues.filter(i => i.severity === 'warning').length;
  const infoCount = validationIssues.filter(i => i.severity === 'info').length;

  const tokenStats = parsedDocument ? {
    colors: Object.keys(parsedDocument.color || {}).length,
    space: Object.keys(parsedDocument.space || {}).length,
    radius: Object.keys(parsedDocument.radius || {}).length,
    shadow: Object.keys(parsedDocument.shadow || {}).length,
    font: (
      Object.keys(parsedDocument.font?.family || {}).length +
      Object.keys(parsedDocument.font?.size || {}).length +
      Object.keys(parsedDocument.font?.weight || {}).length
    )
  } : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Smart Token Import
          </DialogTitle>
          <DialogDescription>
            Paste or upload design tokens in any format - LDL auto-detects and converts
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="paste">Import</TabsTrigger>
            <TabsTrigger value="preview" disabled={!parsedDocument}>
              Preview {parsedDocument && <Badge variant="secondary" className="ml-1">{tokenStats?.colors || 0}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="export" disabled={!parsedDocument}>Export</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="flex-1 flex flex-col min-h-0 mt-4">
            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
              {/* Input Panel */}
              <div className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <Label>Paste Tokens</Label>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadTemplate('ldl')}
                      title="Load LDL example"
                    >
                      LDL
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadTemplate('w3c')}
                      title="Load W3C example"
                    >
                      W3C
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadTemplate('tokensStudio')}
                      title="Load Tokens Studio example"
                    >
                      TS
                    </Button>
                  </div>
                </div>

                <Textarea
                  placeholder="Paste your design tokens here (JSON)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 font-mono text-xs resize-none min-h-[300px]"
                />

                {/* File Upload */}
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".json,.tokens,.tokens.json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="ldl-file-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => document.getElementById('ldl-file-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>

              {/* Validation Panel */}
              <div className="flex flex-col min-h-0">
                <Label className="mb-2">Validation</Label>

                <ScrollArea className="flex-1 border rounded-md p-3 min-h-[300px]">
                  {/* Format Detection */}
                  {input.trim() && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileJson className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">Format Detected:</span>
                        <Badge className={FORMAT_LABELS[detectedFormat].color}>
                          {FORMAT_LABELS[detectedFormat].icon} {FORMAT_LABELS[detectedFormat].label}
                        </Badge>
                      </div>

                      {parsedDocument && (
                        <p className="text-xs text-muted-foreground">
                          Converting to LDL format...
                        </p>
                      )}
                    </div>
                  )}

                  {/* Parse Errors */}
                  {parseErrors.length > 0 && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Parse Error</AlertTitle>
                      <AlertDescription>
                        {parseErrors.map((err, i) => (
                          <div key={i} className="text-xs">{err}</div>
                        ))}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Token Stats */}
                  {tokenStats && (
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                        <Palette className="w-4 h-4 mb-1" />
                        <span className="text-lg font-bold">{tokenStats.colors}</span>
                        <span className="text-xs text-muted-foreground">Colors</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                        <Box className="w-4 h-4 mb-1" />
                        <span className="text-lg font-bold">{tokenStats.space}</span>
                        <span className="text-xs text-muted-foreground">Space</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                        <Layers className="w-4 h-4 mb-1" />
                        <span className="text-lg font-bold">{tokenStats.radius}</span>
                        <span className="text-xs text-muted-foreground">Radius</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                        <Layers className="w-4 h-4 mb-1" />
                        <span className="text-lg font-bold">{tokenStats.shadow}</span>
                        <span className="text-xs text-muted-foreground">Shadow</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                        <Type className="w-4 h-4 mb-1" />
                        <span className="text-lg font-bold">{tokenStats.font}</span>
                        <span className="text-xs text-muted-foreground">Font</span>
                      </div>
                    </div>
                  )}

                  {/* Validation Summary */}
                  {validationIssues.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Issues:</span>
                        {errorCount > 0 && (
                          <Badge variant="destructive">{errorCount} errors</Badge>
                        )}
                        {warningCount > 0 && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                            {warningCount} warnings
                          </Badge>
                        )}
                        {infoCount > 0 && (
                          <Badge variant="secondary">{infoCount} suggestions</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Validation Issues List */}
                  {validationIssues.length > 0 && (
                    <div className="space-y-2">
                      {validationIssues.map((issue, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-md text-xs ${
                            issue.severity === 'error'
                              ? 'bg-destructive/10 border border-destructive/20'
                              : issue.severity === 'warning'
                              ? 'bg-yellow-500/10 border border-yellow-500/20'
                              : 'bg-blue-500/10 border border-blue-500/20'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {issue.severity === 'error' ? (
                              <AlertCircle className="w-3 h-3 mt-0.5 text-destructive" />
                            ) : issue.severity === 'warning' ? (
                              <AlertTriangle className="w-3 h-3 mt-0.5 text-yellow-600" />
                            ) : (
                              <Info className="w-3 h-3 mt-0.5 text-blue-500" />
                            )}
                            <div className="flex-1">
                              <code className="text-[10px] text-muted-foreground">{issue.path}</code>
                              <p className="mt-0.5">{issue.message}</p>
                              {issue.suggestion && (
                                <p className="mt-1 text-muted-foreground">→ {issue.suggestion}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Success State */}
                  {parsedDocument && errorCount === 0 && (
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-600">Ready to Import</AlertTitle>
                      <AlertDescription className="text-green-600/80">
                        "{parsedDocument.$name}" validated successfully
                        {parsedDocument.$version && ` (v${parsedDocument.$version})`}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Empty State */}
                  {!input.trim() && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <FileCode className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-sm">Paste or upload your tokens</p>
                      <p className="text-xs mt-1">Supports LDL, W3C, Figma, Tokens Studio</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 flex flex-col min-h-0 mt-4">
            {parsedDocument && (
              <ScrollArea className="flex-1 border rounded-md p-4">
                {/* Colors */}
                {parsedDocument.color && Object.keys(parsedDocument.color).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Colors ({Object.keys(parsedDocument.color).length})
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(parsedDocument.color).map(([name, token]) => {
                        const value = isColorWithForeground(token) ? token.value : token;
                        const foreground = isColorWithForeground(token) ? token.foreground : null;

                        return (
                          <div key={name} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                            <div
                              className="w-8 h-8 rounded-md border flex items-center justify-center text-xs font-bold"
                              style={{
                                backgroundColor: value,
                                color: foreground || undefined
                              }}
                            >
                              {foreground && 'Aa'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Space */}
                {parsedDocument.space && Object.keys(parsedDocument.space).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      Spacing ({Object.keys(parsedDocument.space).length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(parsedDocument.space).map(([name, value]) => (
                        <div key={name} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <div
                            className="h-4 bg-primary rounded"
                            style={{ width: value }}
                          />
                          <div>
                            <span className="text-xs font-medium">{name}</span>
                            <span className="text-xs text-muted-foreground ml-1">({value})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Radius */}
                {parsedDocument.radius && Object.keys(parsedDocument.radius).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Border Radius ({Object.keys(parsedDocument.radius).length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(parsedDocument.radius).map(([name, value]) => (
                        <div key={name} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <div
                            className="w-8 h-8 bg-primary"
                            style={{ borderRadius: value }}
                          />
                          <div>
                            <span className="text-xs font-medium">{name}</span>
                            <span className="text-xs text-muted-foreground ml-1">({value})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shadow */}
                {parsedDocument.shadow && Object.keys(parsedDocument.shadow).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Shadows ({Object.keys(parsedDocument.shadow).length})
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(parsedDocument.shadow).map(([name, value]) => (
                        <div key={name} className="flex flex-col items-center p-3 bg-background rounded-md">
                          <div
                            className="w-16 h-16 bg-card rounded-md mb-2"
                            style={{ boxShadow: value }}
                          />
                          <span className="text-xs font-medium">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="export" className="flex-1 flex flex-col min-h-0 mt-4">
            {parsedDocument && (
              <div className="flex flex-col gap-4 h-full">
                <div className="flex items-center gap-2">
                  <Label>Export Format:</Label>
                  <select
                    value={selectedExportFormat}
                    onChange={(e) => setSelectedExportFormat(e.target.value as OutputFormat)}
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    <option value="css">CSS Variables</option>
                    <option value="scss">SCSS Variables</option>
                    <option value="tailwind-config">Tailwind Config (v3)</option>
                    <option value="tailwind-css">Tailwind CSS (v4)</option>
                    <option value="typescript">TypeScript</option>
                    <option value="json">JSON (LDL)</option>
                    <option value="ios-swift">iOS Swift</option>
                    <option value="android-xml">Android XML</option>
                    <option value="w3c-dtcg">W3C Design Tokens</option>
                  </select>
                </div>

                <ScrollArea className="flex-1 border rounded-md">
                  <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
                    {generate(parsedDocument, { format: selectedExportFormat }).output}
                  </pre>
                </ScrollArea>

                <div className="flex gap-2">
                  <Button onClick={handleCopyExport} variant="outline" className="flex-1">
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button onClick={handleDownloadExport} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!parsedDocument || errorCount > 0}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Tokens
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
