import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Admin/AdminDashboardController.php @ index
 * Required Props:
 * 1. stats: { total_users: int, active_shells: int, total_revenue: string/float, pending_approvals: int }
 * 2. recent_activity: Array of { id, user_name, action, created_at, icon }
 * 3. pending_teachers: Array of { id, name, institution, applied_at }
 * ==============================================================================
 */

export default function AdminDashboard({ auth, stats, recent_activity = [], pending_teachers = [] }) {
    return (
        <AdminLayout user={auth.user} header={<h2 className="font-black text-2xl text-slate-900 tracking-tighter">System Overview</h2>}>
            <Head title="Admin Dashboard" />

            <div className="py-8 bg-slate-50 min-h-screen selection:bg-slate-800 selection:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                            Platform Command Center
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            Monitor user activity, approve teacher applications, and manage platform health.
                        </p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-black mb-4">👥</div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
                                <p className="text-3xl font-black text-slate-900">{stats?.total_users || '0'}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center text-2xl font-black mb-4">🐚</div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Shells</p>
                                <p className="text-3xl font-black text-slate-900">{stats?.active_shells || '0'}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl font-black mb-4">💳</div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Platform Revenue</p>
                                <p className="text-3xl font-black text-slate-900">₱ {stats?.total_revenue || '0.00'}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                            {/* Alert state if there are pending approvals */}
                            {(stats?.pending_approvals > 0) && <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>}
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl font-black mb-4">📋</div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Approvals</p>
                                <p className="text-3xl font-black text-slate-900">{stats?.pending_approvals || '0'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: Pending Actions */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Pending Teachers Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-black text-slate-900">Pending Teacher Applications</h3>
                                    <Link href={route('admin.teachers.index')} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">View All &rarr;</Link>
                                </div>
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                    {pending_teachers.length > 0 ? (
                                        <ul className="divide-y divide-slate-100">
                                            {pending_teachers.map(teacher => (
                                                <li key={teacher.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
                                                            {teacher.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">{teacher.name}</h4>
                                                            <p className="text-sm font-medium text-slate-500">{teacher.institution}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Link href={route('admin.teachers.index')} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                                                            Review
                                                        </Link>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-10 text-center text-slate-500">
                                            <div className="text-3xl mb-2">✅</div>
                                            <p className="font-bold">All caught up! No pending applications.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: System Activity */}
                        <div className="lg:col-span-1">
                            <h3 className="text-xl font-black text-slate-900 mb-4">System Activity</h3>
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                                {recent_activity.length > 0 ? (
                                    <div className="space-y-6">
                                        {recent_activity.map((activity, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                                    {activity.icon || '🔔'}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-900 font-medium leading-tight">
                                                        <span className="font-bold">{activity.user_name}</span> {activity.action}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-bold mt-1">{activity.created_at}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-center font-medium py-8">No recent activity.</p>
                                )}
                                <Link href={route('admin.audit-logs.index')} className="block w-full text-center mt-6 pt-4 border-t border-slate-100 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
                                    View Full Audit Log
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}