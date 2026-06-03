<?php

namespace App\Services;

use App\Models\Certification;
use Exception;

class CertificationService
{
    private const MIN_MODULES = 10;

    private const MIN_QUIZ_ONLY = 2;

    private const MIN_EXAM_QUESTIONS = 5;

    private const MIN_QUIZ_QUESTIONS = 5;

    public function __construct(private AuditLogService $auditService)
    {
    }

    public function submitForApproval(Certification $cert): void
    {
        $this->validateSubmissionRequirements($cert);

        $cert->update([
            'status' => 'pending_review',
            'submitted_at' => now(),
        ]);
        $this->auditService->log('SUBMIT_CERTIFICATION', auth()->id(), ['certification_id' => $cert->id]);
    }

    private function validateSubmissionRequirements(Certification $cert): void
    {
        if (empty($cert->title)) {
            throw new Exception('Certification title is required.');
        }
        if (empty($cert->description)) {
            throw new Exception('Certification description is required.');
        }
        if (empty($cert->category)) {
            throw new Exception('Certification category is required.');
        }
        if (empty($cert->difficulty)) {
            throw new Exception('Certification difficulty is required.');
        }

        $cert->load(['lessons.modules.contents', 'lessons.modules.questions.answers', 'examQuestions.answers']);

        $modules = $cert->lessons->flatMap->modules;

        if ($modules->count() < self::MIN_MODULES) {
            throw new Exception('At least '.self::MIN_MODULES.' sandboxes (modules) are required.');
        }

        $quizOnlyCount = $modules->filter(fn ($module) => $this->isQuizOnlySandbox($module))->count();
        if ($quizOnlyCount < self::MIN_QUIZ_ONLY) {
            throw new Exception('At least '.self::MIN_QUIZ_ONLY.' quiz-only sandboxes are required (no content, ≥5 quiz questions each).');
        }

        foreach ($modules as $module) {
            $hasContent = $module->contents->isNotEmpty();
            $hasQuiz = $module->questions->isNotEmpty();

            if (! $hasContent && ! $hasQuiz) {
                throw new Exception("Sandbox '{$module->title}' must have at least one component (content or practice quiz).");
            }
        }

        if ($cert->examQuestions->count() < self::MIN_EXAM_QUESTIONS) {
            throw new Exception('Final Exam must have at least '.self::MIN_EXAM_QUESTIONS.' questions.');
        }

        foreach ($cert->examQuestions as $question) {
            $this->validateQuestionAnswers($question, "Exam question #{$question->order_index}");
        }

        foreach ($modules as $module) {
            if ($module->questions->isEmpty()) {
                continue;
            }

            if ($module->questions->count() < self::MIN_QUIZ_QUESTIONS) {
                throw new Exception("Practice Quiz for Sandbox '{$module->title}' must have at least ".self::MIN_QUIZ_QUESTIONS.' questions.');
            }

            foreach ($module->questions as $question) {
                $this->validateQuestionAnswers($question, "Quiz question in Sandbox '{$module->title}'");
            }
        }
    }

    private function isQuizOnlySandbox($module): bool
    {
        return $module->contents->isEmpty() && $module->questions->count() >= self::MIN_QUIZ_QUESTIONS;
    }

    private function validateQuestionAnswers($question, string $context): void
    {
        $type = $question->interaction_type ?? 'multiple_choice';

        if ($type === 'true_false') {
            $metadata = is_array($question->metadata) ? $question->metadata : [];

            if (! array_key_exists('correct', $metadata)) {
                throw new Exception("{$context} is missing required metadata for true/false.");
            }

            return;
        }

        if (in_array($type, ['matching', 'sequence', 'true_false_ai', 'code_complete'], true)) {
            if (empty($question->metadata)) {
                throw new Exception("{$context} is missing required metadata for {$type}.");
            }

            return;
        }

        if ($question->answers->count() !== 4) {
            throw new Exception("{$context} must have exactly 4 answers.");
        }

        if ($question->answers->where('is_correct', true)->count() !== 1) {
            throw new Exception("{$context} must have exactly 1 correct answer.");
        }
    }
}
