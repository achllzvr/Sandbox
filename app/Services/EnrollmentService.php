<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\Module;
use App\Models\User;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class EnrollmentService
{
    public function isEnrolled(User $user, int $certificationId): bool
    {
        return Enrollment::where('user_id', $user->id)
            ->where('certification_id', $certificationId)
            ->where('status', 'active')
            ->exists();
    }

    public function assertEnrolled(User $user, int $certificationId): void
    {
        if (! $this->isEnrolled($user, $certificationId)) {
            throw new AccessDeniedHttpException('You are not enrolled in this Shell.');
        }
    }

    public function certificationIdForModule(Module $module): int
    {
        $module->loadMissing('lesson');

        return (int) $module->lesson->certification_id;
    }

    public function assertEnrolledForModule(User $user, Module $module): void
    {
        $this->assertEnrolled($user, $this->certificationIdForModule($module));
    }

    public function moduleBelongsToCertification(Module $module, int $certificationId): bool
    {
        return $this->certificationIdForModule($module) === $certificationId;
    }
}
