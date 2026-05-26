<?php

namespace App\Services;

use App\Models\Module;
use App\Models\Question;

class QuizService
{
    /**
     * Calculate the score based on the submitted answers.
     * 
     * @param Module $module
     * @param array $submittedAnswers
     * @return int
     */
    public function calculateScore(Module $module, array $submittedAnswers): int
    {
        $score = 0;

        foreach ($submittedAnswers as $submission) {
            $question = Question::with('answers')->find($submission['question_id']);
            if (!$question || $question->module_id !== $module->id) {
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
     * Calculate gamification rewards (Sand Dollars).
     * 
     * @param int $score
     * @param int $totalQuestions
     * @return int
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
