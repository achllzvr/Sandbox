export default function StudentQuestionRenderer({
    question,
    selectedAnswer,
    onSelectAnswer,
    answerStatus,
    canSelectOptions,
}) {
    const type = question.interaction_type || 'multiple_choice';
    const meta = question.student_metadata || question.metadata || {};

    if (type === 'true_false') {
        return (
            <div className="student-quiz__options student-quiz__options--visible">
                {['True', 'False'].map((label) => (
                    <button
                        key={label}
                        type="button"
                        disabled={!canSelectOptions || answerStatus !== 'unanswered'}
                        onClick={() => onSelectAnswer(label.toLowerCase() === 'true')}
                        className={`student-quiz__option ${selectedAnswer === (label.toLowerCase() === 'true') ? 'student-quiz__option--selected' : ''}`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        );
    }

    if (type === 'matching') {
        const pairs = meta.pairs || [];
        return (
            <div className="student-quiz__options student-quiz__options--visible">
                {pairs.map((pair) => (
                    <label key={pair.id} className="admin-field" style={{ marginBottom: 8 }}>
                        <span className="admin-field__label">{pair.left}</span>
                        <select
                            className="input-field"
                            disabled={!canSelectOptions || answerStatus !== 'unanswered'}
                            value={selectedAnswer?.[pair.id] || ''}
                            onChange={(e) => onSelectAnswer({ ...(selectedAnswer || {}), [pair.id]: e.target.value })}
                        >
                            <option value="">Select match…</option>
                            {(pair.right_options || []).map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </label>
                ))}
            </div>
        );
    }

    if (type === 'sequence') {
        const items = [...(meta.items || [])];
        return (
            <div className="student-quiz__options student-quiz__options--visible">
                {items.map((item, idx) => (
                    <div key={item.id} className="admin-inline-choice" style={{ marginBottom: 8 }}>
                        <span>{idx + 1}.</span>
                        <select
                            className="input-field"
                            disabled={!canSelectOptions || answerStatus !== 'unanswered'}
                            value={(selectedAnswer || [])[idx] || ''}
                            onChange={(e) => {
                                const order = [...(selectedAnswer || Array(items.length).fill(''))];
                                order[idx] = e.target.value;
                                onSelectAnswer(order);
                            }}
                        >
                            <option value="">Pick step…</option>
                            {items.map((opt) => (
                                <option key={opt.id} value={opt.id}>{opt.text}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'true_false_ai' || type === 'code_complete') {
        return (
            <div className="student-quiz__options student-quiz__options--visible">
                <textarea
                    className="input-field"
                    rows={4}
                    disabled={!canSelectOptions || answerStatus !== 'unanswered'}
                    value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
                    onChange={(e) => onSelectAnswer(e.target.value)}
                    placeholder={type === 'code_complete' ? 'Type your code answer…' : 'Explain why the statement is false…'}
                />
            </div>
        );
    }

    return null;
}
