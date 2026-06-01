<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Support\Mocks\StudentLeaderboardMockData;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        // TODO[backend]: Query leaderboard rankings from progress + gamification tables.
        // TODO[backend]: Accept ?period=week|all_time and paginate long leaderboards.
        // TODO[backend]: Merge auth user's live stats instead of mock viewer block.
        return Inertia::render('Student/Leaderboard', StudentLeaderboardMockData::payload());
    }
}
