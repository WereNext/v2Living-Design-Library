export type ColorTheme = 'neo' | 'brutalist' | 'glassmorphism' | 'candy' | 'material' | 'minimal';
export type FontFamily = 'inter' | 'spaceGrotesk' | 'jetbrainsMono' | 'poppins' | 'playfairDisplay' | 'manrope' | 'system';
export type VisualFeel = 'modern' | 'classic' | 'playful' | 'minimal' | 'bold';

export interface ThemeOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

export const COLOR_THEMES: ThemeOption<ColorTheme>[] = [
  { value: 'neo', label: 'Neo', description: 'Modern gradient mesh' },
  { value: 'brutalist', label: 'Brutalist', description: 'Raw & unpolished' },
  { value: 'glassmorphism', label: 'Glass', description: 'Frosted & translucent' },
  { value: 'candy', label: 'Candy', description: 'Playful pastels' },
  { value: 'material', label: 'Material', description: 'Google Material Design' },
  { value: 'minimal', label: 'Minimal', description: 'Less is more' },
];

export const FONT_FAMILIES: ThemeOption<FontFamily>[] = [
  { value: 'inter', label: 'Inter', description: 'Clean & versatile' },
  { value: 'spaceGrotesk', label: 'Space Grotesk', description: 'Geometric & modern' },
  { value: 'jetbrainsMono', label: 'JetBrains Mono', description: 'Developer-focused' },
  { value: 'poppins', label: 'Poppins', description: 'Friendly & rounded' },
  { value: 'playfairDisplay', label: 'Playfair Display', description: 'Elegant serif' },
  { value: 'manrope', label: 'Manrope', description: 'Contemporary sans' },
  { value: 'system', label: 'System', description: 'Default system font' },
];

export const VISUAL_FEELS: ThemeOption<VisualFeel>[] = [
  { value: 'modern', label: 'Modern', description: 'Sharp corners, clean lines' },
  { value: 'classic', label: 'Classic', description: 'Timeless design' },
  { value: 'playful', label: 'Playful', description: 'Rounded and fun' },
  { value: 'minimal', label: 'Minimal', description: 'Less is more' },
  { value: 'bold', label: 'Bold', description: 'Strong visual presence' },
];
