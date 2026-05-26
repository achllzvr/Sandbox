<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Voucher;
use App\Models\Enrollment;

class VoucherController extends Controller
{
    public function redeem(Request $request)
    {
        $validated = $request->validate([
            "code" => "required|string|exists:vouchers,code",
        ]);

        $voucher = Voucher::where("code", $validated["code"])->first();

        if ($voucher->is_used) {
            return back()->withErrors(["code" => "This voucher has already been redeemed."]);
        }

        $voucher->update(["is_used" => true, "used_by" => auth()->id(), "used_at" => now()]);

        Enrollment::firstOrCreate([
            "user_id" => auth()->id(),
            "certification_id" => $voucher->certification_id,
        ], [
            "enrolled_at" => now(),
            "status" => "active"
        ]);

        return redirect()->route("student.dashboard")->with("success", "Voucher redeemed! You are now enrolled.");
    }
}
