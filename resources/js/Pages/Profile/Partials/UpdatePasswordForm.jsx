import { useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

// TODO[backend]: Register password.update route + controller — currently no handler exists in routes/auth.php.

export default function UpdatePasswordForm({ className, variant = 'default' }) {
    const isAdmin = variant === 'admin';
    const isStudent = variant === 'student';
    const isTeacher = variant === 'teacher';
    const usesSandboxField = isAdmin || isStudent || isTeacher;
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: () => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className={isAdmin ? 'admin-profile-card__title' : usesSandboxField ? 'student-profile-form__title' : 'text-lg font-medium text-gray-900'}>
                    Update password
                </h2>
                <p className={isAdmin ? 'admin-profile-card__subtitle' : usesSandboxField ? 'student-profile-form__subtitle' : 'mt-1 text-sm text-gray-600'}>
                    Ensure your account is using a long, random password to stay secure.
                    {isAdmin && (
                        <>
                            {' '}
                            <span className="admin-todo-badge admin-todo-badge--inline">
                                TODO: password.update route
                            </span>
                        </>
                    )}
                    {isStudent && (
                        <>
                            {' '}
                            <span className="student-todo-badge">TODO</span>
                        </>
                    )}
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="Current Password" />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className={usesSandboxField ? 'input-field mt-1 block w-full' : 'mt-1 block w-full'}
                        autoComplete="current-password"
                    />

                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={usesSandboxField ? 'input-field mt-1 block w-full' : 'mt-1 block w-full'}
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className={usesSandboxField ? 'input-field mt-1 block w-full' : 'mt-1 block w-full'}
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

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
