<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\UserModuleProgress;
use App\Services\QuizService;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    protected QuizService $quizService;

    public function __construct(QuizService $quizService)
    {
        $this->quizService = $quizService;
    }

    public function submit(Request $request, Module $module)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.selected_option' => 'required|exists:answers,id',
        ]);

        $user = $request->user();

        // Ensure user hasn't already completed this module?
        // Let's allow retakes of the sandbox quiz if they want, but typically progress is linear.
        // The instructions say "Grades the assessment... Updates score, calculates gamification".

        $existing = UserModuleProgress::where('user_id', $user->id)
            ->where('module_id', $module->id)
            ->first();

        if ($existing?->is_completed) {
            return back()->with('info', 'This sandbox has already been completed.');
        }

        $score = $this->quizService->calculateScore($module, $validated['answers']);
        $totalQuestions = count($validated['answers']); // Or $module->questions()->count()

        // Give gamification rewards
        $sandDollars = $this->quizService->calculateSandDollars($score, $totalQuestions);
        if ($sandDollars > 0) {
            $user->sand_dollars += $sandDollars;
            $user->save();
        }

        // Database Updates
        UserModuleProgress::updateOrCreate(
            ['user_id' => $user->id, 'module_id' => $module->id],
            [
                'score' => $score,
                'is_completed' => 1,
                'completed_at' => now(),
            ]
        );

        // We return a simple JSON response because Inertia's `router.post` with `preserveScroll`
        // or a manual Axios call can handle this gracefully without triggering a full map reload,
        // which allows the frontend to show the "Sandbox Finished" screen first!
        // Wait, Sandbox Docs Template 2 says:
        // return redirect()->route('shells.map', $module->certification_id)->with('success', 'Sandbox Passed!');
        // If we redirect, it goes back to the map immediately.
        // Let's do back() so the React component can transition to the Sandbox Finished screen.

        return back()->with('success', "Sandbox Completed! +{$sandDollars} Sand Dollars");
    }

    public function check(Request $request, Module $module)
    {
        $validated = $request->validate([
            'question_id' => 'required|integer|exists:questions,id',
            'selected_option' => 'required|integer|exists:answers,id',
        ]);

        $correct = $this->quizService->isAnswerCorrect(
            (int) $validated['question_id'],
            (int) $validated['selected_option'],
            $module,
        );

        return response()->json(['correct' => $correct]);
    }
}
