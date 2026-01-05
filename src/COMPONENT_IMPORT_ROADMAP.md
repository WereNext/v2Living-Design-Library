# 🗺️ Component Import System - Build Roadmap

## 🎯 Goal

Build the infrastructure to:
1. Import actual component structures from Figma
2. Import images from Figma designs
3. Edit imported components (text, images, layout)
4. Show custom hero sections with custom images
5. Display imported layouts properly

## 📊 Current State vs Target State

### Current (Token-Only System)
```
Figma Variables → Import Tokens → Apply to Generic Components
Result: Generic components styled with your colors/spacing
```

### Target (Full Component Import)
```
Figma Designs → Import Structure + Images + Tokens → Editable Components
Result: YOUR actual designs, fully editable in the app
```

## 🏗️ Architecture Phases

### **Phase 1: Foundation (Week 1-2)** 
**Goal:** Set up basic infrastructure

#### 1.1 Figma API Integration
```typescript
// lib/figma-api.ts
export class FigmaAPI {
  constructor(private apiKey: string) {}
  
  async getFile(fileKey: string) {
    const response = await fetch(
      `https://api.figma.com/v1/files/${fileKey}`,
      { headers: { 'X-Figma-Token': this.apiKey } }
    );
    return response.json();
  }
  
  async getImages(fileKey: string, nodeIds: string[]) {
    const response = await fetch(
      `https://api.figma.com/v1/images/${fileKey}?ids=${nodeIds.join(',')}`,
      { headers: { 'X-Figma-Token': this.apiKey } }
    );
    return response.json();
  }
  
  async getNode(fileKey: string, nodeId: string) {
    const response = await fetch(
      `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`,
      { headers: { 'X-Figma-Token': this.apiKey } }
    );
    return response.json();
  }
}
```

#### 1.2 Component Storage Schema
```typescript
// types/imported-component.ts
export interface ImportedComponent {
  id: string;
  name: string;
  sourceFileKey: string;
  sourceNodeId: string;
  designIntent?: string; // 'e-commerce', 'web-editorial', etc.
  category: string; // 'hero', 'card', 'form', etc.
  
  structure: ComponentNode; // Parsed Figma node tree
  images: ImportedImage[]; // All images used
  tokens: TokenSet; // Local tokens (if different from system)
  
  code: {
    jsx: string;
    css: string;
    imports: string[];
  };
  
  metadata: {
    importedAt: string;
    lastEdited?: string;
    figmaLink: string;
    thumbnail?: string;
  };
}

export interface ComponentNode {
  type: 'frame' | 'text' | 'rectangle' | 'image' | 'group';
  id: string;
  name: string;
  children?: ComponentNode[];
  
  props: {
    text?: string;
    imageSrc?: string;
    width: number | 'auto';
    height: number | 'auto';
  };
  
  styles: {
    layout?: LayoutStyles;
    appearance?: AppearanceStyles;
    typography?: TypographyStyles;
  };
}

export interface ImportedImage {
  id: string;
  name: string;
  url: string; // Figma URL
  localPath?: string; // After download
  format: 'png' | 'jpg' | 'svg' | 'webp';
  width: number;
  height: number;
  usedIn: string[]; // Component node IDs using this image
}
```

#### 1.3 Component Registry
```typescript
// lib/component-registry.ts
export class ComponentRegistry {
  private components: Map<string, ImportedComponent> = new Map();
  
  register(component: ImportedComponent) {
    this.components.set(component.id, component);
    this.saveToStorage();
  }
  
  get(id: string): ImportedComponent | undefined {
    return this.components.get(id);
  }
  
  getByIntent(intent: string): ImportedComponent[] {
    return Array.from(this.components.values())
      .filter(c => c.designIntent === intent);
  }
  
  getByCategory(category: string): ImportedComponent[] {
    return Array.from(this.components.values())
      .filter(c => c.category === category);
  }
  
  update(id: string, updates: Partial<ImportedComponent>) {
    const component = this.components.get(id);
    if (component) {
      this.components.set(id, { ...component, ...updates });
      this.saveToStorage();
    }
  }
  
  delete(id: string) {
    this.components.delete(id);
    this.saveToStorage();
  }
  
  private saveToStorage() {
    localStorage.setItem(
      'importedComponents',
      JSON.stringify(Array.from(this.components.entries()))
    );
  }
}
```

---

### **Phase 2: Import Pipeline (Week 3-4)**
**Goal:** Import components and images from Figma

#### 2.1 Figma Node Parser
```typescript
// lib/figma-parser.ts
export class FigmaNodeParser {
  parse(figmaNode: any): ComponentNode {
    return {
      type: this.mapNodeType(figmaNode.type),
      id: figmaNode.id,
      name: figmaNode.name,
      children: figmaNode.children?.map(child => this.parse(child)),
      
      props: this.extractProps(figmaNode),
      styles: {
        layout: this.parseLayout(figmaNode),
        appearance: this.parseAppearance(figmaNode),
        typography: this.parseTypography(figmaNode),
      },
    };
  }
  
