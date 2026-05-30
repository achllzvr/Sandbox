import React, { forwardRef } from 'react';
import { colors } from '../Styles/theme';

/**
 * Textarea component for multi-line text input
 * @param {string} label - Label text
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message
 * @param {number} rows - Number of rows
 * @param {boolean} disabled - Disable textarea
 * @param {function} onChange - Change handler
 * @param {string} value - Input value
 */
export const Textarea = forwardRef(({
  label,
  placeholder,
  error,
  rows = 4,
  disabled = false,
  onChange,
  value,
  required = false,
  className = '',
  ...props
}, ref) => {
  const textareaId = props.id || `textarea-${Math.random()}`;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={textareaId}
          style={{ color: colors.text.primary, fontWeight: 600 }}
          className="text-sm"
        >
          {label}
          {required && <span style={{ color: colors.status.error }}>*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`w-full px-4 py-3 rounded-lg transition-all resize-none ${className}`}
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
          e.target.style.boxShadow = `0 0 0 3px ${colors.button.primaryLight}`;
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

Textarea.displayName = 'Textarea';

export default Textarea;
