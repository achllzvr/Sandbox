<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\CreatorEarning;
use App\Models\WithdrawalRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WithdrawalController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $availableBalance = (float) CreatorEarning::where('creator_id', $userId)
            ->where('status', 'available')
            ->sum('amount');

        $pendingBalance = (float) CreatorEarning::where('creator_id', $userId)
            ->where('status', 'pending')
            ->sum('amount');

        $earnings = CreatorEarning::where('creator_id', $userId)
            ->with('certification:id,title')
            ->latest()
            ->take(20)
            ->get()
            ->map(fn (CreatorEarning $e) => [
                'id' => $e->id,
                'certification' => $e->certification?->title ?? '—',
                'amount' => (float) $e->amount,
                'status' => $e->status,
                'created_at' => $e->created_at?->toDateTimeString(),
            ]);

        $withdrawals = WithdrawalRequest::where('creator_id', $userId)
            ->latest()
            ->take(10)
            ->get(['id', 'amount', 'status', 'requested_at', 'paid_at']);

        return Inertia::render('Creator/Wallet/Index', [
            'availableBalance' => $availableBalance,
            'pendingBalance' => $pendingBalance,
            'earnings' => $earnings,
            'withdrawals' => $withdrawals,
        ]);
    }

    public function store(Request $request)
    {
        $userId = auth()->id();

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
        ]);

        $available = (float) CreatorEarning::where('creator_id', $userId)
            ->where('status', 'available')
            ->sum('amount');

        if ($validated['amount'] > $available) {
            return back()->with('error', 'Withdrawal amount exceeds available balance.');
        }

        WithdrawalRequest::create([
            'creator_id' => $userId,
            'amount' => $validated['amount'],
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        return back()->with('success', 'Withdrawal request submitted.');
    }
}
