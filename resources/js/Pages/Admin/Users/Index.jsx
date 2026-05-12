import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function UsersIndex({ users, filters }) {
    const [showInvite, setShowInvite] = useState(false);
    const [reviewUser, setReviewUser] = useState(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');

    const inviteForm = useForm({
        email: '', role: 'staff',
    });

    const verifyForm = useForm({
        action: '',
    });

    function handleFilter(e) {
        e?.preventDefault();
        router.get(route('admin.users.index'), { search, role: roleFilter }, { preserveState: true });
    }

    function handleInvite(e) {
        e.preventDefault();
        inviteForm.post(route('admin.users.invite'), {
            onSuccess: () => { setShowInvite(false); inviteForm.reset(); },
        });
    }

    function handleVerify(action) {
        verifyForm.transform((data) => ({ ...data, action }))
            .put(route('admin.users.verify-teacher', reviewUser.id), {
                onSuccess: () => setReviewUser(null),
            });
    }

    function statusBadge(status) {
        const map = {
            active: 'bg-green-100 text-green-700',
            inactive: 'bg-red-100 text-red-700',
            pending_verification: 'bg-amber-100 text-amber-700',
            declined: 'bg-red-100 text-red-700',
        };
        return map[status] || 'bg-stone-100 text-stone-600';
    }

    function roleBadge(role) {
        const map = {
            admin: 'bg-red-100 text-red-700',
            staff: 'bg-purple-100 text-purple-700',
            teacher: 'bg-teal-100 text-teal-700',
            user: 'bg-blue-100 text-blue-700',
        };
        return map[role] || 'bg-stone-100 text-stone-600';
    }

    return (
        <AdminLayout pageTitle="User Management">
            <Head title="User Management" />

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                <form onSubmit={handleFilter} className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border border-stone-300 rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:border-amber-500"
                    />
                    <select
                        value={roleFilter}
                        onChange={e => { setRoleFilter(e.target.value); }}
                        className="border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                    >
                        <option value="">All Roles</option>
                        <option value="user">Student</option>
                        <option value="staff">Staff</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="bg-stone-200 hover:bg-stone-300 text-stone-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                        Filter
                    </button>
                </form>
                <button onClick={() => setShowInvite(true)} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                    + Invite User
                </button>
            </div>

            {/* Table */}
            <div className="mt-6 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-stone-100 bg-stone-50">
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Name</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Email</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Role</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Status</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Joined</th>
                            <th className="text-right px-6 py-3 font-semibold text-stone-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {users.data.map(u => (
                            <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                                <td className="px-6 py-3 font-medium text-stone-900">{u.first_name} {u.last_name}</td>
                                <td className="px-6 py-3 text-stone-500">{u.email}</td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${roleBadge(u.role)}`}>{u.role}</span>
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusBadge(u.status)}`}>{u.status}</span>
                                </td>
                                <td className="px-6 py-3 text-stone-400">{new Date(u.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-3 text-right">
                                    {u.role === 'teacher' && u.status === 'pending_verification' && (
                                        <button 
                                            onClick={() => setReviewUser(u)}
                                            className="text-amber-600 hover:text-amber-800 font-bold text-sm"
                                        >
                                            Review
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.data.length === 0 && (
                    <p className="text-center py-12 text-stone-400 text-sm">No users found.</p>
                )}
            </div>

            {/* Pagination */}
            {users.last_page > 1 && (
                <nav className="mt-6 flex justify-center gap-2">
                    {users.links.map((link, i) => (
                        <Link key={i} href={link.url || '#'} preserveScroll
                            className={`px-4 py-2 text-sm rounded-lg transition-colors ${link.active ? 'bg-amber-500 text-white font-bold' : link.url ? 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50' : 'text-stone-300 cursor-not-allowed'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </nav>
            )}

            {/* Invite Modal */}
            {showInvite && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-stone-900 mb-4">Invite New User</h3>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                                <input type="email" value={inviteForm.data.email} onChange={e => inviteForm.setData('email', e.target.value)}
                                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500" required />
                                {inviteForm.errors.email && <p className="text-red-500 text-xs mt-1">{inviteForm.errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Role</label>
                                <select value={inviteForm.data.role} onChange={e => inviteForm.setData('role', e.target.value)}
                                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500">
                                    <option value="staff">Content Creator (Staff)</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowInvite(false)} className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800 transition-colors">Cancel</button>
                                <button type="submit" disabled={inviteForm.processing}
                                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Review Credential Modal */}
            {reviewUser && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setReviewUser(null)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50 shrink-0">
                            <div>
                                <h3 className="font-bold text-stone-900">Review Teacher Registration</h3>
                                <p className="text-xs text-stone-500 mt-0.5">{reviewUser.first_name} {reviewUser.last_name} • {reviewUser.email}</p>
                            </div>
                            <button onClick={() => setReviewUser(null)} className="text-stone-400 hover:text-stone-600">
                                ✕
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 bg-stone-100 flex justify-center items-center">
                            {reviewUser.institutional_credentials_url ? (
                                reviewUser.institutional_credentials_url.endsWith('.pdf') ? (
                                    <iframe 
                                        src={`/storage/${reviewUser.institutional_credentials_url}`} 
                                        className="w-full h-[60vh] rounded shadow-sm bg-white"
                                        title="Credential Document"
                                    />
                                ) : (
                                    <img 
                                        src={`/storage/${reviewUser.institutional_credentials_url}`} 
                                        alt="Credential Document" 
                                        className="max-w-full max-h-[60vh] object-contain rounded shadow-sm"
                                    />
                                )
                            ) : (
                                <div className="text-center text-stone-400 py-12">
                                    <p>No credential file attached.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-stone-100 flex justify-end gap-3 bg-white shrink-0">
                            <button 
                                onClick={() => handleVerify('decline')}
                                disabled={verifyForm.processing}
                                className="px-5 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors text-sm"
                            >
                                Decline
                            </button>
                            <button 
                                onClick={() => handleVerify('approve')}
                                disabled={verifyForm.processing}
                                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl font-bold transition-colors shadow-sm shadow-green-500/20 text-sm"
                            >
                                Approve & Activate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
