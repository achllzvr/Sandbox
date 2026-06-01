<?php

namespace App\Support;

use App\Models\Certification;
use Illuminate\Support\Collection;

class StudentQuizPayload
{
    /**
     * Certification payload for student quiz/exam views — never includes is_correct.
     */
    public static function certification(Certification $certification): array
    {
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
                'modules' => $lesson->modules->map(fn ($module) => [
                    'id' => $module->id,
                    'title' => $module->title,
                    'contents' => $module->contents,
                    'questions' => self::questions($module->questions),
                ])->values()->all(),
            ])->values()->all(),
        ];
    }

    public static function questions(Collection $questions): array
    {
        return $questions->map(fn ($question) => [
            'id' => $question->id,
            'question_text' => $question->question_text,
            'answers' => $question->answers->map(fn ($answer) => [
                'id' => $answer->id,
                'answer_text' => $answer->answer_text,
            ])->values()->all(),
        ])->values()->all();
    }
}
