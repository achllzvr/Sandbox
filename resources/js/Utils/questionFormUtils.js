export function prepareQuestionsForStore(questions) {
    return questions.map((question) => {
        const interactionType = question.interaction_type || 'multiple_choice';
        const payload = {
            question_text: question.question_text,
            interaction_type: interactionType,
            metadata: question.metadata ?? null,
        };

        if (interactionType === 'multiple_choice') {
            payload.answers = question.answers || [];
        }

        return payload;
    });
}

export function validateQuestionsForStore(questions, { minCount = 5, label = 'Quiz' } = {}) {
    if (questions.length < minCount) {
        return `${label} must contain at least ${minCount} questions.`;
    }

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const questionNumber = i + 1;

        if (!question.question_text?.trim()) {
            return `Question ${questionNumber} has empty text.`;
        }

        const type = question.interaction_type || 'multiple_choice';

        if (type === 'multiple_choice') {
            let correctCount = 0;

            for (let j = 0; j < (question.answers || []).length; j++) {
                if (!question.answers[j]?.answer_text?.trim()) {
                    return `Choice option ${j + 1} for Question ${questionNumber} is empty.`;
                }

                if (question.answers[j].is_correct) {
                    correctCount++;
                }
            }

            if (correctCount !== 1) {
                return `Question ${questionNumber} must have exactly one correct answer selected.`;
            }

            continue;
        }

        if (type === 'true_false') {
            continue;
        }

        if (type === 'matching') {
            const pairs = question.metadata?.pairs || [];
            if (pairs.length === 0 || pairs.some((pair) => !pair.left?.trim() || !pair.right?.trim())) {
                return `Question ${questionNumber} needs at least one complete matching pair.`;
            }

            continue;
        }

        if (type === 'sequence') {
            const items = question.metadata?.items || [];
            if (items.length < 2) {
                return `Question ${questionNumber} needs at least two sequence steps.`;
            }

            continue;
        }

        if (type === 'true_false_ai' && !question.metadata?.reference_true_statement?.trim()) {
            return `Question ${questionNumber} needs a reference true statement.`;
        }

        if (type === 'code_complete' && !question.metadata?.expected_output?.trim()) {
            return `Question ${questionNumber} needs an expected output or normalized answer.`;
        }
    }

    return null;
}
