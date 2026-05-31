import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import {
    Input,
    PasswordRequirements,
    ProgressButton,
    AuthErrorBanner,
} from '@/Components';
import { validators } from '@/Utils/formUtils';

export default function ForgotPassword({ status, email: initialEmail = '', token: initialToken = '' }) {
    const [step, setStep] = useState(initialToken ? 3 : 1);
    const [isFilled, setIsFilled] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [localErrors, setLocalErrors] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        email: initialEmail,
        code: initialToken,
        password: '',
        password_confirmation: '',
        token: initialToken,
    });

    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    useEffect(() => {
        switch (step) {
            case 1:
                setIsFilled(!!data.email.trim());
                break;
            case 2:
                setIsFilled(!!data.email.trim() && !!data.code.trim());
                break;
            case 3:
                setIsFilled(
                    passwordValid &&
                        !!data.password &&
                        data.password === data.password_confirmation,
                );
                break;
            default:
                setIsFilled(false);
        }
    }, [step, data, passwordValid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        if (localErrors[name]) {
            setLocalErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const goBack = () => {
        if (step > 1) setStep(step - 1);
        else window.history.back();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalErrors({});

        if (step === 1) {
            const emailErr = validators.email(data.email);
            if (emailErr) {
                setLocalErrors({ email: emailErr });
                return;
            }
            post(route('password.email'), {
                onSuccess: () => {
                    setStep(2);
                    setCountdown(10);
                },
            });
            return;
        }

        if (step === 2) {
            if (!data.code.trim()) {
                setLocalErrors({ code: 'Code is required' });
                return;
            }
            setData('token', data.code);
            setStep(3);
            return;
        }

        if (!passwordValid) {
            setLocalErrors({ password: 'Complete all password requirements' });
            return;
        }

        setData('token', data.token || data.code);
        post(route('password.store'), {
            onSuccess: () => {
                window.location.href = route('password.reset.success');
            },
        });
    };

    const errorMessage =
        errors.email ||
        errors.code ||
        errors.password ||
        (typeof errors === 'object' ? Object.values(errors)[0] : null);

    const subtitles = {
        1: 'Enter your email to receive the code to reset your password.',
        2: 'Enter your email to receive the code to reset your password.',
        3: 'Enter your new password',
    };

    return (
        <>
            <Head title="Forgot Password — Sandbox" />
            <AuthLayout title="Forgot Password" subtitle={subtitles[step]} onBack={goBack}>
                {status && step === 1 && <div className="alert alert-success">{status}</div>}
                {errorMessage && step === 2 && (
                    <AuthErrorBanner message="Incorrect code. Please try again." />
                )}
                {errorMessage && step !== 2 && (
                    <AuthErrorBanner message={String(errorMessage)} />
                )}

                <form onSubmit={handleSubmit} className="auth-form auth-form-stack">
                    {(step === 1 || step === 2) && (
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={handleChange}
                            error={localErrors.email}
                            required
                            hideLabel
                        />
                    )}

                    {step === 2 && (
                        <>
                            <Input
                                name="code"
                                placeholder="Code"
                                value={data.code}
                                onChange={handleChange}
                                error={localErrors.code}
                                required
                                hideLabel
                            />
                            {countdown > 0 ? (
                                <p className="resend-countdown">
                                    {countdown}s to resend new code
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    className="input-inline-action"
                                    style={{ position: 'static', transform: 'none', marginTop: 0 }}
                                    onClick={() => {
                                        post(route('password.email'));
                                        setCountdown(10);
                                    }}
                                >
                                    Resend new code
                                </button>
                            )}
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <Input
                                type="password"
                                name="password"
                                placeholder="New Password"
                                value={data.password}
                                onChange={handleChange}
                                error={localErrors.password || errors.password}
                                required
                                hideLabel
                            />
                            <Input
                                type="password"
                                name="password_confirmation"
                                placeholder="Confirm New Password"
                                value={data.password_confirmation}
                                onChange={handleChange}
                                error={errors.password_confirmation}
                                required
                                hideLabel
                            />
                            <PasswordRequirements
                                password={data.password}
                                onAllMetChange={setPasswordValid}
                            />
                        </>
                    )}

                    {step === 3 && !passwordValid ? (
                        <button type="button" className="btn btn-disabled btn-block" disabled>
                            Complete Requirements
                        </button>
                    ) : (
                        <ProgressButton
                            progressPercent={step === 3 ? 100 : step === 2 ? 66 : 33}
                            isFilled={isFilled}
                            isLoading={processing}
                            finalLabel={
                                step === 1
                                    ? 'Send Code to Email'
                                    : step === 2
                                      ? 'Confirm Code'
                                      : 'Set New Password'
                            }
                        >
                            {step === 1 ? 'Send Code to Email' : step === 2 ? 'Confirm Code' : 'Next Step'}
                        </ProgressButton>
                    )}
                </form>

                <p className="auth-link-row">
                    <Link href={route('login')}>Back to log in</Link>
                </p>
            </AuthLayout>
        </>
    );
}
