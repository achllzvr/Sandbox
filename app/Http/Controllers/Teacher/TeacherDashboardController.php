<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\User;
use App\Models\Voucher;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $teacherId = auth()->id();

        $cohorts = Cohort::where('teacher_id', $teacherId)->withCount('students')->get();
        $totalStudents = $cohorts->sum('students_count');

        $vouchers = Voucher::where('teacher_id', $teacherId)->get();
        $claimed = $vouchers->where('is_used', true)->count();
        $unclaimed = $vouchers->where('is_used', false)->count();

        $claimLogs = Voucher::where('teacher_id', $teacherId)
            ->where('is_used', true)
            ->with(['usedByUser'])
            ->orderByDesc('used_at')
            ->limit(10)
            ->get()
            ->map(fn ($voucher) => [
                'code' => $voucher->code,
                'student' => $voucher->usedByUser?->full_name ?? 'Unknown',
                'claimed_at' => optional($voucher->used_at)->toDateTimeString(),
            ]);

        return Inertia::render('Teacher/Dashboard', [
            'metrics' => [
                'total_students' => $totalStudents,
                'active_cohorts' => $cohorts->count(),
                'vouchers_claimed' => $claimed,
                'vouchers_unclaimed' => $unclaimed,
            ],
            'claimLogs' => $claimLogs,
            'isMock' => false,
        ]);
    }
}
