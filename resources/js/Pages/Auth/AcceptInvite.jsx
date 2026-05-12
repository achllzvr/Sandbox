import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function AcceptInvite({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        first_name: '',
        last_name: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('accept.invite.store'));
    };

    return (
        <GuestLayout>
            <Head title="Accept Invitation" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-stone-900">Welcome to Sandbox LMS</h2>
                <p className="text-sm text-stone-500 mt-2">
                    You have been invited with the email: <span className="font-semibold text-stone-700">{email}</span>
                </p>
                <p className="text-sm text-stone-500 mt-1">Please complete your registration below.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">First Name</label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                            required
                        />
                        {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                            required
                        />
                        {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                        required
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                        required
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm shadow-amber-500/20 disabled:opacity-50"
                    >
                        Accept Invitation & Register
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
