/**
 * Feature Flags Configuration
 *
 * Controls which features are enabled in the application.
 * For white-label deployments, these can be customized per tenant.
 *
 * Environment variables can override defaults:
 * - VITE_FEATURE_DEMO_MODE
 * - VITE_FEATURE_FIGMA_IMPORT
 * - VITE_FEATURE_AI_GENERATION
 * etc.
 */

export interface FeatureFlags {
  // Onboarding & Empty State
  showDemoSystems: boolean;
  showEmptyStateOnboarding: boolean;
  preloadStarterLibraries: boolean;

  // Import Sources
  enableFigmaImport: boolean;
  enableJsonImport: boolean;
  enableCssImport: boolean;
  enableTokensStudioImport: boolean;

  // Export Formats
  enableCssExport: boolean;
  enableScssExport: boolean;
  enableTailwindExport: boolean;
  enableJsonExport: boolean;
  enableIosExport: boolean;
  enableAndroidExport: boolean;
  enableFigmaTokensExport: boolean;

  // UI Libraries
  enableShadcn: boolean;
  enableMui: boolean;
  enableChakra: boolean;
  enableAntDesign: boolean;
  enableBootstrap: boolean;
  enableCustomComponents: boolean;

  // Advanced Features
  enableAiGeneration: boolean;
  enableMcpServer: boolean;
  enableCloudSync: boolean;
  enableVersionHistory: boolean;
  enableTeamSharing: boolean;

  // Limits (for SaaS tiers)
  maxDesignSystems: number;
  maxThemesPerSystem: number;
  maxCustomComponents: number;
}

/**
 * Default feature flags - all features enabled
 */
export const DEFAULT_FEATURES: FeatureFlags = {
  // Onboarding & Empty State
  showDemoSystems: true,
  showEmptyStateOnboarding: true,
  preloadStarterLibraries: true,

  // Import Sources
  enableFigmaImport: true,
  enableJsonImport: true,
  enableCssImport: true,
  enableTokensStudioImport: true,

  // Export Formats
  enableCssExport: true,
  enableScssExport: true,
  enableTailwindExport: true,
  enableJsonExport: true,
  enableIosExport: true,
  enableAndroidExport: true,
  enableFigmaTokensExport: true,

  // UI Libraries
  enableShadcn: true,
  enableMui: true,
  enableChakra: true,
  enableAntDesign: true,
  enableBootstrap: true,
  enableCustomComponents: true,

  // Advanced Features
  enableAiGeneration: true,
  enableMcpServer: true,
  enableCloudSync: true,
  enableVersionHistory: true,
  enableTeamSharing: false, // Not yet implemented

  // Limits (unlimited for self-hosted)
  maxDesignSystems: Infinity,
  maxThemesPerSystem: Infinity,
  maxCustomComponents: Infinity,
};

/**
 * Parse environment variable as boolean
 */
function envBool(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

/**
 * Parse environment variable as number
 */
function envNum(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Get feature flags with environment variable overrides
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    // Onboarding & Empty State
    showDemoSystems: envBool('VITE_FEATURE_DEMO_MODE', DEFAULT_FEATURES.showDemoSystems),
    showEmptyStateOnboarding: envBool('VITE_FEATURE_EMPTY_STATE_ONBOARDING', DEFAULT_FEATURES.showEmptyStateOnboarding),
    preloadStarterLibraries: envBool('VITE_FEATURE_PRELOAD_STARTERS', DEFAULT_FEATURES.preloadStarterLibraries),

    // Import Sources
    enableFigmaImport: envBool('VITE_FEATURE_FIGMA_IMPORT', DEFAULT_FEATURES.enableFigmaImport),
    enableJsonImport: envBool('VITE_FEATURE_JSON_IMPORT', DEFAULT_FEATURES.enableJsonImport),
    enableCssImport: envBool('VITE_FEATURE_CSS_IMPORT', DEFAULT_FEATURES.enableCssImport),
    enableTokensStudioImport: envBool('VITE_FEATURE_TOKENS_STUDIO', DEFAULT_FEATURES.enableTokensStudioImport),

    // Export Formats
    enableCssExport: envBool('VITE_FEATURE_CSS_EXPORT', DEFAULT_FEATURES.enableCssExport),
    enableScssExport: envBool('VITE_FEATURE_SCSS_EXPORT', DEFAULT_FEATURES.enableScssExport),
    enableTailwindExport: envBool('VITE_FEATURE_TAILWIND_EXPORT', DEFAULT_FEATURES.enableTailwindExport),
    enableJsonExport: envBool('VITE_FEATURE_JSON_EXPORT', DEFAULT_FEATURES.enableJsonExport),
    enableIosExport: envBool('VITE_FEATURE_IOS_EXPORT', DEFAULT_FEATURES.enableIosExport),
    enableAndroidExport: envBool('VITE_FEATURE_ANDROID_EXPORT', DEFAULT_FEATURES.enableAndroidExport),
    enableFigmaTokensExport: envBool('VITE_FEATURE_FIGMA_TOKENS_EXPORT', DEFAULT_FEATURES.enableFigmaTokensExport),

    // UI Libraries
    enableShadcn: envBool('VITE_FEATURE_SHADCN', DEFAULT_FEATURES.enableShadcn),
    enableMui: envBool('VITE_FEATURE_MUI', DEFAULT_FEATURES.enableMui),
    enableChakra: envBool('VITE_FEATURE_CHAKRA', DEFAULT_FEATURES.enableChakra),
    enableAntDesign: envBool('VITE_FEATURE_ANTD', DEFAULT_FEATURES.enableAntDesign),
    enableBootstrap: envBool('VITE_FEATURE_BOOTSTRAP', DEFAULT_FEATURES.enableBootstrap),
    enableCustomComponents: envBool('VITE_FEATURE_CUSTOM_COMPONENTS', DEFAULT_FEATURES.enableCustomComponents),

    // Advanced Features
    enableAiGeneration: envBool('VITE_FEATURE_AI_GENERATION', DEFAULT_FEATURES.enableAiGeneration),
    enableMcpServer: envBool('VITE_FEATURE_MCP_SERVER', DEFAULT_FEATURES.enableMcpServer),
    enableCloudSync: envBool('VITE_FEATURE_CLOUD_SYNC', DEFAULT_FEATURES.enableCloudSync),
    enableVersionHistory: envBool('VITE_FEATURE_VERSION_HISTORY', DEFAULT_FEATURES.enableVersionHistory),
    enableTeamSharing: envBool('VITE_FEATURE_TEAM_SHARING', DEFAULT_FEATURES.enableTeamSharing),

    // Limits
    maxDesignSystems: envNum('VITE_LIMIT_DESIGN_SYSTEMS', DEFAULT_FEATURES.maxDesignSystems),
    maxThemesPerSystem: envNum('VITE_LIMIT_THEMES', DEFAULT_FEATURES.maxThemesPerSystem),
    maxCustomComponents: envNum('VITE_LIMIT_COMPONENTS', DEFAULT_FEATURES.maxCustomComponents),
  };
}

/**
 * Singleton instance of feature flags
 */
export const features = getFeatureFlags();

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const value = features[feature];
  return typeof value === 'boolean' ? value : value > 0;
}
