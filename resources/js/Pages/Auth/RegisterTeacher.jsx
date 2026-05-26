import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function RegisterTeacher() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        institution_name: '',
        position: '',
        proof_of_affiliation: null,
    });

    const [fileName, setFileName] = useState('');

    function submit(e) {
        e.preventDefault();
        // Inertia automatically converts to FormData when a File object is present in the data payload
        post(route('register.teacher'));
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('proof_of_affiliation', file);
            setFileName(file.name);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#F9F8F6] font-sans selection:bg-blue-500 selection:text-white">
            <Head title="Teacher Application" />

            {/* LEFT PANEL - Branding (Institutional Blue) */}
            <div className="hidden lg:flex w-5/12 bg-blue-700 text-white flex-col justify-between p-12 relative overflow-hidden sticky top-0 h-screen">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-900 -z-10"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-700 font-black text-xl shadow-lg">
                        S
                    </div>
                    <span className="font-black text-2xl tracking-tighter">SANDBOX</span>
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/30 text-blue-100 text-xs font-bold mb-6 border border-blue-400/30">
                        B2B Institutional Portal
                    </div>
                    <h1 className="text-5xl font-black leading-[1.15] mb-6 tracking-tight">
                        Empower your <br />students with <br />Certifications.
                    </h1>
                    <ul className="space-y-4 font-medium text-blue-100 text-lg">
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span>
                            Purchase bulk vouchers
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span>
                            Track cohort analytics
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span>
                            Monitor student bottlenecks
                        </li>
                    </ul>
                </div>

                <div className="relative z-10 text-blue-200 font-medium text-sm">
                    Already an Affiliate? <Link href={route('login')} className="text-white font-bold hover:underline">Sign in instead</Link>
                </div>
            </div>

            {/* RIGHT PANEL - Form (Scrollable) */}
            <div className="w-full lg:w-7/12 flex flex-col py-12 px-6 sm:px-12 md:px-20 lg:px-32 bg-white">
                
                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center mb-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center text-white font-black">S</div>
                        <span className="font-black text-xl text-stone-900 tracking-tighter">SANDBOX</span>
                    </div>
                    <Link href={route('login')} className="text-sm font-bold text-blue-600">Log in</Link>
                </div>

                <div className="mb-10">
                    <h2 className="text-3xl font-black text-stone-900 tracking-tight">Apply as an Educator</h2>
                    <p className="text-stone-500 font-medium mt-2">Submit your details and proof of affiliation for admin review.</p>
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
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-blue-500 focus:ring-blue-500"
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
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.last_name} className="mt-2" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Work Email Address *</label>
                                <TextInput
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-blue-500 focus:ring-blue-500"
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
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-blue-500 focus:ring-blue-500"
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
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Institutional Proof */}
                    <div className="bg-[#FDFCFB] border border-blue-100 rounded-2xl p-6 shadow-sm shadow-blue-900/5 ring-1 ring-blue-600/10">
                        <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-4">3. Institutional Proof</h3>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Institution Name *</label>
                                <TextInput
                                    name="institution_name"
                                    value={data.institution_name}
                                    placeholder="e.g. National University"
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(e) => setData('institution_name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.institution_name} className="mt-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Job Title / Position *</label>
                                <TextInput
                                    name="position"
                                    value={data.position}
                                    placeholder="e.g. IT Department Head"
                                    className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(e) => setData('position', e.target.value)}
                                    required
                                />
                                <InputError message={errors.position} className="mt-2" />
                            </div>
                            
                            {/* File Upload Zone */}
                            <div className="md:col-span-2 mt-2">
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Proof of Affiliation (ID / Certificate) *</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-stone-300 border-dashed rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors relative group">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-stone-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-stone-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-bold text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-1">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-stone-500">PNG, JPG, PDF up to 5MB</p>
                                    </div>
                                </div>
                                {fileName && (
                                    <div className="mt-3 text-sm font-medium text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between">
                                        <span className="truncate pr-4">📄 {fileName}</span>
                                        <button type="button" onClick={() => { setData('proof_of_affiliation', null); setFileName(''); document.getElementById('file-upload').value = ''; }} className="text-blue-400 hover:text-red-500 font-bold">Remove</button>
                                    </div>
                                )}
                                <InputError message={errors.proof_of_affiliation} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg shadow-blue-500/25 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all active:scale-[0.98]"
                        >
                            Submit Application for Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}