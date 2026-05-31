<?php

namespace App\Http\Middleware;

use App\Models\UserModuleProgress;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'studentGamification' => function () use ($request) {
                $user = $request->user();
                if (! $user || $user->role !== 'user') {
                    return null;
                }

                $completedSandboxes = UserModuleProgress::where('user_id', $user->id)
                    ->where('is_completed', true)
                    ->count();

                $leaderboardPlacement = $completedSandboxes > 0 ? 14 : null;

                return [
                    'sand_dollars' => 1250,
                    'streak_days' => 14,
                    'rank' => $leaderboardPlacement ? 'Sandcastle Builder' : null,
                    'leaderboard_placement' => $leaderboardPlacement,
                    'completed_sandboxes' => $completedSandboxes,
                    'progress_to_next_rank' => 75,
                    'hermy_name' => $user->first_name,
                    'hermy_avatar' => asset('images/Hermy.png'),
                    'badges' => [
                        ['id' => 1, 'label' => 'First Sandbox', 'icon' => '🐚'],
                        ['id' => 2, 'label' => '7-Day Streak', 'icon' => '🔥'],
                        ['id' => 3, 'label' => 'Quiz Ace', 'icon' => '⭐'],
                    ],
                ];
            },
            'mustVerifyEmail' => fn () => $request->user() && $request->user()->email_verified_at === null,
            'status' => fn () => $request->session()->get('status'),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }
}
