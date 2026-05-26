import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Teacher/BatchController.php @ index (or similar)
 * Required Props:
 * 1. batches: Array of { id, batch_name, shell_title, thumbnail, total_vouchers, claimed_vouchers, avg_progress, status }
 * ==============================================================================
 */

export default function TeacherBatchesIndex({ auth, batches = [] }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-2xl text-stone-900 tracking-tighter">My Cohorts & Batches</h2>}>
            <Head title="My Batches" />

            <div className="py-8 bg-[#FDFCFB] min-h-screen selection:bg-blue-500 selection:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <p className="text-stone-500 text-lg font-medium">
                                Manage your purchased Shells and monitor student progress across all cohorts.
                            </p>
                        </div>
                        <Link href="#" className="bg-stone-900 hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-colors hidden sm:block">
                            + Buy New Vouchers
                        </Link>
                    </div>

                    {batches.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm flex flex-col items-center">
                            <div className="text-6xl mb-4">🎟️</div>
                            <h3 className="text-2xl font-black text-stone-900 mb-2">No Batches Found</h3>
                            <p className="text-stone-500 mb-6 font-medium">You haven't purchased any bulk vouchers yet.</p>
                            <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors">
                                Go to Marketplace
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {batches.map(batch => (
                                <div key={batch.id} className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
                                    {/* Thumbnail Area */}
                                    <div className="h-40 bg-stone-100 relative">
                                        {batch.thumbnail ? (
                                            <img src={batch.thumbnail} alt={batch.shell_title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-stone-100 text-4xl">📚</div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-black px-3 py-1.5 rounded-lg shadow-sm">
                                            {batch.status || 'Active'}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-grow flex flex-col">
                                        <h3 className="text-xl font-black text-stone-900 mb-1 leading-tight">{batch.batch_name}</h3>
                                        <p className="text-sm font-bold text-stone-400 mb-6">{batch.shell_title}</p>
                                        
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-center">
                                                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Claimed</p>
                                                <p className="text-lg font-black text-stone-900">{batch.claimed_vouchers} / {batch.total_vouchers}</p>
                                            </div>
                                            <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-center">
                                                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Avg Progress</p>
                                                <p className="text-lg font-black text-blue-600">{batch.avg_progress}%</p>
                                            </div>
                                        </div>

                                        <Link 
                                            href={route('teacher.shells.show', batch.id)} 
                                            className="mt-auto w-full text-center border-2 border-stone-200 hover:border-blue-500 hover:bg-blue-50 text-stone-700 hover:text-blue-700 font-bold py-3 rounded-xl transition-colors"
                                        >
                                            View Analytics
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}