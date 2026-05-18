<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // For the sample landing page, we'll pass dummy gamification data and mock sections 
        // to render a stunning "Sandbox" themed student hub.
        
        $user = $request->user();

        // Sample Gamification State
        $gamification = [
            'sand_dollars' => 1250,
            'streak_days' => 14,
            'hermy_avatar' => asset('images/hermy_default.png'), // Just a placeholder idea
            'rank' => 'Sandcastle Builder',
            'progress_to_next_rank' => 75, // percentage
        ];

        // Sample "My Shells" (Enrolled Certifications)
        $myShells = [
            [
                'id' => 1,
                'title' => 'Digital Marketing Basics',
                'progress' => 60,
                'total_modules' => 10,
                'completed_modules' => 6,
                'last_accessed' => '2 hours ago',
                'next_sandbox' => 'SEO Fundamentals',
                'color' => 'from-blue-400 to-cyan-300'
            ],
            [
                'id' => 2,
                'title' => 'Advanced React Patterns',
                'progress' => 15,
                'total_modules' => 20,
                'completed_modules' => 3,
                'last_accessed' => '1 day ago',
                'next_sandbox' => 'Custom Hooks',
                'color' => 'from-amber-400 to-orange-400'
            ]
        ];

        // Sample Marketplace Recommendations
        $recommendedShells = [
            [
                'id' => 3,
                'title' => 'UI/UX Masterclass',
                'price' => 49.99,
                'creator' => 'Sarah Johnson',
                'rating' => 4.8
            ],
            [
                'id' => 4,
                'title' => 'Backend with Laravel',
                'price' => 0.00,
                'creator' => 'Alex Developer',
                'rating' => 4.9
            ]
        ];

        return Inertia::render('Student/Dashboard', [
            'gamification' => $gamification,
            'myShells'     => $myShells,
            'recommendedShells' => $recommendedShells,
        ]);
    }
}
