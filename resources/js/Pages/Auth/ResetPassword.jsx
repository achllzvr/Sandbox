import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-orange-500 selection:text-white">
            <Head title="Set New Password" />

            {/* LEFT PANEL - Branding */}
            <div className="hidden lg:flex w-1/2 bg-[#F9F8F6] flex-col justify-between p-12 relative overflow-hidden border-r border-stone-200">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                        S
                    </div>
                    <span className="font-black text-2xl text-stone-900 tracking-tighter">SANDBOX</span>
                </div>

                <div className="relative z-10 max-w-md">
                    <h1 className="text-5xl font-black text-stone-900 leading-tight tracking-tight mb-6">
                        Secure your account.
                    </h1>
                    <p className="text-lg text-stone-500 leading-relaxed">
                        Create a strong, new password. Make sure it's something memorable so you can get back to your learning journey instantly.
                    </p>
                </div>

                <div className="relative z-10 text-stone-400 font-medium text-sm">
                    © 2026 Sandbox LMS Platform
                </div>
            </div>

            {/* RIGHT PANEL - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-24 bg-white">
                <div className="w-full max-w-md">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                            S
                        </div>
                        <span className="font-black text-2xl text-stone-900 tracking-tighter">SANDBOX</span>
                    </div>

                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-sm">
                        🛡️
                    </div>

                    <h2 className="text-3xl font-black text-stone-900 mb-3 tracking-tight">Set new password</h2>
                    <p className="text-stone-500 mb-8 font-medium leading-relaxed">
                        Your new password must be different from previously used passwords.
                    </p>

                    <form onSubmit={submit} className="space-y-5">
                        
                        {/* Hidden/Disabled Email Field - Usually good UX to show them which account they are resetting */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-1.5">Email Address</label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-stone-100 text-stone-500 cursor-not-allowed"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                readOnly
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-stone-700 mb-1.5">New Password</label>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-stone-50 focus:bg-white focus:border-orange-500 focus:ring-orange-500 transition-colors"
                                autoComplete="new-password"
                                isFocused={true}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password} className="mt-2" />
                            <p className="text-xs text-stone-400 mt-2 font-medium">Must be at least 8 characters.</p>
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-bold text-stone-700 mb-1.5">Confirm Password</label>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-stone-50 focus:bg-white focus:border-orange-500 focus:ring-orange-500 transition-colors"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-4 px-4 rounded-xl shadow-md shadow-orange-500/20 text-base font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all active:scale-[0.98]"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-8 text-center">
                        <Link 
                            href={route('login')} 
                            className="inline-flex items-center text-sm font-bold text-stone-400 hover:text-stone-900 transition-colors"
                        >
                            Cancel and back to log in
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}