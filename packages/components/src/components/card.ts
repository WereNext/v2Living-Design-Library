import { html, css, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LDLBaseComponent } from '../utils/base-component.js';

/**
 * @element ldl-card
 * @description A flexible card container that consumes design tokens.
 *
 * @slot - Default card content
 * @slot header - Card header content
 * @slot footer - Card footer content
 *
 * @csspart card - The card container
 * @csspart header - The header section
 * @csspart content - The main content section
 * @csspart footer - The footer section
 *
 * @example
 * ```html
 * <ldl-card>
 *   <span slot="header">Card Title</span>
 *   <p>Card content goes here</p>
 *   <span slot="footer">Footer text</span>
 * </ldl-card>
 * ```
 */
@customElement('ldl-card')
export class LDLCard extends LDLBaseComponent {
  static styles: CSSResultGroup = [
    LDLBaseComponent.baseStyles,
    css`
      :host {
        display: block;
      }

      .card {
        background-color: var(--ldl-color-background, white);
        border: 1px solid var(--ldl-color-border, hsl(214, 32%, 91%));
        border-radius: var(--ldl-radius-lg, 0.5rem);
        box-shadow: var(--ldl-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
        overflow: hidden;
      }

      /* Variants */
      :host([variant="elevated"]) .card {
        border: none;
        box-shadow: var(--ldl-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
      }

      :host([variant="ghost"]) .card {
        border: none;
        background: transparent;
        box-shadow: none;
      }

      :host([variant="outline"]) .card {
        box-shadow: none;
      }

      /* Interactive */
      :host([interactive]) .card {
        cursor: pointer;
        transition: all var(--ldl-transition-fast, 150ms ease);
      }

      :host([interactive]) .card:hover {
        box-shadow: var(--ldl-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        border-color: var(--ldl-color-ring, hsl(221, 83%, 53%));
      }

      :host([interactive]) .card:focus-within {
        outline: 2px solid var(--ldl-color-ring, hsl(221, 83%, 53%));
        outline-offset: 2px;
      }

      /* Sections */
      .header {
        padding: var(--ldl-space-md, 1rem) var(--ldl-space-lg, 1.5rem);
        border-bottom: 1px solid var(--ldl-color-border, hsl(214, 32%, 91%));
      }

      .header ::slotted(*) {
        margin: 0;
        font-size: var(--ldl-font-size-lg, 1.125rem);
        font-weight: var(--ldl-font-weight-semibold, 600);
        color: var(--ldl-color-foreground, hsl(222, 47%, 11%));
      }

      .content {
        padding: var(--ldl-space-lg, 1.5rem);
        color: var(--ldl-color-foreground, hsl(222, 47%, 11%));
      }

      .footer {
        padding: var(--ldl-space-md, 1rem) var(--ldl-space-lg, 1.5rem);
        border-top: 1px solid var(--ldl-color-border, hsl(214, 32%, 91%));
        background-color: var(--ldl-color-muted, hsl(210, 40%, 96%));
      }

      /* Hide empty slots */
      .header:not(:has(::slotted(*))) {
        display: none;
      }

      .footer:not(:has(::slotted(*))) {
        display: none;
      }

      /* Padding variants */
      :host([padding="none"]) .content {
        padding: 0;
      }

      :host([padding="sm"]) .content {
        padding: var(--ldl-space-sm, 0.5rem);
      }

      :host([padding="lg"]) .content {
        padding: var(--ldl-space-xl, 2rem);
      }
    `
  ];

  /** Card variant */
  @property({ type: String, reflect: true })
  variant: 'default' | 'elevated' | 'outline' | 'ghost' = 'default';

  /** Make card interactive (hoverable, clickable) */
  @property({ type: Boolean, reflect: true })
  interactive = false;

  /** Content padding */
  @property({ type: String, reflect: true })
  padding: 'none' | 'sm' | 'md' | 'lg' = 'md';

  render() {
    return html`
      <div class="card" part="card" role=${this.interactive ? 'button' : 'region'}>
        <div class="header" part="header">
          <slot name="header"></slot>
        </div>
        <div class="content" part="content">
          <slot></slot>
        </div>
        <div class="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ldl-card': LDLCard;
  }
}
