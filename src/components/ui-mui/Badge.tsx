/**
 * MUI Badge/Chip implementation
 */
import Chip from '@mui/material/Chip';
import type { BadgeProps } from '../ui-adapters/types';

// Map our variants to MUI chip variants and colors
const variantMap: Record<string, { variant: 'filled' | 'outlined'; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
  default: { variant: 'filled', color: 'primary' },
  secondary: { variant: 'filled', color: 'secondary' },
  destructive: { variant: 'filled', color: 'error' },
  outline: { variant: 'outlined', color: 'default' },
};

export default function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  const { variant: chipVariant, color } = variantMap[variant] || variantMap.default;

  return (
    <Chip
      label={children}
      variant={chipVariant}
      color={color}
      size="small"
      className={className}
    />
  );
}
