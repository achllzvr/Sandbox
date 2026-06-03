<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Services\EnrollmentService;
use App\Services\ExamService;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function __construct(
        private ExamService $examService,
        private EnrollmentService $enrollmentService,
    ) {}

    public function submit(Request $request, Certification $certification)
    {
        $user = $request->user();
        $this->enrollmentService->assertEnrolled($user, (int) $certification->id);

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.selected_option' => 'required|exists:answers,id',
        ]);

        $result = $this->examService->gradeAndSaveAttempt($user->id, $certification, $validated['answers']);

        if ($result['passed']) {
            return back();
        }

        return back()->withErrors(['exam' => "Final Exam Failed. You scored {$result['score']}/{$result['total_questions']}. Please review the Sandboxes and try again."]);
    }

    public function check(Request $request, Certification $certification)
    {
        $user = $request->user();
        $this->enrollmentService->assertEnrolled($user, (int) $certification->id);

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
