/**
 * Component Registry
 *
 * A dynamic system for registering showcases and mapping them to intents.
 * This eliminates hardcoded switch statements and allows components to
 * self-register with metadata about which intents they apply to.
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface ShowcaseMetadata {
  /** Unique identifier for the showcase (matches category ID) */
  id: string;
  /** Display name shown in sidebar */
  name: string;
  /** Lucide icon name (string, resolved at runtime) */
  icon: string;
  /** Which intents this showcase applies to. Use '*' for all intents. */
  intents: string[];
  /** Optional tags for filtering/searching */
  tags?: string[];
  /** Priority for ordering (higher = appears first). Default: 0 */
  priority?: number;
  /** Whether this showcase accepts designIntent prop */
  acceptsIntent?: boolean;
}

export interface ShowcaseRegistration extends ShowcaseMetadata {
  /** The component to render (lazy-loaded) */
  component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
}

export interface IntentDefinition {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
  /** Icon name */
  icon?: string;
  /** Whether this is a custom user-created intent */
  isCustom?: boolean;
  /** Explicit category overrides (if empty, uses registry matching) */
  categoryOverrides?: string[];
}

export interface CategoryForIntent {
  id: string;
  name: string;
  icon: string;
}

// =============================================================================
// REGISTRY STORAGE
// =============================================================================

const showcaseRegistry = new Map<string, ShowcaseRegistration>();
const intentRegistry = new Map<string, IntentDefinition>();

// =============================================================================
// SHOWCASE REGISTRATION
// =============================================================================

/**
 * Register a showcase component with its metadata
 */
export function registerShowcase(registration: ShowcaseRegistration): void {
  showcaseRegistry.set(registration.id, registration);
}

/**
 * Get a showcase by ID
 */
export function getShowcase(id: string): ShowcaseRegistration | undefined {
  return showcaseRegistry.get(id);
}

/**
 * Get all registered showcases
 */
export function getAllShowcases(): ShowcaseRegistration[] {
  return Array.from(showcaseRegistry.values());
}

/**
 * Get showcases that apply to a specific intent
 */
