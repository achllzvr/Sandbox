import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Input, ProgressButton, AuthErrorBanner } from '@/Components';
import { validators } from '@/Utils/formUtils';

export default function ForgotPassword({ sentEmail: initialSentEmail = '' }) {
    const [step, setStep] = useState(initialSentEmail ? 2 : 1);
    const [confirmedEmail, setConfirmedEmail] = useState(initialSentEmail);
    const [isFilled, setIsFilled] = useState(false);
    const [localErrors, setLocalErrors] = useState({});
    const [countdown, setCountdown] = useState(initialSentEmail ? 10 : 0);
    const [canResend, setCanResend] = useState(!initialSentEmail);
    const [resent, setResent] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: initialSentEmail || '',
    });

    useEffect(() => {
        if (initialSentEmail) {
            setStep(2);
            setConfirmedEmail(initialSentEmail);
            setCountdown(10);
            setCanResend(false);
        }
    }, [initialSentEmail]);

    useEffect(() => {
        setIsFilled(!!data.email.trim());
    }, [data.email]);

    useEffect(() => {
        if (step !== 2 || countdown <= 0) {
            if (step === 2 && countdown <= 0) {
                setCanResend(true);
            }
            return;
        }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [step, countdown]);

    const handleChange = (e) => {
        setData('email', e.target.value);
        if (localErrors.email) {
            setLocalErrors((prev) => ({ ...prev, email: '' }));
        }
    };

    const goBack = () => {
        if (step === 2) {
            setStep(1);
            setResent(false);
            return;
        }
        window.history.back();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalErrors({});

        const emailErr = validators.email(data.email);
        if (emailErr) {
            setLocalErrors({ email: emailErr });
            return;
        }

        post(route('password.email'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setConfirmedEmail(data.email);
                setStep(2);
                setCountdown(10);
                setCanResend(false);
                setResent(false);
            },
        });
    };

    const handleResend = () => {
        setData('email', confirmedEmail);
        post(route('password.email'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setCountdown(10);
                setCanResend(false);
                setResent(true);
            },
        });
    };

    const errorMessage =
        errors.email || (typeof errors === 'object' ? Object.values(errors)[0] : null);

    if (step === 2) {
        return (
            <>
                <Head title="Check Your Email — Sandbox" />
                <AuthLayout
                    title="Check Your Email"
                    subtitle={
                        confirmedEmail
                            ? `We've sent a password reset link to ${confirmedEmail}. Open the email and follow the link to set a new password.`
                            : "We've sent a password reset link to your email. Open the email and follow the link to set a new password."
                    }
                    onBack={goBack}
                    showFooter={false}
                >
                    <div className="auth-confirmation fade-in-up">
                        {resent && (
                            <div className="alert alert-success">Reset link sent again.</div>
                        )}
                        {errors.email && (
                            <AuthErrorBanner message={String(errors.email)} />
                        )}

                        <p className="auth-helper-text auth-helper-text--center">
                            Didn&apos;t receive it? Check your spam folder, or resend the link below.
                        </p>

                        <div className="auth-confirmation__actions">
                            {!canResend && countdown > 0 && (
                                <p className="resend-countdown">{countdown}s to resend link</p>
                            )}

                            {canResend && (
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block"
                                    onClick={handleResend}
                                    disabled={processing}
                                >
                                    {processing ? 'Sending...' : 'Resend reset link'}
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="auth-link-row">
                        <Link href={route('login')}>Back to log in</Link>
                    </p>
                </AuthLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Forgot Password — Sandbox" />
            <AuthLayout
                title="Forgot Password"
                subtitle="Enter your email to receive a link to reset your password."
                onBack={goBack}
                showFooter={false}
            >
                {errorMessage && <AuthErrorBanner message={String(errorMessage)} />}

                <form onSubmit={handleSubmit} className="auth-form auth-form-stack">
                    <div className="auth-step-panel fade-in-up">
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={handleChange}
                            error={localErrors.email || errors.email}
                            required
                            hideLabel
                        />
                    </div>

                    <ProgressButton
                        progressPercent={50}
                        isFilled={isFilled}
                        isLoading={processing}
                        finalLabel="Send Reset Password Link to Email"
                    >
                        Send Reset Password Link to Email
                    </ProgressButton>
                </form>

                <p className="auth-link-row">
                    <Link href={route('login')}>Back to log in</Link>
                </p>
            </AuthLayout>
        </>
    );
}
