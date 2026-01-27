/**
 * Living Design Library - Web Components
 *
 * Framework-agnostic components that work everywhere.
 * Import the components you need, and they'll automatically register.
 *
 * @example
 * ```js
 * // Import all components
 * import '@living-design-library/components';
 *
 * // Or import specific components
 * import '@living-design-library/components/components/button';
 * import '@living-design-library/components/components/card';
 * ```
 *
 * @example HTML usage
 * ```html
 * <ldl-button variant="primary">Click me</ldl-button>
 * <ldl-card>
 *   <span slot="header">Title</span>
 *   Content here
 * </ldl-card>
 * ```
 */

// Base component (for extending)
export { LDLBaseComponent } from './utils/base-component.js';

// Components
export { LDLButton } from './components/button.js';
export type { ButtonVariant, ButtonSize } from './components/button.js';

export { LDLCard } from './components/card.js';

export { LDLInput } from './components/input.js';

export { LDLBadge } from './components/badge.js';
export type { BadgeVariant } from './components/badge.js';

// Re-export Lit utilities for consumers who want to extend
export { html, css, LitElement } from 'lit';
export { customElement, property, state, query } from 'lit/decorators.js';
