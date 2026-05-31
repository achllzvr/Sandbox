import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input, Button, Alert } from '@/Components';
import { colors, typography, spacing, shadows, borderRadius, transitions } from '@/Styles/theme';
import { validators } from '@/Utils/formUtils';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [localErrors, setLocalErrors] = useState({});
    const [isFilled, setIsFilled] = useState(false);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setData(name, newValue);
        
        // Clear error on input
        if (localErrors[name]) {
            setLocalErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Update isFilled whenever data changes
    useEffect(() => {
        setIsFilled(!!(data.email && data.password));
    }, [data.email, data.password]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate
        const newErrors = {};
        const emailErr = validators.email(data.email);
        if (emailErr) newErrors.email = emailErr;
        if (!data.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setLocalErrors(newErrors);
            return;
        }

        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />
            
            <style>{`
                @font-face {
                    font-family: 'Sparky Stones';
                    src: url('/fonts/SparkyStones.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap;
                }
                @font-face {
                    font-family: 'Montley Forces';
                    src: url('/fonts/MotleyForces.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap;
                }
                @font-face {
                    font-family: 'Roboto';
                    src: url('/fonts/Roboto.ttf') format('truetype');
                    font-weight: 400;
                    font-style: normal;
                    font-display: swap;
                }
                * {
                    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
                h1, h2, h3, .heading {
                    font-family: 'Montley Forces', Georgia, serif;
                }
            `}</style>

            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.bg.primary,
                    padding: spacing.md,
                    position: 'relative',
                }}
            >
                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    style={{
                        position: 'absolute',
                        top: `calc(70px + ${spacing.lg})`,
                        left: spacing.lg,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        borderRadius: borderRadius.md,
                        backgroundColor: colors.input.bg,
                        border: `2px solid ${colors.input.border}`,
                        cursor: 'pointer',
                        color: colors.text.primary,
                        boxShadow: shadows.backBtn,
                        transition: `transform ${transitions.base}, box-shadow ${transitions.base}`,
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'translateY(4px)';
                        e.currentTarget.style.boxShadow = '0 0 0 0 #C4AC7A';
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = shadows.backBtn;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = shadows.backBtn;
                    }}
                >
                    ←
                </button>

                {/* Form Container */}
                <div
                    style={{
                        width: '100%',
                        maxWidth: '480px',
                        backgroundColor: colors.bg.primary,
                        padding: `${spacing.xl} ${spacing.lg}`,
                    }}
                >
                    {/* Header */}
                    <div style={{ marginBottom: spacing.xl, textAlign: 'center' }}>
                        <h1
                            style={{
                                fontFamily: typography.fontFamily.heading,
                                fontSize: typography.fontSize['3xl'],
                                fontWeight: 'bold',
                                color: colors.text.primary,
                                marginBottom: 0,
                                margin: 0,
                            }}
                        >
                            Log in
                        </h1>
                    </div>

                    {/* Status/Error Messages */}
                    {status && (
                        <Alert
                            type="success"
                            message={status}
                            className="mb-4"
                        />
                    )}

                    {errors.general && (
                        <Alert
                            type="error"
                            title="Login Error"
                            message={errors.general}
                            className="mb-4"
                        />
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, fontFamily: typography.fontFamily.primary }}>
                        <Input
                            type="email"
                            label="Email or username"
                            placeholder="you@example.com"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            error={localErrors.email || errors.email}
                            required
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                placeholder="Enter your password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                error={localErrors.password || errors.password}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: colors.button.primary,
                                    cursor: 'pointer',
                                    fontSize: typography.fontSize.sm,
                                    fontWeight: 700,
                                    textAlign: 'left',
                                    padding: `${spacing.xs} 0`,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                {showPassword ? 'Hide' : 'Show'} Password
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: spacing.sm,
                                    cursor: 'pointer',
                                    fontSize: typography.fontSize.sm,
                                }}
                            >
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={handleChange}
                                    style={{ 
                                        accentColor: colors.button.primary,
                                        cursor: 'pointer',
                                    }}
                                />
                                <span style={{ color: colors.text.primary }}>Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{
                                        color: colors.text.link,
                                        fontSize: typography.fontSize.sm,
                                        fontWeight: 700,
                                        textDecoration: 'underline',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <Button
                            variant="primary"
                            size="lg"
                            type="submit"
                            isLoading={processing}
                            isFilled={isFilled}
                            style={{ width: '100%' }}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Footer Section */}
                    <div
                        style={{
                            marginTop: spacing.xl,
                            paddingTop: spacing.lg,
                            borderTop: `1px solid ${colors.border.light}`,
                            textAlign: 'center',
                        }}
                    >
                        <p style={{ 
                            color: colors.text.secondary, 
                            fontSize: typography.fontSize.sm,
                            margin: `0 0 ${spacing.lg} 0`,
                        }}>
                            Don't have an account?{' '}
                            <Link
                                href={route('register')}
                                style={{
                                    color: colors.button.primary,
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                }}
                            >
                                Create one now
                            </Link>
                        </p>
                    </div>

                    {/* Terms */}
                    <p
                        style={{
                            marginTop: spacing.lg,
                            fontSize: typography.fontSize.xs,
                            color: colors.text.link,
                            textAlign: 'center',
                            lineHeight: 1.5,
                            margin: `${spacing.lg} 0 0 0`,
                        }}
                    >
                        By signing in to Sandbox, you agree to our{' '}
                        <a href="#" style={{ color: colors.text.link, textDecoration: 'underline' }}>
                            Terms
                        </a>{' '}
                        and{' '}
                        <a href="#" style={{ color: colors.text.link, textDecoration: 'underline' }}>
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
