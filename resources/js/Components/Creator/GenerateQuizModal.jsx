import { useEffect, useState } from 'react';
import AdminModal from '@/Components/Admin/AdminModal';
import { Sparkles } from 'lucide-react';

const MOCK_SHORT_TEST_QUESTIONS = [
    {
        question_text: 'What is the primary purpose of the IDE workspace?',
        answers: [
            { answer_text: 'Organize files and run development tools', is_correct: true },
            { answer_text: 'Replace version control hosting', is_correct: false },
            { answer_text: 'Publish production builds only', is_correct: false },
            { answer_text: 'Manage payment receipts', is_correct: false },
        ],
    },
    {
        question_text: 'Which panel typically shows project files?',
        answers: [
            { answer_text: 'Explorer / file tree', is_correct: true },
            { answer_text: 'Terminal only', is_correct: false },
            { answer_text: 'Browser downloads', is_correct: false },
            { answer_text: 'System settings', is_correct: false },
        ],
    },
    {
        question_text: 'What does a linter help you catch?',
        answers: [
            { answer_text: 'Style and syntax issues early', is_correct: true },
            { answer_text: 'Network latency', is_correct: false },
            { answer_text: 'Database backups', is_correct: false },
            { answer_text: 'Invoice totals', is_correct: false },
        ],
    },
    {
        question_text: 'Why use integrated terminal inside the IDE?',
        answers: [
            { answer_text: 'Run commands without leaving the editor', is_correct: true },
            { answer_text: 'Disable keyboard shortcuts', is_correct: false },
            { answer_text: 'Remove source control', is_correct: false },
            { answer_text: 'Hide file names', is_correct: false },
        ],
    },
    {
        question_text: 'What is a common first step after opening a repository?',
        answers: [
            { answer_text: 'Review the folder structure and README', is_correct: true },
            { answer_text: 'Delete all dependencies', is_correct: false },
            { answer_text: 'Skip installing packages', is_correct: false },
            { answer_text: 'Disable autosave permanently', is_correct: false },
        ],
    },
    {
        question_text: 'Which shortcut category helps you work faster in the editor?',
        answers: [
            { answer_text: 'Keyboard shortcuts for navigation and editing', is_correct: true },
            { answer_text: 'Browser bookmark shortcuts only', is_correct: false },
            { answer_text: 'OS shutdown shortcuts', is_correct: false },
            { answer_text: 'Payment gateway shortcuts', is_correct: false },
        ],
    },
    {
        question_text: 'What is the benefit of an AI-assisted coding panel?',
        answers: [
            { answer_text: 'It can explain and refactor code in context', is_correct: true },
            { answer_text: 'It replaces the need to save files', is_correct: false },
            { answer_text: 'It disables syntax highlighting', is_correct: false },
            { answer_text: 'It removes all tests', is_correct: false },
        ],
    },
];

