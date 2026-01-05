import { Theme } from '../hooks/useDesignSystems';

// Default themes for the design system
// These correspond to the Theme Customizer presets

export const DEFAULT_THEMES: Theme[] = [
  // Apple Human Interface Theme
  {
    id: 'apple-theme',
    name: 'Apple Human Interface',
    description: 'Frosted glass, subtle elegance, refined design',
    colors: {
      'background': '0 0% 100%',
      'foreground': '240 10% 3.9%',
      'primary': '221.2 83.2% 53.3%',
      'primary-foreground': '210 40% 98%',
      'secondary': '210 40% 96.1%',
      'secondary-foreground': '222.2 47.4% 11.2%',
      'muted': '210 40% 96.1%',
      'muted-foreground': '215.4 16.3% 46.9%',
      'accent': '210 40% 96.1%',
      'accent-foreground': '222.2 47.4% 11.2%',
      'destructive': '0 84.2% 60.2%',
      'destructive-foreground': '210 40% 98%',
      'border': '214.3 31.8% 91.4%',
      'input': '214.3 31.8% 91.4%',
      'ring': '221.2 83.2% 53.3%',
      'card': '0 0% 100%',
      'card-foreground': '240 10% 3.9%',
      'popover': '0 0% 100%',                 // Light popover background
      'popover-foreground': '240 10% 3.9%',   // Dark text for light background
      'chart-1': '221.2 83.2% 53.3%',
      'chart-2': '142.1 76.2% 36.3%',
      'chart-3': '346.8 77.2% 49.8%'
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
      'font-sans': 'Inter, system-ui, sans-serif',
      'font-mono': 'JetBrains Mono, monospace',
      'font-serif': 'Georgia, serif'
    },
    borderRadius: {
      'radius-sm': '0.5rem',
      'radius-md': '0.75rem',
      'radius-lg': '1rem',
      'radius-xl': '1.25rem'
    },
    shadows: {
      'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)'
    },
    sidebar: {
      'background': 'hsl(210 40% 98%)',
      'foreground': 'hsl(240 10% 3.9%)',
      'primary': 'hsl(221.2 83.2% 53.3%)',
      'primary-foreground': 'hsl(210 40% 98%)',
      'accent': 'hsl(210 40% 96.1%)',
      'accent-foreground': 'hsl(222.2 47.4% 11.2%)',
      'border': 'hsl(214.3 31.8% 91.4%)',
      'ring': 'hsl(221.2 83.2% 53.3%)'
    },
    componentStyles: {
      button: {
        showBorder: false,
        showIcons: false
      },
      chip: {
        showBorder: false,
        showIcons: false
      }
    },
    colorTheme: 'glassmorphism',
    fontFamily: 'inter',
    visualFeel: 'minimal'
  },

  // Warm Earth Theme (replacing shadcn/ui duplicate)
  {
    id: 'earth-theme',
    name: 'Warm Earth',
    description: 'Natural tones, organic warmth, grounded design',
    colors: {
      'background': '30 20% 96%',
      'foreground': '25 30% 20%',
      'primary': '25 75% 45%',
      'primary-foreground': '30 20% 96%',
      'secondary': '35 40% 88%',
      'secondary-foreground': '25 30% 20%',
      'muted': '30 15% 90%',
      'muted-foreground': '25 15% 45%',
      'accent': '40 60% 50%',
      'accent-foreground': '30 20% 96%',
      'destructive': '10 80% 45%',
      'destructive-foreground': '30 20% 96%',
      'border': '30 20% 85%',
      'input': '30 20% 85%',
      'ring': '25 75% 45%',
      'card': '35 25% 98%',
      'card-foreground': '25 30% 20%',
      'popover': '35 25% 98%',               // Light popover background
      'popover-foreground': '25 30% 20%',    // Dark text for light background
      'chart-1': '25 75% 45%',
      'chart-2': '120 40% 35%',
      'chart-3': '40 60% 50%'
    },
    spacing: {
      'xs': '0.375rem',
      'sm': '0.625rem',
      'md': '1rem',
      'lg': '1.75rem',
      'xl': '2.5rem',
      '2xl': '3.5rem'
    },
    typography: {
      'font-sans': 'Georgia, serif',
      'font-mono': 'Courier New, monospace',
      'font-serif': 'Georgia, serif'
    },
    borderRadius: {
      'radius-sm': '0.25rem',
      'radius-md': '0.375rem',
      'radius-lg': '0.5rem',
      'radius-xl': '0.75rem'
    },
    shadows: {
      'shadow-sm': '0 1px 3px 0 rgb(101 67 33 / 0.1)',
      'shadow-md': '0 4px 8px -2px rgb(101 67 33 / 0.15)',
      'shadow-lg': '0 12px 24px -4px rgb(101 67 33 / 0.2)'
    },
    sidebar: {
      'background': 'hsl(30 15% 92%)',
      'foreground': 'hsl(25 30% 20%)',
      'primary': 'hsl(25 75% 45%)',
      'primary-foreground': 'hsl(30 20% 96%)',
      'accent': 'hsl(35 40% 88%)',
      'accent-foreground': 'hsl(25 30% 20%)',
      'border': 'hsl(30 20% 85%)',
      'ring': 'hsl(25 75% 45%)'
    },
    colorTheme: 'neo',
    fontFamily: 'playfairDisplay',
    visualFeel: 'classic'
  },

  // Brutalist Theme
  {
    id: 'brutalist-theme',
    name: 'Brutalist',
    description: 'Raw blacks, sharp edges, monospace typography',
    colors: {
      'background': '0 0% 100%',
      'foreground': '0 0% 0%',
      'primary': '0 0% 0%',
      'primary-foreground': '0 0% 100%',
      'secondary': '0 0% 96%',
      'secondary-foreground': '0 0% 0%',
      'muted': '0 0% 96%',
      'muted-foreground': '0 0% 45%',
      'accent': '0 0% 96%',
      'accent-foreground': '0 0% 0%',
      'destructive': '0 100% 50%',
      'destructive-foreground': '0 0% 100%',
      'border': '0 0% 90%',
      'input': '0 0% 90%',
      'ring': '0 0% 0%',
      'card': '0 0% 100%',
      'card-foreground': '0 0% 0%',
      'popover': '0 0% 100%',                 // Light popover background
      'popover-foreground': '0 0% 0%',        // Dark text for light background
      'chart-1': '0 0% 20%',
      'chart-2': '0 0% 40%',
      'chart-3': '0 0% 60%'
    },
    spacing: {
      'xs': '0.5rem',    // Larger minimum spacing for brutalist feel
      'sm': '1rem',      // Double normal spacing
      'md': '1.5rem',    // Larger gaps
      'lg': '2rem',      // Bold spacing
      'xl': '3rem',      // Extra chunky
      '2xl': '4rem'      // Massive spacing
    },
    typography: {
      'font-sans': 'JetBrains Mono, monospace',
      'font-mono': 'JetBrains Mono, monospace',
      'font-serif': 'Courier New, monospace'
    },
    borderRadius: {
      'radius-sm': '0',
      'radius-md': '0',
      'radius-lg': '0',
      'radius-xl': '0'
    },
    shadows: {
      'shadow-sm': '2px 2px 0 rgb(0 0 0)',
      'shadow-md': '4px 4px 0 rgb(0 0 0)',
      'shadow-lg': '6px 6px 0 rgb(0 0 0)'
    },
    sidebar: {
      'background': 'hsl(0 0% 95%)',
      'foreground': 'hsl(0 0% 0%)',
      'primary': 'hsl(0 0% 0%)',
      'primary-foreground': 'hsl(0 0% 100%)',
      'accent': 'hsl(0 0% 90%)',
      'accent-foreground': 'hsl(0 0% 0%)',
      'border': 'hsl(0 0% 0%)',
      'ring': 'hsl(0 0% 0%)'
    },
    componentStyles: {
      button: {
        showBorder: false,
        showIcons: false
      },
      chip: {
        showBorder: false,
        showIcons: false
      }
    },
    colorTheme: 'brutalist',
    fontFamily: 'jetbrainsMono',
    visualFeel: 'bold'
  },

  // Candy Pop Theme
  {
    id: 'candy-theme',
    name: 'Candy Pop',
    description: 'Pastel colors, soft rounds, playful fonts',
    colors: {
      'background': '330 100% 98%',
      'foreground': '330 40% 20%',
      'primary': '330 81% 60%',
      'primary-foreground': '0 0% 100%',
      'secondary': '200 50% 90%',
      'secondary-foreground': '200 40% 20%',
      'muted': '330 50% 95%',
      'muted-foreground': '330 20% 50%',
      'accent': '180 65% 85%',
      'accent-foreground': '180 40% 20%',
      'destructive': '0 80% 65%',
      'destructive-foreground': '0 0% 100%',
      'border': '330 30% 90%',
      'input': '330 30% 90%',
      'ring': '330 81% 60%',
      'card': '330 100% 98%',
      'card-foreground': '330 40% 20%',
      'popover': '330 100% 98%',              // Light popover background
      'popover-foreground': '330 40% 20%',    // Dark text for light background
      'chart-1': '330 81% 60%',
      'chart-2': '180 65% 65%',
      'chart-3': '45 90% 70%'
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
      'font-sans': 'Poppins, sans-serif',
      'font-mono': 'JetBrains Mono, monospace',
      'font-serif': 'Georgia, serif'
    },
    borderRadius: {
      'radius-sm': '0.75rem',
      'radius-md': '1rem',
      'radius-lg': '1.5rem',
      'radius-xl': '2rem'
    },
    shadows: {
      'shadow-sm': '0 2px 4px rgb(255 105 180 / 0.15)',
      'shadow-md': '0 4px 8px rgb(255 105 180 / 0.2)',
      'shadow-lg': '0 8px 16px rgb(255 105 180 / 0.25)'
    },
    sidebar: {
      'background': 'hsl(330 50% 96%)',
      'foreground': 'hsl(330 40% 20%)',
      'primary': 'hsl(330 81% 60%)',
      'primary-foreground': 'hsl(0 0% 100%)',
      'accent': 'hsl(330 50% 93%)',
      'accent-foreground': 'hsl(330 40% 20%)',
      'border': 'hsl(330 30% 90%)',
      'ring': 'hsl(330 81% 60%)'
    },
    componentStyles: {
      button: {
        showBorder: false,
        showIcons: false
      },
      chip: {
        showBorder: false,
        showIcons: false
      }
    },
    colorTheme: 'candy',
    fontFamily: 'poppins',
    visualFeel: 'playful'
  },

  // Cyberpunk Theme
  {
    id: 'cyber-theme',
    name: 'Cyberpunk',
    description: 'Neon accents, dark theme, futuristic geometric type',
    colors: {
      'background': '240 50% 8%',              // Dark blue-black with HIGH saturation
      'foreground': '180 100% 90%',
      'primary': '315 100% 50%',
      'primary-foreground': '0 0% 100%',
      'secondary': '240 70% 15%',              // VERY saturated dark blue
      'secondary-foreground': '180 100% 90%',
      'muted': '240 60% 12%',                  // High saturation
      'muted-foreground': '240 40% 70%',
      'accent': '240 70% 18%',                 // VERY saturated dark blue
      'accent-foreground': '180 100% 70%',
      'destructive': '0 100% 60%',
      'destructive-foreground': '0 0% 100%',
      'border': '240 70% 25%',                 // Visible blue border
      'input': '240 70% 15%',
      'ring': '315 100% 50%',
      'card': '240 60% 10%',                   // Saturated blue card
      'card-foreground': '180 100% 90%',
      'popover': '240 60% 10%',
      'popover-foreground': '180 100% 90%',
      'chart-1': '315 100% 50%',
      'chart-2': '180 100% 50%',
      'chart-3': '60 100% 50%'
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
      'font-sans': 'Space Grotesk, sans-serif',
      'font-mono': 'JetBrains Mono, monospace',
      'font-serif': 'Georgia, serif'
    },
    borderRadius: {
      'radius-sm': '0.125rem',
      'radius-md': '0.25rem',
      'radius-lg': '0.5rem',
      'radius-xl': '0.75rem'
    },
    shadows: {
      'shadow-sm': '0 0 10px rgb(255 0 255 / 0.5)',
      'shadow-md': '0 0 20px rgb(255 0 255 / 0.6)',
      'shadow-lg': '0 0 30px rgb(255 0 255 / 0.7)'
    },
    sidebar: {
      'background': 'hsl(240 10% 5%)',
      'foreground': 'hsl(180 100% 90%)',
      'primary': 'hsl(315 100% 50%)',
      'primary-foreground': 'hsl(0 0% 100%)',
      'accent': 'hsl(240 10% 12%)',
      'accent-foreground': 'hsl(180 100% 90%)',
      'border': 'hsl(315 100% 50%)',
      'ring': 'hsl(315 100% 50%)'
    },
    componentStyles: {
      button: {
        showBorder: false,
        showIcons: false
      },
      chip: {
        showBorder: false,
        showIcons: false
      }
    },
    colorTheme: 'cyberpunk',
    fontFamily: 'spaceGrotesk',
    visualFeel: 'bold'
  },

  // Midnight Theme
  {
    id: 'midnight-theme',
    name: 'Midnight',
    description: 'Deep dark elegance, sophisticated tones',
    colors: {
      'background': '222 60% 9%',              // Higher saturation dark blue
      'foreground': '210 40% 98%',
      'primary': '210 100% 50%',
      'primary-foreground': '222 60% 9%',
      'secondary': '220 60% 16%',              // VERY saturated dark blue surface
      'secondary-foreground': '210 40% 98%',
      'muted': '220 55% 14%',                  // High saturation
      'muted-foreground': '215 40% 65%',
      'accent': '220 60% 18%',                 // VERY saturated dark blue surface
      'accent-foreground': '210 40% 98%',
      'destructive': '0 70% 40%',
      'destructive-foreground': '210 40% 98%',
      'border': '220 60% 22%',                 // Visible blue border
      'input': '220 60% 16%',
      'ring': '210 100% 50%',
      'card': '222 55% 11%',                   // Saturated blue card
      'card-foreground': '210 40% 98%',
      'popover': '222 55% 13%',
      'popover-foreground': '210 40% 98%',
      'chart-1': '210 100% 50%',
      'chart-2': '160 60% 45%',
      'chart-3': '30 80% 55%'
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
      'font-sans': 'Inter, system-ui, sans-serif',
      'font-mono': 'JetBrains Mono, monospace',
      'font-serif': 'Georgia, serif'
    },
    borderRadius: {
      'radius-sm': '0.375rem',
      'radius-md': '0.5rem',
      'radius-lg': '0.75rem',
      'radius-xl': '1rem'
    },
    shadows: {
      'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.5)',
      'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.5)',
      'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.5)'
    },
    sidebar: {
      'background': 'hsl(222 47% 8%)',
      'foreground': 'hsl(210 40% 98%)',
      'primary': 'hsl(210 100% 50%)',
      'primary-foreground': 'hsl(222 47% 11%)',
      'accent': 'hsl(217.2 32.6% 14%)',
      'accent-foreground': 'hsl(210 40% 98%)',
      'border': 'hsl(217.2 32.6% 17.5%)',
      'ring': 'hsl(210 100% 50%)'
    },
    componentStyles: {
      button: {
        showBorder: false,
        showIcons: false
      },
      chip: {
        showBorder: false,
        showIcons: false
      }
    },
    colorTheme: 'midnight',
    fontFamily: 'inter',
    visualFeel: 'minimal'
  }
];