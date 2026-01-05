export interface Variable {
  id: string;
  name: string;
  value: string;
}

export interface DesignIntent {
  value: string;
  label: string;
}

export interface DesignSystemData {
  name: string;
  description?: string;
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

export interface TokenCounts {
  colors: number;
  spacing: number;
  typography: number;
  borderRadius: number;
  shadows: number;
}

export type VariableType = 'colors' | 'spacing' | 'typography' | 'borderRadius' | 'shadows';

export const PREDEFINED_INTENTS: DesignIntent[] = [
  { value: 'web-app', label: 'Web App' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'mobile', label: 'Mobile Experience' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'dashboard', label: 'Dashboard & Analytics' },
  { value: 'saas', label: 'SaaS Platform' },
  { value: 'social', label: 'Social Media' },
  { value: 'blog', label: 'Blog & Content' },
  { value: 'portfolio', label: 'Portfolio & Showcase' },
  { value: 'admin', label: 'Admin Panel' },
  { value: 'docs', label: 'Documentation' },
  { value: 'auth', label: 'Authentication' },
  { value: 'messaging', label: 'Messaging & Chat' },
  { value: 'calendar', label: 'Calendar & Scheduling' },
  { value: 'media', label: 'Media Gallery' },
  { value: 'forms', label: 'Forms & Surveys' },
];

export const QUICK_INTENTS = PREDEFINED_INTENTS.slice(0, 8);
