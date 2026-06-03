import { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Input, Button, AuthErrorBanner } from '@/Components';

export default function VerifyOtp({ email }) {
    const { errors, flash } = usePage().props;
    const [code, setCode] = useState('');
    const [isFilled, setIsFilled] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [canResend, setCanResend] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setIsFilled(code.trim().length >= 6);
    }, [code]);

    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        router.post(
            route('otp.verify.submit'),
            { otp: code },
            {
                onFinish: () => setSubmitting(false),
            },
        );
    };

    const handleResend = () => {
        router.post(route('verification.send'), {}, {
            onSuccess: () => {
                setCountdown(10);
                setCanResend(false);
            },
        });
    };

    return (
        <>
            <Head title="Verify your Hermit — Sandbox" />
            <AuthLayout
                title="Verify your Hermit"
                subtitle="Enter the verification code sent to your email to finish. Remember to check your inbox/ spam."
                showBack={false}
            >
                {flash?.success && <div className="alert alert-success">{flash.success}</div>}
                <AuthErrorBanner message={errors?.otp} />

                <form onSubmit={handleSubmit} className="auth-form auth-form-stack">
                    <Input
                        name="otp"
                        placeholder="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        required
                        hideLabel
                    />

                    {!canResend && countdown > 0 && (
                        <p className="resend-countdown">{countdown}s to resend new code</p>
                    )}

                    {canResend && (
                        <button
                            type="button"
                            className="input-inline-action"
                            style={{ position: 'static', transform: 'none' }}
                            onClick={handleResend}
                        >
                            Resend new code
                        </button>
                    )}

                    <Button type="submit" isFilled={isFilled} isLoading={submitting}>
                        Create Shell
                    </Button>
                </form>

                <p className="auth-link-row">
                    Wrong email? <Link href={route('logout')} method="post" as="button">Log out</Link>
                </p>
            </AuthLayout>
        </>
    );
}
