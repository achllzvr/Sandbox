<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\GamificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function __construct(private GamificationService $gamificationService) {}

    public function index(Request $request)
    {
        $period = $request->query('period', 'week');
        if (! in_array($period, ['week', 'all_time'], true)) {
            $period = 'week';
        }

        $entries = $this->gamificationService->leaderboardEntries($period, 50);
        $viewer = null;

        if ($request->user()) {
            $summary = $this->gamificationService->summaryForUser($request->user());
            $placement = $this->gamificationService->leaderboardPlacement($request->user()->id, $period);
            $viewer = [
                'user_id' => $request->user()->id,
                'rank' => $placement,
                'sand_dollars' => $summary['sand_dollars'],
                'completed_sandboxes' => $summary['completed_sandboxes'],
                'streak_days' => $summary['streak_days'],
                'rank_title' => $summary['rank'],
                'is_ranked' => $placement !== null,
                'progress_to_next_rank' => $summary['progress_to_next_rank'],
                'next_rank_title' => $this->gamificationService->rankForSandDollars($summary['sand_dollars'])['next_title'],
            ];

            $entries = array_map(function ($entry) use ($request) {
                if ((int) ($entry['user_id'] ?? 0) === (int) $request->user()->id) {
                    $entry['is_current_user'] = true;
                }

                return $entry;
            }, $entries);
        }

        return Inertia::render('Student/Leaderboard', [
            'is_mock' => false,
            'period' => $period,
            'periods' => [
                ['key' => 'week', 'label' => 'This week'],
                ['key' => 'all_time', 'label' => 'All time'],
            ],
            'entries_by_period' => [
                'week' => $period === 'week' ? $entries : $this->gamificationService->leaderboardEntries('week', 50),
                'all_time' => $period === 'all_time' ? $entries : $this->gamificationService->leaderboardEntries('all_time', 50),
            ],
            'viewer' => $viewer,
        ]);
    }
}
