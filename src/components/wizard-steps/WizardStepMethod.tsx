import { Upload, Wand2, Edit3, FileJson, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { WIZARD_TEMPLATES } from '../../lib/wizard-templates';
import type { DesignTokens } from '../../types/design-tokens';

type UploadMethod = 'upload' | 'manual' | 'template';

interface WizardStepMethodProps {
  uploadMethod: UploadMethod;
  onUploadMethodChange: (method: UploadMethod) => void;
  jsonInput: string;
  onJsonInputChange: (value: string) => void;
  jsonError: string;
  onJsonParse: () => void;
  onSelectTemplate: (templateKey: string) => void;
  onContinueManual: () => void;
}

export function WizardStepMethod({
  uploadMethod,
  onUploadMethodChange,
  jsonInput,
  onJsonInputChange,
  jsonError,
  onJsonParse,
  onSelectTemplate,
  onContinueManual,
}: WizardStepMethodProps) {
  return (
    <div className="space-y-6">
      <Tabs
        value={uploadMethod}
        onValueChange={(v) => onUploadMethodChange(v as UploadMethod)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="template">
            <Wand2 className="w-4 h-4 mr-2" />
            Template
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            Upload JSON
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Edit3 className="w-4 h-4 mr-2" />
            Manual
          </TabsTrigger>
        </TabsList>

        {/* Template Selection */}
        <TabsContent value="template" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(WIZARD_TEMPLATES).map(([key, tokens]) => (
              <button
                key={key}
                onClick={() => onSelectTemplate(key)}
                className="p-6 rounded-lg border-2 border-border hover:border-primary transition-all text-left group"
              >
                <h4 className="font-semibold mb-3 capitalize">{key}</h4>
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {Object.entries(tokens.colors || {})
                      .slice(0, 5)
                      .map(([name, value]) => (
                        <div
                          key={name}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: `hsl(${value})` }}
                          title={name}
                        />
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Object.keys(tokens.colors || {}).length} colors •{' '}
                    {Object.keys(tokens.spacing || {}).length} spacing •{' '}
                    {Object.keys(tokens.borderRadius || {}).length} radius
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </TabsContent>

        {/* JSON Upload */}
        <TabsContent value="upload" className="space-y-4 mt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="json-input" className="mb-2 block">
                Paste Your Figma Variables JSON
              </Label>
              <Textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => onJsonInputChange(e.target.value)}
                placeholder={`{\n  "colors": {\n    "primary": "240 100% 50%",\n    "background": "0 0% 100%"\n  },\n  "spacing": {\n    "space-sm": "8px"\n  }\n}`}
                className="font-mono text-sm min-h-[300px]"
              />
              {jsonError && (
                <p className="text-sm text-destructive mt-2">{jsonError}</p>
              )}
            </div>

            <Button onClick={onJsonParse} className="w-full">
              <FileJson className="w-4 h-4 mr-2" />
              Parse & Preview Tokens
            </Button>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">Expected Format:</h4>
              <pre className="text-xs bg-background rounded p-3 overflow-x-auto">
                {`{
  "colors": {
    "primary": "240 100% 50%",
    "background": "0 0% 100%"
  },
  "spacing": {
    "space-sm": "8px",
    "space-md": "16px"
  },
  "borderRadius": {
    "radius-sm": "4px"
  }
}`}
              </pre>
            </div>
          </div>
        </TabsContent>

        {/* Manual Creation */}
        <TabsContent value="manual" className="space-y-4 mt-6">
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Manual token creation will be available in the next step. For now,
                we recommend starting with a template and customizing it.
              </p>
            </div>
            <Button onClick={onContinueManual} className="w-full">
              Continue with Basic Tokens
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
