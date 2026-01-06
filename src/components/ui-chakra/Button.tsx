/**
 * Chakra UI v3 Button implementation
 */
import { Button as ChakraButton, Spinner } from '@chakra-ui/react';
import type { ButtonProps } from '../ui-adapters/types';

// Map our variants to Chakra v3 variants
const variantMap: Record<string, 'solid' | 'outline' | 'ghost' | 'plain'> = {
  default: 'solid',
  secondary: 'outline',
  destructive: 'solid',
  outline: 'outline',
  ghost: 'ghost',
  link: 'plain',
};

// Map our sizes to Chakra sizes
const sizeMap: Record<string, 'xs' | 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  default: 'md',
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
  const chakraVariant = variantMap[variant] || 'solid';
  const chakraSize = sizeMap[size] || 'md';

  // Determine colorPalette based on variant (Chakra v3 uses colorPalette instead of colorScheme)
  const colorPalette = variant === 'destructive' ? 'red' : variant === 'secondary' ? 'gray' : 'blue';

  return (
    <ChakraButton
      variant={chakraVariant}
      size={chakraSize}
      colorPalette={colorPalette}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      type={type}
      className={className}
      aria-label={ariaLabel}
      style={{
        ...(size === 'icon' && {
          minWidth: 'auto',
          padding: '0.5rem',
        }),
      }}
    >
      {loading && <Spinner size="sm" marginRight="0.5rem" />}
      {children}
    </ChakraButton>
  );
}
