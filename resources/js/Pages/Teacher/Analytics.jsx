import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Analytics({ cohortData = [] }) {
    return (
        <TeacherLayout>
            <Head title="Analytics - Teacher Portal" />

            {/* Header Title */}
            <div className="mb-8">
                <span className="bubble-text text-4xl text-[#E2725B] tracking-tight block">
                    COHORT ANALYTICS
                </span>
                <p className="text-[#8B6C58] font-bold mt-1 uppercase text-xs tracking-wider">
                    Granular insights into student progress, quiz scores, and Sandcastle exam results.
                </p>
            </div>

            {/* Row 1: Interactive chart placeholder & stats widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Progress Chart Placeholder */}
                <div className="col-span-2 bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[28px] p-6 flex flex-col justify-center items-center text-center min-h-[300px] shadow-[6px_6px_0px_#5C4033]">
                    <div className="w-16 h-16 bg-[#F5EFCF] text-[#E2725B] rounded-full border-2 border-[#5C4033] flex items-center justify-center text-3xl mb-4 shadow-[2px_2px_0px_#5C4033]">
                        📊
                    </div>
                    <h3 className="text-lg font-black text-[#5C4033] uppercase tracking-wider">
                        Cohort Completion Progress
                    </h3>
                    <p className="text-[#8B6C58] text-xs font-bold max-w-sm mt-2 leading-relaxed">
                        Interactive progress charts are active! You can track real-time quiz performance, pass percentages, and active shell certifications of your cohorts below.
                    </p>
                </div>

                {/* Performance Highlights widgets */}
                <div className="flex flex-col gap-6">
                    {/* Widget 1: High Performers */}
                    <div className="bg-[#EBF7EB] border-4 border-[#5C4033] rounded-[24px] p-5 shadow-[4px_4px_0px_#5C4033] flex-1 flex flex-col justify-center">
                        <span className="text-[#225522] font-black text-xs uppercase tracking-wider mb-1 block">
                            High Performers
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-[#5C4033] tracking-tight font-mono">
                                12
                            </span>
                            <span className="text-xs text-[#225522] font-bold">Students</span>
                        </div>
                        <p className="text-[#225522]/80 text-[10px] font-bold uppercase mt-1">
                            Scoring above 90% average
                        </p>
                    </div>

                    {/* Widget 2: Needs Attention */}
                    <div className="bg-[#FFF2E6] border-4 border-[#5C4033] rounded-[24px] p-5 shadow-[4px_4px_0px_#5C4033] flex-1 flex flex-col justify-center">
                        <span className="text-[#552211] font-black text-xs uppercase tracking-wider mb-1 block">
                            Needs Attention
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-[#5C4033] tracking-tight font-mono">
                                3
                            </span>
                            <span className="text-xs text-[#552211] font-bold">Students</span>
                        </div>
                        <p className="text-[#552211]/80 text-[10px] font-bold uppercase mt-1">
                            Inactive for more than 3 days
                        </p>
                    </div>
                </div>
            </div>

            {/* Roster Section */}
            <div className="bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[28px] p-6 md:p-8 shadow-[8px_8px_0px_#5C4033] mb-4">
                <h3 className="bubble-text text-3xl text-[#E2725B] tracking-tight mb-6">
                    Student Roster
                </h3>

                <div className="overflow-x-auto border-2 border-[#5C4033] rounded-2xl bg-[#FDF6E2]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-[#5C4033] bg-[#F5EFCF] text-[#5C4033] font-black text-xs uppercase tracking-wider">
                                <th className="py-4 px-6 border-r-2 border-[#5C4033]">Student Name</th>
                                <th className="py-4 px-6 border-r-2 border-[#5C4033]">Active Shell</th>
                                <th className="py-4 px-6 border-r-2 border-[#5C4033]">Progress</th>
                                <th className="py-4 px-6 border-r-2 border-[#5C4033]">Status</th>
                                <th className="py-4 px-6 text-right">Avg Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-[#5C4033]/30 text-sm font-semibold text-[#5C4033]">
                            {cohortData.length > 0 ? (
                                cohortData.map((student, idx) => (
                                    <tr key={idx} className="hover:bg-[#F5EFCF]/40 transition-colors">
                                        <td className="py-4 px-6 border-r-2 border-[#5C4033]">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#5C4033]">{student.student}</span>
                                                <span className="text-[10px] text-[#8B6C58] font-bold uppercase mt-0.5">
                                                    Last active: {student.last_active}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r-2 border-[#5C4033] font-bold">
                                            {student.shell}
                                        </td>
                                        <td className="py-4 px-6 border-r-2 border-[#5C4033]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 bg-[#FFFDF6] border-2 border-[#5C4033] rounded-full h-4 overflow-hidden relative shadow-[1px_1px_0px_#5C4033]">
                                                    <div 
                                                        className={`h-full border-r border-[#5C4033] transition-all duration-500 ${
                                                            student.progress === 100 ? 'bg-[#77DD77]' : 'bg-[#FFB366]'
                                                        }`} 
                                                        style={{ width: `${student.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-black text-[#5C4033] font-mono">
                                                    {student.progress}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r-2 border-[#5C4033]">
                                            {student.status === 'Completed' ? (
                                                <span className="inline-block bg-[#77DD77] text-white border-2 border-[#5C4033] font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-lg shadow-[2px_2px_0px_#5C4033]">
                                                    Completed
                                                </span>
                                            ) : student.status === 'Falling Behind' ? (
                                                <span className="inline-block bg-[#E2725B] text-white border-2 border-[#5C4033] font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-lg shadow-[2px_2px_0px_#5C4033]">
                                                    Falling Behind
                                                </span>
                                            ) : (
                                                <span className="inline-block bg-[#89A8FF] text-white border-2 border-[#5C4033] font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-lg shadow-[2px_2px_0px_#5C4033]">
                                                    Ongoing
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right font-black text-lg text-[#5C4033] font-mono">
                                            {student.score}%
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 px-6 text-center text-[#8B6C58] font-bold">
                                        <div className="text-3xl mb-2">🎓</div>
                                        No students enrolled in your cohorts yet. Buy vouchers and share the codes to invite students!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </TeacherLayout>
    );
}
