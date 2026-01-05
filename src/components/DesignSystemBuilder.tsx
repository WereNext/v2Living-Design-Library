import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Plus, X, Trash2, Palette, Type, Ruler, Circle, Box as BoxIcon, Sparkles, Download, Package } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SaveDesignSystemDialog } from "./SaveDesignSystemDialog";
import { designSystemTemplates, getTemplateById } from "../lib/design-system-templates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DesignSystemPreview } from "./DesignSystemPreview";

interface DesignSystemBuilderProps {
  onSystemCreated: (system: {
    name: string;
    description?: string;
    colors: Record<string, string>;
    spacing: Record<string, string>;
    typography: Record<string, string>;
    borderRadius: Record<string, string>;
    shadows: Record<string, string>;
  }, applyImmediately: boolean) => void;
  initialData?: any;
}

interface Variable {
  id: string;
  name: string;
  value: string;
}

export function DesignSystemBuilder({ onSystemCreated, initialData }: DesignSystemBuilderProps) {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [pendingSystem, setPendingSystem] = useState<{
    colors: Record<string, string>;
    spacing: Record<string, string>;
    typography: Record<string, string>;
    borderRadius: Record<string, string>;
    shadows: Record<string, string>;
  } | null>(null);

  // Design System Metadata
  const [systemName, setSystemName] = useState('');
  const [systemDescription, setSystemDescription] = useState('');
  const [designIntents, setDesignIntents] = useState<Array<{ value: string; label: string }>>([
    { value: 'web-app', label: 'Web App' },
  ]);
  const [selectedLibraryTemplate, setSelectedLibraryTemplate] = useState<string>('');

  // Color variables
  const [colors, setColors] = useState<Variable[]>([
    { id: '1', name: 'primary', value: '221.2 83.2% 53.3%' },
    { id: '2', name: 'secondary', value: '210 40% 96.1%' },
    { id: '3', name: 'accent', value: '142.1 76.2% 36.3%' },
    { id: '4', name: 'background', value: '0 0% 100%' },
    { id: '5', name: 'foreground', value: '222.2 84% 4.9%' },
    { id: '6', name: 'color-1', value: '' },
    { id: '7', name: 'color-2', value: '' },
  ]);

  // Spacing variables
  const [spacing, setSpacing] = useState<Variable[]>([
    { id: '1', name: 'xs', value: '0.5rem' },
    { id: '2', name: 'sm', value: '0.75rem' },
    { id: '3', name: 'md', value: '1rem' },
    { id: '4', name: 'lg', value: '1.5rem' },
    { id: '5', name: 'xl', value: '2rem' },
    { id: '6', name: 'spacing-1', value: '' },
    { id: '7', name: 'spacing-2', value: '' },
  ]);

  // Typography variables
  const [typography, setTypography] = useState<Variable[]>([
    { id: '1', name: 'font-sans', value: 'Inter, system-ui, sans-serif' },
    { id: '2', name: 'font-serif', value: 'Georgia, serif' },
    { id: '3', name: 'font-mono', value: 'JetBrains Mono, monospace' },
    { id: '4', name: 'font-size-sm', value: '0.875rem' },
    { id: '5', name: 'font-size-base', value: '1rem' },
    { id: '6', name: 'font-size-lg', value: '1.125rem' },
    { id: '7', name: 'font-1', value: '' },
  ]);

  // Border radius variables
  const [borderRadius, setBorderRadius] = useState<Variable[]>([
    { id: '1', name: 'radius-sm', value: '0.375rem' },
    { id: '2', name: 'radius-md', value: '0.5rem' },
    { id: '3', name: 'radius-lg', value: '0.75rem' },
    { id: '4', name: 'radius-xl', value: '1rem' },
    { id: '5', name: 'radius-1', value: '' },
  ]);

  // Shadow variables
  const [shadows, setShadows] = useState<Variable[]>([
    { id: '1', name: 'shadow-sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    { id: '2', name: 'shadow-md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
    { id: '3', name: 'shadow-lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
    { id: '4', name: 'shadow-1', value: '' },
  ]);

  const addVariable = (
    type: 'colors' | 'spacing' | 'typography' | 'borderRadius' | 'shadows',
    setState: React.Dispatch<React.SetStateAction<Variable[]>>
  ) => {
    const newId = Date.now().toString();
    const baseName = type === 'colors' ? 'color' : 
                     type === 'spacing' ? 'spacing' :
                     type === 'typography' ? 'font' :
                     type === 'borderRadius' ? 'radius' : 'shadow';
    
    setState(prev => [
      ...prev,
      { id: newId, name: `${baseName}-${prev.length + 1}`, value: '' }
    ]);
  };

  const removeVariable = (
    id: string,
    setState: React.Dispatch<React.SetStateAction<Variable[]>>
  ) => {
    setState(prev => prev.filter(v => v.id !== id));
  };

  const updateVariable = (
    id: string,
    field: 'name' | 'value',
    value: string,
    setState: React.Dispatch<React.SetStateAction<Variable[]>>
  ) => {
    setState(prev => prev.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const handleGenerate = () => {
    // Filter out empty values and convert to objects
    const systemColors = colors
      .filter(c => c.value.trim())
      .reduce((acc, c) => ({ ...acc, [c.name]: c.value }), {});
    
    const systemSpacing = spacing
      .filter(s => s.value.trim())
      .reduce((acc, s) => ({ ...acc, [s.name]: s.value }), {});
    
    const systemTypography = typography
      .filter(t => t.value.trim())
      .reduce((acc, t) => ({ ...acc, [t.name]: t.value }), {});
    
    const systemBorderRadius = borderRadius
      .filter(b => b.value.trim())
      .reduce((acc, b) => ({ ...acc, [b.name]: b.value }), {});
    
    const systemShadows = shadows
      .filter(s => s.value.trim())
      .reduce((acc, s) => ({ ...acc, [s.name]: s.value }), {});

    if (Object.keys(systemColors).length === 0) {
      toast.error("Please define at least one color variable");
      return;
    }

    setPendingSystem({
      colors: systemColors,
      spacing: systemSpacing,
      typography: systemTypography,
      borderRadius: systemBorderRadius,
      shadows: systemShadows
    });
    setIsPreviewDialogOpen(true);

    toast.success("Design system created! Review the preview.");
  };

  const loadTemplate = (template: 'minimal' | 'full' | 'blank') => {
    if (template === 'minimal') {
      setColors([
        { id: '1', name: 'primary', value: '221.2 83.2% 53.3%' },
        { id: '2', name: 'background', value: '0 0% 100%' },
        { id: '3', name: 'foreground', value: '222.2 84% 4.9%' },
      ]);
      setSpacing([
        { id: '1', name: 'sm', value: '0.5rem' },
        { id: '2', name: 'md', value: '1rem' },
        { id: '3', name: 'lg', value: '2rem' },
      ]);
      setTypography([
        { id: '1', name: 'font-sans', value: 'Inter, system-ui, sans-serif' },
      ]);
      setBorderRadius([
        { id: '1', name: 'radius-md', value: '0.5rem' },
      ]);
      setShadows([
        { id: '1', name: 'shadow-sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
      ]);
      toast.success("Minimal template loaded");
    } else if (template === 'full') {
      // Reset to full defaults (already set)
      toast.success("Full template loaded");
    } else {
      setColors([{ id: '1', name: 'variable-1', value: '' }]);
      setSpacing([{ id: '1', name: 'spacing-1', value: '' }]);
      setTypography([{ id: '1', name: 'font-1', value: '' }]);
      setBorderRadius([{ id: '1', name: 'radius-1', value: '' }]);
      setShadows([{ id: '1', name: 'shadow-1', value: '' }]);
      toast.success("Blank template loaded - start from scratch!");
    }
  };

  const loadLibraryTemplate = (libraryId: string) => {
    const template = getTemplateById(libraryId);
    if (!template) return;

    // Load colors
    const colorVars = Object.entries(template.colors).map(([name, value], index) => ({
      id: `${index + 1}`,
      name,
      value
    }));
    setColors(colorVars);

    // Load spacing
    const spacingVars = Object.entries(template.spacing).map(([name, value], index) => ({
      id: `${index + 1}`,
      name,
      value
    }));
    setSpacing(spacingVars);

    // Load typography
    const typographyVars = Object.entries(template.typography).map(([name, value], index) => ({
      id: `${index + 1}`,
      name,
      value
    }));
    setTypography(typographyVars);

    // Load border radius
    const radiusVars = Object.entries(template.borderRadius).map(([name, value], index) => ({
      id: `${index + 1}`,
      name,
      value
    }));
    setBorderRadius(radiusVars);

    // Load shadows
    const shadowVars = Object.entries(template.shadows).map(([name, value], index) => ({
      id: `${index + 1}`,
      name,
      value
    }));
    setShadows(shadowVars);

    setSelectedLibraryTemplate(libraryId);
    toast.success(`${template.name} tokens loaded! Customize and save as your own.`);
  };

  const addIntent = () => {
    const newId = `custom-${Date.now()}`;
    setDesignIntents(prev => [...prev, { value: newId, label: 'New Category' }]);
  };

  const removeIntent = (id: string) => {
    if (designIntents.length === 1) {
      toast.error("You must have at least one design intent");
      return;
    }
    setDesignIntents(prev => prev.filter(intent => intent.value !== id));
  };

  const updateIntentName = (id: string, name: string) => {
    setDesignIntents(prev => prev.map(intent =>
      intent.value === id ? { ...intent, label: name } : intent
    ));
  };

  const loadIntentTemplate = (intentName: string) => {
    const templates = [
      'Professional', 'Playful', 'Minimal', 'Bold', 'Elegant', 
      'Modern', 'Classic', 'Vibrant', 'Calm', 'Dark Mode', 'Light Mode'
    ];
    
    if (templates.includes(intentName)) {
      const newId = Date.now().toString();
      setDesignIntents(prev => [...prev, { value: newId, label: intentName }]);
      toast.success(`${intentName} intent added!`);
    }
  };

  const VariableList = ({ 
    variables, 
    setState, 
    placeholder,
    icon: Icon,
    colorPreview = false
  }: { 
    variables: Variable[];
    setState: React.Dispatch<React.SetStateAction<Variable[]>>;
    placeholder: string;
    icon: any;
    colorPreview?: boolean;
  }) => (
    <div className="space-y-2">
      {variables.map((variable, index) => (
        <div key={variable.id} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div>
              <Input
                placeholder="Variable name"
                value={variable.name}
                onChange={(e) => updateVariable(variable.id, 'name', e.target.value, setState)}
                className="h-9 text-xs font-mono"
              />
            </div>
            <div className="flex gap-1">
              {colorPreview && variable.value && (
                <div 
                  className="w-9 h-9 rounded border-2 border-border flex-shrink-0"
                  style={{ background: `hsl(${variable.value})` }}
                />
              )}
              <Input
                placeholder={placeholder}
                value={variable.value}
                onChange={(e) => updateVariable(variable.id, 'value', e.target.value, setState)}
                className="h-9 text-xs font-mono flex-1"
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeVariable(variable.id, setState)}
            className="h-9 w-9 p-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => addVariable(
          setState === setColors ? 'colors' :
          setState === setSpacing ? 'spacing' :
          setState === setTypography ? 'typography' :
          setState === setBorderRadius ? 'borderRadius' : 'shadows',
          setState
        )}
        className="w-full"
      >
        <Plus className="w-3.5 h-3.5 mr-2" />
        Add Variable
      </Button>
    </div>
  );

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Design System Builder
        </CardTitle>
        <CardDescription>
          Create your own design system from scratch or start with a template. Define colors, spacing, typography, and more.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <BoxIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Fresh Start Template:</strong> Define your own variables like "color-1", "spacing-2", "font-primary". 
            Everything we provide is just a starting point - build your own system!
          </AlertDescription>
        </Alert>

        {/* Library Template Selector */}
        <div className="space-y-3 bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-purple-600" />
            <Label className="text-sm font-semibold">Start from Popular Library</Label>
            <Badge variant="outline" className="ml-auto">New</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Load design tokens from shadcn, Material UI, Chakra, and more. Customize them to create your own system.
          </p>
          <Select value={selectedLibraryTemplate} onValueChange={loadLibraryTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a library template..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shadcn">shadcn/ui - Radix Primitives</SelectItem>
              <SelectItem value="material">Material Design 3 - Google</SelectItem>
              <SelectItem value="chakra">Chakra UI - Simple & Modular</SelectItem>
              <SelectItem value="ant-design">Ant Design - Enterprise</SelectItem>
              <SelectItem value="tailwind">Tailwind CSS - Utility-First</SelectItem>
              <SelectItem value="radix">Radix Colors - Auto Dark Mode</SelectItem>
              <SelectItem value="mantine">Mantine - Full Featured</SelectItem>
              <SelectItem value="bootstrap">Bootstrap 5 - Classic</SelectItem>
            </SelectContent>
          </Select>
          {selectedLibraryTemplate && (
            <div className="text-xs text-purple-700 bg-purple-100 p-2 rounded flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              Loaded {designSystemTemplates.find(t => t.id === selectedLibraryTemplate)?.name} tokens. Customize below!
            </div>
          )}
        </div>

        {/* System Naming & Description */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Design System Identity</Label>
          <div className="space-y-2">
            <Input
              placeholder="e.g., Acme Design System, Brand UI Kit..."
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="font-medium"
            />
            <Input
              placeholder="Optional description..."
              value={systemDescription}
              onChange={(e) => setSystemDescription(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Design Intents Manager */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Component Categories (Design Intents)</Label>
            <Badge variant="secondary">{designIntents.length} categories</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Choose which component categories this design system supports: Web App, E-commerce, Mobile, Landing Page, etc.
          </p>
          
          {/* Quick Intent Templates */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: 'web-app', label: 'Web App' },
              { value: 'ecommerce', label: 'E-commerce' },
              { value: 'mobile', label: 'Mobile Experience' },
              { value: 'landing', label: 'Landing Page' },
              { value: 'dashboard', label: 'Dashboard & Analytics' },
              { value: 'saas', label: 'SaaS Platform' },
              { value: 'social', label: 'Social Media' },
              { value: 'blog', label: 'Blog & Content' }
            ].map(template => (
              <Button
                key={template.value}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => {
                  if (!designIntents.find(i => i.value === template.value)) {
                    setDesignIntents(prev => [...prev, template]);
                    toast.success(`${template.label} category added!`);
                  } else {
                    toast.info(`${template.label} already added`);
                  }
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                {template.label}
              </Button>
            ))}
          </div>

          {/* Intent List */}
          <div className="space-y-2">
            {designIntents.map((intent, index) => {
              const isCustomIntent = intent.value.startsWith('custom-');
              
              return (
                <div key={intent.value} className="flex gap-2 items-center">
                  <Badge variant="outline" className="text-xs">{index + 1}</Badge>
                  
                  {isCustomIntent ? (
                    // Custom intent - show text input
                    <Input
                      placeholder="Custom category name..."
                      value={intent.label}
                      onChange={(e) => updateIntentName(intent.value, e.target.value)}
                      className="h-8 flex-1"
                    />
                  ) : (
                    // Predefined intent - show dropdown
                    <Select 
                      value={intent.value} 
                      onValueChange={(newValue) => {
                        const predefinedIntents = [
                          { value: 'web-app', label: 'Web App' },
                          { value: 'ecommerce', label: 'E-commerce' },
                          { value: 'mobile', label: 'Mobile Experience' },
                          { value: 'landing', label: 'Landing Page' },
                          { value: 'dashboard', label: 'Dashboard & Analytics' },
                          { value: 'saas', label: 'SaaS Platform' },
                          { value: 'social', label: 'Social Media' },
                          { value: 'blog', label: 'Blog & Content' },
                          { value: 'portfolio', label: 'Portfolio & Showcase' },
                          { value: 'admin', label: 'Admin Panel' },
                          { value: 'docs', label: 'Documentation' },
                          { value: 'auth', label: 'Authentication' },
                          { value: 'messaging', label: 'Messaging & Chat' },
                          { value: 'calendar', label: 'Calendar & Scheduling' },
                          { value: 'media', label: 'Media Gallery' },
                          { value: 'forms', label: 'Forms & Surveys' }
                        ];
                        const found = predefinedIntents.find(i => i.value === newValue);
                        if (found) {
                          setDesignIntents(prev => prev.map(i => 
                            i.value === intent.value ? found : i
                          ));
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 flex-1">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web-app">Web App</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="mobile">Mobile Experience</SelectItem>
                        <SelectItem value="landing">Landing Page</SelectItem>
                        <SelectItem value="dashboard">Dashboard & Analytics</SelectItem>
                        <SelectItem value="saas">SaaS Platform</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="blog">Blog & Content</SelectItem>
                        <SelectItem value="portfolio">Portfolio & Showcase</SelectItem>
                        <SelectItem value="admin">Admin Panel</SelectItem>
                        <SelectItem value="docs">Documentation</SelectItem>
                        <SelectItem value="auth">Authentication</SelectItem>
                        <SelectItem value="messaging">Messaging & Chat</SelectItem>
                        <SelectItem value="calendar">Calendar & Scheduling</SelectItem>
                        <SelectItem value="media">Media Gallery</SelectItem>
                        <SelectItem value="forms">Forms & Surveys</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {isCustomIntent && (
                    <Badge variant="secondary" className="text-xs">Custom</Badge>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIntent(intent.value)}
                    disabled={designIntents.length === 1}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={addIntent}
              className="w-full"
            >
              <Plus className="w-3.5 h-3.5 mr-2" />
              Add Custom Category
            </Button>
          </div>
        </div>

        {/* Template Presets */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => loadTemplate('minimal')}>
            Minimal Template
          </Button>
          <Button variant="outline" size="sm" onClick={() => loadTemplate('full')}>
            Full Template (Default)
          </Button>
          <Button variant="outline" size="sm" onClick={() => loadTemplate('blank')}>
            Blank Slate
          </Button>
        </div>

        {/* Variable Tabs */}
        <Tabs defaultValue="colors">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="colors" className="text-xs">
              <Palette className="w-3.5 h-3.5 mr-1.5" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="spacing" className="text-xs">
              <Ruler className="w-3.5 h-3.5 mr-1.5" />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="typography" className="text-xs">
              <Type className="w-3.5 h-3.5 mr-1.5" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="radius" className="text-xs">
              <Circle className="w-3.5 h-3.5 mr-1.5" />
              Radius
            </TabsTrigger>
            <TabsTrigger value="shadows" className="text-xs">
              <BoxIcon className="w-3.5 h-3.5 mr-1.5" />
              Shadows
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Color Variables</Label>
              <Badge variant="secondary">{colors.filter(c => c.value).length} defined</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Use HSL format: "221.2 83.2% 53.3%" (hue saturation lightness)
            </p>
            <VariableList
              variables={colors}
              setState={setColors}
              placeholder="221.2 83.2% 53.3%"
              icon={Palette}
              colorPreview={true}
            />
          </TabsContent>

          <TabsContent value="spacing" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Spacing Variables</Label>
              <Badge variant="secondary">{spacing.filter(s => s.value).length} defined</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Use rem, px, or em: "1rem", "16px", "1.5em"
            </p>
            <VariableList
              variables={spacing}
              setState={setSpacing}
              placeholder="1rem"
              icon={Ruler}
            />
          </TabsContent>

          <TabsContent value="typography" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Typography Variables</Label>
              <Badge variant="secondary">{typography.filter(t => t.value).length} defined</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Font families, sizes, weights: "Inter, sans-serif", "1.125rem", "600"
            </p>
            <VariableList
              variables={typography}
              setState={setTypography}
              placeholder="Inter, system-ui, sans-serif"
              icon={Type}
            />
          </TabsContent>

          <TabsContent value="radius" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Border Radius Variables</Label>
              <Badge variant="secondary">{borderRadius.filter(b => b.value).length} defined</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Use rem or px: "0.5rem", "8px", "9999px"
            </p>
            <VariableList
              variables={borderRadius}
              setState={setBorderRadius}
              placeholder="0.5rem"
              icon={Circle}
            />
          </TabsContent>

          <TabsContent value="shadows" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Shadow Variables</Label>
              <Badge variant="secondary">{shadows.filter(s => s.value).length} defined</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              CSS box-shadow values: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
            </p>
            <VariableList
              variables={shadows}
              setState={setShadows}
              placeholder="0 4px 6px -1px rgb(0 0 0 / 0.1)"
              icon={BoxIcon}
            />
          </TabsContent>
        </Tabs>

        {/* Summary */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <h4 className="text-sm font-semibold">System Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">Colors</div>
              <div className="font-semibold">{colors.filter(c => c.value).length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Spacing</div>
              <div className="font-semibold">{spacing.filter(s => s.value).length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Typography</div>
              <div className="font-semibold">{typography.filter(t => t.value).length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Radius</div>
              <div className="font-semibold">{borderRadius.filter(b => b.value).length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Shadows</div>
              <div className="font-semibold">{shadows.filter(s => s.value).length}</div>
            </div>
          </div>
        </div>

        <Button onClick={handleGenerate} className="w-full" size="lg">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Design System
        </Button>
      </CardContent>

      {pendingSystem && (
        <>
          <DesignSystemPreview
            open={isPreviewDialogOpen}
            onOpenChange={setIsPreviewDialogOpen}
            onConfirm={() => {
              setIsPreviewDialogOpen(false);
              setIsSaveDialogOpen(true);
            }}
            systemName={systemName}
            systemDescription={systemDescription}
            designIntents={designIntents}
            colors={pendingSystem.colors}
            spacing={pendingSystem.spacing}
            typography={pendingSystem.typography}
            borderRadius={pendingSystem.borderRadius}
            shadows={pendingSystem.shadows}
            tokenCounts={{
              colors: Object.keys(pendingSystem.colors).length,
              spacing: Object.keys(pendingSystem.spacing).length,
              typography: Object.keys(pendingSystem.typography).length,
              borderRadius: Object.keys(pendingSystem.borderRadius).length,
              shadows: Object.keys(pendingSystem.shadows).length
            }}
          />
          <SaveDesignSystemDialog
            open={isSaveDialogOpen}
            onOpenChange={setIsSaveDialogOpen}
            onSave={({ name, description, applyImmediately }) => {
              onSystemCreated({
                name,
                description,
                ...pendingSystem
              }, applyImmediately);
              setIsSaveDialogOpen(false);
              setPendingSystem(null);
            }}
            tokenCounts={{
              colors: Object.keys(pendingSystem.colors).length,
              spacing: Object.keys(pendingSystem.spacing).length,
              typography: Object.keys(pendingSystem.typography).length,
              borderRadius: Object.keys(pendingSystem.borderRadius).length,
              shadows: Object.keys(pendingSystem.shadows).length
            }}
          />
        </>
      )}
    </Card>
  );
}