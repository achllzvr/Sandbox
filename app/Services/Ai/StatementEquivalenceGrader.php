<?php

namespace App\Services\Ai;

use App\Models\Question;

class StatementEquivalenceGrader
{
    public function grade(Question $question, string $studentAnswer): bool
    {
        $reference = (string) ($question->metadata['reference_true_statement'] ?? '');
        $threshold = (float) config('ai.similarity_threshold', 0.72);

        if ($reference === '' || trim($studentAnswer) === '') {
            return false;
        }

        $score = $this->similarity($reference, $studentAnswer);

        return $score >= $threshold;
    }

    private function similarity(string $reference, string $student): float
    {
        $ref = strtolower(trim($reference));
        $ans = strtolower(trim($student));

        if ($ref === $ans) {
            return 1.0;
        }

        similar_text($ref, $ans, $percent);

        return $percent / 100;
    }
}
