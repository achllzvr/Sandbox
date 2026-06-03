<?php

namespace App\Support\Mocks\Teacher;

/**
 * TODO[backend]: Replace with cohort_students joined to progress/exam_attempts.
 */
class TeacherBatchAnalyticsMockData
{
    public static function payload(int $certificationId, int $cohortId): array
    {
        return [
            'is_mock' => true,
            'certification_id' => $certificationId,
            'cohort_id' => $cohortId,
            'batch_label' => TeacherVoucherMockData::batchLabel($cohortId),
            'completion' => [
                ['key' => 'not_started', 'label' => 'Not started', 'count' => 9, 'color' => '#706fd3'],
                ['key' => 'in_progress', 'label' => 'In Progress', 'count' => 4, 'color' => '#8896e8'],
                ['key' => 'certified', 'label' => 'Certified', 'count' => 67, 'color' => '#a5c9ff'],
            ],
            'module_completion' => [120, 340, 280, 410, 390, 520, 480, 560, 600, 580],
            'module_scores' => [2.1, 2.8, 3.2, 3.0, 3.5, 3.8, 3.6, 3.9, 4.0, 3.7],
            'students' => self::students(),
        ];
    }

    private static function students(): array
    {
        $rows = [
            ['id' => 1, 'name' => 'John Doe', 'email' => 'jd@students.national-u.edu.ph', 'status' => 'MODULE 1', 'avg_score' => '4 POINTS', 'exam_attempts' => 0],
            ['id' => 2, 'name' => 'Maria Santos', 'email' => 'maria@example.com', 'status' => 'NOT STARTED', 'avg_score' => '--', 'exam_attempts' => 0],
            ['id' => 3, 'name' => 'Alex Chen', 'email' => 'alex@example.com', 'status' => 'CERTIFIED', 'avg_score' => '5 POINTS', 'exam_attempts' => 1],
            ['id' => 4, 'name' => 'Priya Nair', 'email' => 'priya@example.com', 'status' => 'MODULE 3', 'avg_score' => '3 POINTS', 'exam_attempts' => 0],
            ['id' => 5, 'name' => 'Luis Tan', 'email' => 'luis@example.com', 'status' => 'MODULE 2', 'avg_score' => '4 POINTS', 'exam_attempts' => 0],
        ];

        for ($i = 6; $i <= 24; $i++) {
            $rows[] = [
                'id' => $i,
                'name' => '--',
                'email' => '--',
                'status' => '--',
                'avg_score' => '--',
                'exam_attempts' => 0,
            ];
        }

        return $rows;
    }
}
