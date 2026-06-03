<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Cohort;
use App\Models\EnrollmentRequest;
use App\Models\Voucher;
use App\Services\XenditService;
use Illuminate\Http\Request;
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
            'isMock' => false,
        ]);
    }

    public function purchasing()
    {
        $shells = Certification::published()
            ->orderBy('title')
            ->get(['id', 'title', 'description', 'category', 'price', 'thumbnail', 'accent_color']);

        return Inertia::render('Teacher/Purchasing', [
            'shells' => $shells,
        ]);
    }

    public function vouchers(Request $request, XenditService $xenditService)
    {
        $teacherId = auth()->id();

        if ($request->filled('payment_reference') && $xenditService->isConfigured()) {
            $enrollmentRequest = EnrollmentRequest::where('payment_reference', $request->payment_reference)
                ->where('user_id', $teacherId)
                ->where('request_type', 'teacher_bulk')
                ->first();

            if ($enrollmentRequest) {
                $syncStatus = $xenditService->syncEnrollmentRequestPayment($enrollmentRequest);

                if ($syncStatus === 'paid') {
                    session()->flash(
                        'success',
                        "Payment confirmed via Xendit. {$enrollmentRequest->quantity} voucher codes are ready."
                    );
                } elseif ($syncStatus === 'pending') {
                    session()->flash(
                        'error',
                        'Xendit is still processing this payment. Wait a few seconds and refresh, or complete checkout in test mode.'
                    );
                } elseif ($syncStatus === 'failed' || $syncStatus === 'expired') {
                    session()->flash('error', 'This checkout did not complete. Start a new purchase from Buy Vouchers.');
                }
            }
        }

        $vouchers = Voucher::with(['certification', 'usedByUser'])
            ->where('teacher_id', $teacherId)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($voucher) {
                $student = $voucher->usedByUser;

                return [
                    'id' => $voucher->id,
                    'code' => $voucher->code,
                    'certification_id' => $voucher->certification_id,
                    'shell' => $voucher->certification->title ?? 'N/A',
                    'status' => $voucher->is_used ? 'claimed' : 'unclaimed',
                    'student' => ($voucher->is_used && $student)
                        ? trim($student->first_name.' '.$student->last_name)
                        : null,
                    'redeemed_at' => ($voucher->is_used && $voucher->used_at)
                        ? $voucher->used_at->format('Y-m-d')
                        : null,
                    'created_at' => $voucher->created_at ? $voucher->created_at->format('Y-m-d') : null,
                ];
            });

        $pendingRequests = EnrollmentRequest::with(['certification'])
            ->where('user_id', $teacherId)
            ->where('request_type', 'teacher_bulk')
            ->where('status', 'pending')
            ->orderByDesc('requested_at')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'certification_id' => $request->certification_id,
                    'shell' => $request->certification->title ?? 'N/A',
                    'quantity' => $request->quantity,
                    'amount' => $request->amount,
                    'payment_reference' => $request->payment_reference,
                    'requested_at' => $request->requested_at
                        ? \Carbon\Carbon::parse($request->requested_at)->format('M d, Y; g:ia')
                        : 'N/A',
                ];
            });

        return Inertia::render('Teacher/Vouchers', [
            'vouchers' => $vouchers,
            'pendingRequests' => $pendingRequests,
        ]);
    }
}
