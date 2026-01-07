/**
 * Empty State Initialization Hook
 *
 * Handles the initialization of a fresh/empty state instance:
 * - Loads starter design systems if no systems exist
 * - Sets up default preferences
 * - Manages first-visit experience
 */

import { useEffect, useCallback, useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import {
  STARTER_DESIGN_SYSTEMS,
  EMPTY_STATE_CONFIG,
  getDefaultStarterSystem,
} from '../config';
import { STORAGE_KEYS } from '../lib/constants';

interface EmptyStateInitResult {
  isInitialized: boolean;
  isFirstVisit: boolean;
  hasStarterSystems: boolean;
  initializeStarterSystems: (applySystemId?: string) => void;
  resetToEmptyState: () => void;
}

/**
 * Hook to manage empty state initialization
 */
export function useEmptyStateInit(): EmptyStateInitResult {
  const { designSystems, addDesignSystem, applySystem } = useAppState();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // Check if this is a first visit
  useEffect(() => {
    const hasSeenApp = localStorage.getItem(STORAGE_KEYS.DESIGN_SYSTEMS_INITIALIZED);
    setIsFirstVisit(!hasSeenApp);
    setIsInitialized(true);
  }, []);

  // Check if starter systems are loaded
  const hasStarterSystems = designSystems.some(
    (system) => STARTER_DESIGN_SYSTEMS.some((starter) => starter.id === system.id)
  );

  /**
   * Initialize the app with starter design systems
   * @param applySystemId - Optional system ID to set as active (defaults to the default starter)
   */
  const initializeStarterSystems = useCallback((applySystemId?: string) => {
    if (!EMPTY_STATE_CONFIG.preloadDemoSystems) {
      return;
    }

    // Convert starter systems to the app's design system format
    STARTER_DESIGN_SYSTEMS.forEach((starterSystem) => {
      // Check if system already exists
      const exists = designSystems.some((ds) => ds.id === starterSystem.id);
      if (exists) return;

      // Convert themes to app format
      const themes = starterSystem.themes.map((theme) => ({
        id: theme.id,
        name: theme.name,
        description: `${theme.mode.charAt(0).toUpperCase() + theme.mode.slice(1)} theme for ${starterSystem.name}`,
        colors: theme.colors,
        typography: theme.typography,
        spacing: theme.spacing,
        borderRadius: theme.radius,
        shadows: {},
      }));

      // Convert intents to app format
      const intents = starterSystem.intents.map((intentId) => ({
        value: intentId,
        label: intentId
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      }));

      // Create the design system
      const newSystem = {
        id: starterSystem.id,
        name: starterSystem.name,
        description: starterSystem.description,
        uiLibrary: starterSystem.uiLibrary,
        themes,
        activeThemeId: themes[0]?.id,
        intents,
      };

      addDesignSystem(newSystem);
    });

    // Set the specified system as active, or fall back to default
    const targetSystemId = applySystemId || getDefaultStarterSystem().id;
    applySystem(targetSystemId);

    // Mark as initialized
    localStorage.setItem(STORAGE_KEYS.DESIGN_SYSTEMS_INITIALIZED, 'true');
  }, [designSystems, addDesignSystem, applySystem]);

  /**
   * Reset to a clean empty state (for testing or white-label setup)
   */
  const resetToEmptyState = useCallback(() => {
    // Clear all localStorage data
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    // Reload the page to reset React state
    window.location.reload();
  }, []);

  return {
    isInitialized,
    isFirstVisit,
    hasStarterSystems,
    initializeStarterSystems,
    resetToEmptyState,
  };
}

/**
 * Check if the app should show the empty state experience
 */
export function shouldShowEmptyState(): boolean {
  const hasSeenDecisionGate = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_DECISION_GATE);
  const designSystems = localStorage.getItem(STORAGE_KEYS.DESIGN_SYSTEMS);

  // Show empty state if user hasn't seen decision gate and has no custom systems
  if (!hasSeenDecisionGate) {
    return true;
  }

  // Check if only starter systems exist (no custom work)
  if (designSystems) {
    try {
      const systems = JSON.parse(designSystems);
      const starterIds = STARTER_DESIGN_SYSTEMS.map((s) => s.id);
      const hasOnlyStarters = systems.every((s: { id: string }) => starterIds.includes(s.id));
      return systems.length === 0 || hasOnlyStarters;
    } catch {
      return true;
    }
  }

  return true;
}
