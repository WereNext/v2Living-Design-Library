/**
 * Ant Design Button implementation
 */
import { Button as AntButton } from 'antd';
import type { ButtonProps } from '../ui-adapters/types';

// Map our variants to Ant Design button types
const typeMap: Record<string, 'primary' | 'default' | 'dashed' | 'text' | 'link'> = {
  default: 'primary',
  secondary: 'default',
  destructive: 'primary',
  outline: 'default',
  ghost: 'text',
  link: 'link',
};

// Map our sizes to Ant Design sizes
const sizeMap: Record<string, 'small' | 'middle' | 'large'> = {
  sm: 'small',
  default: 'middle',
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
  const antType = typeMap[variant] || 'primary';
  const antSize = sizeMap[size] || 'middle';

  return (
    <AntButton
      type={antType}
      size={antSize}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      htmlType={type}
      className={className}
      aria-label={ariaLabel}
      danger={variant === 'destructive'}
      ghost={variant === 'outline'}
      style={{
        ...(size === 'icon' && {
          minWidth: 'auto',
          padding: '4px 8px',
        }),
      }}
    >
      {children}
    </AntButton>
  );
}
