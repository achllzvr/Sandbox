<?php

namespace App\Support\Mocks\Teacher;

/**
 * TODO[backend]: enrollment_requests + payments + cohorts for teacher purchase log.
 */
class TeacherPurchaseHistoryMockData
{
    public static function all(): array
    {
        return [
            [
                'id' => 1,
                'purchased_at' => 'May 11, 2026',
                'shell_title' => 'REACT BASICS',
                'certification_id' => 2,
                'batch_label' => 'MAY 11, 2026',
                'quantity' => 9,
                'amount' => 0.00,
                'status' => 'completed',
                'reference' => 'BULK-2026-0511-001',
            ],
            [
                'id' => 2,
                'purchased_at' => 'May 5, 2026',
                'shell_title' => 'LARAVEL BASICS',
                'certification_id' => 4,
                'batch_label' => 'MAY 5, 2026',
                'quantity' => 12,
                'amount' => 9588.00,
                'status' => 'completed',
                'reference' => 'BULK-2026-0505-002',
            ],
            [
                'id' => 3,
                'purchased_at' => 'Apr 28, 2026',
                'shell_title' => 'REACT BASICS',
                'certification_id' => 2,
                'batch_label' => 'APR 28, 2026',
                'quantity' => 6,
                'amount' => 0.00,
                'status' => 'completed',
                'reference' => 'BULK-2026-0428-003',
            ],
        ];
    }

    public static function forCertification(int $certificationId): array
    {
        return array_values(array_filter(
            self::all(),
            fn (array $row) => (int) $row['certification_id'] === $certificationId
        ));
    }
}
