import React, { useState } from 'react';
import { colors, shadows, transitions, borderRadius, typography } from '../Styles/theme';

/**
 * Primary button component with multiple variants and hard shadow system
 * Implements Duolingo-style press mechanic with hard shadows
 * @param {string} variant - 'primary', 'secondary', 'ghost', 'danger', 'filled'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} isLoading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {boolean} isFilled - For form-gated buttons (unfilled/filled states)
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button content
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  isFilled = true,  // For form-gated buttons
  onClick,
  className = '',
  children,
  ...props
}) => {
  const sizeMap = {
    sm: { padding: '8px 12px', fontSize: '0.875rem', minHeight: '32px' },
    md: { padding: '12px 24px', fontSize: '0.875rem', minHeight: '44px' },
    lg: { padding: '16px 32px', fontSize: '0.875rem', minHeight: '52px' },
  };

  // Form-gated button: unfilled state (transparent border)
  const unfilledStyle = {
    backgroundColor: 'transparent',
    color: colors.button.primary,
    border: `2.5px solid ${colors.button.primary}`,
    boxShadow: 'none',
    cursor: 'default',
    pointerEvents: 'none',
  };

  // Form-gated button: filled state (solid)
  const filledPrimaryStyle = {
    backgroundColor: colors.button.primary,
    color: '#FFFFFF',
    border: 'none',
    boxShadow: shadows.btnPrimary,
    cursor: 'pointer',
    pointerEvents: 'auto',
  };

  // Form-gated button: filled secondary (sandy)
  const filledSecondaryStyle = {
    backgroundColor: colors.button.secondary,
    color: colors.text.primary,
    border: 'none',
    boxShadow: shadows.btnSecondary,
    cursor: 'pointer',
    pointerEvents: 'auto',
  };

  const variantMap = {
    primary: isFilled ? filledPrimaryStyle : unfilledStyle,
    secondary: isFilled ? filledSecondaryStyle : unfilledStyle,
    ghost: {
      backgroundColor: colors.input.bg,
      color: colors.button.primary,
      border: `2px solid ${colors.button.primary}`,
      boxShadow: shadows.input,
    },
    danger: {
      backgroundColor: colors.status.error,
      color: '#FFFFFF',
      border: 'none',
      boxShadow: shadows.errorBanner,
    },
    filled: {
      backgroundColor: colors.button.primary,
      color: '#FFFFFF',
      border: 'none',
      boxShadow: shadows.btnPrimary,
    },
  };

  const baseStyle = {
    ...sizeMap[size] || sizeMap.md,
    ...variantMap[variant] || variantMap.primary,
    borderRadius: borderRadius.lg,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    opacity: disabled ? 0.5 : 1,
    transition: `transform ${transitions.base}, box-shadow ${transitions.base}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    fontFamily: typography.fontFamily.primary,
  };

  const { style: userStyle, ...restProps } = props;

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading || (variant === 'primary' && !isFilled)}
      style={{ 
        ...baseStyle, 
        ...userStyle,
      }}
      onMouseDown={(e) => {
        // Duolingo press mechanic: move down on active
        if (!disabled && isFilled) {
          e.currentTarget.style.transform = 'translateY(5px)';
          e.currentTarget.style.boxShadow = '0 0 0 0 ' + 
            (variant === 'secondary' ? '#B89A3A' : 
             variant === 'danger' ? '#D07070' : 
             '#A04035');
        }
      }}
      onMouseUp={(e) => {
        // Return to resting state
        if (!disabled && isFilled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 
            (variant === 'secondary' ? shadows.btnSecondary : 
             variant === 'danger' ? shadows.errorBanner : 
             shadows.btnPrimary);
        }
      }}
      onMouseLeave={(e) => {
        // Ensure clean state on mouse leave
        if (!disabled && isFilled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 
            (variant === 'secondary' ? shadows.btnSecondary : 
             variant === 'danger' ? shadows.errorBanner : 
             shadows.btnPrimary);
        }
      }}
      {...restProps}
    >
      {isLoading ? (
        <>
          <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
