<?php

namespace App\Services\Ai;

use App\Models\Question;

class CodeGradingService
{
    public function __construct(private GeminiGradingService $geminiGradingService)
    {
    }

    public function grade(Question $question, string $studentCode): bool
    {
        return $this->gradeWithDetails($question, $studentCode)['is_correct'];
    }

    public function gradeWithDetails(Question $question, string $studentCode): array
    {
        return $this->geminiGradingService->gradeCodeComplete($question, $studentCode);
    }
}
