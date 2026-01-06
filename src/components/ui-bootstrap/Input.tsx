/**
 * Bootstrap Input implementation
 */
import { Form } from 'react-bootstrap';
import type { InputProps } from '../ui-adapters/types';

export default function Input({
  type = 'text',
  placeholder,
  disabled = false,
  readOnly = false,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  name,
  id,
  className,
  autoComplete,
  autoFocus,
  required,
  minLength,
  maxLength,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
}: InputProps) {
  return (
    <Form.Control
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      name={name}
      id={id}
      className={className}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
    />
  );
}
