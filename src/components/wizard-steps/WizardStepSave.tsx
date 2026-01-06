import { Check } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { DesignTokens } from '../../types/design-tokens';
import { getTokenSummary } from '../../lib/wizard-token-parser';
import { UI_LIBRARIES, UI_LIBRARY_LABELS, UILibrary } from '../../lib/constants';

interface WizardStepSaveProps {
  systemName: string;
  onSystemNameChange: (name: string) => void;
  systemDescription: string;
  onSystemDescriptionChange: (description: string) => void;
  tokens: DesignTokens | null;
  uiLibrary: UILibrary;
  onUILibraryChange: (library: UILibrary) => void;
}

export function WizardStepSave({
  systemName,
  onSystemNameChange,
  systemDescription,
  onSystemDescriptionChange,
  tokens,
  uiLibrary,
  onUILibraryChange,
}: WizardStepSaveProps) {
  const summary = tokens ? getTokenSummary(tokens) : null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <Label htmlFor="system-name">Design System Name *</Label>
          <Input
            id="system-name"
            value={systemName}
            onChange={(e) => onSystemNameChange(e.target.value)}
            placeholder="My Design System"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="system-description">Description (Optional)</Label>
          <Textarea
            id="system-description"
            value={systemDescription}
            onChange={(e) => onSystemDescriptionChange(e.target.value)}
            placeholder="A modern design system for..."
            className="mt-2"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="ui-library">UI Component Library</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">
            Choose which component library to use with this design system
          </p>
          <Select value={uiLibrary} onValueChange={(value) => onUILibraryChange(value as UILibrary)}>
            <SelectTrigger id="ui-library" className="mt-1">
              <SelectValue placeholder="Select a library" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(UI_LIBRARIES).map(([key, value]) => (
                <SelectItem key={value} value={value}>
                  <div className="flex flex-col">
                    <span>{UI_LIBRARY_LABELS[value]}</span>
                    {value === 'custom' && (
                      <span className="text-xs text-muted-foreground">Use your imported components</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border">
        <h4 className="font-semibold mb-3">What's Next?</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>Your design system will be saved to your library</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>Switch to it using the Design System selector in the sidebar</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>Export components to any framework with your tokens</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>Edit tokens anytime in the Design System Builder</span>
          </li>
        </ul>
      </div>

      {summary && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2">Token Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Colors:</span>
              <span className="ml-2 font-medium">{summary.colors}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Spacing:</span>
              <span className="ml-2 font-medium">{summary.spacing}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Radius:</span>
              <span className="ml-2 font-medium">{summary.borderRadius}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Shadows:</span>
              <span className="ml-2 font-medium">{summary.shadows}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
