// Refactored QuickStartWizard - Original: 874 LOC -> Now: ~200 LOC
// Split into:
// - wizard-steps/*.tsx - Individual step components
// - lib/wizard-templates.ts - Template definitions
// - lib/wizard-token-parser.ts - JSON parsing logic

import { useState } from 'react';
import { X, Sparkles, Upload, Code, Check, ArrowRight, ArrowLeft, Eye } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { toast } from 'sonner';
import type { DesignTokens } from '../types/design-tokens';
import {
  WIZARD_TEMPLATES,
  DEFAULT_MANUAL_TOKENS,
  createSystemNameFromTemplate,
  createSystemDescriptionFromTemplate,
} from '../lib/wizard-templates';
import { parseJsonToTokens } from '../lib/wizard-token-parser';
import {
  WizardStepWelcome,
  WizardStepMethod,
  WizardStepTokens,
  WizardStepPreview,
  WizardStepSave,
} from './wizard-steps';
import { UILibrary, UI_LIBRARIES } from '../lib/constants';

interface QuickStartWizardProps {
  onClose: () => void;
}

type UploadMethod = 'upload' | 'manual' | 'template';
type PreviewMode = 'tokens' | 'visual' | 'edit';

const WIZARD_STEPS = [
  {
    title: 'Welcome to Your Design System Builder',
    icon: Sparkles,
    description: 'Create a custom design system in minutes',
  },
  {
    title: 'Choose Your Starting Point',
    icon: Upload,
    description: 'Upload tokens, start from scratch, or use a template',
  },
  {
    title: 'Configure Your Tokens',
    icon: Code,
    description: 'Review and customize your design tokens',
  },
  {
    title: 'Preview Your System',
    icon: Eye,
    description: 'See how your tokens look in action',
  },
  {
    title: 'Name & Save',
    icon: Check,
    description: 'Give your design system a name',
  },
];

export function QuickStartWizard({ onClose }: QuickStartWizardProps) {
  const [step, setStep] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('template');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [systemName, setSystemName] = useState('');
  const [systemDescription, setSystemDescription] = useState('');
  const [parsedTokens, setParsedTokens] = useState<DesignTokens | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('visual');
  const [uiLibrary, setUILibrary] = useState<UILibrary>(UI_LIBRARIES.SHADCN);

  const { addDesignSystem } = useAppState();

  const currentStep = WIZARD_STEPS[step];
  const Icon = currentStep.icon;
  const isLastStep = step === WIZARD_STEPS.length - 1;

  const handleJsonParse = () => {
    const result = parseJsonToTokens(jsonInput);

    if (result.success && result.tokens) {
      setParsedTokens(result.tokens);
      setJsonError('');
      toast.success('Tokens parsed successfully!');
      setTimeout(() => setStep(2), 500);
    } else {
      setJsonError(result.error || 'Invalid JSON format');
      toast.error('Failed to parse JSON');
    }
  };

  const handleSelectTemplate = (templateKey: string) => {
    setParsedTokens(WIZARD_TEMPLATES[templateKey]);
    setSystemName(createSystemNameFromTemplate(templateKey));
    setSystemDescription(createSystemDescriptionFromTemplate(templateKey));
    toast.success(`${templateKey} template selected!`);
    setTimeout(() => setStep(2), 500);
  };

  const handleContinueManual = () => {
    setParsedTokens(DEFAULT_MANUAL_TOKENS);
    setStep(2);
  };

  const handleSaveSystem = () => {
    if (!systemName.trim()) {
      toast.error('Please enter a system name');
      return;
    }

    if (!parsedTokens) {
      toast.error('No tokens to save');
      return;
    }

    const theme = {
      id: `${systemName.toLowerCase().replace(/\s+/g, '-')}-default`,
      name: 'Default Theme',
      description: 'Default theme for this design system',
      colors: parsedTokens.colors || {},
      typography: parsedTokens.typography || {},
      spacing: parsedTokens.spacing || {},
      borderRadius: parsedTokens.borderRadius || {},
      shadows: parsedTokens.shadows || {},
    };

    const newSystem = {
      id: systemName.toLowerCase().replace(/\s+/g, '-'),
      name: systemName,
      description: systemDescription,
      uiLibrary,
      themes: [theme],
      activeThemeId: theme.id,
      intents: [
        { value: 'web-app', label: 'Web App' },
        { value: 'mobile', label: 'Mobile Experience' },
      ],
    };

    addDesignSystem(newSystem);
    toast.success(
      `${systemName} created successfully! Switch to it from the Design System selector.`
    );
    onClose();
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSaveSystem();
    } else if (step === 1 && !parsedTokens) {
      toast.error('Please select a template, upload JSON, or continue manually');
    } else {
      setStep(step + 1);
    }
  };

  const canProceed = step !== 1 || parsedTokens !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{currentStep.title}</h2>
              <p className="text-sm text-muted-foreground">
                {currentStep.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / WIZARD_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 0 && <WizardStepWelcome />}

          {step === 1 && (
            <WizardStepMethod
              uploadMethod={uploadMethod}
              onUploadMethodChange={setUploadMethod}
              jsonInput={jsonInput}
              onJsonInputChange={setJsonInput}
              jsonError={jsonError}
              onJsonParse={handleJsonParse}
              onSelectTemplate={handleSelectTemplate}
              onContinueManual={handleContinueManual}
            />
          )}

          {step === 2 && parsedTokens && (
            <WizardStepTokens
              tokens={parsedTokens}
              previewMode={previewMode}
              onPreviewModeChange={setPreviewMode}
              onTokensChange={setParsedTokens}
            />
          )}

          {step === 3 && parsedTokens && (
            <WizardStepPreview tokens={parsedTokens} />
          )}

          {step === 4 && (
            <WizardStepSave
              systemName={systemName}
              onSystemNameChange={setSystemName}
              systemDescription={systemDescription}
              onSystemDescriptionChange={setSystemDescription}
              tokens={parsedTokens}
              uiLibrary={uiLibrary}
              onUILibraryChange={setUILibrary}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 rounded-lg border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-2">
            {WIZARD_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step
                    ? 'bg-primary'
                    : i < step
                      ? 'bg-primary/50'
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastStep ? (
              <>
                <Check className="w-4 h-4" />
                Create System
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
