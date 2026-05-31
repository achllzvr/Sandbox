import React, { forwardRef } from 'react';
import { colors, borderRadius, transitions, typography, shadows } from '../Styles/theme';

/**
 * Base text input component with hard shadow system
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ 
            color: colors.text.primary, 
            fontWeight: 700, 
            fontSize: '1rem',
            fontFamily: typography.fontFamily.primary,
          }}
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
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: colors.input.bg,
          border: `2px solid ${error ? colors.status.error : colors.input.border}`,
          borderRadius: borderRadius.lg,
          color: colors.text.primary,
          fontSize: '1rem',
          fontFamily: typography.fontFamily.primary,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
          outline: 'none',
          transition: transitions.base,
          boxShadow: shadows.input,
          fontWeight: 500,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? colors.status.error : colors.button.primary;
          e.target.style.backgroundColor = colors.input.bg;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? colors.status.error : colors.input.border;
        }}
        {...props}
      />
      {error && (
        <p style={{ 
          color: colors.status.error, 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          margin: 0,
          fontFamily: typography.fontFamily.primary,
        }}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
