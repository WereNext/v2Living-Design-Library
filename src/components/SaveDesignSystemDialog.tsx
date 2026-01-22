import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface SaveDesignSystemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; description?: string; applyImmediately?: boolean }) => void;
  tokenCounts?: {
    colors: number;
    spacing: number;
    typography: number;
    borderRadius: number;
    shadows: number;
  };
  data?: {
    colorTheme?: string;
    fontFamily?: string;
    visualFeel?: string;
  };
}

export function SaveDesignSystemDialog({ 
  open, 
  onOpenChange, 
  onSave,
  tokenCounts,
  data
}: SaveDesignSystemDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [applyImmediately, setApplyImmediately] = useState(true);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter a name for your design system");
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      applyImmediately
    });

    // Reset form
    setName("");
    setDescription("");
    setApplyImmediately(true);
  };

  const totalTokens = tokenCounts ? Object.values(tokenCounts).reduce((sum, count) => sum + count, 0) : 0;
  const isThemeCustomizer = Boolean(data);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Design System
          </DialogTitle>
          <DialogDescription>
            Give your design system a name and optional description
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Your system has <strong>{totalTokens} tokens</strong> across {' '}
              {tokenCounts?.colors} colors, {tokenCounts?.spacing} spacing, {' '}
              {tokenCounts?.typography} typography, {tokenCounts?.borderRadius} radius, {' '}
              and {tokenCounts?.shadows} shadow variables.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="system-name">System Name *</Label>
            <Input
              id="system-name"
              placeholder="e.g., Brand Design System, Dark Theme, Mobile App"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleSave();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="system-description">Description (Optional)</Label>
            <Textarea
              id="system-description"
              placeholder="Describe what this design system is for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="apply-immediately"
              checked={applyImmediately}
              onChange={(e) => setApplyImmediately(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label htmlFor="apply-immediately" className="text-sm cursor-pointer">
              Apply this design system immediately after saving
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save System
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}