import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input, Button, Alert, PasswordRequirements } from '@/Components';
import { colors, typography, spacing, shadows, borderRadius, transitions } from '@/Styles/theme';
import { validators } from '@/Utils/formUtils';

export default function Register() {
    const [step, setStep] = useState(1); // 1: Names, 2: Email, 3: Password, 4: Optional, 5: Review
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        birthday: '',
        contact_no: '',
        affiliation: '',
    });

    const [localErrors, setLocalErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        if (localErrors[name]) {
            setLocalErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Update isFilled whenever form data or step changes
    useEffect(() => {
        switch (step) {
            case 1:
                setIsFilled(!!data.first_name && !!data.last_name);
                break;
            case 2:
                setIsFilled(!!data.email);
                break;
            case 3:
                setIsFilled(!!data.password && !!data.password_confirmation);
                break;
            case 4:
                setIsFilled(true); // Optional step - always allow
                break;
            case 5:
                setIsFilled(agreedToTerms);
                break;
            default:
                setIsFilled(false);
        }
    }, [step, data, agreedToTerms]);

    // Step 1: Names
    const handleStepOne = (e) => {
        e.preventDefault();
        const newErrors = {};
        
        if (!data.first_name) newErrors.first_name = 'First name is required';
        if (!data.last_name) newErrors.last_name = 'Last name is required';
        
        if (Object.keys(newErrors).length > 0) {
            setLocalErrors(newErrors);
            return;
        }
        
        setStep(2);
        setLocalErrors({});
        setIsFilled(false);
    };

    // Step 2: Email
    const handleStepTwo = (e) => {
        e.preventDefault();
        const emailErr = validators.email(data.email);
        if (emailErr) {
            setLocalErrors({ email: emailErr });
            return;
        }
        setStep(3);
        setLocalErrors({});
        setIsFilled(false);
    };

    // Step 3: Password
    const handleStepThree = (e) => {
        e.preventDefault();
        const passErr = validators.password(data.password);
        if (passErr) {
            setLocalErrors({ password: passErr });
            return;
        }

        const confirmErr = validators.confirmPassword(data.password, data.password_confirmation);
        if (confirmErr) {
            setLocalErrors({ password_confirmation: confirmErr });
            return;
        }

        setStep(4);
        setLocalErrors({});
        setIsFilled(false);
    };

    // Step 4: Optional Info
    const handleStepFour = (e) => {
        e.preventDefault();
        setStep(5);
        setLocalErrors({});
        setIsFilled(agreedToTerms);
    };

    // Step 5: Review & Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!agreedToTerms) {
            setLocalErrors({ terms: 'You must agree to the terms' });
            return;
        }

        post(route('register'));
    };

    const getStepTitle = () => {
        const titles = [
            "What's your name?",
            "What's your email?",
            "Create a password",
            "Let us know more",
            "Review your info"
        ];
        return titles[step - 1];
    };

    const getProgressPercentage = () => {
        return (step / 5) * 100;
    };

    return (
        <>
            <Head title="Create your Hermit" />
            
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
                    {/* Progress Bar */}
                    <div style={{ marginBottom: spacing.lg }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: spacing.sm,
                                marginBottom: spacing.md,
                            }}
                        >
                            {[1, 2, 3, 4, 5].map((s) => (
                                <div
                                    key={s}
                                    style={{
                                        flex: 1,
                                        height: '6px',
                                        borderRadius: borderRadius.full,
                                        backgroundColor: s <= step ? colors.button.primary : colors.border.light,
                                        transition: `background-color ${transitions.base}`,
                                    }}
                                />
                            ))}
                        </div>
                        <p
                            style={{
                                fontSize: typography.fontSize.xs,
                                color: colors.text.secondary,
                                margin: 0,
                                textTransform: 'uppercase',
                                fontWeight: 600,
                            }}
                        >
                            Step {step} of 5
                        </p>
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

                    {/* Error Messages */}
                    {localErrors.terms && (
                        <Alert
                            type="error"
                            message={localErrors.terms}
                            className="mb-4"
                        />
                    )}

                    {/* Forms for each step */}
                    <form onSubmit={step === 1 ? handleStepOne : step === 2 ? handleStepTwo : step === 3 ? handleStepThree : step === 4 ? handleStepFour : handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, fontFamily: typography.fontFamily.primary }}>
                        
                        {/* Step 1: Names */}
                        {step === 1 && (
                            <>
                                <Input
                                    type="text"
                                    label="First Name"
                                    placeholder="Your first name"
                                    name="first_name"
                                    value={data.first_name}
                                    onChange={handleChange}
                                    error={localErrors.first_name || errors.first_name}
                                    required
                                />
                                <Input
                                    type="text"
                                    label="Last Name"
                                    placeholder="Your last name"
                                    name="last_name"
                                    value={data.last_name}
                                    onChange={handleChange}
                                    error={localErrors.last_name || errors.last_name}
                                    required
                                />
                            </>
                        )}

                        {/* Step 2: Email */}
                        {step === 2 && (
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

                        {/* Step 3: Password */}
                        {step === 3 && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        label="Create a Password"
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
                                    <PasswordRequirements
                                        password={data.password}
                                        confirmPassword={data.password_confirmation}
                                    />
                                )}
                            </>
                        )}

                        {/* Step 4: Optional Info */}
                        {step === 4 && (
                            <>
                                <Input
                                    type="date"
                                    label="Date of Birth (Optional)"
                                    name="birthday"
                                    value={data.birthday}
                                    onChange={handleChange}
                                />
                                <Input
                                    type="tel"
                                    label="Contact Number (Optional)"
                                    placeholder="+1 (555) 000-0000"
                                    name="contact_no"
                                    value={data.contact_no}
                                    onChange={handleChange}
                                />
                                <Input
                                    type="text"
                                    label="Affiliation (Optional)"
                                    placeholder="School, Organization, or Company"
                                    name="affiliation"
                                    value={data.affiliation}
                                    onChange={handleChange}
                                />
                            </>
                        )}

                        {/* Step 5: Review */}
                        {step === 5 && (
                            <>
                                <div
                                    style={{
                                        backgroundColor: colors.bg.primary,
                                        borderRadius: borderRadius.lg,
                                        padding: spacing.lg,
                                    }}
                                >
                                    <div style={{ marginBottom: spacing.md }}>
                                        <h4 style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, margin: `0 0 ${spacing.xs} 0`, fontWeight: 700 }}>NAME</h4>
                                        <p style={{ fontSize: typography.fontSize.md, color: colors.text.primary, margin: 0 }}>{data.first_name} {data.last_name}</p>
                                    </div>
                                    <div style={{ marginBottom: spacing.md }}>
                                        <h4 style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, margin: `0 0 ${spacing.xs} 0`, fontWeight: 700 }}>EMAIL</h4>
                                        <p style={{ fontSize: typography.fontSize.md, color: colors.text.primary, margin: 0 }}>{data.email}</p>
                                    </div>
                                    {data.birthday && (
                                        <div style={{ marginBottom: spacing.md }}>
                                            <h4 style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, margin: `0 0 ${spacing.xs} 0`, fontWeight: 700 }}>BIRTHDAY</h4>
                                            <p style={{ fontSize: typography.fontSize.md, color: colors.text.primary, margin: 0 }}>{data.birthday}</p>
                                        </div>
                                    )}
                                    {data.contact_no && (
                                        <div style={{ marginBottom: spacing.md }}>
                                            <h4 style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, margin: `0 0 ${spacing.xs} 0`, fontWeight: 700 }}>CONTACT</h4>
                                            <p style={{ fontSize: typography.fontSize.md, color: colors.text.primary, margin: 0 }}>{data.contact_no}</p>
                                        </div>
                                    )}
                                </div>

                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: spacing.sm,
                                        cursor: 'pointer',
                                        fontSize: typography.fontSize.sm,
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => {
                                            setAgreedToTerms(e.target.checked);
                                            checkFormFilled();
                                        }}
                                        style={{ 
                                            accentColor: colors.button.primary,
                                            cursor: 'pointer',
                                            marginTop: '4px',
                                        }}
                                    />
                                    <span style={{ color: colors.text.primary }}>
                                        I agree to the <a href="#" style={{ color: colors.text.link, textDecoration: 'underline' }}>Terms of Service</a> and <a href="#" style={{ color: colors.text.link, textDecoration: 'underline' }}>Privacy Policy</a>
                                    </span>
                                </label>
                            </>
                        )}

                        {/* Navigation Buttons */}
                        <Button
                            variant="primary"
                            size="lg"
                            type="submit"
                            isLoading={processing}
                            isFilled={isFilled}
                            style={{ width: '100%' }}
                        >
                            {step === 4 ? 'CONTINUE' : step === 5 ? 'CREATE SHELL' : 'NEXT STEP'}
                        </Button>
                    </form>

                    {/* Sign In Link */}
                    {step === 1 && (
                        <div
                            style={{
                                marginTop: spacing.xl,
                                textAlign: 'center',
                                borderTop: `1px solid ${colors.border.light}`,
                                paddingTop: spacing.lg,
                            }}
                        >
                            <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.sm, margin: 0 }}>
                                Already have a shell?{' '}
                                <Link
                                    href={route('login')}
                                    style={{
                                        color: colors.button.primary,
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                    }}
                                >
                                    Log in here
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
