/**
 * LDL Import Dialog
 *
 * Smart token import with auto-format detection, validation, and preview
 * Supports: LDL, W3C DTCG, Figma Variables, Tokens Studio, Style Dictionary, CSS
 */

import { useState, useCallback, useEffect } from 'react';
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
  Layers,
  Target,
  X,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

import {
  parse,
  validate,
  generate,
  detectFormat,
  LDLTokenDocument,
  ValidationIssue,
  InputFormat,
  OutputFormat,
  isColorWithForeground
} from '../lib/ldl';

interface DesignSystemIntent {
  id: string;
  label: string;
  description?: string;
}

interface LDLImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (document: LDLTokenDocument, css: string, selectedIntent?: DesignSystemIntent) => void;
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

const STEPS = [
  { title: 'Import', description: 'Paste or upload tokens' },
  { title: 'Preview', description: 'Review your tokens' },
  { title: 'Export', description: 'Choose output format' },
];

export function LDLImportDialog({ open, onOpenChange, onImport }: LDLImportDialogProps) {
  const [input, setInput] = useState('');
  const [detectedFormat, setDetectedFormat] = useState<InputFormat>('unknown');
  const [parsedDocument, setParsedDocument] = useState<LDLTokenDocument | null>(null);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<OutputFormat>('css');
  const [availableIntents, setAvailableIntents] = useState<DesignSystemIntent[]>([]);
  const [selectedIntent, setSelectedIntent] = useState<DesignSystemIntent | null>(null);

  // Process input whenever it changes
  const processInput = useCallback((text: string) => {
    if (!text.trim()) {
      setDetectedFormat('unknown');
      setParsedDocument(null);
      setValidationIssues([]);
      setParseErrors([]);
      setAvailableIntents([]);
      setSelectedIntent(null);
      return;
    }

    setIsProcessing(true);

    try {
      const parsed = JSON.parse(text);
      const format = detectFormat(parsed);
      setDetectedFormat(format);

      if (parsed.intents && Array.isArray(parsed.intents)) {
        const intents: DesignSystemIntent[] = parsed.intents.map((intent: Record<string, string>) => ({
          id: intent.id,
          label: intent.label,
          description: intent.description
        }));
        setAvailableIntents(intents);
        if (intents.length > 0) {
          setSelectedIntent(intents[0]);
        }
      } else {
        setAvailableIntents([]);
        setSelectedIntent(null);
      }

      const parseResult = parse(parsed);

      if (!parseResult.success || !parseResult.document) {
        setParseErrors(parseResult.errors);
        setParsedDocument(null);
        setValidationIssues([]);
      } else {
        setParseErrors([]);
        setParsedDocument(parseResult.document);
        const validationResult = validate(parseResult.document);
        setValidationIssues(validationResult.issues);
      }
    } catch (e) {
      setParseErrors([e instanceof Error ? e.message : 'Invalid JSON']);
      setDetectedFormat('unknown');
      setParsedDocument(null);
      setValidationIssues([]);
      setAvailableIntents([]);
      setSelectedIntent(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

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

    const cssResult = generate(parsedDocument, { format: 'css', includeModes: true });

    if (!cssResult.success) {
      toast.error('Failed to generate CSS');
      return;
    }

    onImport(parsedDocument, cssResult.output, selectedIntent || undefined);

    const intentMsg = selectedIntent ? ` with "${selectedIntent.label}" intent` : '';
    toast.success(`Imported "${parsedDocument.$name}"${intentMsg} successfully!`);
    handleClose();
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

  const handleClose = () => {
    setInput('');
    setParsedDocument(null);
    setAvailableIntents([]);
    setSelectedIntent(null);
    setStep(0);
    onOpenChange(false);
  };

  const errorCount = validationIssues.filter(i => i.severity === 'error').length;
  const warningCount = validationIssues.filter(i => i.severity === 'warning').length;

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

  const canProceed = step === 0 ? parsedDocument && errorCount === 0 : true;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-background/80 backdrop-blur-sm">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-card border rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Smart Token Import</h2>
                <p className="text-sm text-muted-foreground">
                  Auto-detect and import from any format
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress */}
          <div className="h-1 bg-muted shrink-0">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          {/* Step Tabs */}
          <div className="flex border-b shrink-0">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => i <= (parsedDocument ? 2 : 0) && setStep(i)}
                disabled={i > 0 && !parsedDocument}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  step === i
                    ? 'border-primary text-primary'
                    : i <= (parsedDocument ? 2 : 0)
                    ? 'border-transparent hover:text-foreground text-muted-foreground'
                    : 'border-transparent text-muted-foreground/50 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                    step === i ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {i + 1}
                  </span>
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {/* Step 0: Import */}
            {step === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Left: Input */}
                <div className="flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Paste Tokens (JSON)</Label>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => loadTemplate('ldl')}>LDL</Button>
                      <Button variant="ghost" size="sm" onClick={() => loadTemplate('w3c')}>W3C</Button>
                      <Button variant="ghost" size="sm" onClick={() => loadTemplate('tokensStudio')}>TS</Button>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Paste your design tokens here (JSON)..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 font-mono text-xs resize-none min-h-[300px]"
                  />

                  <div className="mt-3">
                    <input
                      type="file"
                      accept=".json,.tokens,.tokens.json"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="ldl-file-upload"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById('ldl-file-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </div>

                {/* Right: Validation */}
                <div className="flex flex-col min-h-0">
                  <Label className="text-sm font-medium mb-3">Validation Status</Label>

                  <div className="flex-1 border rounded-lg p-4 overflow-y-auto min-h-[300px] space-y-4">
                    {/* Format Detection */}
                    {input.trim() && (
                      <div className="flex items-center gap-2">
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileJson className="w-4 h-4" />
                        )}
                        <span className="text-sm">Format:</span>
                        <Badge className={FORMAT_LABELS[detectedFormat].color}>
                          {FORMAT_LABELS[detectedFormat].icon} {FORMAT_LABELS[detectedFormat].label}
                        </Badge>
                      </div>
                    )}

                    {/* Parse Errors */}
                    {parseErrors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Parse Error</AlertTitle>
                        <AlertDescription className="text-xs">
                          {parseErrors.map((err, i) => <div key={i}>{err}</div>)}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Token Stats */}
                    {tokenStats && (
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { icon: Palette, label: 'Colors', count: tokenStats.colors },
                          { icon: Box, label: 'Space', count: tokenStats.space },
                          { icon: Layers, label: 'Radius', count: tokenStats.radius },
                          { icon: Layers, label: 'Shadow', count: tokenStats.shadow },
                          { icon: Type, label: 'Font', count: tokenStats.font },
                        ].map(({ icon: Icon, label, count }) => (
                          <div key={label} className="flex flex-col items-center p-2 bg-muted rounded-md">
                            <Icon className="w-4 h-4 mb-1" />
                            <span className="text-lg font-bold">{count}</span>
                            <span className="text-[10px] text-muted-foreground">{label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Intent Selection */}
                    {availableIntents.length > 0 && (
                      <div className="p-3 border rounded-md bg-primary/5 border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Design Intent</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {availableIntents.map((intent) => (
                            <Button
                              key={intent.id}
                              variant={selectedIntent?.id === intent.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedIntent(intent)}
                            >
                              {intent.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Validation Issues */}
                    {validationIssues.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Issues:</span>
                          {errorCount > 0 && <Badge variant="destructive">{errorCount} errors</Badge>}
                          {warningCount > 0 && <Badge variant="outline">{warningCount} warnings</Badge>}
                        </div>
                        {validationIssues.slice(0, 5).map((issue, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-md text-xs ${
                              issue.severity === 'error'
                                ? 'bg-destructive/10 border border-destructive/20'
                                : 'bg-yellow-500/10 border border-yellow-500/20'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {issue.severity === 'error' ? (
                                <AlertCircle className="w-3 h-3 mt-0.5 text-destructive" />
                              ) : (
                                <AlertTriangle className="w-3 h-3 mt-0.5 text-yellow-600" />
                              )}
                              <div>
                                <code className="text-[10px] text-muted-foreground">{issue.path}</code>
                                <p className="mt-0.5">{issue.message}</p>
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
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Empty State */}
                    {!input.trim() && (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
                        <FileCode className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm">Paste or upload your tokens</p>
                        <p className="text-xs mt-1">Supports LDL, W3C, Figma, Tokens Studio</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Preview */}
            {step === 1 && parsedDocument && (
              <div className="space-y-6">
                {/* Colors */}
                {parsedDocument.color && Object.keys(parsedDocument.color).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Colors ({Object.keys(parsedDocument.color).length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {Object.entries(parsedDocument.color).map(([name, token]) => {
                        const value = isColorWithForeground(token) ? token.value : token;
                        const foreground = isColorWithForeground(token) ? token.foreground : null;

                        return (
                          <div key={name} className="space-y-1">
                            <div
                              className="aspect-square rounded-lg border shadow-sm flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: value, color: foreground || undefined }}
                            >
                              {foreground && 'Aa'}
                            </div>
                            <p className="text-xs font-medium truncate">{name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Space */}
                {parsedDocument.space && Object.keys(parsedDocument.space).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      Spacing ({Object.keys(parsedDocument.space).length})
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(parsedDocument.space).map(([name, value]) => (
                        <div key={name} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <div className="h-4 bg-primary rounded" style={{ width: value }} />
                          <span className="text-xs font-medium">{name}</span>
                          <span className="text-xs text-muted-foreground">({value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Radius */}
                {parsedDocument.radius && Object.keys(parsedDocument.radius).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Border Radius ({Object.keys(parsedDocument.radius).length})
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(parsedDocument.radius).map(([name, value]) => (
                        <div key={name} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <div className="w-8 h-8 bg-primary" style={{ borderRadius: value }} />
                          <span className="text-xs font-medium">{name}</span>
                          <span className="text-xs text-muted-foreground">({value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shadow */}
                {parsedDocument.shadow && Object.keys(parsedDocument.shadow).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Shadows ({Object.keys(parsedDocument.shadow).length})
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(parsedDocument.shadow).map(([name, value]) => (
                        <div key={name} className="flex flex-col items-center p-3">
                          <div className="w-16 h-16 bg-card rounded-md mb-2" style={{ boxShadow: value }} />
                          <span className="text-xs font-medium">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Export */}
            {step === 2 && parsedDocument && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Export Format</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'css', label: 'CSS Variables' },
                      { value: 'scss', label: 'SCSS Variables' },
                      { value: 'tailwind-config', label: 'Tailwind Config (v3)' },
                      { value: 'tailwind-css', label: 'Tailwind CSS (v4)' },
                      { value: 'typescript', label: 'TypeScript' },
                      { value: 'json', label: 'JSON (LDL)' },
                      { value: 'ios-swift', label: 'iOS Swift' },
                      { value: 'android-xml', label: 'Android XML' },
                      { value: 'w3c-dtcg', label: 'W3C Design Tokens' },
                    ].map((format) => (
                      <button
                        key={format.value}
                        onClick={() => setSelectedExportFormat(format.value as OutputFormat)}
                        className={`w-full px-3 py-2 rounded-md text-left text-sm transition-colors ${
                          selectedExportFormat === format.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Generated Code</Label>
                    <div className="flex gap-2">
                      <Button onClick={handleCopyExport} variant="outline" size="sm">
                        {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button onClick={handleDownloadExport} variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <pre className="flex-1 border rounded-md p-4 text-xs font-mono whitespace-pre-wrap overflow-auto bg-muted min-h-[300px]">
                    {generate(parsedDocument, { format: selectedExportFormat }).output}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t flex items-center justify-between shrink-0">
            <Button
              variant="outline"
              onClick={() => step > 0 ? setStep(step - 1) : handleClose()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step > 0 ? 'Back' : 'Cancel'}
            </Button>

            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step ? 'bg-primary' : i < step ? 'bg-primary/50' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {step < 2 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleImport} disabled={!parsedDocument || errorCount > 0}>
                <Upload className="w-4 h-4 mr-2" />
                Import Tokens
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
