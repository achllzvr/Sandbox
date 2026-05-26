import { Head, Link } from '@inertiajs/react';
import CreatorLayout from '@/Layouts/CreatorLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Creator/CreatorDashboardController.php @ index
 * Required Props:
 * 1. stats: { total_earnings: float, total_enrollments: int, active_shells: int, avg_rating: float }
 * 2. recent_sales: Array of { id, shell_title, student_name, amount, created_at }
 * ==============================================================================
 */

export default function CreatorDashboard({ auth, stats, recent_sales = [] }) {
    return (
        <CreatorLayout user={auth.user} header={<h2 className="font-black text-2xl text-stone-900 tracking-tighter">Creator Studio</h2>}>
            <Head title="Creator Dashboard" />

            <div className="py-8 bg-[#F9F8F6] min-h-screen selection:bg-orange-500 selection:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-stone-900 mb-2 tracking-tight">
                                Welcome to your Studio, {auth.user.first_name}
                            </h1>
                            <p className="text-stone-500 font-medium text-lg">
                                Track your revenue, manage your curriculum, and build your next Shell.
                            </p>
                        </div>
                        <Link href={route('creator.certifications.create')} className="bg-orange-500 hover:bg-orange-600 text-white font-black py-3 px-6 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 shrink-0">
                            + Build New Shell
                        </Link>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white rounded-[2rem] p-6 border border-stone-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">💰</div>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Total Earnings</p>
                            <p className="text-3xl font-black text-stone-900">₱ {stats?.total_earnings?.toLocaleString() || '0.00'}</p>
                            <div className="mt-4 flex items-center text-sm font-bold text-green-500">
                                <span>↑ 12% this month</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-6 border border-stone-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">👥</div>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Total Enrollments</p>
                            <p className="text-3xl font-black text-stone-900">{stats?.total_enrollments || '0'}</p>
                            <div className="mt-4 flex items-center text-sm font-bold text-stone-400">
                                <span>Across all shells</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-6 border border-stone-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">📚</div>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Published Shells</p>
                            <p className="text-3xl font-black text-stone-900">{stats?.active_shells || '0'}</p>
                            <Link href={route('creator.certifications.index')} className="mt-4 inline-block text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
                                View Curriculum &rarr;
                            </Link>
                        </div>
                        <div className="bg-white rounded-[2rem] p-6 border border-stone-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">⭐</div>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Average Rating</p>
                            <p className="text-3xl font-black text-stone-900">{stats?.avg_rating || '0.0'}</p>
                            <div className="mt-4 flex items-center text-sm font-bold text-orange-400">
                                <span>Based on student reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Recent Sales Ledger */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-black text-stone-900">Recent Enrollments</h3>
                                <Link href="#" className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">View Ledger &rarr;</Link>
                            </div>
                            <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
                                {recent_sales.length > 0 ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-stone-50/50 border-b border-stone-200 text-xs font-black text-stone-400 uppercase tracking-widest">
                                                <th className="p-5">Student</th>
                                                <th className="p-5">Shell</th>
                                                <th className="p-5 text-right">Revenue (70%)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {recent_sales.map((sale, idx) => (
                                                <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                                                    <td className="p-5">
                                                        <p className="font-bold text-stone-900">{sale.student_name}</p>
                                                        <p className="text-xs font-medium text-stone-500">{sale.created_at}</p>
                                                    </td>
                                                    <td className="p-5 font-bold text-stone-700">{sale.shell_title}</td>
                                                    <td className="p-5 text-right font-black text-green-600">₱ {sale.amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-12 text-center">
                                        <div className="text-4xl mb-3">🧾</div>
                                        <p className="font-bold text-stone-500">No recent sales data.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Action Panel */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="text-xl font-black text-stone-900 mb-4">Studio Tools</h3>
                            <Link href={route('creator.certifications.index')} className="w-full flex items-center gap-4 bg-white p-5 rounded-2xl border border-stone-200 hover:border-orange-500 hover:shadow-md transition-all group">
                                <div className="w-12 h-12 bg-stone-100 group-hover:bg-orange-100 group-hover:text-orange-600 rounded-xl flex items-center justify-center text-xl transition-colors">📐</div>
                                <div className="text-left">
                                    <h4 className="font-bold text-stone-900">Shell Builder</h4>
                                    <p className="text-sm text-stone-500">Draft or edit your courses</p>
                                </div>
                            </Link>
                            <Link href="#" className="w-full flex items-center gap-4 bg-white p-5 rounded-2xl border border-stone-200 hover:border-orange-500 hover:shadow-md transition-all group">
                                <div className="w-12 h-12 bg-stone-100 group-hover:bg-orange-100 group-hover:text-orange-600 rounded-xl flex items-center justify-center text-xl transition-colors">🏦</div>
                                <div className="text-left">
                                    <h4 className="font-bold text-stone-900">Payouts & Wallet</h4>
                                    <p className="text-sm text-stone-500">Withdraw your earnings</p>
                                </div>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </CreatorLayout>
    );
}