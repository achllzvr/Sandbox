import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import {
    Input,
    PasswordRequirements,
    ProgressButton,
    AuthErrorBanner,
} from '@/Components';

export default function ResetPassword({ token, email }) {
    const [isFilled, setIsFilled] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setIsFilled(
            passwordValid &&
                !!data.password &&
                data.password === data.password_confirmation,
        );
    }, [data.password, data.password_confirmation, passwordValid]);

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!passwordValid) {
            return;
        }

        post(route('password.store'));
    };

    const errorMessage =
        errors.email ||
        errors.password ||
        (typeof errors === 'object' ? Object.values(errors)[0] : null);

    return (
        <>
            <Head title="Reset Password — Sandbox" />
            <AuthLayout
                title="Reset Password"
                subtitle="Enter your new password"
                showFooter={false}
            >
                {errorMessage && <AuthErrorBanner message={String(errorMessage)} />}

                <form onSubmit={handleSubmit} className="auth-form auth-form-stack">
                    <Input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        value={data.password}
                        onChange={handleChange}
                        error={errors.password}
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

                    {!passwordValid ? (
                        <button type="button" className="btn btn-disabled btn-block" disabled>
                            Complete Requirements
                        </button>
                    ) : (
                        <ProgressButton
                            progressPercent={100}
                            isFilled={isFilled}
                            isLoading={processing}
                            finalLabel="Set New Password"
                        >
                            Set New Password
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
