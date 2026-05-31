<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Enrollment;
use Inertia\Inertia;
use Illuminate\Http\Request;

class MyShellController extends Controller
{
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
            'creator'
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

        $enrollmentIndex = Enrollment::where('user_id', $user->id)
            ->orderBy('id')
            ->pluck('certification_id')
            ->search((int) $id);

        $shellMeta = [
            'id' => (int) $id,
            'title' => strtoupper($certification->title),
            'badge_type' => stripos($certification->title, 'java') !== false ? 'github' : 'pro',
            'badge_label' => stripos($certification->title, 'java') !== false ? 'GITHUB VERIFIED CERTIFICATE' : 'Professional Certificate',
            'github_verified' => stripos($certification->title, 'java') !== false,
            'progress' => $progress['percentage'],
            'completed_modules' => $progress['completed_modules'],
            'total_modules' => $progress['total_modules'],
            'cover_image' => $certification->thumbnail ? asset('storage/'.$certification->thumbnail) : null,
            'theme' => ['pink', 'blue', 'green'][($enrollmentIndex !== false ? $enrollmentIndex : 0) % 3],
        ];

        return Inertia::render('Student/Shells/Show', [
            'certification' => $certification,
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

        \App\Models\UserModuleProgress::updateOrCreate(
            ['user_id' => $user->id, 'module_id' => $module->id],
            ['is_completed' => 1, 'completed_at' => now()]
        );

        return redirect()->back()->with('success', 'Module marked as completed!');
    }
}
