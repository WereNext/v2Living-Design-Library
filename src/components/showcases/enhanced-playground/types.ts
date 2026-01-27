import { getAllShowcases, getShowcasesForIntent } from '../../../lib/component-registry';

export type Framework = 'css' | 'tailwind' | 'react' | 'vue' | 'svelte' | 'html' | 'json' | 'scss' | 'angular';
export type ViewMode = 'code' | 'preview';

export interface FrameworkOption {
  id: Framework;
  label: string;
  description: string;
}

export const FRAMEWORK_OPTIONS: FrameworkOption[] = [
  { id: 'react', label: 'React', description: 'React components with CSS vars' },
  { id: 'vue', label: 'Vue', description: 'Vue 3 composition API' },
  { id: 'svelte', label: 'Svelte', description: 'Svelte components' },
  { id: 'angular', label: 'Angular', description: 'Angular components' },
  { id: 'css', label: 'CSS Variables', description: 'Native CSS custom properties' },
  { id: 'tailwind', label: 'Tailwind', description: 'Tailwind config' },
  { id: 'scss', label: 'SCSS', description: 'SCSS variables' },
  { id: 'html', label: 'HTML/CSS', description: 'Plain HTML & CSS' },
  { id: 'json', label: 'JSON', description: 'Design tokens as JSON' },
];

/**
 * Get component options dynamically from the registry.
 * Excludes 'playground' since that's the container itself.
 * @param intentId - Optional intent ID to filter components by design intent
 */
export function getComponentOptions(intentId?: string): { value: string; label: string }[] {
  // If an intent is provided, get components for that intent
  const showcases = intentId
    ? getShowcasesForIntent(intentId)
    : getAllShowcases();

  return showcases
    .filter(showcase => showcase.id !== 'playground') // Exclude playground itself
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .map(showcase => ({
      value: showcase.id,
      label: showcase.name,
    }));
}

// Legacy type for backwards compatibility with existing preview components
export type LegacyComponentType = 'buttons' | 'cards' | 'forms' | 'badges' | 'inputs' | 'sliders' | 'layout';
