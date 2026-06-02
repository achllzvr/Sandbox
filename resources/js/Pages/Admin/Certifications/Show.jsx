/**
 * Admin Certification Review (detail)
 *
 * WIRED (backend + database):
 * - Certification detail, lessons, modules, contents, exam questions → CertificationApprovalController@show
 * - Approve & publish / Deny / Request revision → status update + request_revision endpoints
 *
 * TODO (backend + database):
 * - Content preview for some file types may fail without storage:link or CDN URLs
 * - Office presentation embed depends on public URL reachability
 */
import { Head, router, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/Admin/AdminBadge';
import AdminModal from '@/Components/Admin/AdminModal';
import ModuleContentPreview from '@/Components/ModuleContentPreview';
import { useState } from 'react';

const ChevronIcon = ({ open }) => (
    <svg
        className={`admin-accordion__chevron ${open ? 'admin-accordion__chevron--open' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const contentTypeLabel = (type) => {
    const map = {
        video: '▶ Video',
        presentation: '📄 Presentation',
        pdf: '📄 PDF',
        document: '📝 Doc',
        youtube_embed: '🎥 YouTube',
        image: '🖼 Image',
        audio: '🎵 Audio',
    };
    return map[type?.toLowerCase()] || type || 'File';
};

const StatPill = ({ label, value }) => (
    <div className="admin-stat-pill">
        <span className="admin-stat-pill__value">{value ?? 0}</span>
        <span className="admin-stat-pill__label">{label}</span>
    </div>
);

export default function Show({ certification }) {
    const [action, setAction] = useState(null);
    const [openLessons, setOpenLessons] = useState({});
    const [openModules, setOpenModules] = useState({});
    const [previewItem, setPreviewItem] = useState(null);

    const form = useForm({
        status: '',
        decline_reason: '',
        remarks: '',
    });

    const toggleLesson = (id) => setOpenLessons((prev) => ({ ...prev, [id]: !prev[id] }));
    const toggleModule = (id) => setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));

    const handleApprove = () => {
        if (confirm('Approve and publish this certification?')) {
            router.put(route('admin.certifications.status.update', certification.id), {
                status: 'published',
            });
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (action === 'deny') {
            form.put(route('admin.certifications.status.update', certification.id), {
                onSuccess: () => setAction(null),
            });
        } else if (action === 'revise') {
            form.put(route('admin.certifications.request_revision', certification.id), {
                onSuccess: () => setAction(null),
            });
        }
    };

    return (
        <AdminLayout pageTitle="Certification Review">
            <Head title={`Review: ${certification.title}`} />

            <Link href={route('admin.certifications.index')} className="admin-back-link">
                ← Back to certifications
            </Link>

            <div className="admin-card" style={{ marginBottom: '24px' }}>
                <div className="admin-card__body">
                    <div className="admin-detail-header">
                        <div>
                            <h1>{certification.title}</h1>
                            <p className="admin-table__muted" style={{ marginTop: '6px' }}>
                                By {certification.creator?.first_name}{' '}
                                {certification.creator?.last_name}
                            </p>
                            <div className="admin-tag-row">
                                <span className="admin-tag">{certification.category}</span>
                                <span className="admin-tag">{certification.difficulty}</span>
                                <AdminBadge value={certification.status} />
                            </div>
                        </div>

                        {/* Approval actions — wired to backend */}
                        {certification.status === 'pending_review' && (
                            <div className="admin-btn-group">
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    className="admin-btn admin-btn--success"
                                >
                                    Approve & Publish
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAction('revise');
                                        form.setData('status', 'revision_required');
                                    }}
                                    className="admin-btn admin-btn--warning"
                                >
                                    Request Revision
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAction('deny');
                                        form.setData('status', 'denied');
                                    }}
                                    className="admin-btn admin-btn--danger"
                                >
                                    Deny
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="admin-stat-pills">
                        <StatPill
                            label="Final Exam Questions"
                            value={certification.exam_questions_count}
                        />
                        <StatPill label="Sandboxes (Modules)" value={certification.module_count} />
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <h3
                            style={{
                                fontFamily: 'var(--font-heading)',
                                marginBottom: '8px',
                            }}
                        >
                            Description
                        </h3>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{certification.description}</p>
                    </div>
                </div>
            </div>

            <div className="admin-card" style={{ marginBottom: '24px' }}>
                <div className="admin-card__header">
                    <h3>Attached Sandboxes ({certification.module_count})</h3>
                </div>
                <div className="admin-card__body">
                    {certification.lessons?.length > 0 ? (
                        certification.lessons.map((lesson) => (
                            <div key={lesson.id} className="admin-accordion">
                                <div
                                    className="admin-accordion__head"
                                    onClick={() => toggleLesson(lesson.id)}
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && toggleLesson(lesson.id)
                                    }
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div>
                                        <h4>{lesson.title}</h4>
                                        <p className="admin-table__muted" style={{ fontSize: '0.75rem' }}>
                                            {lesson.description}
                                        </p>
                                    </div>
                                    <ChevronIcon open={openLessons[lesson.id]} />
                                </div>
                                {openLessons[lesson.id] && (
                                    <div className="admin-accordion__body">
                                        {lesson.modules?.length > 0 ? (
                                            lesson.modules.map((module) => (
                                                <div key={module.id} className="admin-module">
                                                    <div
                                                        className="admin-module__head"
                                                        onClick={() => toggleModule(module.id)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) =>
                                                            e.key === 'Enter' &&
                                                            toggleModule(module.id)
                                                        }
                                                    >
                                                        <span className="admin-module__avatar">
                                                            {module.title.substring(0, 2)}
                                                        </span>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <h5
                                                                style={{
                                                                    fontWeight: 700,
                                                                    fontSize: '0.875rem',
                                                                }}
                                                            >
                                                                {module.title}
                                                            </h5>
                                                            <p
                                                                className="admin-table__muted"
                                                                style={{ fontSize: '0.75rem' }}
                                                            >
                                                                {module.description}
                                                            </p>
                                                        </div>
                                                        <span className="admin-tag">
                                                            {(module.contents || []).length} files
                                                        </span>
                                                        <span className="admin-tag">
                                                            {(module.questions || []).length} quiz Qs
                                                        </span>
                                                        <ChevronIcon open={openModules[module.id]} />
                                                    </div>

                                                    {openModules[module.id] && (
                                                        <div style={{ marginTop: '10px' }}>
                                                            {(module.contents || []).length > 0 ? (
                                                                (module.contents || []).map((content) => (
                                                                    <div
                                                                        key={content.id}
                                                                        className="admin-content-row"
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: '8px',
                                                                                minWidth: 0,
                                                                                flex: 1,
                                                                            }}
                                                                        >
                                                                            <span className="admin-type-chip">
                                                                                {contentTypeLabel(
                                                                                    content.content_type,
                                                                                )}
                                                                            </span>
                                                                            <span
                                                                                style={{
                                                                                    fontWeight: 600,
                                                                                    fontSize: '0.875rem',
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                }}
                                                                            >
                                                                                {content.title}
                                                                            </span>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setPreviewItem({
                                                                                    type: content.content_type,
                                                                                    title: content.title,
                                                                                    file_url: content.file_url,
                                                                                })
                                                                            }
                                                                            className="admin-btn admin-btn--sm admin-btn--secondary"
                                                                        >
                                                                            Preview
                                                                        </button>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p
                                                                    className="admin-table__muted"
                                                                    style={{
                                                                        fontSize: '0.75rem',
                                                                        fontStyle: 'italic',
                                                                    }}
                                                                >
                                                                    No content files uploaded.
                                                                </p>
                                                            )}

                                                            {(module.questions || []).length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setPreviewItem({
                                                                            type: 'quiz',
                                                                            title: `${module.title} — Practice Quiz`,
                                                                            questions: module.questions,
                                                                        })
                                                                    }
                                                                    className="admin-btn admin-btn--sm admin-btn--secondary"
                                                                    style={{ marginTop: '10px' }}
                                                                >
                                                                    Preview Practice Quiz (
                                                                    {(module.questions || []).length} Qs)
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p
                                                className="admin-table__muted"
                                                style={{ fontSize: '0.75rem', fontStyle: 'italic' }}
                                            >
                                                No sandboxes.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="admin-table__muted" style={{ fontStyle: 'italic' }}>
                            No sandboxes attached.
                        </p>
                    )}
                </div>
            </div>

            <div className="admin-card" style={{ marginBottom: '24px' }}>
                <div className="admin-card__header">
                    <h3>
                        Final Exam Questions ({certification.exam_questions_count})
                    </h3>
                </div>
                <div className="admin-card__body">
                    {certification.exam_questions?.length > 0 ? (
                        certification.exam_questions.map((q, qi) => (
                            <div key={q.id} className="admin-exam-q">
                                <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '8px' }}>
                                    <span className="admin-table__muted">Q{qi + 1}. </span>
                                    {q.question_text}
                                </p>
                                <div className="admin-answer-grid">
                                    {(q.answers || []).map((a, ai) => (
                                        <div
                                            key={a.id ?? ai}
                                            className={`admin-answer ${a.is_correct ? 'admin-answer--correct' : ''}`}
                                        >
                                            {a.is_correct && '✓ '}
                                            {a.answer_text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="admin-table__muted" style={{ fontStyle: 'italic' }}>
                            No final exam questions configured.
                        </p>
                    )}
                </div>
            </div>

            <AdminModal
                show={!!previewItem}
                onClose={() => setPreviewItem(null)}
                title={previewItem ? `Preview: ${previewItem.title}` : ''}
                size="xl"
                footer={
                    <button
                        type="button"
                        onClick={() => setPreviewItem(null)}
                        className="admin-btn admin-btn--secondary"
                    >
                        Close Preview
                    </button>
                }
            >
                <div className="admin-modal__body--preview">
                    <ModuleContentPreview item={previewItem} />
                </div>
            </AdminModal>

            <AdminModal
                show={!!action}
                onClose={() => setAction(null)}
                title={action === 'deny' ? 'Deny Certification' : 'Request Revision'}
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setAction(null)}
                            className="admin-btn admin-btn--ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="cert-action-form"
                            disabled={form.processing}
                            className={`admin-btn ${action === 'deny' ? 'admin-btn--danger' : 'admin-btn--warning'}`}
                        >
                            {form.processing ? 'Submitting...' : 'Submit'}
                        </button>
                    </>
                }
            >
                <p className="admin-table__muted" style={{ marginBottom: '16px' }}>
                    {action === 'deny'
                        ? 'Provide a reason for denying this certification. This will be shown to the creator.'
                        : 'Explain what the creator needs to change before resubmitting.'}
                </p>
                <form id="cert-action-form" onSubmit={submitForm}>
                    {action === 'deny' ? (
                        <textarea
                            className="input-field"
                            rows={4}
                            required
                            value={form.data.decline_reason}
                            onChange={(e) => form.setData('decline_reason', e.target.value)}
                            placeholder="Reason for denial..."
                        />
                    ) : (
                        <textarea
                            className="input-field"
                            rows={4}
                            required
                            value={form.data.remarks}
                            onChange={(e) => form.setData('remarks', e.target.value)}
                            placeholder="Revision remarks..."
                        />
                    )}
                </form>
            </AdminModal>
        </AdminLayout>
    );
}
