import { useState, useEffect } from 'react';
import { X, Sparkles, Upload, Palette, Code, Check, ArrowRight, ArrowLeft, FileJson, Wand2, Edit3, Eye } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DesignTokens, TokenNormalizer, SimpleDesignTokens } from '../types/design-tokens';
import { TokenEditor } from './TokenEditor';

interface QuickStartWizardProps {
  onClose: () => void;
}

interface DesignSystemData {
  name: string;
  description: string;
  tokens: DesignTokens;
}

export function QuickStartWizard({ onClose }: QuickStartWizardProps) {
  const [step, setStep] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'manual' | 'template'>('template');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [systemName, setSystemName] = useState('');
  const [systemDescription, setSystemDescription] = useState('');
  const [parsedTokens, setParsedTokens] = useState<DesignTokens | null>(null);
  const [previewMode, setPreviewMode] = useState<'tokens' | 'visual' | 'edit'>('visual');
  
  // Manual token creation
  const [manualTokens, setManualTokens] = useState<DesignTokens>({
    colors: {
      'primary': '240 100% 50%',
      'background': '0 0% 100%',
      'foreground': '0 0% 0%',
    },
    typography: {
      'font-base': '16px',
      'font-lg': '18px',
    },
    spacing: {
      'space-sm': '8px',
      'space-md': '16px',
    },
    borderRadius: {
      'radius-sm': '4px',
      'radius-md': '8px',
    },
  });

  const { addDesignSystem, applySystem } = useAppState();

  const steps = [
    {
      title: 'Welcome to Your Design System Builder',
      icon: Sparkles,
      description: 'Create a custom design system in minutes',
    },
    {
      title: 'Choose Your Starting Point',
      icon: Upload,
      description: 'Upload tokens, start from scratch, or use a template',
    },
    {
      title: 'Configure Your Tokens',
      icon: Code,
      description: 'Review and customize your design tokens',
    },
    {
      title: 'Preview Your System',
      icon: Eye,
      description: 'See how your tokens look in action',
    },
    {
      title: 'Name & Save',
      icon: Check,
      description: 'Give your design system a name',
    },
  ];

  // Parse JSON input
  const handleJsonParse = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      
      // Validate structure
      if (typeof parsed !== 'object') {
        throw new Error('Invalid JSON structure');
      }

      // Transform Figma-style tokens to our format
      const tokens: DesignTokens = {};

      // Handle colors
      if (parsed.colors || parsed.color) {
        const colorObj = parsed.colors || parsed.color;
        tokens.colors = {};
        Object.entries(colorObj).forEach(([key, value]: [string, any]) => {
          if (typeof value === 'string') {
            tokens.colors![key] = value;
          } else if (value.value) {
            tokens.colors![key] = value.value;
          }
        });
      }

      // Handle typography
      if (parsed.typography || parsed.fontSize) {
        const typoObj = parsed.typography || parsed.fontSize;
        tokens.typography = {};
        Object.entries(typoObj).forEach(([key, value]: [string, any]) => {
          if (typeof value === 'string') {
            tokens.typography![key] = value;
          } else if (value.value) {
            tokens.typography![key] = value.value;
          }
        });
      }

      // Handle spacing
      if (parsed.spacing || parsed.space) {
        const spacingObj = parsed.spacing || parsed.space;
        tokens.spacing = {};
        Object.entries(spacingObj).forEach(([key, value]: [string, any]) => {
          if (typeof value === 'string') {
            tokens.spacing![key] = value;
          } else if (value.value) {
            tokens.spacing![key] = value.value;
          }
        });
      }

      // Handle border radius
      if (parsed.borderRadius || parsed.radii) {
        const radiusObj = parsed.borderRadius || parsed.radii;
        tokens.borderRadius = {};
        Object.entries(radiusObj).forEach(([key, value]: [string, any]) => {
          if (typeof value === 'string') {
            tokens.borderRadius![key] = value;
          } else if (value.value) {
            tokens.borderRadius![key] = value.value;
          }
        });
      }

      // Handle shadows
      if (parsed.shadows || parsed.boxShadow) {
        const shadowObj = parsed.shadows || parsed.boxShadow;
        tokens.shadows = {};
        Object.entries(shadowObj).forEach(([key, value]: [string, any]) => {
          if (typeof value === 'string') {
            tokens.shadows![key] = value;
          } else if (value.value) {
            tokens.shadows![key] = value.value;
          }
        });
      }

      setParsedTokens(tokens);
      setJsonError('');
      toast.success('Tokens parsed successfully!');
      
      // Auto-advance to next step
      setTimeout(() => setStep(2), 500);
    } catch (error: any) {
      setJsonError(error.message || 'Invalid JSON format');
      toast.error('Failed to parse JSON');
    }
  };

  // Template tokens
  const templateTokens: Record<string, DesignTokens> = {
    minimal: {
      colors: {
        'primary': '0 0% 0%',
        'primary-foreground': '0 0% 100%',
        'secondary': '0 0% 96%',
        'secondary-foreground': '0 0% 9%',
        'background': '0 0% 100%',
        'foreground': '0 0% 3.9%',
        'card': '0 0% 100%',
        'card-foreground': '0 0% 3.9%',
        'muted': '0 0% 96.1%',
        'muted-foreground': '0 0% 45.1%',
        'border': '0 0% 89.8%',
        'accent': '0 0% 96.1%',
        'accent-foreground': '0 0% 9%',
      },
      spacing: {
        'space-xs': '4px',
        'space-sm': '8px',
        'space-md': '16px',
        'space-lg': '24px',
        'space-xl': '32px',
      },
      borderRadius: {
        'radius-sm': '2px',
        'radius-md': '4px',
        'radius-lg': '6px',
      },
      shadows: {
        'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
    },
    colorful: {
      colors: {
        'primary': '262 83% 58%',
        'primary-foreground': '0 0% 100%',
        'secondary': '340 82% 52%',
        'secondary-foreground': '0 0% 100%',
        'background': '0 0% 100%',
        'foreground': '224 71% 4%',
        'card': '0 0% 100%',
        'card-foreground': '224 71% 4%',
        'muted': '220 14% 96%',
        'muted-foreground': '220 9% 46%',
        'border': '220 13% 91%',
        'accent': '220 14% 96%',
        'accent-foreground': '220 9% 46%',
      },
      spacing: {
        'space-xs': '6px',
        'space-sm': '12px',
        'space-md': '20px',
        'space-lg': '32px',
        'space-xl': '48px',
      },
      borderRadius: {
        'radius-sm': '8px',
        'radius-md': '12px',
        'radius-lg': '16px',
      },
      shadows: {
        'shadow-sm': '0 2px 4px 0 rgb(0 0 0 / 0.08)',
        'shadow-md': '0 6px 12px -2px rgb(0 0 0 / 0.12)',
        'shadow-lg': '0 12px 24px -4px rgb(0 0 0 / 0.16)',
      },
    },
    modern: {
      colors: {
        'primary': '221 83% 53%',
        'primary-foreground': '210 40% 98%',
        'secondary': '210 40% 96%',
        'secondary-foreground': '222 47% 11%',
        'background': '0 0% 100%',
        'foreground': '222 84% 5%',
        'card': '0 0% 100%',
        'card-foreground': '222 84% 5%',
        'muted': '210 40% 96%',
        'muted-foreground': '215 16% 47%',
        'border': '214 32% 91%',
        'accent': '210 40% 96%',
        'accent-foreground': '222 47% 11%',
      },
      spacing: {
        'space-xs': '4px',
        'space-sm': '8px',
        'space-md': '16px',
        'space-lg': '24px',
        'space-xl': '40px',
      },
      borderRadius: {
        'radius-sm': '6px',
        'radius-md': '10px',
        'radius-lg': '14px',
      },
      shadows: {
        'shadow-sm': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'shadow-md': '0 4px 8px -2px rgb(0 0 0 / 0.1)',
        'shadow-lg': '0 10px 20px -5px rgb(0 0 0 / 0.1)',
      },
    },
  };

  const selectTemplate = (templateKey: string) => {
    setParsedTokens(templateTokens[templateKey]);
    setSystemName(`${templateKey.charAt(0).toUpperCase() + templateKey.slice(1)} Design System`);
    setSystemDescription(`A ${templateKey} design system created from template`);
    toast.success(`${templateKey} template selected!`);
    setTimeout(() => setStep(2), 500);
  };

  const handleSaveSystem = () => {
    if (!systemName.trim()) {
      toast.error('Please enter a system name');
      return;
    }

    if (!parsedTokens) {
      toast.error('No tokens to save');
      return;
    }

    // Create theme from tokens
    const theme = {
      id: `${systemName.toLowerCase().replace(/\s+/g, '-')}-default`,
      name: 'Default Theme',
      description: 'Default theme for this design system',
      colors: parsedTokens.colors || {},
      typography: parsedTokens.typography || {},
      spacing: parsedTokens.spacing || {},
      borderRadius: parsedTokens.borderRadius || {},
      shadows: parsedTokens.shadows || {},
    };

    const newSystem = {
      id: systemName.toLowerCase().replace(/\s+/g, '-'),
      name: systemName,
      description: systemDescription,
      themes: [theme],
      activeThemeId: theme.id,
      intents: [
        { value: 'web-app', label: 'Web App' },
        { value: 'mobile', label: 'Mobile Experience' },
      ],
    };

    addDesignSystem(newSystem);
    
    // Don't apply immediately - let user choose when to switch
    toast.success(`${systemName} created successfully! Switch to it from the Design System selector.`);
    onClose();
  };

  const currentStep = steps[step];
  const Icon = currentStep.icon;
  const isLastStep = step === steps.length - 1;
  const tokensToDisplay = parsedTokens || manualTokens;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{currentStep.title}</h2>
              <p className="text-sm text-muted-foreground">
                {currentStep.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl mb-3">Let's Build Your Design System</h3>
                <p className="text-muted-foreground">
                  This wizard will guide you through creating a custom design system with your own tokens.
                  You can upload Figma variables, start from a template, or build from scratch.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="p-6 rounded-lg border bg-card hover:border-primary/50 transition-all">
                  <Upload className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Upload Figma JSON</h4>
                  <p className="text-sm text-muted-foreground">
                    Import design tokens directly from your Figma variables export
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border bg-card hover:border-primary/50 transition-all">
                  <Wand2 className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Start from Template</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose a pre-configured template and customize it to your needs
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border bg-card hover:border-primary/50 transition-all">
                  <Edit3 className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Build from Scratch</h4>
                  <p className="text-sm text-muted-foreground">
                    Manually define every token for complete control over your system
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mt-6">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileJson className="w-4 h-4" />
                  What You'll Create
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Color tokens (primary, secondary, backgrounds, etc.)</li>
                  <li>• Typography scales and font definitions</li>
                  <li>• Spacing system for consistent layouts</li>
                  <li>• Border radius values for shapes</li>
                  <li>• Shadow definitions for depth</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 1: Choose Method */}
          {step === 1 && (
            <div className="space-y-6">
              <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="template">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Template
                  </TabsTrigger>
                  <TabsTrigger value="upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload JSON
                  </TabsTrigger>
                  <TabsTrigger value="manual">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Manual
                  </TabsTrigger>
                </TabsList>

                {/* Template Selection */}
                <TabsContent value="template" className="space-y-4 mt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(templateTokens).map(([key, tokens]) => (
                      <button
                        key={key}
                        onClick={() => selectTemplate(key)}
                        className="p-6 rounded-lg border-2 border-border hover:border-primary transition-all text-left group"
                      >
                        <h4 className="font-semibold mb-3 capitalize">{key}</h4>
                        <div className="space-y-2">
                          <div className="flex gap-1">
                            {Object.entries(tokens.colors || {}).slice(0, 5).map(([name, value]) => (
                              <div
                                key={name}
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: `hsl(${value})` }}
                                title={name}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {Object.keys(tokens.colors || {}).length} colors • 
                            {Object.keys(tokens.spacing || {}).length} spacing • 
                            {Object.keys(tokens.borderRadius || {}).length} radius
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </TabsContent>

                {/* JSON Upload */}
                <TabsContent value="upload" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="json-input" className="mb-2 block">
                        Paste Your Figma Variables JSON
                      </Label>
                      <Textarea
                        id="json-input"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder={`{\n  "colors": {\n    "primary": "240 100% 50%",\n    "background": "0 0% 100%"\n  },\n  "spacing": {\n    "space-sm": "8px"\n  }\n}`}
                        className="font-mono text-sm min-h-[300px]"
                      />
                      {jsonError && (
                        <p className="text-sm text-destructive mt-2">{jsonError}</p>
                      )}
                    </div>

                    <Button onClick={handleJsonParse} className="w-full">
                      <FileJson className="w-4 h-4 mr-2" />
                      Parse & Preview Tokens
                    </Button>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-2">Expected Format:</h4>
                      <pre className="text-xs bg-background rounded p-3 overflow-x-auto">
{`{
  "colors": {
    "primary": "240 100% 50%",
    "background": "0 0% 100%"
  },
  "spacing": {
    "space-sm": "8px",
    "space-md": "16px"
  },
  "borderRadius": {
    "radius-sm": "4px"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                {/* Manual Creation */}
                <TabsContent value="manual" className="space-y-4 mt-6">
                  <div className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        Manual token creation will be available in the next step. 
                        For now, we recommend starting with a template and customizing it.
                      </p>
                    </div>
                    <Button 
                      onClick={() => {
                        setParsedTokens(manualTokens);
                        setStep(2);
                      }}
                      className="w-full"
                    >
                      Continue with Basic Tokens
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 2: Configure Tokens */}
          {step === 2 && parsedTokens && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Design Tokens</h3>
                <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as any)}>
                  <TabsList>
                    <TabsTrigger value="visual">Visual</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="tokens">Code</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {previewMode === 'edit' ? (
                <div>
                  <TokenEditor
                    tokens={parsedTokens}
                    onChange={(updated) => setParsedTokens(updated)}
                  />
                </div>
              ) : previewMode === 'visual' ? (
                <div className="space-y-4">
                  {/* Colors */}
                  {parsedTokens.colors && Object.keys(parsedTokens.colors).length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Colors ({Object.keys(parsedTokens.colors).length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(parsedTokens.colors).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <div
                              className="h-16 rounded-lg border"
                              style={{ backgroundColor: `hsl(${value})` }}
                            />
                            <div>
                              <p className="text-xs font-medium truncate">{key}</p>
                              <code className="text-xs text-muted-foreground">{value}</code>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Spacing */}
                  {parsedTokens.spacing && Object.keys(parsedTokens.spacing).length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Spacing ({Object.keys(parsedTokens.spacing).length})</h4>
                      <div className="space-y-2">
                        {Object.entries(parsedTokens.spacing).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-3 p-2 border rounded">
                            <code className="text-xs text-muted-foreground w-24">{key}</code>
                            <div
                              className="h-4 bg-primary rounded"
                              style={{ width: value }}
                            />
                            <span className="text-xs text-muted-foreground ml-auto">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Border Radius */}
                  {parsedTokens.borderRadius && Object.keys(parsedTokens.borderRadius).length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Border Radius ({Object.keys(parsedTokens.borderRadius).length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(parsedTokens.borderRadius).map(([key, value]) => (
                          <div key={key} className="p-3 border rounded text-center">
                            <div
                              className="w-12 h-12 bg-primary mx-auto mb-2"
                              style={{ borderRadius: value }}
                            />
                            <p className="text-xs font-medium">{key}</p>
                            <code className="text-xs text-muted-foreground">{value}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shadows */}
                  {parsedTokens.shadows && Object.keys(parsedTokens.shadows).length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Shadows ({Object.keys(parsedTokens.shadows).length})</h4>
                      <div className="space-y-3">
                        {Object.entries(parsedTokens.shadows).map(([key, value]) => (
                          <div key={key} className="p-4 border rounded">
                            <div
                              className="w-full h-16 bg-card rounded flex items-center justify-center"
                              style={{ boxShadow: value }}
                            >
                              <span className="text-xs font-medium">{key}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(parsedTokens, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && parsedTokens && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border">
                <h3 className="font-semibold mb-4">Live Preview</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-lg border bg-card"
                    style={{
                      backgroundColor: parsedTokens.colors?.['card'] 
                        ? `hsl(${parsedTokens.colors['card']})` 
                        : undefined,
                    }}
                  >
                    <h4 className="font-semibold mb-2">Card Component</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is how your tokens look on a card component.
                    </p>
                    <button
                      className="px-4 py-2 rounded text-sm font-medium"
                      style={{
                        backgroundColor: parsedTokens.colors?.['primary'] 
                          ? `hsl(${parsedTokens.colors['primary']})` 
                          : '#000',
                        color: parsedTokens.colors?.['primary-foreground'] 
                          ? `hsl(${parsedTokens.colors['primary-foreground']})` 
                          : '#fff',
                        borderRadius: parsedTokens.borderRadius?.['radius-md'] || '8px',
                      }}
                    >
                      Primary Button
                    </button>
                  </div>

                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: parsedTokens.colors?.['muted'] 
                        ? `hsl(${parsedTokens.colors['muted']})` 
                        : '#f5f5f5',
                    }}
                  >
                    <h4 className="font-semibold mb-2">Muted Section</h4>
                    <p className="text-sm mb-4">
                      Background and foreground colors working together.
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1.5 rounded text-sm"
                        style={{
                          backgroundColor: parsedTokens.colors?.['secondary'] 
                            ? `hsl(${parsedTokens.colors['secondary']})` 
                            : '#eee',
                          borderRadius: parsedTokens.borderRadius?.['radius-sm'] || '4px',
                        }}
                      >
                        Secondary
                      </button>
                      <button
                        className="px-3 py-1.5 rounded text-sm border"
                        style={{
                          borderRadius: parsedTokens.borderRadius?.['radius-sm'] || '4px',
                        }}
                      >
                        Outline
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {parsedTokens.colors && Object.entries(parsedTokens.colors).slice(0, 8).map(([key, value]) => (
                  <div
                    key={key}
                    className="h-24 rounded-lg border flex items-end p-3"
                    style={{ backgroundColor: `hsl(${value})` }}
                  >
                    <span className="text-xs font-medium" style={{
                      color: key.includes('foreground') ? `hsl(${value})` : 
                             parsedTokens.colors?.['foreground'] ? `hsl(${parsedTokens.colors['foreground']})` : '#000'
                    }}>
                      {key}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Name & Save */}
          {step === 4 && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="system-name">Design System Name *</Label>
                  <Input
                    id="system-name"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    placeholder="My Design System"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="system-description">Description (Optional)</Label>
                  <Textarea
                    id="system-description"
                    value={systemDescription}
                    onChange={(e) => setSystemDescription(e.target.value)}
                    placeholder="A modern design system for..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border">
                <h4 className="font-semibold mb-3">What's Next?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Your design system will be saved to your library</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Switch to it using the Design System selector in the sidebar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Export components to any framework with your tokens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Edit tokens anytime in the Design System Builder</span>
                  </li>
                </ul>
              </div>

              {parsedTokens && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2">Token Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Colors:</span>
                      <span className="ml-2 font-medium">{Object.keys(parsedTokens.colors || {}).length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Spacing:</span>
                      <span className="ml-2 font-medium">{Object.keys(parsedTokens.spacing || {}).length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Radius:</span>
                      <span className="ml-2 font-medium">{Object.keys(parsedTokens.borderRadius || {}).length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shadows:</span>
                      <span className="ml-2 font-medium">{Object.keys(parsedTokens.shadows || {}).length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 rounded-lg border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-primary' : i < step ? 'bg-primary/50' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (isLastStep) {
                handleSaveSystem();
              } else if (step === 1 && !parsedTokens) {
                toast.error('Please select a template, upload JSON, or continue manually');
              } else {
                setStep(step + 1);
              }
            }}
            disabled={step === 1 && !parsedTokens}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastStep ? (
              <>
                <Check className="w-4 h-4" />
                Create System
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}