  private mapNodeType(figmaType: string): ComponentNode['type'] {
    const mapping = {
      'FRAME': 'frame',
      'TEXT': 'text',
      'RECTANGLE': 'rectangle',
      'IMAGE': 'image',
      'GROUP': 'group',
    };
    return mapping[figmaType] || 'frame';
  }
  
  private parseLayout(node: any): LayoutStyles {
    if (node.layoutMode) {
      // Auto Layout
      return {
        display: 'flex',
        flexDirection: node.layoutMode === 'HORIZONTAL' ? 'row' : 'column',
        gap: `${node.itemSpacing}px`,
        padding: this.parsePadding(node.paddingLeft, node.paddingTop, node.paddingRight, node.paddingBottom),
        alignItems: this.mapAlignment(node.primaryAxisAlignItems),
        justifyContent: this.mapAlignment(node.counterAxisAlignItems),
      };
    } else {
      // Absolute positioning
      return {
        position: 'absolute',
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.width}px`,
        height: `${node.height}px`,
      };
    }
  }
  
  private parseAppearance(node: any): AppearanceStyles {
    const styles: AppearanceStyles = {};
    
    // Background
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID') {
        styles.backgroundColor = this.rgbaToHex(fill.color, fill.opacity);
      } else if (fill.type === 'GRADIENT_LINEAR') {
        styles.background = this.parseGradient(fill);
      } else if (fill.type === 'IMAGE') {
        styles.backgroundImage = fill.imageRef;
      }
    }
    
    // Border
    if (node.strokes && node.strokes.length > 0) {
      styles.border = `${node.strokeWeight}px solid ${this.rgbaToHex(node.strokes[0].color)}`;
    }
    
    // Border Radius
    if (node.cornerRadius) {
      styles.borderRadius = `${node.cornerRadius}px`;
    }
    
    // Shadow
    if (node.effects && node.effects.length > 0) {
      styles.boxShadow = node.effects
        .filter(e => e.type === 'DROP_SHADOW')
        .map(e => this.parseShadow(e))
        .join(', ');
    }
    
    return styles;
  }
  
  private parseTypography(node: any): TypographyStyles | undefined {
    if (node.type !== 'TEXT') return undefined;
    
    return {
      fontFamily: node.style.fontFamily,
      fontSize: `${node.style.fontSize}px`,
      fontWeight: node.style.fontWeight,
      lineHeight: node.style.lineHeightPx ? `${node.style.lineHeightPx}px` : 'normal',
      letterSpacing: node.style.letterSpacing ? `${node.style.letterSpacing}px` : 'normal',
      textAlign: node.style.textAlignHorizontal.toLowerCase(),
      color: this.rgbaToHex(node.fills[0]?.color),
    };
  }
}
```

#### 2.2 Image Importer
```typescript
// lib/image-importer.ts
export class ImageImporter {
  async importImages(
    fileKey: string,
    nodeIds: string[],
    figmaAPI: FigmaAPI
  ): Promise<ImportedImage[]> {
    // Get image URLs from Figma
    const imageResponse = await figmaAPI.getImages(fileKey, nodeIds);
    
    const images: ImportedImage[] = [];
    
    for (const [nodeId, url] of Object.entries(imageResponse.images)) {
      if (!url) continue;
      
      // Download image
      const blob = await fetch(url).then(r => r.blob());
      
      // Convert to base64 or store in IndexedDB
      const base64 = await this.blobToBase64(blob);
      
      images.push({
        id: nodeId,
        name: `image-${nodeId}`,
        url: url as string,
        localPath: base64, // or indexedDB key
        format: this.detectFormat(blob.type),
        width: 0, // Get from image metadata
        height: 0,
        usedIn: [],
      });
    }
    
    return images;
  }
  
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }
  
  private detectFormat(mimeType: string): ImportedImage['format'] {
    if (mimeType.includes('png')) return 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg';
    if (mimeType.includes('svg')) return 'svg';
    if (mimeType.includes('webp')) return 'webp';
    return 'png';
  }
}
```

#### 2.3 Code Generator (Figma → React)
```typescript
// lib/component-code-generator.ts
export class ComponentCodeGenerator {
  generate(component: ImportedComponent): string {
    const { structure, images } = component;
    
    const imports = this.generateImports(images);
    const jsx = this.generateJSX(structure, images);
    const styles = this.generateStyles(structure);
    
    return `
${imports}

export function ${this.componentName(component.name)}() {
  return (
${jsx}
  );
}

const styles = ${JSON.stringify(styles, null, 2)};
    `.trim();
  }
  
  private generateImports(images: ImportedImage[]): string {
    const imports = ["import React from 'react';"];
    
    images.forEach((img, index) => {
      imports.push(`import img${index} from './assets/${img.name}.${img.format}';`);
    });
    
    return imports.join('\n');
  }
  
  private generateJSX(node: ComponentNode, images: ImportedImage[], depth = 2): string {
    const indent = '  '.repeat(depth);
    
    if (node.type === 'text') {
      return `${indent}<div style={styles.${node.id}}>\n${indent}  ${node.props.text || ''}\n${indent}</div>`;
    }
    
    if (node.type === 'image') {
      const imgIndex = images.findIndex(img => img.id === node.id);
      return `${indent}<img src={img${imgIndex}} alt="${node.name}" style={styles.${node.id}} />`;
    }
    
    if (node.type === 'frame' || node.type === 'group') {
      const children = node.children
        ?.map(child => this.generateJSX(child, images, depth + 1))
        .join('\n') || '';
      
      return `${indent}<div style={styles.${node.id}}>\n${children}\n${indent}</div>`;
    }
    
    return `${indent}<div style={styles.${node.id}} />`;
  }
  
  private generateStyles(node: ComponentNode): Record<string, any> {
    const styles: Record<string, any> = {};
    
    const nodeStyle = {
      ...node.styles.layout,
      ...node.styles.appearance,
      ...node.styles.typography,
    };
    
    styles[node.id] = nodeStyle;
    
    node.children?.forEach(child => {
      Object.assign(styles, this.generateStyles(child));
    });
    
    return styles;
  }
}
```

---

### **Phase 3: Component Editor UI (Week 5-7)**
**Goal:** Edit imported components visually

#### 3.1 Component Import Dialog
```tsx
// components/ComponentImportDialog.tsx
export function ComponentImportDialog() {
  const [fileKey, setFileKey] = useState('');
  const [nodeId, setNodeId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [importing, setImporting] = useState(false);
  
  const handleImport = async () => {
    setImporting(true);
    
    try {
      // 1. Fetch from Figma
      const figmaAPI = new FigmaAPI(apiKey);
      const nodeData = await figmaAPI.getNode(fileKey, nodeId);
      
      // 2. Parse structure
      const parser = new FigmaNodeParser();
      const structure = parser.parse(nodeData.nodes[nodeId].document);
      
      // 3. Import images
      const imageNodes = extractImageNodes(structure);
      const imageImporter = new ImageImporter();
      const images = await imageImporter.importImages(
        fileKey,
        imageNodes.map(n => n.id),
        figmaAPI
      );
      
      // 4. Generate code
      const codeGen = new ComponentCodeGenerator();
      const importedComponent: ImportedComponent = {
        id: generateId(),
        name: nodeData.nodes[nodeId].document.name,
        sourceFileKey: fileKey,
        sourceNodeId: nodeId,
        structure,
        images,
        code: {
          jsx: codeGen.generate({ structure, images } as any),
          css: '',
          imports: [],
        },
        metadata: {
          importedAt: new Date().toISOString(),
          figmaLink: `https://figma.com/file/${fileKey}?node-id=${nodeId}`,
        },
      };
      
