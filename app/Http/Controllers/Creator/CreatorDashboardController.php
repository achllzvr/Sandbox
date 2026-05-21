<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Question;
use Carbon\Carbon;
use Inertia\Inertia;

class CreatorDashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        // ── Core counts ──────────────────────────────────────────
        $certificationIds = Certification::where('created_by_user_id', $userId)->pluck('id');
        $totalCertifications = $certificationIds->count();

        $lessonIds = Lesson::whereIn('certification_id', $certificationIds)->pluck('id');
        $totalLessons = $lessonIds->count();

        $moduleIds = Module::whereIn('lesson_id', $lessonIds)->pluck('id');
        $totalModules = $moduleIds->count();

        $totalQuestions = Question::whereIn('certification_id', $certificationIds)->count();

        // ── Status breakdown ─────────────────────────────────────
        $draft     = Certification::where('created_by_user_id', $userId)->where('status', 'draft')->count();
        $pending   = Certification::where('created_by_user_id', $userId)->where('status', 'pending_approval')->count();
        $published = Certification::where('created_by_user_id', $userId)->where('status', 'published')->count();
        $declined  = Certification::where('created_by_user_id', $userId)->where('status', 'declined')->count();

        // ── Weekly activity (last 7 days) ────────────────────────
        $weekStart = Carbon::now()->subDays(6)->startOfDay();
        $weeklyActivity = [];
        for ($i = 0; $i < 7; $i++) {
            $day = Carbon::now()->subDays(6 - $i);
            $dayLabel = $day->format('D');
            $dayStart = $day->copy()->startOfDay();
            $dayEnd   = $day->copy()->endOfDay();

            $weeklyActivity[] = [
                'day'     => $dayLabel,
                'shells'  => Certification::where('created_by_user_id', $userId)
                    ->whereBetween('created_at', [$dayStart, $dayEnd])->count(),
                'lessons' => Lesson::whereIn('certification_id', $certificationIds)
                    ->whereBetween('created_at', [$dayStart, $dayEnd])->count(),
                'modules' => Module::whereIn('lesson_id', $lessonIds)
                    ->whereBetween('created_at', [$dayStart, $dayEnd])->count(),
            ];
        }

        // ── Content health: modules needing questions ────────────
        $modulesNeedingQuestions = Module::whereIn('lesson_id', $lessonIds)
            ->withCount('questions')
            ->having('questions_count', '<', 5)
            ->with('lesson:id,title')
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'lesson_id', 'created_at']);

        // ── Recent certifications ────────────────────────────────
        $recentCertifications = Certification::where('created_by_user_id', $userId)
            ->withCount(['lessons'])
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'status', 'price', 'created_at']);

        // ── Recent lessons ───────────────────────────────────────
        $recentLessons = Lesson::whereIn('certification_id', $certificationIds)
            ->with('certification:id,title')
            ->withCount('modules')
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'certification_id', 'created_at']);

        // ── Completion percentage ────────────────────────────────
        // Shells with at least one lesson that has at least one module with ≥ 1 question
        $completedShells = 0;
        if ($totalCertifications > 0) {
            $completedShells = Certification::where('created_by_user_id', $userId)
                ->whereHas('lessons.modules.questions')
                ->count();
        }
        $completionPct = $totalCertifications > 0
            ? round(($completedShells / $totalCertifications) * 100)
            : 0;

        return Inertia::render('Creator/Dashboard', [
            'metrics' => [
                'total_certifications' => $totalCertifications,
                'total_lessons'        => $totalLessons,
                'total_modules'        => $totalModules,
                'total_questions'      => $totalQuestions,
                'draft'                => $draft,
                'pending'              => $pending,
                'published'            => $published,
                'declined'             => $declined,
                'completion_pct'       => $completionPct,
            ],
            'weekly_activity'            => $weeklyActivity,
            'modules_needing_questions'  => $modulesNeedingQuestions,
            'recent_certifications'      => $recentCertifications,
            'recent_lessons'             => $recentLessons,
        ]);
    }
}
