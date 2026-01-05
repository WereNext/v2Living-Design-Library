/**
 * Component Editor
 * 
 * Visual editor for imported components with property inspector,
 * component tree, and live preview
 */

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  ChevronRight,
  ChevronDown,
  Image as ImageIcon,
  Type as TypeIcon,
  Box as BoxIcon,
  Circle,
  Square,
  MousePointer,
  Layers,
  Code2,
  Palette,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

import type { ImportedComponent, ComponentNode } from '../types/imported-component';
import { DynamicComponent } from './DynamicComponent';
import { getComponentRegistry } from '../lib/component-registry';
import { ComponentCodeGenerator } from '../lib/component-code-generator';
import { ImageLibrary } from './ImageLibrary';
import type { StoredImage } from '../lib/image-storage';

interface ComponentEditorProps {
  component: ImportedComponent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditComplete?: () => void;
}

export function ComponentEditor({ component, open, onOpenChange, onEditComplete }: ComponentEditorProps) {
  const [editedComponent, setEditedComponent] = useState<ImportedComponent>(component);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Get selected node
  const selectedNode = selectedNodeId 
    ? findNode(editedComponent.structure, selectedNodeId)
    : null;

  const handleSave = () => {
    // Save to registry
    const registry = getComponentRegistry();
    registry.update(editedComponent.id, {
      structure: editedComponent.structure,
      metadata: {
        ...editedComponent.metadata,
        lastEdited: new Date().toISOString(),
      },
    });

    // Regenerate code
    const codeGen = new ComponentCodeGenerator();
    const newCode = codeGen.generateReact(editedComponent);
    registry.update(editedComponent.id, {
      code: {
        jsx: newCode,
        imports: [],
      },
    });

    toast.success('Component saved!');
    setHasChanges(false);

    if (onEditComplete) {
      onEditComplete();
    }
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<ComponentNode>) => {
    const newStructure = updateNode(editedComponent.structure, nodeId, updates);
    setEditedComponent({
      ...editedComponent,
      structure: newStructure,
    });
    setHasChanges(true);
  };

  const handleReset = () => {
    if (confirm('Discard all changes?')) {
      setEditedComponent(component);
      setSelectedNodeId(null);
      setHasChanges(false);
      toast.info('Changes discarded');
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Close anyway?')) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-4">
          <h2 className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Edit Component: {editedComponent.name}
          </h2>
          {hasChanges && (
            <Badge variant="secondary">Unsaved Changes</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Component Tree */}
        <div className="w-64 border-r bg-muted/30 overflow-hidden flex flex-col">
          <div className="p-3 border-b bg-background">
            <h3 className="text-sm font-semibold">Component Tree</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              <ComponentTree
                node={editedComponent.structure}
                selectedId={selectedNodeId}
                onSelect={setSelectedNodeId}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Center: Live Preview */}
        <div className="flex-1 overflow-auto bg-muted/10">
          <div className="p-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border-2 border-primary/20 p-8">
                <DynamicComponent
                  component={editedComponent}
                  editable
                  onNodeClick={setSelectedNodeId}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Property Inspector */}
        <div className="w-80 border-l bg-background overflow-hidden flex flex-col">
          <div className="p-3 border-b">
            <h3 className="text-sm font-semibold">Properties</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              {selectedNode ? (
                <PropertyInspector
                  node={selectedNode}
                  onChange={(updates) => handleNodeUpdate(selectedNode.id, updates)}
                />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <MousePointer className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a node to edit properties</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

/**
 * Component Tree View
 */
interface ComponentTreeProps {
  node: ComponentNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  depth?: number;
}

function ComponentTree({ node, selectedId, onSelect, depth = 0 }: ComponentTreeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2); // Auto-expand first 2 levels
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.id === selectedId;

  const getIcon = () => {
    switch (node.type) {
      case 'text': return <TypeIcon className="w-3.5 h-3.5" />;
      case 'image': return <ImageIcon className="w-3.5 h-3.5" />;
      case 'button': return <Square className="w-3.5 h-3.5" />;
      case 'input': return <Square className="w-3.5 h-3.5" />;
      case 'rectangle': return <Square className="w-3.5 h-3.5" />;
      default: return <BoxIcon className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div>
      <div
        className={`
          flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer
          hover:bg-accent transition-colors
          ${isSelected ? 'bg-primary/10 border border-primary/30' : ''}
        `}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-muted rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        
        <div className="text-muted-foreground">{getIcon()}</div>
        
        <span className="text-sm truncate flex-1">{node.name}</span>
        
        {!node.isVisible && (
          <EyeOff className="w-3 h-3 text-muted-foreground" />
        )}
        
        <Badge variant="outline" className="text-xs px-1 py-0">
          {node.type}
        </Badge>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children?.map((child) => (
            <ComponentTree
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Property Inspector
 */
interface PropertyInspectorProps {
  node: ComponentNode;
  onChange: (updates: Partial<ComponentNode>) => void;
}

function PropertyInspector({ node, onChange }: PropertyInspectorProps) {
  const [showImagePicker, setShowImagePicker] = useState(false);

  const handleImageSelect = (image: StoredImage) => {
    onChange({
      props: {
        ...node.props,
        imageSrc: image.dataUrl,
        imageAlt: image.name,
      }
    });
    setShowImagePicker(false);
    toast.success('Image replaced!');
  };

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
      </TabsList>

      {/* Content Tab */}
      <TabsContent value="content" className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Node Name</Label>
            <Input
              value={node.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label className="text-xs">Node Type</Label>
            <Input
              value={node.type}
              disabled
              className="h-8 text-sm bg-muted"
            />
          </div>

          {node.type === 'text' && (
            <div>
              <Label className="text-xs">Text Content</Label>
              <Textarea
                value={node.props.text || ''}
                onChange={(e) => onChange({
                  props: { ...node.props, text: e.target.value }
                })}
                rows={3}
                className="text-sm"
              />
            </div>
          )}

          {node.type === 'input' && (
            <>
              <div>
                <Label className="text-xs">Input Type</Label>
                <Input
                  value={node.props.inputType || 'text'}
                  onChange={(e) => onChange({
                    props: { ...node.props, inputType: e.target.value as any }
                  })}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Placeholder</Label>
                <Input
                  value={node.props.placeholder || ''}
                  onChange={(e) => onChange({
                    props: { ...node.props, placeholder: e.target.value }
                  })}
                  className="h-8 text-sm"
                />
              </div>
            </>
          )}

          {node.type === 'image' && (
            <>
              <div>
                <Label className="text-xs">Image</Label>
                {node.props.imageSrc && (
                  <div className="mt-2 mb-3 border rounded overflow-hidden">
                    <img 
                      src={node.props.imageSrc} 
                      alt={node.props.imageAlt || 'Current image'}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setShowImagePicker(true)}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Replace Image
                </Button>
              </div>
              <div>
                <Label className="text-xs">Image Alt Text</Label>
                <Input
                  value={node.props.imageAlt || ''}
                  onChange={(e) => onChange({
                    props: { ...node.props, imageAlt: e.target.value }
                  })}
                  className="h-8 text-sm"
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="visible"
              checked={node.isVisible !== false}
              onChange={(e) => onChange({ isVisible: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="visible" className="text-xs cursor-pointer">
              Visible
            </Label>
          </div>
        </div>
      </TabsContent>

      {/* Style Tab */}
      <TabsContent value="style" className="space-y-4">
        <StyleEditor
          styles={node.styles}
          onChange={(styles) => onChange({ styles })}
        />
      </TabsContent>

      {/* Layout Tab */}
      <TabsContent value="layout" className="space-y-4">
        <LayoutEditor
          layout={node.styles.layout || {}}
          onChange={(layout) => onChange({
            styles: { ...node.styles, layout }
          })}
        />
      </TabsContent>

      {/* Image Picker Dialog */}
      {showImagePicker && (
        <Dialog open={showImagePicker} onOpenChange={setShowImagePicker}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Select Image</DialogTitle>
            </DialogHeader>
            <ImageLibrary
              selectionMode
              onImageSelect={handleImageSelect}
              maxSelection={1}
            />
          </DialogContent>
        </Dialog>
      )}
    </Tabs>
  );
}

/**
 * Style Editor
 */
interface StyleEditorProps {
  styles: ComponentNode['styles'];
  onChange: (styles: ComponentNode['styles']) => void;
}

function StyleEditor({ styles, onChange }: StyleEditorProps) {
  const appearance = styles.appearance || {};
  const typography = styles.typography || {};

  return (
    <div className="space-y-3">
      {/* Colors */}
      <div>
        <Label className="text-xs">Background Color</Label>
        <Input
          value={appearance.backgroundColor || ''}
          onChange={(e) => onChange({
            ...styles,
            appearance: { ...appearance, backgroundColor: e.target.value }
          })}
          placeholder="#ffffff or rgb(255,255,255)"
          className="h-8 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs">Text Color</Label>
        <Input
          value={typography.color || ''}
          onChange={(e) => onChange({
            ...styles,
            typography: { ...typography, color: e.target.value }
          })}
          placeholder="#000000"
          className="h-8 text-sm"
        />
      </div>

      {/* Border */}
      <div>
        <Label className="text-xs">Border</Label>
        <Input
          value={appearance.border || ''}
          onChange={(e) => onChange({
            ...styles,
            appearance: { ...appearance, border: e.target.value }
          })}
          placeholder="1px solid #000"
          className="h-8 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs">Border Radius</Label>
        <Input
          value={appearance.borderRadius || ''}
          onChange={(e) => onChange({
            ...styles,
            appearance: { ...appearance, borderRadius: e.target.value }
          })}
          placeholder="8px"
          className="h-8 text-sm"
        />
      </div>

      {/* Typography */}
      <div>
        <Label className="text-xs">Font Size</Label>
        <Input
          value={typography.fontSize || ''}
          onChange={(e) => onChange({
            ...styles,
            typography: { ...typography, fontSize: e.target.value }
          })}
          placeholder="16px"
          className="h-8 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs">Font Weight</Label>
        <Input
          value={typography.fontWeight || ''}
          onChange={(e) => onChange({
            ...styles,
            typography: { ...typography, fontWeight: e.target.value }
          })}
          placeholder="400"
          className="h-8 text-sm"
        />
      </div>
    </div>
  );
}

/**
 * Layout Editor
 */
interface LayoutEditorProps {
  layout: NonNullable<ComponentNode['styles']['layout']>;
  onChange: (layout: NonNullable<ComponentNode['styles']['layout']>) => void;
}

function LayoutEditor({ layout, onChange }: LayoutEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Display</Label>
        <Input
          value={layout.display || ''}
          onChange={(e) => onChange({ ...layout, display: e.target.value as any })}
          placeholder="flex, block, grid"
          className="h-8 text-sm"
        />
      </div>

      {layout.display === 'flex' && (
        <>
          <div>
            <Label className="text-xs">Flex Direction</Label>
            <Input
              value={layout.flexDirection || ''}
              onChange={(e) => onChange({ ...layout, flexDirection: e.target.value as any })}
              placeholder="row, column"
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label className="text-xs">Justify Content</Label>
            <Input
              value={layout.justifyContent || ''}
              onChange={(e) => onChange({ ...layout, justifyContent: e.target.value as any })}
              placeholder="flex-start, center, space-between"
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label className="text-xs">Align Items</Label>
            <Input
              value={layout.alignItems || ''}
              onChange={(e) => onChange({ ...layout, alignItems: e.target.value as any })}
              placeholder="flex-start, center, stretch"
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label className="text-xs">Gap</Label>
            <Input
              value={layout.gap || ''}
              onChange={(e) => onChange({ ...layout, gap: e.target.value })}
              placeholder="16px"
              className="h-8 text-sm"
            />
          </div>
        </>
      )}

      <div>
        <Label className="text-xs">Width</Label>
        <Input
          value={layout.width || ''}
          onChange={(e) => onChange({ ...layout, width: e.target.value })}
          placeholder="auto, 100%, 400px"
          className="h-8 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs">Height</Label>
        <Input
          value={layout.height || ''}
          onChange={(e) => onChange({ ...layout, height: e.target.value })}
          placeholder="auto, 100%, 400px"
          className="h-8 text-sm"
        />
      </div>
    </div>
  );
}

/**
 * Helper: Find node in tree
 */
function findNode(root: ComponentNode, id: string): ComponentNode | null {
  if (root.id === id) return root;
  
  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Helper: Update node in tree
 */
function updateNode(
  root: ComponentNode,
  id: string,
  updates: Partial<ComponentNode>
): ComponentNode {
  if (root.id === id) {
    return { ...root, ...updates };
  }

  if (root.children) {
    return {
      ...root,
      children: root.children.map(child => updateNode(child, id, updates)),
    };
  }

  return root;
}