<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoucherController extends Controller
{
    public function redeem(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|exists:vouchers,code',
        ]);

        $voucher = Voucher::where('code', $validated['code'])->first();

        if ($voucher->is_used) {
            return back()->withErrors(['code' => 'This voucher has already been redeemed.']);
        }

        $userId = auth()->id();

        $voucher->update(['is_used' => true, 'used_by' => $userId, 'used_at' => now()]);

        Enrollment::firstOrCreate([
            'user_id' => $userId,
            'certification_id' => $voucher->certification_id,
        ], [
            'enrolled_at' => now(),
            'status' => 'active',
        ]);

        if ($voucher->cohort_id) {
            DB::table('cohort_students')->updateOrInsert(
                [
                    'cohort_id' => $voucher->cohort_id,
                    'user_id' => $userId,
                ],
                [
                    'voucher_id' => $voucher->id,
                    'joined_at' => now(),
                ],
            );
        }

        return redirect()->route('marketplace.index')->with('shop_success', $voucher->certification_id);
    }
}
