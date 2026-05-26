import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
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
        <div className="min-h-screen flex bg-[#F9F8F6] font-sans selection:bg-orange-500 selection:text-white">
            <Head title="Register" />

            {/* LEFT PANEL - Branding (Sticky so it stays visible while scrolling form) */}
            <div className="hidden lg:flex w-5/12 bg-orange-500 text-white flex-col justify-between p-12 relative overflow-hidden sticky top-0 h-screen">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 -z-10"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 font-black text-xl shadow-lg">
                        S
                    </div>
                    <span className="font-black text-2xl tracking-tighter">SANDBOX</span>
                </div>

                <div className="relative z-10">
                    <h1 className="text-5xl font-black leading-[1.15] mb-6 tracking-tight">
                        Start your <br />certification <br />journey today.
                    </h1>
                    <ul className="space-y-4 font-medium text-orange-100 text-lg">
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span>
                            Learn at your own pace
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span>
                            Earn gamified rewards
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span>
                            Get industry recognized
                        </li>
                    </ul>
                </div>

                <div className="relative z-10 text-orange-200 font-medium text-sm">
                    Already a member? <Link href={route('login')} className="text-white font-bold hover:underline">Sign in instead</Link>
                </div>
            </div>

            {/* RIGHT PANEL - Form (Scrollable) */}
            <div className="w-full lg:w-7/12 flex flex-col py-12 px-6 sm:px-12 md:px-20 lg:px-32 bg-white">
                
                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center mb-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-black">S</div>
                        <span className="font-black text-xl text-stone-900 tracking-tighter">SANDBOX</span>
                    </div>
                    <Link href={route('login')} className="text-sm font-bold text-orange-500">Log in</Link>
                </div>

                <div className="mb-10">
                    <h2 className="text-3xl font-black text-stone-900 tracking-tight">Create an account</h2>
                    <p className="text-stone-500 font-medium mt-2">Fill in your details to join the Sandbox community.</p>
                </div>

                <form onSubmit={submit} className="space-y-8 pb-12">
                    
                    {/* SECTION 1: Personal Info */}
                    <div className="bg-[#FDFCFB] border border-stone-200 rounded-2xl p-6">
                        <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-4">1. Personal Details</h3>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">First Name *</label>
                                <TextInput
                                    name="first_name"
                                    value={data.first_name}
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-orange-500 focus:ring-orange-500"
                                    isFocused={true}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.first_name} className="mt-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Last Name *</label>
                                <TextInput
                                    name="last_name"
                                    value={data.last_name}
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-orange-500 focus:ring-orange-500"
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.last_name} className="mt-2" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Email Address *</label>
                                <TextInput
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-orange-500 focus:ring-orange-500"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Security */}
                    <div className="bg-[#FDFCFB] border border-stone-200 rounded-2xl p-6">
                        <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-4">2. Account Security</h3>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Password *</label>
                                <TextInput
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-orange-500 focus:ring-orange-500"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Confirm Password *</label>
                                <TextInput
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-orange-500 focus:ring-orange-500"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Optional Profile Info */}
                    <div className="bg-[#FDFCFB] border border-stone-200 rounded-2xl p-6">
                        <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-4 text-stone-400">3. Profile Context (Optional)</h3>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">School / Organization</label>
                                <TextInput
                                    name="affiliation"
                                    value={data.affiliation}
                                    placeholder="e.g. National University"
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-orange-500 focus:ring-orange-500"
                                    onChange={(e) => setData('affiliation', e.target.value)}
                                />
                                <InputError message={errors.affiliation} className="mt-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Birthday</label>
                                <TextInput
                                    type="date"
                                    name="birthday"
                                    value={data.birthday}
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-orange-500 focus:ring-orange-500 text-stone-600"
                                    onChange={(e) => setData('birthday', e.target.value)}
                                />
                                <InputError message={errors.birthday} className="mt-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Contact Number</label>
                                <TextInput
                                    name="contact_no"
                                    value={data.contact_no}
                                    placeholder="+63 9..."
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-orange-500 focus:ring-orange-500"
                                    onChange={(e) => setData('contact_no', e.target.value)}
                                />
                                <InputError message={errors.contact_no} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg shadow-orange-500/25 text-base font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all active:scale-[0.98]"
                        >
                            Create Student Account
                        </button>
                    </div>

                    <div className="text-center pt-4 border-t border-stone-200">
                        <p className="text-sm font-medium text-stone-500">
                            Are you an Educator?{' '}
                            <Link href={route('register.teacher')} className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                Apply for a Teacher Account &rarr;
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}