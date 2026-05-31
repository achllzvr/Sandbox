<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        // TODO[backend]: Replace with real leaderboard query.
        return Inertia::render('Student/Leaderboard', [
            'entries' => [],
        ]);
    }
}
