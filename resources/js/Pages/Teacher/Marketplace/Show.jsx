import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Student/MarketplaceController.php @ show
 * Expected extended props for the long-scroll page:
 * shell: { ..., learning_outcomes: [], requirements: [], instructor: { name, bio, avatar, rating, students }, reviews: [] }
 * ==============================================================================
 */

export default function MarketplaceShowExpanded({ auth, shell, modules = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState('select_method'); 
    
    // Checkouts & Modals (Preserved from previous logic)
    const openModal = () => { setIsModalOpen(true); setModalStep('select_method'); };
    const closeModal = () => setIsModalOpen(false);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={shell?.title || 'Shell Details'} />

            <div className="min-h-screen bg-[#FDFCFB] pb-24 selection:bg-orange-500 selection:text-white">
                
                {/* Minimal Breadcrumb Header */}
                <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <Link href={route('marketplace.index')} className="text-sm font-bold text-stone-400 hover:text-stone-900 transition-colors">
                            &larr; Back to Shop
                        </Link>
                        {/* Mobile quick-enroll button that appears on scroll */}
                        <button onClick={openModal} className="lg:hidden bg-orange-500 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-md">
                            Enroll - ₱ {shell?.price || "1,500"}
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <div className="flex flex-col lg:flex-row gap-12 relative">
                        
                        {/* LEFT COLUMN: The Long Scroll Content */}
                        <div className="w-full lg:w-2/3 space-y-16">
                            
                            {/* SECTION 1: Hero Intro */}
                            <section>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-100 text-stone-600 text-xs font-bold mb-4">
                                    {shell?.category || 'Development'}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-[1.1] mb-6">
                                    {shell?.title || "Complete React.js Certification"}
                                </h1>
                                <p className="text-xl text-stone-500 font-medium mb-6 leading-relaxed">
                                    {shell?.description || "Master modern web development. Learn hooks, state management, and build interactive user interfaces to earn your Sandbox Certification."}
                                </p>
                                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-stone-500 border-b border-stone-200 pb-8">
                                    <div className="flex items-center gap-1.5 text-orange-500">
                                        <span>⭐ {shell?.rating || '4.8'}</span>
                                        <span className="text-stone-400">({shell?.reviews?.length || 124} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>👥 {shell?.enrolled_count || '1,024'} Students</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>⏱️ 12 Hours of Content</span>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 2: What You'll Learn (The Grid) */}
                            <section className="bg-stone-50 p-8 rounded-3xl border border-stone-200">
                                <h3 className="text-2xl font-black text-stone-900 mb-6">What you'll learn</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(shell?.learning_outcomes || [
                                        "Build powerful, fast, user-friendly and reactive web apps",
                                        "Provide amazing user experiences by leveraging the power of JavaScript",
                                        "Learn React Hooks & Custom Hooks",
                                        "Manage complex state with Context API & Redux"
                                    ]).map((outcome, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <span className="text-green-500 font-black mt-0.5">✓</span>
                                            <span className="text-stone-700 font-medium">{outcome}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* SECTION 3: Curriculum / Modules */}
                            <section>
                                <h3 className="text-2xl font-black text-stone-900 mb-6">Curriculum Overview</h3>
                                <div className="space-y-4">
                                    {modules.length > 0 ? modules.map((mod, idx) => (
                                        <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4 hover:border-orange-300 transition-colors">
                                            <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-grow">
                                                <span className="font-bold text-stone-700 text-lg">{mod.title}</span>
                                            </div>
                                            <div className="text-stone-400 font-medium text-sm hidden sm:block">
                                                {mod.contents_count || 3} items
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-stone-500 italic">Curriculum details loading...</p>
                                    )}
                                </div>
                            </section>

                            {/* SECTION 4: Requirements */}
                            <section>
                                <h3 className="text-2xl font-black text-stone-900 mb-6">Requirements</h3>
                                <ul className="list-disc pl-5 space-y-2 text-stone-600 font-medium">
                                    {shell?.requirements?.map((req, idx) => (
                                        <li key={idx}>{req}</li>
                                    )) || (
                                        <>
                                            <li>Basic HTML and CSS knowledge is required.</li>
                                            <li>Fundamental JavaScript knowledge (variables, functions, arrays, objects).</li>
                                            <li>No prior React experience is necessary!</li>
                                        </>
                                    )}
                                </ul>
                            </section>

                            {/* SECTION 5: Instructor Profile */}
                            <section className="pt-8 border-t border-stone-200">
                                <h3 className="text-2xl font-black text-stone-900 mb-6">Your Instructor</h3>
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="w-32 h-32 rounded-full bg-stone-200 shrink-0 overflow-hidden">
                                        {shell?.instructor?.avatar ? (
                                            <img src={shell.instructor.avatar} alt="Instructor" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl">🧑‍🏫</div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-stone-900 mb-1">{shell?.instructor?.name || "Sandbox Official"}</h4>
                                        <p className="text-stone-400 font-bold text-sm mb-4">Senior Software Engineer & Educator</p>
                                        <div className="flex gap-4 mb-4 text-sm font-bold text-stone-600">
                                            <span>⭐ {shell?.instructor?.rating || '4.9'} Instructor Rating</span>
                                            <span>👥 {shell?.instructor?.students || '12,400'} Students</span>
                                        </div>
                                        <p className="text-stone-600 font-medium leading-relaxed">
                                            {shell?.instructor?.bio || "Passionate about making complex technical concepts easy to understand. I've spent the last 10 years building enterprise applications and love sharing that knowledge with the Sandbox community."}
                                        </p>
                                    </div>
                                </div>
                            </section>

                        </div>

                        {/* RIGHT COLUMN: Sticky Purchase Card (Unchanged) */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white rounded-[2rem] border border-stone-200 shadow-xl shadow-stone-200/50 sticky top-24 overflow-hidden">
                                <div className="h-56 bg-stone-100 relative">
                                    {shell?.thumbnail ? (
                                        <img src={shell.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 text-6xl">🐚</div>
                                    )}
                                </div>
                                <div className="p-8 text-center">
                                    <div className="text-4xl font-black text-stone-900 mb-6">
                                        ₱ {shell?.price || "1,500.00"}
                                    </div>
                                    <button 
                                        onClick={openModal}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-1 mb-4"
                                    >
                                        Enroll Now
                                    </button>
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                                        Full Lifetime Access
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Logic Remains Exactly the same as the previous response */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
                    {/* ... (Checkout/Voucher Modal UI from previous response goes here) ... */}
                </div>
            )}
        </AuthenticatedLayout>
    );
}