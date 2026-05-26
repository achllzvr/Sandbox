import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal'; // Using your existing Inertia Modal component

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Admin/UserManagementController.php @ index
 * Required Props:
 * 1. users: Array (or paginated object) of { id, name, email, role, status, joined_at }
 * * Endpoints for Actions:
 * route('admin.users.suspend', id)
 * route('admin.users.archive', id)
 * ==============================================================================
 */

export default function UserManagement({ auth, users = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    
    // Modal States
    const [suspendModalOpen, setSuspendModalOpen] = useState(false);
    const [archiveModalOpen, setArchiveModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Filter Logic
    const filteredUsers = (users.data || users).filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Action Handlers
    const confirmSuspend = (user) => {
        setSelectedUser(user);
        setSuspendModalOpen(true);
    };

    const confirmArchive = (user) => {
        setSelectedUser(user);
        setArchiveModalOpen(true);
    };

    const executeSuspend = () => {
        setIsProcessing(true);
        router.post(route('admin.users.suspend', selectedUser.id), {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsProcessing(false);
                setSuspendModalOpen(false);
                setSelectedUser(null);
            }
        });
    };

    const executeArchive = () => {
        setIsProcessing(true);
        router.post(route('admin.users.archive', selectedUser.id), {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsProcessing(false);
                setArchiveModalOpen(false);
                setSelectedUser(null);
            }
        });
    };

    const getStatusBadge = (status) => {
        switch(status?.toLowerCase()) {
            case 'active': return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case 'suspended': return "bg-red-100 text-red-700 border-red-200";
            case 'archived': return "bg-slate-100 text-slate-500 border-slate-200";
            case 'pending': return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    const getRoleBadge = (role) => {
        switch(role?.toLowerCase()) {
            case 'admin': return "bg-purple-100 text-purple-700";
            case 'creator': return "bg-orange-100 text-orange-700";
            case 'teacher': return "bg-blue-100 text-blue-700";
            default: return "bg-stone-100 text-stone-600";
        }
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-black text-2xl text-slate-900 tracking-tighter">User Management</h2>}>
            <Head title="User Management" />

            <div className="py-8 bg-slate-50 min-h-screen selection:bg-slate-800 selection:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                        <div>
                            <p className="text-slate-500 text-lg font-medium">
                                Manage access, roles, and status for all Sandbox accounts.
                            </p>
                        </div>
                        <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-colors shrink-0">
                            + Invite User
                        </button>
                    </div>

                    {/* Data Table Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                        
                        {/* Controls */}
                        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="w-full md:w-96 relative">
                                <span className="absolute left-4 top-3 text-slate-400">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder="Search users by name or email..." 
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border-slate-200 focus:border-slate-800 focus:ring-slate-800 text-sm font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-auto flex gap-3">
                                <select 
                                    className="rounded-xl border-slate-200 focus:border-slate-800 focus:ring-slate-800 text-sm font-bold text-slate-600 w-full md:w-auto"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Creator">Creator</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-white border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <th className="p-6">User Profile</th>
                                        <th className="p-6">Role</th>
                                        <th className="p-6">Status</th>
                                        <th className="p-6">Joined Date</th>
                                        <th className="p-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg shrink-0">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{u.name}</p>
                                                        <p className="text-xs font-medium text-slate-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${getRoleBadge(u.role)}`}>
                                                    {u.role || 'Student'}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(u.status)}`}>
                                                    {u.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="p-6 text-sm font-medium text-slate-600">
                                                {u.joined_at || 'Oct 24, 2026'}
                                            </td>
                                            <td className="p-6 text-right space-x-2">
                                                {/* Edit Button */}
                                                <button className="text-slate-400 hover:text-blue-600 font-medium p-2 transition-colors">
                                                    ✎ Edit
                                                </button>
                                                
                                                {/* Suspend Button (Hide if already suspended) */}
                                                {u.status?.toLowerCase() !== 'suspended' && (
                                                    <button onClick={() => confirmSuspend(u)} className="text-slate-400 hover:text-amber-600 font-medium p-2 transition-colors">
                                                        ⏸ Suspend
                                                    </button>
                                                )}

                                                {/* Archive/Delete Button */}
                                                <button onClick={() => confirmArchive(u)} className="text-slate-400 hover:text-red-600 font-medium p-2 transition-colors">
                                                    🗑 Archive
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="p-12 text-center text-slate-500 font-medium">
                                                No users match your search or filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL: SUSPEND ACCOUNT */}
            <Modal show={suspendModalOpen} onClose={() => !isProcessing && setSuspendModalOpen(false)} maxWidth="sm">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">⏸</div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Suspend Account?</h2>
                    <p className="text-slate-500 font-medium mb-8 text-sm">
                        Are you sure you want to suspend <strong className="text-slate-900">{selectedUser?.name}</strong>? They will temporarily lose access to Sandbox until the suspension is lifted.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setSuspendModalOpen(false)} 
                            disabled={isProcessing}
                            className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={executeSuspend}
                            disabled={isProcessing}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? 'Processing...' : 'Yes, Suspend'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* MODAL: ARCHIVE ACCOUNT */}
            <Modal show={archiveModalOpen} onClose={() => !isProcessing && setArchiveModalOpen(false)} maxWidth="sm">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">🗑</div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Archive Account?</h2>
                    <p className="text-slate-500 font-medium mb-8 text-sm">
                        Are you sure you want to permanently archive <strong className="text-slate-900">{selectedUser?.name}</strong>? This action will disable their account and preserve their data for audit purposes.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setArchiveModalOpen(false)} 
                            disabled={isProcessing}
                            className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={executeArchive}
                            disabled={isProcessing}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? 'Archiving...' : 'Yes, Archive'}
                        </button>
                    </div>
                </div>
            </Modal>

        </AdminLayout>
    );
}