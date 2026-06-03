<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WithdrawalRequest;
use App\Services\AuditLogService;
use Illuminate\Http\Request;

class WithdrawalController extends Controller
{
    public function updateStatus(Request $request, WithdrawalRequest $withdrawal, AuditLogService $auditLog)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:processing,paid,declined'],
        ]);

        $dbStatus = match ($validated['status']) {
            'processing' => 'approved',
            'paid' => 'paid',
            'declined' => 'declined',
        };

        $updates = ['status' => $dbStatus];

        if ($validated['status'] === 'processing') {
            $updates['approved_by'] = auth()->id();
            $updates['approved_at'] = now();
        }

        if ($validated['status'] === 'paid') {
            $updates['paid_at'] = now();
            if (! $withdrawal->approved_at) {
                $updates['approved_by'] = auth()->id();
                $updates['approved_at'] = now();
            }
        }

        $withdrawal->update($updates);

        $auditLog->log('withdrawal_status_updated', auth()->id(), [
            'withdrawal_id' => $withdrawal->id,
            'creator_id' => $withdrawal->creator_id,
            'status' => $dbStatus,
        ]);

        return redirect()->back()->with('success', 'Withdrawal status updated.');
    }
}
