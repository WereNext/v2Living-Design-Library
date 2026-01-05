import { Sparkles, Upload, Wand2, Edit3, FileJson } from 'lucide-react';

export function WizardStepWelcome() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl mb-3">Let's Build Your Design System</h3>
        <p className="text-muted-foreground">
          This wizard will guide you through creating a custom design system with your own tokens.
          You can upload Figma variables, start from a template, or build from scratch.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="p-6 rounded-lg border bg-card hover:border-primary/50 transition-all">
          <Upload className="w-8 h-8 text-primary mb-3" />
          <h4 className="font-semibold mb-2">Upload Figma JSON</h4>
          <p className="text-sm text-muted-foreground">
            Import design tokens directly from your Figma variables export
          </p>
        </div>

        <div className="p-6 rounded-lg border bg-card hover:border-primary/50 transition-all">
          <Wand2 className="w-8 h-8 text-primary mb-3" />
          <h4 className="font-semibold mb-2">Start from Template</h4>
          <p className="text-sm text-muted-foreground">
            Choose a pre-configured template and customize it to your needs
          </p>
        </div>

        <div className="p-6 rounded-lg border bg-card hover:border-primary/50 transition-all">
          <Edit3 className="w-8 h-8 text-primary mb-3" />
          <h4 className="font-semibold mb-2">Build from Scratch</h4>
          <p className="text-sm text-muted-foreground">
            Manually define every token for complete control over your system
          </p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 mt-6">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <FileJson className="w-4 h-4" />
          What You'll Create
        </h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Color tokens (primary, secondary, backgrounds, etc.)</li>
          <li>• Typography scales and font definitions</li>
          <li>• Spacing system for consistent layouts</li>
          <li>• Border radius values for shapes</li>
          <li>• Shadow definitions for depth</li>
        </ul>
      </div>
    </div>
  );
}
