/**
 * Starter Libraries Configuration
 *
 * Defines the pre-installed component libraries and design systems
 * that come bundled with the empty state of the application.
 *
 * These serve as:
 * 1. Working examples for new users
 * 2. Base templates for customization
 * 3. Design intent component sources
 */

import { INTENT_IDS, SYSTEM_IDS, THEME_IDS, UI_LIBRARIES } from '../lib/constants';

// =============================================================================
// STARTER DESIGN SYSTEM DEFINITIONS
// =============================================================================

export interface StarterDesignSystem {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  themes: StarterTheme[];
  intents: string[];
  uiLibrary: string;
}

export interface StarterTheme {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  colors: Record<string, string>;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  typography: {
    fontFamily: string;
    fontFamilyMono: string;
  };
}

/**
 * Pre-installed design systems that come with the app
 * Users can use these as-is or as templates for their own systems
 */
export const STARTER_DESIGN_SYSTEMS: StarterDesignSystem[] = [
  {
    id: SYSTEM_IDS.DEFAULT,
    name: 'Modern Default',
    description: 'A clean, professional design system inspired by Apple, GitHub, Linear, and Vercel. Perfect for SaaS and web applications.',
    isDefault: true,
    themes: [
      {
        id: THEME_IDS.APPLE,
        name: 'Apple',
        mode: 'light',
        colors: {
          primary: '221 83% 53%',
          secondary: '240 4.8% 95.9%',
          accent: '240 4.8% 95.9%',
          background: '0 0% 100%',
          foreground: '240 10% 3.9%',
          muted: '240 4.8% 95.9%',
          'muted-foreground': '240 3.8% 46.1%',
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
        },
        radius: {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '0.75rem',
          full: '9999px',
        },
        typography: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontFamilyMono: 'JetBrains Mono, Menlo, Monaco, monospace',
        },
      },
      {
        id: THEME_IDS.GITHUB,
        name: 'GitHub',
        mode: 'dark',
        colors: {
          primary: '212 92% 45%',
          secondary: '215 20.2% 65.1%',
          accent: '212 92% 45%',
          background: '215 28% 9%',
          foreground: '210 40% 98%',
          muted: '215 20.2% 16.8%',
          'muted-foreground': '215 20.2% 65.1%',
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
        },
        radius: {
          sm: '0.375rem',
          md: '0.5rem',
          lg: '0.75rem',
          full: '9999px',
        },
        typography: {
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
          fontFamilyMono: 'SFMono-Regular, Consolas, monospace',
        },
      },
    ],
    intents: [INTENT_IDS.WEB_APP, INTENT_IDS.SAAS, INTENT_IDS.DASHBOARD],
    uiLibrary: UI_LIBRARIES.SHADCN,
  },
  {
    id: SYSTEM_IDS.MATERIAL,
    name: 'Material Design',
    description: 'Google\'s Material Design system with light and dark themes. Great for Android-first or Google-style applications.',
    isDefault: false,
    themes: [
      {
        id: THEME_IDS.MATERIAL_LIGHT,
        name: 'Material Light',
        mode: 'light',
        colors: {
          primary: '262 80% 50%',
          secondary: '291 64% 42%',
          accent: '174 100% 29%',
          background: '0 0% 100%',
          foreground: '0 0% 10%',
          muted: '0 0% 96%',
          'muted-foreground': '0 0% 45%',
        },
        spacing: {
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
        },
        radius: {
          sm: '4px',
          md: '8px',
          lg: '16px',
          full: '9999px',
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
          fontFamilyMono: 'Roboto Mono, monospace',
        },
      },
      {
        id: THEME_IDS.MATERIAL_DARK,
        name: 'Material Dark',
        mode: 'dark',
        colors: {
          primary: '262 80% 65%',
          secondary: '291 64% 55%',
          accent: '174 100% 40%',
          background: '0 0% 7%',
          foreground: '0 0% 93%',
          muted: '0 0% 15%',
          'muted-foreground': '0 0% 60%',
        },
        spacing: {
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
        },
        radius: {
          sm: '4px',
          md: '8px',
          lg: '16px',
          full: '9999px',
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
          fontFamilyMono: 'Roboto Mono, monospace',
        },
      },
    ],
    intents: [INTENT_IDS.MOBILE, INTENT_IDS.ADMIN, INTENT_IDS.FORMS],
    uiLibrary: UI_LIBRARIES.MUI,
  },
  {
    id: SYSTEM_IDS.MINIMALIST,
    name: 'Minimalist',
    description: 'Ultra-clean, typography-focused design system. Perfect for portfolios, blogs, and editorial content.',
    isDefault: false,
    themes: [
      {
        id: THEME_IDS.MINIMALIST_LIGHT,
        name: 'Minimalist Light',
        mode: 'light',
        colors: {
          primary: '0 0% 9%',
          secondary: '0 0% 96%',
          accent: '0 0% 45%',
          background: '0 0% 100%',
          foreground: '0 0% 9%',
          muted: '0 0% 96%',
          'muted-foreground': '0 0% 45%',
        },
        spacing: {
          xs: '0.5rem',
          sm: '1rem',
          md: '2rem',
          lg: '4rem',
          xl: '8rem',
        },
        radius: {
          sm: '0',
          md: '0',
          lg: '0',
          full: '0',
        },
        typography: {
          fontFamily: 'Georgia, Times New Roman, serif',
          fontFamilyMono: 'Courier New, Courier, monospace',
        },
      },
      {
        id: THEME_IDS.MINIMALIST_DARK,
        name: 'Minimalist Dark',
        mode: 'dark',
        colors: {
          primary: '0 0% 98%',
          secondary: '0 0% 15%',
          accent: '0 0% 65%',
          background: '0 0% 4%',
          foreground: '0 0% 98%',
          muted: '0 0% 15%',
          'muted-foreground': '0 0% 65%',
        },
        spacing: {
          xs: '0.5rem',
          sm: '1rem',
          md: '2rem',
          lg: '4rem',
          xl: '8rem',
        },
        radius: {
          sm: '0',
          md: '0',
          lg: '0',
          full: '0',
        },
        typography: {
          fontFamily: 'Georgia, Times New Roman, serif',
          fontFamilyMono: 'Courier New, Courier, monospace',
        },
      },
    ],
    intents: [INTENT_IDS.PORTFOLIO, INTENT_IDS.BLOG, INTENT_IDS.WEB_EDITORIAL],
    uiLibrary: UI_LIBRARIES.SHADCN,
  },
  {
    id: SYSTEM_IDS.CANDY_NEST,
    name: 'Candy Nest',
    description: 'Playful, vibrant design system with soft gradients and friendly colors. Great for consumer apps and creative products.',
    isDefault: false,
    themes: [
      {
        id: THEME_IDS.CANDY_NEST_LIGHT,
        name: 'Candy Light',
        mode: 'light',
        colors: {
          primary: '326 100% 60%',
          secondary: '270 95% 75%',
          accent: '200 100% 65%',
          background: '300 20% 99%',
          foreground: '300 20% 15%',
          muted: '300 20% 95%',
          'muted-foreground': '300 10% 45%',
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2.5rem',
        },
        radius: {
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          full: '9999px',
        },
        typography: {
          fontFamily: 'Nunito, Poppins, sans-serif',
          fontFamilyMono: 'Fira Code, monospace',
        },
      },
      {
        id: THEME_IDS.CANDY_NEST_DARK,
        name: 'Candy Dark',
        mode: 'dark',
        colors: {
          primary: '326 100% 65%',
          secondary: '270 95% 70%',
          accent: '200 100% 60%',
          background: '280 30% 8%',
          foreground: '300 20% 95%',
          muted: '280 20% 18%',
          'muted-foreground': '300 10% 65%',
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2.5rem',
        },
        radius: {
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          full: '9999px',
        },
        typography: {
          fontFamily: 'Nunito, Poppins, sans-serif',
          fontFamilyMono: 'Fira Code, monospace',
        },
      },
    ],
    intents: [INTENT_IDS.SOCIAL, INTENT_IDS.ECOMMERCE, INTENT_IDS.LANDING],
    uiLibrary: UI_LIBRARIES.CHAKRA,
  },
];

