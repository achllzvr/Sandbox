<?php

namespace App\Services;

use App\Models\CreatorEarning;
use App\Models\Payment;
use App\Models\WithdrawalRequest;
use Illuminate\Support\Facades\DB;

class CreatorEarningService
{
    public function recordForPayment(Payment $payment): ?CreatorEarning
    {
        $existing = CreatorEarning::where('payment_id', $payment->id)->first();
        if ($existing) {
            return $existing;
        }

        $payment->loadMissing('enrollmentRequest.certification');
        $enrollmentRequest = $payment->enrollmentRequest;
        $certification = $enrollmentRequest?->certification;
        $creatorId = $certification?->created_by_user_id;

        if (! $creatorId) {
            return null;
        }

        $split = DB::table('revenue_splits')
            ->where('certification_id', $certification->id)
            ->first();

        $creatorPct = (float) ($split->creator_percentage ?? 70);
        $amount = round((float) $payment->amount * ($creatorPct / 100), 2);

        if ($amount <= 0) {
            return null;
        }

        return CreatorEarning::create([
            'creator_id' => $creatorId,
            'certification_id' => $certification->id,
            'payment_id' => $payment->id,
            'amount' => $amount,
            'status' => 'available',
        ]);
    }

    public function availableBalance(int $creatorId): float
    {
        $available = (float) CreatorEarning::where('creator_id', $creatorId)
            ->where('status', 'available')
            ->sum('amount');

        $reserved = (float) WithdrawalRequest::where('creator_id', $creatorId)
            ->whereIn('status', ['pending', 'approved'])
            ->sum('amount');

        return max(0, round($available - $reserved, 2));
    }

    public function settleWithdrawalPaid(WithdrawalRequest $withdrawal): void
    {
        DB::transaction(function () use ($withdrawal) {
            $remaining = (float) $withdrawal->amount;

            $earnings = CreatorEarning::where('creator_id', $withdrawal->creator_id)
                ->where('status', 'available')
                ->orderBy('id')
                ->lockForUpdate()
                ->get();

            foreach ($earnings as $earning) {
                if ($remaining <= 0) {
                    break;
                }

                $earningAmount = (float) $earning->amount;

                if ($earningAmount <= $remaining + 0.001) {
                    $earning->update(['status' => 'withdrawn']);
                    $remaining -= $earningAmount;

                    continue;
                }

                $earning->update([
                    'amount' => round($earningAmount - $remaining, 2),
                    'status' => 'available',
                ]);

                CreatorEarning::create([
                    'creator_id' => $earning->creator_id,
                    'certification_id' => $earning->certification_id,
                    'payment_id' => $earning->payment_id,
                    'amount' => round($remaining, 2),
                    'status' => 'withdrawn',
                ]);

                $remaining = 0;
            }
        });
    }
}
