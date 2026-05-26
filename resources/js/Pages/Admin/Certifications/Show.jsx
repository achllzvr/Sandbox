import { Head, router, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

// ── Tiny icon helpers (inline SVG keeps bundle lean) ────────────────────────
const ChevronIcon = ({ open }) => (
    <svg className={`w-5 h-5 text-stone-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const contentTypeIcon = (type) => {
    const map = {
        video:         { bg: 'bg-purple-50',  text: 'text-purple-600', label: '▶ Video' },
        presentation:  { bg: 'bg-orange-50',  text: 'text-orange-600', label: '📄 Presentation' },
        pdf:           { bg: 'bg-red-50',     text: 'text-red-600',    label: '📄 PDF' },
        document:      { bg: 'bg-blue-50',    text: 'text-blue-600',   label: '📝 Doc' },
        youtube_embed: { bg: 'bg-rose-50',    text: 'text-rose-600',   label: '🎥 YouTube' },
        image:         { bg: 'bg-emerald-50', text: 'text-emerald-600', label: '🖼 Image' },
        audio:         { bg: 'bg-amber-50',   text: 'text-amber-600',  label: '🎵 Audio' },
    };
    return map[type?.toLowerCase()] || { bg: 'bg-stone-50', text: 'text-stone-600', label: type || 'File' };
};

// ── Stat pill ───────────────────────────────────────────────────────────────
const StatPill = ({ label, value, color = 'blue' }) => {
    const colors = {
        blue:   'bg-blue-50 text-blue-700',
        violet: 'bg-violet-50 text-violet-700',
        amber:  'bg-amber-50 text-amber-700',
        emerald:'bg-emerald-50 text-emerald-700',
        rose:   'bg-rose-50 text-rose-700',
    };
    return (
        <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl ${colors[color] || colors.blue}`}>
            <span className="text-lg font-bold leading-none">{value ?? 0}</span>
            <span className="text-xs font-medium opacity-80">{label}</span>
        </div>
    );
};

