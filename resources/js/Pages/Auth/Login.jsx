import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Input, Button, Alert } from '@/Components';
import { validators } from '@/Utils/formUtils';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [localErrors, setLocalErrors] = useState({});
    const [isFilled, setIsFilled] = useState(false);

    useEffect(() => {
        setIsFilled(!!data.email.trim() && !!data.password);
    }, [data.email, data.password]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setData(name, type === 'checkbox' ? checked : value);
        if (localErrors[name]) {
            setLocalErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        const emailErr = validators.email(data.email);
        if (emailErr) newErrors.email = emailErr;
        if (!data.password) newErrors.password = 'Password is required';
        if (Object.keys(newErrors).length) {
            setLocalErrors(newErrors);
            return;
        }
        post(route('login'));
    };

    const firstError = errors.email || errors.password || Object.values(errors)[0];

    return (
        <>
            <Head title="Log in — Sandbox" />
            <AuthLayout title="Log in">
                {status && <Alert type="success" message={status} className="mb-4" />}
                {firstError && <Alert type="error" message={firstError} />}

                <form onSubmit={handleSubmit} className="auth-form auth-form-stack">
                    <Input
                        type="email"
                        name="email"
                        label="Email"
                        placeholder="Email"
                        value={data.email}
                        onChange={handleChange}
                        error={localErrors.email || errors.email}
                        required
                        hideLabel
                    />

                    <Input
                        type="password"
                        name="password"
                        label="Password"
                        placeholder="Password"
                        value={data.password}
                        onChange={handleChange}
                        error={localErrors.password || errors.password}
                        required
                        hideLabel
                        inlineAction={
                            canResetPassword ? (
                                <Link href={route('password.request')} className="input-inline-action">
                                    Forgot?
                                </Link>
                            ) : null
                        }
                    />

                    <Button type="submit" isFilled={isFilled} isLoading={processing}>
                        Log In
                    </Button>
                </form>

                <p className="auth-link-row">
                    Not a learner yet?{' '}
                    <Link href={route('register')}>Create your Hermit</Link>
                </p>
            </AuthLayout>
        </>
    );
}
