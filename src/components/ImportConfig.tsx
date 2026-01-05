import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Upload, Download, RefreshCw, Check, Copy, AlertCircle, CheckCircle2, FileJson, FileCode, Eye, EyeOff, BookOpen, Package, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { IntentCreator } from "./IntentCreator";
import { ComponentImportDialog } from "./ComponentImportDialog";
import { LDLImportDialog } from "./LDLImportDialog";
import { useDesignSystems } from "../hooks/useDesignSystems";
import {
  parseTokens,
  parseCSSVariables,
  tokenSetToCSS,
  applyTokensToDocument,
  validateTokenSet,
  type TokenSet
} from "../lib/token-utilities";
import { LDLTokenDocument, isColorWithForeground } from "../lib/ldl";

interface ImportConfigProps {
  onIntentCreated?: (intent: any) => void;
  availableIntents?: Array<{ value: string; label: string }>;
}

export function ImportConfig({ onIntentCreated, availableIntents = [] }: ImportConfigProps) {
  const [jsonConfig, setJsonConfig] = useState("");
  const [cssVariables, setCssVariables] = useState("");
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewTokens, setPreviewTokens] = useState<TokenSet | null>(null);
  const [showComponentImport, setShowComponentImport] = useState(false);
  const [showLDLImport, setShowLDLImport] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const { systems, activeSystemId } = useDesignSystems();

  // Handle LDL import
  const handleLDLImport = (document: LDLTokenDocument, css: string) => {
    // Convert LDL document to TokenSet format for compatibility
    const tokenSet: TokenSet = {
      colors: {},
      spacing: {},
      typography: {},
      borderRadius: {},
      shadows: {}
    };

    // Convert colors
    if (document.color) {
      for (const [name, token] of Object.entries(document.color)) {
        if (token === undefined) continue;
        tokenSet.colors[name] = isColorWithForeground(token) ? token.value : token;
        if (isColorWithForeground(token)) {
          tokenSet.colors[`${name}-foreground`] = token.foreground;
        }
      }
    }

    // Convert space
    if (document.space) {
      for (const [name, value] of Object.entries(document.space)) {
        tokenSet.spacing[name] = value;
      }
    }

    // Convert radius
    if (document.radius) {
      for (const [name, value] of Object.entries(document.radius)) {
        tokenSet.borderRadius[name] = value;
      }
    }

    // Convert shadows
    if (document.shadow) {
      for (const [name, value] of Object.entries(document.shadow)) {
        tokenSet.shadows[name] = value;
      }
    }

    // Convert font
    if (document.font) {
      if (document.font.family) {
        for (const [name, value] of Object.entries(document.font.family)) {
          tokenSet.typography[`font-${name}`] = value;
        }
      }
      if (document.font.size) {
        for (const [name, value] of Object.entries(document.font.size)) {
          tokenSet.typography[`text-${name}`] = value;
        }
      }
    }

    // Apply tokens
    applyTokensToDocument(tokenSet);
  };

  // Get current tokens from the active system or generate from CSS variables
  const getCurrentTokens = () => {
    const activeSystem = systems.find(s => s.id === activeSystemId);
    if (activeSystem) {
      return JSON.stringify({
        name: activeSystem.name,
        description: activeSystem.description,
        tokens: {
          colors: activeSystem.colors,
          spacing: activeSystem.spacing,
          typography: activeSystem.typography,
          borderRadius: activeSystem.borderRadius,
          shadows: activeSystem.shadows
        }
      }, null, 2);
    }
    
    // Default tokens if no system is active
    return JSON.stringify({
      name: "Current Tokens",
      tokens: {
        colors: {
          primary: "221.2 83.2% 53.3%",
          secondary: "210 40% 96.1%",
          accent: "210 40% 96.1%"
        },
        spacing: {
          xs: "0.5rem",
          sm: "0.75rem",
          md: "1rem"
        }
      }
    }, null, 2);
  };

  const currentTokens = getCurrentTokens();

  const handleImportJSON = async () => {
    setIsImporting(true);
    try {
      const parsed = JSON.parse(jsonConfig);

      // Use token utilities to parse and validate
      const tokenSet = parseTokens(parsed);
      const validation = validateTokenSet(tokenSet);

      if (!validation.valid) {
        toast.error(`Invalid tokens: ${validation.errors.join(', ')}`);
        setIsImporting(false);
        return;
      }

      // Apply tokens using utility function
      applyTokensToDocument(tokenSet);
      setValidationError("");
      toast.success("Design tokens imported successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid JSON format. Please check your input.";
      setValidationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportCSS = async () => {
    setIsImporting(true);
    try {
      // Parse CSS variables using utility function
      const tokenSet = parseCSSVariables(cssVariables);
      const validation = validateTokenSet(tokenSet);

      if (!validation.valid) {
        toast.error(`Invalid tokens: ${validation.errors.join(', ')}`);
        setIsImporting(false);
        return;
      }

      // Apply tokens
      applyTokensToDocument(tokenSet);
      setValidationError("");
      toast.success("CSS variables imported successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error importing CSS variables.";
      setValidationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([currentTokens], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-tokens.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Design tokens exported!");
  };

  const handleExportCSS = () => {
    try {
      const parsed = JSON.parse(currentTokens);
      const tokenSet = parseTokens(parsed);
      const cssOutput = tokenSetToCSS(tokenSet);
      
      const blob = new Blob([cssOutput], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'design-tokens.css';
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSS variables exported!");
    } catch (error) {
      toast.error("Error exporting CSS variables.");
    }
  };

  const handleReset = () => {
    // Reset to default styles
    window.location.reload();
    toast.success("Reset to default configuration!");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentTokens);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const handlePreview = () => {
    try {
      const parsed = JSON.parse(jsonConfig);
      setPreviewTokens(parsed);
      setShowPreview(true);
    } catch (error) {
      setValidationError("Invalid JSON format. Please check your input.");
    }
  };

  const handleHidePreview = () => {
    setShowPreview(false);
    setValidationError("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="mb-2">Import Design Configuration</h1>
        <p className="text-muted-foreground">
          Import design tokens from Figma, Tailwind, or CSS. Import full components from Figma with automatic code generation.
        </p>
      </div>

      {/* Quick Link to Guide */}
      <Alert>
        <BookOpen className="h-4 w-4" />
        <AlertDescription>
          <strong>New to design tokens?</strong> Check out the{" "}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // Note: In actual app, this would trigger navigation to quick-start page
            }}
            className="underline font-medium"
          >
            Quick Start Guide
          </a>{" "}
          to learn how the token system works and how to import your brand's design system.
        </AlertDescription>
      </Alert>

      {/* Smart LDL Import - Primary CTA */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Smart Token Import (LDL)
          </CardTitle>
          <CardDescription>
            Auto-detect and import from any format: LDL, W3C, Figma, Tokens Studio, Style Dictionary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <strong>Universal import:</strong> Paste tokens from any source - format is auto-detected.
                Includes real-time validation, preview, and export to 9+ formats.
              </AlertDescription>
            </Alert>

            <Button onClick={() => setShowLDLImport(true)} className="w-full" size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Open Smart Import
            </Button>

            <div className="grid grid-cols-4 gap-2 text-xs text-center text-muted-foreground">
              <div className="p-2 bg-muted rounded-md">LDL</div>
              <div className="p-2 bg-muted rounded-md">W3C DTCG</div>
              <div className="p-2 bg-muted rounded-md">Figma</div>
              <div className="p-2 bg-muted rounded-md">Tokens Studio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload from file */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Import from File</CardTitle>
          <CardDescription>
            Upload a JSON or CSS file with your design tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Input
              type="file"
              accept=".json,.css"
              disabled={isFileLoading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setIsFileLoading(true);
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const content = event.target?.result as string;
                    if (file.name.endsWith('.json')) {
                      setJsonConfig(content);
                      try {
                        const parsed = JSON.parse(content);
                        const tokenSet = parseTokens(parsed);
                        applyTokensToDocument(tokenSet);
                        toast.success("File imported successfully!");
                      } catch {
                        toast.error("Invalid JSON file");
                      }
                    } else if (file.name.endsWith('.css')) {
                      setCssVariables(content);
                      try {
                        const tokenSet = parseCSSVariables(content);
                        applyTokensToDocument(tokenSet);
                        toast.success("File imported successfully!");
                      } catch {
                        toast.error("Invalid CSS file");
                      }
                    }
                    setIsFileLoading(false);
                  };
                  reader.onerror = () => {
                    toast.error("Error reading file");
                    setIsFileLoading(false);
                  };
                  reader.readAsText(file);
                }
              }}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className={`cursor-pointer ${isFileLoading ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex flex-col items-center gap-2">
                {isFileLoading ? (
                  <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground" />
                )}
                <p className="text-sm">
                  {isFileLoading ? "Processing file..." : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">
                  JSON or CSS files only
                </p>
              </div>
            </label>
          </div>

          <Button onClick={handleReset} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </CardContent>
      </Card>

      {/* Import Components from Figma */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5" />
            Import Components from Figma
          </CardTitle>
          <CardDescription>
            Import full components from Figma and make them editable in your library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <strong>What you can import:</strong> Buttons, forms, cards, navigation, heroes - any component from Figma. The system will parse the structure, download images, and generate editable code.
              </AlertDescription>
            </Alert>

            <Button onClick={() => setShowComponentImport(true)} className="w-full" size="lg">
              <Upload className="w-4 h-4 mr-2" />
              Import Component from Figma
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Components import with full structure and styles</p>
              <p>• Images are downloaded and optimized automatically</p>
              <p>• Code is generated for React, Vue, Svelte, Angular</p>
              <p>• View imported components in the "Imported Components" page</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Tokens</CardTitle>
            <CardDescription>
              View and export your current design system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                value={currentTokens}
                readOnly
                className="font-mono text-xs h-64 resize-none"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="absolute top-2 right-2 h-8"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExportJSON} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button onClick={handleExportCSS} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export CSS
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Import Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Import Tokens</CardTitle>
            <CardDescription>
              Paste your design tokens to apply them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="json">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="css">CSS Variables</TabsTrigger>
              </TabsList>
              
              <TabsContent value="json" className="space-y-4">
                <div>
                  <Label htmlFor="json-input">JSON Configuration</Label>
                  <Textarea
                    id="json-input"
                    placeholder="Paste your JSON design tokens here..."
                    value={jsonConfig}
                    onChange={(e) => setJsonConfig(e.target.value)}
                    className="font-mono text-xs h-48 mt-2"
                  />
                </div>
                <Button onClick={handleImportJSON} className="w-full" disabled={isImporting || !jsonConfig}>
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import JSON
                    </>
                  )}
                </Button>
                <Button onClick={handlePreview} variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </TabsContent>

              <TabsContent value="css" className="space-y-4">
                <div>
                  <Label htmlFor="css-input">CSS Variables</Label>
                  <Textarea
                    id="css-input"
                    placeholder="--primary: 221.2 83.2% 53.3%;&#10;--background: 0 0% 100%;&#10;..."
                    value={cssVariables}
                    onChange={(e) => setCssVariables(e.target.value)}
                    className="font-mono text-xs h-48 mt-2"
                  />
                </div>
                <Button onClick={handleImportCSS} className="w-full" disabled={isImporting || !cssVariables}>
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import CSS
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Platform Import Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Templates</CardTitle>
          <CardDescription>
            Quick start templates from popular design tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col items-start"
              onClick={() => {
                setJsonConfig(currentTokens);
                toast.success("Figma template loaded");
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileJson className="w-4 h-4" />
                <span className="font-semibold">Figma Variables</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Export from Figma &gt; Variables &gt; Export as JSON
              </span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col items-start"
              onClick={() => {
                const tailwindExample = `{
  "colors": {
    "primary": "220 100% 54%",
    "secondary": "240 5% 96%",
    "accent": "160 60% 45%"
  }
}`;
                setJsonConfig(tailwindExample);
                toast.success("Tailwind template loaded");
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileCode className="w-4 h-4" />
                <span className="font-semibold">Tailwind Config</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Convert your tailwind.config.js theme values
              </span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col items-start"
              onClick={() => {
                const cssExample = `--primary: 221.2 83.2% 53.3%;
--secondary: 210 40% 96.1%;
--border: 214.3 31.8% 91.4%;`;
                setCssVariables(cssExample);
                toast.success("CSS Variables template loaded");
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileCode className="w-4 h-4" />
                <span className="font-semibold">CSS Variables</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Standard CSS custom properties format
              </span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col items-start"
              onClick={() => {
                toast("Coming soon!");
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileJson className="w-4 h-4" />
                <span className="font-semibold">Design Tokens (W3C)</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Standard W3C Design Tokens format
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Custom Intent */}
      {jsonConfig && onIntentCreated && (
        <IntentCreator
          onIntentCreated={(intent) => {
            onIntentCreated(intent);
            toast.success(`Custom intent "${intent.label}" created!`);
          }}
          tokens={jsonConfig ? (() => {
            try {
              return JSON.parse(jsonConfig);
            } catch {
              return null;
            }
          })() : null}
        />
      )}

      {/* Token Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Token Structure Guide</CardTitle>
          <CardDescription>
            Comprehensive token system with examples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="colors">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="spacing">Spacing</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm mb-2 flex items-center gap-2">
                  <Badge variant="secondary">Required</Badge>
                  Color Tokens (HSL format)
                </h4>
                <code className="text-xs bg-muted p-3 rounded block whitespace-pre overflow-x-auto">
{`"colors": {
  "background": "0 0% 100%",
  "foreground": "222.2 84% 4.9%",
  "primary": "221.2 83.2% 53.3%",
  "primary-foreground": "210 40% 98%",
  "secondary": "210 40% 96.1%",
  "secondary-foreground": "222.2 47.4% 11.2%",
  "muted": "210 40% 96.1%",
  "muted-foreground": "215.4 16.3% 46.9%",
  "accent": "210 40% 96.1%",
  "destructive": "0 84.2% 60.2%",
  "border": "214.3 31.8% 91.4%",
  "ring": "221.2 83.2% 53.3%"
}`}
                </code>
              </div>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Colors support HSL, RGB, or hex values. HSL recommended for better theming.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm mb-2 flex items-center gap-2">
                  <Badge variant="secondary">Optional</Badge>
                  Typography System
                </h4>
                <code className="text-xs bg-muted p-3 rounded block whitespace-pre overflow-x-auto">
{`"typography": {
  "fontSizes": {
    "xs": "0.75rem",
    "sm": "0.875rem",
    "base": "1rem",
    "lg": "1.125rem",
    "xl": "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem"
  },
  "fontWeights": {
    "normal": "400",
    "medium": "500",
    "semibold": "600",
    "bold": "700"
  },
  "lineHeights": {
    "tight": "1.25",
    "normal": "1.5",
    "relaxed": "1.75"
  }
},
"fonts": {
  "sans": "Inter, system-ui, sans-serif",
  "mono": "JetBrains Mono, monospace",
  "serif": "Georgia, serif"
}`}
                </code>
              </div>
            </TabsContent>

            <TabsContent value="spacing" className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm mb-2 flex items-center gap-2">
                  <Badge variant="secondary">Optional</Badge>
                  Spacing & Layout
                </h4>
                <code className="text-xs bg-muted p-3 rounded block whitespace-pre overflow-x-auto">
{`"spacing": {
  "xs": "0.25rem",
  "sm": "0.5rem",
  "md": "1rem",
  "lg": "1.5rem",
  "xl": "2rem",
  "2xl": "3rem",
  "3xl": "4rem"
},
"borderRadius": {
  "none": "0",
  "sm": "0.375rem",
  "md": "0.5rem",
  "lg": "0.75rem",
  "xl": "1rem",
  "2xl": "1.5rem",
  "full": "9999px"
}`}
                </code>
              </div>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm mb-2 flex items-center gap-2">
                  <Badge variant="secondary">Optional</Badge>
                  Shadows & Effects
                </h4>
                <code className="text-xs bg-muted p-3 rounded block whitespace-pre overflow-x-auto">
{`"shadows": {
  "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1)"
},
"transitions": {
  "fast": "150ms",
  "base": "200ms",
  "slow": "300ms"
}`}
                </code>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview Tokens</CardTitle>
            <CardDescription>
              Preview the design tokens you are about to import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                value={JSON.stringify(previewTokens, null, 2)}
                readOnly
                className="font-mono text-xs h-64 resize-none"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="absolute top-2 right-2 h-8"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleImportJSON} className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Import JSON
              </Button>
              <Button onClick={handleHidePreview} variant="outline" className="flex-1">
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Preview
              </Button>
            </div>
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {validationError}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Component Import Dialog */}
      <ComponentImportDialog
        open={showComponentImport}
        onOpenChange={setShowComponentImport}
        onImportComplete={(component) => {
          toast.success(`Component "${component.name}" imported successfully!`);
          setShowComponentImport(false);
        }}
      />

      {/* LDL Import Dialog */}
      <LDLImportDialog
        open={showLDLImport}
        onOpenChange={setShowLDLImport}
        onImport={handleLDLImport}
      />
    </div>
  );
}
