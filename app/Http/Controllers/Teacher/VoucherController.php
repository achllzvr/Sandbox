<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Mail\VoucherInvitationMail;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class VoucherController extends Controller
{
    public function sendEmail(Request $request, int $voucher)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'irreversible_acknowledged' => ['accepted'],
        ]);

        $record = Voucher::where('id', $voucher)
            ->where('teacher_id', $request->user()->id)
            ->firstOrFail();

        if ($record->is_used) {
            return back()->withErrors(['email' => 'This voucher has already been redeemed.']);
        }

        if ($record->sent_to_email_at) {
            return back()->withErrors(['email' => 'This voucher was already sent and cannot be resent.']);
        }

        Mail::to($validated['email'])->send(new VoucherInvitationMail($record, $validated['email']));

        $record->update([
            'recipient_email' => $validated['email'],
            'sent_to_email_at' => now(),
        ]);

        return back()->with('voucher_email_sent', [
            'voucher_id' => $record->id,
            'email' => $validated['email'],
        ]);
    }
}
