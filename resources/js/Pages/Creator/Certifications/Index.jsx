import React from 'react';
import CreatorLayout from '@/Layouts/CreatorLayout';
import { Head, Link } from '@inertiajs/react';

function statusClasses(status) {
    const map = {
        draft:              'bg-slate-100 text-slate-600',
        pending_review:     'bg-amber-100 text-amber-700',
        revision_required:  'bg-orange-100 text-orange-700',
        published:          'bg-emerald-100 text-emerald-700',
        approved:           'bg-blue-100 text-blue-700',
        denied:             'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-slate-100 text-slate-600';
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Index({ certifications }) {
    return (
        <CreatorLayout pageTitle="My Shells">
            <Head title="My Shells" />

            <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    {certifications.length} shell{certifications.length !== 1 ? 's' : ''} total
                </p>
                <Link
                    href={route('creator.certifications.create')}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create New Shell
                </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certifications.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-violet-50 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-900">No shells yet</h3>
                        <p className="text-sm text-slate-400 mt-1">Create your first certification shell to get started.</p>
                        <Link
                            href={route('creator.certifications.create')}
                            className="mt-4 inline-flex text-sm font-semibold text-violet-600 hover:text-violet-800"
                        >
                            Create your first shell →
                        </Link>
                    </div>
                ) : (
                    certifications.map((cert) => (
                        <Link
                            key={cert.id}
                            href={route('creator.certifications.edit', cert.id)}
                            className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <h4 className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors truncate flex-1 pr-2">
                                    {cert.title}
                                </h4>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize whitespace-nowrap ${statusClasses(cert.status)}`}>
                                    {cert.status?.replace(/_/g, ' ')}
                                </span>
                            </div>
                            {cert.description && (
                                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{cert.description}</p>
                            )}
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                                <span className="text-xs text-slate-400">{formatDate(cert.created_at)}</span>
                                {cert.price && (
                                    <span className="text-sm font-bold text-slate-700">₱{parseFloat(cert.price).toLocaleString()}</span>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </CreatorLayout>
    );
}

