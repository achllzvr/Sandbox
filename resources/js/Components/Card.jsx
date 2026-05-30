import React from 'react';
import { colors, shadows, borderRadius } from '../Styles/theme';

/**
 * Card container component for grouping content
 * @param {ReactNode} children - Card content
 * @param {string} variant - 'default', 'elevated', 'outlined'
 * @param {boolean} centered - Center align content
 * @param {string} className - Additional CSS classes
 */
export const Card = ({
  children,
  variant = 'default',
  centered = false,
  className = '',
  ...props
}) => {
  const variants = {
    default: {
      backgroundColor: colors.bg.light,
      border: `1px solid ${colors.border.light}`,
      boxShadow: shadows.sm,
    },
    elevated: {
      backgroundColor: colors.bg.light,
      border: 'none',
      boxShadow: shadows.lg,
    },
    outlined: {
      backgroundColor: 'transparent',
      border: `2px solid ${colors.border.medium}`,
      boxShadow: 'none',
    },
  };

  const style = {
    ...variants[variant] || variants.default,
    borderRadius: borderRadius.lg,
    padding: '1.5rem',
    transition: 'all 200ms ease',
  };

  return (
    <div
      style={style}
      className={`${centered ? 'text-center' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
