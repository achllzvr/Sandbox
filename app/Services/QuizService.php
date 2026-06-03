<?php

namespace App\Services;

use App\Models\Module;
use App\Models\Question;

class QuizService
{
    public function __construct(private QuestionGradingService $gradingService) {}

    public function calculateScore(Module $module, array $submittedAnswers): int
    {
        $score = 0;

        foreach ($submittedAnswers as $submission) {
            $question = Question::with('answers')->find($submission['question_id']);
            if (! $question || $question->module_id !== $module->id) {
                continue;
            }

            $payload = $submission['selected_option'] ?? $submission['value'] ?? $submission;
            if ($this->gradingService->grade($question, $payload)) {
                $score++;
            }
        }

        return $score;
    }

    public function isAnswerCorrect(int $questionId, array $submission, Module $module): bool
    {
        $question = Question::with('answers')->find($questionId);

        if (! $question || $question->module_id !== $module->id) {
            return false;
        }

        $payload = $submission['selected_option'] ?? $submission['value'] ?? $submission;

        return $this->gradingService->grade($question, $payload);
    }

    public function calculateSandDollars(int $score, int $totalQuestions): int
    {
        if ($totalQuestions === 0) {
            return 0;
        }

        $percentage = ($score / $totalQuestions) * 100;

        if ($percentage == 100) {
            return 50;
        } elseif ($percentage >= 80) {
            return 30;
        } elseif ($percentage >= 50) {
            return 10;
        }

        return 0;
    }
}
