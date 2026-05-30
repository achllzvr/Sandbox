import React, { forwardRef } from 'react';
import { colors } from '../Styles/theme';

/**
 * Radio Group component
 * @param {string} label - Group label
 * @param {Array} options - Array of {value, label} objects
 * @param {string} value - Selected value
 * @param {function} onChange - Change handler
 * @param {string} error - Error message
 * @param {boolean} disabled - Disable all options
 */
export const RadioGroup = forwardRef(({
  label,
  options = [],
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
}, ref) => {
  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label
          style={{ color: colors.text.primary, fontWeight: 600 }}
          className="text-sm"
        >
          {label}
          {required && <span style={{ color: colors.status.error }}>*</span>}
        </label>
      )}
      <div className="flex flex-col gap-2" ref={ref}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer"
            style={{ opacity: disabled ? 0.6 : 1 }}
          >
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              disabled={disabled}
              style={{
                accentColor: colors.button.primary,
                cursor: disabled ? 'not-allowed' : 'pointer',
                width: '1.25rem',
                height: '1.25rem',
              }}
            />
            <span
              style={{
                color: colors.text.primary,
                fontSize: '0.95rem',
                userSelect: 'none',
              }}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p style={{ color: colors.status.error }} className="text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
