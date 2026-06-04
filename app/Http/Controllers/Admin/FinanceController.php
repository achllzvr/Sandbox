<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\FormatAppDateTime;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['tab', 'ledger_tab', 'search', 'status', 'date_from', 'date_to', 'certification_id']);

        $grossVolume = (float) DB::table('payments')->where('status', 'paid')->sum('amount');
        $creatorEarnings = (float) DB::table('creator_earnings')->sum('amount');
        $pendingPayouts = (float) DB::table('withdrawal_requests')
            ->whereIn('status', ['pending', 'approved'])
            ->sum('amount');
        $vouchersIssued = DB::table('vouchers')->count();

        $sales24h = (float) DB::table('payments')
            ->where('status', 'paid')
            ->where('paid_at', '>=', now()->subDay())
            ->sum('amount');

        $failures24h = DB::table('payments')
            ->where('status', 'failed')
            ->where('created_at', '>=', now()->subDay())
            ->count();

        $summary = [
            'gross_volume' => $grossVolume,
            'platform_net_profit' => max(0, $grossVolume - $creatorEarnings),
            'total_creator_earnings' => $creatorEarnings,
            'pending_payouts' => $pendingPayouts,
            'vouchers_issued' => $vouchersIssued,
        ];

        $webhookMetrics = [
            'sales_24h' => $sales24h,
            'vouchers_issued' => $vouchersIssued,
            'failures' => $failures24h,
        ];

        return Inertia::render('Admin/Finance/Index', [
            'is_mock' => false,
            'summary' => $summary,
            'webhook_metrics' => $webhookMetrics,
            'master_ledger' => $this->buildMasterLedger($filters),
            'withdrawals' => $this->buildWithdrawals($filters),
            'webhook_events' => $this->buildWebhookEvents($filters),
            'filters' => $filters,
        ]);
    }

    private function buildMasterLedger(array $filters): array
    {
        if (! Schema::hasTable('payments')) {
            return [];
        }

        $query = DB::table('payments')
            ->join('enrollment_requests', 'payments.enrollment_request_id', '=', 'enrollment_requests.id')
            ->join('certifications', 'enrollment_requests.certification_id', '=', 'certifications.id')
            ->join('users as buyers', 'enrollment_requests.user_id', '=', 'buyers.id')
            ->leftJoin('users as creators', 'certifications.created_by_user_id', '=', 'creators.id')
            ->leftJoin('creator_earnings', 'creator_earnings.payment_id', '=', 'payments.id')
            ->leftJoin('revenue_splits', 'revenue_splits.certification_id', '=', 'certifications.id')
            ->where('payments.status', 'paid')
            ->select([
                'payments.id',
                'payments.amount',
                'payments.paid_at',
                'payments.created_at',
                'payments.provider_invoice_id',
                'certifications.title as item_sold',
                'certifications.id as certification_id',
                'creators.first_name as creator_first_name',
                'creators.last_name as creator_last_name',
                'creator_earnings.amount as creator_cut_amount',
                'revenue_splits.admin_percentage',
                'revenue_splits.creator_percentage',
            ])
            ->orderByDesc(DB::raw('COALESCE(payments.paid_at, payments.created_at)'));

        $this->applyDateRange($query, $filters, 'COALESCE(payments.paid_at, payments.created_at)');

        if (! empty($filters['certification_id'])) {
            $query->where('certifications.id', $filters['certification_id']);
        }

        if (! empty($filters['search'])) {
            $search = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($search) {
                $q->where('payments.provider_invoice_id', 'like', $search)
                    ->orWhere('certifications.title', 'like', $search)
                    ->orWhere('creators.first_name', 'like', $search)
                    ->orWhere('creators.last_name', 'like', $search);
            });
        }

        return $query->limit(200)->get()->map(function ($row) {
            $gross = (float) $row->amount;
            $adminPct = (float) ($row->admin_percentage ?? 30);
            $creatorPct = (float) ($row->creator_percentage ?? 70);
            $creatorCut = $row->creator_cut_amount !== null
                ? (float) $row->creator_cut_amount
                : round($gross * ($creatorPct / 100), 2);
            $platformCut = round($gross - $creatorCut, 2);
            $creatorName = trim(($row->creator_first_name ?? '').' '.($row->creator_last_name ?? '')) ?: '—';
            $timestamp = $row->paid_at ?? $row->created_at;

            return [
                'id' => $row->id,
                'timestamp' => FormatAppDateTime::format($timestamp ? Carbon::parse($timestamp) : null),
                'transaction_id' => $row->provider_invoice_id ?: ('PAY-'.$row->id),
                'item_sold' => $row->item_sold,
                'creator' => $creatorName,
                'total_paid' => $gross,
                'gross_amount' => $gross,
                'platform_cut' => $platformCut,
                'creator_cut' => $creatorCut,
            ];
        })->all();
    }

    private function buildWithdrawals(array $filters): array
    {
        if (! Schema::hasTable('withdrawal_requests')) {
            return [];
        }

        $query = DB::table('withdrawal_requests')
            ->join('users', 'withdrawal_requests.creator_id', '=', 'users.id')
            ->select([
                'withdrawal_requests.id',
                'withdrawal_requests.amount',
                'withdrawal_requests.status',
                'withdrawal_requests.requested_at',
                'withdrawal_requests.created_at',
                'users.first_name',
                'users.last_name',
                'users.contact_no',
            ])
            ->orderByDesc(DB::raw('COALESCE(withdrawal_requests.requested_at, withdrawal_requests.created_at)'));

        $this->applyDateRange($query, $filters, 'COALESCE(withdrawal_requests.requested_at, withdrawal_requests.created_at)');

        if (! empty($filters['status'])) {
            $dbStatus = $filters['status'] === 'processing' ? 'approved' : $filters['status'];
            $query->where('withdrawal_requests.status', $dbStatus);
        }

        if (! empty($filters['search'])) {
            $search = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($search) {
                $q->where('users.first_name', 'like', $search)
                    ->orWhere('users.last_name', 'like', $search)
                    ->orWhere('users.contact_no', 'like', $search);
            });
        }

        return $query->limit(200)->get()->map(function ($row) {
            $uiStatus = match ($row->status) {
                'approved' => 'processing',
                default => $row->status,
            };

            return [
                'id' => $row->id,
                'timestamp' => FormatAppDateTime::format(Carbon::parse($row->requested_at ?? $row->created_at)),
                'creator_name' => trim($row->first_name.' '.$row->last_name),
                'requested_amount' => (float) $row->amount,
                'payment_method' => 'GCash',
                'payment_detail' => $row->contact_no ?: '—',
                'status' => $uiStatus,
            ];
        })->all();
    }

    private function buildWebhookEvents(array $filters): array
    {
        if (! Schema::hasTable('payments')) {
            return [];
        }

        $query = DB::table('payments')
            ->join('enrollment_requests', 'payments.enrollment_request_id', '=', 'enrollment_requests.id')
            ->join('certifications', 'enrollment_requests.certification_id', '=', 'certifications.id')
            ->join('users', 'enrollment_requests.user_id', '=', 'users.id')
            ->whereIn('payments.status', ['paid', 'failed'])
            ->select([
                'payments.id',
                'payments.amount',
                'payments.status as payment_status',
                'payments.paid_at',
                'payments.created_at',
                'payments.provider_invoice_id',
                'payments.raw_payload',
                'certifications.title as item_purchased',
                'users.first_name',
                'users.last_name',
                'users.email',
                'enrollment_requests.id as enrollment_request_id',
            ])
            ->orderByDesc(DB::raw('COALESCE(payments.paid_at, payments.created_at)'));

        $this->applyDateRange($query, $filters, 'COALESCE(payments.paid_at, payments.created_at)');

        if (! empty($filters['status'])) {
            $paymentStatus = $filters['status'] === 'success' ? 'paid' : ($filters['status'] === 'failed' ? 'failed' : null);
            if ($paymentStatus) {
                $query->where('payments.status', $paymentStatus);
            }
        }

        if (! empty($filters['search'])) {
            $search = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($search) {
                $q->where('payments.provider_invoice_id', 'like', $search)
                    ->orWhere('users.first_name', 'like', $search)
                    ->orWhere('users.last_name', 'like', $search)
                    ->orWhere('users.email', 'like', $search)
                    ->orWhere('certifications.title', 'like', $search);
            });
        }

        $rows = $query->limit(200)->get();
        $voucherCodes = $this->voucherCodesByEnrollmentRequest(
            $rows->pluck('enrollment_request_id')->filter()->unique()->all()
        );

        return $rows->map(function ($row) use ($voucherCodes) {
            return [
                'id' => $row->id,
                'timestamp' => FormatAppDateTime::format(Carbon::parse($row->paid_at ?? $row->created_at)),
                'transaction_id' => $row->provider_invoice_id ?: ('PAY-'.$row->id),
                'user_name' => trim($row->first_name.' '.$row->last_name),
                'user_email' => $row->email,
                'item_purchased' => $row->item_purchased,
                'amount' => (float) $row->amount,
                'voucher' => $voucherCodes[$row->enrollment_request_id] ?? null,
                'status' => $row->payment_status === 'paid' ? 'success' : 'failed',
                'raw_payload' => $row->raw_payload,
            ];
        })->all();
    }

    private function voucherCodesByEnrollmentRequest(array $enrollmentRequestIds): array
    {
        if (empty($enrollmentRequestIds) || ! Schema::hasTable('vouchers')) {
            return [];
        }

        return DB::table('vouchers')
            ->whereIn('enrollment_request_id', $enrollmentRequestIds)
            ->orderBy('id')
            ->get(['enrollment_request_id', 'code'])
            ->groupBy('enrollment_request_id')
            ->map(fn ($group) => $group->first()->code)
            ->all();
    }

    private function applyDateRange($query, array $filters, string $column): void
    {
        if (! empty($filters['date_from'])) {
            $query->whereRaw("DATE({$column}) >= ?", [$filters['date_from']]);
        }

        if (! empty($filters['date_to'])) {
            $query->whereRaw("DATE({$column}) <= ?", [$filters['date_to']]);
        }
    }
}
