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
  borderColor = null,
  ...props
}) => {
  const variants = {
    default: {
      backgroundColor: 'white',
      border: `2px solid ${borderColor || colors.border.light}`,
      boxShadow: shadows.card,
    },
    elevated: {
      backgroundColor: 'white',
      border: `2px solid ${borderColor || colors.border.light}`,
      boxShadow: shadows.card,
    },
    outlined: {
      backgroundColor: 'transparent',
      border: `2px solid ${borderColor || colors.border.medium}`,
      boxShadow: 'none',
    },
  };

  const style = {
    ...variants[variant] || variants.default,
    borderRadius: borderRadius.lg,
    padding: '24px',
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
