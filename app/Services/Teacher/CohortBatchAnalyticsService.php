<?php

namespace App\Services\Teacher;

use App\Models\Certification;
use App\Models\Cohort;
use App\Models\ModuleQuizAttempt;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CohortBatchAnalyticsService
{
    public function build(Cohort $cohort, Certification $certification): array
    {
        $modules = $certification->lessons->flatMap->modules->values();
        $moduleIds = $modules->pluck('id')->all();
        $studentIds = $this->studentIdsForCohort($cohort);

        $users = User::whereIn('id', $studentIds)->get()->keyBy('id');
        $completedByUser = $this->completedCountsByUser($studentIds, $moduleIds);
        $certifiedUserIds = DB::table('certificates')
            ->where('certification_id', $certification->id)
            ->whereIn('user_id', $studentIds)
            ->pluck('user_id')
            ->all();

        $examAttemptCounts = DB::table('exam_attempts')
            ->select('user_id', DB::raw('COUNT(*) as attempts'))
            ->where('certification_id', $certification->id)
            ->whereIn('user_id', $studentIds)
            ->groupBy('user_id')
            ->pluck('attempts', 'user_id');

        $avgQuizScoreByUser = $this->averageQuizScoreByUser($studentIds, $moduleIds);

        $completionBuckets = ['not_started' => 0, 'in_progress' => 0, 'certified' => 0];
        $students = [];

        foreach ($studentIds as $userId) {
            $user = $users->get($userId);
            if (! $user) {
                continue;
            }

            $completed = $completedByUser[$userId] ?? 0;
            $isCertified = in_array($userId, $certifiedUserIds, true);
            $bucket = $isCertified
                ? 'certified'
                : ($completed > 0 ? 'in_progress' : 'not_started');
            $completionBuckets[$bucket]++;

            $students[] = [
                'id' => $userId,
                'name' => trim($user->first_name.' '.$user->last_name) ?: '—',
                'email' => $user->email,
                'status' => $this->studentStatusLabel($completed, $modules->count(), $isCertified, $modules),
                'avg_score' => $this->formatAvgScore($avgQuizScoreByUser[$userId] ?? null),
                'exam_attempts' => (int) ($examAttemptCounts[$userId] ?? 0),
            ];
        }

        return [
            'is_mock' => false,
            'certification_id' => $certification->id,
            'cohort_id' => $cohort->id,
            'batch_label' => strtoupper($cohort->cohort_name ?? 'Batch'),
            'completion' => [
                ['key' => 'not_started', 'label' => 'Not started', 'count' => $completionBuckets['not_started'], 'color' => '#706fd3'],
                ['key' => 'in_progress', 'label' => 'In Progress', 'count' => $completionBuckets['in_progress'], 'color' => '#8896e8'],
                ['key' => 'certified', 'label' => 'Certified', 'count' => $completionBuckets['certified'], 'color' => '#a5c9ff'],
            ],
            'module_completion' => $this->moduleCompletionSeries($studentIds, $moduleIds),
            'module_scores' => $this->moduleScoreSeries($studentIds, $moduleIds),
            'students' => $students,
        ];
    }

    private function studentIdsForCohort(Cohort $cohort): array
    {
        $fromPivot = DB::table('cohort_students')
            ->where('cohort_id', $cohort->id)
            ->pluck('user_id');

        $fromVouchers = Voucher::where('cohort_id', $cohort->id)
            ->whereNotNull('used_by')
            ->pluck('used_by');

        return $fromPivot->merge($fromVouchers)->unique()->values()->all();
    }

    private function completedCountsByUser(array $userIds, array $moduleIds): array
    {
        if ($userIds === [] || $moduleIds === []) {
            return [];
        }

        return DB::table('user_module_progress')
            ->select('user_id', DB::raw('COUNT(*) as completed'))
            ->whereIn('user_id', $userIds)
            ->whereIn('module_id', $moduleIds)
            ->where('is_completed', true)
            ->groupBy('user_id')
            ->pluck('completed', 'user_id')
            ->map(fn ($c) => (int) $c)
            ->all();
    }

    private function averageQuizScoreByUser(array $userIds, array $moduleIds): array
    {
        if ($userIds === [] || $moduleIds === []) {
            return [];
        }

        $latestAttempts = ModuleQuizAttempt::whereIn('user_id', $userIds)
            ->whereIn('module_id', $moduleIds)
            ->orderBy('user_id')
            ->orderBy('module_id')
            ->orderByDesc('attempt_number')
            ->get()
            ->groupBy(fn (ModuleQuizAttempt $a) => $a->user_id.'-'.$a->module_id)
            ->map(fn (Collection $group) => $group->first());

        $sums = [];
        $counts = [];

        foreach ($latestAttempts as $attempt) {
            if ($attempt->total <= 0) {
                continue;
            }
            $points = round(($attempt->score / $attempt->total) * 5, 1);
            $sums[$attempt->user_id] = ($sums[$attempt->user_id] ?? 0) + $points;
            $counts[$attempt->user_id] = ($counts[$attempt->user_id] ?? 0) + 1;
        }

        $averages = [];
        foreach ($sums as $userId => $sum) {
            $averages[$userId] = round($sum / $counts[$userId], 1);
        }

        return $averages;
    }

    private function moduleCompletionSeries(array $userIds, array $moduleIds): array
    {
        if ($moduleIds === []) {
            return [];
        }

        $counts = DB::table('user_module_progress')
            ->select('module_id', DB::raw('COUNT(*) as completed'))
            ->whereIn('user_id', $userIds)
            ->whereIn('module_id', $moduleIds)
            ->where('is_completed', true)
            ->groupBy('module_id')
            ->pluck('completed', 'module_id');

        return array_map(fn (int $moduleId) => (int) ($counts[$moduleId] ?? 0), $moduleIds);
    }

    private function moduleScoreSeries(array $userIds, array $moduleIds): array
    {
        if ($userIds === [] || $moduleIds === []) {
            return array_fill(0, count($moduleIds), 0);
        }

        $latestByModule = ModuleQuizAttempt::whereIn('user_id', $userIds)
            ->whereIn('module_id', $moduleIds)
            ->orderBy('module_id')
            ->orderByDesc('attempt_number')
            ->get()
            ->unique(fn (ModuleQuizAttempt $a) => $a->user_id.'-'.$a->module_id);

        $scoresByModule = [];

        foreach ($moduleIds as $moduleId) {
            $attempts = $latestByModule->where('module_id', $moduleId);
            if ($attempts->isEmpty()) {
                $scoresByModule[] = 0;

                continue;
            }

            $points = $attempts
                ->filter(fn (ModuleQuizAttempt $a) => $a->total > 0)
                ->map(fn (ModuleQuizAttempt $a) => ($a->score / $a->total) * 5);

            $scoresByModule[] = $points->isEmpty()
                ? 0
                : round($points->avg(), 1);
        }

        return $scoresByModule;
    }

    private function studentStatusLabel(int $completed, int $total, bool $certified, Collection $modules): string
    {
        if ($certified) {
            return 'CERTIFIED';
        }

        if ($completed <= 0) {
            return 'NOT STARTED';
        }

        $currentModule = $modules->values()->get(min($completed, max(0, $total - 1)));

        return $currentModule
            ? 'MODULE '.($currentModule->order_index ?? $completed)
            : 'IN PROGRESS';
    }

    private function formatAvgScore(?float $avg): string
    {
        if ($avg === null) {
            return '--';
        }

        return number_format($avg, 0).' POINTS';
    }
}
