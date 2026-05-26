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

        $totalLearningMaterials = \App\Models\LearningMaterial::whereIn('certification_id', $certificationIds)->count();

        $totalQuizQuestions = Question::whereIn('learning_material_id', \App\Models\LearningMaterial::whereIn('certification_id', $certificationIds)->pluck('id'))
            ->where('question_type', 'module_quiz')
            ->count();

        $totalExamQuestions = Question::whereIn('certification_id', $certificationIds)
            ->where('question_type', 'final_exam')
            ->count();

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
                'day'       => $dayLabel,
                'shells'    => Certification::where('created_by_user_id', $userId)
                    ->whereBetween('created_at', [$dayStart, $dayEnd])->count(),
                'materials' => \App\Models\LearningMaterial::whereIn('certification_id', $certificationIds)
                    ->whereBetween('created_at', [$dayStart, $dayEnd])->count(),
                'questions' => Question::where(function($query) use ($certificationIds) {
                        $query->whereIn('certification_id', $certificationIds)
                            ->orWhereIn('learning_material_id', \App\Models\LearningMaterial::whereIn('certification_id', $certificationIds)->pluck('id'));
                    })
                    ->whereBetween('created_at', [$dayStart, $dayEnd])->count(),
            ];
        }

        // ── Content health: materials needing questions ──────────
        $materialsNeedingQuestions = \App\Models\LearningMaterial::whereIn('certification_id', $certificationIds)
            ->withCount('quizQuestions')
            ->having('quiz_questions_count', '>', 0)
            ->having('quiz_questions_count', '<', 5)
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'certification_id', 'created_at']);

        // ── Recent certifications ────────────────────────────────
        $recentCertifications = Certification::where('created_by_user_id', $userId)
            ->withCount(['learningMaterials'])
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'status', 'price', 'created_at']);

        // ── Recent materials ─────────────────────────────────────
        $recentMaterials = \App\Models\LearningMaterial::whereIn('certification_id', $certificationIds)
            ->with('certification:id,title')
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'certification_id', 'created_at']);

        // ── Completion percentage ────────────────────────────────
        $completedShells = 0;
        if ($totalCertifications > 0) {
            $completedShells = Certification::where('created_by_user_id', $userId)
                ->has('learningMaterials')
                ->whereHas('examQuestions', null, '>=', 5)
                ->count();
        }
        $completionPct = $totalCertifications > 0
            ? round(($completedShells / $totalCertifications) * 100)
            : 0;

        return Inertia::render('Creator/Dashboard', [
            'metrics' => [
                'total_certifications'     => $totalCertifications,
                'total_learning_materials' => $totalLearningMaterials,
                'total_quiz_questions'     => $totalQuizQuestions,
                'total_exam_questions'     => $totalExamQuestions,
                'draft'                    => $draft,
                'pending'                  => $pending,
                'published'                => $published,
                'declined'                 => $declined,
                'completion_pct'           => $completionPct,
            ],
            'weekly_activity'              => $weeklyActivity,
            'materials_needing_questions'  => $materialsNeedingQuestions,
            'recent_certifications'        => $recentCertifications,
            'recent_materials'             => $recentMaterials,
        ]);
    }
}