const MOCK_FINAL_EXAM_QUESTIONS = [
    {
        question_text: 'Which workflow best supports iterative feature development?',
        answers: [
            { answer_text: 'Small commits with frequent local testing', is_correct: true },
            { answer_text: 'One commit at project end only', is_correct: false },
            { answer_text: 'Never run tests locally', is_correct: false },
            { answer_text: 'Avoid using branches', is_correct: false },
        ],
    },
    {
        question_text: 'What should a final exam primarily assess?',
        answers: [
            { answer_text: 'Integrated understanding across all sandboxes', is_correct: true },
            { answer_text: 'Only the first module title', is_correct: false },
            { answer_text: 'UI color preferences', is_correct: false },
            { answer_text: 'Account billing history', is_correct: false },
        ],
    },
    {
        question_text: 'How do short tests support the final exam?',
        answers: [
            { answer_text: 'They reinforce concepts that roll up into broader questions', is_correct: true },
            { answer_text: 'They replace all sandbox materials', is_correct: false },
            { answer_text: 'They remove the need for study', is_correct: false },
            { answer_text: 'They disable progress tracking', is_correct: false },
        ],
    },
    {
        question_text: 'What is a good sign a learner is exam-ready?',
        answers: [
            { answer_text: 'They can explain concepts from multiple sandboxes', is_correct: true },
            { answer_text: 'They skipped all quizzes', is_correct: false },
            { answer_text: 'They never opened documents', is_correct: false },
            { answer_text: 'They avoided practice questions', is_correct: false },
        ],
    },
    {
        question_text: 'Why aggregate quiz content for a final exam draft?',
        answers: [
            { answer_text: 'It keeps exam scope aligned with what was taught', is_correct: true },
            { answer_text: 'It removes all module context', is_correct: false },
            { answer_text: 'It guarantees identical questions', is_correct: false },
            { answer_text: 'It bypasses admin review', is_correct: false },
        ],
    },
    {
        question_text: 'What makes a strong certification assessment?',
        answers: [
            { answer_text: 'Questions that span multiple skills taught in the shell', is_correct: true },
            { answer_text: 'Questions copied from unrelated domains', is_correct: false },
            { answer_text: 'Only true/false items with no context', is_correct: false },
            { answer_text: 'Random vocabulary only', is_correct: false },
        ],
    },
    {
        question_text: 'When reviewing generated exam questions, what should you verify first?',
        answers: [
            { answer_text: 'Each item maps to content taught in the shell', is_correct: true },
            { answer_text: 'Every answer is option A', is_correct: false },
            { answer_text: 'No question has a correct answer', is_correct: false },
            { answer_text: 'All questions are duplicates', is_correct: false },
        ],
    },
];

export { MOCK_SHORT_TEST_QUESTIONS, MOCK_FINAL_EXAM_QUESTIONS };

function buildMockQuestions(pool, count) {
    const safeCount = Math.max(5, Math.min(count, pool.length));
    return pool.slice(0, safeCount);
}

