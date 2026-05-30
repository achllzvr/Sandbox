import React, { useEffect, useState } from 'react';
import { colors } from '../Styles/theme';

/**
 * Password requirements checker component
 * Shows password strength indicators
 * @param {string} password - Current password
 * @param {Array} requirements - Array of {label, test} objects
 */
export const PasswordRequirements = ({
  password = '',
  requirements = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
    { label: 'Contains number', test: (p) => /[0-9]/.test(p) },
    { label: 'Contains special character', test: (p) => /[!@#$%^&*]/.test(p) },
  ],
}) => {
  const [checkedRequirements, setCheckedRequirements] = useState([]);

  useEffect(() => {
    setCheckedRequirements(requirements.map((req) => req.test(password)));
  }, [password, requirements]);

  const isAllMet = checkedRequirements.every((check) => check === true);

  return (
    <div className="flex flex-col gap-3">
      <div
        style={{
          color: colors.text.primary,
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        Password Requirements:
      </div>
      <div className="flex flex-col gap-2">
        {requirements.map((requirement, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
            style={{
              opacity: checkedRequirements[index] ? 1 : 0.5,
            }}
          >
            <span
              style={{
                color: checkedRequirements[index]
                  ? colors.status.success
                  : colors.text.light,
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              {checkedRequirements[index] ? '✓' : '○'}
            </span>
            <span
              style={{
                color: checkedRequirements[index]
                  ? colors.status.success
                  : colors.text.secondary,
                fontSize: '0.9rem',
              }}
            >
              {requirement.label}
            </span>
          </div>
        ))}
      </div>
      {isAllMet && (
        <div
          style={{
            color: colors.status.success,
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          ✓ Password is strong
        </div>
      )}
    </div>
  );
};

export default PasswordRequirements;
