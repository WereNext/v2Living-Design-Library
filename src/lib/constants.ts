/**
 * Centralized constants for the Living Design Library
 *
 * This file contains all magic strings, localStorage keys, and other constants
 * that are used across the application. Centralizing these values:
 * - Prevents typos and inconsistencies
 * - Makes refactoring easier
 * - Provides a single source of truth
 */

// =============================================================================
// LOCALSTORAGE KEYS
// =============================================================================

export const STORAGE_KEYS = {
  // Design Systems
  DESIGN_SYSTEMS: 'designSystems',
  ACTIVE_SYSTEM_ID: 'activeDesignSystemId',
  ACTIVE_THEME_IDS: 'activeThemeIds',
  DESIGN_SYSTEMS_INITIALIZED: 'designSystemsInitialized',

  // Intents
  DESIGN_INTENTS: 'design-library-intents',

  // Component Documentation
  COMPONENT_DOCUMENTATION: 'component-documentation',

  // Imported Components
  IMPORTED_COMPONENTS: 'imported_components',

  // Figma Integration
  FIGMA_API_KEY: 'figma_api_key',

  // LLM/API Settings
  LLM_API_KEY: 'designLibrary_llm_api_key',
  LLM_PROVIDER: 'designLibrary_llm_provider',
  LLM_ENDPOINT: 'designLibrary_llm_endpoint',
  LLM_MODEL: 'designLibrary_llm_model',

  // User Preferences / Onboarding
  HAS_SEEN_DECISION_GATE: 'hasSeenDecisionGate',
  HAS_SEEN_QUICK_START_WIZARD: 'hasSeenQuickStartWizard',
  THEME_PREFERENCE: 'theme-preference',

  // Supabase / Cloud Sync
  SUPABASE_MIGRATION_COMPLETE: 'supabase_migration_complete',
  SUPABASE_USER_ID: 'supabase_user_id',

  // LDL Documents (local storage before sync)
  LDL_DOCUMENTS: 'ldl_documents',
} as const;

// =============================================================================
// ROUTE / CATEGORY IDS
// =============================================================================

export const CATEGORY_IDS = {
  // Main sections
  QUICK_START: 'quick-start',
  DESIGN_TOKENS: 'design-tokens',
  PLAYGROUND: 'playground',

  // Configuration
  IMPORT_CONFIG: 'import-config',
  DESIGN_SYSTEM_BUILDER: 'design-system-builder',
  SAVED_SYSTEMS: 'saved-systems',
  IMPORTED_COMPONENTS: 'imported-components',
  MCP_CONFIG: 'mcp-config',

  // Component Categories
  BUTTONS: 'buttons',
  FORMS: 'forms',
  LAYOUT: 'layout',
  OVERLAYS: 'overlays',
  NAVIGATION: 'navigation',
  DATA: 'data',
  AI: 'ai',

  // E-commerce
  PRODUCT_CARDS: 'product-cards',
  SHOPPING_CART: 'shopping-cart',
  CHECKOUT: 'checkout',
  REVIEWS: 'reviews',
  FILTERS: 'filters',

  // Mobile
  BOTTOM_NAV: 'bottom-nav',
  SWIPE_ACTIONS: 'swipe-actions',
  PULL_REFRESH: 'pull-refresh',
  MOBILE_MENU: 'mobile-menu',
  TOUCH_GESTURES: 'touch-gestures',
  MOBILE_FORMS: 'mobile-forms',

  // Landing Page
  HERO: 'hero',
  CTA_BLOCKS: 'cta-blocks',
  TESTIMONIALS: 'testimonials',
  PRICING: 'pricing',
  FEATURES: 'features',
  EMAIL_CAPTURE: 'email-capture',

  // Editorial
  EDITORIAL_HERO: 'editorial-hero',
  ARTICLE_CARDS: 'article-cards',
  LONGFORM_READING: 'longform-reading',
  EDITORIAL_FEATURES: 'editorial-features',
} as const;

// =============================================================================
// DESIGN INTENT IDS
// =============================================================================

