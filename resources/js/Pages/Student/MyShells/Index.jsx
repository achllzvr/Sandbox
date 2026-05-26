import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Student/MyShellController.php @ index
 * * Required Inertia Props:
 * 1. auth.user (Handled globally)
 * 2. enrolledShells: Array of the student's purchased/enrolled certifications.
 * Expected JSON Structure:
 * [
 * {
 * id: 1,
 * title: "Introduction to React",
 * thumbnail: "url-to-image.jpg" (or null),
 * progress_percentage: 45,
 * status: "in_progress", // or "completed"
 * modules: [
 * { id: 101, title: "Sandbox 1: Components", is_completed: true },
 * { id: 102, title: "Sandbox 2: State & Props", is_completed: false },
 * { id: 103, title: "Sandcastle: Final Exam", is_completed: false }
 * ]
 * }
 * ]
 * ==============================================================================
 */

export default function MyShells({ auth, enrolledShells = [] }) {
    // State to track which Shell card is currently expanded
    const [expandedShellId, setExpandedShellId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedShellId(expandedShellId === id ? null : id);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-2xl text-stone-900 tracking-tighter">My Shells</h2>}
        >
            <Head title="My Shells" />

            <div className="py-8 selection:bg-orange-500 selection:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="mb-8">
                        <p className="text-stone-500 text-lg font-medium">
                            Resume your learning and build your streak, {auth.user.first_name}.
                        </p>
                    </div>

                    {/* Empty State Fallback */}
                    {enrolledShells.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
                                🐚
                            </div>
                            <h3 className="text-2xl font-black text-stone-900 mb-3">Your beach is empty!</h3>
                            <p className="text-stone-500 max-w-md mx-auto mb-8 font-medium">
                                You haven't enrolled in any certifications yet. Head over to the Marketplace to find your first Shell and start earning Sand Dollars.
                            </p>
                            <Link 
                                href={route('marketplace.index')} 
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:-translate-y-0.5"
                            >
                                Browse Marketplace
                            </Link>
                        </div>
                    ) : (
                        /* Shells Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {enrolledShells.map((shell) => {
                                const isExpanded = expandedShellId === shell.id;
                                
                                return (
                                    <div 
                                        key={shell.id} 
                                        className={`bg-white rounded-3xl border border-stone-200 shadow-sm transition-all duration-300 overflow-hidden flex flex-col ${isExpanded ? 'ring-2 ring-orange-500 shadow-md' : 'hover:border-orange-300 hover:shadow-md'}`}
                                    >
                                        {/* Card Top: Thumbnail */}
                                        <div className="h-48 bg-stone-100 relative">
                                            {shell.thumbnail ? (
                                                <img src={shell.thumbnail} alt={shell.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 text-orange-300 text-5xl">
                                                    🐚
                                                </div>
                                            )}
                                            {shell.status === 'completed' && (
                                                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                                                    ✓ Certified
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Middle: Info & Progress */}
                                        <div className="p-6 flex-grow flex flex-col justify-between cursor-pointer" onClick={() => toggleExpand(shell.id)}>
                                            <div>
                                                <h3 className="text-xl font-black text-stone-900 mb-2 leading-tight">
                                                    {shell.title}
                                                </h3>
                                                
                                                {/* Progress Bar */}
                                                <div className="mt-6 mb-2 flex justify-between items-end">
                                                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Progress</span>
                                                    <span className="text-sm font-black text-orange-500">{shell.progress_percentage}%</span>
                                                </div>
                                                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                                                    <div 
                                                        className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" 
                                                        style={{ width: `${shell.progress_percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Expand Toggle Text */}
                                            <div className="mt-6 text-center text-sm font-bold text-stone-400 group flex items-center justify-center gap-1">
                                                {isExpanded ? 'Hide Modules' : 'View Modules'}
                                                <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                                            </div>
                                        </div>

                                        {/* Card Bottom: Expanded Modules List */}
                                        {isExpanded && (
                                            <div className="bg-stone-50 border-t border-stone-200 p-6 flex flex-col gap-3 animation-fade-in">
                                                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Curriculum</h4>
                                                
                                                {/* Module Items */}
                                                {shell.modules?.map((mod, index) => (
                                                    <div key={mod.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-sm">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${mod.is_completed ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-stone-400'}`}>
                                                            {mod.is_completed ? '✓' : (index + 1)}
                                                        </div>
                                                        <span className={`text-sm font-medium truncate ${mod.is_completed ? 'text-stone-400 line-through' : 'text-stone-700'}`}>
                                                            {mod.title}
                                                        </span>
                                                    </div>
                                                ))}

                                                {/* Action Button */}
                                                <Link 
                                                    href={route('student.shells.show', shell.id)} 
                                                    className="mt-4 w-full text-center bg-stone-900 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md"
                                                >
                                                    {shell.progress_percentage === 0 ? 'Start Shell' : (shell.status === 'completed' ? 'Review Content' : 'Resume Learning')}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}