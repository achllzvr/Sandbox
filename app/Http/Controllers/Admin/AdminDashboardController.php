<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total_users' => User::where('role', 'user')->count(),
                'total_content_creator' => User::where('role', 'content_creator')->count(),
                'total_teachers' => User::where('role', 'teacher')->count(),
                'pending_teachers' => User::where('role', 'teacher')
                    ->where('status', 'pending_verification')
                    ->count(),
                'total_certifications' => Certification::count(),
                'pending_certifications' => Certification::where('status', 'pending_review')->count(),
                'published_certifications' => Certification::where('status', 'published')->count(),
                'declined_certifications' => Certification::where('status', 'denied')->count(),
            ],
            'enrollment_trend' => $this->enrollmentTrend(),
            'role_split' => $this->roleSplit(),
            'weekly_revenue' => $this->weeklyRevenue(),
            'recent_certifications' => Certification::with('creator:id,first_name,last_name')
                ->latest()
                ->take(5)
                ->get(),
            'recent_users' => User::latest()
                ->take(5)
                ->get(['id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at']),
        ]);
    }

    private function enrollmentTrend(): array
    {
        if (! Schema::hasTable('enrollments')) {
            return ['labels' => [], 'values' => []];
        }

        $start = now()->subMonths(5)->startOfMonth();
        $rows = Enrollment::query()
            ->where('enrolled_at', '>=', $start)
            ->selectRaw('DATE_FORMAT(enrolled_at, "%Y-%m") as month_key, COUNT(*) as total')
            ->groupBy('month_key')
            ->orderBy('month_key')
            ->pluck('total', 'month_key');

        $labels = [];
        $values = [];

        for ($i = 0; $i < 6; $i++) {
            $month = $start->copy()->addMonths($i);
            $key = $month->format('Y-m');
            $labels[] = $month->format('M');
            $values[] = (int) ($rows[$key] ?? 0);
        }

        return compact('labels', 'values');
    }

    private function roleSplit(): array
    {
        $counts = User::query()
            ->select('role', DB::raw('COUNT(*) as total'))
            ->groupBy('role')
            ->pluck('total', 'role');

        return [
            'labels' => ['Students', 'Creators', 'Teachers', 'Admins'],
            'values' => [
                (int) ($counts['user'] ?? 0),
                (int) ($counts['content_creator'] ?? 0),
                (int) ($counts['teacher'] ?? 0),
                (int) ($counts['admin'] ?? 0),
            ],
        ];
    }

    private function weeklyRevenue(): array
    {
        if (! Schema::hasTable('payments')) {
            return ['labels' => [], 'values' => []];
        }

        $labels = [];
        $values = [];

        for ($i = 3; $i >= 0; $i--) {
            $weekStart = now()->subWeeks($i)->startOfWeek();
            $weekEnd = $weekStart->copy()->endOfWeek();
            $total = (float) DB::table('payments')
                ->where('status', 'paid')
                ->whereBetween('paid_at', [$weekStart, $weekEnd])
                ->sum('amount');

            $labels[] = 'W'.(4 - $i);
            $values[] = $total;
        }

        return compact('labels', 'values');
    }
}
