<?php

namespace App\Services;

use App\Models\Certification;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Support\Collection;

class FinalExamAccessService
{
    public function requiresTeacherUnlock(Enrollment $enrollment): bool
    {
        return in_array($enrollment->access_type, ['voucher', 'admin_grant'], true);
    }

    public function allModulesComplete(int $completedModules, int $totalModules): bool
    {
        return $totalModules > 0 && $completedModules >= $totalModules;
    }

    public function teacherHasUnlocked(Enrollment $enrollment): bool
    {
        if (! $this->requiresTeacherUnlock($enrollment)) {
            return true;
        }

        if ($enrollment->final_exam_unlocked_at) {
            return true;
        }

        return Voucher::where('certification_id', $enrollment->certification_id)
            ->where('is_used', true)
            ->where('used_by', $enrollment->user_id)
            ->whereNotNull('final_exam_unlocked_at')
            ->exists();
    }

    public function canTakeFinalExam(User $user, Certification $certification, int $completedModules, int $totalModules): bool
    {
        if (! $this->allModulesComplete($completedModules, $totalModules)) {
            return false;
        }

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('certification_id', $certification->id)
            ->where('status', 'active')
            ->first();

        if (! $enrollment) {
            return false;
        }

        return $this->teacherHasUnlocked($enrollment);
    }

    public function examState(User $user, Certification $certification, int $completedModules, int $totalModules): string
    {
        if (! $this->allModulesComplete($completedModules, $totalModules)) {
            return 'locked_modules';
        }

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('certification_id', $certification->id)
            ->where('status', 'active')
            ->first();

        if (! $enrollment || ! $this->requiresTeacherUnlock($enrollment)) {
            return 'ready';
        }

        return $this->teacherHasUnlocked($enrollment) ? 'ready' : 'waiting_instructor';
    }

    public function assertCanTakeFinalExam(User $user, Certification $certification, int $completedModules, int $totalModules): void
    {
        if (! $this->allModulesComplete($completedModules, $totalModules)) {
            abort(403, 'Complete all sandboxes before taking the final exam.');
        }

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('certification_id', $certification->id)
            ->where('status', 'active')
            ->firstOrFail();

        if ($this->requiresTeacherUnlock($enrollment) && ! $this->teacherHasUnlocked($enrollment)) {
            abort(403, 'Your instructor has not unlocked the final exam yet.');
        }
    }

    public function unlockForVouchers(Collection $vouchers): int
    {
        $now = now();
        $count = 0;

        foreach ($vouchers as $voucher) {
            /** @var Voucher $voucher */
            $voucher->update(['final_exam_unlocked_at' => $now]);

            if ($voucher->used_by) {
                $this->applyUnlockToEnrollment((int) $voucher->used_by, (int) $voucher->certification_id, $now);
            }

            $count++;
        }

        return $count;
    }

    public function applyUnlockFromVoucher(Voucher $voucher): void
    {
        if (! $voucher->final_exam_unlocked_at || ! $voucher->used_by) {
            return;
        }

        $this->applyUnlockToEnrollment(
            (int) $voucher->used_by,
            (int) $voucher->certification_id,
            $voucher->final_exam_unlocked_at,
        );
    }

    private function applyUnlockToEnrollment(int $userId, int $certificationId, $timestamp): void
    {
        Enrollment::where('user_id', $userId)
            ->where('certification_id', $certificationId)
            ->update(['final_exam_unlocked_at' => $timestamp]);
    }
}
