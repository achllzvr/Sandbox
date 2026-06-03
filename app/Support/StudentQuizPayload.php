<?php

namespace App\Support;

use App\Models\Certification;
use App\Services\ContentStreamService;
use Illuminate\Support\Collection;

class StudentQuizPayload
{
    /**
     * Certification payload for student quiz/exam views — never includes is_correct or grading metadata.
     */
    public static function certification(
        Certification $certification,
        ?int $userId = null,
        ?ContentStreamService $streamService = null,
    ): array {
        $certification->loadMissing([
            'lessons.modules.contents',
            'lessons.modules.questions.answers',
            'examQuestions.answers',
            'creator',
        ]);

        $creator = $certification->creator;

        return [
            'id' => $certification->id,
            'title' => $certification->title,
            'pass_threshold' => $certification->pass_threshold,
            'creator' => $creator ? [
                'first_name' => $creator->first_name,
                'last_name' => $creator->last_name,
                'full_name' => trim($creator->first_name.' '.$creator->last_name),
            ] : null,
            'exam_questions' => self::questions($certification->examQuestions),
            'lessons' => $certification->lessons->map(fn ($lesson) => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'modules' => $lesson->modules->map(function ($module) use ($userId, $streamService) {
                    $contents = $module->contents;
                    if ($userId && $streamService) {
                        $contents = collect($streamService->mapContentsForStudent($contents, $userId));
                    }

                    return [
                        'id' => $module->id,
                        'title' => $module->title,
                        'contents' => $contents,
                        'questions' => self::questions($module->questions),
                    ];
                })->values()->all(),
            ])->values()->all(),
        ];
    }

    public static function questions(Collection $questions): array
    {
        return $questions->map(fn ($question) => [
            'id' => $question->id,
            'question_text' => $question->question_text,
            'interaction_type' => $question->interaction_type ?? 'multiple_choice',
            'student_metadata' => self::studentMetadata($question),
            'answers' => $question->answers->map(fn ($answer) => [
                'id' => $answer->id,
                'answer_text' => $answer->answer_text,
            ])->values()->all(),
        ])->values()->all();
    }

    private static function studentMetadata($question): ?array
    {
        $meta = $question->metadata ?? null;
        if (! is_array($meta)) {
            return null;
        }

        $safe = $meta;
        unset(
            $safe['correct'],
            $safe['correct_order'],
            $safe['reference_true_statement'],
            $safe['expected_output'],
        );

        if (($question->interaction_type ?? 'multiple_choice') === 'matching' && isset($safe['pairs'])) {
            $safe['pairs'] = collect($safe['pairs'])->map(fn ($pair) => [
                'id' => $pair['id'] ?? null,
                'left' => $pair['left'] ?? '',
                'right_options' => collect($safe['pairs'])->pluck('right')->shuffle()->values()->all(),
            ])->all();
        }

        if (($question->interaction_type ?? '') === 'sequence' && isset($safe['items'])) {
            $safe['items'] = collect($safe['items'])->shuffle()->values()->all();
            unset($safe['correct_order']);
        }

        return $safe ?: null;
    }
}
