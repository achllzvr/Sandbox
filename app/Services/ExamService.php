<?php

namespace App\Services;

use App\Models\Certification;
use App\Models\Question;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ExamService
{
    /**
     * Grade the exam and save the attempt.
     * 
     * @param int $userId
     * @param Certification $certification
     * @param array $submittedAnswers
     * @return array
     */
    public function gradeAndSaveAttempt(int $userId, Certification $certification, array $submittedAnswers): array
    {
        $score = 0;
        $totalQuestions = count($submittedAnswers);
        $answerRecords = [];

        foreach ($submittedAnswers as $submission) {
            $question = Question::with('answers')->find($submission['question_id']);
            if (!$question) {
                continue;
            }

            $selectedAnswer = collect($question->answers)->firstWhere('id', $submission['selected_option']);
            $isCorrect = $selectedAnswer && $selectedAnswer->is_correct ? 1 : 0;
            
            if ($isCorrect) {
                $score++;
            }

            $answerRecords[] = [
                'question_id' => $submission['question_id'],
                'selected_answer_id' => $submission['selected_option'],
                'is_correct' => $isCorrect,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $percentage = $totalQuestions > 0 ? ($score / $totalQuestions) * 100 : 0;
        $passed = $percentage >= $certification->pass_threshold;

        // Save Attempt
        $attemptId = DB::table('exam_attempts')->insertGetId([
            'user_id' => $userId,
            'certification_id' => $certification->id,
            'score' => $score,
            'total_questions' => $totalQuestions,
            'passed' => $passed ? 1 : 0,
            'attempted_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Save Attempt Answers
        foreach ($answerRecords as &$record) {
            $record['attempt_id'] = $attemptId;
        }
        DB::table('exam_attempt_answers')->insert($answerRecords);

        if ($passed) {
            $existing = DB::table('certificates')
                ->where('user_id', $userId)
                ->where('certification_id', $certification->id)
                ->where('status', 'valid')
                ->exists();

            if (! $existing) {
                DB::table('certificates')->insert([
                    'user_id' => $userId,
                    'certification_id' => $certification->id,
                    'exam_attempt_id' => $attemptId,
                    'certificate_code' => 'HERMIT-'.strtoupper(Str::random(10)),
                    'status' => 'valid',
                    'issued_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        return [
            'score' => $score,
            'total_questions' => $totalQuestions,
            'passed' => $passed,
        ];
    }
}
