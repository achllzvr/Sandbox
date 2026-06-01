<?php

namespace App\Support\Mocks\Teacher;

/**
 * TODO[backend]: Replace with real aggregates from cohort_students, vouchers, enrollments.
 */
class TeacherDashboardMockData
{
    public static function payload(): array
    {
        return [
            'is_mock' => true,
            'metrics' => [
                'total_students' => 67,
                'vouchers_claimed' => 50,
                'vouchers_unclaimed' => 17,
            ],
            'claim_logs' => self::claimLogs(),
        ];
    }

    private static function claimLogs(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'John Doe',
                'email' => 'jd@students.national-u.edu.ph',
                'shell_title' => 'REACT BASICS',
                'shell_accent' => '#60b0f0',
                'claimed_at' => 'May 11, 2026; 8:00am',
            ],
            [
                'id' => 2,
                'name' => 'Maria Santos',
                'email' => 'maria.santos@example.com',
                'shell_title' => 'LARAVEL BASICS',
                'shell_accent' => '#f02020',
                'claimed_at' => 'May 10, 2026; 3:45pm',
            ],
            [
                'id' => 3,
                'name' => 'Alex Chen',
                'email' => 'alex.chen@verylongemaildomain.example.org',
                'shell_title' => 'JAVA BASICS',
                'shell_accent' => '#f07060',
                'claimed_at' => 'May 9, 2026; 11:20am',
            ],
            [
                'id' => 4,
                'name' => 'Priya Nair',
                'email' => 'priya@example.com',
                'shell_title' => 'FULL DEMO',
                'shell_accent' => '#f08070',
                'claimed_at' => 'May 8, 2026; 9:00am',
            ],
        ];
    }
}
