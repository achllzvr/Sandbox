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
        video:    { bg: 'bg-purple-50',  text: 'text-purple-600', label: '▶ Video' },
        pdf:      { bg: 'bg-red-50',     text: 'text-red-600',    label: '📄 PDF' },
        document: { bg: 'bg-blue-50',    text: 'text-blue-600',   label: '📝 Doc' },
        image:    { bg: 'bg-emerald-50', text: 'text-emerald-600', label: '🖼 Image' },
        audio:    { bg: 'bg-amber-50',   text: 'text-amber-600',  label: '🎵 Audio' },
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

                {/* ── Stats row ───────────────────────────────────────── */}
                <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-stone-100">
                    <StatPill label="Lessons"   value={certification.lessons_count}            color="blue" />
                    <StatPill label="Modules"   value={certification.modules_count}            color="violet" />
                    <StatPill label="Contents"  value={certification.contents_count}           color="emerald" />
                    <StatPill label="Questions"  value={certification.questions_count}          color="amber" />
                    <StatPill label="Materials"  value={certification.learning_materials_count} color="rose" />
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-2">Description</h3>
                    <p className="text-stone-700 whitespace-pre-wrap">{certification.description}</p>
                </div>
            </div>

            {/* ── Learning Materials ──────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Attached Learning Materials ({certification.learning_materials_count})</h3>
                
                {certification.learning_materials?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {certification.learning_materials.map(mat => (
                            <div key={mat.id} className="border border-stone-200 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg font-bold text-xs uppercase">
                                        {mat.type === 'youtube_video' ? 'YT' : mat.type}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{mat.title}</h4>
                                        <p className="text-xs text-gray-500">{mat.description}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col gap-3">
                                    {/* Preview Box */}
                                    <div className="bg-stone-50 rounded-lg border border-stone-200 overflow-hidden relative">
                                        {mat.type === 'youtube_video' ? (
                                            <iframe src={mat.youtube_embed_url} className="w-full aspect-video" title="Preview" />
                                        ) : mat.file_path && mat.file_path.endsWith('.pdf') ? (
                                            <iframe src={`/storage/${mat.file_path}`} className="w-full h-48" title="PDF Preview" />
                                        ) : mat.file_path && (mat.file_path.endsWith('.jpg') || mat.file_path.endsWith('.png')) ? (
                                            <img src={`/storage/${mat.file_path}`} className="w-full object-cover max-h-48" alt="Preview" />
                                        ) : (
                                            <div className="w-full h-32 flex items-center justify-center flex-col text-stone-400">
                                                <span className="text-3xl mb-2">📁</span>
                                                <span className="text-xs font-semibold">Preview not available for this file type</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {mat.type === 'youtube_video' ? (
                                            <a href={mat.youtube_embed_url} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors">
                                                Open Video ↗
                                            </a>
                                        ) : (
                                            <>
                                                <a href={`/storage/${mat.file_path}`} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-lg text-sm font-bold transition-colors">
                                                    View File ↗
                                                </a>
                                                <a href={`/storage/${mat.file_path}`} download className="flex-1 text-center py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors">
                                                    Download ↓
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No materials attached.</p>
                )}
            </div>

            {/* ── Course Structure ────────────────────────────────────── */}
            {lessons.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">Course Structure</h3>

                    <div className="space-y-4">
                        {lessons.map((lesson, li) => {
                            const isLessonOpen = !!openLessons[lesson.id];
                            return (
                                <div key={lesson.id} className="border border-stone-200 rounded-2xl overflow-hidden">
                                    {/* Lesson header */}
                                    <button
                                        type="button"
                                        onClick={() => toggleLesson(lesson.id)}
                                        className="w-full flex items-center justify-between px-5 py-4 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                                                {li + 1}
                                            </span>
                                            <div>
                                                <span className="font-semibold text-stone-900">{lesson.title}</span>
                                                <span className="ml-2 text-xs text-stone-400">
                                                    {lesson.modules?.length || 0} module{(lesson.modules?.length || 0) !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronIcon open={isLessonOpen} />
                                    </button>

                                    {/* Lesson body */}
                                    {isLessonOpen && (
                                        <div className="px-5 py-4 space-y-3 bg-white">
                                            {lesson.description && (
                                                <p className="text-sm text-stone-500 italic mb-2">{lesson.description}</p>
                                            )}

                                            {(lesson.modules || []).map((mod, mi) => {
                                                const isModOpen = !!openModules[mod.id];
                                                const contents  = mod.contents  || [];
                                                const questions = mod.questions || [];

                                                return (
                                                    <div key={mod.id} className="border border-stone-200 rounded-xl overflow-hidden">
                                                        {/* Module header */}
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleModule(mod.id)}
                                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors text-left"
                                                        >
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">
                                                                    {mi + 1}
                                                                </span>
                                                                <span className="font-medium text-stone-800 text-sm">{mod.title}</span>
                                                                <span className="text-xs text-stone-400">
                                                                    {contents.length} content{contents.length !== 1 ? 's' : ''} · {questions.length} question{questions.length !== 1 ? 's' : ''}
                                                                </span>
                                                            </div>
                                                            <ChevronIcon open={isModOpen} />
                                                        </button>

                                                        {/* Module body */}
                                                        {isModOpen && (
                                                            <div className="px-4 pb-4 space-y-4">
                                                                {/* Contents */}
                                                                {contents.length > 0 && (
                                                                    <div>
                                                                        <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 mt-1">Content Files</h5>
                                                                        <div className="space-y-2">
                                                                            {contents.map(c => {
                                                                                const icon = contentTypeIcon(c.content_type);
                                                                                return (
                                                                                    <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-stone-100 bg-stone-50/50">
                                                                                        <span className={`flex-shrink-0 px-2 py-1 rounded-md text-xs font-semibold ${icon.bg} ${icon.text}`}>
                                                                                            {icon.label}
                                                                                        </span>
                                                                                        <span className="text-sm text-stone-700 font-medium truncate">{c.title}</span>
                                                                                        {c.file_url && (
                                                                                            <a href={c.file_url} target="_blank" rel="noreferrer" className="ml-auto text-blue-600 text-xs font-bold hover:underline flex-shrink-0">
                                                                                                Open ↗
                                                                                            </a>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Questions */}
                                                                {questions.length > 0 && (
                                                                    <div>
                                                                        <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Questions</h5>
                                                                        <div className="space-y-3">
                                                                            {questions.map((q, qi) => (
                                                                                <div key={q.id} className="rounded-lg border border-stone-100 p-3">
                                                                                    <p className="text-sm font-semibold text-stone-800 mb-2">
                                                                                        <span className="text-stone-400 mr-1">Q{qi + 1}.</span> {q.question ?? q.question_text}
                                                                                    </p>
                                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                                                        {(q.answers || []).map((a, ai) => (
                                                                                            <div
                                                                                                key={a.id ?? ai}
                                                                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                                                                                                    a.is_correct
                                                                                                        ? 'bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-200'
                                                                                                        : 'bg-stone-50 text-stone-600'
                                                                                                }`}
                                                                                            >
                                                                                                {a.is_correct ? (
                                                                                                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                                                    </svg>
                                                                                                ) : (
                                                                                                    <span className="w-4 h-4 rounded-full border-2 border-stone-300 flex-shrink-0" />
                                                                                                )}
                                                                                                {a.answer_text}
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {contents.length === 0 && questions.length === 0 && (
                                                                    <p className="text-sm text-stone-400 italic py-2">This module has no content or questions yet.</p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {(!lesson.modules || lesson.modules.length === 0) && (
                                                <p className="text-sm text-stone-400 italic">No modules in this lesson.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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
