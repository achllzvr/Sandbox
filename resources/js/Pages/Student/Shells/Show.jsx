import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Student/MyShellController.php @ show
 * * * Required Inertia Props:
 * 1. auth.user (Handled globally)
 * 2. shell: Object containing { id, title, progress_percentage, thumbnail }
 * 3. modules: Array of modules in chronological order.
 * * Expected JSON Structure for `modules`:
 * [
 * {
 * id: 1,
 * title: "Sandbox 1: Introduction to React",
 * status: "completed", // Accepts: "completed", "active", "locked"
 * is_final_exam: false,
 * contents: [
 * { id: 101, type: "quiz", title: "Short Test", meta: "5 Items", status: "completed" },
 * { id: 102, type: "presentation", title: "Component Basics", meta: "PPTX", status: "completed" },
 * { id: 103, type: "video", title: "Crash Course", meta: "YouTube", status: "completed" }
 * ]
 * },
 * // ... next modules
 * ]
 * ==============================================================================
 */

export default function Show({ auth, shell, modules = [] }) {
    // State to handle which Sandbox accordion is expanded
    // Defaults to the first 'active' module, or null if none found
    const defaultActive = modules.find(m => m.status === 'active')?.id || null;
    const [expandedModuleId, setExpandedModuleId] = useState(defaultActive);

    const toggleExpand = (id, status) => {
        // Prevent expanding locked modules
        if (status === 'locked') return;
        setExpandedModuleId(expandedModuleId === id ? null : id);
    };

    // Helper to render the appropriate icon based on content type
    const renderContentIcon = (type) => {
        switch(type) {
            case 'quiz': return '📝';
            case 'presentation': return '📊';
            case 'video': return '▶️';
            case 'code': return '💻';
            default: return '📄';
        }
    };

    // Helper to render the appropriate button text/style based on status
    const renderContentAction = (type, status, moduleId) => {
        const isCompleted = status === 'completed';
        const baseClasses = "text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-sm ";
        
        if (isCompleted) {
            return (
                <button className={baseClasses + "bg-stone-100 text-stone-600 hover:bg-stone-200"}>
                    Review
                </button>
            );
        }

        return (
            <button className={baseClasses + "bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-200 hover:border-orange-500"}>
                {type === 'quiz' ? 'Start Test' : type === 'video' ? 'Watch' : 'View'}
            </button>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center text-sm font-bold text-stone-500">
                    <Link href={route('student.shells.index')} className="hover:text-orange-500 transition-colors">
                        My Shells
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-stone-900">{shell?.title || 'Course View'}</span>
                </div>
            }
        >
            <Head title={shell?.title || 'Sandbox'} />

            <div className="py-8 selection:bg-orange-500 selection:text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* SHELL HEADER CARD */}
                    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Thumbnail Placeholder */}
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-4xl shrink-0 shadow-inner">
                            🐚
                        </div>
                        
                        <div className="flex-grow w-full">
                            <div className="flex justify-between items-start mb-2">
                                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                                    {shell?.title || 'React Basics Sandbox'}
                                </h1>
                                {/* Context Menu Placeholder */}
                                <button className="text-stone-400 hover:text-stone-600 p-2 rounded-lg hover:bg-stone-100 transition-colors">
                                    •••
                                </button>
                            </div>
                            
                            {/* Master Progress Bar */}
                            <div className="mt-4">
                                <div className="flex justify-between items-end mb-1.5">
                                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Overall Progress</span>
                                    <span className="text-sm font-black text-orange-500">{shell?.progress_percentage || 0}% Complete</span>
                                </div>
                                <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="bg-orange-500 h-3 rounded-full transition-all duration-700 ease-out" 
                                        style={{ width: `${shell?.progress_percentage || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MODULES (SANDBOXES) SEQUENCE */}
                    <div className="space-y-4">
                        {modules.map((module, index) => {
                            const isExpanded = expandedModuleId === module.id;
                            const isLocked = module.status === 'locked';
                            const isCompleted = module.status === 'completed';
                            const isActive = module.status === 'active';
                            const isFinalExam = module.is_final_exam;

                            return (
                                <div 
                                    key={module.id} 
                                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                                        isExpanded ? 'border-orange-300 shadow-md ring-1 ring-orange-500' : 
                                        isLocked ? 'border-stone-100 opacity-75' : 'border-stone-200 shadow-sm hover:border-orange-300 hover:shadow-md'
                                    }`}
                                >
                                    {/* ACCORDION HEADER */}
                                    <div 
                                        onClick={() => toggleExpand(module.id, module.status)}
                                        className={`p-5 flex items-center gap-4 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        {/* Status Icon */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shrink-0 transition-colors ${
                                            isCompleted ? 'bg-green-100 text-green-600' :
                                            isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' :
                                            'bg-stone-100 text-stone-400'
                                        }`}>
                                            {isCompleted ? '✓' : isLocked ? '🔒' : (isFinalExam ? '🏰' : (index + 1))}
                                        </div>

                                        {/* Title & Metadata */}
                                        <div className="flex-grow">
                                            <h3 className={`text-lg font-black ${isLocked ? 'text-stone-400' : 'text-stone-900'}`}>
                                                {module.title}
                                            </h3>
                                            <p className={`text-sm font-medium ${isLocked ? 'text-stone-400' : 'text-stone-500'}`}>
                                                {isFinalExam ? 'Sandcastle Assessment' : `${module.contents?.length || 0} Learning Items`}
                                            </p>
                                        </div>

                                        {/* Expand Chevron */}
                                        {!isLocked && (
                                            <div className={`text-stone-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                ▼
                                            </div>
                                        )}
                                    </div>

                                    {/* EXPANDED CONTENT (THE PLAYLIST) */}
                                    {isExpanded && (
                                        <div className="bg-stone-50 border-t border-stone-200 p-5 sm:p-6 animation-fade-in">
                                            <div className="space-y-3">
                                                
                                                {isFinalExam ? (
                                                    // FINAL EXAM SPECIFIC UI
                                                    <div className="bg-white border-2 border-orange-100 rounded-xl p-6 text-center shadow-sm">
                                                        <div className="text-4xl mb-4">👑</div>
                                                        <h4 className="text-xl font-black text-stone-900 mb-2">The Sandcastle Exam</h4>
                                                        <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
                                                            This is the final assessment. You must pass this comprehensive exam to earn your certification and Sand Dollars.
                                                        </p>
                                                        <Link 
                                                            href={route('student.exam.show', module.id)}
                                                            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5"
                                                        >
                                                            Take Final Exam
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    // STANDARD MODULE CONTENT LIST
                                                    module.contents?.map((content, idx) => (
                                                        <div key={content.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:border-orange-200 transition-colors">
                                                            
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center text-lg border border-stone-100">
                                                                    {renderContentIcon(content.type)}
                                                                </div>
                                                                <div>
                                                                    <h5 className={`font-bold ${content.status === 'completed' ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                                                                        {content.title}
                                                                    </h5>
                                                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                                                                        {content.meta}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex-shrink-0 self-end sm:self-auto">
                                                                {renderContentAction(content.type, content.status, module.id)}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}

                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}