export default function GenerateQuizModal({
    show,
    onClose,
    mode = 'short_test',
    onApplyMock,
}) {
    const [pdfFile, setPdfFile] = useState(null);
    const [step, setStep] = useState('count');
    const [questionCount, setQuestionCount] = useState('5');
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewQuestions, setPreviewQuestions] = useState([]);

    const isFinalExam = mode === 'final_exam';
    const questionPool = isFinalExam ? MOCK_FINAL_EXAM_QUESTIONS : MOCK_SHORT_TEST_QUESTIONS;
    const minQuestions = 5;
    const maxQuestions = questionPool.length;

    useEffect(() => {
        if (!show) {
            setPdfFile(null);
            setStep('count');
            setQuestionCount('5');
            setIsGenerating(false);
            setPreviewQuestions([]);
        }
    }, [show]);

    function resetAndClose() {
        onClose();
    }

    function handleCountContinue(e) {
        e.preventDefault();
        const count = parseInt(questionCount, 10);

        if (!Number.isFinite(count) || count < minQuestions || count > maxQuestions) {
            return;
        }

        setStep('upload');
    }

    function handleGenerate(e) {
        e.preventDefault();
        const count = parseInt(questionCount, 10);
        if (!pdfFile) {
            return;
        }

        setIsGenerating(true);

        const formData = new FormData();
        formData.append('pdf', pdfFile);
        formData.append('count', String(count));
        formData.append('mode', isFinalExam ? 'final_exam' : 'short_test');

        window.axios.post(route('creator.ai.generate-quiz'), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(({ data }) => {
            setPreviewQuestions(data.questions || []);
            setIsGenerating(false);
            setStep('preview');
        }).catch(() => {
            setIsGenerating(false);
            window.alert('Could not generate questions from the PDF. Please try again.');
        });
    }

    function handleApplyMock() {
        onApplyMock?.(previewQuestions);
        resetAndClose();
    }

    const title = isFinalExam ? 'Generate final exam' : 'Generate short test';

    return (
        <AdminModal
            show={show}
            onClose={resetAndClose}
            title={title}
            size="lg"
            footer={(
                <>
                    <button type="button" onClick={resetAndClose} className="admin-btn admin-btn--ghost">Cancel</button>
                    {step === 'count' ? (
                        <button type="submit" form="generate-quiz-count-form" className="admin-btn admin-btn--primary">
                            Continue
                        </button>
                    ) : null}
                    {step === 'upload' ? (
                        <>
                            <button type="button" onClick={() => setStep('count')} className="admin-btn admin-btn--ghost">Back</button>
                            <button
                                type="submit"
                                form="generate-quiz-form"
                                disabled={!pdfFile || isGenerating}
                                className="admin-btn admin-btn--primary"
                            >
                                {isGenerating ? 'Generating…' : 'Generate'}
                            </button>
                        </>
                    ) : null}
                    {step === 'preview' ? (
                        <button type="button" onClick={handleApplyMock} className="admin-btn admin-btn--primary">
                            Use generated questions
                        </button>
                    ) : null}
                </>
            )}
        >
            <div className="admin-flash admin-flash--info" style={{ marginBottom: '16px' }}>
                Upload a PDF to draft questions via the AI document analyzer. You can review and edit before saving.
            </div>

            {step === 'count' ? (
                <form id="generate-quiz-count-form" onSubmit={handleCountContinue}>
                    <p className="admin-text-muted" style={{ marginBottom: '16px' }}>
                        How many questions should be generated{isFinalExam ? ' for the final exam' : ' for this short test'}?
                    </p>
                    <label className="admin-field">
                        <span className="admin-field__label">Number of questions</span>
                        <input
                            type="number"
                            min={minQuestions}
                            max={maxQuestions}
                            step="1"
                            className="input-field"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(e.target.value)}
                            required
                        />
                        <p className="admin-field__hint">Minimum {minQuestions}, maximum {maxQuestions} for this mock flow.</p>
                    </label>
                </form>
            ) : null}

            {step === 'upload' ? (
                <form id="generate-quiz-form" onSubmit={handleGenerate}>
                    <p className="admin-text-muted" style={{ marginBottom: '16px' }}>
                        {isFinalExam
                            ? `Upload a reference PDF if needed. ${questionCount} final exam questions will be drafted from shell quizzes (mock preview for now).`
                            : `Upload a PDF document. ${questionCount} short test questions will be drafted from the material (mock preview for now).`}
                    </p>
                    <label className="admin-field">
                        <span className="admin-field__label">Reference PDF</span>
                        <input
                            type="file"
                            accept="application/pdf,.pdf"
                            className="input-field"
                            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                            required
                        />
                        {pdfFile ? (
                            <p className="admin-field__hint">Selected: {pdfFile.name}</p>
                        ) : null}
                    </label>
                </form>
            ) : null}

            {step === 'preview' ? (
                <div>
                    <div className="admin-toolbar" style={{ marginBottom: '12px' }}>
                        <span className="admin-badge admin-badge--draft">
                            <Sparkles size={14} strokeWidth={2.25} aria-hidden="true" />
                            Generated preview · {previewQuestions.length} Qs
                        </span>
                        {pdfFile ? <span className="admin-list-row__meta">Source: {pdfFile.name}</span> : null}
                    </div>
                    <div className="admin-preview-quiz">
                        {(previewQuestions || []).map((q, qIdx) => (
                            <div key={qIdx} className="admin-preview-quiz__question">
                                <p className="admin-preview-quiz__prompt">
                                    Q{qIdx + 1}. {q.question_text}
                                </p>
                                <div className="admin-answer-grid">
                                    {(q.answers || []).map((ans, aIdx) => (
                                        <div
                                            key={aIdx}
                                            className={`admin-answer ${ans.is_correct ? 'admin-answer--correct' : ''}`}
                                        >
                                            {ans.answer_text} {ans.is_correct ? '✓' : ''}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </AdminModal>
    );
}
