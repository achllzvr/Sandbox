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

export default function Register() {
    const [step, setStep] = useState(1);
    const [isFilled, setIsFilled] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [username, setUsername] = useState('');

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

    useEffect(() => {
        switch (step) {
            case 1:
                setIsFilled(
                    !!data.first_name.trim() &&
                        !!data.last_name.trim() &&
                        !!data.email.trim() &&
                        !!data.password &&
                        !!data.password_confirmation &&
                        passwordValid &&
                        data.password === data.password_confirmation,
                );
                break;
            case 2:
                setIsFilled(!!username.trim());
                break;
            case 3:
                setIsFilled(!!data.birthday && !!data.contact_no.trim());
                break;
            default:
                setIsFilled(false);
        }
    }, [step, data, passwordValid, username]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        if (localErrors[name]) {
            setLocalErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const generateUsername = () => {
        const base = `${data.first_name}${data.last_name}`
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
        setUsername(`${base || 'hermit'}${Math.floor(Math.random() * 900) + 100}`);
    };

    const goBack = () => {
        if (step > 1) setStep(step - 1);
        else window.history.back();
    };

    const handleStepSubmit = (e) => {
        e.preventDefault();
        setLocalErrors({});

        if (step === 1) {
            const newErrors = {};
            if (!data.first_name.trim()) newErrors.first_name = 'Required';
            if (!data.last_name.trim()) newErrors.last_name = 'Required';
            const emailErr = validators.email(data.email);
            if (emailErr) newErrors.email = emailErr;
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
            if (!username) {
                generateUsername();
            }
            setStep(2);
            return;
        }

        if (step === 2) {
            if (!username.trim()) {
                setLocalErrors({ username: 'Username is required' });
                return;
            }
            setStep(3);
            return;
        }

        post(route('register.store'));
    };

    const progressMap = { 1: 33, 2: 66, 3: 100 };
    const titles = {
        1: 'Create your Hermit',
        2: 'Create your Hermit',
        3: 'Create your Hermit',
    };

    return (
        <>
            <Head title="Create your Hermit — Sandbox" />
            <AuthLayout title={titles[step]} onBack={goBack}>
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
                            />
                            <Input
                                type="password"
                                name="password_confirmation"
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                value={data.password_confirmation}
                                onChange={handleChange}
                                error={
                                    localErrors.password_confirmation ||
                                    errors.password_confirmation
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
                                name="username"
                                label="Username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (localErrors.username) {
                                        setLocalErrors((prev) => ({ ...prev, username: '' }));
                                    }
                                }}
                                error={localErrors.username}
                                required
                                hideLabel
                                inlineAction="Generate"
                                onInlineAction={generateUsername}
                            />
                            <p className="auth-helper-text">
                                <strong>Make it yours!</strong> You can change your username every
                                31 days.
                            </p>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <Input
                                type="date"
                                name="birthday"
                                label="Birthdate"
                                placeholder="Birthdate"
                                value={data.birthday}
                                onChange={handleChange}
                                error={errors.birthday}
                                required
                                hideLabel
                            />
                            <Input
                                type="tel"
                                name="contact_no"
                                label="Contact Number"
                                placeholder="Contact Number"
                                value={data.contact_no}
                                onChange={handleChange}
                                error={errors.contact_no}
                                required
                                hideLabel
                            />
                            <div className="form-group">
                                <select
                                    name="affiliation"
                                    value={data.affiliation}
                                    onChange={handleChange}
                                    className="input-field select-field"
                                >
                                    <option value="">Affiliation</option>
                                    <option value="school">School</option>
                                    <option value="university">University</option>
                                    <option value="company">Company</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </>
                    )}

                    <ProgressButton
                        progressPercent={progressMap[step]}
                        isFilled={isFilled}
                        isLoading={processing}
                        finalLabel="Create Shell"
                    >
                        Next Step
                    </ProgressButton>
                </form>

                {step === 1 && (
                    <p className="auth-link-row">
                        Already have a shell? <Link href={route('login')}>Log in</Link>
                    </p>
                )}
            </AuthLayout>
        </>
    );
}
