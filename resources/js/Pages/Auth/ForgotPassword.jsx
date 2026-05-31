import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input, Button, Alert } from '@/Components';
import { colors, typography, spacing, shadows, borderRadius, transitions } from '@/Styles/theme';
import { validators } from '@/Utils/formUtils';

export default function ForgotPassword({ status }) {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: Password
    const [isFilled, setIsFilled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMet, setPasswordMet] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        code: '',
        password: '',
        password_confirmation: '',
    });

    const [localErrors, setLocalErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        
        if (localErrors[name]) {
            setLocalErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Check password requirements
        if (name === 'password') {
            setPasswordMet({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
                special: /[!@#$%^&*]/.test(value),
            });
        }
    };

    // Update isFilled whenever form data or step changes
    useEffect(() => {
        switch (step) {
            case 1:
                setIsFilled(!!data.email);
                break;
            case 2:
                setIsFilled(!!data.code);
                break;
            case 3:
                setIsFilled(Object.values(passwordMet).every(v => v) && data.password === data.password_confirmation && !!data.password_confirmation);
                break;
            default:
                setIsFilled(false);
        }
    }, [step, data, passwordMet]);

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Step 1: Send Email
    const handleStepOne = (e) => {
        e.preventDefault();
        const emailErr = validators.email(data.email);
        if (emailErr) {
            setLocalErrors({ email: emailErr });
            return;
        }
        
        // Submit to send reset code
        post(route('password.email'), {
            onSuccess: () => {
                setStep(2);
                setCountdown(300); // 5 minutes
                setLocalErrors({});
            },
            onError: (errors) => {
                setLocalErrors(errors);
            },
        });
    };

    // Step 2: Verify Code
    const handleStepTwo = (e) => {
        e.preventDefault();
        if (!data.code) {
            setLocalErrors({ code: 'Code is required' });
            return;
        }
        
        // Move to password reset step
        setStep(3);
        setLocalErrors({});
        setIsFilled(false);
    };

    // Step 3: Reset Password
    const handleStepThree = (e) => {
        e.preventDefault();
        
        const passErr = validators.password(data.password);
        if (passErr) {
            setLocalErrors({ password: passErr });
            return;
        }

        if (data.password !== data.password_confirmation) {
            setLocalErrors({ password_confirmation: 'Passwords do not match' });
            return;
        }

        post(route('password.store'), {
            email: data.email,
            token: data.code,
            password: data.password,
            password_confirmation: data.password_confirmation,
        });
    };

    const getStepTitle = () => {
        const titles = [
            'Reset your password',
            'Enter verification code',
            'Create new password'
        ];
        return titles[step - 1];
    };

    return (
        <>
            <Head title="Reset Password" />
            
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
                    onClick={() => {
                        if (step > 1) setStep(step - 1);
                        else window.history.back();
                    }}
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
                    {/* Progress Indicator */}
                    <div style={{ marginBottom: spacing.xl, textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: borderRadius.full,
                                        backgroundColor: s <= step ? colors.button.primary : colors.border.light,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: s <= step ? 'white' : colors.text.secondary,
                                        fontWeight: 'bold',
                                        fontSize: typography.fontSize.md,
                                        transition: `background-color ${transitions.base}`,
                                    }}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Header */}
                    <div style={{ marginBottom: spacing.xl, textAlign: 'center' }}>
                        <h1
                            style={{
                                fontFamily: typography.fontFamily.heading,
                                fontSize: typography.fontSize['2xl'],
                                fontWeight: 'bold',
                                color: colors.text.primary,
                                margin: 0,
                            }}
                        >
                            {getStepTitle()}
                        </h1>
                    </div>

                    {/* Status Messages */}
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
                            title="Error"
                            message={errors.general}
                            className="mb-4"
                        />
                    )}

                    {step === 2 && errors.email && (
                        <Alert
                            type="error"
                            title="Invalid Code"
                            message={errors.email}
                            className="mb-4"
                        />
                    )}

                    {/* Form */}
                    <form onSubmit={step === 1 ? handleStepOne : step === 2 ? handleStepTwo : handleStepThree} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, fontFamily: typography.fontFamily.primary }}>
                        
                        {/* Step 1: Email */}
                        {step === 1 && (
                            <Input
                                type="email"
                                label="Email Address"
                                placeholder="you@example.com"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={localErrors.email || errors.email}
                                required
                            />
                        )}

                        {/* Step 2: Verification Code */}
                        {step === 2 && (
                            <>
                                <Input
                                    type="text"
                                    label="Verification Code"
                                    placeholder="Enter 6-digit code"
                                    name="code"
                                    value={data.code}
                                    onChange={handleChange}
                                    error={localErrors.code || errors.code}
                                    required
                                />
                                
                                {countdown > 0 && (
                                    <p style={{ 
                                        fontSize: typography.fontSize.sm, 
                                        color: colors.text.secondary,
                                        textAlign: 'center',
                                        margin: 0,
                                    }}>
                                        {Math.floor(countdown / 60)}m {countdown % 60}s to resend new code
                                    </p>
                                )}
                            </>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        label="New Password"
                                        placeholder="Min 8 characters"
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

                                <Input
                                    type="password"
                                    label="Confirm Password"
                                    placeholder="Re-enter password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={handleChange}
                                    error={localErrors.password_confirmation || errors.password_confirmation}
                                    required
                                />

                                {data.password && (
                                    <div
                                        style={{
                                            backgroundColor: colors.bg.primary,
                                            borderRadius: borderRadius.lg,
                                            padding: spacing.lg,
                                        }}
                                    >
                                        <p style={{ 
                                            fontSize: typography.fontSize.xs, 
                                            fontWeight: 700,
                                            color: colors.text.secondary,
                                            margin: `0 0 ${spacing.md} 0`,
                                            textTransform: 'uppercase',
                                        }}>
                                            Password Requirements
                                        </p>
                                        {[
                                            { key: 'length', label: '8+ characters', met: passwordMet.length },
                                            { key: 'uppercase', label: 'Uppercase letter', met: passwordMet.uppercase },
                                            { key: 'lowercase', label: 'Lowercase letter', met: passwordMet.lowercase },
                                            { key: 'number', label: 'Number', met: passwordMet.number },
                                            { key: 'special', label: 'Special character (!@#$%)', met: passwordMet.special },
                                        ].map((req) => (
                                            <div
                                                key={req.key}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: spacing.sm,
                                                    fontSize: typography.fontSize.sm,
                                                    color: req.met ? '#4CAF50' : colors.text.secondary,
                                                    marginBottom: spacing.sm,
                                                }}
                                            >
                                                <span style={{ fontSize: '1rem' }}>
                                                    {req.met ? '✓' : '○'}
                                                </span>
                                                {req.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Submit Button */}
                        <Button
                            variant="primary"
                            size="lg"
                            type="submit"
                            isLoading={processing}
                            isFilled={isFilled}
                            style={{ width: '100%' }}
                            disabled={step === 2 && countdown === 0}
                        >
                            {step === 1 ? 'SEND CODE' : step === 2 ? 'VERIFY CODE' : 'SET NEW PASSWORD'}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <div
                        style={{
                            marginTop: spacing.xl,
                            textAlign: 'center',
                            borderTop: `1px solid ${colors.border.light}`,
                            paddingTop: spacing.lg,
                        }}
                    >
                        <Link
                            href={route('login')}
                            style={{
                                color: colors.button.primary,
                                fontWeight: 700,
                                textDecoration: 'none',
                                fontSize: typography.fontSize.sm,
                            }}
                        >
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
