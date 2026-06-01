<?php

namespace App\Support\Mocks;

/**
 * TODO[backend]: Replace with real cast / group enrollment data.
 *
 * Planned schema (not yet migrated):
 * - casts: id, name, certification_id, teacher_user_id, voucher_id, status (active|expired|closed)
 * - cast_members: id, cast_id, user_id, joined_at, enrollment_id
 * - vouchers: extend with cast_id or bulk_group_code when teachers purchase group seats
 *
 * Business rules:
 * - A cast exists only when a teacher buys a voucher bundle tied to a group/class.
 * - Students redeem or are invited into the cast and share the same shell enrollment.
 * - Progress comes from enrollments + user_module_progress + exam_attempts/certificates.
 */
class StudentCastMockData
{
    public static function payload(): array
    {
        return [
            'is_mock' => true,
            'casts' => [
                self::activeClassCast(),
                self::expiredCast(),
                self::soloCast(),
                self::allCompletedCast(),
            ],
        ];
    }

    private static function activeClassCast(): array
    {
        return [
            'id' => 101,
            'name' => 'CS 101 — Spring Cohort',
            'shell_title' => 'REACT BASICS',
            'certification_id' => 3,
            'teacher_name' => 'Prof. Maria Garcia',
            'voucher_label' => 'Group voucher · 25 seats',
            'status' => 'active',
            'status_label' => 'Active',
            'member_count' => 6,
            'members' => [
                self::member(1, 'Marina Cruz', 'marinac', 92, 11, 12, false, 'in_progress'),
                self::member(2, 'Jose Aramil', 'josea', 78, 9, 12, false, 'in_progress'),
                self::member(3, null, null, 45, 5, 12, true, 'in_progress'),
                self::member(4, 'Aisha Khan', 'aishak', 100, 12, 12, false, 'certified'),
                self::member(5, 'Luis Tan', 'luist', 0, 0, 12, false, 'not_started'),
                self::member(6, 'Emma Santos', 'emmas', 15, 2, 12, false, 'pending_enrollment'),
            ],
        ];
    }

    private static function expiredCast(): array
    {
        return [
            'id' => 102,
            'name' => 'Java Bootcamp — Winter 2025',
            'shell_title' => 'JAVA BASICS',
            'certification_id' => 2,
            'teacher_name' => 'Prof. David Chen',
            'voucher_label' => 'Group voucher · expired',
            'status' => 'expired',
            'status_label' => 'Voucher expired',
            'member_count' => 4,
            'members' => [
                self::member(7, 'Noah Reyes', 'noahr', 60, 7, 10, false, 'in_progress'),
                self::member(8, 'Priya Nair', 'priyan', 100, 10, 10, false, 'completed'),
                self::member(9, null, null, 30, 3, 10, true, 'in_progress'),
                self::member(10, 'Carlos Lim', 'carlosl', 10, 1, 10, false, 'not_started'),
            ],
        ];
    }

    private static function soloCast(): array
    {
        return [
            'id' => 103,
            'name' => 'Self-paced Laravel Track',
            'shell_title' => 'LARAVEL BASICS',
            'certification_id' => 4,
            'teacher_name' => 'Instructor Ana Lopez',
            'voucher_label' => 'Single-seat group voucher',
            'status' => 'active',
            'status_label' => 'Active',
            'member_count' => 1,
            'members' => [
                self::member(11, null, null, 8, 1, 12, true, 'in_progress'),
            ],
        ];
    }

    private static function allCompletedCast(): array
    {
        return [
            'id' => 104,
            'name' => 'Full Demo Graduates',
            'shell_title' => 'FULL DEMO',
            'certification_id' => 9,
            'teacher_name' => 'Sandbox Staff',
            'voucher_label' => 'Group voucher · demo',
            'status' => 'closed',
            'status_label' => 'Shell completed',
            'member_count' => 3,
            'members' => [
                self::member(12, 'Hannah Park', 'hannahp', 100, 10, 10, false, 'certified'),
                self::member(13, 'Diego Ramos', 'diegor', 100, 10, 10, false, 'certified'),
                self::member(14, null, null, 100, 10, 10, true, 'certified'),
            ],
        ];
    }

    private static function member(
        int $id,
        ?string $name,
        ?string $handle,
        int $progressPct,
        int $completedModules,
        int $totalModules,
        bool $isCurrentUser,
        string $status,
    ): array {
        return [
            'id' => $id,
            'display_name' => $name,
            'handle' => $handle,
            'progress_pct' => $progressPct,
            'completed_modules' => $completedModules,
            'total_modules' => $totalModules,
            'is_current_user' => $isCurrentUser,
            'status' => $status,
            'status_label' => self::statusLabel($status),
        ];
    }

    private static function statusLabel(string $status): string
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
}
