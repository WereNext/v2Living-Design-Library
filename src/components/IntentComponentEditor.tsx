import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Settings2, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { getAllShowcases, getCategoriesForIntent } from "../lib/component-registry";
import type { ComponentCategory } from "../hooks/useIntentManager";

interface IntentComponentEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intentId: string;
  intentLabel: string;
  currentCategories?: ComponentCategory[];
  onSave: (intentId: string, categories: ComponentCategory[]) => void;
}

export function IntentComponentEditor({
  open,
  onOpenChange,
  intentId,
  intentLabel,
  currentCategories,
  onSave,
}: IntentComponentEditorProps) {
  // Get all available showcases from registry
  const allShowcases = useMemo(() => {
    try {
      const showcases = getAllShowcases();
      console.log('[IntentComponentEditor] getAllShowcases returned:', showcases?.length, 'items');
      if (!showcases || showcases.length === 0) {
        console.warn('[IntentComponentEditor] No showcases found in registry');
        return [];
      }
      return showcases
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .map(showcase => ({
          id: showcase.id,
          name: showcase.name,
          icon: showcase.icon,
        }));
    } catch (error) {
      console.error('[IntentComponentEditor] Error getting showcases:', error);
      return [];
    }
  }, []);

  // Get default categories for this intent from the registry
  const defaultCategories = useMemo(() => {
    return getCategoriesForIntent(intentId);
  }, [intentId]);

  // Track selected category IDs
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Initialize selected categories when dialog opens
  useEffect(() => {
    if (open) {
      const categoriesToUse = currentCategories || defaultCategories;
      setSelectedIds(new Set(categoriesToUse.map(c => c.id)));
    }
  }, [open, currentCategories, defaultCategories]);

  const toggleCategory = (categoryId: string) => {
    // Always keep playground selected
    if (categoryId === "playground") return;

    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const resetToDefaults = () => {
    setSelectedIds(new Set(defaultCategories.map(c => c.id)));
    toast.success("Reset to default components");
  };

  const selectAll = () => {
    setSelectedIds(new Set(allShowcases.map(s => s.id)));
  };

  const selectNone = () => {
    // Keep only playground
    setSelectedIds(new Set(["playground"]));
  };

  const handleSave = () => {
    const selectedCategories = allShowcases
      .filter(s => selectedIds.has(s.id))
      .map(s => ({
        id: s.id,
        name: s.name,
        icon: s.icon,
      }));

    // Ensure playground is always first
    const playgroundIndex = selectedCategories.findIndex(c => c.id === "playground");
    if (playgroundIndex > 0) {
      const [playground] = selectedCategories.splice(playgroundIndex, 1);
      selectedCategories.unshift(playground);
    } else if (playgroundIndex === -1) {
      selectedCategories.unshift({ id: "playground", name: "Code Playground", icon: "Code2" });
    }

    onSave(intentId, selectedCategories);
    onOpenChange(false);
    toast.success(`Updated components for "${intentLabel}"`);
  };

  const selectedCount = selectedIds.size;
  const totalCount = allShowcases.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Edit Components for "{intentLabel}"
          </DialogTitle>
          <DialogDescription>
            Choose which component categories appear in the sidebar when this design intent is selected.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {allShowcases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No component showcases found in registry.</p>
              <p className="text-sm mt-2">Check browser console for errors.</p>
            </div>
          ) : (
          <>
          {/* Quick actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={selectNone}>
              Select None
            </Button>
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset to Defaults
            </Button>
          </div>

          {/* Category list - horizontal grid */}
          <ScrollArea className="h-[250px] border rounded-lg p-3">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {allShowcases.map(showcase => {
                const isSelected = selectedIds.has(showcase.id);
                const isPlayground = showcase.id === "playground";
                const isDefault = defaultCategories.some(c => c.id === showcase.id);

                return (
                  <div
                    key={showcase.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                      isSelected ? "bg-primary/5 border-primary/30" : "bg-background border-border/50"
                    }`}
                  >
                    <Checkbox
                      id={showcase.id}
                      checked={isSelected}
                      onCheckedChange={() => toggleCategory(showcase.id)}
                      disabled={isPlayground}
                    />
                    <Label
                      htmlFor={showcase.id}
                      className="flex-1 cursor-pointer text-xs font-medium truncate"
                    >
                      {showcase.name}
                    </Label>
                    {isPlayground && (
                      <Badge variant="secondary" className="text-[9px] px-1">
                        Req
                      </Badge>
                    )}
                    {isDefault && !isPlayground && (
                      <Badge variant="outline" className="text-[9px] px-1">
                        Def
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Selection count */}
          <div className="text-sm text-muted-foreground text-center">
            {selectedCount} of {totalCount} components selected
          </div>
          </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