export const INTENT_IDS = {
  WEB_APP: 'web-app',
  ECOMMERCE: 'ecommerce',
  MOBILE: 'mobile',
  LANDING: 'landing',
  DASHBOARD: 'dashboard',
  SAAS: 'saas',
  SOCIAL: 'social',
  BLOG: 'blog',
  PORTFOLIO: 'portfolio',
  ADMIN: 'admin',
  DOCS: 'docs',
  AUTH: 'auth',
  MESSAGING: 'messaging',
  CALENDAR: 'calendar',
  MEDIA: 'media',
  FORMS: 'forms',
  WEB_EDITORIAL: 'web-editorial',
} as const;

// =============================================================================
// THEME IDS
// =============================================================================

export const THEME_IDS = {
  // Default system themes
  APPLE: 'apple-theme',
  GITHUB: 'github-theme',
  LINEAR: 'linear-theme',
  VERCEL: 'vercel-theme',

  // Material system themes
  MATERIAL_LIGHT: 'material-light',
  MATERIAL_DARK: 'material-dark',

  // Minimalist system themes
  MINIMALIST_LIGHT: 'minimalist-light',
  MINIMALIST_DARK: 'minimalist-dark',

  // Candy Nest themes
  CANDY_NEST_LIGHT: 'candy-nest-light',
  CANDY_NEST_DARK: 'candy-nest-dark',
} as const;

// =============================================================================
// DESIGN SYSTEM IDS
// =============================================================================

export const SYSTEM_IDS = {
  DEFAULT: 'default-system',
  MATERIAL: 'material-system',
  MINIMALIST: 'minimalist-system',
  CANDY_NEST: 'candy-nest-system',
} as const;

// =============================================================================
// THEME CUSTOMIZER VALUES
// =============================================================================

export const COLOR_THEMES = {
  NEO: 'neo',
  BRUTALIST: 'brutalist',
  GLASSMORPHISM: 'glassmorphism',
  CANDY: 'candy',
  MATERIAL: 'material',
  MINIMAL: 'minimal',
} as const;

export const FONT_FAMILIES = {
  INTER: 'inter',
  SPACE_GROTESK: 'spaceGrotesk',
  JETBRAINS_MONO: 'jetbrainsMono',
  POPPINS: 'poppins',
  PLAYFAIR_DISPLAY: 'playfairDisplay',
  MANROPE: 'manrope',
  SYSTEM: 'system',
  HELVETICA: 'helvetica',
  AVENIR: 'avenir',
  GEORGIA: 'georgia',
} as const;

export const VISUAL_FEELS = {
  MODERN: 'modern',
  CLASSIC: 'classic',
  PLAYFUL: 'playful',
  MINIMAL: 'minimal',
  BOLD: 'bold',
} as const;

// =============================================================================
// FRAMEWORK OPTIONS (for code generation)
// =============================================================================

export const FRAMEWORKS = {
  CSS: 'css',
  TAILWIND: 'tailwind',
  REACT: 'react',
  VUE: 'vue',
  SVELTE: 'svelte',
  HTML: 'html',
  JSON: 'json',
  SCSS: 'scss',
  ANGULAR: 'angular',
} as const;

// =============================================================================
// LLM PROVIDERS
// =============================================================================

export const LLM_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  OLLAMA: 'ollama',
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
export type CategoryId = typeof CATEGORY_IDS[keyof typeof CATEGORY_IDS];
export type IntentId = typeof INTENT_IDS[keyof typeof INTENT_IDS];
export type ThemeId = typeof THEME_IDS[keyof typeof THEME_IDS];
export type SystemId = typeof SYSTEM_IDS[keyof typeof SYSTEM_IDS];
export type ColorThemeValue = typeof COLOR_THEMES[keyof typeof COLOR_THEMES];
export type FontFamilyValue = typeof FONT_FAMILIES[keyof typeof FONT_FAMILIES];
export type VisualFeelValue = typeof VISUAL_FEELS[keyof typeof VISUAL_FEELS];
export type Framework = typeof FRAMEWORKS[keyof typeof FRAMEWORKS];
export type LLMProvider = typeof LLM_PROVIDERS[keyof typeof LLM_PROVIDERS];
