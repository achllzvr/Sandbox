import React, { useState } from 'react';
import CreatorLayout from '@/Layouts/CreatorLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';

const TYPE_META = {
    ppt:           { icon: '📄', label: 'PPT' },
    document:      { icon: '📋', label: 'DOC' },
    youtube_video: { icon: '🎬', label: 'YouTube' },
};

const STATUS_STYLE = {
    draft:              { border: 'border-emerald-400', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    revision_required:  { border: 'border-amber-400',   bg: 'bg-amber-50',   badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
    denied:             { border: 'border-red-400',      bg: 'bg-red-50',     badge: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
    pending:            { border: 'border-sky-400',      bg: 'bg-sky-50',     badge: 'bg-sky-100 text-sky-700',       dot: 'bg-sky-500' },
    approved:           { border: 'border-violet-400',   bg: 'bg-violet-50',  badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
};

export default function Edit({ certification }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        type: 'ppt',
        file: null,
        youtube_embed_url: '',
        description: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitMaterial = (e) => {
        e.preventDefault();
        post(route('creator.certifications.materials.store', certification.id), {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    };

    const removeMaterial = (materialId) => {
        if(confirm('Remove this material?')) {
            router.delete(route('creator.certifications.materials.destroy', [certification.id, materialId]), {
                preserveScroll: true
            });
        }
    };

    const submitForReview = () => {
        if(confirm('Submit this certification for Admin review? You cannot edit it while it is pending.')) {
            setIsSubmitting(true);
            router.post(route('creator.certifications.submit', certification.id), {}, {
                onFinish: () => setIsSubmitting(false)
            });
        }
    };

    const isEditable = ['draft', 'revision_required'].includes(certification.status);
    const ss = STATUS_STYLE[certification.status] || STATUS_STYLE.draft;

    return (
        <CreatorLayout pageTitle={`Edit: ${certification.title}`}>
            <Head title={`Edit ${certification.title}`} />

            <div className="space-y-6">
                {/* ── Status Banner ─────────────────────────── */}
                <div className={`rounded-2xl border-l-4 ${ss.border} bg-white shadow-sm shadow-slate-200/60 p-6`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{certification.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-stone-500">
                                <span>Status</span>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${ss.badge}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                                    {certification.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                </span>
                            </div>
                        </div>

                        {isEditable && (
                            <button
                                onClick={submitForReview}
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/30 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Submitting…
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Submit for Review
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Revision remarks */}
                    {certification.status === 'revision_required' && certification.remarks && (
                        <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200/80 p-4">
                            <p className="text-sm font-semibold text-amber-800 flex items-center gap-1.5">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                Admin Remarks for Revision
                            </p>
                            <p className="text-sm text-amber-700 mt-1.5 leading-relaxed">{certification.remarks}</p>
                        </div>
                    )}

                    {/* Denial reason */}
                    {certification.status === 'denied' && certification.decline_reason && (
                        <div className="mt-5 rounded-xl bg-red-50 border border-red-200/80 p-4">
                            <p className="text-sm font-semibold text-red-800 flex items-center gap-1.5">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                Reason for Denial
                            </p>
                            <p className="text-sm text-red-700 mt-1.5 leading-relaxed">{certification.decline_reason}</p>
                        </div>
                    )}
                </div>

                {/* ── Learning Materials Grid ──────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* List of Materials */}
                    <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/60 shadow-sm shadow-slate-200/60 p-6">
                        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            Attached Learning Materials
                        </h3>

                        {certification.learning_materials && certification.learning_materials.length > 0 ? (
                            <div className="space-y-3">
                                {certification.learning_materials.map((mat) => {
                                    const meta = TYPE_META[mat.type] || TYPE_META.document;
                                    return (
                                        <div key={mat.id} className="group flex items-start justify-between p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-200">
                                            <div className="flex items-start gap-3.5 min-w-0">
                                                <span className="text-2xl flex-shrink-0" title={meta.label}>{meta.icon}</span>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-slate-800">{mat.title}</h4>
                                                    <p className="text-xs text-slate-500 line-clamp-1 mb-2">{mat.description}</p>
                                                    
                                                    {/* Preview Box for Creator */}
                                                    <div className="mt-2 w-full max-w-sm rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                                                        {mat.type === 'youtube_video' ? (
                                                            <iframe src={mat.youtube_embed_url} className="w-full aspect-video" title="Preview" />
                                                        ) : mat.file_path && mat.file_path.endsWith('.pdf') ? (
                                                            <iframe src={`/storage/${mat.file_path}`} className="w-full h-32" title="PDF Preview" />
                                                        ) : mat.file_path && (mat.file_path.endsWith('.jpg') || mat.file_path.endsWith('.png')) ? (
                                                            <img src={`/storage/${mat.file_path}`} className="w-full object-cover max-h-32" alt="Preview" />
                                                        ) : (
                                                            <div className="w-full py-4 flex items-center justify-center flex-col text-slate-400">
                                                                <span className="text-2xl mb-1">📁</span>
                                                                <span className="text-[10px] font-semibold uppercase tracking-wider">No Inline Preview</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex gap-3 mt-3">
                                                        {mat.type === 'youtube_video' ? (
                                                            <a href={mat.youtube_embed_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-violet-600 hover:text-violet-800">
                                                                Open Video ↗
                                                            </a>
                                                        ) : (
                                                            <>
                                                                <a href={`/storage/${mat.file_path}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-600 hover:text-slate-900">
                                                                    View File ↗
                                                                </a>
                                                                <a href={`/storage/${mat.file_path}`} download className="text-xs font-bold text-violet-600 hover:text-violet-800">
                                                                    Download ↓
                                                                </a>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                                                    {meta.label}
                                                </span>
                                                {isEditable && (
                                                    <button
                                                        onClick={() => removeMaterial(mat.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                                        title="Remove material"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                                    <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <p className="text-sm text-stone-400">No materials attached yet.</p>
                                <p className="text-xs text-stone-300 mt-0.5">Attach at least one material to submit for review.</p>
                            </div>
                        )}
                    </div>

                    {/* Add Material Form */}
                    {isEditable && (
                        <div className="rounded-2xl bg-white border border-slate-200/60 shadow-sm shadow-slate-200/60 p-6 h-fit">
                            <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Add New Material
                            </h3>

                            <form onSubmit={submitMaterial} className="space-y-4">
                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Material Type</label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 text-sm text-slate-800 shadow-sm focus:border-violet-400 focus:ring-violet-400 transition-colors"
                                    >
                                        <option value="ppt">📄  PowerPoint (PPT/PPTX)</option>
                                        <option value="document">📋  Document (PDF/DOC)</option>
                                        <option value="youtube_video">🎬  YouTube Embed Video</option>
                                    </select>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 text-sm text-slate-800 shadow-sm focus:border-violet-400 focus:ring-violet-400 transition-colors"
                                        placeholder="e.g. Module 1 – Introduction"
                                        required
                                    />
                                    {errors.title && (
                                        <div className="mt-1.5 rounded-lg bg-red-50 border border-red-100 px-3 py-1.5 text-xs text-red-600 font-medium">{errors.title}</div>
                                    )}
                                </div>

                                {/* URL or File */}
                                {data.type === 'youtube_video' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-stone-600 mb-1">YouTube Embed URL</label>
                                        <input
                                            type="url"
                                            value={data.youtube_embed_url}
                                            onChange={e => setData('youtube_embed_url', e.target.value)}
                                            placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                            className="block w-full rounded-xl border-slate-200 bg-slate-50/50 text-sm text-slate-800 shadow-sm focus:border-violet-400 focus:ring-violet-400 transition-colors"
                                            required
                                        />
                                        {errors.youtube_embed_url && (
                                            <div className="mt-1.5 rounded-lg bg-red-50 border border-red-100 px-3 py-1.5 text-xs text-red-600 font-medium">{errors.youtube_embed_url}</div>
                                        )}
                                        <p className="text-[11px] text-stone-400 mt-1.5">Must be an embed-format URL.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-stone-600 mb-1">File Upload</label>
                                        <input
                                            type="file"
                                            onChange={e => setData('file', e.target.files[0])}
                                            className="block w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-600 hover:file:bg-violet-100 file:cursor-pointer file:transition-colors"
                                            required
                                        />
                                        {errors.file && (
                                            <div className="mt-1.5 rounded-lg bg-red-50 border border-red-100 px-3 py-1.5 text-xs text-red-600 font-medium">{errors.file}</div>
                                        )}
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Short Description</label>
                                    <textarea
                                        rows="2"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 text-sm text-slate-800 shadow-sm focus:border-violet-400 focus:ring-violet-400 transition-colors resize-none"
                                        placeholder="Optional – briefly describe this material"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/30 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                            </svg>
                                            Uploading…
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            Attach Material
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </CreatorLayout>
    );
}
