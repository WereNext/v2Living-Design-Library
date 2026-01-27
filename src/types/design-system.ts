/**
 * Design System Types
 *
 * Central type definitions for design systems and themes.
 * These are the core domain types used throughout the application.
 */

import { DesignSystemVersion } from './version';
import { UILibrary } from '../lib/constants';

/**
 * Theme = A variable set (colors, spacing, typography, etc.)
 * A design system can have multiple themes (e.g., light, dark, brand variants)
 */
/**
 * Color scheme for the theme
 * - 'light': Light background, dark text
 * - 'dark': Dark background, light text
 * - 'auto': Follows system preference
 */
export type ColorScheme = 'light' | 'dark' | 'auto';

export interface Theme {
  id: string;
  name: string;
  description?: string;
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  sidebar?: Record<string, string>;
  opacity?: Record<string, string>;
  effects?: Record<string, string>;
  componentStyles?: {
    button?: {
      showBorder?: boolean;
      showIcons?: boolean;
    };
    chip?: {
      showBorder?: boolean;
      showIcons?: boolean;
    };
  };
  colorTheme?: 'neo' | 'brutalist' | 'glassmorphism' | 'candy' | 'material' | 'minimal' | 'midnight' | 'cyberpunk';
  fontFamily?: 'inter' | 'spaceGrotesk' | 'jetbrainsMono' | 'poppins' | 'playfairDisplay' | 'manrope' | 'system' | 'helvetica' | 'avenir' | 'georgia';
  visualFeel?: 'modern' | 'classic' | 'playful' | 'minimal' | 'bold';
  /** Color scheme - determines if this is a light or dark theme */
  colorScheme?: ColorScheme;
}

/**
 * Design Intent = What the design system is being used for
 * Determines which component showcases/patterns are available
 */
export interface DesignIntent {
  id: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
  categories?: IntentCategory[];
}

/**
 * Intent Category = A grouping of related UI patterns within an intent
 */
export interface IntentCategory {
  id: string;
  name: string;
  icon: string;
}

/**
 * Design System = Container with multiple themes and intents
 * The top-level entity that holds everything together
 */
export interface DesignSystem {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  uiLibrary: UILibrary;
  useIcons?: boolean;
  themes: Theme[];
  activeThemeId?: string;
  intents?: DesignIntent[];
  versions?: DesignSystemVersion[];
  currentVersionId?: string;
  isPublic?: boolean;
  shareSlug?: string;
}

/**
 * Component Category - alias for IntentCategory
 * Used in component showcases
 */
export type ComponentCategory = IntentCategory;
