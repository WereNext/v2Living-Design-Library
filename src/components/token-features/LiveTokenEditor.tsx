import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Edit3, RotateCcw, Save, Eye, Code2 } from "lucide-react";
import { Theme } from "../../hooks/useDesignSystems";
import { useTokenEditor } from "../../contexts/TokenEditorContext";
import { toast } from "sonner@2.0.3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface LiveTokenEditorProps {
  theme: Theme;
}

export function LiveTokenEditor({ theme }: LiveTokenEditorProps) {
  const { 
    isEditing, 
    setIsEditing, 
    updateToken, 
    resetToken, 
    resetAllTokens, 
    getTokenValue,
    hasChanges,
    changes
  } = useTokenEditor();

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      toast.success("Edit mode disabled");
    } else {
      toast.success("Edit mode enabled - Click any token to edit");
    }
  };

  const handleResetAll = () => {
    resetAllTokens();
    toast.success("All changes reset");
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Live Token Editor
          </CardTitle>
          <CardDescription>
            Edit design tokens in real-time and see changes instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleToggleEdit}
              variant={isEditing ? "default" : "outline"}
              className="flex-1"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? "Editing Mode Active" : "Enable Edit Mode"}
            </Button>
            <Button 
              onClick={handleResetAll}
              variant="destructive"
              disabled={!hasChanges}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>

          {hasChanges && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium mb-2">
                {changes.length} change{changes.length !== 1 ? "s" : ""} made
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {changes.filter((c, i, arr) => arr.findIndex(x => x.path === c.path) === i).length} tokens modified
                </Badge>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <p className="font-medium mb-1">💡 How to edit:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Click on any token value below to edit it</li>
                <li>Changes are applied instantly across all components</li>
                <li>Use the Preview tab to see changes in real components</li>
                <li>Export your changes when done</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Token Editing Interface */}
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="mt-4">
          {theme.colors && (
            <TokenCategory
              category="colors"
              tokens={theme.colors}
              theme={theme}
              isEditing={isEditing}
            />
          )}
        </TabsContent>

        <TabsContent value="spacing" className="mt-4">
          {theme.spacing && (
            <TokenCategory
              category="spacing"
              tokens={theme.spacing}
              theme={theme}
              isEditing={isEditing}
            />
          )}
        </TabsContent>

        <TabsContent value="typography" className="mt-4">
          {theme.typography && (
            <TokenCategory
              category="typography"
              tokens={theme.typography}
              theme={theme}
              isEditing={isEditing}
            />
          )}
        </TabsContent>

        <TabsContent value="other" className="mt-4">
          <div className="space-y-4">
            {theme.borderRadius && (
              <TokenCategory
                category="borderRadius"
                tokens={theme.borderRadius}
                theme={theme}
                isEditing={isEditing}
              />
            )}
            {theme.shadows && (
              <TokenCategory
                category="shadows"
                tokens={theme.shadows}
                theme={theme}
                isEditing={isEditing}
              />
            )}
            {theme.opacity && (
              <TokenCategory
                category="opacity"
                tokens={theme.opacity}
                theme={theme}
                isEditing={isEditing}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TokenCategoryProps {
  category: string;
  tokens: Record<string, any>;
  theme: Theme;
  isEditing: boolean;
}

function TokenCategory({ category, tokens, theme, isEditing }: TokenCategoryProps) {
  const { updateToken, getTokenValue, resetToken, editedTokens } = useTokenEditor();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(tokens).map(([key, originalValue]) => {
            const path = `${category}.${key}`;
            const currentValue = getTokenValue(path, theme);
            const isModified = editedTokens.has(path);

            return (
              <EditableToken
                key={key}
                tokenKey={key}
                path={path}
                value={currentValue}
                originalValue={String(originalValue)}
                isEditing={isEditing}
                isModified={isModified}
                category={category}
                onUpdate={(newValue) => updateToken(path, String(originalValue), newValue)}
                onReset={() => resetToken(path)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface EditableTokenProps {
  tokenKey: string;
  path: string;
  value: string;
  originalValue: string;
  isEditing: boolean;
  isModified: boolean;
  category: string;
  onUpdate: (value: string) => void;
  onReset: () => void;
}

function EditableToken({ 
  tokenKey, 
  path, 
  value, 
  originalValue, 
  isEditing, 
  isModified,
  category,
  onUpdate, 
  onReset 
}: EditableTokenProps) {
  const [isEditingThis, setIsEditingThis] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onUpdate(editValue);
    setIsEditingThis(false);
    toast.success(`Updated ${tokenKey}`);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditingThis(false);
  };

  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg bg-card hover:bg-accent/30 transition-colors">
      {/* Color Preview */}
      {category === "colors" && (
        <div
          className="w-10 h-10 rounded border flex-shrink-0"
          style={{ background: value.startsWith("hsl") ? value : `hsl(${value})` }}
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium font-mono truncate">{tokenKey}</p>
          {isModified && (
            <Badge variant="secondary" className="text-xs">Modified</Badge>
          )}
        </div>

        {isEditingThis ? (
          <div className="flex items-center gap-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 text-xs font-mono"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <Button size="sm" onClick={handleSave} className="h-8">
              <Save className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8">
              Cancel
            </Button>
          </div>
        ) : (
          <p className="text-xs font-mono text-muted-foreground truncate">
            {value}
          </p>
        )}
      </div>

      {isEditing && !isEditingThis && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditValue(value);
            setIsEditingThis(true);
          }}
        >
          <Edit3 className="w-4 h-4" />
        </Button>
      )}

      {isModified && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onReset}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
