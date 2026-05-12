import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Analytics({ cohortData }) {
    return (
        <TeacherLayout>
            <Head title="Cohort Analytics - Teacher Dashboard" />

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-stone-900">Cohort Analytics</h2>
                    <p className="text-stone-500 mt-1">Granular insights into student progress, quiz scores, and Sandcastle exam results.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Progress Chart Placeholder */}
                    <div className="col-span-2 bg-stone-50 border border-stone-100 rounded-2xl p-6 flex flex-col justify-center items-center min-h-[300px]">
                        <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-3xl mb-4">
                            📊
                        </div>
                        <h3 className="text-lg font-bold text-stone-900">Overall Cohort Progress</h3>
                        <p className="text-stone-500 text-sm text-center max-w-sm mt-2">
                            Interactive progress charts will appear here, showing completion rates across different modules in your Shells.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-100 p-5 rounded-2xl">
                            <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-1">High Performers</h4>
                            <p className="text-3xl font-black text-green-900">12</p>
                            <p className="text-green-700 text-sm mt-1">Students scoring above 90%</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl">
                            <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">Needs Attention</h4>
                            <p className="text-3xl font-black text-amber-900">3</p>
                            <p className="text-amber-700 text-sm mt-1">Students inactive for > 3 days</p>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-stone-900 mb-4">Student Roster</h3>
                <div className="overflow-x-auto rounded-xl border border-stone-200">
                    <table className="min-w-full divide-y divide-stone-200">
                        <thead className="bg-stone-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Student Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Shell</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Progress</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Avg Score</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-stone-200">
                            {cohortData.map((student, idx) => (
                                <tr key={idx} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-stone-900">{student.student}</span>
                                            <span className="text-xs text-stone-500">Last active: {student.last_active}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900 font-medium">
                                        {student.shell}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-full bg-stone-200 rounded-full h-2.5">
                                            <div 
                                                className={`h-2.5 rounded-full ${student.progress === 100 ? 'bg-green-500' : 'bg-amber-500'}`} 
                                                style={{ width: `${student.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-bold text-stone-600 mt-1 block">{student.progress}%</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            student.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                            student.status === 'Falling Behind' ? 'bg-red-100 text-red-800' : 
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-stone-900">
                                        {student.score}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </TeacherLayout>
    );
}
