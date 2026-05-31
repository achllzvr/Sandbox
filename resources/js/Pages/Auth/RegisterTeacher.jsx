import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import {
    Input,
    PasswordRequirements,
    ProgressButton,
    FileUpload,
    AuthErrorBanner,
} from '@/Components';
import { validators } from '@/Utils/formUtils';

export default function RegisterTeacher() {
    const [step, setStep] = useState(1);
    const [isFilled, setIsFilled] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [username, setUsername] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [localErrors, setLocalErrors] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        birthday: '',
        contact_no: '',
        affiliation: '',
        credential_proof: null,
    });

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
                setIsFilled(!!data.birthday && !!data.contact_no.trim() && !!data.affiliation.trim());
                break;
            case 4:
                setIsFilled(!!data.affiliation.trim() && termsAccepted);
                break;
            case 5:
                setIsFilled(!!data.credential_proof);
                break;
            default:
                setIsFilled(false);
        }
    }, [step, data, passwordValid, username, termsAccepted]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const generateUsername = () => {
        const base = `${data.first_name}${data.last_name}`
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
        setUsername(`${base || 'affiliate'}${Math.floor(Math.random() * 900) + 100}`);
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
            if (!passwordValid) newErrors.password = 'Please meet all password requirements';
            if (data.password !== data.password_confirmation) {
                newErrors.password_confirmation = 'Passwords do not match';
            }
            if (Object.keys(newErrors).length) {
                setLocalErrors(newErrors);
                return;
            }
            if (!username) generateUsername();
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

        if (step === 3) {
            if (!data.birthday || !data.contact_no.trim() || !data.affiliation.trim()) {
                setLocalErrors({ form: 'Please complete all fields' });
                return;
            }
            setStep(4);
            return;
        }

        if (step === 4) {
            if (!termsAccepted) {
                setLocalErrors({ terms: 'You must accept the terms' });
                return;
            }
            setStep(5);
            return;
        }

        post(route('register.teacher.store'), { forceFormData: true });
    };

    const progressMap = { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 };

    return (
        <>
            <Head title="Create your Affiliated Hermit — Sandbox" />
            <AuthLayout
                title={
                    step === 4
                        ? 'Affiliation verification'
                        : 'Create your Affiliated Hermit'
                }
                subtitle={
                    step === 4
                        ? 'Enter the name for your affiliated organization/ institution for us to verify if an affiliation already exists.'
                        : step === 5
                          ? 'Upload the required documents for verification.'
                          : null
                }
                onBack={goBack}
            >
                <AuthErrorBanner message={localErrors.form || Object.values(errors)[0]} />

                <form onSubmit={handleStepSubmit} className="auth-form auth-form-stack">
                    {step === 1 && (
                        <>
                            <div className="name-row">
                                <Input
                                    name="last_name"
                                    placeholder="Last Name"
                                    value={data.last_name}
                                    onChange={handleChange}
                                    error={localErrors.last_name || errors.last_name}
                                    required
                                    hideLabel
                                />
                                <Input
                                    name="first_name"
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
                                placeholder="Confirm Password"
                                value={data.password_confirmation}
                                onChange={handleChange}
                                error={errors.password_confirmation}
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
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                                placeholder="Contact Number"
                                value={data.contact_no}
                                onChange={handleChange}
                                error={errors.contact_no}
                                required
                                hideLabel
                            />
                            <Input
                                name="affiliation"
                                placeholder="Affiliation"
                                value={data.affiliation}
                                onChange={handleChange}
                                error={errors.affiliation}
                                required
                                hideLabel
                            />
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <Input
                                name="affiliation"
                                placeholder="Organization/ Institution"
                                value={data.affiliation}
                                onChange={handleChange}
                                error={errors.affiliation}
                                required
                                hideLabel
                            />
                            <div className="auth-terms-block">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <span>
                                        I agree to the Terms and Conditions and consent to the
                                        processing of my personal data in accordance with the Data
                                        Privacy Act.
                                    </span>
                                </label>
                            </div>
                            {localErrors.terms && (
                                <span className="error-message">{localErrors.terms}</span>
                            )}
                        </>
                    )}

                    {step === 5 && (
                        <>
                            <FileUpload
                                label="Professional Headshot"
                                fileName={data.credential_proof?.name}
                                onChange={(e) =>
                                    setData('credential_proof', e.target.files?.[0] || null)
                                }
                                error={errors.credential_proof}
                            />
                            <FileUpload label="Front of ID" />
                            <FileUpload label="Back of ID" />
                            <FileUpload label="Authorization Letter" />
                        </>
                    )}

                    <ProgressButton
                        progressPercent={progressMap[step]}
                        isFilled={isFilled}
                        isLoading={processing}
                        finalLabel={step === 5 ? 'Create Shell' : 'Next Step'}
                    >
                        Next Step
                    </ProgressButton>
                </form>

                {step === 1 && (
                    <p className="auth-link-row">
                        Registering as a learner?{' '}
                        <Link href={route('register')}>Student sign up</Link>
                    </p>
                )}
            </AuthLayout>
        </>
    );
}
