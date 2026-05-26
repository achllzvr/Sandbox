import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        first_name:            '',
        last_name:             '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        birthday:              '',
        contact_no:            '',
        affiliation:           '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('register'));
    }

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-stone-900">Create an account</h2>
                <p className="text-sm text-stone-500 mt-1">Join Sandbox to start your certification journey.</p>
            </div>

            <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="first_name" value="First Name" />
                        <TextInput
                            id="first_name"
                            name="first_name"
                            value={data.first_name}
                            className="mt-1 block w-full"
                            autoComplete="given-name"
                            isFocused={true}
                            onChange={(e) => setData('first_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="last_name" value="Last Name" />
                        <TextInput
                            id="last_name"
                            name="last_name"
                            value={data.last_name}
                            className="mt-1 block w-full"
                            autoComplete="family-name"
                            onChange={(e) => setData('last_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="birthday" value="Birthday (optional)" />
                    <TextInput
                        id="birthday"
                        type="date"
                        name="birthday"
                        value={data.birthday}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('birthday', e.target.value)}
                    />
                    <InputError message={errors.birthday} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="contact_no" value="Contact number (optional)" />
                    <TextInput
                        id="contact_no"
                        name="contact_no"
                        value={data.contact_no}
                        className="mt-1 block w-full"
                        autoComplete="tel"
                        onChange={(e) => setData('contact_no', e.target.value)}
                    />
                    <InputError message={errors.contact_no} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="affiliation" value="School / Organization (optional)" />
                    <TextInput
                        id="affiliation"
                        name="affiliation"
                        value={data.affiliation}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('affiliation', e.target.value)}
                    />
                    <InputError message={errors.affiliation} className="mt-2" />
                </div>

                <div className="mt-8">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-colors"
                    >
                        Create account
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center flex flex-col gap-3 border-t border-stone-200 pt-6">
                <p className="text-sm text-stone-600">
                    Already have an account?{' '}
                    <Link href={route('login')} className="font-medium text-amber-600 hover:text-amber-800 transition-colors">
                        Log in
                    </Link>
                </p>
                <p className="text-sm text-stone-600">
                    Are you a Teacher or Affiliate?{' '}
                    <Link href={route('register.teacher')} className="font-medium text-amber-600 hover:text-amber-800 transition-colors">
                        Register here →
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}