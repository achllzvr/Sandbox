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

export default function StudentQuizResults({
    module,
    questions = [],
    score,
    total,
    passed = null,
    answers = [],
    assessmentType = 'quiz',
    onBack,
    onRetake = null,
    reviewOnly = false,
}) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const questionList = questions.length > 0 ? questions : module?.questions ?? [];
    const typeLabel = assessmentType === 'exam' ? 'Final exam' : assessmentType === 'test' ? 'Test' : 'Quiz';
    const showRetake = assessmentType === 'test' && typeof onRetake === 'function' && !reviewOnly;

    return (
        <div className="student-sandbox student-sandbox--results">
            <header className="student-sandbox__header">
                <button type="button" className="student-sandbox__header-btn" onClick={onBack} aria-label="Close">
                    ✕
                </button>
                <h2 className="student-sandbox__header-title">{module?.title ?? `${typeLabel} results`}</h2>
                <div className="student-sandbox__header-spacer" aria-hidden="true" />
            </header>

            <div className="student-sandbox__content student-sandbox__content--results">
                <div className="student-quiz-results">
                    <p className="student-quiz-results__eyebrow">
                        {reviewOnly ? `Your saved ${typeLabel.toLowerCase()} results` : `${typeLabel} complete`}
                    </p>
                    <h3 className="student-quiz-results__score">
                        {score}/{total}
                    </h3>
                    <p className="student-quiz-results__pct">
                        {pct}% correct
                        {passed != null && (
                            <span className={`student-quiz-results__badge ${passed ? 'student-quiz-results__badge--pass' : 'student-quiz-results__badge--fail'}`}>
                                {passed ? 'Passed' : 'Did not pass'}
                            </span>
                        )}
                    </p>

                    {answers.length > 0 ? (
                        <ul className="student-quiz-results__list">
                            {answers.map((answerRecord, index) => {
                                const question = findQuestion(questionList, answerRecord.question_id);
                                const responseText = answerLabel(question, answerRecord);

                                return (
                                    <li
                                        key={answerRecord.question_id ?? index}
                                        className={`student-quiz-results__item ${answerRecord.is_correct ? 'student-quiz-results__item--correct' : 'student-quiz-results__item--incorrect'}`}
                                        style={{ '--student-enter-index': index }}
                                    >
                                        <span className="student-quiz-results__item-num">Q{index + 1}</span>
                                        <div>
                                            <p className="student-quiz-results__question">{question?.question_text ?? 'Question'}</p>
                                            {responseText && (
                                                <p className="student-quiz-results__response">Your answer: {responseText}</p>
                                            )}
                                            {answerRecord.ai_feedback && (
                                                <p className="student-quiz-results__feedback">{answerRecord.ai_feedback}</p>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : questionList.length > 0 ? (
                        <ul className="student-quiz-results__list">
                            {questionList.map((question, index) => (
                                <li key={question.id} className="student-quiz-results__item" style={{ '--student-enter-index': index }}>
                                    <span className="student-quiz-results__item-num">Q{index + 1}</span>
                                    <div>
                                        <p className="student-quiz-results__question">{question.question_text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    <div className="student-quiz-results__actions">
                        {showRetake && (
                            <button type="button" className="student-sandbox__action student-sandbox__action--secondary" onClick={onRetake}>
                                Retake test
                            </button>
                        )}
                        <button type="button" className="student-sandbox__action student-sandbox__action--primary" onClick={onBack}>
                            Back to shell map
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
