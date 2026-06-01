<?php

namespace App\Support\Mocks\Teacher;

/**
 * TODO[backend]: Replace with vouchers/cohorts scoped to auth teacher_id.
 */
class TeacherVoucherMockData
{
    public static function batchesForCert(int $certificationId): array
    {
        if ($certificationId === 2) {
            return [
                ['id' => 101, 'label' => 'Batch May 10, 2026', 'purchased_at' => '2026-05-10'],
                ['id' => 102, 'label' => 'Batch April 21, 2026', 'purchased_at' => '2026-04-21'],
            ];
        }

        return [
            ['id' => 201, 'label' => 'Batch May 5, 2026', 'purchased_at' => '2026-05-05'],
        ];
    }

    public static function voucherGroups(int $certificationId): array
    {
        if ($certificationId === 2) {
            return [
                [
                    'batch_id' => 101,
                    'batch_label' => 'Bought on May 10, 2026',
                    'vouchers' => [
                        self::voucher(1, 'ABCD-1234', 'claimed', 'John Doe', 'jd@student..', 'May 11, 2026; 8:00am', null),
                        self::voucher(2, 'MADZ-7564', 'unclaimed', null, null, null, 'sendable'),
                        self::voucher(3, 'FWOQ-2983', 'unclaimed', null, null, null, 'sent'),
                    ],
                ],
                [
                    'batch_id' => 102,
                    'batch_label' => 'Bought on April 21, 2026',
                    'vouchers' => [
                        self::voucher(4, 'XKCD-9901', 'claimed', 'Maria Santos', 'maria@stu..', 'Apr 22, 2026; 2:00pm', null),
                        self::voucher(5, 'PLMN-4455', 'unclaimed', null, null, null, 'sendable'),
                    ],
                ],
            ];
        }

        return [
            [
                'batch_id' => 201,
                'batch_label' => 'Bought on May 5, 2026',
                'vouchers' => [
                    self::voucher(6, 'LVRL-1001', 'unclaimed', null, null, null, 'sendable'),
                ],
            ],
        ];
    }

    public static function batchLabel(int $cohortId): string
    {
        foreach ([2, 4] as $certId) {
            foreach (self::batchesForCert($certId) as $batch) {
                if ($batch['id'] === $cohortId) {
                    return strtoupper(str_replace('Batch ', '', $batch['label']));
                }
            }
        }

        return 'MAY 11, 2026';
    }

    public static function fallbackCertification(int $id): ?array
    {
        $map = [
            2 => [
                'id' => 2,
                'title' => 'React Basics',
                'description' => "An exam that covers React's basics from routing to library integrations and basic security ensuring that takers of this certification exam path will learn the fundamentals of Javascript, React, and the modern technologies associated with React.",
                'price' => 800,
                'estimated_duration' => '2 Weeks',
                'difficulty' => '1/5',
                'accent_color' => '#60b0f0',
                'thumbnail_url' => null,
                'category' => 'React',
            ],
            4 => [
                'id' => 4,
                'title' => 'Laravel Basics',
                'description' => "An exam that covers Laravel's basics from routing to basic security.",
                'price' => 250,
                'estimated_duration' => '2 Weeks',
                'difficulty' => '1/5',
                'accent_color' => '#f02020',
                'thumbnail_url' => null,
                'category' => 'Laravel',
            ],
        ];

        return $map[$id] ?? null;
    }

    private static function voucher(
        int $id,
        string $code,
        string $status,
        ?string $name,
        ?string $email,
        ?string $updatedAt,
        ?string $emailStatus
    ): array {
        return [
            'id' => $id,
            'code' => $code,
            'status' => $status,
            'student_name' => $name,
            'student_email' => $email,
            'updated_at' => $updatedAt,
            'email_status' => $emailStatus,
        ];
    }
}
