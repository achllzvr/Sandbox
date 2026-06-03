<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Enrollment;
use App\Services\ContentStreamService;
use App\Services\EnrollmentService;
use App\Services\GamificationService;
use App\Support\StudentQuizPayload;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyShellController extends Controller
{
    public function __construct(
        private EnrollmentService $enrollmentService,
        private ContentStreamService $contentStreamService,
        private GamificationService $gamificationService,
    ) {}

    public function show(Request $request, $id)
    {
        $user = $request->user();

        // Verify the user is enrolled in this certification
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('certification_id', $id)
            ->first();

        if (! $enrollment) {
            abort(403, 'You are not enrolled in this Shell.');
        }

        // Load the certification with its nested lessons and modules (and their contents/questions/answers)
        // Also load final exam questions (certifications level)
        $certification = Certification::with([
            'lessons.modules.contents',
            'lessons.modules.questions.answers',
            'examQuestions.answers',
            'creator',
        ])->findOrFail($id);

        // Get the IDs of all modules the user has completed
        $completedModuleIds = $user->completedModules()->pluck('modules.id')->toArray();

        $moduleProgressRows = \App\Models\UserModuleProgress::where('user_id', $user->id)
            ->whereIn('module_id', $certification->lessons->flatMap->modules->pluck('id'))
            ->get()
            ->keyBy('module_id');

        $moduleProgress = $moduleProgressRows->map(fn ($row) => [
            'is_completed' => (bool) $row->is_completed,
            'score' => $row->score,
            'completed_at' => $row->completed_at,
        ])->all();

        // Calculate total modules
        $totalModules = $certification->lessons->sum(function ($lesson) {
            return $lesson->modules->count();
        });

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

        $examStatus = [
            'has_passed' => $hasPassedExam,
            'has_certificate' => $hasCertificate,
            'attempt_count' => $examAttempts->count(),
            'latest_score' => $latestAttempt?->score,
            'latest_total' => $latestAttempt?->total_questions,
            'latest_passed' => (bool) ($latestAttempt?->passed ?? false),
        ];

        $shellMeta = [
            'id' => (int) $id,
            'title' => strtoupper($certification->title),
            'badge_type' => stripos($certification->title, 'java') !== false ? 'github' : 'pro',
            'badge_label' => stripos($certification->title, 'java') !== false ? 'GITHUB VERIFIED CERTIFICATE' : 'Professional Certificate',
            'github_verified' => stripos($certification->title, 'java') !== false,
            'progress' => $progress['percentage'],
            'completed_modules' => $progress['completed_modules'],
            'total_modules' => $progress['total_modules'],
            'cover_image' => \App\Support\CertificationCover::url($certification->thumbnail, (int) $certification->id),
            'accent_color' => $certification->accent_color,
            'theme' => ['pink', 'blue', 'green'][((int) $id - 1) % 3],
        ];

        return Inertia::render('Student/Shells/Show', [
            'certification' => StudentQuizPayload::certification($certification, $user->id, $this->contentStreamService),
            'progress' => $progress,
            'moduleProgress' => $moduleProgress,
            'shellMeta' => $shellMeta,
            'examStatus' => $examStatus,
            'certificate' => $certificateRow ? [
                'code' => $certificateRow->certificate_code,
                'issued_at' => $certificateRow->issued_at,
                'public_url' => route('certificates.public', $certificateRow->certificate_code),
            ] : null,
        ]);
    }

    public function completeModule(Request $request, \App\Models\Module $module)
    {
        $user = $request->user();
        $this->enrollmentService->assertEnrolledForModule($user, $module);

        \App\Models\UserModuleProgress::updateOrCreate(
            ['user_id' => $user->id, 'module_id' => $module->id],
            ['is_completed' => 1, 'completed_at' => now()]
        );

        $this->gamificationService->recordActivity($user);
        $this->gamificationService->award($user, 5, 'module_complete', \App\Models\Module::class, $module->id);

        return redirect()->back()->with('success', 'Module marked as completed!');
    }
}
