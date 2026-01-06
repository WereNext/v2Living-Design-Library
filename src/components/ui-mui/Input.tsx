/**
 * MUI Input implementation
 */
import TextField from '@mui/material/TextField';
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
    <TextField
      type={type}
      placeholder={placeholder}
      disabled={disabled}
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
      size="small"
      fullWidth
      variant="outlined"
      slotProps={{
        input: {
          readOnly,
          'aria-label': ariaLabel,
          'aria-describedby': ariaDescribedby,
        },
        htmlInput: {
          minLength,
          maxLength,
        },
      }}
    />
  );
}
