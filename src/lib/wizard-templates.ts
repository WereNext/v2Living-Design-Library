import type { DesignTokens } from "../types/design-tokens";

export interface WizardTemplate {
  key: string;
  name: string;
  description: string;
  tokens: DesignTokens;
}

export const WIZARD_TEMPLATES: Record<string, DesignTokens> = {
  minimal: {
    colors: {
      'primary': '0 0% 0%',
      'primary-foreground': '0 0% 100%',
      'secondary': '0 0% 96%',
      'secondary-foreground': '0 0% 9%',
      'background': '0 0% 100%',
      'foreground': '0 0% 3.9%',
      'card': '0 0% 100%',
      'card-foreground': '0 0% 3.9%',
      'muted': '0 0% 96.1%',
      'muted-foreground': '0 0% 45.1%',
      'border': '0 0% 89.8%',
      'accent': '0 0% 96.1%',
      'accent-foreground': '0 0% 9%',
    },
    spacing: {
      'space-xs': '4px',
      'space-sm': '8px',
      'space-md': '16px',
      'space-lg': '24px',
      'space-xl': '32px',
    },
    borderRadius: {
      'radius-sm': '2px',
      'radius-md': '4px',
      'radius-lg': '6px',
    },
    shadows: {
      'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  },
  colorful: {
    colors: {
      'primary': '262 83% 58%',
      'primary-foreground': '0 0% 100%',
      'secondary': '340 82% 52%',
      'secondary-foreground': '0 0% 100%',
      'background': '0 0% 100%',
      'foreground': '224 71% 4%',
      'card': '0 0% 100%',
      'card-foreground': '224 71% 4%',
      'muted': '220 14% 96%',
      'muted-foreground': '220 9% 46%',
      'border': '220 13% 91%',
      'accent': '220 14% 96%',
      'accent-foreground': '220 9% 46%',
    },
    spacing: {
      'space-xs': '6px',
      'space-sm': '12px',
      'space-md': '20px',
      'space-lg': '32px',
      'space-xl': '48px',
    },
    borderRadius: {
      'radius-sm': '8px',
      'radius-md': '12px',
      'radius-lg': '16px',
    },
    shadows: {
      'shadow-sm': '0 2px 4px 0 rgb(0 0 0 / 0.08)',
      'shadow-md': '0 6px 12px -2px rgb(0 0 0 / 0.12)',
      'shadow-lg': '0 12px 24px -4px rgb(0 0 0 / 0.16)',
    },
  },
  modern: {
    colors: {
      'primary': '221 83% 53%',
      'primary-foreground': '210 40% 98%',
      'secondary': '210 40% 96%',
      'secondary-foreground': '222 47% 11%',
      'background': '0 0% 100%',
      'foreground': '222 84% 5%',
      'card': '0 0% 100%',
      'card-foreground': '222 84% 5%',
      'muted': '210 40% 96%',
      'muted-foreground': '215 16% 47%',
      'border': '214 32% 91%',
      'accent': '210 40% 96%',
      'accent-foreground': '222 47% 11%',
    },
    spacing: {
      'space-xs': '4px',
      'space-sm': '8px',
      'space-md': '16px',
      'space-lg': '24px',
      'space-xl': '40px',
    },
    borderRadius: {
      'radius-sm': '6px',
      'radius-md': '10px',
      'radius-lg': '14px',
    },
    shadows: {
      'shadow-sm': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      'shadow-md': '0 4px 8px -2px rgb(0 0 0 / 0.1)',
      'shadow-lg': '0 10px 20px -5px rgb(0 0 0 / 0.1)',
    },
  },
};

export const DEFAULT_MANUAL_TOKENS: DesignTokens = {
  colors: {
    'primary': '240 100% 50%',
    'background': '0 0% 100%',
    'foreground': '0 0% 0%',
  },
  typography: {
    'font-base': '16px',
    'font-lg': '18px',
  },
  spacing: {
    'space-sm': '8px',
    'space-md': '16px',
  },
  borderRadius: {
    'radius-sm': '4px',
    'radius-md': '8px',
  },
};

export function getTemplateDisplayName(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function createSystemNameFromTemplate(templateKey: string): string {
  return `${getTemplateDisplayName(templateKey)} Design System`;
}

export function createSystemDescriptionFromTemplate(templateKey: string): string {
  return `A ${templateKey} design system created from template`;
}
