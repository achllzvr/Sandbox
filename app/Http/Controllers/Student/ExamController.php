<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certification;
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
            return back()->with('success', "Final Exam Passed! ({$result['score']}/{$result['total_questions']})");
        }

        return back()->withErrors(['exam' => "Final Exam Failed. You scored {$result['score']}/{$result['total_questions']}. Please review the Sandboxes and try again."]);
    }
}