      // 5. Register component
      const registry = new ComponentRegistry();
      registry.register(importedComponent);
      
      toast.success('Component imported successfully!');
    } catch (error) {
      toast.error('Import failed: ' + error.message);
    } finally {
      setImporting(false);
    }
  };
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Component from Figma</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Figma API Key</Label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="figd_..."
            />
          </div>
          
          <div>
            <Label>File Key</Label>
            <Input
              value={fileKey}
              onChange={(e) => setFileKey(e.target.value)}
              placeholder="abc123..."
            />
          </div>
          
          <div>
            <Label>Node ID</Label>
            <Input
              value={nodeId}
              onChange={(e) => setNodeId(e.target.value)}
              placeholder="123:456"
            />
          </div>
          
          <Button
            onClick={handleImport}
            disabled={!apiKey || !fileKey || !nodeId || importing}
          >
            {importing ? 'Importing...' : 'Import Component'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### 3.2 Component Editor
```tsx
// components/ImportedComponentEditor.tsx
export function ImportedComponentEditor({
  component,
  onUpdate,
}: {
  component: ImportedComponent;
  onUpdate: (updates: Partial<ImportedComponent>) => void;
}) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-[300px_1fr_300px] h-screen">
      {/* Left: Component Tree */}
      <div className="border-r p-4 overflow-auto">
        <h3 className="font-semibold mb-4">Component Tree</h3>
        <ComponentTree
          structure={component.structure}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
        />
      </div>
      
      {/* Middle: Live Preview */}
      <div className="p-8 bg-gray-50 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <DynamicComponent component={component} />
        </div>
      </div>
      
      {/* Right: Property Editor */}
      <div className="border-l p-4 overflow-auto">
        <h3 className="font-semibold mb-4">Properties</h3>
        {selectedNode && (
          <PropertyEditor
            node={findNode(component.structure, selectedNode)}
            onChange={(updates) => {
              const newStructure = updateNode(
                component.structure,
                selectedNode,
                updates
              );
              onUpdate({ structure: newStructure });
            }}
          />
        )}
      </div>
    </div>
  );
}
```

#### 3.3 Dynamic Component Renderer
```tsx
// components/DynamicComponent.tsx
export function DynamicComponent({ component }: { component: ImportedComponent }) {
  return renderNode(component.structure, component.images);
}

function renderNode(node: ComponentNode, images: ImportedImage[]): React.ReactNode {
  const style = {
    ...node.styles.layout,
    ...node.styles.appearance,
    ...node.styles.typography,
  };
  
  if (node.type === 'text') {
    return (
      <div key={node.id} style={style}>
        {node.props.text}
      </div>
    );
  }
  
  if (node.type === 'image') {
    const image = images.find(img => img.id === node.id);
    return (
      <img
        key={node.id}
        src={image?.localPath || image?.url}
        alt={node.name}
        style={style}
      />
    );
  }
  
  if (node.type === 'frame' || node.type === 'group') {
    return (
      <div key={node.id} style={style}>
        {node.children?.map(child => renderNode(child, images))}
      </div>
    );
  }
  
  return <div key={node.id} style={style} />;
}
```

---

### **Phase 4: Integration (Week 8-9)**
**Goal:** Integrate with existing system

#### 4.1 Update ComponentShowcase
```tsx
// components/ComponentShowcase.tsx
export function ComponentShowcase({ category, designIntent }: ComponentShowcaseProps) {
  const registry = new ComponentRegistry();
  const importedComponents = registry.getByCategory(category);
  
  // Show imported components if available
  if (importedComponents.length > 0) {
    return (
      <div className="space-y-8">
        <h2>Imported {category} Components</h2>
        {importedComponents.map(component => (
          <DynamicComponent key={component.id} component={component} />
        ))}
      </div>
    );
  }
  
  // Fall back to built-in showcases
  if (category === "hero") return <HeroShowcase />;
  // ... rest of built-in showcases
}
```

#### 4.2 Import Tab in UI
```tsx
// Update App.tsx to add "Import Component" tab
<Tabs>
  <TabsList>
    <TabsTrigger value="import-tokens">Import Tokens</TabsTrigger>
    <TabsTrigger value="import-component">Import Component</TabsTrigger>
  </TabsList>
  
  <TabsContent value="import-tokens">
    <ImportConfig />
  </TabsContent>
  
  <TabsContent value="import-component">
    <ComponentImportDialog />
  </TabsContent>
</Tabs>
```

---

## 📅 Timeline

```
Week 1-2:   Phase 1 - Foundation
  ├─ Figma API integration
  ├─ Component storage schema
  └─ Component registry

Week 3-4:   Phase 2 - Import Pipeline
  ├─ Figma node parser
  ├─ Image importer
  └─ Code generator

Week 5-7:   Phase 3 - Editor UI
  ├─ Import dialog
  ├─ Component editor
  └─ Dynamic renderer

Week 8-9:   Phase 4 - Integration
  ├─ Update ComponentShowcase
  ├─ Add import UI
  └─ Testing & polish

Total: 9 weeks (2+ months)
```

## 🎯 Success Criteria

### ✅ Phase 1 Complete When:
- [ ] Can authenticate with Figma API
- [ ] Can fetch Figma file data
- [ ] Component storage schema defined
- [ ] Component registry working

### ✅ Phase 2 Complete When:
- [ ] Can parse Figma nodes to ComponentNode
- [ ] Can import images from Figma
- [ ] Can generate React code from structure
- [ ] Images stored locally (base64/IndexedDB)

### ✅ Phase 3 Complete When:
- [ ] Import dialog functional
- [ ] Components render dynamically
- [ ] Can edit component properties
- [ ] Can swap images

### ✅ Phase 4 Complete When:
- [ ] Imported components show in showcases
- [ ] Can switch between imported/built-in
- [ ] Export works for imported components
- [ ] All integrated with existing design system

## 🎉 Final Result

After completion, you'll be able to:

1. ✅ Paste Figma URL + node ID
2. ✅ Import component structure + images
3. ✅ See YOUR hero with YOUR custom image
4. ✅ Edit text, swap images, adjust styles
5. ✅ Export to React/Vue/Svelte with images
6. ✅ Save to design system library
7. ✅ Reuse across projects

**This is the full "design in Figma, edit in app" workflow!**

---

**Ready to build this? Let me know and I can help with implementation!**
