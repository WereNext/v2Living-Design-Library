/**
 * Bootstrap Badge implementation
 */
import { Badge as BsBadge } from 'react-bootstrap';
import type { BadgeProps } from '../ui-adapters/types';

// Map our variants to Bootstrap badge variants
const bgMap: Record<string, string> = {
  default: 'primary',
  secondary: 'secondary',
  destructive: 'danger',
  outline: 'light',
};

export default function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  const bg = bgMap[variant] || 'primary';
  const textClass = variant === 'outline' ? 'text-dark border' : '';

  return (
    <BsBadge
      bg={bg}
      className={`${textClass} ${className || ''}`}
    >
      {children}
    </BsBadge>
  );
}
