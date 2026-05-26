import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-orange-500 selection:text-white">
            <Head title="Forgot Password" />

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
                        Lost your way?
                    </h1>
                    <p className="text-lg text-stone-500 leading-relaxed">
                        Don't worry, it happens to the best of us. Let's get you back on track so you can continue building your streak.
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

                    <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-sm">
                        🔑
                    </div>

                    <h2 className="text-3xl font-black text-stone-900 mb-3 tracking-tight">Forgot password?</h2>
                    <p className="text-stone-500 mb-8 font-medium leading-relaxed">
                        No worries, we'll send you reset instructions. Please enter the email address associated with your account.
                    </p>

                    {/* SUCCESS STATUS */}
                    {status && (
                        <div className="mb-8 font-bold text-sm text-green-700 bg-green-50 p-4 rounded-xl border border-green-200 flex items-start gap-3 shadow-sm">
                            <span className="text-lg leading-none">✓</span>
                            <span>{status}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-1.5">Email Address</label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full px-4 py-3.5 rounded-xl border-stone-200 bg-stone-50 focus:bg-white focus:border-orange-500 focus:ring-orange-500 transition-colors text-base"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter your email"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-4 px-4 rounded-xl shadow-md shadow-orange-500/20 text-base font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all active:scale-[0.98]"
                        >
                            Reset Password
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link 
                            href={route('login')} 
                            className="inline-flex items-center text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors group"
                        >
                            <span className="mr-2 group-hover:-translate-x-1 transition-transform">&larr;</span>
                            Back to log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}