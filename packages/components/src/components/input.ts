import { html, css, CSSResultGroup, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { LDLBaseComponent } from '../utils/base-component.js';

/**
 * @element ldl-input
 * @description A text input component that consumes design tokens.
 *
 * @fires ldl-input - Fires on input change
 * @fires ldl-change - Fires on blur after value change
 *
 * @csspart input - The native input element
 * @csspart label - The label element
 * @csspart helper - The helper text element
 *
 * @example
 * ```html
 * <ldl-input label="Email" type="email" placeholder="Enter email"></ldl-input>
 * <ldl-input label="Password" type="password" required></ldl-input>
 * ```
 */
@customElement('ldl-input')
export class LDLInput extends LDLBaseComponent {
  static styles: CSSResultGroup = [
    LDLBaseComponent.baseStyles,
    css`
      :host {
        display: block;
      }

      .wrapper {
        display: flex;
        flex-direction: column;
        gap: var(--ldl-space-xs, 0.25rem);
      }

      label {
        font-family: var(--ldl-font-family, system-ui);
        font-size: var(--ldl-font-size-sm, 0.875rem);
        font-weight: var(--ldl-font-weight-medium, 500);
        color: var(--ldl-color-foreground, hsl(222, 47%, 11%));
      }

      label.required::after {
        content: ' *';
        color: var(--ldl-color-destructive, hsl(0, 84%, 60%));
      }

      input {
        /* Reset */
        appearance: none;
        border: none;
        background: none;
        font-family: inherit;
        width: 100%;

        /* Styles */
        height: 2.5rem;
        padding: 0 var(--ldl-space-sm, 0.5rem);
        font-family: var(--ldl-font-family, system-ui);
        font-size: var(--ldl-font-size-sm, 0.875rem);
        color: var(--ldl-color-foreground, hsl(222, 47%, 11%));
        background-color: var(--ldl-color-background, white);
        border: 1px solid var(--ldl-color-input, hsl(214, 32%, 91%));
        border-radius: var(--ldl-radius-md, 0.375rem);
        transition: all var(--ldl-transition-fast, 150ms ease);
      }

      input::placeholder {
        color: var(--ldl-color-muted-foreground, hsl(215, 16%, 47%));
      }

      input:hover:not(:disabled) {
        border-color: var(--ldl-color-ring, hsl(221, 83%, 53%));
      }

      input:focus {
        outline: none;
        border-color: var(--ldl-color-ring, hsl(221, 83%, 53%));
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--ldl-color-ring) 20%, transparent);
      }

      input:disabled {
        cursor: not-allowed;
        opacity: 0.5;
        background-color: var(--ldl-color-muted, hsl(210, 40%, 96%));
      }

      /* Error state */
      :host([error]) input {
        border-color: var(--ldl-color-destructive, hsl(0, 84%, 60%));
      }

      :host([error]) input:focus {
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--ldl-color-destructive) 20%, transparent);
      }

      .helper {
        font-family: var(--ldl-font-family, system-ui);
        font-size: var(--ldl-font-size-xs, 0.75rem);
        color: var(--ldl-color-muted-foreground, hsl(215, 16%, 47%));
      }

      :host([error]) .helper {
        color: var(--ldl-color-destructive, hsl(0, 84%, 60%));
      }

      /* Size variants */
      :host([size="sm"]) input {
        height: 2rem;
        font-size: var(--ldl-font-size-xs, 0.75rem);
      }

      :host([size="lg"]) input {
        height: 3rem;
        font-size: var(--ldl-font-size-base, 1rem);
        padding: 0 var(--ldl-space-md, 1rem);
      }
    `
  ];

  @query('input')
  private inputEl!: HTMLInputElement;

  /** Input label */
  @property({ type: String })
  label = '';

  /** Input type */
  @property({ type: String })
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' = 'text';

  /** Placeholder text */
  @property({ type: String })
  placeholder = '';

  /** Current value */
  @property({ type: String })
  value = '';

  /** Input name (for forms) */
  @property({ type: String })
  name = '';

  /** Required field */
  @property({ type: Boolean })
  required = false;

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Readonly state */
  @property({ type: Boolean })
  readonly = false;

  /** Error state */
  @property({ type: Boolean, reflect: true })
  error = false;

  /** Helper/error text */
  @property({ type: String })
  helperText = '';

  /** Size variant */
  @property({ type: String, reflect: true })
  size: 'sm' | 'md' | 'lg' = 'md';

  /** Autocomplete attribute */
  @property({ type: String })
  autocomplete = '';

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(new CustomEvent('ldl-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  private handleChange() {
    this.dispatchEvent(new CustomEvent('ldl-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  /** Focus the input */
  focus() {
    this.inputEl?.focus();
  }

  /** Blur the input */
  blur() {
    this.inputEl?.blur();
  }

  /** Select all text */
  select() {
    this.inputEl?.select();
  }

  render() {
    return html`
      <div class="wrapper">
        ${this.label
          ? html`<label part="label" class=${this.required ? 'required' : ''}>${this.label}</label>`
          : nothing
        }
        <input
          part="input"
          type=${this.type}
          .value=${this.value}
          name=${this.name || nothing}
          placeholder=${this.placeholder || nothing}
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          autocomplete=${this.autocomplete || nothing}
          aria-invalid=${this.error}
          aria-describedby=${this.helperText ? 'helper' : nothing}
          @input=${this.handleInput}
          @change=${this.handleChange}
        />
        ${this.helperText
          ? html`<span id="helper" class="helper" part="helper">${this.helperText}</span>`
          : nothing
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ldl-input': LDLInput;
  }
}
