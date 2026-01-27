/**
 * Component Import Dialog
 * 
 * UI for importing components from Figma
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  FileImage,
  Code2,
  Eye,
  ExternalLink,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

import { FigmaAPI, FigmaAPIKeyManager } from '../lib/figma-api';
import { FigmaNodeParser } from '../lib/figma-parser';
import { ImageImporter } from '../lib/image-importer';
import { ComponentCodeGenerator } from '../lib/component-code-generator';
import type { ImportedComponent, ComponentCategory } from '../types/imported-component';
import { DynamicComponent } from './DynamicComponent';

interface ComponentImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: (component: ImportedComponent) => void;
}

type ImportStep = 'input' | 'loading' | 'preview' | 'complete';

export function ComponentImportDialog({
  open,
  onOpenChange,
  onImportComplete,
}: ComponentImportDialogProps) {
  // Form state
  const [figmaUrl, setFigmaUrl] = useState('');
  const [apiKey, setApiKey] = useState(FigmaAPIKeyManager.load() || '');
  const [category, setCategory] = useState<ComponentCategory>('custom');
  const [designIntent, setDesignIntent] = useState('');
  const [description, setDescription] = useState('');

  // Import state
  const [step, setStep] = useState<ImportStep>('input');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [importedComponent, setImportedComponent] = useState<ImportedComponent | null>(null);

  const handleImport = async () => {
    setError('');
    setStep('loading');
    setProgress(10);

    try {
      // Validate inputs
      if (!apiKey || !FigmaAPI.isValidApiKey(apiKey)) {
        throw new Error('Please provide a valid Figma API key');
      }

      if (!figmaUrl) {
        throw new Error('Please provide a Figma URL');
      }

      // Save API key for future use
      FigmaAPIKeyManager.save(apiKey);

      // Parse URL
      const parsed = FigmaAPI.parseUrl(figmaUrl);
      if (!parsed || !parsed.nodeId) {
        throw new Error('Invalid Figma URL. Please include a node ID (e.g., ?node-id=123:456)');
      }

      const { fileKey, nodeId } = parsed;
      setProgress(20);

      // Initialize API
      const figmaAPI = new FigmaAPI(apiKey);
      setProgress(30);

      // Fetch node from Figma
      toast.info('Fetching component from Figma...');
      const nodesData = await figmaAPI.getNodes(fileKey, [nodeId]);
      const nodeData = nodesData[nodeId];
      
      if (!nodeData || !nodeData.document) {
        throw new Error('Component not found in Figma file');
      }

      setProgress(50);

      // Parse structure
      toast.info('Parsing component structure...');
      const parser = new FigmaNodeParser();
      const structure = parser.parse(nodeData.document);
      setProgress(60);

      // Import images
      toast.info('Importing images...');
      const imageImporter = new ImageImporter();
      const images = await imageImporter.importFromComponent(structure, fileKey, figmaAPI);
      setProgress(80);

      // Generate code
      toast.info('Generating code...');
      const codeGen = new ComponentCodeGenerator();
      const component: ImportedComponent = {
        id: Math.random().toString(36).substring(7),
        name: nodeData.document.name,
        description: description || undefined,
        source: {
          type: 'figma',
          fileKey,
          nodeId,
          figmaLink: figmaUrl,
        },
        category,
        designIntent: designIntent || undefined,
        structure,
        images,
        code: {
          jsx: codeGen.generateReact({ structure, images, name: nodeData.document.name } as any),
          imports: [],
        },
        metadata: {
          importedAt: new Date().toISOString(),
          version: '1.0.0',
        },
        isEditable: true,
      };

      setProgress(100);
      setImportedComponent(component);
      setStep('preview');
      toast.success('Component imported successfully!');

    } catch (err: any) {
      setError(err.message || 'Failed to import component');
      setStep('input');
      toast.error(err.message || 'Import failed');
    }
  };

  const handleSave = () => {
    if (!importedComponent) return;

    // TODO: Save to proper data source
    toast.success(`Component "${importedComponent.name}" saved!`);

    if (onImportComplete) {
      onImportComplete(importedComponent);
    }

    // Reset and close
    handleClose();
  };

  const handleClose = () => {
    setStep('input');
    setProgress(0);
    setError('');
    setImportedComponent(null);
    setFigmaUrl('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Component from Figma
          </DialogTitle>
          <DialogDescription>
            Import a Figma component and make it editable in your design system
          </DialogDescription>
        </DialogHeader>

        {/* Input Step */}
        {step === 'input' && (
          <div className="space-y-4">
            {/* API Key Info */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Get your Figma API key:</strong>{' '}
                <a
                  href="https://www.figma.com/developers/api#access-tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline inline-flex items-center gap-1"
                >
                  Figma Settings → Personal Access Tokens
                  <ExternalLink className="w-3 h-3" />
                </a>
              </AlertDescription>
            </Alert>

            {/* API Key */}
            <div className="space-y-2">
              <Label>Figma API Key *</Label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="figd_..."
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent anywhere except Figma
              </p>
            </div>

            {/* Figma URL */}
            <div className="space-y-2">
              <Label>Figma URL *</Label>
              <Input
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                placeholder="https://figma.com/file/abc123?node-id=123:456"
              />
              <p className="text-xs text-muted-foreground">
                Right-click on component in Figma → "Copy link"
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Component Category *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ComponentCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="button">Button</SelectItem>
                  <SelectItem value="form">Form</SelectItem>
                  <SelectItem value="navigation">Navigation</SelectItem>
                  <SelectItem value="layout">Layout</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="testimonial">Testimonial</SelectItem>
                  <SelectItem value="pricing">Pricing</SelectItem>
                  <SelectItem value="cta">CTA</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Design Intent */}
            <div className="space-y-2">
              <Label>Design Intent (optional)</Label>
              <Input
                value={designIntent}
                onChange={(e) => setDesignIntent(e.target.value)}
                placeholder="e.g., e-commerce, web-editorial, landing-page"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this component..."
                rows={2}
              />
            </div>

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleImport}
                disabled={!apiKey || !figmaUrl}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Component
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Loading Step */}
        {step === 'loading' && (
          <div className="space-y-4 py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-semibold mb-1">Importing component...</p>
                <p className="text-sm text-muted-foreground">
                  This may take a moment
                </p>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Preview Step */}
        {step === 'preview' && importedComponent && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="flex gap-2">
              <Badge variant="secondary">
                <FileImage className="w-3 h-3 mr-1" />
                {importedComponent.images.length} image{importedComponent.images.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary">
                <Code2 className="w-3 h-3 mr-1" />
                {importedComponent.code.jsx.split('\n').length} lines
              </Badge>
            </div>

            {/* Preview */}
            <div className="border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </h3>
                <Badge>{importedComponent.category}</Badge>
              </div>
              <div className="bg-white rounded border p-8">
                <DynamicComponent component={importedComponent} />
              </div>
            </div>

            {/* Success */}
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Component imported successfully! Review the preview and click "Save" to add it to your library.
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Save to Library
              </Button>
              <Button variant="outline" onClick={() => setStep('input')}>
                Back
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