// =============================================================================
// STARTER COMPONENT CATEGORIES
// =============================================================================

export interface StarterComponentCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  intents: string[]; // Which intents this category appears in
  components: string[]; // Component IDs available in this category
}

/**
 * Pre-defined component categories organized by design intent
 */
export const STARTER_COMPONENT_CATEGORIES: StarterComponentCategory[] = [
  // Universal categories
  {
    id: 'buttons',
    name: 'Buttons',
    description: 'Action triggers, CTAs, and interactive controls',
    icon: 'MousePointerClick',
    intents: [INTENT_IDS.WEB_APP, INTENT_IDS.SAAS, INTENT_IDS.LANDING, INTENT_IDS.ECOMMERCE],
    components: ['button', 'icon-button', 'button-group', 'toggle-button', 'fab'],
  },
  {
    id: 'forms',
    name: 'Forms',
    description: 'Input fields, validation, and form layouts',
    icon: 'FormInput',
    intents: [INTENT_IDS.WEB_APP, INTENT_IDS.SAAS, INTENT_IDS.AUTH, INTENT_IDS.FORMS],
    components: ['input', 'textarea', 'select', 'checkbox', 'radio', 'switch', 'slider', 'date-picker'],
  },
  {
    id: 'layout',
    name: 'Layout',
    description: 'Containers, grids, and structural components',
    icon: 'Layout',
    intents: [INTENT_IDS.WEB_APP, INTENT_IDS.DASHBOARD, INTENT_IDS.ADMIN],
    components: ['card', 'container', 'grid', 'stack', 'divider', 'aspect-ratio'],
  },
  {
    id: 'navigation',
    name: 'Navigation',
    description: 'Menus, breadcrumbs, and wayfinding components',
    icon: 'Navigation',
    intents: [INTENT_IDS.WEB_APP, INTENT_IDS.SAAS, INTENT_IDS.DOCS],
    components: ['navbar', 'sidebar', 'breadcrumb', 'tabs', 'pagination', 'menu'],
  },
  {
    id: 'data-display',
    name: 'Data Display',
    description: 'Tables, lists, and data visualization components',
    icon: 'Table',
    intents: [INTENT_IDS.DASHBOARD, INTENT_IDS.ADMIN, INTENT_IDS.SAAS],
    components: ['table', 'data-table', 'list', 'avatar', 'badge', 'tag', 'stat'],
  },
  {
    id: 'overlays',
    name: 'Overlays',
    description: 'Modals, dialogs, tooltips, and popovers',
    icon: 'Layers',
    intents: [INTENT_IDS.WEB_APP, INTENT_IDS.SAAS],
    components: ['dialog', 'drawer', 'popover', 'tooltip', 'toast', 'alert-dialog'],
  },
  // E-commerce specific
  {
    id: 'product-cards',
    name: 'Product Cards',
    description: 'Product displays, galleries, and quick views',
    icon: 'ShoppingBag',
    intents: [INTENT_IDS.ECOMMERCE],
    components: ['product-card', 'product-grid', 'quick-view', 'image-gallery'],
  },
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    description: 'Cart items, summaries, and mini-cart',
    icon: 'ShoppingCart',
    intents: [INTENT_IDS.ECOMMERCE],
    components: ['cart-item', 'cart-summary', 'mini-cart', 'quantity-selector'],
  },
  // Landing page specific
  {
    id: 'hero',
    name: 'Hero Sections',
    description: 'Hero banners, feature highlights, and CTAs',
    icon: 'Sparkles',
    intents: [INTENT_IDS.LANDING],
    components: ['hero-banner', 'hero-split', 'hero-video', 'feature-grid'],
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    description: 'Reviews, quotes, and social proof',
    icon: 'Quote',
    intents: [INTENT_IDS.LANDING, INTENT_IDS.ECOMMERCE],
    components: ['testimonial-card', 'testimonial-carousel', 'rating-display', 'trust-badges'],
  },
  {
    id: 'pricing',
    name: 'Pricing',
    description: 'Pricing tables, plan comparisons, and feature lists',
    icon: 'DollarSign',
    intents: [INTENT_IDS.LANDING, INTENT_IDS.SAAS],
    components: ['pricing-card', 'pricing-table', 'feature-comparison', 'plan-toggle'],
  },
  // Mobile specific
  {
    id: 'mobile-nav',
    name: 'Mobile Navigation',
    description: 'Bottom nav, tab bars, and mobile menus',
    icon: 'Smartphone',
    intents: [INTENT_IDS.MOBILE],
    components: ['bottom-nav', 'tab-bar', 'mobile-menu', 'gesture-handler'],
  },
];

