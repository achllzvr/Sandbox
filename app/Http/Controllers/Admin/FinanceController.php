<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $grossVolume = (float) DB::table('payments')->where('status', 'completed')->sum('amount');
        $creatorEarnings = (float) DB::table('creator_earnings')->sum('amount');
        $pendingPayouts = (float) DB::table('creator_earnings')->where('status', 'pending')->sum('amount');
        $vouchersIssued = DB::table('vouchers')->count();

        return Inertia::render('Admin/Finance/Index', [
            'is_mock' => false,
            'summary' => [
                'gross_volume' => $grossVolume,
                'platform_net_profit' => max(0, $grossVolume - $creatorEarnings),
                'total_creator_earnings' => $creatorEarnings,
                'pending_payouts' => $pendingPayouts,
                'vouchers_issued' => $vouchersIssued,
            ],
            'filters' => $request->only(['tab', 'ledger_tab', 'search', 'status']),
        ]);
    }
}
