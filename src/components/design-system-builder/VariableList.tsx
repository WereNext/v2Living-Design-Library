import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Trash2, Plus } from "lucide-react";
import type { Variable, VariableType } from "./types";
import type { LucideIcon } from "lucide-react";

interface VariableListProps {
  variables: Variable[];
  onUpdate: (id: string, field: 'name' | 'value', value: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  placeholder: string;
  icon: LucideIcon;
  colorPreview?: boolean;
}

export function VariableList({
  variables,
  onUpdate,
  onRemove,
  onAdd,
  placeholder,
  icon: Icon,
  colorPreview = false,
}: VariableListProps) {
  return (
    <div className="space-y-2">
      {variables.map((variable) => (
        <div key={variable.id} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div>
              <Input
                placeholder="Variable name"
                value={variable.name}
                onChange={(e) => onUpdate(variable.id, 'name', e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>
            <div className="flex gap-1">
              {colorPreview && variable.value && (
                <div
                  className="w-9 h-9 rounded border-2 border-border flex-shrink-0"
                  style={{ background: `hsl(${variable.value})` }}
                />
              )}
              <Input
                placeholder={placeholder}
                value={variable.value}
                onChange={(e) => onUpdate(variable.id, 'value', e.target.value)}
                className="h-9 text-xs font-mono flex-1"
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(variable.id)}
            className="h-9 w-9 p-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="w-full"
      >
        <Plus className="w-3.5 h-3.5 mr-2" />
        Add Variable
      </Button>
    </div>
  );
}