// =============================================================================
// EMPTY STATE CONFIGURATION
// =============================================================================

export interface EmptyStateConfig {
  showWelcomeOnFirstVisit: boolean;
  defaultDesignSystemId: string;
  preloadDemoSystems: boolean;
  enabledImportSources: ('figma' | 'json' | 'css' | 'tokens-studio')[];
  defaultUILibrary: string;
}

/**
 * Configuration for the empty state experience
 */
export const EMPTY_STATE_CONFIG: EmptyStateConfig = {
  showWelcomeOnFirstVisit: true,
  defaultDesignSystemId: SYSTEM_IDS.DEFAULT,
  preloadDemoSystems: true,
  enabledImportSources: ['figma', 'json', 'css', 'tokens-studio'],
  defaultUILibrary: UI_LIBRARIES.SHADCN,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a starter design system by ID
 */
export function getStarterSystem(id: string): StarterDesignSystem | undefined {
  return STARTER_DESIGN_SYSTEMS.find(system => system.id === id);
}

/**
 * Get the default starter design system
 */
export function getDefaultStarterSystem(): StarterDesignSystem {
  return STARTER_DESIGN_SYSTEMS.find(system => system.isDefault) || STARTER_DESIGN_SYSTEMS[0];
}

/**
 * Get component categories for a specific design intent
 */
export function getCategoriesForIntent(intentId: string): StarterComponentCategory[] {
  return STARTER_COMPONENT_CATEGORIES.filter(category =>
    category.intents.includes(intentId)
  );
}

/**
 * Get all available intents across all starter systems
 */
export function getAllStarterIntents(): string[] {
  const intents = new Set<string>();
  STARTER_DESIGN_SYSTEMS.forEach(system => {
    system.intents.forEach(intent => intents.add(intent));
  });
  return Array.from(intents);
}
