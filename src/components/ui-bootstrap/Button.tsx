/**
 * Bootstrap Button implementation
 */
import { Button as BsButton, Spinner } from 'react-bootstrap';
import type { ButtonProps } from '../ui-adapters/types';

// Map our variants to Bootstrap variants
const variantMap: Record<string, string> = {
  default: 'primary',
  secondary: 'secondary',
  destructive: 'danger',
  outline: 'outline-primary',
  ghost: 'light',
  link: 'link',
};

// Map our sizes to Bootstrap sizes
const sizeMap: Record<string, 'sm' | 'lg' | undefined> = {
  sm: 'sm',
  default: undefined,
  lg: 'lg',
  icon: 'sm',
};

export default function Button({
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  children,
  className,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const bsVariant = variantMap[variant] || 'primary';
  const bsSize = sizeMap[size];

  return (
    <BsButton
      variant={bsVariant}
      size={bsSize}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      aria-label={ariaLabel}
      style={{
        ...(size === 'icon' && {
          minWidth: 'auto',
          padding: '0.375rem 0.5rem',
        }),
      }}
    >
      {loading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
      )}
      {children}
    </BsButton>
  );
}
