import React, { useRef, useState } from 'react';
import { colors, borderRadius } from '../Styles/theme';

/**
 * OTP/Code input component with multiple input boxes
 * @param {number} length - Number of code boxes (default 6)
 * @param {function} onChange - Called when code is complete
 * @param {string} value - Current code value
 * @param {string} error - Error message
 * @param {string} label - Label text
 */
export const OTPInput = ({
  length = 6,
  onChange,
  value = '',
  error,
  label = 'Verification Code',
  required = false,
}) => {
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleInputChange = (e, index) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 1) {
      const newValue = value.slice(0, index) + val + value.slice(index + 1);
      onChange?.(newValue);

      if (val && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '');
    if (pastedData.length <= length) {
      onChange?.(pastedData.slice(0, length));
      // Focus the last filled input
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label
          style={{
            color: colors.text.primary,
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
        >
          {label}
          {required && <span style={{ color: colors.status.error }}>*</span>}
        </label>
      )}
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            maxLength="1"
            value={value[index] || ''}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            style={{
              width: '3rem',
              height: '3rem',
              fontSize: '1.5rem',
              textAlign: 'center',
              fontWeight: 'bold',
              backgroundColor: colors.input.bg,
              border: `2px solid ${
                error
                  ? colors.input.borderError
                  : focusedIndex === index
                  ? colors.input.borderFocus
                  : colors.input.border
              }`,
              borderRadius: borderRadius.lg,
              color: colors.text.primary,
              cursor: 'text',
              transition: 'all 200ms ease',
            }}
            inputMode="numeric"
          />
        ))}
      </div>
      {error && (
        <p style={{ color: colors.status.error }} className="text-sm font-medium text-center">
          {error}
        </p>
      )}
    </div>
  );
};

export default OTPInput;