// ── Main page component ─────────────────────────────────────────────────────
export default function Show({ certification }) {
    const [action, setAction] = useState(null); // 'deny' or 'revise'
    const [openLessons, setOpenLessons] = useState({});
    const [openModules, setOpenModules] = useState({});
    const [previewItem, setPreviewItem] = useState(null); // { type, title, file_url, questions }

    const form = useForm({
        status: '',
        decline_reason: '',
        remarks: ''
    });

    const toggleLesson = (id) => setOpenLessons(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleModule = (id) => setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));

    const handleApprove = () => {
        if (confirm('Approve and publish this certification?')) {
            router.put(route('admin.certifications.status.update', certification.id), { status: 'published' });
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (action === 'deny') {
            form.put(route('admin.certifications.status.update', certification.id), {
                onSuccess: () => setAction(null)
            });
        } else if (action === 'revise') {
            form.put(route('admin.certifications.request_revision', certification.id), {
                onSuccess: () => setAction(null)
            });
        }
    };

    const lessons = certification.lessons || [];

    return (
        <AdminLayout pageTitle="Certification Review Detail">
            <Head title={`Review: ${certification.title}`} />
            
            <div className="mb-4">
                <Link href={route('admin.certifications.index')} className="text-blue-600 hover:underline">
                    &larr; Back to Requests
                </Link>
            </div>

            {/* ── Header Card ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900">{certification.title}</h1>
                        <p className="text-stone-500 mt-1">By {certification.creator?.first_name} {certification.creator?.last_name}</p>
                        <div className="flex gap-2 mt-3">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">{certification.category}</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">{certification.difficulty}</span>
                            <span className="px-3 py-1 bg-amber-100 rounded-full text-xs font-bold text-amber-700 uppercase">{certification.status.replace('_', ' ')}</span>
                        </div>
                    </div>
                    
                    {certification.status === 'pending_review' && (
                        <div className="flex gap-3">
                            <button onClick={handleApprove} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm">
                                Approve &amp; Publish
                            </button>
                            <button onClick={() => { setAction('revise'); form.setData('status', 'revision_required'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-sm">
                                Request Revision
                            </button>
                            <button onClick={() => { setAction('deny'); form.setData('status', 'denied'); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm">
                                Deny
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-stone-100">
                    <StatPill label="Final Exam Questions" value={certification.exam_questions_count} color="amber" />
                    <StatPill label="Sandboxes (Modules)" value={certification.module_count} color="rose" />
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-2">Description</h3>
                    <p className="text-stone-700 whitespace-pre-wrap">{certification.description}</p>
                </div>
            </div>

            {/* ── Lessons & Sandboxes ──────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Attached Sandboxes ({certification.module_count})</h3>
                
                {certification.lessons?.length > 0 ? (
                    <div className="space-y-4">
                        {certification.lessons.map(lesson => (
                            <div key={lesson.id} className="border border-stone-200 rounded-xl p-4 flex flex-col">
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleLesson(lesson.id)}>
                                    <div>
                                        <h4 className="font-bold text-stone-900">{lesson.title}</h4>
                                        <p className="text-xs text-stone-500">{lesson.description}</p>
                                    </div>
                                    <ChevronIcon open={openLessons[lesson.id]} />
                                </div>
                                {openLessons[lesson.id] && (
                                    <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col gap-3 pl-4">
                                        {lesson.modules?.length > 0 ? (
                                            lesson.modules.map(module => (
                                                <div key={module.id} className="border border-stone-100 bg-stone-50 p-3 rounded-lg flex flex-col gap-2">
                                                    <div
                                                        className="flex items-center gap-3 cursor-pointer"
                                                        onClick={() => toggleModule(module.id)}
                                                    >
                                                        <div className="w-8 h-8 bg-purple-100 text-purple-600 flex items-center justify-center rounded font-bold text-xs uppercase">
                                                            {module.title.substring(0, 2)}
                                                        </div>
                                                        <div className="flex-grow">
                                                            <h5 className="font-semibold text-sm">{module.title}</h5>
                                                            <p className="text-xs text-stone-500">{module.description}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-md">
                                                                {(module.contents || []).length} files
                                                            </span>
                                                            <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-md">
                                                                {(module.questions || []).length} quiz Qs
                                                            </span>
                                                            <ChevronIcon open={openModules[module.id]} />
                                                        </div>
                                                    </div>

                                                    {/* ── Module Contents (expandable) ── */}
                                                    {openModules[module.id] && (
                                                        <div className="mt-2 pt-2 border-t border-stone-200 space-y-2 pl-4">
                                                            {(module.contents || []).length > 0 ? (
                                                                (module.contents || []).map(content => {
                                                                    const meta = contentTypeIcon(content.content_type);
                                                                    return (
                                                                        <div
                                                                            key={content.id}
                                                                            className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50/80 transition-colors"
                                                                        >
                                                                            <div className="flex items-center gap-2.5 min-w-0 flex-grow">
                                                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${meta.bg} ${meta.text}`}>
                                                                                    {meta.label}
                                                                                </span>
                                                                                <span className="text-sm font-medium text-stone-700 truncate">
                                                                                    {content.title}
                                                                                </span>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setPreviewItem({
                                                                                    type: content.content_type,
                                                                                    title: content.title,
                                                                                    file_url: content.file_url
                                                                                })}
                                                                                className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-xs font-bold transition-all flex-shrink-0"
                                                                            >
                                                                                👁 Preview
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <p className="text-xs text-stone-400 italic">No content files uploaded.</p>
                                                            )}

                                                            {/* Module Quiz Questions */}
                                                            {(module.questions || []).length > 0 && (
                                                                <div className="mt-2 pt-2 border-t border-stone-200">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setPreviewItem({
                                                                            type: 'quiz',
                                                                            title: `${module.title} — Practice Quiz`,
                                                                            questions: module.questions,
                                                                        })}
                                                                        className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-all"
                                                                    >
                                                                        👁 Preview Practice Quiz ({(module.questions || []).length} Qs)
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-stone-400 italic">No sandboxes.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No sandboxes attached.</p>
                )}
            </div>


            {/* ── Final Exam ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">
                <h3 className="text-lg font-bold mb-4 text-stone-900">Final Exam Questions (Sandcastle Exam) ({certification.exam_questions_count})</h3>
                {certification.exam_questions?.length > 0 ? (
                    <div className="space-y-4">
                        {certification.exam_questions.map((q, qi) => (
                            <div key={q.id} className="border border-stone-200 rounded-xl p-4 bg-stone-50/20">
                                <p className="text-sm font-semibold text-stone-850 mb-2">
                                    <span className="text-stone-400 mr-1">Q{qi + 1}.</span> {q.question_text}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                    {(q.answers || []).map((a, ai) => (
                                        <div
                                            key={a.id ?? ai}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                                                a.is_correct
                                                    ? 'bg-emerald-50 text-emerald-750 font-semibold ring-1 ring-emerald-200'
                                                    : 'bg-stone-50/50 text-stone-600'
                                            }`}
                                        >
                                            {a.is_correct ? (
                                                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span className="w-3 h-3 rounded-full border border-stone-300 flex-shrink-0" />
                                            )}
                                            {a.answer_text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-stone-450 text-sm italic">No final exam questions configured.</p>
                )}
            </div>

            {/* ── Content Preview Modal ────────────────────────────────── */}
            {previewItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-stone-100">
                        <div className="px-6 py-4 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                            <h3 className="font-bold text-stone-800 text-sm">Preview: {previewItem.title}</h3>
                            <button onClick={() => setPreviewItem(null)} className="text-stone-400 hover:text-stone-700 font-bold text-lg">✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-grow bg-stone-50 flex items-center justify-center">
                            {previewItem.type === 'youtube_embed' ? (
                                <iframe
                                    src={previewItem.file_url}
                                    className="w-full aspect-video rounded-xl shadow border border-stone-200"
                                    allowFullScreen
                                />
                            ) : previewItem.type === 'video' ? (
                                <video
                                    src={`/storage/${previewItem.file_url}`}
                                    controls
                                    className="w-full rounded-xl shadow border border-stone-200 max-h-[60vh]"
                                />
                            ) : previewItem.type === 'presentation' && previewItem.file_url ? (
                                <iframe
                                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + '/storage/' + previewItem.file_url)}`}
                                    className="w-full h-[500px] rounded-xl shadow border border-stone-200"
                                    frameBorder="0"
                                />
                            ) : previewItem.type === 'document' && previewItem.file_url ? (
                                <iframe
                                    src={`/storage/${previewItem.file_url}`}
                                    className="w-full h-[500px] rounded-xl shadow border border-stone-200"
                                />
                            ) : previewItem.type === 'quiz' ? (
                                <div className="w-full space-y-4 bg-white p-6 rounded-xl border border-stone-200 shadow">
                                    <h4 className="font-bold text-sm text-stone-800 border-b border-stone-100 pb-2">Practice Quiz Questions</h4>
                                    {(previewItem.questions || []).map((q, qIdx) => (
                                        <div key={q.id || qIdx} className="space-y-1.5 pt-2">
                                            <p className="text-sm font-semibold text-stone-800">
                                                Q{qIdx + 1}. {q.question_text}
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                                                {(q.answers || []).map((ans, aIdx) => (
                                                    <div
                                                        key={ans.id || aIdx}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                                                            ans.is_correct
                                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                                                : 'bg-stone-50 border-stone-200 text-stone-600'
                                                        }`}
                                                    >
                                                        {ans.answer_text} {ans.is_correct && '✓'}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <span className="text-4xl">📁</span>
                                    <p className="text-xs font-semibold text-stone-450 mt-2">Preview not available for this file type</p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setPreviewItem(null)}
                                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-xl"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Revise/Deny */}
            {action && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-2 text-stone-900">
                            {action === 'deny' ? 'Deny Certification' : 'Request Revision'}
                        </h2>
                        <p className="text-sm text-stone-500 mb-4">
                            {action === 'deny' 
                                ? 'Provide a reason for denying this certification. This will be shown to the creator.'
                                : 'Explain what the creator needs to change before resubmitting.'}
                        </p>
                        
                        <form onSubmit={submitForm}>
                            {action === 'deny' ? (
                                <textarea
                                    className="w-full rounded-xl border-stone-300 focus:border-red-500 focus:ring-red-500"
                                    rows="4"
                                    required
                                    value={form.data.decline_reason}
                                    onChange={e => form.setData('decline_reason', e.target.value)}
                                    placeholder="Reason for denial..."
                                />
                            ) : (
                                <textarea
                                    className="w-full rounded-xl border-stone-300 focus:border-orange-500 focus:ring-orange-500"
                                    rows="4"
                                    required
                                    value={form.data.remarks}
                                    onChange={e => form.setData('remarks', e.target.value)}
                                    placeholder="Revision remarks..."
                                />
                            )}
                            
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setAction(null)} className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100">
                                    Cancel
                                </button>
                                <button type="submit" disabled={form.processing} className={`px-4 py-2 rounded-lg text-white font-bold ${action === 'deny' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}`}>
                                    {form.processing ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

