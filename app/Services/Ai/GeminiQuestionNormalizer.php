<?php

namespace App\Services\Ai;

class GeminiQuestionNormalizer
{
    public const ALL_TYPES = [
        'multiple_choice',
        'true_false',
        'matching',
        'sequence',
        'true_false_ai',
        'code_complete',
    ];

    public function allowedTypes(?array $requested): array
    {
        if ($requested === null || $requested === []) {
            return self::ALL_TYPES;
        }

        $filtered = array_values(array_intersect($requested, self::ALL_TYPES));

        return $filtered !== [] ? $filtered : self::ALL_TYPES;
    }

    public function buildSystemPrompt(int $numQuestions, array $allowedTypes): string
    {
        $typeList = implode(', ', $allowedTypes);
        $mixed = count($allowedTypes) > 1;

        $schema = <<<'SCHEMA'
Output MUST be a JSON object with a single root key "questions" (array).

Each question object MUST include:
- "interaction_type": string
- "question_text": string

Type-specific shape (include ONLY fields for that type):
1. multiple_choice — "answers": array of exactly 4 objects { "answer_text": string, "is_correct": boolean }. Exactly one answer has is_correct true.
2. true_false — "metadata": { "correct": boolean }. question_text is the statement the student judges true or false.
3. matching — "metadata": { "pairs": [ { "id": string, "left": string, "right": string }, ... ] }. At least 3 pairs. Do NOT include answers.
4. sequence — "metadata": { "items": [ { "id": string, "text": string }, ... ], "correct_order": [ id strings in correct sequence ] }. At least 3 items.
5. true_false_ai — "metadata": { "reference_true_statement": string }. question_text should present a false claim for the student to explain why it is wrong.
6. code_complete — "metadata": { "language": string, "expected_output": string }. question_text describes the coding task or snippet to complete.
SCHEMA;

        $mixRule = $mixed
            ? 'Use a VARIED mix of the allowed interaction types across the set. Do not make every question multiple_choice unless multiple_choice is the only allowed type.'
            : 'Every question MUST use interaction_type "'.$allowedTypes[0].'".';

        return "Generate a practice quiz from the user's study material.\n"
            ."Rules:\n"
            ."1. Generate exactly {$numQuestions} questions.\n"
            ."2. Allowed interaction_type values ONLY: {$typeList}.\n"
            ."3. {$mixRule}\n"
            ."4. Base questions on the uploaded material; extract existing questions if present and convert to these formats.\n"
            ."5. {$schema}";
    }

    /**
     * @param  array<int, array<string, mixed>>  $rawQuestions
     * @return array<int, array<string, mixed>>
     */
    public function normalize(array $rawQuestions, array $allowedTypes): array
    {
        $normalized = [];

        foreach ($rawQuestions as $q) {
            if (empty($q['question_text']) || ! is_string($q['question_text'])) {
                continue;
            }

            $type = $q['interaction_type'] ?? 'multiple_choice';
            if (! in_array($type, $allowedTypes, true)) {
                $type = $allowedTypes[0];
            }

            $item = match ($type) {
                'true_false' => $this->normalizeTrueFalse($q),
                'matching' => $this->normalizeMatching($q),
                'sequence' => $this->normalizeSequence($q),
                'true_false_ai' => $this->normalizeTrueFalseAi($q),
                'code_complete' => $this->normalizeCodeComplete($q),
                default => $this->normalizeMultipleChoice($q),
            };

            if ($item !== null) {
                $normalized[] = $item;
            }
        }

        return $normalized;
    }

    private function normalizeMultipleChoice(array $q): ?array
    {
        $answers = [];
        $correctCount = 0;
        $rawAnswers = is_array($q['answers'] ?? null) ? $q['answers'] : [];

        for ($i = 0; $i < 4; $i++) {
            $ansText = trim((string) ($rawAnswers[$i]['answer_text'] ?? 'Option '.($i + 1)));
            $isCorrect = (bool) ($rawAnswers[$i]['is_correct'] ?? false);
            if ($isCorrect) {
                $correctCount++;
            }
            $answers[] = ['answer_text' => $ansText, 'is_correct' => $isCorrect];
        }

        if ($correctCount !== 1) {
            foreach ($answers as $idx => &$ans) {
                $ans['is_correct'] = ($idx === 0);
            }
            unset($ans);
        }

        return [
            'question_text' => trim($q['question_text']),
            'interaction_type' => 'multiple_choice',
            'metadata' => null,
            'answers' => $answers,
        ];
    }

