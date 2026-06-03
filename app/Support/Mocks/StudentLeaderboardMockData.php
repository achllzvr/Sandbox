<?php

namespace App\Support\Mocks;

/**
 * TODO[backend]: Replace with a real leaderboard query.
 *
 * Planned data sources:
 * - user_module_progress (completed sandboxes count)
 * - enrollments + exam_attempts (shell completions, certificates)
 * - gamification sand_dollars / streak on users or a stats table
 *
 * Suggested API shape:
 * - GET /student/leaderboard?period=week|all_time
 * - Return ranked users with sand_dollars, completed_sandboxes, streak_days, rank delta
 */
class StudentLeaderboardMockData
{
    public static function payload(): array
    {
        return [
            'is_mock' => true,
            'period' => 'week',
            'periods' => [
                ['key' => 'week', 'label' => 'This week'],
                ['key' => 'all_time', 'label' => 'All time'],
            ],
            'entries_by_period' => [
                'week' => self::weekEntries(),
                'all_time' => self::allTimeEntries(),
            ],
            'viewer' => self::viewer(),
        ];
    }

    private static function viewer(): array
    {
        return [
            'user_id' => null,
            'rank' => 14,
            'sand_dollars' => 1250,
            'completed_sandboxes' => 8,
            'streak_days' => 14,
            'rank_title' => 'Sandcastle Builder',
            'is_ranked' => true,
            'progress_to_next_rank' => 72,
            'next_rank_title' => 'Castle Architect',
        ];
    }

    private static function weekEntries(): array
    {
        return [
            self::entry(1, 'Marina Cruz', 'marinac', 4200, 22, 21, true),
            self::entry(2, 'Jose Aramil', 'josea', 3800, 19, 18, false),
            self::entry(3, 'Aisha Khan', 'aishak', 3650, 18, 16, false),
            self::entry(4, 'Luis Tan', 'luist', 3400, 17, 14, false),
            self::entry(5, 'Emma Santos', 'emmas', 3100, 15, 12, false),
            self::entry(6, 'Noah Reyes', 'noahr', 2950, 14, 11, false),
            self::entry(7, 'Priya Nair', 'priyan', 2800, 13, 10, false),
            self::entry(8, 'Carlos Lim', 'carlosl', 2650, 12, 9, false),
            self::entry(9, 'Hannah Park', 'hannahp', 2500, 11, 8, false),
            self::entry(10, 'Diego Ramos', 'diegor', 2350, 10, 7, false),
            self::entry(11, 'Sofia Mendez', 'sofiam', 2200, 10, 6, false),
            self::entry(12, 'Kenji Watanabe', 'kenjiw', 2050, 9, 5, false),
            self::entry(13, 'Olivia Chen', 'oliviac', 1900, 9, 4, false),
            self::entry(14, null, null, 1250, 8, 14, false, true),
            self::entry(15, 'Ben Torres', 'bent', 980, 5, 2, false),
            self::entry(16, 'Zoe Aquino', 'zoea', 720, 3, 1, false),
            self::entry(17, 'Miles Gutierrez', 'milesg', 450, 2, 0, false),
        ];
    }

    private static function allTimeEntries(): array
    {
        return [
            self::entry(1, 'Marina Cruz', 'marinac', 18400, 88, 45, true),
            self::entry(2, 'Aisha Khan', 'aishak', 16200, 79, 40, false),
            self::entry(3, 'Jose Aramil', 'josea', 15800, 76, 38, false),
            self::entry(4, 'Emma Santos', 'emmas', 14100, 70, 35, false),
            self::entry(5, 'Luis Tan', 'luist', 13200, 65, 33, false),
            self::entry(6, 'Priya Nair', 'priyan', 11800, 58, 30, false),
            self::entry(7, 'Noah Reyes', 'noahr', 10900, 52, 28, false),
            self::entry(8, 'Carlos Lim', 'carlosl', 9800, 48, 25, false),
            self::entry(9, 'Hannah Park', 'hannahp', 9100, 44, 22, false),
            self::entry(10, 'Diego Ramos', 'diegor', 8600, 41, 20, false),
            self::entry(11, 'Sofia Mendez', 'sofiam', 7900, 38, 18, false),
            self::entry(12, 'Kenji Watanabe', 'kenjiw', 7200, 35, 16, false),
            self::entry(13, 'Olivia Chen', 'oliviac', 6800, 32, 15, false),
            self::entry(14, null, null, 5200, 28, 14, false, true),
            self::entry(15, 'Ben Torres', 'bent', 4100, 20, 8, false),
        ];
    }

    private static function entry(
        int $rank,
        ?string $name,
        ?string $handle,
        int $sandDollars,
        int $completedSandboxes,
        int $streakDays,
        bool $isTopMover,
        bool $isCurrentUser = false,
    ): array {
        return [
            'rank' => $rank,
            'display_name' => $name,
            'handle' => $handle,
            'sand_dollars' => $sandDollars,
            'completed_sandboxes' => $completedSandboxes,
            'streak_days' => $streakDays,
            'is_top_mover' => $isTopMover,
            'is_current_user' => $isCurrentUser,
            'rank_delta' => $isTopMover ? 3 : ($rank <= 5 ? 1 : ($rank >= 15 ? -2 : 0)),
        ];
    }
}
