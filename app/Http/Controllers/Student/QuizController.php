<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\UserModuleProgress;
use App\Services\EnrollmentService;
use App\Services\GamificationService;
use App\Services\QuizService;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function __construct(
        private QuizService $quizService,
        private EnrollmentService $enrollmentService,
        private GamificationService $gamificationService,
    ) {}

    public function submit(Request $request, Module $module)
    {
        $user = $request->user();
        $this->enrollmentService->assertEnrolledForModule($user, $module);

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.selected_option' => 'nullable|exists:answers,id',
            'answers.*.value' => 'nullable',
        ]);

        $existing = UserModuleProgress::where('user_id', $user->id)
            ->where('module_id', $module->id)
            ->first();

        if ($existing?->is_completed) {
            return back()->with('info', 'This sandbox has already been completed.');
        }

        $score = $this->quizService->calculateScore($module, $validated['answers']);
        $totalQuestions = count($validated['answers']);

        $sandDollars = $this->quizService->calculateSandDollars($score, $totalQuestions);
        if ($sandDollars > 0) {
            $this->gamificationService->award(
                $user,
                $sandDollars,
                'quiz_pass',
                Module::class,
                $module->id,
                ['score' => $score, 'total' => $totalQuestions],
            );
        }

        if ($totalQuestions > 0 && $score === $totalQuestions) {
            $this->gamificationService->unlockAchievement($user, 'quiz_ace');
        }

        $this->gamificationService->recordActivity($user);

        UserModuleProgress::updateOrCreate(
            ['user_id' => $user->id, 'module_id' => $module->id],
            [
                'score' => $score,
                'is_completed' => 1,
                'completed_at' => now(),
            ]
        );

        return back()->with('success', "Sandbox Completed! +{$sandDollars} Sand Dollars");
    }

    public function check(Request $request, Module $module)
    {
        $user = $request->user();
        $this->enrollmentService->assertEnrolledForModule($user, $module);

        $validated = $request->validate([
            'question_id' => 'required|integer|exists:questions,id',
            'selected_option' => 'nullable|integer|exists:answers,id',
            'value' => 'nullable',
        ]);

        $correct = $this->quizService->isAnswerCorrect(
            (int) $validated['question_id'],
            $validated,
            $module,
        );

        return response()->json(['correct' => $correct]);
    }
}
