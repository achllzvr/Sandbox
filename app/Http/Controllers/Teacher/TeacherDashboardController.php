<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Teacher/Dashboard', [
            'metrics' => [
                'total_vouchers' => 150,
                'claimed_vouchers' => 124,
                'active_cohorts' => 3,
                'avg_cohort_score' => 88
            ]
        ]);
    }

    public function purchasing()
    {
        $shells = [
            [
                'id' => 1,
                'title' => 'Web Development Fundamentals',
                'description' => 'Comprehensive HTML, CSS, and JS path for beginners.',
                'price' => 49.99,
                'thumbnail' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
            ],
            [
                'id' => 2,
                'title' => 'Advanced Backend Architecture',
                'description' => 'Master Laravel, microservices, and databases.',
                'price' => 99.99,
                'thumbnail' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
            ],
            [
                'id' => 3,
                'title' => 'Cybersecurity Analyst Shell',
                'description' => 'Practical networking, ethical hacking, and defense.',
                'price' => 79.99,
                'thumbnail' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
            ],
        ];

        return Inertia::render('Teacher/Purchasing', [
            'shells' => $shells
        ]);
    }

    public function vouchers()
    {
        $vouchers = [
            ['id' => 1, 'code' => 'WEB-2026-A1B2', 'shell' => 'Web Development Fundamentals', 'status' => 'claimed', 'student' => 'Alice Johnson', 'redeemed_at' => '2026-05-10'],
            ['id' => 2, 'code' => 'WEB-2026-C3D4', 'shell' => 'Web Development Fundamentals', 'status' => 'unclaimed', 'student' => null, 'redeemed_at' => null],
            ['id' => 3, 'code' => 'WEB-2026-E5F6', 'shell' => 'Web Development Fundamentals', 'status' => 'claimed', 'student' => 'Bob Smith', 'redeemed_at' => '2026-05-11'],
            ['id' => 4, 'code' => 'SEC-2026-G7H8', 'shell' => 'Cybersecurity Analyst Shell', 'status' => 'claimed', 'student' => 'Charlie Brown', 'redeemed_at' => '2026-05-09'],
            ['id' => 5, 'code' => 'SEC-2026-I9J0', 'shell' => 'Cybersecurity Analyst Shell', 'status' => 'unclaimed', 'student' => null, 'redeemed_at' => null],
        ];

        return Inertia::render('Teacher/Vouchers', [
            'vouchers' => $vouchers
        ]);
    }

    public function analytics()
    {
        $cohortData = [
            ['student' => 'Alice Johnson', 'shell' => 'Web Dev', 'progress' => 85, 'last_active' => 'Today', 'status' => 'On Track', 'score' => 92],
            ['student' => 'Bob Smith', 'shell' => 'Web Dev', 'progress' => 40, 'last_active' => '3 days ago', 'status' => 'Falling Behind', 'score' => 65],
            ['student' => 'Charlie Brown', 'shell' => 'Cybersecurity', 'progress' => 100, 'last_active' => 'Yesterday', 'status' => 'Completed', 'score' => 98],
        ];

        return Inertia::render('Teacher/Analytics', [
            'cohortData' => $cohortData
        ]);
    }
}