    private function normalizeTrueFalse(array $q): ?array
    {
        $metadata = is_array($q['metadata'] ?? null) ? $q['metadata'] : [];

        return [
            'question_text' => trim($q['question_text']),
            'interaction_type' => 'true_false',
            'metadata' => ['correct' => (bool) ($metadata['correct'] ?? true)],
        ];
    }

    private function normalizeMatching(array $q): ?array
    {
        $metadata = is_array($q['metadata'] ?? null) ? $q['metadata'] : [];
        $pairs = [];
        $rawPairs = is_array($metadata['pairs'] ?? null) ? $metadata['pairs'] : [];

        foreach ($rawPairs as $idx => $pair) {
            if (! is_array($pair)) {
                continue;
            }
            $left = trim((string) ($pair['left'] ?? ''));
            $right = trim((string) ($pair['right'] ?? ''));
            if ($left === '' || $right === '') {
                continue;
            }
            $pairs[] = [
                'id' => (string) ($pair['id'] ?? ($idx + 1)),
                'left' => $left,
                'right' => $right,
            ];
        }

        if (count($pairs) < 2) {
            return null;
        }

        return [
            'question_text' => trim($q['question_text']),
            'interaction_type' => 'matching',
            'metadata' => [
                'pairs' => $pairs,
                'correct_order' => [],
            ],
        ];
    }

    private function normalizeSequence(array $q): ?array
    {
        $metadata = is_array($q['metadata'] ?? null) ? $q['metadata'] : [];
        $items = [];
        $rawItems = is_array($metadata['items'] ?? null) ? $metadata['items'] : [];

        foreach ($rawItems as $idx => $item) {
            if (! is_array($item)) {
                continue;
            }
            $text = trim((string) ($item['text'] ?? ''));
            if ($text === '') {
                continue;
            }
            $items[] = [
                'id' => (string) ($item['id'] ?? ($idx + 1)),
                'text' => $text,
            ];
        }

        if (count($items) < 2) {
            return null;
        }

        $correctOrder = is_array($metadata['correct_order'] ?? null) ? $metadata['correct_order'] : [];
        $validIds = array_column($items, 'id');
        $correctOrder = array_values(array_filter(
            array_map('strval', $correctOrder),
            fn ($id) => in_array($id, $validIds, true),
        ));

        if ($correctOrder === []) {
            $correctOrder = $validIds;
        }

        return [
            'question_text' => trim($q['question_text']),
            'interaction_type' => 'sequence',
            'metadata' => [
                'items' => $items,
                'correct_order' => $correctOrder,
            ],
        ];
    }

    private function normalizeTrueFalseAi(array $q): ?array
    {
        $metadata = is_array($q['metadata'] ?? null) ? $q['metadata'] : [];
        $reference = trim((string) ($metadata['reference_true_statement'] ?? ''));

        if ($reference === '') {
            return null;
        }

        return [
            'question_text' => trim($q['question_text']),
            'interaction_type' => 'true_false_ai',
            'metadata' => ['reference_true_statement' => $reference],
        ];
    }

    private function normalizeCodeComplete(array $q): ?array
    {
        $metadata = is_array($q['metadata'] ?? null) ? $q['metadata'] : [];
        $expected = trim((string) ($metadata['expected_output'] ?? ''));

        if ($expected === '') {
            return null;
        }

        return [
            'question_text' => trim($q['question_text']),
            'interaction_type' => 'code_complete',
            'metadata' => [
                'language' => trim((string) ($metadata['language'] ?? 'php')) ?: 'php',
                'expected_output' => $expected,
            ],
        ];
    }
}
