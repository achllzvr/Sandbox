import { router } from '@inertiajs/react';
import { useState } from 'react';
import AdminModal from '@/Components/Admin/AdminModal';
import CreatorQuestionFields from '@/Components/Creator/CreatorQuestionFields';
import { showAppToastError, showAppToastSuccess } from '@/Utils/appToast';

export default function CreatorShellEditorExtras({
    certification,
    isEditable,
    shellSettingsForm,
}) {
    function saveBadgeSettings() {
        router.put(route('creator.certifications.update', certification.id), {
            badge_type: shellSettingsForm.data.badge_type,
            badge_label: shellSettingsForm.data.badge_type === 'custom' ? shellSettingsForm.data.badge_label : null,
            show_verified_icon: shellSettingsForm.data.show_verified_icon,
        }, { preserveScroll: true });
    }

    const lessons = [...(certification.lessons || [])].sort(
        (a, b) => (a.order_index || 0) - (b.order_index || 0),
    );
    const [newUnitTitle, setNewUnitTitle] = useState('');
    const [editingLessonId, setEditingLessonId] = useState(null);
    const [editingLessonTitle, setEditingLessonTitle] = useState('');
    const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
    const [diagnosticQuestions, setDiagnosticQuestions] = useState(
        (certification.diagnostic_questions || []).map((question) => ({
            question_text: question.question_text,
            answers: (question.answers || []).map((answer) => ({
                answer_text: answer.answer_text,
                is_correct: !!answer.is_correct,
            })),
        })),
    );

    function addUnit(e) {
        e.preventDefault();
        if (!newUnitTitle.trim()) {
            return;
        }

        router.post(
            route('creator.lessons.store', certification.id),
            { title: newUnitTitle.trim() },
            {
                preserveScroll: true,
                onSuccess: () => setNewUnitTitle(''),
            },
        );
    }

    function saveLessonTitle(lessonId) {
        router.put(
            route('creator.lessons.update', lessonId),
            { title: editingLessonTitle.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingLessonId(null);
                    setEditingLessonTitle('');
                },
            },
        );
    }

    function saveDiagnosticQuestions() {
        if (diagnosticQuestions.length < 1) {
            showAppToastError('Add at least one quick test question.');
            return;
        }

        router.post(
            route('creator.certifications.diagnostic-questions.store', certification.id),
            { questions: diagnosticQuestions },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDiagnosticModal(false);
                    showAppToastSuccess('Quick Test questions saved.');
                },
                onError: () => showAppToastError('Could not save quick test questions.'),
            },
        );
    }

    return (
        <>
            {isEditable ? (
                <div className="admin-card admin-card--chunky" style={{ marginBottom: '20px' }}>
                    <div className="admin-card__header">
                        <h3>Badge settings</h3>
                    </div>
                    <div className="admin-card__body">
                        <label className="admin-field">
                            <span className="admin-field__label">Badge type</span>
                            <select
                                className="input-field"
                                value={shellSettingsForm.data.badge_type}
                                onChange={(e) => shellSettingsForm.setData('badge_type', e.target.value)}
                            >
                                <option value="professional_certificate">Professional Certificate</option>
                                <option value="custom">Custom</option>
                            </select>
                        </label>

                        {shellSettingsForm.data.badge_type === 'custom' ? (
                            <>
                                <label className="admin-field">
                                    <span className="admin-field__label">Custom badge label</span>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={shellSettingsForm.data.badge_label}
                                        onChange={(e) => shellSettingsForm.setData('badge_label', e.target.value)}
                                        placeholder="e.g. GitHub Verified Certificate"
                                    />
                                </label>
                                <label className="admin-field" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={shellSettingsForm.data.show_verified_icon}
                                        onChange={(e) => shellSettingsForm.setData('show_verified_icon', e.target.checked)}
                                    />
                                    <span className="admin-field__label" style={{ margin: 0 }}>Show verified icon on shop and shell map</span>
                                </label>
                            </>
                        ) : null}

                        <button type="button" className="admin-btn admin-btn--secondary" onClick={saveBadgeSettings}>
                            Save badge settings
                        </button>
                    </div>
                </div>
            ) : null}

            <div className="admin-card admin-card--chunky" style={{ marginBottom: '20px' }}>
                <div className="admin-card__header">
                    <h3>Shell units</h3>
                </div>
                <div className="admin-card__body">
                    <p className="admin-field__hint" style={{ marginBottom: '12px' }}>
                        Unit titles appear as horizontal dividers on the student shell map.
                    </p>
                    {lessons.map((lesson) => (
                        <div key={lesson.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                            {editingLessonId === lesson.id ? (
                                <>
                                    <input
                                        className="input-field"
                                        value={editingLessonTitle}
                                        onChange={(e) => setEditingLessonTitle(e.target.value)}
                                    />
                                    <button type="button" className="admin-btn admin-btn--primary" onClick={() => saveLessonTitle(lesson.id)}>
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <strong style={{ flex: 1 }}>{lesson.title}</strong>
                                    {isEditable ? (
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn--secondary"
                                            onClick={() => {
                                                setEditingLessonId(lesson.id);
                                                setEditingLessonTitle(lesson.title);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    ) : null}
                                </>
                            )}
                        </div>
                    ))}
                    {isEditable ? (
                        <form onSubmit={addUnit} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <input
                                className="input-field"
                                value={newUnitTitle}
                                onChange={(e) => setNewUnitTitle(e.target.value)}
                                placeholder="New unit title (e.g. UNIT 2 — CORE SKILLS)"
                            />
                            <button type="submit" className="admin-btn admin-btn--primary">Add unit</button>
                        </form>
                    ) : null}
                </div>
            </div>

            <div className="admin-card admin-card--chunky" style={{ marginBottom: '20px' }}>
                <div className="admin-card__header">
                    <h3>Quick Test</h3>
                </div>
                <div className="admin-card__body">
                    <p className="admin-field__hint" style={{ marginBottom: '12px' }}>
                        Shop visitors can try up to five diagnostic questions before enrolling.
                    </p>
                    <p>{(certification.diagnostic_questions || []).length} question(s) configured.</p>
                    {isEditable ? (
                        <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setShowDiagnosticModal(true)}>
                            Edit quick test
                        </button>
                    ) : null}
                </div>
            </div>

            <AdminModal
                show={showDiagnosticModal}
                onClose={() => setShowDiagnosticModal(false)}
                title="Quick Test questions"
                size="lg"
                footer={
                    <>
                        <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setShowDiagnosticModal(false)}>
                            Cancel
                        </button>
                        <button type="button" className="admin-btn admin-btn--primary" onClick={saveDiagnosticQuestions}>
                            Save quick test
                        </button>
                    </>
                }
            >
                {diagnosticQuestions.map((question, index) => (
                    <div key={index} className="admin-question-block">
                        <div className="admin-toolbar" style={{ marginBottom: '8px' }}>
                            <strong>Question {index + 1}</strong>
                            {diagnosticQuestions.length > 1 ? (
                                <button
                                    type="button"
                                    className="admin-btn admin-btn--ghost admin-btn--sm"
                                    onClick={() => setDiagnosticQuestions(diagnosticQuestions.filter((_, i) => i !== index))}
                                >
                                    Remove
                                </button>
                            ) : null}
                        </div>
                        <CreatorQuestionFields
                            question={question}
                            onChange={(next) => {
                                const list = [...diagnosticQuestions];
                                list[index] = next;
                                setDiagnosticQuestions(list);
                            }}
                        />
                    </div>
                ))}
                {diagnosticQuestions.length < 5 ? (
                    <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() =>
                            setDiagnosticQuestions([
                                ...diagnosticQuestions,
                                {
                                    question_text: '',
                                    answers: [
                                        { answer_text: '', is_correct: true },
                                        { answer_text: '', is_correct: false },
                                        { answer_text: '', is_correct: false },
                                        { answer_text: '', is_correct: false },
                                    ],
                                },
                            ])
                        }
                    >
                        Add question
                    </button>
                ) : null}
            </AdminModal>
        </>
    );
}
