<?php

namespace App\Services;

use App\Models\Module;
use App\Models\Question;
use App\Services\Ai\StatementEquivalenceGrader;

class QuizService
{
    public const PASS_PERCENTAGE = 80;

    public function __construct(private QuestionGradingService $gradingService)
    {
    }

    public function classifyModule(Module $module): string
    {
        $module->loadCount(['contents', 'questions']);

        $questionCount = (int) $module->questions_count;
        $hasContent = (int) $module->contents_count > 0;

        if ($questionCount >= 5 && $hasContent) {
            return 'test';
        }

        if ($questionCount >= 5) {
            return 'quiz';
        }

        return 'content_only';
    }

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

    /**
     * @return array<int, array<string, mixed>>
     */
    public function buildAttemptAnswers(Module $module, array $submittedAnswers): array
    {
        $records = [];

        foreach ($submittedAnswers as $submission) {
            $question = Question::with('answers')->find($submission['question_id']);
            if (! $question || $question->module_id !== $module->id) {
                continue;
            }

            $payload = $submission['selected_option'] ?? $submission['value'] ?? $submission;
            $isCorrect = $this->gradingService->grade($question, $payload);
            $aiFeedback = null;

            if (($question->interaction_type ?? '') === 'true_false_ai') {
                $details = app(StatementEquivalenceGrader::class)->gradeWithDetails(
                    $question,
                    (string) ($submission['value'] ?? ''),
                );
                $aiFeedback = $details['feedback'] ?? null;
            }

            $records[] = [
                'question_id' => (int) $question->id,
                'selected_option' => isset($submission['selected_option']) ? (int) $submission['selected_option'] : null,
                'value' => $submission['value'] ?? null,
                'is_correct' => $isCorrect,
                'ai_feedback' => $aiFeedback,
            ];
        }

        return $records;
    }

    public function passed(int $score, int $total): bool
    {
        if ($total === 0) {
            return false;
        }

        return ($score / $total) * 100 >= self::PASS_PERCENTAGE;
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
