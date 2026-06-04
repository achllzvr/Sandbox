import { useEffect, useState } from 'react';
import AdminModal from '@/Components/Admin/AdminModal';
import { showAppToastError } from '@/Utils/appToast';

export default function StudentDiagnosticModal({ show, onClose, certificationId, certificationTitle }) {
    const [loading, setLoading] = useState(false);
    const [grading, setGrading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!show || !certificationId) {
            return;
        }

        setLoading(true);
        setResult(null);
        setAnswers({});

        fetch(route('marketplace.diagnostic', certificationId), {
            headers: { Accept: 'application/json' },
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Could not load quick test.');
                }

                return response.json();
            })
            .then((payload) => {
                setQuestions(payload.questions || []);
            })
            .catch(() => {
                showAppToastError('Quick Test is not available for this shell yet.');
                onClose();
            })
            .finally(() => setLoading(false));
    }, [show, certificationId, onClose]);

    function handleSelect(questionId, answerId) {
        setAnswers((current) => ({ ...current, [questionId]: answerId }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (questions.length === 0) {
            return;
        }

        setGrading(true);

        fetch(route('marketplace.diagnostic.grade', certificationId), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
            },
            body: JSON.stringify({
                answers: questions.map((question) => ({
                    question_id: question.id,
                    answer_id: answers[question.id],
                })),
            }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Could not grade quick test.');
                }

                return response.json();
            })
            .then((payload) => setResult(payload))
            .catch(() => showAppToastError('Could not grade your quick test.'))
            .finally(() => setGrading(false));
    }

    if (!show) {
        return null;
    }

    return (
        <AdminModal
            show={show}
            onClose={onClose}
            title={`Quick Test — ${certificationTitle}`}
            subtitle="Try a few sample questions before enrolling. This does not affect your progress."
            size="lg"
            footer={
                result ? (
                    <button type="button" className="admin-btn admin-btn--primary" onClick={onClose}>
                        Close
                    </button>
                ) : (
                    <>
                        <button type="button" className="admin-btn admin-btn--secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="student-diagnostic-form"
                            className="admin-btn admin-btn--primary"
                            disabled={grading || loading || questions.length === 0}
                        >
                            {grading ? 'Checking…' : 'Check answers'}
                        </button>
                    </>
                )
            }
        >
            {loading ? (
                <p>Loading quick test…</p>
            ) : result ? (
                <div>
                    <p style={{ marginBottom: '12px' }}>
                        You scored <strong>{result.score}</strong> out of <strong>{result.total}</strong> ({result.percentage}%).
                    </p>
                    <ul style={{ paddingLeft: '1.1rem' }}>
                        {(result.breakdown || []).map((item) => (
                            <li key={item.question_id} style={{ marginBottom: '8px' }}>
                                {item.is_correct ? '✓' : '✗'} {item.question_text}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : questions.length === 0 ? (
                <p>No quick test questions have been published for this shell yet.</p>
            ) : (
                <form id="student-diagnostic-form" onSubmit={handleSubmit}>
                    {questions.map((question, index) => (
                        <fieldset key={question.id} style={{ marginBottom: '16px', border: 'none', padding: 0 }}>
                            <legend style={{ fontWeight: 700, marginBottom: '8px' }}>
                                {index + 1}. {question.question_text}
                            </legend>
                            {question.answers.map((answer) => (
                                <label key={answer.id} style={{ display: 'block', marginBottom: '6px' }}>
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={answer.id}
                                        checked={answers[question.id] === answer.id}
                                        onChange={() => handleSelect(question.id, answer.id)}
                                        required
                                    />{' '}
                                    {answer.answer_text}
                                </label>
                            ))}
                        </fieldset>
                    ))}
                </form>
            )}
        </AdminModal>
    );
}
