import React from 'react';
import { colors, borderRadius } from '../Styles/theme';

/**
 * Alert component for displaying messages
 * @param {string} type - 'error', 'success', 'warning', 'info'
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {function} onClose - Close handler
 * @param {boolean} dismissible - Show close button
 */
export const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  dismissible = false,
  className = '',
  children,
}) => {
  const typeConfig = {
    error: {
      backgroundColor: '#FDE8E7',
      borderColor: colors.status.error,
      textColor: colors.status.error,
      icon: '✕',
    },
    success: {
      backgroundColor: '#E8F5E9',
      borderColor: colors.status.success,
      textColor: colors.status.success,
      icon: '✓',
    },
    warning: {
      backgroundColor: '#FFF3E0',
      borderColor: colors.status.warning,
      textColor: colors.status.warning,
      icon: '⚠',
    },
    info: {
      backgroundColor: '#E3F2FD',
      borderColor: colors.status.info,
      textColor: colors.status.info,
      icon: 'ℹ',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      style={{
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: borderRadius.lg,
        padding: '1rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
      }}
      className={className}
      role="alert"
    >
      <span
        style={{
          color: config.textColor,
          fontSize: '1.25rem',
          fontWeight: 'bold',
          flexShrink: 0,
        }}
      >
        {config.icon}
      </span>
      <div style={{ flex: 1 }}>
        {title && (
          <div
            style={{
              color: config.textColor,
              fontWeight: 600,
              marginBottom: title && message ? '0.5rem' : 0,
            }}
          >
            {title}
          </div>
        )}
        {message && (
          <div
            style={{
              color: config.textColor,
              fontSize: '0.95rem',
              opacity: 0.9,
            }}
          >
            {message}
          </div>
        )}
        {children}
      </div>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: config.textColor,
            cursor: 'pointer',
            fontSize: '1.5rem',
            padding: '0',
            flexShrink: 0,
          }}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
