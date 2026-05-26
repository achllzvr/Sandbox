import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show() {
    const { certification, progress, auth } = usePage().props;

    // Flatten all modules into a single ordered array
    const allModules = certification.lessons.flatMap(lesson => lesson.modules);

    // Calculate progression states
    const isCompleted = (moduleId) => progress.completed_module_ids?.includes(moduleId);
    
    // A module is unlocked if it's the first one OR the previous one is completed
    const isUnlocked = (index) => {
        if (index === 0) return true;
        const prevModule = allModules[index - 1];
        return isCompleted(prevModule.id);
    };

    const isAllCompleted = progress.completed_modules === progress.total_modules;

    return (
        <AuthenticatedLayout auth={auth} header={
            <div className="flex items-center gap-4">
                <Link
                    href={route('student.dashboard')}
                    className="bg-[#fbe4d8] border border-[#f0cbb5] text-[#d65d4b] hover:bg-[#f6d2c0] p-2.5 rounded-xl transition-colors shadow-sm"
                    title="Back to Dashboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div className="flex-1 text-center pr-12">
                    <h2 className="text-2xl font-black text-[#d65d4b] uppercase tracking-wide">{certification.title}</h2>
                    <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-[#1e293b] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Official Certificate
                    </div>
                </div>
            </div>
        }>
            <Head title={certification.title + ' — Sandbox'} />

            {/* Container mapping the Figma's beige background */}
            <div className="min-h-screen bg-[#fdf6e3] py-12 px-4 flex flex-col items-center overflow-x-hidden">
                
                {/* ── Progression Path ── */}
                <div className="relative w-full max-w-lg flex flex-col items-center">
                    
                    {/* The Path Line */}
                    <div className="absolute top-0 bottom-0 w-1.5 bg-[#e5d5c5] rounded-full -z-10 left-1/2 -translate-x-1/2"></div>

                    {allModules.map((module, index) => {
                        const completed = isCompleted(module.id);
                        const unlocked = isUnlocked(index);
                        const isActive = unlocked && !completed;

                        return (
                            <div key={module.id} className="relative flex flex-col items-center w-full mb-16 group">
                                
                                {/* Info Tooltip Bubble (always visible if active/completed, or on hover if locked) */}
                                <div className={`relative bg-white/90 backdrop-blur border-2 ${isActive ? 'border-[#f07167]' : completed ? 'border-emerald-400' : 'border-stone-300'} rounded-2xl p-4 shadow-xl mb-4 w-72 text-center transition-all ${!unlocked && 'opacity-60 grayscale'}`}>
                                    <h3 className={`font-black uppercase tracking-wider text-sm ${isActive ? 'text-[#f07167]' : completed ? 'text-emerald-500' : 'text-stone-500'}`}>
                                        {module.title}
                                    </h3>
                                    <p className="text-xs text-stone-500 mt-1 font-semibold">Sandbox {index + 1} of {allModules.length}</p>
                                    
                                    <div className="mt-3">
                                        {completed ? (
                                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                                                <span className="text-base">✅</span> Completed
                                            </div>
                                        ) : unlocked ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    import('@inertiajs/react').then(({ router }) => {
                                                        router.post(route('student.shells.modules.complete', module.id), {}, { preserveScroll: true });
                                                    });
                                                }}
                                                className="w-full bg-[#f07167] hover:bg-[#e06056] text-white text-xs font-black uppercase tracking-wider py-2.5 rounded-xl shadow-sm transition-all"
                                            >
                                                Play This Sandbox (Complete)
                                            </button>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
                                                🔒 Finish Previous First
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sandbox Visual (Placeholder) */}
                                <div className="relative">
                                    <div className={`w-32 h-20 bg-[#d8c3a5] rounded-[40px] border-b-8 border-[#c2b280] shadow-inner flex items-center justify-center text-4xl transition-all ${!unlocked && 'opacity-50 grayscale'}`}>
                                        {/* Show Hermy 🦀 if active, otherwise Shell 🐚 */}
                                        {isActive ? '🦀' : '🐚'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* ── Final Exam (Sandcastle) ── */}
                    <div className="relative flex flex-col items-center w-full mt-8">
                        <div className="w-full border-t-2 border-[#e5d5c5] absolute top-10 -z-20"></div>
                        
                        <div className={`relative bg-white/90 backdrop-blur border-2 ${isAllCompleted ? 'border-amber-400' : 'border-stone-300'} rounded-2xl p-5 shadow-xl mb-6 w-80 text-center transition-all ${!isAllCompleted && 'opacity-60 grayscale'}`}>
                            <h3 className={`font-black text-lg uppercase tracking-wider ${isAllCompleted ? 'text-amber-500' : 'text-stone-500'}`}>
                                Final Exam
                            </h3>
                            <p className="text-xs text-stone-500 mt-1 font-semibold">An exam covering all previous sandboxes</p>
                            
                            <div className="mt-4">
                                {isAllCompleted ? (
                                    <button
                                        type="button"
                                        onClick={() => alert("Final Exam interface will go here!")}
                                        className="w-full bg-amber-400 hover:bg-amber-500 text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl shadow-md transition-all"
                                    >
                                        Take Sandcastle Exam
                                    </button>
                                ) : (
                                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 bg-stone-100 px-4 py-2 rounded-xl border border-stone-200">
                                        🔒 Finish All Sandboxes First
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sandcastle Visual */}
                        <div className={`text-8xl drop-shadow-xl transition-all ${!isAllCompleted && 'opacity-50 grayscale'}`}>
                            🏰
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
