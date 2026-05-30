import React, { useState, useEffect } from 'react';
import { colors } from '../Styles/theme';

/**
 * Countdown timer component for OTP resend delays
 * @param {number} initialSeconds - Initial countdown seconds (default 60)
 * @param {function} onComplete - Callback when countdown reaches 0
 * @param {function} onResend - Handler for resend button
 * @param {boolean} autoStart - Auto-start countdown
 */
export const CountdownTimer = ({
  initialSeconds = 60,
  onComplete,
  onResend,
  autoStart = true,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    if (!isActive || seconds === 0) {
      if (seconds === 0 && isActive) {
        onComplete?.();
        setIsActive(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, seconds, onComplete]);

  const handleResend = () => {
    setSeconds(initialSeconds);
    setIsActive(true);
    onResend?.();
  };

  const isDisabled = isActive && seconds > 0;

  return (
    <div className="flex items-center justify-center gap-2">
      {isDisabled ? (
        <>
          <span style={{ color: colors.text.secondary, fontSize: '0.95rem' }}>
            Resend in
          </span>
          <span
            style={{
              color: colors.button.primary,
              fontWeight: 700,
              fontSize: '1.1rem',
              minWidth: '2rem',
              textAlign: 'center',
            }}
          >
            {seconds}s
          </span>
        </>
      ) : (
        <button
          onClick={handleResend}
          style={{
            background: 'none',
            border: 'none',
            color: colors.button.primary,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'underline',
            padding: '0.5rem 0',
          }}
          onMouseEnter={(e) => {
            e.target.style.color = colors.button.primaryDark;
          }}
          onMouseLeave={(e) => {
            e.target.style.color = colors.button.primary;
          }}
        >
          Resend Code
        </button>
      )}
    </div>
  );
};

export default CountdownTimer;
