import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Admin/UserManagementController.php @ create / store
 * (Also aligns with app/Http/Requests/Admin/InviteUserRequest.php)
 * Expected Payload on Submit:
 * {
 * first_name: string,
 * last_name: string,
 * email: string,
 * role: 'creator' | 'admin' | 'teacher'
 * }
 * Action: Generate invitation token, send UserInvitationMail, redirect back to index.
 * ==============================================================================
 */

export default function CreateUser({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        role: 'creator', // Defaulting to Creator based on the flow
    });

    const submit = (e) => {
        e.preventDefault();
        // Posts to the backend to create the user and dispatch the invite email
        post(route('admin.users.store')); 
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-black text-2xl text-slate-900 tracking-tighter">Invite New User</h2>}>
            <Head title="Create User" />

            <div className="py-8 bg-slate-50 min-h-screen selection:bg-slate-800 selection:text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Breadcrumbs */}
                    <div className="mb-8">
                        <Link href={route('admin.users.index')} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
                            &larr; Back to User Management
                        </Link>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                        
                        {/* Header Section */}
                        <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden">
                            <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="relative z-10">
                                <h1 className="text-3xl font-black mb-2 tracking-tight">Add Platform Staff</h1>
                                <p className="text-slate-400 font-medium text-lg max-w-xl">
                                    Create a new Creator or Admin account. An invitation link will be sent to their email to set up their password.
                                </p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={submit} className="p-8 md:p-10 space-y-10">
                            
                            {/* STEP 1: Select Role */}
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">1. Select Account Role</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    
                                    {/* Creator Role Card */}
                                    <button 
                                        type="button"
                                        onClick={() => setData('role', 'creator')}
                                        className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                                            data.role === 'creator' 
                                            ? 'border-orange-500 bg-orange-50/50 shadow-sm' 
                                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors ${data.role === 'creator' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' : 'bg-slate-100 text-slate-400'}`}>
                                            ✏️
                                        </div>
                                        <div>
                                            <h4 className={`font-black text-lg ${data.role === 'creator' ? 'text-orange-900' : 'text-slate-900'}`}>Content Creator</h4>
                                            <p className="text-sm font-medium text-slate-500 mt-1">Can build Shells, upload modules, and access the Creator Studio dashboard.</p>
                                        </div>
                                    </button>

                                    {/* Admin Role Card (Already in your Create.jsx file) */}
                                    <button 
                                        type="button"
                                        onClick={() => setData('role', 'admin')}
                                        className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                                            data.role === 'admin' 
                                            ? 'border-slate-900 bg-slate-50 shadow-sm' 
                                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors ${data.role === 'admin' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                                            🛡️
                                        </div>
                                        <div>
                                            <h4 className={`font-black text-lg ${data.role === 'admin' ? 'text-slate-900' : 'text-slate-900'}`}>System Admin</h4>
                                            <p className="text-sm font-medium text-slate-500 mt-1">Full platform access. Can manage users, approve certifications, and view ledgers.</p>
                                        </div>
                                    </button>

                                </div>
                                <InputError message={errors.role} className="mt-2" />
                            </div>

                            <hr className="border-slate-100" />

                            {/* STEP 2: Personal Details */}
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">2. Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">First Name *</label>
                                        <TextInput
                                            name="first_name"
                                            value={data.first_name}
                                            className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 focus:ring-slate-800 transition-colors"
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.first_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Last Name *</label>
                                        <TextInput
                                            name="last_name"
                                            value={data.last_name}
                                            className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 focus:ring-slate-800 transition-colors"
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.last_name} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address *</label>
                                        <TextInput
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            placeholder="creator@sandbox.edu"
                                            className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 focus:ring-slate-800 transition-colors"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                        <p className="text-xs font-bold text-slate-400 mt-2">
                                            We will send a secure invitation link to this email to set up their password.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                                <Link 
                                    href={route('admin.users.index')}
                                    className="font-bold text-slate-500 hover:text-slate-900 transition-colors px-4 py-2"
                                >
                                    Cancel
                                </Link>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-black px-8 py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
                                >
                                    {processing ? 'Sending Invite...' : 'Send Invitation ✉️'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}