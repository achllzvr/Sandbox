<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\GamificationEvent;
use App\Models\User;
use App\Models\UserAchievement;
use App\Models\UserStreak;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GamificationService
{
    public const RANKS = [
        ['min_sd' => 0, 'title' => 'Beachcomber'],
        ['min_sd' => 500, 'title' => 'Sandcastle Builder'],
        ['min_sd' => 1500, 'title' => 'Castle Architect'],
        ['min_sd' => 4000, 'title' => 'Hermit Captain'],
        ['min_sd' => 8000, 'title' => 'Shell Master'],
    ];

    public function award(
        User $user,
        int $amount,
        string $eventType,
        ?string $sourceType = null,
        ?int $sourceId = null,
        array $meta = [],
    ): void {
        if ($amount === 0) {
            return;
        }

        DB::transaction(function () use ($user, $amount, $eventType, $sourceType, $sourceId, $meta) {
            $user->increment('sand_dollars', $amount);

            GamificationEvent::create([
                'user_id' => $user->id,
                'event_type' => $eventType,
                'amount' => $amount,
                'source_type' => $sourceType,
                'source_id' => $sourceId,
                'meta' => $meta ?: null,
            ]);
        });

        $this->checkAchievements($user->fresh());
    }

    public function recordActivity(User $user): UserStreak
    {
        $today = Carbon::today();
        $streak = UserStreak::firstOrCreate(
            ['user_id' => $user->id],
            ['current_streak' => 0, 'longest_streak' => 0],
        );

        if ($streak->last_active_date?->isSameDay($today)) {
            return $streak;
        }

        if ($streak->last_active_date && $streak->last_active_date->isSameDay($today->copy()->subDay())) {
            $streak->current_streak++;
        } else {
            $streak->current_streak = 1;
        }

        $streak->longest_streak = max($streak->longest_streak, $streak->current_streak);
        $streak->last_active_date = $today;
        $streak->save();

        if ($streak->current_streak >= 7) {
            $this->unlockAchievement($user, 'seven_day_streak');
        }

        return $streak;
    }

    public function rankForSandDollars(int $sandDollars): array
    {
        $current = self::RANKS[0];
        $next = self::RANKS[1] ?? null;

        foreach (self::RANKS as $index => $rank) {
            if ($sandDollars >= $rank['min_sd']) {
                $current = $rank;
                $next = self::RANKS[$index + 1] ?? null;
            }
        }

        $progress = 100;
        if ($next) {
            $span = max(1, $next['min_sd'] - $current['min_sd']);
            $progress = (int) round((($sandDollars - $current['min_sd']) / $span) * 100);
            $progress = max(0, min(100, $progress));
        }

        return [
            'title' => $current['title'],
            'next_title' => $next['title'] ?? null,
            'progress_to_next' => $progress,
        ];
    }

    public function summaryForUser(User $user): array
    {
        $streak = UserStreak::where('user_id', $user->id)->first();
        $completedSandboxes = $user->completedModules()->count();
        $rank = $this->rankForSandDollars((int) $user->sand_dollars);
        $placement = $this->leaderboardPlacement($user->id, 'all_time');

        return [
            'sand_dollars' => (int) $user->sand_dollars,
            'streak_days' => (int) ($streak->current_streak ?? 0),
            'rank' => $completedSandboxes > 0 ? $rank['title'] : null,
            'leaderboard_placement' => $placement,
            'completed_sandboxes' => $completedSandboxes,
            'progress_to_next_rank' => $rank['progress_to_next'],
            'hermy_name' => $user->first_name,
            'hermy_avatar' => asset('images/Hermy.png'),
            'badges' => $this->badgesForUser($user),
        ];
    }

    public function leaderboardPlacement(int $userId, string $period = 'all_time'): ?int
    {
        $entries = $this->leaderboardEntries($period, 500);
        foreach ($entries as $entry) {
            if ((int) ($entry['user_id'] ?? 0) === $userId) {
                return (int) $entry['rank'];
            }
        }

        return null;
    }

    public function leaderboardEntries(string $period = 'week', int $limit = 50): array
    {
        $query = User::query()
            ->where('role', User::ROLE_USER)
            ->where('is_active', true)
            ->select('users.id', 'users.first_name', 'users.last_name', 'users.sand_dollars');

        if ($period === 'week') {
            $weekStart = Carbon::now()->startOfWeek();
            $query->withCount([
                'completedModules as completed_sandboxes' => function ($q) use ($weekStart) {
                    $q->where('user_module_progress.completed_at', '>=', $weekStart);
                },
            ]);
            $query->addSelect([
                'week_sd' => GamificationEvent::selectRaw('COALESCE(SUM(amount), 0)')
                    ->whereColumn('gamification_events.user_id', 'users.id')
                    ->where('created_at', '>=', $weekStart),
            ]);
            $query->orderByDesc('week_sd')->orderByDesc('sand_dollars');
        } else {
            $query->withCount('completedModules as completed_sandboxes');
            $query->orderByDesc('sand_dollars');
        }

        $users = $query->limit($limit)->get();
        $streaks = UserStreak::whereIn('user_id', $users->pluck('id'))->get()->keyBy('user_id');

        return $users->values()->map(function ($user, $index) use ($period, $streaks) {
            return [
                'rank' => $index + 1,
                'user_id' => $user->id,
                'display_name' => trim($user->first_name.' '.$user->last_name),
                'handle' => strtolower(str_replace(' ', '', $user->first_name)),
                'sand_dollars' => $period === 'week'
                    ? (int) ($user->week_sd ?? 0)
                    : (int) $user->sand_dollars,
                'completed_sandboxes' => (int) ($user->completed_sandboxes ?? 0),
                'streak_days' => (int) ($streaks[$user->id]->current_streak ?? 0),
                'is_top_mover' => $index < 3,
                'is_current_user' => false,
                'rank_delta' => 0,
            ];
        })->all();
    }

    public function seedDefaultAchievements(): void
    {
        $defaults = [
            ['slug' => 'first_sandbox', 'label' => 'First Sandbox', 'icon' => '🐚', 'description' => 'Complete your first sandbox.'],
            ['slug' => 'seven_day_streak', 'label' => '7-Day Streak', 'icon' => '🔥', 'description' => 'Maintain a 7-day learning streak.'],
            ['slug' => 'quiz_ace', 'label' => 'Quiz Ace', 'icon' => '⭐', 'description' => 'Score 100% on a module quiz.'],
            ['slug' => 'cert_earned', 'label' => 'Certified Hermit', 'icon' => '🏆', 'description' => 'Earn a shell certificate.'],
        ];

        foreach ($defaults as $row) {
            Achievement::firstOrCreate(['slug' => $row['slug']], $row);
        }
    }

    public function unlockAchievement(User $user, string $slug): void
    {
        $achievement = Achievement::where('slug', $slug)->first();
        if (! $achievement) {
            return;
        }

        UserAchievement::firstOrCreate(
            ['user_id' => $user->id, 'achievement_id' => $achievement->id],
            ['unlocked_at' => now()],
        );
    }

    private function badgesForUser(User $user): array
    {
        return UserAchievement::where('user_id', $user->id)
            ->join('achievements', 'achievements.id', '=', 'user_achievements.achievement_id')
            ->orderBy('user_achievements.unlocked_at')
            ->limit(6)
            ->get(['achievements.id', 'achievements.label', 'achievements.icon'])
            ->map(fn ($row) => [
                'id' => $row->id,
                'label' => $row->label,
                'icon' => $row->icon,
            ])
            ->all();
    }

    private function checkAchievements(User $user): void
    {
        if ($user->completedModules()->count() >= 1) {
            $this->unlockAchievement($user, 'first_sandbox');
        }
    }
}
