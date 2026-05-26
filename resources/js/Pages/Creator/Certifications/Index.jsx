import { Head, Link } from '@inertiajs/react';
import CreatorLayout from '@/Layouts/CreatorLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Creator/CertificationController.php @ index
 * Required Props:
 * 1. certifications: Array of { id, title, thumbnail, status, price, enrollments_count, total_revenue }
 * ==============================================================================
 */

export default function CreatorShellsIndex({ auth, certifications = [] }) {
    return (
        <CreatorLayout user={auth.user} header={<h2 className="font-black text-2xl text-stone-900 tracking-tighter">My Curriculum</h2>}>
            <Head title="My Shells" />

            <div className="py-8 bg-[#F9F8F6] min-h-screen selection:bg-orange-500 selection:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                        <div>
                            <p className="text-stone-500 text-lg font-medium">
                                Manage your drafts, edit active curriculum, and monitor shell performance.
                            </p>
                        </div>
                        <Link href={route('creator.certifications.create')} className="bg-stone-900 hover:bg-orange-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-colors shrink-0">
                            + Create New Shell
                        </Link>
                    </div>

                    {certifications.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-12 text-center border border-stone-200 shadow-sm">
                            <div className="text-6xl mb-4">🏗️</div>
                            <h3 className="text-2xl font-black text-stone-900 mb-2">Your studio is empty</h3>
                            <p className="text-stone-500 mb-6 font-medium">You haven't built any certifications yet. Start drafting your first Shell today.</p>
                            <Link href={route('creator.certifications.create')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors">
                                Open Shell Builder
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {certifications.map(shell => (
                                <div key={shell.id} className="bg-white rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1">
                                    
                                    {/* Thumbnail Area */}
                                    <div className="h-48 bg-stone-100 relative overflow-hidden">
                                        {shell.thumbnail ? (
                                            <img src={shell.thumbnail} alt={shell.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-100 text-4xl">📐</div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-black shadow-sm backdrop-blur-md ${
                                                shell.status === 'Published' 
                                                ? 'bg-green-500/90 text-white' 
                                                : 'bg-stone-900/90 text-white'
                                            }`}>
                                                {shell.status || 'Draft'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-black text-stone-900 leading-tight group-hover:text-orange-500 transition-colors">{shell.title}</h3>
                                        </div>
                                        <p className="text-sm font-bold text-stone-400 mb-6">Price: ₱{shell.price}</p>
                                        
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-center">
                                                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Students</p>
                                                <p className="text-lg font-black text-stone-900">{shell.enrollments_count || 0}</p>
                                            </div>
                                            <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-center">
                                                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Revenue</p>
                                                <p className="text-lg font-black text-green-600">₱{shell.total_revenue || '0'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto grid grid-cols-2 gap-3">
                                            <Link 
                                                href={route('creator.certifications.edit', shell.id)} 
                                                className="w-full text-center bg-stone-100 hover:bg-orange-500 hover:text-white text-stone-600 font-bold py-3 rounded-xl transition-colors"
                                            >
                                                Edit Shell
                                            </Link>
                                            <Link 
                                                href="#" 
                                                className="w-full text-center border-2 border-stone-200 hover:border-stone-300 text-stone-600 font-bold py-3 rounded-xl transition-colors"
                                            >
                                                Analytics
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CreatorLayout>
    );
}