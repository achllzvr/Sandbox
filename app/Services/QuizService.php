<?php

namespace App\Services;

use App\Models\Module;
use App\Models\Question;

class QuizService
{
    /**
     * Calculate the score based on the submitted answers.
     */
    public function calculateScore(Module $module, array $submittedAnswers): int
    {
        $score = 0;

        foreach ($submittedAnswers as $submission) {
            $question = Question::with('answers')->find($submission['question_id']);
            if (! $question || $question->module_id !== $module->id) {
                continue; // Skip invalid questions
            }

            $selectedAnswer = collect($question->answers)->firstWhere('id', $submission['selected_option']);
            if ($selectedAnswer && $selectedAnswer->is_correct) {
                $score++;
            }
        }

        return $score;
    }

    /**
     * Check a single answer without revealing which option is correct.
     */
    public function isAnswerCorrect(int $questionId, int $selectedOptionId, Module $module): bool
    {
        $question = Question::with('answers')->find($questionId);

        if (! $question || $question->module_id !== $module->id) {
            return false;
        }

        $selectedAnswer = $question->answers->firstWhere('id', $selectedOptionId);

        return $selectedAnswer && $selectedAnswer->is_correct;
    }

    /**
     * Calculate gamification rewards (Sand Dollars).
     */
    public function calculateSandDollars(int $score, int $totalQuestions): int
    {
        if ($totalQuestions === 0) {
            return 0;
        }

        $percentage = ($score / $totalQuestions) * 100;

        // Award logic: 50 Sand Dollars for a perfect score, otherwise proportional.
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
