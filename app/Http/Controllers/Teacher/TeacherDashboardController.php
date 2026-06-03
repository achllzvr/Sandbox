<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\Voucher;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $teacherId = auth()->id();

        $claimedVouchers = Voucher::where('teacher_id', $teacherId)->where('is_used', 1)->count();
        $totalVouchers = Voucher::where('teacher_id', $teacherId)->count();

        $totalStudents = Voucher::where('teacher_id', $teacherId)
            ->where('is_used', 1)
            ->whereNotNull('used_by')
            ->distinct('used_by')
            ->count('used_by');

        $activeCohorts = Cohort::where('teacher_id', $teacherId)->count();

        $claimLogs = Voucher::with(['certification', 'usedByUser'])
            ->where('teacher_id', $teacherId)
            ->where('is_used', 1)
            ->whereNotNull('used_at')
            ->orderByDesc('used_at')
            ->take(10)
            ->get()
            ->map(function ($voucher) {
                $student = $voucher->usedByUser;

                return [
                    'id' => $voucher->id,
                    'name' => $student ? trim($student->first_name.' '.$student->last_name) : 'N/A',
                    'email' => $student->email ?? 'N/A',
                    'shell_title' => $voucher->certification->title ?? 'N/A',
                    'shell_accent' => $voucher->certification->accent_color ?? null,
                    'claimed_at' => $voucher->used_at ? $voucher->used_at->format('M d, Y; g:ia') : 'N/A',
                ];
            });

        return Inertia::render('Teacher/Dashboard', [
            'metrics' => [
                'total_students' => $totalStudents,
                'vouchers_claimed' => $claimedVouchers,
                'vouchers_unclaimed' => max(0, $totalVouchers - $claimedVouchers),
                'active_cohorts' => $activeCohorts,
            ],
            'claimLogs' => $claimLogs,
        ]);
    }
}
