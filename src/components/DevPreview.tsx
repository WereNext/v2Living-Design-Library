/**
 * Dev Preview Component
 *
 * Renders components in isolation for development/testing.
 * Access via URL hash: #dev/onboarding, #dev/wizard, #dev/decision-gate
 *
 * This bypasses all localStorage checks and renders components directly.
 */

import { useState } from 'react';
import { EmptyStateOnboarding } from './EmptyStateOnboarding';
import { DecisionGate } from './DecisionGate';
import { QuickStartWizard } from './QuickStartWizard';
import { Button } from './ui/button';
import { X, Eye, Layers, Wand2, Package, CheckCircle } from 'lucide-react';
import { useEmptyStateInit } from '../hooks/useEmptyStateInit';
import { useAppState } from '../contexts/AppStateContext';
import { toast } from 'sonner';
import { STARTER_DESIGN_SYSTEMS } from '../config';

type PreviewComponent = 'onboarding' | 'decision-gate' | 'wizard' | 'success' | null;

interface DevPreviewProps {
  initialComponent?: PreviewComponent;
  onClose?: () => void;
}

export function DevPreview({ initialComponent, onClose }: DevPreviewProps) {
  const [activeComponent, setActiveComponent] = useState<PreviewComponent>(initialComponent || null);
  const [selectedSystemName, setSelectedSystemName] = useState<string>('');

  // Use actual app state for functional preview
  const { initializeStarterSystems } = useEmptyStateInit();
  const { applySystem, designSystems, activeSystemId } = useAppState();

  // Functional handlers that actually work
  const handleUseStarterLibrary = (systemId: string) => {
    console.log('[DevPreview] Using starter library:', systemId);

    // Get system name from config (since state might not be updated yet)
    const starterSystem = STARTER_DESIGN_SYSTEMS.find(s => s.id === systemId);
    const systemName = starterSystem?.name || systemId;

    // Initialize and apply the system
    initializeStarterSystems(systemId);

    // Use setTimeout to allow state to update before applying
    setTimeout(() => {
      const success = applySystem(systemId);
      console.log('[DevPreview] Applied system:', systemId, 'success:', success);

      setSelectedSystemName(systemName);
      setActiveComponent('success');
      toast.success(`${systemName} loaded successfully!`);
    }, 150);
  };

  const handleSkipToDemo = () => {
    console.log('[DevPreview] Skipping to demo');
    initializeStarterSystems();
    setActiveComponent('success');
    setSelectedSystemName('Demo Mode');
    toast.success('Welcome! Explore the demo components.');
  };

  const handleImportFigma = () => {
    console.log('[DevPreview] Import Figma triggered');
    toast.info('Figma import would open here');
    setActiveComponent(null);
  };

  const handleImportJson = () => {
    console.log('[DevPreview] Import JSON triggered');
    setActiveComponent('wizard');
  };

  // No-op handlers for decision gate (not implementing full flow)
  const noop = () => console.log('[DevPreview] Action triggered');

  // Component selector
  if (!activeComponent) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col">
        {/* Header */}
        <div className="border-b bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Eye className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h1 className="font-semibold">Dev Preview</h1>
              <p className="text-xs text-muted-foreground">Component isolation mode</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Exit Dev Mode
            </Button>
          )}
        </div>

        {/* Component Grid */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Select a component to preview</h2>
            <p className="text-muted-foreground mb-8">
              These render in complete isolation - no localStorage, no cookies, no state interference.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveComponent('onboarding')}
                className="p-6 rounded-xl border-2 hover:border-primary/50 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Empty State Onboarding</h3>
                <p className="text-sm text-muted-foreground">
                  New import-first onboarding flow
                </p>
              </button>

              <button
                onClick={() => setActiveComponent('decision-gate')}
                className="p-6 rounded-xl border-2 hover:border-primary/50 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-1">Decision Gate</h3>
                <p className="text-sm text-muted-foreground">
                  Original welcome screen
                </p>
              </button>

              <button
                onClick={() => setActiveComponent('wizard')}
                className="p-6 rounded-xl border-2 hover:border-primary/50 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-1">Quick Start Wizard</h3>
                <p className="text-sm text-muted-foreground">
                  Design system creation wizard
                </p>
              </button>
            </div>

            <div className="mt-8 p-4 rounded-lg bg-muted/50 text-sm">
              <p className="font-medium mb-1">Tip: Direct access URLs</p>
              <ul className="text-muted-foreground space-y-1">
                <li><code className="bg-muted px-1 rounded">#dev</code> - This selector</li>
                <li><code className="bg-muted px-1 rounded">#dev/onboarding</code> - Empty State Onboarding</li>
                <li><code className="bg-muted px-1 rounded">#dev/decision-gate</code> - Decision Gate</li>
                <li><code className="bg-muted px-1 rounded">#dev/wizard</code> - Quick Start Wizard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success screen after selecting a starter
  if (activeComponent === 'success') {
    return (
      <div className="fixed inset-0 z-[100] bg-background">
        <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '32rem', padding: '2rem' }}>
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Design System Loaded!</h1>
            <p className="text-muted-foreground mb-2">
              <strong>{selectedSystemName}</strong> has been applied successfully.
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              Active system ID: <code className="bg-muted px-2 py-0.5 rounded">{activeSystemId}</code>
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setActiveComponent('onboarding')} variant="outline">
                ← Back to Onboarding
              </Button>
              <Button onClick={() => setActiveComponent(null)}>
                Go to Selector
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="secondary">
                  Exit Dev Mode
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render selected component
  return (
    <div className="fixed inset-0 z-[100]">
      {/* Floating back button */}
      <button
        onClick={() => setActiveComponent(null)}
        className="fixed top-4 left-4 z-[200] px-3 py-2 rounded-lg bg-card border shadow-lg hover:bg-muted transition-colors flex items-center gap-2 text-sm"
      >
        ← Back to selector
      </button>

      {/* Component render */}
      {activeComponent === 'onboarding' && (
        <EmptyStateOnboarding
          onImportFigma={handleImportFigma}
          onImportJson={handleImportJson}
          onUseStarterLibrary={handleUseStarterLibrary}
          onSkipToDemo={handleSkipToDemo}
          onClose={() => setActiveComponent(null)}
        />
      )}

      {activeComponent === 'decision-gate' && (
        <DecisionGate
          onViewDemo={noop}
          onImportSystem={noop}
          onImportComponent={noop}
          onClose={noop}
        />
      )}

      {activeComponent === 'wizard' && (
        <QuickStartWizard onClose={() => setActiveComponent(null)} />
      )}
    </div>
  );
}

/**
 * Parse the URL hash to determine which dev component to show
 */
export function parseDevHash(): PreviewComponent | 'selector' | null {
  const hash = window.location.hash;

  if (hash === '#dev' || hash === '#dev/') {
    return 'selector';
  }
  if (hash === '#dev/onboarding') {
    return 'onboarding';
  }
  if (hash === '#dev/decision-gate') {
    return 'decision-gate';
  }
  if (hash === '#dev/wizard') {
    return 'wizard';
  }

  return null;
}
