<?php

namespace App\Services\Student;

use App\Models\Certification;
use App\Models\Cohort;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CastService
{
    public function payloadForUser(User $user): array
    {
        $cohortIds = $this->cohortIdsForUser($user);

        if ($cohortIds->isEmpty()) {
            return [
                'is_mock' => false,
                'casts' => [],
            ];
        }

        $cohorts = Cohort::with(['students'])
            ->whereIn('id', $cohortIds)
            ->orderByDesc('created_at')
            ->get();

        $certificationIds = $cohorts->pluck('certification_id')->filter()->unique();
        $certifications = Certification::with('lessons.modules')
            ->whereIn('id', $certificationIds)
            ->get()
            ->keyBy('id');

        $teacherIds = $cohorts->pluck('teacher_id')->unique();
        $teachers = User::whereIn('id', $teacherIds)->get()->keyBy('id');

        $casts = $cohorts->map(function (Cohort $cohort) use ($user, $certifications, $teachers) {
            $cert = $certifications->get($cohort->certification_id);
            $teacher = $teachers->get($cohort->teacher_id);
            $vouchers = Voucher::where('cohort_id', $cohort->id)->get();
            $members = $this->buildMembers($cohort, $cert, $vouchers, $user);

            return [
                'id' => $cohort->id,
                'name' => $cohort->cohort_name,
                'shell_title' => $cert ? strtoupper($cert->title) : 'SHELL',
                'certification_id' => $cohort->certification_id,
                'teacher_name' => $teacher ? trim($teacher->first_name.' '.$teacher->last_name) : 'Teacher',
                'voucher_label' => $this->voucherLabel($vouchers),
                'status' => $this->castStatus($vouchers, $members),
                'status_label' => $this->castStatusLabel($vouchers, $members),
                'member_count' => count($members),
                'members' => $members,
            ];
        })->values()->all();

        return [
            'is_mock' => false,
            'casts' => $casts,
        ];
    }

    private function cohortIdsForUser(User $user): Collection
    {
        $fromPivot = DB::table('cohort_students')
            ->where('user_id', $user->id)
            ->pluck('cohort_id');

        $fromRedeemed = Voucher::where('used_by', $user->id)
            ->whereNotNull('cohort_id')
            ->pluck('cohort_id');

        $fromEmail = Voucher::where('recipient_email', $user->email)
            ->whereNotNull('cohort_id')
            ->pluck('cohort_id');

        return $fromPivot->merge($fromRedeemed)->merge($fromEmail)->unique()->values();
    }

    private function buildMembers(Cohort $cohort, ?Certification $cert, Collection $vouchers, User $viewer): array
    {
        $moduleIds = $cert
            ? $cert->lessons->flatMap->modules->pluck('id')->all()
            : [];
        $totalModules = count($moduleIds);

        $userIds = DB::table('cohort_students')
            ->where('cohort_id', $cohort->id)
            ->pluck('user_id')
            ->merge($vouchers->whereNotNull('used_by')->pluck('used_by'))
            ->unique()
            ->values();

        $pendingUserIds = $vouchers
            ->filter(fn (Voucher $v) => $v->recipient_email && ! $v->is_used)
            ->map(fn (Voucher $v) => User::where('email', $v->recipient_email)->value('id'))
            ->filter();

        $userIds = $userIds->merge($pendingUserIds)->unique()->values();

        if ($userIds->isEmpty()) {
            return [];
        }

        $users = User::whereIn('id', $userIds)->get()->keyBy('id');
        $enrolledUserIds = $cert
            ? Enrollment::where('certification_id', $cert->id)->whereIn('user_id', $userIds)->pluck('user_id')->all()
            : [];

        $completedByUser = $this->completedModuleCountsByUser($userIds->all(), $moduleIds);
        $certifiedUserIds = $cert
            ? DB::table('certificates')
                ->where('certification_id', $cert->id)
                ->whereIn('user_id', $userIds)
                ->pluck('user_id')
                ->all()
            : [];

        $passedExamUserIds = $cert
            ? DB::table('exam_attempts')
                ->where('certification_id', $cert->id)
                ->where('passed', true)
                ->whereIn('user_id', $userIds)
                ->pluck('user_id')
                ->all()
            : [];

        $members = [];
        $memberIndex = 0;

        foreach ($userIds as $userId) {
            $memberUser = $users->get($userId);
            if (! $memberUser) {
                continue;
            }

            $completedModules = $completedByUser[$userId] ?? 0;
            $status = $this->memberStatus(
                $memberUser,
                $cert,
                $enrolledUserIds,
                $completedModules,
                $totalModules,
                $certifiedUserIds,
                $passedExamUserIds,
                $vouchers,
            );

            $pendingVoucher = null;
            if ($memberUser->id === $viewer->id && $status === 'pending_enrollment') {
                $pendingVoucher = $vouchers->first(
                    fn (Voucher $v) => ! $v->is_used && $v->recipient_email === $viewer->email,
                );
            }

            $members[] = [
                'id' => $memberIndex + 1,
                'user_id' => $memberUser->id,
                'display_name' => trim($memberUser->first_name.' '.$memberUser->last_name) ?: null,
                'handle' => strtok($memberUser->email, '@'),
                'progress_pct' => $totalModules > 0
                    ? (int) round(($completedModules / $totalModules) * 100)
                    : 0,
                'completed_modules' => $completedModules,
                'total_modules' => $totalModules ?: 0,
                'is_current_user' => $memberUser->id === $viewer->id,
                'status' => $status,
                'status_label' => $this->memberStatusLabel($status),
                'redeem_voucher_code' => $pendingVoucher?->code,
                'certification_id' => $cert?->id,
            ];
            $memberIndex++;
        }

        usort($members, function (array $a, array $b) {
            if ($a['is_current_user'] !== $b['is_current_user']) {
                return $a['is_current_user'] ? -1 : 1;
            }

            return ($b['progress_pct'] ?? 0) <=> ($a['progress_pct'] ?? 0);
        });

        return array_values(array_map(function (array $member, int $index) {
            $member['id'] = $index + 1;

            return $member;
        }, $members, array_keys($members)));
    }

    private function completedModuleCountsByUser(array $userIds, array $moduleIds): array
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
            ->map(fn ($count) => (int) $count)
            ->all();
    }

    private function memberStatus(
        User $member,
        ?Certification $cert,
        array $enrolledUserIds,
        int $completedModules,
        int $totalModules,
        array $certifiedUserIds,
        array $passedExamUserIds,
        Collection $vouchers,
    ): string {
        if (in_array($member->id, $certifiedUserIds, true) || in_array($member->id, $passedExamUserIds, true)) {
            return 'certified';
        }

        if (! in_array($member->id, $enrolledUserIds, true)) {
            return 'pending_enrollment';
        }

        if ($completedModules <= 0) {
            return 'not_started';
        }

        if ($totalModules > 0 && $completedModules >= $totalModules) {
            return 'completed';
        }

        return 'in_progress';
    }

    private function memberStatusLabel(string $status): string
    {
        return match ($status) {
            'not_started' => 'Not started',
            'pending_enrollment' => 'Pending enrollment',
            'in_progress' => 'In progress',
            'completed' => 'Shell completed',
            'certified' => 'Certified',
            default => 'Unknown',
        };
    }

    private function voucherLabel(Collection $vouchers): string
    {
        $count = $vouchers->count();
        $expired = $vouchers->contains(fn (Voucher $v) => $v->expires_at && $v->expires_at->isPast());

        if ($expired) {
            return 'Group voucher · expired';
        }

        return 'Group voucher · '.$count.' seat'.($count === 1 ? '' : 's');
    }

    private function castStatus(Collection $vouchers, array $members): string
    {
        if ($vouchers->contains(fn (Voucher $v) => $v->expires_at && $v->expires_at->isPast())) {
            return 'expired';
        }

        $enrolledMembers = array_filter($members, fn (array $m) => $m['status'] !== 'pending_enrollment');
        if ($enrolledMembers !== []
            && collect($enrolledMembers)->every(fn (array $m) => in_array($m['status'], ['completed', 'certified'], true))) {
            return 'closed';
        }

        return 'active';
    }

    private function castStatusLabel(Collection $vouchers, array $members): string
    {
        return match ($this->castStatus($vouchers, $members)) {
            'expired' => 'Voucher expired',
            'closed' => 'Shell completed',
            default => 'Active',
        };
    }
}
