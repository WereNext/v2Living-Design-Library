import { html, css, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LDLBaseComponent } from '../utils/base-component.js';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';

/**
 * @element ldl-badge
 * @description A badge/tag component that consumes design tokens.
 *
 * @slot - Badge content
 *
 * @csspart badge - The badge element
 *
 * @example
 * ```html
 * <ldl-badge>Default</ldl-badge>
 * <ldl-badge variant="success">Active</ldl-badge>
 * <ldl-badge variant="destructive">Error</ldl-badge>
 * ```
 */
@customElement('ldl-badge')
export class LDLBadge extends LDLBaseComponent {
  static styles: CSSResultGroup = [
    LDLBaseComponent.baseStyles,
    css`
      :host {
        display: inline-flex;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--ldl-space-xs, 0.25rem);
        padding: 0.125rem 0.625rem;
        font-family: var(--ldl-font-family, system-ui);
        font-size: var(--ldl-font-size-xs, 0.75rem);
        font-weight: var(--ldl-font-weight-medium, 500);
        line-height: 1.25;
        border-radius: var(--ldl-radius-full, 9999px);
        white-space: nowrap;
        transition: all var(--ldl-transition-fast, 150ms ease);
      }

      /* Default */
      :host([variant="default"]) .badge,
      :host(:not([variant])) .badge {
        background-color: var(--ldl-color-primary, hsl(221, 83%, 53%));
        color: var(--ldl-color-primary-foreground, white);
      }

      /* Secondary */
      :host([variant="secondary"]) .badge {
        background-color: var(--ldl-color-secondary, hsl(210, 40%, 96%));
        color: var(--ldl-color-secondary-foreground, hsl(222, 47%, 11%));
      }

      /* Destructive */
      :host([variant="destructive"]) .badge {
        background-color: var(--ldl-color-destructive, hsl(0, 84%, 60%));
        color: var(--ldl-color-destructive-foreground, white);
      }

      /* Outline */
      :host([variant="outline"]) .badge {
        background-color: transparent;
        border: 1px solid var(--ldl-color-border, hsl(214, 32%, 91%));
        color: var(--ldl-color-foreground, hsl(222, 47%, 11%));
      }

      /* Success */
      :host([variant="success"]) .badge {
        background-color: hsl(142, 76%, 36%);
        color: white;
      }

      /* Warning */
      :host([variant="warning"]) .badge {
        background-color: hsl(38, 92%, 50%);
        color: hsl(0, 0%, 9%);
      }

      /* Size variants */
      :host([size="sm"]) .badge {
        padding: 0 0.5rem;
        font-size: 0.625rem;
      }

      :host([size="lg"]) .badge {
        padding: 0.25rem 0.75rem;
        font-size: var(--ldl-font-size-sm, 0.875rem);
      }
    `
  ];

  /** Badge variant */
  @property({ type: String, reflect: true })
  variant: BadgeVariant = 'default';

  /** Badge size */
  @property({ type: String, reflect: true })
  size: 'sm' | 'md' | 'lg' = 'md';

  render() {
    return html`
      <span class="badge" part="badge">
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ldl-badge': LDLBadge;
  }
}
