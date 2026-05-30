import React, { forwardRef } from 'react';
import { colors, borderRadius, transitions } from '../Styles/theme';

/**
 * Base text input component
 * @param {string} type - Input type (text, email, password, number, etc.)
 * @param {string} label - Label text
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message to display
 * @param {boolean} disabled - Disable input
 * @param {function} onChange - Change handler
 * @param {string} value - Input value
 * @param {string} className - Additional CSS classes
 */
export const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  error,
  disabled = false,
  onChange,
  value,
  className = '',
  required = false,
  ...props
}, ref) => {
  const inputId = props.id || `input-${Math.random()}`;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={inputId}
          style={{ color: colors.text.primary, fontWeight: 600 }}
          className="text-sm"
        >
          {label}
          {required && <span style={{ color: colors.status.error }}>*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg transition-all ${className}`}
        style={{
          backgroundColor: colors.input.bg,
          border: `1px solid ${error ? colors.input.borderError : colors.input.border}`,
          color: colors.text.primary,
          fontSize: '1rem',
          fontFamily: colors.typography.fontFamily.primary,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? colors.input.borderError : colors.input.borderFocus;
          e.target.style.boxShadow = `0 0 0 3px ${error ? colors.button.primaryLight : colors.button.primaryLight}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? colors.input.borderError : colors.input.border;
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <p style={{ color: colors.status.error }} className="text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
