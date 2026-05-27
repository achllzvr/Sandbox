import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Dashboard({ metrics, claimLogs = [] }) {
    return (
        <TeacherLayout>
            <Head title="Dashboard - Teacher Portal" />

            {/* Header Title */}
            <div className="mb-8">
                <span className="bubble-text text-4xl text-[#E2725B] tracking-tight block">
                    DASHBOARD
                </span>
                <p className="text-[#8B6C58] font-bold mt-1 uppercase text-xs tracking-wider">
                    Welcome back! Here is an overview of your voucher distribution.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Metric 1: Total Vouchers */}
                <div className="bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[24px] p-6 shadow-[6px_6px_0px_#5C4033] hover:translate-y-[-2px] transition-all flex flex-col items-center justify-center text-center">
                    <span className="text-[#8B6C58] font-black text-sm uppercase tracking-wider mb-2">
                        Total Vouchers
                    </span>
                    <span className="text-5xl md:text-6xl font-black text-[#5C4033] tracking-tight font-mono">
                        {metrics.total_vouchers}
                    </span>
                </div>

                {/* Metric 2: Vouchers Claimed */}
                <div className="bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[24px] p-6 shadow-[6px_6px_0px_#5C4033] hover:translate-y-[-2px] transition-all flex flex-col items-center justify-center text-center">
                    <span className="text-[#8B6C58] font-black text-sm uppercase tracking-wider mb-2">
                        Vouchers Claimed
                    </span>
                    <span className="text-5xl md:text-6xl font-black text-[#5C4033] tracking-tight font-mono">
                        {metrics.claimed_vouchers}
                    </span>
                </div>

                {/* Metric 3: Vouchers Unclaimed */}
                <div className="bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[24px] p-6 shadow-[6px_6px_0px_#5C4033] hover:translate-y-[-2px] transition-all flex flex-col items-center justify-center text-center">
                    <span className="text-[#8B6C58] font-black text-sm uppercase tracking-wider mb-2">
                        Vouchers Unclaimed
                    </span>
                    <span className="text-5xl md:text-6xl font-black text-[#5C4033] tracking-tight font-mono">
                        {metrics.unclaimed_vouchers}
                    </span>
                </div>
            </div>

            {/* Claim Logs Panel */}
            <div className="bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[28px] p-6 md:p-8 shadow-[8px_8px_0px_#5C4033] mb-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="bubble-text text-3xl text-[#E2725B] tracking-tight">
                        Claim Logs
                    </h3>
                    <Link
                        href={route('teacher.purchasing')}
                        className="bg-[#E2725B] hover:bg-[#D45D43] text-white border-2 border-[#5C4033] font-bold py-2.5 px-6 rounded-xl transition-all shadow-[3px_3px_0px_#5C4033] hover:translate-x-[-1px] hover:translate-y-[-1px] text-xs uppercase tracking-wider"
                    >
                        Buy More Vouchers
                    </Link>
                </div>

                {/* Claim Logs Table */}
                <div className="overflow-x-auto border-2 border-[#5C4033] rounded-2xl bg-[#FDF6E2]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-[#5C4033] bg-[#F5EFCF] text-[#5C4033] font-black text-xs uppercase tracking-wider">
                                <th className="py-4 px-6 border-r-2 border-[#5C4033]">Name</th>
                                <th className="py-4 px-6 border-r-2 border-[#5C4033]">Email</th>
                                <th className="py-4 px-6 border-r-2 border-[#5C4033]">Voucher for</th>
                                <th className="py-4 px-6">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-[#5C4033]/30 text-sm font-semibold text-[#5C4033]">
                            {claimLogs.length > 0 ? (
                                claimLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-[#F5EFCF]/40 transition-colors">
                                        <td className="py-4 px-6 border-r-2 border-[#5C4033] font-bold">{log.name}</td>
                                        <td className="py-4 px-6 border-r-2 border-[#5C4033] font-mono text-xs">{log.email}</td>
                                        <td className="py-4 px-6 border-r-2 border-[#5C4033]">
                                            <span className="inline-block bg-[#8FA7FF] text-[#FFFDF6] border border-[#5C4033] font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-lg shadow-[1.5px_1.5px_0px_#5C4033]">
                                                {log.shell}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-xs text-[#8B6C58]">{log.timestamp}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-12 px-6 text-center text-[#8B6C58] font-bold">
                                        <div className="text-3xl mb-2">🏖️</div>
                                        No vouchers claimed yet! Share your codes with students to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[24px] p-6 shadow-[6px_6px_0px_#5C4033] mb-4">
                <span className="text-[#8B6C58] font-black text-xs uppercase tracking-wider mb-4 block">
                    Quick Access Shortcuts
                </span>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href={route('teacher.vouchers')}
                        className="flex-1 text-center bg-[#FFFDF6] hover:bg-[#F5EFCF] text-[#5C4033] border-2 border-[#5C4033] font-bold py-3 px-4 rounded-xl transition-all shadow-[3px_3px_0px_#5C4033] hover:translate-x-[-1px] hover:translate-y-[-1px] text-sm uppercase tracking-wider"
                    >
                        Track Voucher Codes 🎟️
                    </Link>
                    <Link
                        href={route('teacher.analytics')}
                        className="flex-1 text-center bg-[#FFFDF6] hover:bg-[#F5EFCF] text-[#5C4033] border-2 border-[#5C4033] font-bold py-3 px-4 rounded-xl transition-all shadow-[3px_3px_0px_#5C4033] hover:translate-x-[-1px] hover:translate-y-[-1px] text-sm uppercase tracking-wider"
                    >
                        Monitor Student Analytics 📈
                    </Link>
                </div>
            </div>
        </TeacherLayout>
    );
}
