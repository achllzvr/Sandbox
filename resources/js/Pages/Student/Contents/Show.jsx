import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Student/LearningMaterialController.php @ show
 * Required Props:
 * 1. content: { id, title, type: 'video' | 'presentation', url, is_completed }
 * 2. module_playlist: Array of all contents in this module for the left sidebar.
 * [{ id, title, type, is_completed, is_current }]
 * 3. next_content_url: String URL to redirect to when "Complete & Continue" is clicked.
 * ==============================================================================
 */

export default function ContentShow({ auth, content, module_playlist = [], next_content_url }) {
    const [isProcessing, setIsProcessing] = useState(false);

    // This triggers Mike & Ahmad's endpoint to mark the material as done
    const markAsComplete = () => {
        setIsProcessing(true);
        router.post(route('student.contents.complete', content.id), {}, {
            onFinish: () => setIsProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} hideNavigation={true}>
            <Head title={content?.title || 'Learning Module'} />

            {/* Top Navbar specifically for the learning interface */}
            <nav className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href={route('student.shells.index')} className="text-stone-400 hover:text-stone-900 font-bold transition-colors">
                        &larr; Back to Sandbox
                    </Link>
                    <span className="text-stone-300">|</span>
                    <h1 className="font-black text-stone-900 truncate max-w-md">{content?.title}</h1>
                </div>
                
                {content?.is_completed ? (
                    <Link 
                        href={next_content_url} 
                        className="bg-stone-900 text-white font-bold px-6 py-2 rounded-lg hover:bg-orange-500 transition-colors shadow-sm"
                    >
                        Next Lesson &rarr;
                    </Link>
                ) : (
                    <button 
                        onClick={markAsComplete}
                        disabled={isProcessing}
                        className="bg-orange-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20 disabled:opacity-50"
                    >
                        {isProcessing ? 'Saving...' : 'Complete & Continue'}
                    </button>
                )}
            </nav>

            <div className="flex h-[calc(100vh-4rem)] bg-[#F9F8F6]">
                {/* Left Sidebar - Playlist */}
                <aside className="w-80 bg-white border-r border-stone-200 overflow-y-auto hidden md:block">
                    <div className="p-6">
                        <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">Module Contents</h3>
                        <div className="space-y-2">
                            {module_playlist.map((item) => (
                                <Link 
                                    key={item.id} 
                                    href={route('student.contents.show', item.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        item.is_current ? 'bg-orange-50 border-orange-200 shadow-sm' : 
                                        'border-transparent hover:bg-stone-50 hover:border-stone-200'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                                        item.is_completed ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-stone-400'
                                    }`}>
                                        {item.is_completed ? '✓' : (item.type === 'video' ? '▶' : '📄')}
                                    </div>
                                    <span className={`text-sm font-bold truncate ${item.is_current ? 'text-orange-700' : 'text-stone-700'}`}>
                                        {item.title}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center">
                    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden min-h-[600px] flex items-center justify-center">
                        
                        {content?.type === 'video' ? (
                            <div className="w-full h-full aspect-video bg-black relative">
                                {/* Video Player Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-white/50 flex-col">
                                    <span className="text-6xl mb-4">▶️</span>
                                    <p className="font-bold">Video Player Integration (YouTube/MP4)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full min-h-[600px] bg-stone-100 flex flex-col items-center justify-center relative">
                                {/* PPT/PDF Viewer Placeholder */}
                                <span className="text-6xl mb-4">📊</span>
                                <p className="font-bold text-stone-500">PowerPoint / PDF Viewer</p>
                                <a href={content?.url} target="_blank" rel="noreferrer" className="mt-4 text-orange-500 font-bold hover:underline">
                                    Download File
                                </a>
                            </div>
                        )}
                        
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}