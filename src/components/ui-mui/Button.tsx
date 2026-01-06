/**
 * MUI Button implementation
 */
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { ButtonProps } from '../ui-adapters/types';

// Map our variants to MUI variants
const variantMap: Record<string, 'contained' | 'outlined' | 'text'> = {
  default: 'contained',
  secondary: 'contained',
  destructive: 'contained',
  outline: 'outlined',
  ghost: 'text',
  link: 'text',
};

// Map our sizes to MUI sizes
const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
  sm: 'small',
  default: 'medium',
  lg: 'large',
  icon: 'small',
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
  const muiVariant = variantMap[variant] || 'contained';
  const muiSize = sizeMap[size] || 'medium';

  // Determine color based on variant
  const color = variant === 'destructive' ? 'error' : variant === 'secondary' ? 'secondary' : 'primary';

  return (
    <MuiButton
      variant={muiVariant}
      size={muiSize}
      color={color}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      aria-label={ariaLabel}
      sx={{
        textTransform: 'none',
        ...(variant === 'link' && {
          textDecoration: 'underline',
          '&:hover': {
            textDecoration: 'underline',
          },
        }),
        ...(size === 'icon' && {
          minWidth: 'auto',
          padding: '8px',
        }),
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
          {children}
        </>
      ) : (
        children
      )}
    </MuiButton>
  );
}
