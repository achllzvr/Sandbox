<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Enrollment;
use App\Services\ExamService;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    protected ExamService $examService;

    public function __construct(ExamService $examService)
    {
        $this->examService = $examService;
    }

    public function submit(Request $request, Certification $certification)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.selected_option' => 'required|exists:answers,id',
        ]);

        $user = $request->user();

        // Grade exam and save attempt
        $result = $this->examService->gradeAndSaveAttempt($user->id, $certification, $validated['answers']);

        // Check if passed and unlock certificate
        if ($result['passed']) {
            return back();
        }

        return back()->withErrors(['exam' => "Final Exam Failed. You scored {$result['score']}/{$result['total_questions']}. Please review the Sandboxes and try again."]);
    }

    public function check(Request $request, Certification $certification)
    {
        $user = $request->user();

        $enrolled = Enrollment::where('user_id', $user->id)
            ->where('certification_id', $certification->id)
            ->exists();

        if (! $enrolled) {
            abort(403, 'You are not enrolled in this Shell.');
        }

        $validated = $request->validate([
            'question_id' => 'required|integer|exists:questions,id',
            'selected_option' => 'required|integer|exists:answers,id',
        ]);

        $correct = $this->examService->isAnswerCorrect(
            (int) $validated['question_id'],
            (int) $validated['selected_option'],
            $certification,
        );

        return response()->json(['correct' => $correct]);
    }
}
