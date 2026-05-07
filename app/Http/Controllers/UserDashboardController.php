<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use App\Models\Enrollment;
use App\Models\Voucher;
use Illuminate\Http\Request;

class UserDashboardController extends Controller
{
    public function dashboard()
    {
        $certifications = Certification::with(['lessons.modules'])
            ->where('is_active', 1)
            ->latest()
            ->get();

        $availableCertifications = $certifications->count();

        $enrolledIds = Enrollment::where('user_id', session('user_id'))
            ->where('payment_status', 'paid')
            ->pluck('certification_id')
            ->toArray();

        $enrolledCount = count($enrolledIds);

        return view('user.dashboard', compact(
            'certifications',
            'availableCertifications',
            'enrolledIds',
            'enrolledCount'
        ));
    }

    public function showEnroll(Certification $certification)
    {
        $alreadyEnrolled = Enrollment::where('user_id', session('user_id'))
            ->where('certification_id', $certification->id)
            ->where('payment_status', 'paid')
            ->exists();

        if ($alreadyEnrolled) {
            return redirect()->route('user.dashboard')
                ->with('error', 'You are already enrolled in this certification.');
        }

        return view('user.enroll', compact('certification'));
    }

    public function enroll(Request $request, Certification $certification)
    {
        $alreadyEnrolled = Enrollment::where('user_id', session('user_id'))
            ->where('certification_id', $certification->id)
            ->where('payment_status', 'paid')
            ->exists();

        if ($alreadyEnrolled) {
            return redirect()->route('user.dashboard')
                ->with('error', 'You are already enrolled in this certification.');
        }

        $amountPaid = $certification->price;
        $discountApplied = 0;
        $voucherCode = null;

        if ($request->filled('voucher_code')) {
            $voucher = Voucher::where('code', strtoupper($request->voucher_code))
                ->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>=', now()->toDateString());
                })
                ->whereColumn('uses_count', '<', 'max_uses')
                ->first();

            if (!$voucher) {
                return redirect()->back()
                    ->withErrors(['voucher_code' => 'Invalid, expired, or fully used voucher code.'])
                    ->withInput();
            }

            if ($voucher->discount_type === 'percent') {
                $discountApplied = $certification->price * ($voucher->discount_value / 100);
            } else {
                $discountApplied = min($voucher->discount_value, $certification->price);
            }

            $amountPaid = max(0, $certification->price - $discountApplied);
            $voucherCode = $voucher->code;
            $voucher->increment('uses_count');
        }

        Enrollment::create([
            'user_id' => session('user_id'),
            'certification_id' => $certification->id,
            'amount_paid' => $amountPaid,
            'voucher_code' => $voucherCode,
            'discount_applied' => $discountApplied,
            'payment_status' => 'paid',
        ]);

        return redirect()->route('user.dashboard')
            ->with('success', 'Successfully enrolled in ' . $certification->title . '!');
    }
}