export function getShowcasesForIntent(intentId: string): ShowcaseRegistration[] {
  return Array.from(showcaseRegistry.values())
    .filter(showcase =>
      showcase.intents.includes('*') ||
      showcase.intents.includes(intentId)
    )
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

/**
 * Get categories (for sidebar) for a specific intent
 */
export function getCategoriesForIntent(intentId: string): CategoryForIntent[] {
  // First check if intent has explicit overrides
  const intent = intentRegistry.get(intentId);
  if (intent?.categoryOverrides?.length) {
    return intent.categoryOverrides
      .map(catId => {
        const showcase = showcaseRegistry.get(catId);
        if (!showcase) return null;
        return {
          id: showcase.id,
          name: showcase.name,
          icon: showcase.icon,
        };
      })
      .filter((cat): cat is CategoryForIntent => cat !== null);
  }

  // Otherwise, use registry matching
  return getShowcasesForIntent(intentId).map(showcase => ({
    id: showcase.id,
    name: showcase.name,
    icon: showcase.icon,
  }));
}

// =============================================================================
// INTENT REGISTRATION
// =============================================================================

/**
 * Register an intent definition
 */
export function registerIntent(intent: IntentDefinition): void {
  intentRegistry.set(intent.id, intent);
}

/**
 * Get an intent by ID
 */
export function getIntent(id: string): IntentDefinition | undefined {
  return intentRegistry.get(id);
}

/**
 * Get all registered intents
 */
export function getAllIntents(): IntentDefinition[] {
  return Array.from(intentRegistry.values());
}

/**
 * Get predefined (non-custom) intents
 */
export function getPredefinedIntents(): IntentDefinition[] {
  return Array.from(intentRegistry.values()).filter(i => !i.isCustom);
}

// =============================================================================
// LAZY LOADING HELPER
// =============================================================================

/**
 * Helper to create a lazy-loaded showcase registration
 */
export function lazyShowcase(
  metadata: ShowcaseMetadata,
  importFn: () => Promise<{ default: ComponentType<any> }>
): ShowcaseRegistration {
  return {
    ...metadata,
    component: lazy(importFn),
  };
}

// =============================================================================
// PREDEFINED INTENTS
// =============================================================================

// Register all predefined intents
const PREDEFINED_INTENTS: IntentDefinition[] = [
  { id: 'web-app', label: 'Web App', icon: 'Layout', description: 'Standard web application components' },
  { id: 'ecommerce', label: 'E-commerce', icon: 'ShoppingBag', description: 'Online store and shopping components' },
  { id: 'mobile', label: 'Mobile Experience', icon: 'Smartphone', description: 'Mobile-first UI patterns' },
  { id: 'landing', label: 'Landing Page', icon: 'Megaphone', description: 'Marketing and conversion components' },
  { id: 'web-editorial', label: 'Editorial', icon: 'BookOpen', description: 'Content and publishing components' },
  { id: 'dashboard', label: 'Dashboard & Analytics', icon: 'BarChart3', description: 'Data visualization and metrics' },
  { id: 'saas', label: 'SaaS Platform', icon: 'Cloud', description: 'Software as a service patterns' },
  { id: 'social', label: 'Social Media', icon: 'Users', description: 'Social interaction components' },
  { id: 'blog', label: 'Blog & Content', icon: 'FileText', description: 'Blogging and content management' },
  { id: 'portfolio', label: 'Portfolio & Showcase', icon: 'Image', description: 'Portfolio display components' },
  { id: 'admin', label: 'Admin Panel', icon: 'Settings', description: 'Administrative interfaces' },
  { id: 'docs', label: 'Documentation', icon: 'Book', description: 'Documentation site components' },
  { id: 'auth', label: 'Authentication', icon: 'Lock', description: 'Login and authentication flows' },
  { id: 'messaging', label: 'Messaging & Chat', icon: 'MessageCircle', description: 'Chat and messaging interfaces' },
  { id: 'calendar', label: 'Calendar & Scheduling', icon: 'Calendar', description: 'Scheduling and calendar views' },
  { id: 'media', label: 'Media Gallery', icon: 'Image', description: 'Media browsing and galleries' },
  { id: 'forms', label: 'Forms & Surveys', icon: 'ClipboardList', description: 'Form building and surveys' },
];

PREDEFINED_INTENTS.forEach(intent => registerIntent(intent));

// =============================================================================
// SHOWCASE REGISTRATIONS
// =============================================================================

// Universal showcases (available for all intents)
registerShowcase(lazyShowcase(
  { id: 'playground', name: 'Code Playground', icon: 'Code2', intents: ['*'], priority: 100 },
  () => import('../components/showcases/PlaygroundShowcase').then(m => ({ default: m.PlaygroundShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'buttons', name: 'Buttons & Actions', icon: 'Mouse', intents: ['*'], priority: 90, acceptsIntent: true },
  () => import('../components/showcases/ButtonsShowcase').then(m => ({ default: m.ButtonsShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'forms', name: 'Forms & Inputs', icon: 'Type', intents: ['*'], priority: 80 },
  () => import('../components/showcases/FormsShowcase').then(m => ({ default: m.FormsShowcase }))
));

// Web App showcases
registerShowcase(lazyShowcase(
  { id: 'layout', name: 'Layout Components', icon: 'Layout', intents: ['web-app', 'dashboard', 'admin', 'saas'], priority: 70 },
  () => import('../components/showcases/LayoutShowcase').then(m => ({ default: m.LayoutShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'overlays', name: 'Overlays & Dialogs', icon: 'Box', intents: ['web-app', 'dashboard', 'admin', 'saas', 'ecommerce'], priority: 60 },
  () => import('../components/showcases/OverlaysShowcase').then(m => ({ default: m.OverlaysShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'navigation', name: 'Navigation', icon: 'Menu', intents: ['web-app', 'dashboard', 'admin', 'saas', 'docs'], priority: 50 },
  () => import('../components/showcases/NavigationShowcase').then(m => ({ default: m.NavigationShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'data', name: 'Data Display', icon: 'Palette', intents: ['web-app', 'dashboard', 'admin', 'saas'], priority: 40 },
  () => import('../components/showcases/DataDisplayShowcase').then(m => ({ default: m.DataDisplayShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'ai', name: 'AI Components', icon: 'Zap', intents: ['web-app', 'saas', 'dashboard'], priority: 30 },
  () => import('../components/showcases/AIShowcase').then(m => ({ default: m.AIShowcase }))
));

// E-commerce showcases
registerShowcase(lazyShowcase(
  { id: 'product-cards', name: 'Product Cards', icon: 'ShoppingBag', intents: ['ecommerce'], priority: 85 },
  () => import('../components/showcases/ProductCardsShowcase').then(m => ({ default: m.ProductCardsShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'shopping-cart', name: 'Shopping Cart', icon: 'ShoppingCart', intents: ['ecommerce'], priority: 75 },
  () => import('../components/showcases/ShoppingCartShowcase').then(m => ({ default: m.ShoppingCartShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'checkout', name: 'Checkout Flow', icon: 'CreditCard', intents: ['ecommerce'], priority: 65 },
  () => import('../components/showcases/CheckoutShowcase').then(m => ({ default: m.CheckoutShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'reviews', name: 'Reviews & Ratings', icon: 'Star', intents: ['ecommerce', 'social'], priority: 55 },
  () => import('../components/showcases/ReviewsShowcase').then(m => ({ default: m.ReviewsShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'filters', name: 'Filters & Search', icon: 'Filter', intents: ['ecommerce', 'dashboard', 'admin'], priority: 45 },
  () => import('../components/showcases/FiltersShowcase').then(m => ({ default: m.FiltersShowcase }))
));

// Landing Page showcases
registerShowcase(lazyShowcase(
  { id: 'hero', name: 'Hero Sections', icon: 'Megaphone', intents: ['landing', 'portfolio'], priority: 85 },
  () => import('../components/showcases/HeroShowcase').then(m => ({ default: m.HeroShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'cta-blocks', name: 'CTA Blocks', icon: 'MousePointerClick', intents: ['landing', 'ecommerce'], priority: 75 },
  () => import('../components/showcases/CTABlocksShowcase').then(m => ({ default: m.CTABlocksShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'testimonials', name: 'Testimonials', icon: 'MessageSquare', intents: ['landing', 'portfolio', 'saas'], priority: 65 },
  () => import('../components/showcases/TestimonialsShowcase').then(m => ({ default: m.TestimonialsShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'pricing', name: 'Pricing Tables', icon: 'DollarSign', intents: ['landing', 'saas'], priority: 55 },
  () => import('../components/showcases/PricingShowcase').then(m => ({ default: m.PricingShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'features', name: 'Feature Grids', icon: 'Grid3x3', intents: ['landing', 'saas', 'portfolio'], priority: 45 },
  () => import('../components/showcases/FeaturesShowcase').then(m => ({ default: m.FeaturesShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'email-capture', name: 'Email Capture', icon: 'Mail', intents: ['landing', 'blog'], priority: 35 },
  () => import('../components/showcases/EmailCaptureShowcase').then(m => ({ default: m.EmailCaptureShowcase }))
));

// Mobile showcases
registerShowcase(lazyShowcase(
  { id: 'bottom-nav', name: 'Bottom Navigation', icon: 'Menu', intents: ['mobile'], priority: 85 },
  () => import('../components/showcases/BottomNavShowcase').then(m => ({ default: m.BottomNavShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'swipe-actions', name: 'Swipe Actions', icon: 'Hand', intents: ['mobile'], priority: 75 },
  () => import('../components/showcases/SwipeActionsShowcase').then(m => ({ default: m.SwipeActionsShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'pull-refresh', name: 'Pull to Refresh', icon: 'RefreshCw', intents: ['mobile'], priority: 65 },
  () => import('../components/showcases/PullRefreshShowcase').then(m => ({ default: m.PullRefreshShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'mobile-menu', name: 'Mobile Menu', icon: 'AlignLeft', intents: ['mobile'], priority: 55 },
  () => import('../components/showcases/MobileMenuShowcase').then(m => ({ default: m.MobileMenuShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'touch-gestures', name: 'Touch Gestures', icon: 'Fingerprint', intents: ['mobile'], priority: 45 },
  () => import('../components/showcases/TouchGesturesShowcase').then(m => ({ default: m.TouchGesturesShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'mobile-forms', name: 'Mobile Forms', icon: 'Smartphone', intents: ['mobile'], priority: 35 },
  () => import('../components/showcases/MobileFormsShowcase').then(m => ({ default: m.MobileFormsShowcase }))
));

// Authentication showcases
registerShowcase(lazyShowcase(
  { id: 'authentication', name: 'Authentication', icon: 'Lock', intents: ['auth', 'web-app', 'saas', 'admin'], priority: 85 },
  () => import('../components/showcases/AuthenticationShowcase').then(m => ({ default: m.AuthenticationShowcase }))
));

// Editorial showcases
registerShowcase(lazyShowcase(
  { id: 'editorial-hero', name: 'Editorial Heroes', icon: 'Newspaper', intents: ['web-editorial', 'blog'], priority: 85 },
  () => import('../components/showcases/EditorialHeroShowcase').then(m => ({ default: m.EditorialHeroShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'article-cards', name: 'Article Cards', icon: 'Layers', intents: ['web-editorial', 'blog'], priority: 75 },
  () => import('../components/showcases/ArticleCardsShowcase').then(m => ({ default: m.ArticleCardsShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'longform-reading', name: 'Longform Reading', icon: 'BookOpen', intents: ['web-editorial', 'blog', 'docs'], priority: 65 },
  () => import('../components/showcases/LongformReadingShowcase').then(m => ({ default: m.LongformReadingShowcase }))
));

registerShowcase(lazyShowcase(
  { id: 'editorial-features', name: 'Editorial Features', icon: 'Sparkles', intents: ['web-editorial'], priority: 55 },
  () => import('../components/showcases/EditorialFeaturesShowcase').then(m => ({ default: m.EditorialFeaturesShowcase }))
));

// Messaging showcases
registerShowcase(lazyShowcase(
  { id: 'messaging', name: 'Messaging & Chat', icon: 'MessageCircle', intents: ['messaging', 'social', 'web-app', 'saas'], priority: 85 },
  () => import('../components/showcases/MessagingShowcase').then(m => ({ default: m.MessagingShowcase }))
));

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

/**
 * Check if a showcase exists
 */
export function hasShowcase(id: string): boolean {
  return showcaseRegistry.has(id);
}

/**
 * Get the total count of registered showcases
 */
export function getShowcaseCount(): number {
  return showcaseRegistry.size;
}

/**
 * Get showcases by tag
 */
export function getShowcasesByTag(tag: string): ShowcaseRegistration[] {
  return Array.from(showcaseRegistry.values())
    .filter(showcase => showcase.tags?.includes(tag));
}

/**
 * Debug: log all registered showcases and their intents
 */
export function debugRegistry(): void {
  console.group('Component Registry');
  console.log('Showcases:', showcaseRegistry.size);
  console.log('Intents:', intentRegistry.size);

  console.group('Showcases by Intent');
  getAllIntents().forEach(intent => {
    const showcases = getShowcasesForIntent(intent.id);
    console.log(`${intent.label} (${intent.id}):`, showcases.map(s => s.id));
  });
  console.groupEnd();

  console.groupEnd();
}
