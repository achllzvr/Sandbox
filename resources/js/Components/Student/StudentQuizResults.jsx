import { CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

function findQuestion(questions, questionId) {
    return questions?.find((q) => q.id === questionId);
}

function answerLabel(question, answerRecord) {
    if (!question) {
        return null;
    }

    const interactionType = question.interaction_type || 'multiple_choice';

    if (interactionType === 'multiple_choice' && answerRecord?.selected_option != null) {
        const option = question.answers?.find((a) => a.id === answerRecord.selected_option);
        return option?.answer_text ?? null;
    }

    if (answerRecord?.value != null && answerRecord.value !== '') {
        return String(answerRecord.value);
    }

    return null;
}

function formatAttemptDate(value) {
    if (!value) {
        return 'Date unknown';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return 'Date unknown';
    }

    return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function resolveInitialAttempt(attemptHistory, initialAttemptNumber, fallback) {
    if (attemptHistory.length === 0) {
        return fallback;
    }

    if (initialAttemptNumber != null) {
        const match = attemptHistory.find((attempt) => attempt.attempt_number === initialAttemptNumber);
        if (match) {
            return match;
        }
    }

    return attemptHistory[0];
}

export default function StudentQuizResults({
    module,
    questions = [],
    score,
    total,
    passed = null,
    answers = [],
    attemptHistory = [],
    initialAttemptNumber = null,
    assessmentType = 'quiz',
    onBack,
    onRetake = null,
    onReviewContent = null,
    reviewOnly = false,
}) {
    const questionList = questions.length > 0 ? questions : module?.questions ?? [];
    const typeLabel = assessmentType === 'exam' ? 'Final exam' : assessmentType === 'test' ? 'Test' : 'Quiz';
    const showRetake = assessmentType === 'test' && typeof onRetake === 'function' && !reviewOnly;
    const hasAttemptHistory = attemptHistory.length > 0;

    const fallbackAttempt = useMemo(
        () => ({
            attempt_number: initialAttemptNumber ?? 1,
            score,
            total,
            passed,
            answers,
            completed_at: null,
        }),
        [answers, initialAttemptNumber, passed, score, total],
    );

    const [selectedAttemptNumber, setSelectedAttemptNumber] = useState(
        () => resolveInitialAttempt(attemptHistory, initialAttemptNumber, fallbackAttempt).attempt_number,
    );
    const [entered, setEntered] = useState(false);

    useLayoutEffect(() => {
        setEntered(false);
        const frame = requestAnimationFrame(() => {
            requestAnimationFrame(() => setEntered(true));
        });

        return () => cancelAnimationFrame(frame);
    }, [module?.id, assessmentType]);

    useEffect(() => {
        setSelectedAttemptNumber(
            resolveInitialAttempt(attemptHistory, initialAttemptNumber, fallbackAttempt).attempt_number,
        );
    }, [attemptHistory, fallbackAttempt, initialAttemptNumber, module?.id]);

    const activeAttempt = useMemo(() => {
        if (hasAttemptHistory) {
            return (
                attemptHistory.find((attempt) => attempt.attempt_number === selectedAttemptNumber)
                ?? attemptHistory[0]
            );
        }

        return fallbackAttempt;
    }, [attemptHistory, fallbackAttempt, hasAttemptHistory, selectedAttemptNumber]);

    const activeScore = activeAttempt?.score ?? score;
    const activeTotal = activeAttempt?.total ?? total;
    const activePassed = activeAttempt?.passed ?? passed;
    const activeAnswers = activeAttempt?.answers ?? answers;
    const pct = activeTotal > 0 ? Math.round((activeScore / activeTotal) * 100) : 0;

    return (
        <div className={`student-sandbox student-sandbox--results ${entered ? 'student-sandbox--results-entered' : ''}`}>
            <header className="student-sandbox__header">
                <button type="button" className="student-sandbox__header-btn" onClick={onBack} aria-label="Close">
                    ✕
                </button>
                <h2 className="student-sandbox__header-title">{module?.title ?? `${typeLabel} results`}</h2>
                <div className="student-sandbox__header-spacer" aria-hidden="true" />
            </header>

            <div className="student-sandbox__content student-sandbox__content--results">
                <div className="student-quiz-results">
                    <div className="student-quiz-results__hero">
                        <p className="student-quiz-results__eyebrow">
                            {reviewOnly ? `Saved ${typeLabel.toLowerCase()} results` : `${typeLabel} complete`}
                        </p>
                        <h3 className="student-quiz-results__score">
                            {activeScore}/{activeTotal}
                        </h3>
                        <p className="student-quiz-results__pct">
                            <span>{pct}% correct</span>
                            {activePassed != null && (
                                <span
                                    className={`student-quiz-results__badge ${activePassed ? 'student-quiz-results__badge--pass' : 'student-quiz-results__badge--fail'}`}
                                >
                                    {activePassed ? 'Passed' : 'Did not pass'}
                                </span>
                            )}
                        </p>
                    </div>

                    {hasAttemptHistory ? (
                        <div className="student-quiz-results__attempts" role="tablist" aria-label="Attempt history">
                            {attemptHistory.map((attempt) => {
                                const attemptPct = attempt.total > 0
                                    ? Math.round((attempt.score / attempt.total) * 100)
                                    : 0;
                                const isActive = attempt.attempt_number === selectedAttemptNumber;

                                return (
                                    <button
                                        key={attempt.attempt_number}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        className={`student-quiz-results__attempt ${isActive ? 'student-quiz-results__attempt--active' : ''}`}
                                        onClick={() => setSelectedAttemptNumber(attempt.attempt_number)}
                                    >
                                        <span className="student-quiz-results__attempt-label">
                                            Attempt {attempt.attempt_number}
                                        </span>
                                        <span className="student-quiz-results__attempt-score">
                                            {attempt.score}/{attempt.total} · {attemptPct}%
                                        </span>
                                        <span className="student-quiz-results__attempt-date">
                                            {formatAttemptDate(attempt.completed_at)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}

                    {activeAnswers.length > 0 ? (
                        <ul className="student-quiz-results__list">
                            {activeAnswers.map((answerRecord, index) => {
                                const question = findQuestion(questionList, answerRecord.question_id);
                                const responseText = answerLabel(question, answerRecord);
                                const isCorrect = Boolean(answerRecord.is_correct);

                                return (
                                    <li
                                        key={answerRecord.question_id ?? index}
                                        className={`student-quiz-results__item ${isCorrect ? 'student-quiz-results__item--correct' : 'student-quiz-results__item--incorrect'}`}
                                        style={{ '--student-enter-index': index }}
                                    >
                                        <div className="student-quiz-results__item-status" aria-hidden="true">
                                            {isCorrect ? (
                                                <CheckCircle2 size={22} strokeWidth={2.5} />
                                            ) : (
                                                <XCircle size={22} strokeWidth={2.5} />
                                            )}
                                        </div>
                                        <div className="student-quiz-results__item-body">
                                            <div className="student-quiz-results__item-head">
                                                <span className="student-quiz-results__item-num">Q{index + 1}</span>
                                                <span
                                                    className={`student-quiz-results__verdict ${isCorrect ? 'student-quiz-results__verdict--correct' : 'student-quiz-results__verdict--incorrect'}`}
                                                >
                                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                                </span>
                                            </div>
                                            <p className="student-quiz-results__question">
                                                {question?.question_text ?? 'Question'}
                                            </p>
                                            {responseText ? (
                                                <p className="student-quiz-results__response">
                                                    <span className="student-quiz-results__response-label">Your answer</span>
                                                    {responseText}
                                                </p>
                                            ) : null}
                                            {!isCorrect && answerRecord.correct_answer ? (
                                                <p className="student-quiz-results__correct">
                                                    <span className="student-quiz-results__response-label">Correct answer</span>
                                                    {answerRecord.correct_answer}
                                                </p>
                                            ) : null}
                                            {answerRecord.ai_feedback ? (
                                                <p className="student-quiz-results__feedback">{answerRecord.ai_feedback}</p>
                                            ) : null}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : questionList.length > 0 ? (
                        <ul className="student-quiz-results__list">
                            {questionList.map((question, index) => (
                                <li
                                    key={question.id}
                                    className="student-quiz-results__item student-quiz-results__item--neutral"
                                    style={{ '--student-enter-index': index }}
                                >
                                    <div className="student-quiz-results__item-body">
                                        <span className="student-quiz-results__item-num">Q{index + 1}</span>
                                        <p className="student-quiz-results__question">{question.question_text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    <div className="student-quiz-results__actions">
                        {typeof onReviewContent === 'function' ? (
                            <button
                                type="button"
                                className="student-sandbox__action student-sandbox__action--secondary"
                                onClick={onReviewContent}
                            >
                                Review materials
                            </button>
                        ) : null}
                        {showRetake ? (
                            <button
                                type="button"
                                className="student-sandbox__action student-sandbox__action--secondary"
                                onClick={onRetake}
                            >
                                Retake test
                            </button>
                        ) : null}
                        <button type="button" className="student-sandbox__action student-sandbox__action--primary" onClick={onBack}>
                            Back to shell map
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
