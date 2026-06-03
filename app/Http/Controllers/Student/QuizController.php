<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\ModuleQuizAttempt;
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
    ) {
    }

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

        $moduleType = $this->quizService->classifyModule($module);

        if ($moduleType === 'quiz') {
            $hasAttempt = ModuleQuizAttempt::where('user_id', $user->id)
                ->where('module_id', $module->id)
                ->exists();

            if ($hasAttempt) {
                abort(403, 'This quiz has already been submitted and cannot be retaken.');
            }
        }

        $answerRecords = $this->quizService->buildAttemptAnswers($module, $validated['answers']);
        $score = collect($answerRecords)->where('is_correct', true)->count();
        $totalQuestions = count($answerRecords);
        $passed = $this->quizService->passed($score, $totalQuestions);

        $existing = UserModuleProgress::where('user_id', $user->id)
            ->where('module_id', $module->id)
            ->first();

        $priorAttemptCount = ModuleQuizAttempt::where('user_id', $user->id)
            ->where('module_id', $module->id)
            ->count();

        ModuleQuizAttempt::create([
            'user_id' => $user->id,
            'module_id' => $module->id,
            'attempt_number' => $priorAttemptCount + 1,
            'score' => $score,
            'total' => $totalQuestions,
            'passed' => $passed,
            'answers_json' => $answerRecords,
            'completed_at' => now(),
        ]);

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

        $bestScore = max($score, (int) ($existing?->score ?? 0));

        UserModuleProgress::updateOrCreate(
            ['user_id' => $user->id, 'module_id' => $module->id],
            [
                'score' => $bestScore,
                'is_completed' => 1,
                'completed_at' => $existing?->completed_at ?? now(),
            ]
        );

        return back()->with([
            'success' => "Sandbox Completed! +{$sandDollars} Sand Dollars",
            'assessment_result' => [
                'type' => $moduleType,
                'module_id' => $module->id,
                'score' => $score,
                'total' => $totalQuestions,
                'passed' => $passed,
                'attempt_number' => $priorAttemptCount + 1,
                'answers' => $answerRecords,
            ],
        ]);
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
