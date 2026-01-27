import { html, css, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LDLBaseComponent } from '../utils/base-component.js';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

/**
 * @element ldl-button
 * @description A versatile button component that consumes design tokens.
 *
 * @slot - Button content (text, icons, etc.)
 *
 * @csspart button - The native button element
 *
 * @cssprop --ldl-color-primary - Primary button background
 * @cssprop --ldl-color-primary-foreground - Primary button text
 * @cssprop --ldl-radius-md - Button border radius
 *
 * @example
 * ```html
 * <ldl-button>Click me</ldl-button>
 * <ldl-button variant="destructive">Delete</ldl-button>
 * <ldl-button variant="outline" size="lg">Large Outline</ldl-button>
 * ```
 */
@customElement('ldl-button')
export class LDLButton extends LDLBaseComponent {
  static styles: CSSResultGroup = [
    LDLBaseComponent.baseStyles,
    css`
      :host {
        display: inline-flex;
      }

      button {
        /* Reset */
        appearance: none;
        border: none;
        background: none;
        cursor: pointer;
        font-family: inherit;

        /* Base styles */
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--ldl-space-sm, 0.5rem);
        white-space: nowrap;
        font-family: var(--ldl-font-family, system-ui);
        font-size: var(--ldl-font-size-sm, 0.875rem);
        font-weight: var(--ldl-font-weight-medium, 500);
        line-height: var(--ldl-line-height, 1.5);
        border-radius: var(--ldl-radius-md, 0.375rem);
        transition: all var(--ldl-transition-fast, 150ms ease);

        /* Default size (md) */
        height: 2.5rem;
        padding: 0 var(--ldl-space-md, 1rem);

        /* Focus ring */
        outline: none;
      }

      button:focus-visible {
        outline: 2px solid var(--ldl-color-ring, hsl(221, 83%, 53%));
        outline-offset: 2px;
      }

      button:disabled {
        pointer-events: none;
        opacity: 0.5;
      }

      /* ==============================
         VARIANT STYLES
         ============================== */

      /* Default (Primary) */
      :host([variant="default"]) button,
      :host(:not([variant])) button {
        background-color: var(--ldl-color-primary, hsl(221, 83%, 53%));
        color: var(--ldl-color-primary-foreground, white);
      }

      :host([variant="default"]) button:hover,
      :host(:not([variant])) button:hover {
        background-color: color-mix(in srgb, var(--ldl-color-primary) 90%, black);
      }

      /* Destructive */
      :host([variant="destructive"]) button {
        background-color: var(--ldl-color-destructive, hsl(0, 84%, 60%));
        color: var(--ldl-color-destructive-foreground, white);
      }

      :host([variant="destructive"]) button:hover {
        background-color: color-mix(in srgb, var(--ldl-color-destructive) 90%, black);
      }

      /* Outline */
      :host([variant="outline"]) button {
        background-color: transparent;
        border: 1px solid var(--ldl-color-border, hsl(214, 32%, 91%));
        color: var(--ldl-color-foreground, hsl(222, 47%, 11%));
      }

      :host([variant="outline"]) button:hover {
        background-color: var(--ldl-color-accent, hsl(210, 40%, 96%));
        color: var(--ldl-color-accent-foreground, hsl(222, 47%, 11%));
      }

      /* Secondary */
      :host([variant="secondary"]) button {
        background-color: var(--ldl-color-secondary, hsl(210, 40%, 96%));
        color: var(--ldl-color-secondary-foreground, hsl(222, 47%, 11%));
      }

      :host([variant="secondary"]) button:hover {
        background-color: color-mix(in srgb, var(--ldl-color-secondary) 80%, black 5%);
      }

      /* Ghost */
      :host([variant="ghost"]) button {
        background-color: transparent;
        color: var(--ldl-color-foreground, hsl(222, 47%, 11%));
      }

      :host([variant="ghost"]) button:hover {
        background-color: var(--ldl-color-accent, hsl(210, 40%, 96%));
        color: var(--ldl-color-accent-foreground, hsl(222, 47%, 11%));
      }

      /* Link */
      :host([variant="link"]) button {
        background-color: transparent;
        color: var(--ldl-color-primary, hsl(221, 83%, 53%));
        text-decoration: underline;
        text-underline-offset: 4px;
      }

      :host([variant="link"]) button:hover {
        text-decoration: underline;
      }

      /* ==============================
         SIZE STYLES
         ============================== */

      :host([size="sm"]) button {
        height: 2rem;
        padding: 0 var(--ldl-space-sm, 0.5rem);
        font-size: var(--ldl-font-size-xs, 0.75rem);
        border-radius: var(--ldl-radius-sm, 0.25rem);
      }

      :host([size="lg"]) button {
        height: 3rem;
        padding: 0 var(--ldl-space-lg, 1.5rem);
        font-size: var(--ldl-font-size-base, 1rem);
        border-radius: var(--ldl-radius-lg, 0.5rem);
      }

      :host([size="icon"]) button {
        height: 2.5rem;
        width: 2.5rem;
        padding: 0;
      }

      /* ==============================
         FULL WIDTH
         ============================== */

      :host([full]) {
        display: flex;
        width: 100%;
      }

      :host([full]) button {
        width: 100%;
      }
    `
  ];

  /** Button variant */
  @property({ type: String, reflect: true })
  variant: ButtonVariant = 'default';

  /** Button size */
  @property({ type: String, reflect: true })
  size: ButtonSize = 'md';

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Button type (submit, button, reset) */
  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  /** Full width button */
  @property({ type: Boolean, reflect: true })
  full = false;

  /** Loading state */
  @property({ type: Boolean, reflect: true })
  loading = false;

  render() {
    return html`
      <button
        part="button"
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-disabled=${this.disabled || this.loading}
        aria-busy=${this.loading}
      >
        ${this.loading
          ? html`<span class="loading-spinner" aria-hidden="true">...</span>`
          : null
        }
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ldl-button': LDLButton;
  }
}
