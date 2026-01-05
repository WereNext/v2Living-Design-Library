import { Theme } from '../hooks/useDesignSystems';

// Material Design System Themes
// A complete alternative design system with Material-inspired themes

export const MATERIAL_THEMES: Theme[] = [
  // Material Light
  {
    id: 'material-light',
    name: 'Material Light',
    description: 'Google Material Design 3 light theme',
    colors: {
      'background': '0 0% 98%',
      'foreground': '240 10% 10%',
      'primary': '259 94% 51%',
      'primary-foreground': '0 0% 100%',
      'secondary': '186 100% 42%',
      'secondary-foreground': '0 0% 100%',
      'muted': '240 5% 96%',
      'muted-foreground': '240 4% 46%',
      'accent': '339 90% 51%',
      'accent-foreground': '0 0% 100%',
      'destructive': '4 90% 58%',
      'destructive-foreground': '0 0% 100%',
      'border': '240 6% 90%',
      'input': '240 6% 90%',
      'ring': '259 94% 51%',
      'card': '0 0% 100%',
      'card-foreground': '240 10% 10%',
      'popover': '0 0% 100%',                 // Light popover background
      'popover-foreground': '240 10% 10%',    // Dark text for light background
      'chart-1': '259 94% 51%',
      'chart-2': '186 100% 42%',
      'chart-3': '339 90% 51%'
    },
    spacing: {
      'xs': '0.25rem',
      'sm': '0.5rem',
      'md': '1rem',
      'lg': '1.5rem',
      'xl': '2rem',
      '2xl': '3rem'
    },
    typography: {
      'font-sans': 'Roboto, system-ui, sans-serif',
      'font-mono': 'Roboto Mono, monospace',
      'font-serif': 'Roboto Slab, serif'
    },
    borderRadius: {
      'radius-sm': '0.25rem',
      'radius-md': '0.5rem',
      'radius-lg': '1rem',
      'radius-xl': '1.75rem'
    },
    shadows: {
      'shadow-sm': '0 1px 3px 0 rgb(0 0 0 / 0.12), 0 1px 2px 0 rgb(0 0 0 / 0.14)',
      'shadow-md': '0 3px 6px rgb(0 0 0 / 0.15), 0 3px 6px rgb(0 0 0 / 0.18)',
      'shadow-lg': '0 10px 20px rgb(0 0 0 / 0.19), 0 6px 6px rgb(0 0 0 / 0.20)'
    },
    sidebar: {
      'background': 'hsl(0 0% 98%)',
      'foreground': 'hsl(240 6% 10%)',
      'primary': 'hsl(259 94% 51%)',
      'primary-foreground': 'hsl(0 0% 100%)',
      'accent': 'hsl(0 0% 96%)',
      'accent-foreground': 'hsl(240 6% 10%)',
      'border': 'hsl(240 6% 90%)',
      'ring': 'hsl(259 94% 51%)'
    },
    colorTheme: 'neo',
    fontFamily: 'system',
    visualFeel: 'modern'
  },

  // Material Ocean
  {
    id: 'material-ocean',
    name: 'Material Ocean',
    description: 'Deep blue ocean-inspired Material theme',
    colors: {
      'background': '210 100% 97%',
      'foreground': '210 50% 10%',
      'primary': '200 98% 39%',
      'primary-foreground': '0 0% 100%',
      'secondary': '180 77% 47%',
      'secondary-foreground': '0 0% 100%',
      'muted': '210 40% 94%',
      'muted-foreground': '210 20% 46%',
      'accent': '165 82% 51%',
      'accent-foreground': '0 0% 100%',
      'destructive': '14 91% 51%',
      'destructive-foreground': '0 0% 100%',
      'border': '210 30% 88%',
      'input': '210 30% 88%',
      'ring': '200 98% 39%',
      'card': '0 0% 100%',
      'card-foreground': '210 50% 10%',
      'popover': '0 0% 100%',                 // Light popover background
      'popover-foreground': '210 50% 10%',    // Dark text for light background
      'chart-1': '200 98% 39%',
      'chart-2': '180 77% 47%',
      'chart-3': '165 82% 51%'
    },
    spacing: {
      'xs': '0.25rem',
      'sm': '0.5rem',
      'md': '1rem',
      'lg': '1.5rem',
      'xl': '2rem',
      '2xl': '3rem'
    },
    typography: {
      'font-sans': 'Roboto, system-ui, sans-serif',
      'font-mono': 'Roboto Mono, monospace',
      'font-serif': 'Roboto Slab, serif'
    },
    borderRadius: {
      'radius-sm': '0.25rem',
      'radius-md': '0.5rem',
      'radius-lg': '1rem',
      'radius-xl': '1.75rem'
    },
    shadows: {
      'shadow-sm': '0 1px 3px 0 rgb(0 100 200 / 0.12), 0 1px 2px 0 rgb(0 100 200 / 0.15)',
      'shadow-md': '0 3px 6px rgb(0 100 200 / 0.16), 0 3px 6px rgb(0 100 200 / 0.2)',
      'shadow-lg': '0 10px 20px rgb(0 100 200 / 0.19), 0 6px 6px rgb(0 100 200 / 0.23)'
    },
    sidebar: {
      'background': 'hsl(210 100% 95%)',
      'foreground': 'hsl(210 50% 10%)',
      'primary': 'hsl(200 98% 39%)',
      'primary-foreground': 'hsl(0 0% 100%)',
      'accent': 'hsl(210 40% 94%)',
      'accent-foreground': 'hsl(210 50% 10%)',
      'border': 'hsl(210 30% 88%)',
      'ring': 'hsl(200 98% 39%)'
    },
    colorTheme: 'neo',
    fontFamily: 'system',
    visualFeel: 'modern'
  },

  // Material Sunset
  {
    id: 'material-sunset',
    name: 'Material Sunset',
    description: 'Warm sunset gradient-inspired Material theme',
    colors: {
      'background': '30 100% 98%',
      'foreground': '20 30% 15%',
      'primary': '14 100% 57%',
      'primary-foreground': '0 0% 100%',
      'secondary': '340 82% 52%',
      'secondary-foreground': '0 0% 100%',
      'muted': '30 40% 94%',
      'muted-foreground': '30 20% 46%',
      'accent': '45 97% 54%',
      'accent-foreground': '20 30% 15%',
      'destructive': '0 91% 51%',
      'destructive-foreground': '0 0% 100%',
      'border': '30 30% 88%',
      'input': '30 30% 88%',
      'ring': '14 100% 57%',
      'card': '0 0% 100%',
      'card-foreground': '20 30% 15%',
      'popover': '0 0% 100%',                 // Light popover background
      'popover-foreground': '20 30% 15%',     // Dark text for light background
      'chart-1': '14 100% 57%',
      'chart-2': '340 82% 52%',
      'chart-3': '45 97% 54%'
    },
    spacing: {
      'xs': '0.25rem',
      'sm': '0.5rem',
      'md': '1rem',
      'lg': '1.5rem',
      'xl': '2rem',
      '2xl': '3rem'
    },
    typography: {
      'font-sans': 'Roboto, system-ui, sans-serif',
      'font-mono': 'Roboto Mono, monospace',
      'font-serif': 'Roboto Slab, serif'
    },
    borderRadius: {
      'radius-sm': '0.25rem',
      'radius-md': '0.5rem',
      'radius-lg': '1rem',
      'radius-xl': '1.75rem'
    },
    shadows: {
      'shadow-sm': '0 1px 3px 0 rgb(255 87 34 / 0.12), 0 1px 2px 0 rgb(255 87 34 / 0.15)',
      'shadow-md': '0 3px 6px rgb(255 87 34 / 0.16), 0 3px 6px rgb(255 87 34 / 0.2)',
      'shadow-lg': '0 10px 20px rgb(255 87 34 / 0.19), 0 6px 6px rgb(255 87 34 / 0.23)'
    },
    sidebar: {
      'background': 'hsl(30 100% 96%)',
      'foreground': 'hsl(20 30% 15%)',
      'primary': 'hsl(14 100% 57%)',
      'primary-foreground': 'hsl(0 0% 100%)',
      'accent': 'hsl(30 40% 94%)',
      'accent-foreground': 'hsl(20 30% 15%)',
      'border': 'hsl(30 30% 88%)',
      'ring': 'hsl(14 100% 57%)'
    },
    colorTheme: 'neo',
    fontFamily: 'system',
    visualFeel: 'modern'
  }
];