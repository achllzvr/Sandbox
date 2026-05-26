import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-orange-500 selection:text-white">
            <Head title="Log in" />

            {/* LEFT PANEL - Branding */}
            <div className="hidden lg:flex w-1/2 bg-[#F9F8F6] flex-col justify-between p-12 relative overflow-hidden border-r border-stone-200">
                {/* Decorative background shapes */}
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
                        Welcome back to your shoreline.
                    </h1>
                    <p className="text-lg text-stone-500 leading-relaxed">
                        Pick up right where you left off. Complete Sandboxes, build your streak, and earn your next certification.
                    </p>
                </div>

                <div className="relative z-10 text-stone-400 font-medium text-sm">
                    © 2026 Sandbox LMS Platform
                </div>
            </div>

            {/* RIGHT PANEL - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-24">
                <div className="w-full max-w-md">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                            S
                        </div>
                        <span className="font-black text-2xl text-stone-900 tracking-tighter">SANDBOX</span>
                    </div>

                    <h2 className="text-3xl font-black text-stone-900 mb-2 tracking-tight">Log in to Sandbox</h2>
                    <p className="text-stone-500 mb-8 font-medium">Welcome back! Please enter your details.</p>

                    {status && <div className="mb-6 font-bold text-sm text-green-600 bg-green-50 p-4 rounded-xl border border-green-200">{status}</div>}

                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-600">
                            <p className="font-bold mb-1">Login Failed:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                {Object.values(errors).map((error, idx) => (
                                    <li key={idx}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-1.5">Email</label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-stone-50 focus:bg-white focus:border-orange-500 focus:ring-orange-500 transition-colors"
                                autoComplete="username"
                                isFocused={true}
                                onChange={handleOnChange}
                                placeholder="Enter your email"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-stone-700 mb-1.5">Password</label>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-stone-50 focus:bg-white focus:border-orange-500 focus:ring-orange-500 transition-colors"
                                autoComplete="current-password"
                                onChange={handleOnChange}
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between pt-2 pb-4">
                            <label className="flex items-center cursor-pointer group">
                                <Checkbox 
                                    name="remember" 
                                    value={data.remember} 
                                    onChange={handleOnChange}
                                    className="rounded border-stone-300 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="ml-2 text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">Remember for 30 days</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all active:scale-[0.98]"
                        >
                            Log In
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-stone-500 font-medium">
                        Don't have an account?{' '}
                        <Link href={route('register')} className="font-bold text-orange-500 hover:text-orange-600 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}