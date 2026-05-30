/**
 * Sandbox Design System - Theme & Tokens
 * Centralized color, spacing, and typography definitions
 */

export const colors = {
  // Backgrounds
  bg: {
    primary: '#FAF4ED',    // Warm cream
    secondary: '#F5E6D3',  // Softer beige
    light: '#FFFAF5',      // Off-white
    dark: '#2C3E50',       // Dark charcoal
  },

  // Buttons & Actions
  button: {
    primary: '#ED8680',    // Coral red
    primaryDark: '#D97269', // Darker coral
    primaryLight: '#F5A5A1', // Light coral
    secondary: '#A0725A',  // Rustic brown
    secondaryDark: '#8B6B5E', // Darker brown
  },

  // Text & Content
  text: {
    primary: '#2C3E50',    // Dark charcoal
    secondary: '#5F6B7A',  // Medium gray
    light: '#8B9BA8',      // Light gray
    white: '#FFFFFF',
    muted: '#A8B3BA',      // Muted gray for placeholders
  },

  // Inputs & Forms
  input: {
    bg: '#FFF9F5',         // Cream background
    border: '#D9CFC0',     // Light tan border
    borderFocus: '#ED8680', // Red on focus
    borderError: '#F5A5A1', // Light red for error
    placeholder: '#A8B3BA', // Muted placeholder
  },

  // Status Colors
  status: {
    success: '#6BBF8E',    // Green
    error: '#ED7B77',      // Red
    warning: '#F5B95F',    // Orange
    info: '#6B9FBF',       // Blue
  },

  // Borders & Dividers
  border: {
    light: '#E8DDD2',      // Light border
    medium: '#D9CFC0',     // Medium border
    dark: '#8B9BA8',       // Dark border
  },
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '2.5rem',
  '3xl': '3rem',
  '4xl': '4rem',
};

export const typography = {
  fontFamily: {
    primary: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  full: '9999px',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const theme = {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  transitions,
};

export default theme;
