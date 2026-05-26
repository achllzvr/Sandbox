import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Teacher/TeacherDashboardController.php @ index
 * Required Props:
 * 1. stats: { total_students: int, active_batches: int, available_vouchers: int }
 * 2. recent_batches: Array of { id, batch_name, shell_title, avg_progress, students_count }
 * ==============================================================================
 */

export default function TeacherDashboard({ auth, stats, recent_batches = [] }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-2xl text-stone-900 tracking-tighter">Teacher Dashboard</h2>}>
            <Head title="Teacher Dashboard" />

            <div className="py-8 bg-[#FDFCFB] min-h-screen selection:bg-blue-500 selection:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-stone-900 mb-2 tracking-tight">
                            Welcome back, {auth.user.first_name}
                        </h1>
                        <p className="text-stone-500 font-medium text-lg">
                            Here is an overview of your institutional cohorts and voucher distributions.
                        </p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0">👥</div>
                            <div>
                                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Total Students</p>
                                <p className="text-3xl font-black text-stone-900">{stats?.total_students || 0}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0">🐚</div>
                            <div>
                                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Active Batches</p>
                                <p className="text-3xl font-black text-stone-900">{stats?.active_batches || 0}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0">🎟️</div>
                            <div>
                                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Unused Vouchers</p>
                                <p className="text-3xl font-black text-stone-900">{stats?.available_vouchers || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="text-xl font-black text-stone-900 mb-4">Quick Actions</h3>
                            <Link href="#" className="w-full flex items-center gap-4 bg-white p-5 rounded-2xl border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all group">
                                <div className="w-12 h-12 bg-stone-100 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-xl flex items-center justify-center text-xl transition-colors">🛒</div>
                                <div className="text-left">
                                    <h4 className="font-bold text-stone-900">Buy Bulk Vouchers</h4>
                                    <p className="text-sm text-stone-500">Purchase new shell codes</p>
                                </div>
                            </Link>
                            <Link href={route('teacher.shells.index')} className="w-full flex items-center gap-4 bg-white p-5 rounded-2xl border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all group">
                                <div className="w-12 h-12 bg-stone-100 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-xl flex items-center justify-center text-xl transition-colors">📊</div>
                                <div className="text-left">
                                    <h4 className="font-bold text-stone-900">View Batch Analytics</h4>
                                    <p className="text-sm text-stone-500">Monitor student progress</p>
                                </div>
                            </Link>
                        </div>

                        {/* Recent Batches */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-black text-stone-900">Recent Batches</h3>
                                <Link href={route('teacher.shells.index')} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">View All &rarr;</Link>
                            </div>
                            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                                {recent_batches.length > 0 ? (
                                    <ul className="divide-y divide-stone-100">
                                        {recent_batches.map(batch => (
                                            <li key={batch.id} className="p-5 hover:bg-stone-50 transition-colors">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-bold text-stone-900 text-lg">{batch.batch_name}</h4>
                                                        <p className="text-sm font-medium text-stone-500">{batch.shell_title} • {batch.students_count} Students</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm font-black text-blue-600">{batch.avg_progress}% Avg Progress</span>
                                                        <Link href={route('teacher.shells.show', batch.id)} className="block mt-1 text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors">
                                                            View Details &rarr;
                                                        </Link>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-10 text-center">
                                        <div className="text-4xl mb-3">📁</div>
                                        <p className="font-bold text-stone-500">No active batches yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}