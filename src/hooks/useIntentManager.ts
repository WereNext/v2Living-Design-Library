import { useState, useEffect } from 'react';
import { STORAGE_KEYS, CATEGORY_IDS, INTENT_IDS } from '../lib/constants';

export interface ComponentCategory {
  name: string;
  icon: string;
  id: string;
}

export interface DesignIntent {
  id: string;
  label: string;
  description?: string;
  categories: ComponentCategory[];
  tokens?: unknown;
  isCustom?: boolean;
  createdAt?: string;
}

const STORAGE_KEY = STORAGE_KEYS.DESIGN_INTENTS;

const defaultIntents: DesignIntent[] = [
  {
    id: 'web-app',
    label: 'Web App',
    description: 'Components optimized for web applications',
    categories: [
      { name: "Code Playground", icon: "Code2", id: "playground" },
      { name: "Buttons & Actions", icon: "Mouse", id: "buttons" },
      { name: "Forms & Inputs", icon: "Type", id: "forms" },
      { name: "Layout Components", icon: "Layout", id: "layout" },
      { name: "Overlays & Dialogs", icon: "Box", id: "overlays" },
      { name: "Navigation", icon: "Menu", id: "navigation" },
      { name: "Data Display", icon: "Palette", id: "data" },
      { name: "AI Components", icon: "Sparkles", id: "ai" }
    ],
    isCustom: false
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    description: 'Components for online stores and marketplaces',
    categories: [
      { name: "Code Playground", icon: "Code2", id: "playground" },
      { name: "Product Cards", icon: "ShoppingBag", id: "product-cards" },
      { name: "Shopping Cart", icon: "ShoppingBag", id: "shopping-cart" },
      { name: "Checkout Flow", icon: "CreditCard", id: "checkout" },
      { name: "Reviews & Ratings", icon: "Star", id: "reviews" },
      { name: "Filters & Search", icon: "Filter", id: "filters" },
      { name: "Buttons & Actions", icon: "Mouse", id: "buttons" },
      { name: "Forms & Inputs", icon: "Type", id: "forms" }
    ],
    isCustom: false
  },
  {
    id: 'mobile',
    label: 'Mobile Experience',
    description: 'Touch-optimized components for mobile apps',
    categories: [
      { name: "Code Playground", icon: "Code2", id: "playground" },
      { name: "Bottom Navigation", icon: "Menu", id: "bottom-nav" },
      { name: "Swipe Actions", icon: "Hand", id: "swipe-actions" },
      { name: "Pull to Refresh", icon: "RefreshCw", id: "pull-refresh" },
      { name: "Mobile Menu", icon: "AlignLeft", id: "mobile-menu" },
      { name: "Touch Gestures", icon: "Zap", id: "touch-gestures" },
      { name: "Mobile Forms", icon: "Smartphone", id: "mobile-forms" },
      { name: "Buttons & Actions", icon: "Mouse", id: "buttons" }
    ],
    isCustom: false
  },
  {
    id: 'landing',
    label: 'Landing Page',
    description: 'Marketing and conversion-focused components',
    categories: [
      { name: "Code Playground", icon: "Code2", id: "playground" },
      { name: "Hero Sections", icon: "Megaphone", id: "hero" },
      { name: "CTA Blocks", icon: "Mouse", id: "cta-blocks" },
      { name: "Testimonials", icon: "MessageSquare", id: "testimonials" },
      { name: "Pricing Tables", icon: "DollarSign", id: "pricing" },
      { name: "Feature Grids", icon: "Grid3x3", id: "features" },
      { name: "Email Capture", icon: "Mail", id: "email-capture" },
      { name: "Buttons & Actions", icon: "Mouse", id: "buttons" }
    ],
    isCustom: false
  }
];

export function useIntentManager() {
  const [intents, setIntents] = useState<DesignIntent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure we always have base intents
        const customIntents = parsed.filter((i: DesignIntent) => i.isCustom);
        return [...defaultIntents, ...customIntents];
      }
    } catch (error) {
      console.error('Error loading intents:', error);
    }
    return defaultIntents;
  });

  useEffect(() => {
    try {
      // Only save custom intents to localStorage
      const customIntents = intents.filter(i => i.isCustom);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customIntents));
    } catch (error) {
      console.error('Error saving intents:', error);
    }
  }, [intents]);

  const addIntent = (intent: Omit<DesignIntent, 'isCustom' | 'createdAt'>) => {
    const newIntent: DesignIntent = {
      ...intent,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    setIntents(prev => [...prev, newIntent]);
    return newIntent;
  };

  const updateIntent = (id: string, updates: Partial<DesignIntent>) => {
    setIntents(prev => prev.map(intent => 
      intent.id === id ? { ...intent, ...updates } : intent
    ));
  };

  const deleteIntent = (id: string) => {
    setIntents(prev => prev.filter(intent => intent.id !== id));
  };

  const getIntent = (id: string) => {
    return intents.find(intent => intent.id === id);
  };

  return {
    intents,
    addIntent,
    updateIntent,
    deleteIntent,
    getIntent
  };
}
