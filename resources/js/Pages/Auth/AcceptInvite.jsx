import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Input, PasswordRequirements, ProgressButton, AuthErrorBanner } from '@/Components';
import { validators } from '@/Utils/formUtils';

const ROLE_LABELS = {
    admin: 'Admin',
    content_creator: 'Creator',
    teacher: 'Teacher',
};

export default function AcceptInvite({ token, email, role }) {
    const [step, setStep] = useState(1);
    const [isFilled, setIsFilled] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [localErrors, setLocalErrors] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        token,
        first_name: '',
        last_name: '',
        password: '',
        password_confirmation: '',
        birthday: '',
        contact_no: '',
    });

    const roleLabel = ROLE_LABELS[role] || role;
    const title =
        role === 'admin'
            ? 'Create your Admin account'
            : role === 'content_creator'
              ? 'Create your Creator account'
              : 'Create your Affiliated Hermit';

    useEffect(() => {
        if (step === 1) {
            setIsFilled(
                !!data.first_name.trim() &&
                    !!data.last_name.trim() &&
                    !!data.password &&
                    !!data.password_confirmation &&
                    passwordValid &&
                    data.password === data.password_confirmation
            );
        } else {
            setIsFilled(true);
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
        if (step > 1) setStep(1);
        else window.history.back();
    };

    const handleStepSubmit = (e) => {
        e.preventDefault();
        setLocalErrors({});

        if (step === 1) {
            const newErrors = {};
            if (!data.first_name.trim()) newErrors.first_name = 'Required';
            if (!data.last_name.trim()) newErrors.last_name = 'Required';
            const passErr = validators.password(data.password);
            if (passErr) newErrors.password = passErr;
            if (data.password !== data.password_confirmation) {
                newErrors.password_confirmation = 'Passwords do not match';
            }
            if (!passwordValid) newErrors.password = 'Please meet all password requirements';
            if (Object.keys(newErrors).length) {
                setLocalErrors(newErrors);
                return;
            }
            setStep(2);
            return;
        }

        post(route('accept.invite.store'));
    };

    return (
        <>
            <Head title={`${title} — Sandbox`} />
            <AuthLayout
                title={title}
                subtitle={
                    <>
                        Invited as <strong>{roleLabel}</strong> · {email}
                    </>
                }
                onBack={goBack}
            >
                <AuthErrorBanner message={Object.values(errors)[0]} />

                <form onSubmit={handleStepSubmit} className="auth-form auth-form-stack">
                    {step === 1 && (
                        <>
                            <div className="name-row">
                                <Input
                                    name="last_name"
                                    label="Last Name"
                                    placeholder="Last Name"
                                    value={data.last_name}
                                    onChange={handleChange}
                                    error={localErrors.last_name || errors.last_name}
                                    required
                                    hideLabel
                                />
                                <Input
                                    name="first_name"
                                    label="First Name"
                                    placeholder="First Name"
                                    value={data.first_name}
                                    onChange={handleChange}
                                    error={localErrors.first_name || errors.first_name}
                                    required
                                    hideLabel
                                />
                            </div>
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
                            />
                            <Input
                                type="password"
                                name="password_confirmation"
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                value={data.password_confirmation}
                                onChange={handleChange}
                                error={
                                    localErrors.password_confirmation || errors.password_confirmation
                                }
                                required
                                hideLabel
                            />
                            {data.password && (
                                <PasswordRequirements
                                    password={data.password}
                                    onAllMetChange={setPasswordValid}
                                />
                            )}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Input
                                type="date"
                                name="birthday"
                                label="Birthdate"
                                placeholder="Birthdate"
                                value={data.birthday}
                                onChange={handleChange}
                                error={errors.birthday}
                                hideLabel
                            />
                            <Input
                                name="contact_no"
                                label="Contact Number"
                                placeholder="Contact Number"
                                value={data.contact_no}
                                onChange={handleChange}
                                error={errors.contact_no}
                                hideLabel
                            />
                            {role === 'content_creator' && (
                                <p className="auth-helper-text">
                                    {/* TODO: Add affiliation verification document upload step. */}
                                    TODO: Affiliation verification uploads will be collected in a
                                    follow-up step.
                                </p>
                            )}
                        </>
                    )}

                    <ProgressButton
                        type="submit"
                        isFilled={isFilled}
                        isLoading={processing}
                        progressPercent={step === 1 ? 50 : 100}
                        finalLabel="Finish setup"
                    >
                        Next step
                    </ProgressButton>
                </form>
            </AuthLayout>
        </>
    );
}
