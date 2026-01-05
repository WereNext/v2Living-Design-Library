import { Theme } from '../hooks/useDesignSystems';

// Minimalist Design System Themes
// Clean, refined, and sophisticated minimal themes with luxurious touches
// Each theme has DISTINCT characteristics and philosophies

export const MINIMALIST_THEMES: Theme[] = [
  // Swiss Minimal - Ultra-crisp, high-contrast, geometric precision
  {
    id: 'swiss-minimal',
    name: 'Swiss Minimal',
    description: 'Ultra-crisp Swiss precision - stark black & white, perfect geometry, razor-sharp edges',
    colors: {
      'background': '0 0% 100%',
      'foreground': '0 0% 0%',
      'primary': '0 0% 9%',
      'primary-foreground': '0 0% 100%',
      'secondary': '0 0% 94%',
      'secondary-foreground': '0 0% 9%',
      'muted': '0 0% 98%',
      'muted-foreground': '0 0% 45%',
      'accent': '0 0% 88%',              // Mid-grey for hover states
      'accent-foreground': '0 0% 9%',
      'destructive': '0 0% 20%',
      'destructive-foreground': '0 0% 100%',
      'border': '0 0% 85%',
      'input': '0 0% 90%',
      'ring': '0 0% 9%',
      'card': '0 0% 100%',
      'card-foreground': '0 0% 0%',
      'popover': '0 0% 100%',
      'popover-foreground': '0 0% 0%',
      'chart-1': '0 0% 15%',
      'chart-2': '0 0% 35%',
      'chart-3': '0 0% 55%'
    },
    spacing: {
      'xs': '0.25rem',    // 4px - Tight precision
      'sm': '0.5rem',     // 8px - Grid-based
      'md': '1rem',       // 16px - Mathematical
      'lg': '2rem',       // 32px - Strict rhythm
      'xl': '4rem',       // 64px - Bold whitespace
      '2xl': '8rem'       // 128px - Monumental space
    },
    typography: {
      'font-sans': 'Helvetica Neue, Helvetica, Arial, sans-serif',
      'font-mono': 'Courier New, monospace',
      'font-serif': 'Times New Roman, serif'
    },
    borderRadius: {
      'radius-sm': '0',        // Absolute zero - pure geometry
      'radius-md': '0.125rem', // 2px - Micro-chamfer
      'radius-lg': '0.25rem',  // 4px - Subtle corner
      'radius-xl': '0.375rem'  // 6px - Maximum softness
    },
    shadows: {
      'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.08)',
      'shadow-md': '0 2px 8px 0 rgb(0 0 0 / 0.12), 0 0 0 1px rgb(0 0 0 / 0.04)',
      'shadow-lg': '0 4px 16px 0 rgb(0 0 0 / 0.16), 0 0 0 1px rgb(0 0 0 / 0.06)'
    },
    sidebar: {
      'background': 'hsl(0 0% 100%)',
      'foreground': 'hsl(0 0% 0%)',
      'primary': 'hsl(0 0% 9%)',
      'primary-foreground': 'hsl(0 0% 100%)',
      'accent': 'hsl(0 0% 96%)',
      'accent-foreground': 'hsl(0 0% 9%)',
      'border': 'hsl(0 0% 85%)',
      'ring': 'hsl(0 0% 9%)'
    },
    colorTheme: 'minimal',
    fontFamily: 'system',
    visualFeel: 'minimal'
  },

  // Japanese Zen - Warm, organic, nature-inspired with rich earth tones
  {
    id: 'japanese-zen',
    name: 'Japanese Zen',
    description: 'Organic zen warmth - deep earth tones, natural materials, harmonious curves',
    colors: {
      'background': '35 30% 96%',        // Warm rice paper
      'foreground': '25 18% 18%',        // Deep charcoal brown
      'primary': '20 45% 38%',           // Rich terracotta
      'primary-foreground': '35 30% 96%',
      'secondary': '140 25% 45%',        // Moss green
      'secondary-foreground': '35 30% 96%',
      'muted': '35 25% 90%',             // Soft sand
      'muted-foreground': '25 15% 45%',  // Medium earth
      'accent': '30 50% 60%',            // Warm amber
      'accent-foreground': '25 18% 18%',
      'destructive': '8 60% 35%',        // Deep rust
      'destructive-foreground': '35 30% 96%',
      'border': '35 20% 82%',
      'input': '35 20% 85%',
      'ring': '20 45% 38%',
      'card': '35 35% 98%',
      'card-foreground': '25 18% 18%',
      'popover': '35 35% 98%',
      'popover-foreground': '25 18% 18%',
      'chart-1': '20 45% 38%',
      'chart-2': '140 25% 45%',
      'chart-3': '30 50% 60%'
    },
    spacing: {
      'xs': '0.5rem',     // 8px - Natural rhythm
      'sm': '1rem',       // 16px - Human scale
      'md': '2rem',       // 32px - Breathing space
      'lg': '3.5rem',     // 56px - Contemplative
      'xl': '5rem',       // 80px - Serene distance
      '2xl': '7rem'       // 112px - Meditative void
    },
    typography: {
      'font-sans': 'Noto Sans, system-ui, sans-serif',
      'font-mono': 'Noto Sans Mono, monospace',
      'font-serif': 'Noto Serif, serif'
    },
    borderRadius: {
      'radius-sm': '0.125rem',  // 2px - Sharp precision
      'radius-md': '0.25rem',   // 4px - Subtle edge
      'radius-lg': '0.375rem',  // 6px - Minimal curve
      'radius-xl': '0.5rem'     // 8px - Controlled softness
    },
    shadows: {
      'shadow-sm': '0 2px 8px 0 rgb(60 45 30 / 0.08), 0 1px 3px 0 rgb(60 45 30 / 0.06)',
      'shadow-md': '0 4px 16px -2px rgb(60 45 30 / 0.12), 0 2px 6px -1px rgb(60 45 30 / 0.08), 0 0 0 1px rgb(60 45 30 / 0.04)',
      'shadow-lg': '0 8px 32px -4px rgb(60 45 30 / 0.16), 0 4px 12px -2px rgb(60 45 30 / 0.12), 0 0 0 1px rgb(60 45 30 / 0.05)'
    },
    sidebar: {
      'background': 'hsl(35 28% 94%)',
      'foreground': 'hsl(25 18% 18%)',
      'primary': 'hsl(20 45% 38%)',
      'primary-foreground': 'hsl(35 30% 96%)',
      'accent': 'hsl(35 25% 90%)',
      'accent-foreground': 'hsl(25 18% 18%)',
      'border': 'hsl(35 20% 82%)',
      'ring': 'hsl(20 45% 38%)'
    },
    colorTheme: 'minimal',
    fontFamily: 'system',
    visualFeel: 'minimal'
  },

  // Nordic Light - Cool, airy, spacious with distinct Scandinavian blue-grays
  {
    id: 'nordic-light',
    name: 'Nordic Light',
    description: 'Scandinavian airiness - cool blue-grays, expansive space, soft flowing forms, frosted glass',
    colors: {
      'background': '195 40% 97%',       // Icy blue background
      'foreground': '215 18% 25%',       // Deep slate blue
      'primary': '205 40% 50%',          // Clear fjord blue
      'primary-foreground': '195 40% 97%',
      'secondary': '190 30% 70%',        // Soft aqua
      'secondary-foreground': '215 18% 25%',
      'muted': '195 35% 93%',            // Cool ice mist
      'muted-foreground': '210 12% 50%', // Cool mid-tone
      'accent': '175 35% 65%',           // Nordic teal
      'accent-foreground': '215 18% 25%',
      'destructive': '355 65% 55%',      // Clean red accent
      'destructive-foreground': '195 40% 97%',
      'border': '195 25% 86%',           // Icy border
      'input': '195 28% 89%',            // Frosted input
      'ring': '205 40% 50%',
      'card': '195 45% 98%',             // Icy card surface
      'card-foreground': '215 18% 25%',
      'popover': '195 45% 98%',          // Icy popover
      'popover-foreground': '215 18% 25%',
      'chart-1': '205 40% 50%',
      'chart-2': '175 35% 65%',
      'chart-3': '190 30% 70%'
    },
    spacing: {
      'xs': '0.5rem',     // 8px - Gentle start
      'sm': '1rem',       // 16px - Clean rhythm
      'md': '2rem',       // 32px - Open breathing
      'lg': '4rem',       // 64px - Expansive air
      'xl': '6rem',       // 96px - Vast openness
      '2xl': '10rem'      // 160px - Infinite horizon
    },
    typography: {
      'font-sans': 'Inter, system-ui, sans-serif',
      'font-mono': 'JetBrains Mono, monospace',
      'font-serif': 'Merriweather, serif'
    },
    borderRadius: {
      'radius-sm': '0.5rem',    // 8px - Soft snow
      'radius-md': '0.875rem',  // 14px - Gentle flow
      'radius-lg': '1.5rem',    // 24px - Ocean waves
      'radius-xl': '2.25rem'    // 36px - Rolling hills
    },
    shadows: {
      'shadow-sm': '0 2px 12px 0 rgb(205 220 230 / 0.25), 0 1px 4px 0 rgb(205 220 230 / 0.15)',
      'shadow-md': '0 4px 24px -2px rgb(205 220 230 / 0.35), 0 2px 12px -1px rgb(205 220 230 / 0.2), 0 0 0 1px rgb(205 220 230 / 0.15)',
      'shadow-lg': '0 8px 48px -4px rgb(205 220 230 / 0.45), 0 4px 24px -2px rgb(205 220 230 / 0.3), 0 0 0 1px rgb(205 220 230 / 0.2)'
    },
    opacity: {
      'glass-subtle': '0.7',      // 70% - Subtle frosted layer
      'glass-medium': '0.85',     // 85% - Medium frosted layer
      'glass-heavy': '0.95',      // 95% - Heavy frosted layer
      'overlay-light': '0.4',     // 40% - Light overlay
      'overlay-medium': '0.6',    // 60% - Medium overlay
      'overlay-heavy': '0.8'      // 80% - Heavy overlay
    },
    effects: {
      'blur-sm': 'blur(8px)',        // Subtle frost
      'blur-md': 'blur(16px)',       // Medium frost
      'blur-lg': 'blur(24px)',       // Heavy frost
      'blur-xl': 'blur(40px)',       // Extreme frost
      'glass-sm': 'blur(8px) saturate(180%)',   // Frosted glass - subtle
      'glass-md': 'blur(16px) saturate(180%)',  // Frosted glass - medium
      'glass-lg': 'blur(24px) saturate(200%)',  // Frosted glass - strong
      'glass-xl': 'blur(40px) saturate(220%)'   // Frosted glass - extreme
    },
    sidebar: {
      'background': 'hsl(195 38% 96% / 0.85)',  // Semi-transparent for glass effect
      'foreground': 'hsl(215 18% 25%)',
      'primary': 'hsl(205 40% 50%)',
      'primary-foreground': 'hsl(195 40% 97%)',
      'accent': 'hsl(195 32% 92% / 0.7)',       // Semi-transparent accent
      'accent-foreground': 'hsl(215 18% 25%)',
      'border': 'hsl(195 25% 86% / 0.6)',       // Semi-transparent border
      'ring': 'hsl(205 40% 50%)'
    },
    colorTheme: 'minimal',
    fontFamily: 'inter',
    visualFeel: 'minimal'
  }
];