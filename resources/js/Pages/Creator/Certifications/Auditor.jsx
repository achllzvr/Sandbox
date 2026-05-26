import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CreatorLayout from '@/Layouts/CreatorLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Creator/CertificationController.php @ analytics
 * (Or a dedicated AuditorController)
 * Required Props:
 * 1. certification: { id, title, completion_rate, avg_quiz_score, total_enrollments }
 * 2. students: Array of { id, name, email, current_position, progress_percentage, final_grade, status: 'Completed' | 'In Progress' | 'At Risk' }
 * ==============================================================================
 */

export default function CreatorShellAnalytics({ auth, certification, students = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Frontend filtering for the auditor table
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              student.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Completed': return "bg-green-100 text-green-700 border-green-200";
            case 'In Progress': return "bg-orange-100 text-orange-700 border-orange-200";
            case 'At Risk': return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-stone-100 text-stone-600 border-stone-200";
        }
    };

    return (
        <CreatorLayout user={auth.user} header={<h2 className="font-black text-2xl text-stone-900 tracking-tighter">Student Progress Auditor</h2>}>
            <Head title={`Auditor: ${certification?.title || 'Details'}`} />

            <div className="min-h-screen bg-[#F9F8F6] pb-24 selection:bg-orange-500 selection:text-white">
                
                {/* Breadcrumbs */}
                <div className="bg-white border-b border-stone-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                        <Link href={route('creator.certifications.index')} className="text-sm font-bold text-stone-400 hover:text-orange-500 transition-colors">
                            &larr; Back to My Curriculum
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    
                    {/* Header & High-Level KPIs */}
                    <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">
                                Student Auditor: {certification?.title || 'React.js Certification'}
                            </h1>
                            <p className="text-stone-500 font-medium">Monitor global student progress, identify bottlenecks, and review final exam scores.</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white px-6 py-4 rounded-2xl border border-stone-200 shadow-sm text-center">
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Completion Rate</p>
                                <p className="text-2xl font-black text-green-600">{certification?.completion_rate || 0}%</p>
                            </div>
                            <div className="bg-white px-6 py-4 rounded-2xl border border-stone-200 shadow-sm text-center">
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Avg Quiz Score</p>
                                <p className="text-2xl font-black text-orange-500">{certification?.avg_quiz_score || 0}%</p>
                            </div>
                            <div className="bg-white px-6 py-4 rounded-2xl border border-stone-200 shadow-sm text-center">
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Enrollments</p>
                                <p className="text-2xl font-black text-stone-900">{certification?.total_enrollments || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Data Table Section */}
                    <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
                        
                        {/* Table Controls */}
                        <div className="p-6 border-b border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="w-full sm:w-96 relative">
                                <span className="absolute left-4 top-3 text-stone-400">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder="Search student name or email..." 
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border-stone-200 focus:border-orange-500 focus:ring-orange-500 text-sm font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-auto flex gap-3">
                                <select 
                                    className="rounded-xl border-stone-200 focus:border-orange-500 focus:ring-orange-500 text-sm font-bold text-stone-600 w-full sm:w-auto"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="At Risk">At Risk (Stuck)</option>
                                </select>
                                <button className="bg-white border-2 border-stone-200 hover:border-stone-300 text-stone-600 font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0">
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {/* The Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
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
                                                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg shrink-0">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-stone-900">{student.name}</p>
                                                        <p className="text-xs font-medium text-stone-500">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <p className="font-bold text-stone-700 text-sm">{student.current_position || 'Not Started'}</p>
                                            </td>
                                            <td className="p-6 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                                                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${student.progress_percentage}%` }}></div>
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
                                            {/* Mascot Empty State based on your No Data mockup */}
                                            <td colSpan="5" className="p-16 text-center text-stone-500 font-medium">
                                                {/* TODO: Mascot - Insert Hermy Shrugging / Auditor image here later */}
                                                <div className="text-5xl mb-4 opacity-75 flex justify-center">
                                                    <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center border border-stone-200 shadow-inner">
                                                        🦀
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-black text-stone-900 mb-2">No students found</h3>
                                                <p>Try adjusting your search query or status filter.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </CreatorLayout>
    );
}