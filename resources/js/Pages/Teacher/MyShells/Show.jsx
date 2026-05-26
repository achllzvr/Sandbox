import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Teacher/BatchController.php @ show
 * Required Props:
 * 1. batch: { id, batch_name, shell_title, overall_completion_rate, avg_quiz_score }
 * 2. students: Array of { id, name, email, current_module, progress_percentage, final_grade, status: 'Completed' | 'In Progress' | 'At Risk' }
 * ==============================================================================
 */

export default function TeacherBatchShow({ auth, batch, students = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Simple frontend filtering for the data table
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              student.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Completed': return "bg-green-100 text-green-700 border-green-200";
            case 'In Progress': return "bg-blue-100 text-blue-700 border-blue-200";
            case 'At Risk': return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-stone-100 text-stone-600 border-stone-200";
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Batch Analytics - ${batch?.batch_name || 'Details'}`} />

            <div className="min-h-screen bg-[#F9F8F6] pb-24 selection:bg-blue-500 selection:text-white">
                
                {/* Breadcrumbs */}
                <div className="bg-white border-b border-stone-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                        <Link href={route('teacher.shells.index')} className="text-sm font-bold text-stone-400 hover:text-blue-600 transition-colors">
                            &larr; Back to My Batches
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    
                    {/* Header & High-Level KPIs */}
                    <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">
                                Analytics: {batch?.batch_name || 'Batch 1'}
                            </h1>
                            <p className="text-stone-500 font-bold">{batch?.shell_title || 'Introduction to React'}</p>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="bg-white px-6 py-4 rounded-2xl border border-stone-200 shadow-sm text-center">
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Completion Rate</p>
                                <p className="text-2xl font-black text-green-600">{batch?.overall_completion_rate || 0}%</p>
                            </div>
                            <div className="bg-white px-6 py-4 rounded-2xl border border-stone-200 shadow-sm text-center">
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Avg Quiz Score</p>
                                <p className="text-2xl font-black text-blue-600">{batch?.avg_quiz_score || 0}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Data Table Section */}
                    <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
                        
                        {/* Table Controls */}
                        <div className="p-6 border-b border-stone-200 bg-stone-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="w-full sm:w-96 relative">
                                <span className="absolute left-4 top-3 text-stone-400">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder="Search student name or email..." 
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border-stone-200 focus:border-blue-500 focus:ring-blue-500 text-sm font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-auto flex gap-3">
                                <select 
                                    className="rounded-xl border-stone-200 focus:border-blue-500 focus:ring-blue-500 text-sm font-bold text-stone-600 w-full sm:w-auto"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="At Risk">At Risk</option>
                                </select>
                                <button className="bg-white border-2 border-stone-200 hover:border-stone-300 text-stone-600 font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0">
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {/* The Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-stone-50/50 border-b border-stone-200 text-xs font-black text-stone-400 uppercase tracking-widest">
                                        <th className="p-6 w-1/3">Student Profile</th>
                                        <th className="p-6 w-1/4">Current Position</th>
                                        <th className="p-6 text-center">Progress</th>
                                        <th className="p-6 text-center">Final Exam</th>
                                        <th className="p-6 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {filteredStudents.length > 0 ? filteredStudents.map(student => (
                                        <tr key={student.id} className="hover:bg-stone-50/50 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-stone-900">{student.name}</p>
                                                        <p className="text-xs font-medium text-stone-500">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <p className="font-bold text-stone-700 text-sm">{student.current_module || 'Not Started'}</p>
                                            </td>
                                            <td className="p-6 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full bg-stone-100 rounded-full h-2">
                                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${student.progress_percentage}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-stone-600 w-8">{student.progress_percentage}%</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className="font-bold text-stone-900">{student.final_grade || '-'}</span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(student.status)}`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            {/* TODO: Mascot - Insert Hermy Shrugging image here later if empty */}
                                            <td colSpan="5" className="p-12 text-center text-stone-500 font-medium">
                                                <div className="text-4xl mb-3">🦀</div>
                                                No students found matching your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}