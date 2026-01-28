// Refactored DesignSystemBuilder - Original: 781 LOC -> Now: ~350 LOC
// Split into:
// - design-system-builder/types.ts - Type definitions
// - design-system-builder/VariableList.tsx - Variable editor component
// - design-system-builder/IntentManager.tsx - Intent management
// - design-system-builder/useVariables.ts - Variable state management hook

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Palette, Type, Ruler, Circle, Box as BoxIcon, Sparkles, Download, Package } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { SaveDesignSystemDialog } from "../SaveDesignSystemDialog";
import { designSystemTemplates, getTemplateById } from "../../lib/design-system-templates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DesignSystemPreview } from "../DesignSystemPreview";
import { VariableList } from "./VariableList";
import { IntentManager } from "./IntentManager";
import { useVariables } from "./useVariables";
import { LiveTokenPreview } from "./LiveTokenPreview";
import type { DesignIntent, DesignSystemData } from "./types";

interface DesignSystemBuilderProps {
  onSystemCreated: (system: DesignSystemData, applyImmediately: boolean) => void;
  initialData?: unknown;
}

export function DesignSystemBuilder({ onSystemCreated, initialData }: DesignSystemBuilderProps) {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [pendingSystem, setPendingSystem] = useState<Omit<DesignSystemData, 'name' | 'description'> | null>(null);
  const [systemName, setSystemName] = useState('');
  const [systemDescription, setSystemDescription] = useState('');
  const [designIntents, setDesignIntents] = useState<DesignIntent[]>([
    { value: 'web-app', label: 'Web App' },
  ]);
  const [selectedLibraryTemplate, setSelectedLibraryTemplate] = useState('');
  const [importedTemplateName, setImportedTemplateName] = useState<string | null>(null);
  const [importedTemplateLibrary, setImportedTemplateLibrary] = useState<string | null>(null);

  const {
    colors,
    spacing,
    typography,
    borderRadius,
    shadows,
    setColors,
    setSpacing,
    setTypography,
    setBorderRadius,
    setShadows,
    addVariable,
    removeVariable,
    updateVariable,
    getVariablesAsRecord,
    loadMinimalTemplate,
    loadFullTemplate,
    loadBlankTemplate,
  } = useVariables();

  // Check for imported template from Front-End Libraries on mount
  useEffect(() => {
    const selectedTemplate = localStorage.getItem('ldl-selected-template');
    if (selectedTemplate) {
      try {
        const template = JSON.parse(selectedTemplate);

        // Validate template has required fields
        if (!template || typeof template !== 'object' || !template.name) {
          console.warn('Invalid template data in localStorage:', template);
          localStorage.removeItem('ldl-selected-template');
          return;
        }

        // Pre-fill system name and description
        setSystemName(template.name || '');
        setSystemDescription(template.description || '');
        setImportedTemplateName(template.name);
        setImportedTemplateLibrary(template.uiLibrary || null);

        // Clear the localStorage item so it doesn't auto-load again
        localStorage.removeItem('ldl-selected-template');

        toast.success(`Starting from ${template.name}!`, {
          description: 'Customize the design tokens to match your vision.',
        });
      } catch (error) {
        console.error('Failed to parse selected template:', error);
        // Clean up corrupted data
        localStorage.removeItem('ldl-selected-template');
        toast.error('Failed to load template data', {
          description: 'Starting with a blank template instead.',
        });
      }
    }
  }, []);

  const handleGenerate = () => {
    const systemColors = getVariablesAsRecord('colors');
    const systemSpacing = getVariablesAsRecord('spacing');
    const systemTypography = getVariablesAsRecord('typography');
    const systemBorderRadius = getVariablesAsRecord('borderRadius');
    const systemShadows = getVariablesAsRecord('shadows');

    if (Object.keys(systemColors).length === 0) {
      toast.error("Please define at least one color variable");
      return;
    }

    setPendingSystem({
      colors: systemColors,
      spacing: systemSpacing,
      typography: systemTypography,
      borderRadius: systemBorderRadius,
      shadows: systemShadows,
    });
    setIsPreviewDialogOpen(true);
    toast.success("Design system created! Review the preview.");
  };

  const loadLibraryTemplate = (libraryId: string) => {
    const template = getTemplateById(libraryId);
    if (!template) return;

    const toVars = (obj: Record<string, string>) =>
      Object.entries(obj).map(([name, value], i) => ({ id: `${i + 1}`, name, value }));

    setColors(toVars(template.colors));
    setSpacing(toVars(template.spacing));
    setTypography(toVars(template.typography));
    setBorderRadius(toVars(template.borderRadius));
    setShadows(toVars(template.shadows));
    setSelectedLibraryTemplate(libraryId);

    // Clear imported template name when manually loading a library template
    setImportedTemplateName(null);
    setImportedTemplateLibrary(null);

    toast.success(`${template.name} tokens loaded! Customize and save as your own.`);
  };

  const handleLoadTemplate = (template: 'minimal' | 'full' | 'blank') => {
    // Clear imported template name when manually loading a preset template
    setImportedTemplateName(null);
    setImportedTemplateLibrary(null);

    switch (template) {
      case 'minimal':
        loadMinimalTemplate();
        toast.success("Minimal template loaded");
        break;
      case 'full':
        loadFullTemplate();
        toast.success("Full template loaded");
        break;
      case 'blank':
        loadBlankTemplate();
        toast.success("Blank template loaded - start from scratch!");
        break;
    }
  };

  const tokenCounts = {
    colors: colors.filter((c) => c.value).length,
    spacing: spacing.filter((s) => s.value).length,
    typography: typography.filter((t) => t.value).length,
    borderRadius: borderRadius.filter((b) => b.value).length,
    shadows: shadows.filter((s) => s.value).length,
  };

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Design System Builder
        </CardTitle>
        <CardDescription>
          Create your own design system from scratch or start with a template.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {importedTemplateName ? (
          <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300">
            <Package className="h-4 w-4 text-purple-600" />
            <AlertDescription>
              <strong>Starting from {importedTemplateName}:</strong> Customize the tokens below to match your vision, then generate your design system.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <BoxIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Fresh Start Template:</strong> Define your own variables. Everything is just a starting point!
            </AlertDescription>
          </Alert>
        )}

        {/* Library Template Selector */}
        <div className="space-y-3 bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-purple-600" />
            <Label className="text-sm font-semibold">Start from Popular Library</Label>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Load design tokens from shadcn, Material UI, Chakra, and more.
          </p>
          <Select value={selectedLibraryTemplate} onValueChange={loadLibraryTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a library template..." />
            </SelectTrigger>
            <SelectContent>
              {designSystemTemplates.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedLibraryTemplate && (
            <div className="text-xs text-purple-700 bg-purple-100 p-2 rounded flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              Loaded {designSystemTemplates.find((t) => t.id === selectedLibraryTemplate)?.name} tokens.
            </div>
          )}
        </div>

        {/* System Naming */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Design System Identity</Label>
          <Input
            placeholder="e.g., Acme Design System"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
          />
          <Input
            placeholder="Optional description..."
            value={systemDescription}
            onChange={(e) => setSystemDescription(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Design Intents */}
        <IntentManager intents={designIntents} onIntentsChange={setDesignIntents} />

        {/* Template Presets */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => handleLoadTemplate('minimal')}>
            Minimal Template
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleLoadTemplate('full')}>
            Full Template
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleLoadTemplate('blank')}>
            Blank Slate
          </Button>
        </div>

        {/* Variable Tabs */}
        <Tabs defaultValue="colors">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="colors" className="text-xs">
              <Palette className="w-3.5 h-3.5 mr-1.5" />Colors
            </TabsTrigger>
            <TabsTrigger value="spacing" className="text-xs">
              <Ruler className="w-3.5 h-3.5 mr-1.5" />Spacing
            </TabsTrigger>
            <TabsTrigger value="typography" className="text-xs">
              <Type className="w-3.5 h-3.5 mr-1.5" />Type
            </TabsTrigger>
            <TabsTrigger value="radius" className="text-xs">
              <Circle className="w-3.5 h-3.5 mr-1.5" />Radius
            </TabsTrigger>
            <TabsTrigger value="shadows" className="text-xs">
              <BoxIcon className="w-3.5 h-3.5 mr-1.5" />Shadows
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Color Variables</Label>
              <Badge variant="secondary">{tokenCounts.colors} defined</Badge>
            </div>
            <p className="text-xs text-muted-foreground">HSL format: "221.2 83.2% 53.3%"</p>
            <VariableList
              variables={colors}
              onUpdate={(id, field, value) => updateVariable('colors', id, field, value)}
              onRemove={(id) => removeVariable('colors', id)}
              onAdd={() => addVariable('colors')}
              placeholder="221.2 83.2% 53.3%"
              icon={Palette}
              colorPreview
            />
          </TabsContent>

          <TabsContent value="spacing" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Spacing Variables</Label>
              <Badge variant="secondary">{tokenCounts.spacing} defined</Badge>
            </div>
            <p className="text-xs text-muted-foreground">rem, px, or em: "1rem", "16px"</p>
            <VariableList
              variables={spacing}
              onUpdate={(id, field, value) => updateVariable('spacing', id, field, value)}
              onRemove={(id) => removeVariable('spacing', id)}
              onAdd={() => addVariable('spacing')}
              placeholder="1rem"
              icon={Ruler}
            />
          </TabsContent>

          <TabsContent value="typography" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Typography Variables</Label>
              <Badge variant="secondary">{tokenCounts.typography} defined</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Font families, sizes, weights</p>
            <VariableList
              variables={typography}
              onUpdate={(id, field, value) => updateVariable('typography', id, field, value)}
              onRemove={(id) => removeVariable('typography', id)}
              onAdd={() => addVariable('typography')}
              placeholder="Inter, system-ui, sans-serif"
              icon={Type}
            />
          </TabsContent>

          <TabsContent value="radius" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Border Radius Variables</Label>
              <Badge variant="secondary">{tokenCounts.borderRadius} defined</Badge>
            </div>
            <p className="text-xs text-muted-foreground">rem or px: "0.5rem", "8px"</p>
            <VariableList
              variables={borderRadius}
              onUpdate={(id, field, value) => updateVariable('borderRadius', id, field, value)}
              onRemove={(id) => removeVariable('borderRadius', id)}
              onAdd={() => addVariable('borderRadius')}
              placeholder="0.5rem"
              icon={Circle}
            />
          </TabsContent>

          <TabsContent value="shadows" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Shadow Variables</Label>
              <Badge variant="secondary">{tokenCounts.shadows} defined</Badge>
            </div>
            <p className="text-xs text-muted-foreground">CSS box-shadow values</p>
            <VariableList
              variables={shadows}
              onUpdate={(id, field, value) => updateVariable('shadows', id, field, value)}
              onRemove={(id) => removeVariable('shadows', id)}
              onAdd={() => addVariable('shadows')}
              placeholder="0 4px 6px -1px rgb(0 0 0 / 0.1)"
              icon={BoxIcon}
            />
          </TabsContent>
        </Tabs>

        {/* Live Component Preview */}
        <LiveTokenPreview
          defaultExpanded={false}
          uiLibrary={importedTemplateLibrary || 'shadcn/ui'}
        />

        {/* Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">System Summary</h4>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {Object.entries(tokenCounts).map(([key, count]) => (
              <div key={key}>
                <div className="text-muted-foreground capitalize">{key}</div>
                <div className="font-semibold">{count}</div>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleGenerate} className="w-full" size="lg">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Design System
        </Button>
      </CardContent>

      {pendingSystem && (
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
          tokenCounts={tokenCounts}
        />
      )}

      {/* Save dialog rendered separately to avoid timing issues */}
      <SaveDesignSystemDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={({ name, description, applyImmediately }) => {
          if (pendingSystem) {
            onSystemCreated({ name, description, ...pendingSystem }, applyImmediately);
          }
          setIsSaveDialogOpen(false);
          setPendingSystem(null);
        }}
        tokenCounts={tokenCounts}
      />
    </Card>
  );
}
