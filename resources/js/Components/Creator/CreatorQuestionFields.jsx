const INTERACTION_TYPES = [
    { value: 'multiple_choice', label: 'Multiple choice (A–D)' },
    { value: 'true_false', label: 'True / False' },
    { value: 'matching', label: 'Matching pairs' },
    { value: 'sequence', label: 'Fix the sequence' },
    { value: 'true_false_ai', label: 'Explain why (AI graded)' },
    { value: 'code_complete', label: 'Code completion' },
];

export default function CreatorQuestionFields({ question, onChange }) {
    const type = question.interaction_type || 'multiple_choice';
    const metadata = question.metadata || {};

    function patch(partial) {
        onChange({ ...question, ...partial });
    }

    function patchMetadata(key, value) {
        patch({ metadata: { ...metadata, [key]: value } });
    }

    return (
        <>
            <label className="admin-field">
                <span className="admin-field__label">Question type</span>
                <select
                    className="input-field"
                    value={type}
                    onChange={(e) => patch({ interaction_type: e.target.value })}
                >
                    {INTERACTION_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </label>

            <label className="admin-field">
                <span className="admin-field__label">Question</span>
                <input
                    type="text"
                    value={question.question_text}
                    onChange={(e) => patch({ question_text: e.target.value })}
                    className="input-field"
                    required
                />
            </label>

            {type === 'multiple_choice' && (
                <>
                    {[0, 1, 2, 3].map((aIdx) => (
                        <label key={aIdx} className="admin-field">
                            <span className="admin-field__label">
                                Choice {aIdx + 1}{question.answers?.[aIdx]?.is_correct ? ' (correct)' : ''}
                            </span>
                            <div className="admin-inline-choice">
                                <input
                                    type="radio"
                                    checked={!!question.answers?.[aIdx]?.is_correct}
                                    onChange={() => {
                                        const answers = (question.answers || []).map((ans, idx) => ({
                                            ...ans,
                                            is_correct: idx === aIdx,
                                        }));
                                        patch({ answers });
                                    }}
                                />
                                <input
                                    type="text"
                                    value={question.answers?.[aIdx]?.answer_text ?? ''}
                                    onChange={(e) => {
                                        const answers = [...(question.answers || [])];
                                        answers[aIdx] = { ...answers[aIdx], answer_text: e.target.value };
                                        patch({ answers });
                                    }}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </label>
                    ))}
                </>
            )}

            {type === 'true_false' && (
                <label className="admin-field">
                    <span className="admin-field__label">Correct answer</span>
                    <select
                        className="input-field"
                        value={metadata.correct === false ? 'false' : 'true'}
                        onChange={(e) => patchMetadata('correct', e.target.value === 'true')}
                    >
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </label>
            )}

            {type === 'matching' && (
                <div className="admin-field">
                    <span className="admin-field__label">Matching pairs (left → right)</span>
                    {(metadata.pairs || [{ id: '1', left: '', right: '' }]).map((pair, idx) => (
                        <div key={pair.id || idx} className="admin-inline-choice" style={{ marginBottom: 8 }}>
                            <input
                                type="text"
                                placeholder="Left"
                                className="input-field"
                                value={pair.left || ''}
                                onChange={(e) => {
                                    const pairs = [...(metadata.pairs || [])];
                                    pairs[idx] = { ...pairs[idx], id: pairs[idx]?.id || String(idx + 1), left: e.target.value };
                                    patchMetadata('pairs', pairs);
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Right"
                                className="input-field"
                                value={pair.right || ''}
                                onChange={(e) => {
                                    const pairs = [...(metadata.pairs || [])];
                                    pairs[idx] = { ...pairs[idx], id: pairs[idx]?.id || String(idx + 1), right: e.target.value };
                                    patchMetadata('pairs', pairs);
                                }}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        onClick={() => patchMetadata('pairs', [...(metadata.pairs || []), { id: String(Date.now()), left: '', right: '' }])}
                    >
                        + Add pair
                    </button>
                </div>
            )}

            {type === 'sequence' && (
                <label className="admin-field">
                    <span className="admin-field__label">Correct sequence (one step per line)</span>
                    <textarea
                        className="input-field"
                        rows={4}
                        value={(metadata.items || []).map((item) => item.text).join('\n')}
                        onChange={(e) => {
                            const lines = e.target.value.split('\n').map((text) => text.trim()).filter(Boolean);
                            const items = lines.map((text, idx) => ({ id: String(idx + 1), text }));
                            patchMetadata('items', items);
                            patchMetadata('correct_order', items.map((item) => item.id));
                        }}
                    />
                </label>
            )}

            {type === 'true_false_ai' && (
                <label className="admin-field">
                    <span className="admin-field__label">Reference true statement (AI compares student explanation)</span>
                    <textarea
                        className="input-field"
                        rows={3}
                        value={metadata.reference_true_statement || ''}
                        onChange={(e) => patchMetadata('reference_true_statement', e.target.value)}
                    />
                </label>
            )}

            {type === 'code_complete' && (
                <>
                    <label className="admin-field">
                        <span className="admin-field__label">Language</span>
                        <input
                            type="text"
                            className="input-field"
                            value={metadata.language || 'php'}
                            onChange={(e) => patchMetadata('language', e.target.value)}
                        />
                    </label>
                    <label className="admin-field">
                        <span className="admin-field__label">Expected output / normalized answer</span>
                        <textarea
                            className="input-field"
                            rows={3}
                            value={metadata.expected_output || ''}
                            onChange={(e) => patchMetadata('expected_output', e.target.value)}
                        />
                    </label>
                </>
            )}
        </>
    );
}
