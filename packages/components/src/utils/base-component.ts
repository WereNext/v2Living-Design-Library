import { LitElement, CSSResultGroup, css } from 'lit';

/**
 * Base component class that all LDL components extend.
 * Provides common functionality and token consumption.
 */
export abstract class LDLBaseComponent extends LitElement {
  /**
   * Shared base styles that consume design tokens via CSS custom properties.
   * These tokens are expected to be set on :root by the design system.
   */
  static baseStyles: CSSResultGroup = css`
    :host {
      /* Box sizing reset */
      box-sizing: border-box;
    }

    :host *,
    :host *::before,
    :host *::after {
      box-sizing: inherit;
    }

    /* Hidden attribute support */
    :host([hidden]) {
      display: none !important;
    }
  `;

  /**
   * Get a token value from CSS custom properties.
   * Falls back to the provided default if not set.
   */
  protected getToken(tokenName: string, fallback: string = ''): string {
    return getComputedStyle(this).getPropertyValue(`--ldl-${tokenName}`).trim() || fallback;
  }

  /**
   * Check if component is in a specific variant state
   */
  protected hasVariant(variant: string): boolean {
    return this.hasAttribute(variant) || this.getAttribute('variant') === variant;
  }
}

/**
 * Token CSS custom properties reference.
 * These are the tokens that components expect to be available.
 *
 * Colors:
 * --ldl-color-primary
 * --ldl-color-primary-foreground
 * --ldl-color-secondary
 * --ldl-color-secondary-foreground
 * --ldl-color-background
 * --ldl-color-foreground
 * --ldl-color-muted
 * --ldl-color-muted-foreground
 * --ldl-color-accent
 * --ldl-color-accent-foreground
 * --ldl-color-destructive
 * --ldl-color-destructive-foreground
 * --ldl-color-border
 * --ldl-color-input
 * --ldl-color-ring
 *
 * Spacing:
 * --ldl-space-xs, --ldl-space-sm, --ldl-space-md, --ldl-space-lg, --ldl-space-xl
 *
 * Typography:
 * --ldl-font-family
 * --ldl-font-size-xs, --ldl-font-size-sm, --ldl-font-size-base, --ldl-font-size-lg
 * --ldl-font-weight-normal, --ldl-font-weight-medium, --ldl-font-weight-bold
 * --ldl-line-height
 *
 * Border Radius:
 * --ldl-radius-sm, --ldl-radius-md, --ldl-radius-lg, --ldl-radius-full
 *
 * Shadows:
 * --ldl-shadow-sm, --ldl-shadow-md, --ldl-shadow-lg
 *
 * Transitions:
 * --ldl-transition-fast, --ldl-transition-normal
 */
