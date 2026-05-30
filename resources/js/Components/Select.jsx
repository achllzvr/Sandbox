import React, { forwardRef } from 'react';
import { colors } from '../Styles/theme';

/**
 * Select dropdown component
 * @param {string} label - Label text
 * @param {Array} options - Array of {value, label} objects
 * @param {string} error - Error message
 * @param {boolean} disabled - Disable select
 * @param {function} onChange - Change handler
 * @param {string} value - Selected value
 */
export const Select = forwardRef(({
  label,
  options = [],
  error,
  disabled = false,
  onChange,
  value,
  placeholder = 'Select an option...',
  required = false,
  className = '',
  ...props
}, ref) => {
  const selectId = props.id || `select-${Math.random()}`;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={selectId}
          style={{ color: colors.text.primary, fontWeight: 600 }}
          className="text-sm"
        >
          {label}
          {required && <span style={{ color: colors.status.error }}>*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg appearance-none bg-no-repeat transition-all ${className}`}
        style={{
          backgroundColor: colors.input.bg,
          border: `1px solid ${error ? colors.input.borderError : colors.input.border}`,
          color: value ? colors.text.primary : colors.input.placeholder,
          fontSize: '1rem',
          fontFamily: colors.typography.fontFamily.primary,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23${colors.text.secondary.slice(1)}' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 12px center',
          backgroundSize: '12px',
          paddingRight: '36px',
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
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p style={{ color: colors.status.error }} className="text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
