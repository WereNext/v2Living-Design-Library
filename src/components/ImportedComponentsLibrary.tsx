/**
 * Imported Components Library
 * 
 * Manage all imported components from Figma
 */

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Plus, 
  Search, 
  Package, 
  Download,
  Trash2,
  Eye,
  Code2,
  Filter,
  Sparkles,
  FileImage
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

import type { ImportedComponent, ComponentCategory } from '../types/imported-component';
import { ComponentPreviewCard } from './DynamicComponent';
import { ComponentImportDialog } from './ComponentImportDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DynamicComponent } from './DynamicComponent';
import { ComponentCodeGenerator } from '../lib/component-code-generator';

export function ImportedComponentsLibrary() {
  const [components, setComponents] = useState<ImportedComponent[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<ImportedComponent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [intentFilter, setIntentFilter] = useState<string>('all');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ImportedComponent | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [componentToEdit, setComponentToEdit] = useState<ImportedComponent | null>(null);

  // Load components
  useEffect(() => {
    loadComponents();
  }, []);

  // Filter components
  useEffect(() => {
    let filtered = components;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }

    if (intentFilter !== 'all') {
      filtered = filtered.filter(c => c.designIntent === intentFilter);
    }

    setFilteredComponents(filtered);
  }, [components, searchTerm, categoryFilter, intentFilter]);

  const loadComponents = () => {
    // TODO: Load from proper data source
    setComponents([]);
  };

  const handleImportComplete = (component: ImportedComponent) => {
    loadComponents();
    toast.success(`Component "${component.name}" added to library!`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this component?')) {
      // TODO: Implement delete
      loadComponents();
      toast.success('Component deleted');
    }
  };

  const handleExport = (component: ImportedComponent) => {
    // TODO: Implement export
    toast.success('Component exported!');
  };

  const handlePreview = (component: ImportedComponent) => {
    setSelectedComponent(component);
    setShowPreviewDialog(true);
  };

  const handleEdit = (component: ImportedComponent) => {
    // Navigate to full-screen visual editor
    window.location.hash = `edit-component-${component.id}`;
  };

  const stats = { total: 0, byCategory: {}, editable: 0 };
  const uniqueIntents = [...new Set(components.map(c => c.designIntent).filter(Boolean))] as string[];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Imported Components</h1>
        <p className="text-muted-foreground">
          Your library of components imported from Figma, ready to use and customize
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Components</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">
            {Object.keys(stats.byCategory).length}
          </div>
          <div className="text-sm text-muted-foreground">Categories</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">
            {components.reduce((sum, c) => sum + c.images.length, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Images</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">{stats.editable}</div>
          <div className="text-sm text-muted-foreground">Editable</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search components..."
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
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

        {uniqueIntents.length > 0 && (
          <Select value={intentFilter} onValueChange={setIntentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Sparkles className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Intent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intents</SelectItem>
              {uniqueIntents.map(intent => (
                <SelectItem key={intent} value={intent}>{intent}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button onClick={() => setShowImportDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Import Component
        </Button>
      </div>

      {/* Components Grid */}
      {filteredComponents.length === 0 ? (
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            {components.length === 0 ? (
              <>
                No components imported yet. Click "Import Component" to get started!
              </>
            ) : (
              <>No components match your filters. Try adjusting your search.</>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <ComponentPreviewCard
              key={component.id}
              component={component}
              onClick={() => handlePreview(component)}
              onDelete={() => handleDelete(component.id)}
              onEdit={() => handleEdit(component)}
            />
          ))}
        </div>
      )}

      {/* Import Dialog */}
      <ComponentImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={handleImportComplete}
      />

      {/* Preview Dialog */}
      {selectedComponent && (
        <ComponentPreviewDialog
          component={selectedComponent}
          open={showPreviewDialog}
          onOpenChange={setShowPreviewDialog}
          onExport={() => handleExport(selectedComponent)}
        />
      )}

    </div>
  );
}

/**
 * Component Preview Dialog
 */
interface ComponentPreviewDialogProps {
  component: ImportedComponent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: () => void;
}

function ComponentPreviewDialog({
  component,
  open,
  onOpenChange,
  onExport,
}: ComponentPreviewDialogProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast.success('Code copied to clipboard!');
  };

  const codeGen = new ComponentCodeGenerator();
  const reactCode = codeGen.generateReact(component);
  const vueCode = codeGen.generateVue(component);
  const svelteCode = codeGen.generateSvelte(component);
  const htmlCode = codeGen.generateHTML(component);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {component.name}
          </DialogTitle>
          <DialogDescription>
            {component.description || 'Imported from Figma'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="vue">Vue</TabsTrigger>
            <TabsTrigger value="svelte">Svelte</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            {/* Info */}
            <div className="flex flex-wrap gap-2">
              <Badge>{component.category}</Badge>
              {component.designIntent && <Badge variant="secondary">{component.designIntent}</Badge>}
              {component.images.length > 0 && (
                <Badge variant="outline">
                  <FileImage className="w-3 h-3 mr-1" />
                  {component.images.length} image{component.images.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {/* Preview */}
            <div className="border rounded-lg p-8 bg-white">
              <DynamicComponent component={component} />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={onExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="react">
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopyCode(reactCode)}
              >
                {copiedCode ? 'Copied!' : 'Copy'}
              </Button>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{reactCode}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="vue">
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopyCode(vueCode)}
              >
                {copiedCode ? 'Copied!' : 'Copy'}
              </Button>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{vueCode}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="svelte">
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopyCode(svelteCode)}
              >
                {copiedCode ? 'Copied!' : 'Copy'}
              </Button>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{svelteCode}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="html">
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopyCode(htmlCode)}
              >
                {copiedCode ? 'Copied!' : 'Copy'}
              </Button>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{htmlCode}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}