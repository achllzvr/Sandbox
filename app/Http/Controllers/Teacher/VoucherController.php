<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    /**
     * TODO[backend]: Send voucher email and persist sent_to_email_at / recipient_email.
     */
    public function sendEmail(Request $request, int $voucher)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'irreversible_acknowledged' => ['accepted'],
        ]);

        return back()->with('voucher_email_sent', [
            'voucher_id' => $voucher,
            'email' => $validated['email'],
        ]);
    }
}
