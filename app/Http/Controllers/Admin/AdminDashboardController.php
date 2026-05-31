<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\User;
use Inertia\Inertia;

// TODO[backend]: Add chart/analytics endpoints for enrollment trend, role split, and weekly revenue (Dashboard charts use mock data).

class AdminDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total_users'             => User::where('role', 'user')->count(),
                'total_content_creator'             => User::whereIn('role', ['content_creator', 'content_creator'])->count(),
                'total_teachers'          => User::where('role', 'teacher')->count(),
                'pending_teachers'        => User::where('role', 'teacher')
                                                ->where('status', 'pending_verification')
                                                ->count(),
                'total_certifications'    => Certification::count(),
                'pending_certifications'  => Certification::where('status', 'pending_review')->count(),
                'published_certifications'=> Certification::where('status', 'published')->count(),
                'declined_certifications' => Certification::where('status', 'denied')->count(),
            ],
            'recent_certifications' => Certification::with('creator:id,first_name,last_name')
                ->latest()
                ->take(5)
                ->get(),
            'recent_users' => User::latest()
                ->take(5)
                ->get(['id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at']),
        ]);
    }
}
