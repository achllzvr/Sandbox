<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Enrollment;
use App\Models\Module;
use App\Models\ModuleQuizAttempt;
use App\Services\ContentStreamService;
use App\Services\EnrollmentService;
use App\Services\FinalExamAccessService;
use App\Services\GamificationService;
use App\Services\QuizService;
use App\Support\StudentQuizPayload;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyShellController extends Controller
{
    public function __construct(
        private EnrollmentService $enrollmentService,
        private ContentStreamService $contentStreamService,
        private GamificationService $gamificationService,
        private QuizService $quizService,
        private FinalExamAccessService $finalExamAccess,
    ) {
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('certification_id', $id)
            ->first();

        if (! $enrollment) {
            abort(403, 'You are not enrolled in this Shell.');
        }

        $certification = Certification::with([
            'lessons.modules.contents',
            'lessons.modules.questions.answers',
            'examQuestions.answers',
            'creator',
        ])->findOrFail($id);

        $allModules = $certification->lessons->flatMap->modules;
        $moduleIds = $allModules->pluck('id');

        $completedModuleIds = $user->completedModules()->pluck('modules.id')->toArray();

        $moduleProgressRows = \App\Models\UserModuleProgress::where('user_id', $user->id)
            ->whereIn('module_id', $moduleIds)
            ->get()
            ->keyBy('module_id');

        $moduleProgress = $moduleProgressRows->map(fn ($row) => [
            'is_completed' => (bool) $row->is_completed,
            'score' => $row->score,
            'completed_at' => $row->completed_at,
        ])->all();

        $moduleTypes = $allModules->mapWithKeys(function (Module $module) {
            return [$module->id => $this->quizService->classifyModule($module)];
        })->all();

        $quizAttempts = ModuleQuizAttempt::where('user_id', $user->id)
            ->whereIn('module_id', $moduleIds)
            ->orderBy('module_id')
            ->orderBy('attempt_number')
            ->get()
            ->groupBy('module_id');

        $attemptHistory = [];
        foreach ($allModules as $module) {
            if (($moduleTypes[$module->id] ?? '') !== 'test') {
                continue;
            }

            $attempts = $quizAttempts->get($module->id, collect());
            if ($attempts->isEmpty()) {
                continue;
            }

            $attemptHistory[$module->id] = $attempts->map(function (ModuleQuizAttempt $attempt) {
                $answers = collect($attempt->answers_json ?? [])->map(function (array $answer) {
                    if (! empty($answer['correct_answer'])) {
                        return $answer;
                    }

                    $question = \App\Models\Question::with('answers')->find($answer['question_id'] ?? null);
                    if ($question) {
                        $answer['correct_answer'] = $this->quizService->correctAnswerLabel($question);
                    }

                    return $answer;
                })->values()->all();

                return [
                    'attempt_number' => $attempt->attempt_number,
                    'score' => $attempt->score,
                    'total' => $attempt->total,
                    'passed' => $attempt->passed,
                    'completed_at' => $attempt->completed_at,
                    'answers' => $answers,
                ];
            })->sortByDesc('attempt_number')->values()->all();
        }

        $latestQuizAttempts = [];
        foreach ($quizAttempts as $moduleId => $attempts) {
            $latest = $attempts->sortByDesc('attempt_number')->first();
            if ($latest) {
                $answers = collect($latest->answers_json ?? [])->map(function (array $answer) {
                    if (! empty($answer['correct_answer'])) {
                        return $answer;
                    }

                    $question = \App\Models\Question::with('answers')->find($answer['question_id'] ?? null);
                    if ($question) {
                        $answer['correct_answer'] = $this->quizService->correctAnswerLabel($question);
                    }

                    return $answer;
                })->values()->all();

                $latestQuizAttempts[$moduleId] = [
                    'score' => $latest->score,
                    'total' => $latest->total,
                    'passed' => $latest->passed,
                    'attempt_number' => $latest->attempt_number,
                    'answers' => $answers,
                ];
            }
        }

        $totalModules = $allModules->count();

        $progress = [
            'completed_modules' => count($completedModuleIds),
            'total_modules' => $totalModules,
            'completed_module_ids' => $completedModuleIds,
            'percentage' => $totalModules > 0 ? (count($completedModuleIds) / $totalModules) * 100 : 0,
        ];

        $examAttempts = \Illuminate\Support\Facades\DB::table('exam_attempts')
            ->where('user_id', $user->id)
            ->where('certification_id', $id)
            ->orderByDesc('attempted_at')
            ->get();

        $certificateRow = \Illuminate\Support\Facades\DB::table('certificates')
            ->where('user_id', $user->id)
            ->where('certification_id', $id)
            ->where('status', 'valid')
            ->first();

        $hasCertificate = (bool) $certificateRow;

        $latestAttempt = $examAttempts->first();
        $hasPassedExam = $hasCertificate || $examAttempts->contains(fn ($row) => (bool) $row->passed);

        $examAttemptsChronological = $examAttempts->sortBy('attempted_at')->values();
        $examAttemptHistory = $examAttemptsChronological->map(function ($attempt, $index) {
            $answerRows = \Illuminate\Support\Facades\DB::table('exam_attempt_answers')
                ->where('attempt_id', $attempt->id)
                ->get();

            $answers = $answerRows->map(function ($row) {
                $question = \App\Models\Question::with('answers')->find($row->question_id);

                return [
                    'question_id' => (int) $row->question_id,
                    'selected_option' => $row->selected_answer_id ? (int) $row->selected_answer_id : null,
                    'is_correct' => (bool) $row->is_correct,
                    'ai_feedback' => null,
                    'correct_answer' => $question ? $this->quizService->correctAnswerLabel($question) : null,
                ];
            })->values()->all();

            return [
                'attempt_number' => $index + 1,
                'score' => $attempt->score,
                'total' => $attempt->total_questions,
                'passed' => (bool) $attempt->passed,
                'completed_at' => $attempt->attempted_at,
                'answers' => $answers,
            ];
        })->reverse()->values()->all();

        $latestAttemptBreakdown = $examAttemptHistory[0] ?? null;

        $examStatus = [
            'has_passed' => $hasPassedExam,
            'has_certificate' => $hasCertificate,
            'has_attempted' => $examAttempts->isNotEmpty(),
            'attempt_count' => $examAttempts->count(),
            'latest_score' => $latestAttempt?->score,
            'latest_total' => $latestAttempt?->total_questions,
            'latest_passed' => (bool) ($latestAttempt?->passed ?? false),
            'latestAttempt' => $latestAttemptBreakdown,
            'attemptHistory' => $examAttemptHistory,
            'exam_state' => $this->finalExamAccess->examState(
                $user,
                $certification,
                $progress['completed_modules'],
                $progress['total_modules'],
            ),
            'can_take_final_exam' => $this->finalExamAccess->canTakeFinalExam(
                $user,
                $certification,
                $progress['completed_modules'],
                $progress['total_modules'],
            ),
        ];

        $shellMeta = array_merge(
            [
                'id' => (int) $id,
                'title' => strtoupper($certification->title),
                'progress' => $progress['percentage'],
                'completed_modules' => $progress['completed_modules'],
                'total_modules' => $progress['total_modules'],
                'cover_image' => \App\Support\CertificationCover::url($certification->thumbnail, (int) $certification->id),
                'accent_color' => $certification->accent_color,
                'theme' => ['pink', 'blue', 'green'][((int) $id - 1) % 3],
            ],
            \App\Support\CertificationBadge::meta($certification),
        );

        return Inertia::render('Student/Shells/Show', [
            'certification' => StudentQuizPayload::certification($certification, $user->id, $this->contentStreamService),
            'progress' => $progress,
            'moduleProgress' => $moduleProgress,
            'moduleTypes' => $moduleTypes,
            'attemptHistory' => $attemptHistory,
            'latestQuizAttempts' => $latestQuizAttempts,
            'shellMeta' => $shellMeta,
            'examStatus' => $examStatus,
            'certificate' => $certificateRow ? [
                'code' => $certificateRow->certificate_code,
                'issued_at' => $certificateRow->issued_at,
                'public_url' => route('certificates.public', $certificateRow->certificate_code),
            ] : null,
        ]);
    }

    public function completeModule(Request $request, Module $module)
    {
        $user = $request->user();
        $this->enrollmentService->assertEnrolledForModule($user, $module);

        \App\Models\UserModuleProgress::updateOrCreate(
            ['user_id' => $user->id, 'module_id' => $module->id],
            ['is_completed' => 1, 'completed_at' => now()]
        );

        $this->gamificationService->recordActivity($user);
        $this->gamificationService->award($user, 5, 'module_complete', Module::class, $module->id);

        return redirect()->back()->with('success', 'Module marked as completed!');
    }
}
