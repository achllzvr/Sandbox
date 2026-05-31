<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        // TODO[backend]: Implement ledger metrics, master ledger, withdrawals, webhooks, CSV export, date filters.
        // TODO[backend]: Wire WithdrawalController for status updates (mark processing/paid/decline).
        // TODO: Replace mock finance props with live payment ledger, withdrawal, and webhook data.
        return Inertia::render('Admin/Finance/Index', [
            'is_mock' => true,
            'filters' => $request->only(['tab', 'ledger_tab', 'search', 'status']),
        ]);
    }
}
