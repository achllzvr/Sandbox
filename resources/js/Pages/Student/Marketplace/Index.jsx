import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ certifications }) {
    const { auth, flash } = usePage().props;

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    }

    function formatPrice(price) {
        const num = parseFloat(price);
        return num === 0 ? 'Free' : `₱${num.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Marketplace</h2>
                    <p className="text-sm text-stone-500 mt-1">Browse available Shells and start your certification journey.</p>
                </div>
            }
        >
            <Head title="Marketplace" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Success flash */}
                {flash?.success && (
                    <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 font-medium">
                        {flash.success}
                    </div>
                )}

                {/* Empty state */}
                {certifications.data.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-5xl mb-4">🐚</div>
                        <h3 className="text-xl font-bold text-stone-700">No Shells available yet</h3>
                        <p className="text-stone-400 mt-2 text-sm max-w-sm mx-auto">
                            Check back soon — new certifications are published regularly.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {certifications.data.map((cert) => (
                                <div
                                    key={cert.id}
                                    className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                                >
                                    {/* Card header accent */}
                                    <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-500" />

                                    <div className="p-6 flex flex-col flex-grow">
                                        {/* Title & Badge */}
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-bold text-lg text-stone-900 leading-snug line-clamp-2">
                                                {cert.title}
                                            </h3>
                                            {(cert.status === 'approved' || cert.status === 'published') && (
                                                <span title="Verified Certification" className="flex-shrink-0 bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-1 rounded-md border border-blue-200">
                                                    ✓ Verified
                                                </span>
                                            )}
                                        </div>

                                        {/* Creator + Date */}
                                        <p className="text-xs text-stone-400 mt-1.5">
                                            by{' '}
                                            <span className="text-stone-600 font-medium">
                                                {cert.creator
                                                    ? `${cert.creator.first_name} ${cert.creator.last_name}`
                                                    : 'Unknown'}
                                            </span>
                                            {' · '}
                                            {formatDate(cert.created_at)}
                                        </p>

                                        {/* Description */}
                                        <p className="text-sm text-stone-500 mt-3 line-clamp-3 flex-grow">
                                            {cert.description || 'No description provided.'}
                                        </p>

                                        {/* Meta pills */}
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
                                                💰 {formatPrice(cert.price)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-xs font-semibold px-3 py-1 rounded-full">
                                                🎯 {cert.pass_threshold}% to pass
                                            </span>
                                        </div>

                                        {/* Action button */}
                                        <button
                                            className="mt-5 w-full text-center bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                                        >
                                            View Shell
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {certifications.last_page > 1 && (
                            <nav className="mt-10 flex justify-center gap-2">
                                {certifications.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                            link.active
                                                ? 'bg-amber-500 text-white font-bold'
                                                : link.url
                                                    ? 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                                    : 'text-stone-300 cursor-not-allowed'
                                        }`}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        )}
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
