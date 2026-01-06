/**
 * Empty State Onboarding Component
 *
 * Import-first onboarding experience for white-label deployments.
 * Emphasizes importing tokens from Figma/JSON as the primary path,
 * with starter libraries available as fallback examples.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Upload,
  Sparkles,
  FileJson,
  Figma,
  Palette,
  ArrowRight,
  Check,
  Code,
  Layers,
} from 'lucide-react';
import { branding } from '../config';
import { STARTER_DESIGN_SYSTEMS, getDefaultStarterSystem } from '../config';

interface EmptyStateOnboardingProps {
  onImportFigma: () => void;
  onImportJson: () => void;
  onUseStarterLibrary: (systemId: string) => void;
  onSkipToDemo: () => void;
  onClose?: () => void;
}

type OnboardingStep = 'welcome' | 'import-choice' | 'starter-choice';

export function EmptyStateOnboarding({
  onImportFigma,
  onImportJson,
  onUseStarterLibrary,
  onSkipToDemo,
}: EmptyStateOnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [selectedStarter, setSelectedStarter] = useState<string | null>(null);

  const defaultSystem = getDefaultStarterSystem();

  return (
    <div className="fixed inset-0 z-50 bg-background min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-5xl w-full">
        {/* Welcome Step */}
        {step === 'welcome' && (
          <>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">{branding.welcomeMessage}</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Create production-ready design systems from your Figma tokens,
                or start with our pre-built libraries and customize from there.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
              {/* Import Your Own - Primary CTA */}
              <Card
                className="relative overflow-hidden border-2 border-primary hover:border-primary/80 transition-all cursor-pointer group"
                onClick={() => setStep('import-choice')}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
                <CardHeader className="relative pt-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Import Your Design System</CardTitle>
                  <CardDescription className="text-base">
                    Bring your own tokens from Figma or JSON
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      Import from Figma Variables API
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      Upload JSON or CSS tokens
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      Supports Tokens Studio format
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Use Starter Library */}
              <Card
                className="relative overflow-hidden border-2 hover:border-muted-foreground/50 transition-all cursor-pointer group"
                onClick={() => setStep('starter-choice')}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-muted/50 to-transparent rounded-bl-full" />
                <CardHeader className="relative pt-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-muted-foreground/20 to-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Layers className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Start with a Template</CardTitle>
                  <CardDescription className="text-base">
                    Use our pre-built design systems as a starting point
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-muted-foreground" />
                      {STARTER_DESIGN_SYSTEMS.length} ready-to-use design systems
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-muted-foreground" />
                      Multiple themes per system
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-muted-foreground" />
                      Fully customizable
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" size="lg">
                    Browse Templates
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              <button
                onClick={onSkipToDemo}
                className="underline hover:text-foreground transition-colors"
              >
                Skip and explore the demo
              </button>
            </p>
          </>
        )}

        {/* Import Choice Step */}
        {step === 'import-choice' && (
          <>
            <button
              onClick={() => setStep('welcome')}
              className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              ← Back
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">How would you like to import?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Choose your preferred method to bring your design tokens into {branding.appName}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Figma Import */}
              <Card
                className="border-2 hover:border-primary/50 transition-all cursor-pointer group"
                onClick={onImportFigma}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Figma className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Figma Variables</CardTitle>
                  <CardDescription>
                    Connect to Figma and import your variables directly via the API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Connect Figma
                  </Button>
                </CardContent>
              </Card>

              {/* JSON Import */}
              <Card
                className="border-2 hover:border-primary/50 transition-all cursor-pointer group"
                onClick={onImportJson}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileJson className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>JSON / CSS</CardTitle>
                  <CardDescription>
                    Paste or upload a JSON file with your design tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Upload JSON
                  </Button>
                </CardContent>
              </Card>

              {/* Code Export */}
              <Card
                className="border-2 hover:border-primary/50 transition-all cursor-pointer group"
                onClick={onImportJson}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Tokens Studio</CardTitle>
                  <CardDescription>
                    Import from Tokens Studio for Figma (W3C format)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Import Tokens
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Starter Library Choice Step */}
        {step === 'starter-choice' && (
          <>
            <button
              onClick={() => setStep('welcome')}
              className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              ← Back
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Choose a Starter Template</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Select a pre-built design system to start with. You can customize everything later.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
              {STARTER_DESIGN_SYSTEMS.map((system) => (
                <Card
                  key={system.id}
                  className={`border-2 transition-all cursor-pointer ${
                    selectedStarter === system.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-muted-foreground/50'
                  }`}
                  onClick={() => setSelectedStarter(system.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-primary" />
                      </div>
                      {selectedStarter === system.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      {system.isDefault && selectedStarter !== system.id && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{system.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {system.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1.5">
                      {system.themes.map((theme) => (
                        <span
                          key={theme.id}
                          className="text-xs bg-muted px-2 py-0.5 rounded-full"
                        >
                          {theme.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                disabled={!selectedStarter}
                onClick={() => selectedStarter && onUseStarterLibrary(selectedStarter)}
              >
                Use This Template
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
