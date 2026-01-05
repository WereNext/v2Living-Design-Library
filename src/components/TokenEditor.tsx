import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DesignTokens, ColorToken, DimensionToken, ShadowToken } from '../types/design-tokens';

interface TokenEditorProps {
  tokens: DesignTokens;
  onChange: (tokens: DesignTokens) => void;
}

export function TokenEditor({ tokens, onChange }: TokenEditorProps) {
  const [editingToken, setEditingToken] = useState<{ category: string; key: string } | null>(null);

  const addToken = (category: keyof DesignTokens, key: string, value: string) => {
    const updated = { ...tokens };
    
    if (!updated[category]) {
      updated[category] = {};
    }

    switch (category) {
      case 'colors':
        (updated[category] as any)[key] = { value, type: 'color' };
        break;
      case 'spacing':
      case 'radius':
        (updated[category] as any)[key] = { value, type: 'dimension' };
        break;
      case 'shadows':
        (updated[category] as any)[key] = { value, type: 'shadow' };
        break;
      default:
        (updated[category] as any)[key] = { value, type: 'color' };
    }

    onChange(updated);
  };

  const updateToken = (category: keyof DesignTokens, key: string, value: string) => {
    const updated = { ...tokens };
    if (updated[category] && (updated[category] as any)[key]) {
      (updated[category] as any)[key].value = value;
      onChange(updated);
    }
  };

  const deleteToken = (category: keyof DesignTokens, key: string) => {
    const updated = { ...tokens };
    if (updated[category]) {
      delete (updated[category] as any)[key];
      onChange(updated);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="radius">Radius</TabsTrigger>
          <TabsTrigger value="shadows">Shadows</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4 mt-4">
          <ColorTokenEditor
            tokens={tokens.colors || {}}
            onAdd={(key, value) => addToken('colors', key, value)}
            onUpdate={(key, value) => updateToken('colors', key, value)}
            onDelete={(key) => deleteToken('colors', key)}
          />
        </TabsContent>

        <TabsContent value="spacing" className="space-y-4 mt-4">
          <DimensionTokenEditor
            label="Spacing"
            tokens={tokens.spacing || {}}
            onAdd={(key, value) => addToken('spacing', key, value)}
            onUpdate={(key, value) => updateToken('spacing', key, value)}
            onDelete={(key) => deleteToken('spacing', key)}
          />
        </TabsContent>

        <TabsContent value="radius" className="space-y-4 mt-4">
          <DimensionTokenEditor
            label="Border Radius"
            tokens={tokens.radius || {}}
            onAdd={(key, value) => addToken('radius', key, value)}
            onUpdate={(key, value) => updateToken('radius', key, value)}
            onDelete={(key) => deleteToken('radius', key)}
          />
        </TabsContent>

        <TabsContent value="shadows" className="space-y-4 mt-4">
          <ShadowTokenEditor
            tokens={tokens.shadows || {}}
            onAdd={(key, value) => addToken('shadows', key, value)}
            onUpdate={(key, value) => updateToken('shadows', key, value)}
            onDelete={(key) => deleteToken('shadows', key)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ColorTokenEditorProps {
  tokens: Record<string, ColorToken>;
  onAdd: (key: string, value: string) => void;
  onUpdate: (key: string, value: string) => void;
  onDelete: (key: string) => void;
}

function ColorTokenEditor({ tokens, onAdd, onUpdate, onDelete }: ColorTokenEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (newKey && newValue) {
      onAdd(newKey, newValue);
      setNewKey('');
      setNewValue('');
      setIsAdding(false);
    }
  };

  const handleEdit = (key: string) => {
    setEditingKey(key);
    setEditValue(tokens[key]?.value || '');
  };

  const handleSaveEdit = () => {
    if (editingKey && editValue) {
      onUpdate(editingKey, editValue);
      setEditingKey(null);
      setEditValue('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold">Color Tokens</h4>
        {!isAdding && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Color
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="flex gap-2 p-3 border rounded-lg bg-muted/50">
          <div className="flex-1">
            <Input
              placeholder="Token name (e.g., primary)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="HSL value (e.g., 240 100% 50%)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <div
            className="w-16 h-16 rounded border flex-shrink-0"
            style={{ backgroundColor: `hsl(${newValue || '0 0% 50%'})` }}
          />
          <div className="flex flex-col gap-1">
            <Button size="sm" onClick={handleAdd}>
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewKey('');
                setNewValue('');
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-2">
        {Object.entries(tokens).map(([key, token]) => (
          <div key={key} className="flex items-center gap-2 p-3 border rounded-lg hover:border-primary/50 transition-colors">
            {editingKey === key ? (
              <>
                <div className="flex-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="HSL value"
                  />
                </div>
                <div
                  className="w-12 h-12 rounded border flex-shrink-0"
                  style={{ backgroundColor: `hsl(${editValue})` }}
                />
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingKey(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <div
                  className="w-12 h-12 rounded border flex-shrink-0"
                  style={{ backgroundColor: `hsl(${token.value})` }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{key}</p>
                  <code className="text-xs text-muted-foreground">{token.value}</code>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(key)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(key)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface DimensionTokenEditorProps {
  label: string;
  tokens: Record<string, DimensionToken>;
  onAdd: (key: string, value: string) => void;
  onUpdate: (key: string, value: string) => void;
  onDelete: (key: string) => void;
}

function DimensionTokenEditor({ label, tokens, onAdd, onUpdate, onDelete }: DimensionTokenEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (newKey && newValue) {
      onAdd(newKey, newValue);
      setNewKey('');
      setNewValue('');
      setIsAdding(false);
    }
  };

  const handleEdit = (key: string) => {
    setEditingKey(key);
    setEditValue(tokens[key]?.value || '');
  };

  const handleSaveEdit = () => {
    if (editingKey && editValue) {
      onUpdate(editingKey, editValue);
      setEditingKey(null);
      setEditValue('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold">{label} Tokens</h4>
        {!isAdding && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add {label}
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="flex gap-2 p-3 border rounded-lg bg-muted/50">
          <div className="flex-1">
            <Input
              placeholder="Token name"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Value (e.g., 16px, 1rem)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Button size="sm" onClick={handleAdd}>
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewKey('');
                setNewValue('');
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-2">
        {Object.entries(tokens).map(([key, token]) => (
          <div key={key} className="flex items-center gap-2 p-3 border rounded-lg hover:border-primary/50 transition-colors">
            {editingKey === key ? (
              <>
                <div className="flex-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Value"
                  />
                </div>
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingKey(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-sm font-medium">{key}</p>
                  <code className="text-xs text-muted-foreground">{token.value}</code>
                </div>
                {label === 'Spacing' && (
                  <div
                    className="h-4 bg-primary rounded flex-shrink-0"
                    style={{ width: token.value }}
                  />
                )}
                {label === 'Border Radius' && (
                  <div
                    className="w-12 h-12 bg-primary flex-shrink-0"
                    style={{ borderRadius: token.value }}
                  />
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(key)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(key)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ShadowTokenEditorProps {
  tokens: Record<string, ShadowToken>;
  onAdd: (key: string, value: string) => void;
  onUpdate: (key: string, value: string) => void;
  onDelete: (key: string) => void;
}

function ShadowTokenEditor({ tokens, onAdd, onUpdate, onDelete }: ShadowTokenEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (newKey && newValue) {
      onAdd(newKey, newValue);
      setNewKey('');
      setNewValue('');
      setIsAdding(false);
    }
  };

  const handleEdit = (key: string) => {
    setEditingKey(key);
    setEditValue(tokens[key]?.value || '');
  };

  const handleSaveEdit = () => {
    if (editingKey && editValue) {
      onUpdate(editingKey, editValue);
      setEditingKey(null);
      setEditValue('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold">Shadow Tokens</h4>
        {!isAdding && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Shadow
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="flex gap-2 p-3 border rounded-lg bg-muted/50">
          <div className="flex-1">
            <Input
              placeholder="Token name (e.g., shadow-md)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Shadow value (e.g., 0 4px 6px rgba(0,0,0,0.1))"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Button size="sm" onClick={handleAdd}>
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewKey('');
                setNewValue('');
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-2">
        {Object.entries(tokens).map(([key, token]) => (
          <div key={key} className="flex items-center gap-2 p-3 border rounded-lg hover:border-primary/50 transition-colors">
            {editingKey === key ? (
              <>
                <div className="flex-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Shadow value"
                  />
                </div>
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingKey(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-sm font-medium">{key}</p>
                  <code className="text-xs text-muted-foreground truncate block">{token.value}</code>
                </div>
                <div
                  className="w-16 h-16 bg-card rounded border flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: token.value }}
                >
                  <span className="text-xs text-muted-foreground">Preview</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(key)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(key)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
