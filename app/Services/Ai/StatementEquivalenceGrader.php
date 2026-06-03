<?php

namespace App\Services\Ai;

use App\Models\Question;

class StatementEquivalenceGrader
{
    public function __construct(private GeminiGradingService $geminiGradingService)
    {
    }

    public function grade(Question $question, string $studentAnswer): bool
    {
        return $this->gradeWithDetails($question, $studentAnswer)['is_correct'];
    }

    public function gradeWithDetails(Question $question, string $studentAnswer): array
    {
        return $this->geminiGradingService->gradeTrueFalseAi($question, $studentAnswer);
    }
}
