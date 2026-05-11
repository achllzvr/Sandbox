import { useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function RegisterTeacher() {
    const { data, setData, post, processing, errors } = useForm({
        first_name:                 '',
        last_name:                  '',
        email:                      '',
        password:                   '',
        password_confirmation:      '',
        birthday:                   '',
        contact_no:                 '',
        affiliation:                '',
        institutional_credentials:  null,
    });

    const credentialRef = useRef(null);

    function submit(e) {
        e.preventDefault();
        post(route('register.teacher.store'), {
            forceFormData: true, // REQUIRED for file upload
        });
    }

    return (
        <GuestLayout>
            <Head title="Teacher Registration" />

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-sm text-amber-800">
                After registering, verify your email with the OTP we send you. Your account will then be reviewed by an admin before you can access the platform.
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-600">
                    <p className="font-bold">Please fix the following errors:</p>
                    <ul className="list-disc pl-5 mt-1">
                        {Object.values(errors).map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-stone-900">Become a Teacher</h2>
                <p className="text-sm text-stone-500 mt-1">Join Sandbox to start educating.</p>
            </div>

            <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200" encType="multipart/form-data">
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
                    <InputLabel htmlFor="affiliation" value="School / Institution *" />
                    <TextInput
                        id="affiliation"
                        name="affiliation"
                        value={data.affiliation}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('affiliation', e.target.value)}
                        required
                    />
                    <InputError message={errors.affiliation} className="mt-2" />
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

                <div className="mt-6">
                    <InputLabel value="Institutional Credentials *" />
                    <div 
                        onClick={() => credentialRef.current?.click()}
                        className="mt-2 border-2 border-dashed border-stone-300 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 transition-colors bg-stone-50 hover:bg-amber-50"
                    >
                        {!data.institutional_credentials ? (
                            <>
                                <div className="text-3xl mb-2">📄</div>
                                <p className="text-stone-700 font-medium">Click to upload your institutional ID or credentials</p>
                                <p className="text-xs text-stone-400 mt-1">PDF, JPG, PNG — max 5MB</p>
                            </>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="text-3xl mb-2 text-green-500">✓</div>
                                <p className="text-sm font-bold text-green-600 truncate max-w-xs">{data.institutional_credentials.name}</p>
                                <p className="text-xs text-stone-400 mt-1">Click to change file</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            ref={credentialRef}
                            className="hidden"
                            onChange={e => setData('institutional_credentials', e.target.files[0])}
                        />
                    </div>
                    <InputError message={errors.institutional_credentials} className="mt-2" />
                </div>

                <div className="mt-8">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-colors"
                    >
                        Register as Teacher
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center border-t border-stone-200 pt-6">
                <Link href={route('register')} className="text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors">
                    ← Back to student registration
                </Link>
            </div>
        </GuestLayout>
    );
}
