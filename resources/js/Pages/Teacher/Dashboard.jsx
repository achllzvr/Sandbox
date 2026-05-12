import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Dashboard({ metrics }) {
    return (
        <TeacherLayout>
            <Head title="Overview - Teacher Dashboard" />

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-900">Dashboard Overview</h2>
                        <p className="text-stone-500 mt-1">A quick glance at your cohorts and voucher distribution.</p>
                    </div>
                    <Link href={route('teacher.purchasing')} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors shadow-amber-500/20">
                        Purchase Vouchers
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Metric 1 */}
                    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                                🎟️
                            </div>
                            <span className="font-semibold text-stone-500 text-sm">Total Vouchers</span>
                        </div>
                        <p className="text-3xl font-bold text-stone-900">{metrics.total_vouchers}</p>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
                                ✅
                            </div>
                            <span className="font-semibold text-stone-500 text-sm">Claimed</span>
                        </div>
                        <p className="text-3xl font-bold text-stone-900">{metrics.claimed_vouchers}</p>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                                👥
                            </div>
                            <span className="font-semibold text-stone-500 text-sm">Active Cohorts</span>
                        </div>
                        <p className="text-3xl font-bold text-stone-900">{metrics.active_cohorts}</p>
                    </div>

                    {/* Metric 4 */}
                    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
                                🎯
                            </div>
                            <span className="font-semibold text-stone-500 text-sm">Avg. Score</span>
                        </div>
                        <p className="text-3xl font-bold text-stone-900">{metrics.avg_cohort_score}%</p>
                    </div>
                </div>

                <div className="mt-8 border-t border-stone-100 pt-8">
                    <h3 className="text-lg font-bold text-stone-900 mb-4">Quick Actions</h3>
                    <div className="flex gap-4">
                        <Link href={route('teacher.vouchers')} className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-lg font-medium transition-colors border border-stone-200">
                            <span>Track Unclaimed Vouchers</span>
                            <span>→</span>
                        </Link>
                        <Link href={route('teacher.analytics')} className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-lg font-medium transition-colors border border-stone-200">
                            <span>View Cohort Progress</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
