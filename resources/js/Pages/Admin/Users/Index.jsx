import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function UsersIndex({ users, filters }) {
    const [showCreate, setShowCreate] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');

    const createForm = useForm({
        first_name: '', last_name: '', email: '', password: '', role: 'staff',
    });

    function handleFilter(e) {
        e?.preventDefault();
        router.get(route('admin.users.index'), { search, role: roleFilter }, { preserveState: true });
    }

    function handleCreate(e) {
        e.preventDefault();
        createForm.post(route('admin.users.store'), {
            onSuccess: () => { setShowCreate(false); createForm.reset(); },
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
                <button onClick={() => setShowCreate(true)} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                    + Create User
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

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-stone-900 mb-4">Create New User</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">First Name</label>
                                    <input type="text" value={createForm.data.first_name} onChange={e => createForm.setData('first_name', e.target.value)}
                                        className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500" required />
                                    {createForm.errors.first_name && <p className="text-red-500 text-xs mt-1">{createForm.errors.first_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Last Name</label>
                                    <input type="text" value={createForm.data.last_name} onChange={e => createForm.setData('last_name', e.target.value)}
                                        className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500" required />
                                    {createForm.errors.last_name && <p className="text-red-500 text-xs mt-1">{createForm.errors.last_name}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                                <input type="email" value={createForm.data.email} onChange={e => createForm.setData('email', e.target.value)}
                                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500" required />
                                {createForm.errors.email && <p className="text-red-500 text-xs mt-1">{createForm.errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                                <input type="password" value={createForm.data.password} onChange={e => createForm.setData('password', e.target.value)}
                                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500" required />
                                {createForm.errors.password && <p className="text-red-500 text-xs mt-1">{createForm.errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Role</label>
                                <select value={createForm.data.role} onChange={e => createForm.setData('role', e.target.value)}
                                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500">
                                    <option value="staff">Content Creator (Staff)</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800 transition-colors">Cancel</button>
                                <button type="submit" disabled={createForm.processing}
                                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
