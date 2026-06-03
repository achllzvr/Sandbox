<?php

namespace App\Services;

use App\Models\Question;

class QuestionGradingService
{
    public function grade(Question $question, mixed $submission): bool
    {
        $type = $question->interaction_type ?? 'multiple_choice';

        return match ($type) {
            'matching' => $this->gradeMatching($question, $submission),
            'sequence' => $this->gradeSequence($question, $submission),
            'true_false' => $this->gradeTrueFalse($question, $submission),
            'true_false_ai' => app(StatementEquivalenceGrader::class)->grade($question, (string) $submission),
            'code_complete' => app(CodeGradingService::class)->grade($question, (string) $submission),
            default => $this->gradeMultipleChoice($question, $submission),
        };
    }

    private function gradeMultipleChoice(Question $question, mixed $submission): bool
    {
        $selectedId = is_array($submission) ? ($submission['selected_option'] ?? null) : $submission;
        if (! $selectedId) {
            return false;
        }

        $question->loadMissing('answers');
        $selected = $question->answers->firstWhere('id', (int) $selectedId);

        return $selected && $selected->is_correct;
    }

    private function gradeMatching(Question $question, mixed $submission): bool
    {
        $meta = $question->metadata ?? [];
        $pairs = collect($meta['pairs'] ?? []);
        $mapping = is_array($submission) ? ($submission['pairs'] ?? $submission) : [];

        if ($pairs->isEmpty() || empty($mapping)) {
            return false;
        }

        foreach ($pairs as $pair) {
            $leftId = $pair['id'] ?? null;
            $expectedRight = $pair['right'] ?? null;
            $submittedRight = $mapping[$leftId] ?? null;

            if ($submittedRight !== $expectedRight) {
                return false;
            }
        }

        return true;
    }

    private function gradeSequence(Question $question, mixed $submission): bool
    {
        $meta = $question->metadata ?? [];
        $expected = $meta['correct_order'] ?? [];
        $submitted = is_array($submission) ? ($submission['order'] ?? $submission) : [];

        return ! empty($expected) && array_values($expected) === array_values($submitted);
    }

    private function gradeTrueFalse(Question $question, mixed $submission): bool
    {
        $meta = $question->metadata ?? [];
        $expected = $meta['correct'] ?? null;

        if ($expected === null) {
            $question->loadMissing('answers');
            $correctAnswer = $question->answers->firstWhere('is_correct', true);

            return $correctAnswer && strtolower((string) $submission) === strtolower($correctAnswer->answer_text);
        }

        $submitted = filter_var($submission, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

        return $submitted !== null && (bool) $submitted === (bool) $expected;
    }
}
