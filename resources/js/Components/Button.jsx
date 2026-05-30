import React from 'react';
import { colors, borderRadius, transitions } from '../Styles/theme';

/**
 * Primary button component with multiple variants
 * @param {string} variant - 'primary', 'secondary', 'ghost', 'danger'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} isLoading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button content
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = `
    font-medium rounded-lg transition-all duration-200 cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    inline-flex items-center justify-center gap-2
  `;

  const variants = {
    primary: `
      bg-[${colors.button.primary}] text-white
      hover:bg-[${colors.button.primaryDark}]
      focus:ring-[${colors.button.primary}]
      active:bg-[${colors.button.primaryDark}]
    `,
    secondary: `
      bg-[${colors.button.secondary}] text-white
      hover:bg-[${colors.button.secondaryDark}]
      focus:ring-[${colors.button.secondary}]
      active:bg-[${colors.button.secondaryDark}]
    `,
    ghost: `
      bg-transparent border-2 border-[${colors.button.primary}] text-[${colors.button.primary}]
      hover:bg-[${colors.button.primaryLight}]
      focus:ring-[${colors.button.primary}]
    `,
    danger: `
      bg-[${colors.status.error}] text-white
      hover:bg-[${colors.status.error}] opacity-90 hover:opacity-100
      focus:ring-[${colors.status.error}]
    `,
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-8',
    md: 'px-4 py-3 text-base min-h-10',
    lg: 'px-6 py-4 text-lg min-h-12',
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
      style={{
        backgroundColor: variant === 'primary' ? colors.button.primary : 
                        variant === 'secondary' ? colors.button.secondary :
                        variant === 'danger' ? colors.status.error : 'transparent',
        color: variant === 'ghost' ? colors.button.primary : 'white',
        border: variant === 'ghost' ? `2px solid ${colors.button.primary}` : 'none',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: transitions.base,
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⟳</span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
