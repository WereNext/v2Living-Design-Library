export type Framework = 'css' | 'tailwind' | 'react' | 'vue' | 'svelte' | 'html' | 'json' | 'scss' | 'angular';
export type ViewMode = 'code' | 'preview';
export type ComponentType = 'buttons' | 'cards' | 'forms' | 'badges' | 'inputs' | 'sliders' | 'layout';

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

export const COMPONENT_OPTIONS: { value: ComponentType; label: string }[] = [
  { value: 'buttons', label: 'Buttons & Actions' },
  { value: 'cards', label: 'Cards & Containers' },
  { value: 'forms', label: 'Forms & Inputs' },
  { value: 'badges', label: 'Badges & Pills' },
  { value: 'inputs', label: 'Interactive Inputs' },
  { value: 'sliders', label: 'Sliders & Progress' },
  { value: 'layout', label: 'Layout Components' },
];
