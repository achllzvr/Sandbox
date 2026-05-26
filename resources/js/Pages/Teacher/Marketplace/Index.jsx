import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Teacher/PurchasingController.php @ index
 * Required Props:
 * 1. shells: Array of available certifications for bulk purchase.
 * [ { id, title, thumbnail, price, creator_name, category, total_schools_using } ]
 * 2. categories: Array of strings for the filter pills.
 * ==============================================================================
 */

export default function TeacherMarketplaceIndex({ auth, shells = [], categories = ['All', 'Programming', 'Design', 'Business'] }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-2xl text-stone-900 tracking-tighter">Bulk Purchasing</h2>}>
            <Head title="Teacher Shop" />

            <div className="py-8 bg-[#FDFCFB] min-h-screen selection:bg-blue-500 selection:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* B2B Hero Banner */}
                    <div className="bg-blue-900 rounded-[2rem] p-8 md:p-12 mb-10 text-white relative overflow-hidden shadow-xl shadow-blue-900/10">
                        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="relative z-10 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-800 text-blue-200 text-xs font-bold mb-4 border border-blue-700">
                                Institutional Portal
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Equip your students.</h1>
                            <p className="text-blue-100 text-lg mb-8 font-medium">Purchase bulk certification vouchers, assign them to your cohorts, and track their progress through the Sandbox curriculum.</p>
                            
                            {/* Search Bar */}
                            <div className="flex bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20 focus-within:border-blue-400 transition-colors">
                                <span className="pl-4 pr-2 flex items-center text-xl">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder="Search for subjects or certifications..." 
                                    className="w-full bg-transparent border-none text-white placeholder-blue-200 focus:ring-0 px-2 font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Categories Filter */}
                    <div className="flex overflow-x-auto gap-3 mb-8 pb-2 scrollbar-hide">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                                    activeCategory === category 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' 
                                    : 'bg-white text-stone-500 border border-stone-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Shells Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {shells.length > 0 ? shells.map(shell => (
                            <Link key={shell.id} href={route('teacher.marketplace.show', shell.id)} className="group bg-white rounded-3xl border border-stone-200 overflow-hidden hover:shadow-xl hover:shadow-stone-200/50 hover:border-blue-300 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
                                <div className="h-48 bg-stone-100 relative overflow-hidden">
                                    {shell.thumbnail ? (
                                        <img src={shell.thumbnail} alt={shell.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-stone-50 text-4xl">📚</div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-black px-3 py-1.5 rounded-lg shadow-sm">
                                        ₱ {shell.price} / student
                                    </div>
                                </div>
                                
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-black text-lg text-stone-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{shell.title}</h3>
                                        <p className="text-sm font-medium text-stone-500 mb-4">By {shell.creator_name}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-stone-400">
                                            <span>🏫 {shell.total_schools_using || 0} Schools Enrolled</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full py-24 text-center">
                                <span className="text-5xl mb-4 block">🏝️</span>
                                <h3 className="text-xl font-black text-stone-900">No Certifications Found</h3>
                                <p className="text-stone-500">Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}