<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserDashboardController extends Controller
{
    public function dashboard()
    {
        $certifications = Certification::with(['lessons.modules'])
            ->where('is_active', 1)
            ->latest()
            ->get();

        $availableCertifications = $certifications->count();

        $enrolledIds = DB::table('enrollment_requests')
            ->where('user_id', auth()->id())
            ->where('status', 'approved')
            ->pluck('certification_id')
            ->toArray();

        $enrolledCount = count($enrolledIds);

        $recentEnrollments = Certification::whereIn('id', $enrolledIds)
            ->latest()
            ->take(3)
            ->get();

        return view('user.dashboard', compact(
            'certifications',
            'availableCertifications',
            'enrolledIds',
            'enrolledCount',
            'recentEnrollments'
        ));
    }

    public function showEnroll(Certification $certification)
    {
        $alreadyEnrolled = DB::table('enrollment_requests')
            ->where('user_id', auth()->id())
            ->where('certification_id', $certification->id)
            ->where('status', 'approved')
            ->exists();

        if ($alreadyEnrolled) {
            return redirect()->route('user.dashboard')
                ->with('error', 'You are already enrolled in this certification.');
        }

        return view('user.enroll', compact('certification'));
    }

    public function enroll(Request $request, Certification $certification)
    {
        $alreadyEnrolled = DB::table('enrollment_requests')
            ->where('user_id', auth()->id())
            ->where('certification_id', $certification->id)
            ->where('status', 'approved')
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

        DB::table('enrollment_requests')->insert([
            'user_id' => auth()->id(),
            'certification_id' => $certification->id,
            'status' => 'approved',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('user.dashboard')
            ->with('success', 'Successfully enrolled in ' . $certification->title . '!');
    }
}
