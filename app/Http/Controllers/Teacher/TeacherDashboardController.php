<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Voucher;
use App\Models\EnrollmentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $teacherId = auth()->id();
        
        // 1. Calculate live database metrics
        $claimedVouchers = Voucher::where('teacher_id', $teacherId)->where('is_used', 1)->count();
        $totalVouchers = Voucher::where('teacher_id', $teacherId)->count();
        
        // Total unique students who have claimed this teacher's vouchers
        $totalStudents = Voucher::where('teacher_id', $teacherId)
            ->where('is_used', 1)
            ->whereNotNull('used_by')
            ->distinct('used_by')
            ->count('used_by');

        $activeCohorts = \App\Models\Cohort::where('teacher_id', $teacherId)->count();
        
        // 2. Fetch the top 5 recent claimed vouchers for this teacher's vouchers
        $claimLogs = Voucher::with(['certification', 'user'])
            ->where('teacher_id', $teacherId)
            ->where('is_used', 1)
            ->whereNotNull('used_at')
            ->orderBy('used_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($v) {
                return [
                    'id' => $v->id,
                    'name' => $v->user ? ($v->user->first_name . ' ' . $v->user->last_name) : 'N/A',
                    'email' => $v->user->email ?? 'N/A',
                    'shell' => $v->certification->title ?? 'N/A',
                    'timestamp' => $v->used_at ? $v->used_at->format('M d, Y; g:ia') : 'N/A',
                ];
            });

        return Inertia::render('Teacher/Dashboard', [
            'metrics' => [
                'total_students' => $totalStudents,
                'claimed_vouchers' => $claimedVouchers,
                'unclaimed_vouchers' => $totalVouchers - $claimedVouchers,
                'active_cohorts' => $activeCohorts,
                'avg_cohort_score' => 88
            ],
            'claimLogs' => $claimLogs,
            'flash' => [
                'success' => session('success'),
                'error' => session('error') ?? null,
            ]
        ]);
    }

    public function purchasing()
    {
        $shells = Certification::published()
            ->orderBy('title', 'asc')
            ->get();

        return Inertia::render('Teacher/Purchasing', [
            'shells' => $shells
        ]);
    }

    public function vouchers()
    {
        $teacherId = auth()->id();
        
        $vouchers = Voucher::with(['certification', 'user'])
            ->where('teacher_id', $teacherId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($v) {
                return [
                    'id' => $v->id,
                    'code' => $v->code,
                    'certification_id' => $v->certification_id,
                    'shell' => $v->certification->title ?? 'N/A',
                    'status' => $v->is_used ? 'claimed' : 'unclaimed',
                    'student' => ($v->is_used && $v->user) ? ($v->user->first_name . ' ' . $v->user->last_name) : null,
                    'redeemed_at' => ($v->is_used && $v->used_at) ? $v->used_at->format('Y-m-d') : null,
                    'created_at' => $v->created_at ? $v->created_at->format('Y-m-d') : null,
                ];
            });

        $pendingRequests = EnrollmentRequest::with(['certification'])
            ->where('user_id', $teacherId)
            ->where('request_type', 'teacher_bulk')
            ->where('status', 'pending')
            ->orderBy('requested_at', 'desc')
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'certification_id' => $r->certification_id,
                    'shell' => $r->certification->title ?? 'N/A',
                    'quantity' => $r->quantity,
                    'amount' => $r->amount,
                    'payment_reference' => $r->payment_reference,
                    'requested_at' => $r->requested_at ? \Carbon\Carbon::parse($r->requested_at)->format('M d, Y; g:ia') : 'N/A',
                ];
            });

        return Inertia::render('Teacher/Vouchers', [
            'vouchers' => $vouchers,
            'pendingRequests' => $pendingRequests,
            'flash' => [
                'success' => session('success'),
                'error' => session('error') ?? null,
            ]
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
