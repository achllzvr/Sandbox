import React from 'react';
import { colors } from '../Styles/theme';

/**
 * Layout wrapper for pages
 * @param {ReactNode} children - Page content
 * @param {string} type - 'centered', 'sidebar', 'full'
 * @param {string} title - Page title
 * @param {ReactNode} header - Custom header
 * @param {boolean} showBackButton - Show back button
 * @param {function} onBack - Back button handler
 */
export const Layout = ({
  children,
  type = 'centered',
  title,
  header,
  showBackButton = false,
  onBack,
  className = '',
}) => {
  const containerStyles = {
    centered: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem 1rem',
      backgroundColor: colors.bg.primary,
    },
    full: {
      minHeight: '100vh',
      backgroundColor: colors.bg.primary,
    },
    sidebar: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: colors.bg.primary,
    },
  };

  const containerStyle = containerStyles[type] || containerStyles.centered;

  return (
    <div style={containerStyle} className={className}>
      {header && <div>{header}</div>}

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: type === 'centered' ? '100%' : 'auto',
        }}
      >
        {showBackButton && (
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: colors.text.primary,
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0',
            }}
            onMouseEnter={(e) => {
              e.target.style.color = colors.button.primary;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = colors.text.primary;
            }}
          >
            ← Back
          </button>
        )}

        {title && (
          <h1
            style={{
              color: colors.text.primary,
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
            }}
          >
            {title}
          </h1>
        )}

        {children}
      </div>
    </div>
  );
};

export default Layout;
