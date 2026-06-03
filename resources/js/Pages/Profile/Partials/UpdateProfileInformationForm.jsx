import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className, variant = 'default' }) {
    const user = usePage().props.auth.user;
    const isAdmin = variant === 'admin';
    const isStudent = variant === 'student';
    const isTeacher = variant === 'teacher';
    const usesSandboxField = isAdmin || isStudent || isTeacher;
    const displayName =
        user.full_name ||
        `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
        user.name ||
        '';

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: displayName,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className={isAdmin ? 'admin-profile-card__title' : usesSandboxField ? 'student-profile-form__title' : 'text-lg font-medium text-gray-900'}>
                    Profile information
                </h2>
                <p className={isAdmin ? 'admin-profile-card__subtitle' : usesSandboxField ? 'student-profile-form__subtitle' : 'mt-1 text-sm text-gray-600'}>
                    Update your account profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className={usesSandboxField ? 'input-field mt-1 block w-full' : 'mt-1 block w-full'}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className={usesSandboxField ? 'input-field mt-1 block w-full' : 'mt-1 block w-full'}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className={isAdmin ? 'admin-profile-card__subtitle' : isTeacher || isStudent ? 'student-profile-form__subtitle' : 'text-sm mt-2 text-gray-800'}>
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className={
                                    isAdmin
                                        ? 'admin-card__link'
                                        : 'underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                }
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className={isAdmin ? 'admin-profile-card__success' : isTeacher || isStudent ? 'student-profile-form__subtitle' : 'mt-2 font-medium text-sm text-green-600'}>
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {isAdmin ? (
                        <button type="submit" disabled={processing} className="admin-btn admin-btn--primary">
                            Save
                        </button>
                    ) : isStudent || isTeacher ? (
                        <button type="submit" disabled={processing} className="student-profile-form__save">
                            Save
                        </button>
                    ) : (
                        <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    )}
                    <Transition
                        show={recentlySuccessful}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className={isAdmin ? 'admin-profile-card__subtitle' : usesSandboxField ? 'student-profile-form__subtitle' : 'text-sm text-gray-600'}>
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
