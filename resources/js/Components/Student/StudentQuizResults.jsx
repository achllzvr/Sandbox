export default function StudentQuizResults({ module, score, total, onBack, reviewOnly = false }) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;

    return (
        <div className="student-sandbox student-sandbox--results">
            <header className="student-sandbox__header">
                <button type="button" className="student-sandbox__header-btn" onClick={onBack} aria-label="Close">
                    ✕
                </button>
                <h2 className="student-sandbox__header-title">{module?.title ?? 'Quiz results'}</h2>
                <div className="student-sandbox__header-spacer" aria-hidden="true" />
            </header>

            <div className="student-sandbox__content student-sandbox__content--results">
                <div className="student-quiz-results">
                    <p className="student-quiz-results__eyebrow">{reviewOnly ? 'Your saved results' : 'Quiz complete'}</p>
                    <h3 className="student-quiz-results__score">
                        {score}/{total}
                    </h3>
                    <p className="student-quiz-results__pct">{pct}% correct</p>

                    {module?.questions?.length > 0 && (
                        <ul className="student-quiz-results__list">
                            {module.questions.map((question, index) => {
                                const correct = question.answers?.find((a) => a.is_correct);
                                return (
                                    <li key={question.id} className="student-quiz-results__item">
                                        <span className="student-quiz-results__item-num">Q{index + 1}</span>
                                        <div>
                                            <p className="student-quiz-results__question">{question.question_text}</p>
                                            {correct && (
                                                <p className="student-quiz-results__answer">Answer: {correct.answer_text}</p>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <button type="button" className="student-sandbox__action student-sandbox__action--primary" onClick={onBack}>
                        Back to shell map
                    </button>
                </div>
            </div>
        </div>
    );
}
