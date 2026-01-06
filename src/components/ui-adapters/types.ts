/**
 * Unified component interface types for cross-library adapters
 * These types define a common API that works across all supported UI libraries
 */
import { ReactNode, MouseEventHandler, ChangeEventHandler, FormEventHandler, KeyboardEventHandler, FocusEventHandler } from 'react';

// =============================================================================
// BUTTON
// =============================================================================

export type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  'aria-label'?: string;
  // Allow passing through additional HTML button attributes
  [key: string]: unknown;
}

// =============================================================================
// INPUT
// =============================================================================

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  name?: string;
  id?: string;
  className?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// =============================================================================
// TEXTAREA
// =============================================================================

export interface TextareaProps {
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  name?: string;
  id?: string;
  className?: string;
  rows?: number;
  cols?: number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  'aria-label'?: string;
}

// =============================================================================
// SELECT
// =============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  options: SelectOption[];
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

// =============================================================================
// CHECKBOX
// =============================================================================

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

// =============================================================================
// RADIO GROUP
// =============================================================================

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  options: RadioOption[];
  name?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  'aria-label'?: string;
}

// =============================================================================
// SWITCH / TOGGLE
// =============================================================================

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

// =============================================================================
// CARD
// =============================================================================

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

// =============================================================================
// BADGE
// =============================================================================

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

// =============================================================================
// ALERT
// =============================================================================

export type AlertVariant = 'default' | 'destructive' | 'warning' | 'success' | 'info';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

// =============================================================================
// DIALOG / MODAL
// =============================================================================

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export interface DialogContentProps {
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}

export interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

export interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

// =============================================================================
// TABS
// =============================================================================

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

// =============================================================================
// TOOLTIP
// =============================================================================

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}

// =============================================================================
// PROGRESS
// =============================================================================

export interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
  'aria-label'?: string;
}

// =============================================================================
// SLIDER
// =============================================================================

export interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

// =============================================================================
// AVATAR
// =============================================================================

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

// =============================================================================
// SKELETON
// =============================================================================

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

// =============================================================================
// SPINNER / LOADING
// =============================================================================

export interface SpinnerProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}
