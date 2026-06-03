/**
 * Sandbox Design System - Theme & Tokens
 * Derived from comprehensive mockup analysis
 * Master UI Styling Guide v1.0
 */

export const colors = {
  // Backgrounds
  bg: {
    primary: '#FAF0DC',    // Warm cream (page background)
    secondary: '#F2E4BF',  // Light sandy (input background)
    light: '#FFFFFF',      // White (card backgrounds)
    dark: '#4A3F35',       // Dark brown-gray (text)
  },

  // Buttons & Actions
  button: {
    primary: '#E8735A',        // Coral salmon (primary CTA)
    primaryDark: '#A04035',    // Dark coral (button shadow color)
    primaryLight: '#F5A5A1',   // Light coral (tags, backgrounds)
    secondary: '#E8C97A',      // Sandy yellow ("I ALREADY HAVE A SHELL")
    secondaryDark: '#B89A3A',  // Sandy dark (secondary button shadow)
  },

  // Text & Content
  text: {
    primary: '#4A3F35',        // Dark brown-gray (headings, body)
    secondary: '#5F6B7A',      // Medium gray (secondary text)
    light: '#8B9BA8',          // Light gray
    white: '#FFFFFF',          // White
    muted: '#B09A78',          // Muted tan (placeholder text)
    helper: '#8C7A62',         // Helper text color
    link: '#7A8FA6',           // Link text (underlined)
  },

  // Inputs & Forms
  input: {
    bg: '#F2E4BF',             // Light sandy background
    border: '#D4BC8A',         // Warm tan border
    borderFocus: '#E8735A',    // Coral on focus
    borderError: '#F4A0A0',    // Soft pink-red on error
    placeholder: '#B09A78',    // Muted tan placeholder
  },

  // Status Colors
  status: {
    success: '#4CAF50',        // Leaf green (password requirements met)
    error: '#F4A0A0',          // Soft pink-red (error banner)
    errorText: '#FFFFFF',      // White text on error banner
    warning: '#F5B95F',        // Orange
    info: '#6B9FBF',           // Blue
  },

  // Borders & Dividers
  border: {
    light: '#E8DCCC',          // Light warm gray (nav border)
    medium: '#D4BC8A',         // Medium warm tan
    dark: '#8B9BA8',           // Dark border
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
};

export const typography = {
  fontFamily: {
    primary: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    brand: "'Sparky Stones', Georgia, serif",      // Logo/wordmark only
    heading: "'Montley Forces', Georgia, serif",   // Page titles
  },
  fontSize: {
    xs: '0.75rem',       // 12px - fine print
    sm: '0.875rem',      // 14px - helper text, buttons
    base: '1rem',        // 16px - body text, form labels
    lg: '1.125rem',      // 18px - section headers
    xl: '1.25rem',       // 20px
    '2xl': '1.5rem',     // 24px - error banner text
    '3xl': '1.875rem',   // 30px - page titles (h1)
    '4xl': '2rem',       // 32px
    display: '2.5rem',   // 40px - hero headline
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
  // Hard/flat shadows — ZERO blur, ZERO spread, opaque darker shade (Duolingo style)
  btnPrimary: '0 5px 0 0 #A04035',      // Coral button shadow (dark coral)
  btnSecondary: '0 5px 0 0 #B89A3A',    // Sandy button shadow (dark sandy)
  input: '0 4px 0 0 #C4AC7A',           // Input field shadow (warm tan)
  backBtn: '0 4px 0 0 #C4AC7A',         // Back button shadow (warm tan)
  errorBanner: '0 5px 0 0 #D07070',     // Error banner shadow
  card: '0 5px 0 0 #C8B88A',            // Card/container shadow
};

export const borderRadius = {
  none: '0',
  sm: '8px',
  md: '12px',
  lg: '16px',
  full: '9999px',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
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
