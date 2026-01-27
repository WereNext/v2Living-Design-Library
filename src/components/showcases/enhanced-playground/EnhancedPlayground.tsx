// Refactored EnhancedPlayground - Original: 818 LOC -> Now: ~180 LOC
// Split into:
// - enhanced-playground/types.ts - Type definitions and constants
// - enhanced-playground/LivePreview.tsx - Preview orchestrator
// - enhanced-playground/previews/*.tsx - Individual preview components

import { useState, useMemo, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Copy, Check, Eye, Code2, Download } from 'lucide-react';
import { useAppState } from '../../../contexts/AppStateContext';
import {
  generateCSSVariables,
  generateTailwindConfig,
  generateJSONTokens,
  generateSCSSVariables,
} from '../../../lib/code-generators';
import { getTemplate, generateFallbackTemplate, type Framework as TemplateFramework } from '../../../lib/code-templates';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { LivePreview } from './LivePreview';
import { FRAMEWORK_OPTIONS, getComponentOptions, type Framework, type ViewMode } from './types';

export function EnhancedPlayground() {
  const { activeTheme, activeSystem, designIntent } = useAppState();
  const [selectedFramework, setSelectedFramework] = useState<Framework>('react');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [selectedComponent, setSelectedComponent] = useState<string>('buttons');
  const [copied, setCopied] = useState(false);

  // Get component options filtered by the current design intent
  const componentOptions = useMemo(() => getComponentOptions(designIntent), [designIntent]);

  // Reset selected component if it's no longer available in the new intent
  useEffect(() => {
    if (componentOptions.length > 0 && !componentOptions.find(c => c.value === selectedComponent)) {
      setSelectedComponent(componentOptions[0].value);
    }
  }, [componentOptions, selectedComponent]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCode = (): { code: string; language: string; filename: string } => {
    if (!activeTheme) {
      return {
        code: '// No active theme selected\n// Please select a design system and theme to generate code',
        language: 'javascript',
        filename: 'example.js',
      };
    }

    // Token-only generators (not component-specific)
    const tokenGenerators: Partial<Record<Framework, () => { code: string; language: string; filename: string }>> = {
      css: () => ({ code: generateCSSVariables(activeTheme), language: 'css', filename: 'tokens.css' }),
      tailwind: () => ({ code: generateTailwindConfig(activeTheme), language: 'javascript', filename: 'tailwind.config.js' }),
      json: () => ({ code: generateJSONTokens(activeTheme), language: 'json', filename: 'tokens.json' }),
      scss: () => ({ code: generateSCSSVariables(activeTheme), language: 'scss', filename: '_tokens.scss' }),
    };

    // Check if this is a token-only framework
    const tokenGenerator = tokenGenerators[selectedFramework];
    if (tokenGenerator) {
      return tokenGenerator();
    }

    // For component frameworks, use the template registry
    const template = getTemplate(selectedComponent, selectedFramework as TemplateFramework, activeTheme);
    if (template) {
      return template;
    }

    // Fall back to a generic template
    return generateFallbackTemplate(selectedComponent, selectedFramework as TemplateFramework, activeTheme);
  };

  const { code, filename } = getCode();

  // Get a readable intent label
  const intentLabel = useMemo(() => {
    // Convert slug to title case (e.g., "e-commerce" -> "E-Commerce")
    return designIntent
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [designIntent]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Live Code Playground</h2>
            <p className="text-muted-foreground">
              Generate production-ready code for <span className="font-medium text-foreground">{intentLabel}</span> components
            </p>
          </div>
          {activeTheme && (
            <div className="text-right space-y-1">
              <Badge variant="outline">
                {activeSystem?.name}
              </Badge>
              <div className="flex items-center gap-2 justify-end">
                <Badge variant="secondary" className="text-xs">
                  {intentLabel}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Framework Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Select Framework</h3>
        <div className="grid grid-cols-3 gap-2">
          {FRAMEWORK_OPTIONS.map((framework) => (
            <button
              key={framework.id}
              onClick={() => setSelectedFramework(framework.id)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedFramework === framework.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              }`}
            >
              <div className="font-medium text-sm">{framework.label}</div>
              <div className="text-xs text-muted-foreground">{framework.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Component Type Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Select Component Type</h3>
        <Select
          value={selectedComponent}
          onValueChange={(value) => setSelectedComponent(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {componentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'code' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('code')}
        >
          <Code2 className="w-4 h-4 mr-2" />
          Code
        </Button>
        <Button
          variant={viewMode === 'preview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('preview')}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      {/* Code Display */}
      {viewMode === 'code' && (
        <div className="relative">
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDownload(code, filename)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCopy(code)}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="bg-muted rounded-lg p-6 overflow-x-auto border">
            <code className="text-sm font-mono">{code}</code>
          </pre>
        </div>
      )}

      {/* Live Preview */}
      {viewMode === 'preview' && activeTheme && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Live Component Preview</h3>
          <LivePreview theme={activeTheme} componentType={selectedComponent} />
        </div>
      )}

      {/* Token Summary */}
      {activeTheme && (
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3">Design Token Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Colors', count: Object.keys(activeTheme.colors || {}).length },
              { label: 'Typography', count: Object.keys(activeTheme.typography || {}).length },
              { label: 'Spacing', count: Object.keys(activeTheme.spacing || {}).length },
              { label: 'Radius', count: Object.keys(activeTheme.borderRadius || {}).length },
              { label: 'Shadows', count: Object.keys(activeTheme.shadows || {}).length },
            ].map(({ label, count }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-primary">{count}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
