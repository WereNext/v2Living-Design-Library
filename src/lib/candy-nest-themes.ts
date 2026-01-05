import { Theme } from '../hooks/useDesignSystems';

// Candy Nest Design System Themes
// Editorial design system inspired by premier magazine brands
// Each theme captures the essence of iconic publications

export const CANDY_NEST_THEMES: Theme[] = [
  // GQ Theme - Bold, masculine sophistication
  {
    id: 'gq-theme',
    name: 'GQ',
    description: 'Bold sophistication with sharp contrasts and editorial impact',
    colors: {
      'background': '0 0% 100%',          // Clean white
      'foreground': '0 0% 10%',           // Deep charcoal
      'primary': '0 0% 10%',              // GQ signature black
      'primary-foreground': '0 0% 100%',
      'secondary': '210 14% 89%',         // Cool gray
      'secondary-foreground': '0 0% 10%',
      'muted': '210 14% 95%',
      'muted-foreground': '0 0% 40%',
      'accent': '25 95% 53%',             // GQ orange accent
      'accent-foreground': '0 0% 100%',
      'destructive': '0 84% 60%',
      'destructive-foreground': '0 0% 100%',
      'border': '0 0% 90%',
      'input': '0 0% 90%',
      'ring': '0 0% 10%',
      'card': '0 0% 100%',
      'card-foreground': '0 0% 10%',
      'popover': '0 0% 100%',
      'popover-foreground': '0 0% 10%',
      'chart-1': '0 0% 10%',              // Black
      'chart-2': '25 95% 53%',            // Orange
      'chart-3': '210 14% 53%'            // Gray
    },
    spacing: {
      'xs': '0.5rem',                     // 8px - Tighter than default
      'sm': '0.75rem',                    // 12px
      'md': '1.5rem',                     // 24px - Standard editorial unit
      'lg': '2.5rem',                     // 40px
      'xl': '4rem',                       // 64px - Large section breaks
      '2xl': '6rem'                       // 96px - Dramatic spacing
    },
    typography: {
      'font-sans': 'Helvetica Neue, Helvetica, Arial, sans-serif',  // GQ uses Helvetica family
      'font-mono': 'Monaco, Courier New, monospace',
      'font-serif': 'Georgia, Times New Roman, serif'  // Classic serif for contrast
    },
    borderRadius: {
      'radius-sm': '0rem',                // Sharp edges - no rounding
      'radius-md': '0rem',
      'radius-lg': '0rem'
    },
    shadows: {
      'shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      'shadow-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    sidebar: {
      'background': '0 0% 10%',           // Dark sidebar
      'foreground': '0 0% 100%',
      'accent': '25 95% 53%',
      'accent-foreground': '0 0% 100%'
    },
    opacity: {
      'opacity-disabled': '0.38',
      'opacity-hover': '0.08',
      'opacity-selected': '0.12'
    },
    effects: {
      'backdrop-blur': 'blur(8px)'
    },
    colorTheme: 'neo',
    fontFamily: 'helvetica',                // Using Helvetica Neue for GQ
    visualFeel: 'bold'
  },

  // Vogue Theme - Elegant, high fashion, refined luxury
  {
    id: 'vogue-theme',
    name: 'Vogue',
    description: 'Timeless elegance with refined typography and luxurious spacing',
    colors: {
      'background': '0 0% 100%',          // Pure white
      'foreground': '0 0% 9%',            // Almost black
      'primary': '340 75% 68%',           // Lighter pink - softer and more elegant
      'primary-foreground': '0 0% 100%',
      'secondary': '150 30% 88%',         // Pale green - fresh accent color
      'secondary-foreground': '0 0% 9%',
      'muted': '30 20% 97%',
      'muted-foreground': '0 0% 45%',
      'accent': '150 30% 88%',            // Pale green accent - fresh and elegant
      'accent-foreground': '0 0% 9%',
      'destructive': '0 84% 60%',
      'destructive-foreground': '0 0% 100%',
      'border': '0 0% 93%',               // Subtle borders
      'input': '0 0% 93%',
      'ring': '340 75% 68%',              // Pink ring for focus states
      'card': '0 0% 100%',
      'card-foreground': '0 0% 9%',
      'popover': '0 0% 100%',
      'popover-foreground': '0 0% 9%',
      'chart-1': '340 75% 68%',           // Lighter pink
      'chart-2': '150 30% 88%',           // Pale green
      'chart-3': '0 0% 9%',               // Black
      'chart-4': '30 25% 75%',            // Warm neutral
      'chart-5': '150 40% 75%'            // Soft green variant
    },
    spacing: {
      'xs': '0.5rem',                     // 8px - Refined
      'sm': '1rem',                       // 16px - More generous
      'md': '2rem',                       // 32px - Luxurious
      'lg': '3rem',                       // 48px - Dramatic
      'xl': '5rem',                       // 80px - Ultra luxurious
      '2xl': '8rem'                       // 128px - Maximum luxury
    },
    typography: {
      'font-sans': 'Avenir Next, Helvetica Neue, sans-serif',  // Vogue uses Avenir-style fonts
      'font-mono': 'Courier New, monospace',
      'font-serif': 'Didot, Bodoni Moda, Georgia, serif'  // High-contrast Didot style
    },
    borderRadius: {
      'radius-sm': '0rem',                // No border radius - clean edges
      'radius-md': '0rem',
      'radius-lg': '0rem'
    },
    shadows: {
      'shadow-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.04)',    // Very subtle
      'shadow-md': '0 8px 16px 0 rgba(0, 0, 0, 0.06)',   // Soft, elegant
      'shadow-lg': '0 20px 40px 0 rgba(0, 0, 0, 0.08)'   // Floating luxury
    },
    sidebar: {
      'background': '340 75% 68%',        // Lighter pink sidebar
      'foreground': '0 0% 100%',
      'accent': '150 30% 88%',            // Pale green accent in sidebar
      'accent-foreground': '0 0% 9%'
    },
    opacity: {
      'opacity-disabled': '0.3',
      'opacity-hover': '0.04',            // Very subtle hover
      'opacity-selected': '0.08'
    },
    effects: {
      'backdrop-blur': 'blur(16px)'       // Strong blur for luxury
    },
    colorTheme: 'minimal',
    fontFamily: 'avenir',                 // Using Avenir Next for Vogue
    visualFeel: 'classic'
  },

  // The New Yorker Theme - Intellectual clarity with editorial sophistication
  {
    id: 'new-yorker-theme',
    name: 'The New Yorker',
    description: 'Classic editorial design with refined typography and comfortable reading',
    colors: {
      'background': '45 29% 97%',         // Warm cream (paper-like)
      'foreground': '0 0% 13%',           // Ink black
      'primary': '0 0% 13%',              // Deep black for headlines
      'primary-foreground': '0 0% 100%',
      'secondary': '45 20% 93%',          // Light cream
      'secondary-foreground': '0 0% 13%',
      'muted': '45 20% 95%',
      'muted-foreground': '0 0% 40%',
      'accent': '210 100% 45%',           // Editorial blue (traditional hyperlink)
      'accent-foreground': '0 0% 100%',
      'destructive': '0 84% 60%',
      'destructive-foreground': '0 0% 100%',
      'border': '0 0% 88%',
      'input': '0 0% 88%',
      'ring': '210 100% 45%',
      'card': '0 0% 100%',                // White cards on cream background
      'card-foreground': '0 0% 13%',
      'popover': '0 0% 100%',
      'popover-foreground': '0 0% 13%',
      'chart-1': '210 100% 45%',          // Blue
      'chart-2': '0 0% 13%',              // Black
      'chart-3': '45 80% 60%'             // Warm accent
    },
    spacing: {
      'xs': '0.375rem',                   // 6px - Slightly more spacious (was 4px)
      'sm': '0.75rem',                    // 12px - Comfortable (was 8px)
      'md': '1.25rem',                    // 20px - Reading-friendly (was 16px)
      'lg': '2rem',                       // 32px - Generous section spacing (was 28px)
      'xl': '3rem',                       // 48px - Clear article breaks (was 44px)
      '2xl': '5rem'                       // 80px - Major divisions (was 72px)
    },
    typography: {
      'font-sans': 'Georgia, Iowan Old Style, Times New Roman, serif',  // Classic Georgia serif
      'font-mono': 'JetBrains Mono, Courier, monospace',
      'font-serif': 'Georgia, Iowan Old Style, Times New Roman, serif'  // Classic reading serif
    },
    borderRadius: {
      'radius-sm': '0.25rem',             // Subtle, approachable
      'radius-md': '0.375rem',
      'radius-lg': '0.5rem'
    },
    shadows: {
      'shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
      'shadow-md': '0 3px 6px 0 rgba(0, 0, 0, 0.06)',
      'shadow-lg': '0 10px 20px 0 rgba(0, 0, 0, 0.08)'
    },
    sidebar: {
      'background': '0 0% 13%',           // Ink black sidebar
      'foreground': '0 0% 100%',
      'accent': '210 100% 45%',
      'accent-foreground': '0 0% 100%'
    },
    opacity: {
      'opacity-disabled': '0.4',
      'opacity-hover': '0.08',
      'opacity-selected': '0.12'
    },
    effects: {
      'backdrop-blur': 'blur(8px)'
    },
    colorTheme: 'minimal',
    fontFamily: 'georgia',
    visualFeel: 'classic'
  }
];