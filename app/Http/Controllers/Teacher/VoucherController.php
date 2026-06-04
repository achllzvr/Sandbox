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

        try {
            $record->update([
                'recipient_email' => $validated['email'],
                'sent_to_email_at' => now(),
            ]);

            Mail::to($validated['email'])->send(new VoucherInvitationMail($record, $validated['email']));
        } catch (\Throwable $e) {
            $record->update([
                'recipient_email' => null,
                'sent_to_email_at' => null,
            ]);

            report($e);

            return back()->withErrors(['email' => 'Could not send the voucher email. Please try again.']);
        }

        return back()->with('voucher_email_sent', [
            'voucher_id' => $record->id,
            'email' => $validated['email'],
        ]);
    }

    public function unlockFinalExams(Request $request)
    {
        $validated = $request->validate([
            'voucher_ids' => ['required', 'array', 'min:1'],
            'voucher_ids.*' => ['integer', 'exists:vouchers,id'],
        ]);

        $teacherId = $request->user()->id;

        $vouchers = Voucher::where('teacher_id', $teacherId)
            ->whereIn('id', $validated['voucher_ids'])
            ->get();

        if ($vouchers->isEmpty()) {
            return back()->withErrors(['voucher_ids' => 'No valid vouchers were selected.']);
        }

        $count = app(\App\Services\FinalExamAccessService::class)->unlockForVouchers($vouchers);

        return back()->with('voucher_exams_unlocked', [
            'count' => $count,
        ]);
    }
}
