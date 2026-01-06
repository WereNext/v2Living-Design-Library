/**
 * Configuration Module Index
 *
 * Central export point for all application configuration.
 * Import from '@/config' for all configuration needs.
 */

// Branding configuration
export {
  branding,
  getBrandingConfig,
  DEFAULT_BRANDING,
  type BrandingConfig,
} from './branding';

// Starter libraries and design systems
export {
  STARTER_DESIGN_SYSTEMS,
  STARTER_COMPONENT_CATEGORIES,
  EMPTY_STATE_CONFIG,
  getStarterSystem,
  getDefaultStarterSystem,
  getCategoriesForIntent,
  getAllStarterIntents,
  type StarterDesignSystem,
  type StarterTheme,
  type StarterComponentCategory,
  type EmptyStateConfig,
} from './starter-libraries';

// Feature flags
export {
  features,
  getFeatureFlags,
  isFeatureEnabled,
  DEFAULT_FEATURES,
  type FeatureFlags,
} from './features';
