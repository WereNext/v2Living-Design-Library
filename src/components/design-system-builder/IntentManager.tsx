import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import type { DesignIntent } from "./types";
import { PREDEFINED_INTENTS, QUICK_INTENTS } from "./types";

interface IntentManagerProps {
  intents: DesignIntent[];
  onIntentsChange: (intents: DesignIntent[]) => void;
}

export function IntentManager({ intents, onIntentsChange }: IntentManagerProps) {
  const addIntent = () => {
    const newId = `custom-${Date.now()}`;
    onIntentsChange([...intents, { value: newId, label: 'New Category' }]);
  };

  const removeIntent = (id: string) => {
    if (intents.length === 1) {
      toast.error("You must have at least one design intent");
      return;
    }
    onIntentsChange(intents.filter((intent) => intent.value !== id));
  };

  const updateIntentName = (id: string, name: string) => {
    onIntentsChange(
      intents.map((intent) =>
        intent.value === id ? { ...intent, label: name } : intent
      )
    );
  };

  const updateIntentValue = (oldValue: string, newValue: string) => {
    const found = PREDEFINED_INTENTS.find((i) => i.value === newValue);
    if (found) {
      onIntentsChange(
        intents.map((i) => (i.value === oldValue ? found : i))
      );
    }
  };

  const addQuickIntent = (template: DesignIntent) => {
    if (!intents.find((i) => i.value === template.value)) {
      onIntentsChange([...intents, template]);
      toast.success(`${template.label} category added!`);
    } else {
      toast.info(`${template.label} already added`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">
          Component Categories (Design Intents)
        </Label>
        <Badge variant="secondary">{intents.length} categories</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Choose which component categories this design system supports.
      </p>

      {/* Quick Intent Templates */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK_INTENTS.map((template) => (
          <Button
            key={template.value}
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => addQuickIntent(template)}
          >
            <Plus className="w-3 h-3 mr-1" />
            {template.label}
          </Button>
        ))}
      </div>

      {/* Intent List */}
      <div className="space-y-2">
        {intents.map((intent, index) => {
          const isCustomIntent = intent.value.startsWith('custom-');

          return (
            <div key={intent.value} className="flex gap-2 items-center">
              <Badge variant="outline" className="text-xs">
                {index + 1}
              </Badge>

              {isCustomIntent ? (
                <Input
                  placeholder="Custom category name..."
                  value={intent.label}
                  onChange={(e) => updateIntentName(intent.value, e.target.value)}
                  className="h-8 flex-1"
                />
              ) : (
                <Select
                  value={intent.value}
                  onValueChange={(newValue) =>
                    updateIntentValue(intent.value, newValue)
                  }
                >
                  <SelectTrigger className="h-8 flex-1">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_INTENTS.map((predefined) => (
                      <SelectItem key={predefined.value} value={predefined.value}>
                        {predefined.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {isCustomIntent && (
                <Badge variant="secondary" className="text-xs">
                  Custom
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeIntent(intent.value)}
                disabled={intents.length === 1}
                className="h-8 w-8 p-0"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          );
        })}
        <Button variant="outline" size="sm" onClick={addIntent} className="w-full">
          <Plus className="w-3.5 h-3.5 mr-2" />
          Add Custom Category
        </Button>
      </div>
    </div>
  );
}
