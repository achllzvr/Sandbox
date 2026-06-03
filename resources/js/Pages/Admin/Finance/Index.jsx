import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/Admin/AdminBadge';
import AdminModal from '@/Components/Admin/AdminModal';
import AdminDateRangeModal from '@/Components/Admin/AdminDateRangeModal';
import AdminTablePagination from '@/Components/Admin/AdminTablePagination';
import { useAdminPagination } from '@/hooks/useAdminPagination';
import {
    formatCurrency,
    formatFinanceTimestamp,
    WITHDRAWAL_STATUS_OPTIONS,
    WEBHOOK_STATUS_OPTIONS,
} from '@/Components/Admin/AdminFinanceMockData';
import { useCallback, useEffect, useState } from 'react';

const LEDGER_METRIC_ITEMS = [
    { key: 'gross_volume', label: 'Gross volume', accent: '#cf7860' },
    { key: 'platform_net_profit', label: 'Platform net profit', accent: '#6b7fd4' },
    { key: 'total_creator_earnings', label: 'Total creator earnings', accent: '#8ecf9f' },
    { key: 'pending_payouts', label: 'Pending payouts', accent: '#e09890' },
];

const WEBHOOK_METRIC_ITEMS = [
    { key: 'sales_24h', label: '24h sales', accent: '#cf7860' },
    { key: 'vouchers_issued', label: 'Vouchers issued', accent: '#6b7fd4' },
    { key: 'failures', label: 'Failures / errors', accent: '#e09890' },
];

export default function FinanceIndex({
    filters = {},
    summary = {},
    webhook_metrics = {},
    master_ledger = [],
    withdrawals = [],
    webhook_events = [],
}) {
    const [topTab, setTopTab] = useState(filters?.tab === 'webhook' ? 'webhook' : 'ledger');
    const [ledgerTab, setLedgerTab] = useState(
        filters?.ledger_tab === 'withdrawals' ? 'withdrawals' : 'master'
    );
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [actionModal, setActionModal] = useState(null);
    const [withdrawalMenuId, setWithdrawalMenuId] = useState(null);
    const [webhookMenuId, setWebhookMenuId] = useState(null);
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');
    const [showDateModal, setShowDateModal] = useState(false);
    const [statusProcessing, setStatusProcessing] = useState(false);

    const applyFilters = useCallback(
        (overrides = {}) => {
            router.get(
                route('admin.finance.index'),
                {
                    tab: topTab === 'webhook' ? 'webhook' : undefined,
                    ledger_tab: ledgerTab === 'withdrawals' ? 'withdrawals' : undefined,
                    search: search || undefined,
                    status: statusFilter || undefined,
                    date_from: dateFrom || undefined,
                    date_to: dateTo || undefined,
                    certification_id: filters?.certification_id || undefined,
                    ...overrides,
                },
                { preserveState: true, replace: true }
            );
        },
        [topTab, ledgerTab, search, statusFilter, dateFrom, dateTo, filters?.certification_id]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                applyFilters({ search: search || undefined });
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [search, filters?.search, applyFilters]);

    const masterLedgerPagination = useAdminPagination(master_ledger);
    const withdrawalsPagination = useAdminPagination(withdrawals);
    const webhooksPagination = useAdminPagination(webhook_events);

    function openTodoAction(type, payload) {
        setActionModal({ type, payload });
        setWithdrawalMenuId(null);
        setWebhookMenuId(null);
    }

    function updateWithdrawalStatus(row, status) {
        if (statusProcessing) return;
        setStatusProcessing(true);
        setWithdrawalMenuId(null);
        router.put(
            route('admin.withdrawals.status.update', row.id),
            { status },
            {
                preserveScroll: true,
                onFinish: () => setStatusProcessing(false),
            }
        );
    }

    function switchTopTab(tab) {
        setTopTab(tab);
        applyFilters({ tab: tab === 'webhook' ? 'webhook' : undefined });
    }

    function switchLedgerTab(tab) {
        setLedgerTab(tab);
        applyFilters({ ledger_tab: tab === 'withdrawals' ? 'withdrawals' : undefined });
    }

    function handleStatusChange(e) {
        const value = e.target.value;
        setStatusFilter(value);
        applyFilters({ status: value || undefined });
    }

    function applyDateRange() {
        setShowDateModal(false);
        applyFilters({
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        });
    }

    function clearDateRange() {
        setDateFrom('');
        setDateTo('');
        setShowDateModal(false);
        applyFilters({ date_from: undefined, date_to: undefined });
    }

    const topbarTabs = (
        <div className="admin-page-tabs admin-page-tabs--topbar">
            <button
                type="button"
                className={`admin-page-tabs__btn ${topTab === 'ledger' ? 'admin-page-tabs__btn--active' : ''}`}
                onClick={() => switchTopTab('ledger')}
                aria-selected={topTab === 'ledger'}
            >
                Financial ledger
            </button>
            <button
                type="button"
                className={`admin-page-tabs__btn ${topTab === 'webhook' ? 'admin-page-tabs__btn--active' : ''}`}
                onClick={() => switchTopTab('webhook')}
                aria-selected={topTab === 'webhook'}
            >
                Webhook monitor
            </button>
        </div>
    );

    const metricItems = topTab === 'ledger' ? LEDGER_METRIC_ITEMS : WEBHOOK_METRIC_ITEMS;
    const metricData = topTab === 'ledger' ? summary : webhook_metrics;

    function formatMetricValue(key) {
        const val = metricData[key];
        if (
            ['gross_volume', 'platform_net_profit', 'total_creator_earnings', 'sales_24h'].includes(
                key
            )
        ) {
            return formatCurrency(val ?? 0);
        }
        return val ?? 0;
    }

    const dateRangeLabel =
        dateFrom || dateTo
            ? `${dateFrom || '…'} – ${dateTo || '…'}`
            : 'Date range';

    return (
        <AdminLayout pageTitle="Finance" topbarEnd={topbarTabs}>
            <Head title="Finance" />

            <div
                className={`admin-finance-metrics ${topTab === 'webhook' ? 'admin-finance-metrics--3' : ''}`}
            >
                {metricItems.map((item) => (
                    <div
                        key={item.key}
                        className="admin-stat admin-finance-metric"
                        style={{ '--stat-stroke': item.accent }}
                    >
                        <span className="admin-stat__value">{formatMetricValue(item.key)}</span>
                        <p className="admin-stat__label">{item.label}</p>
                    </div>
                ))}
            </div>

            <div className="admin-subtoolbar">
                <input
                    type="search"
                    placeholder={
                        topTab === 'ledger'
                            ? ledgerTab === 'master'
                                ? 'Search transactions...'
                                : 'Search withdrawals...'
                            : 'Search webhook events...'
                    }
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field admin-subtoolbar__search"
                    aria-label="Search finance records"
                />
                <div
                    className={`admin-subtoolbar__control admin-subtoolbar__role-wrap ${
                        topTab === 'webhook' || ledgerTab === 'withdrawals' ? '' : 'admin-subtoolbar__control--hidden'
                    }`}
                >
                    <select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="input-field admin-subtoolbar__role"
                        aria-label="Filter by status"
                        aria-hidden={topTab !== 'webhook' && ledgerTab !== 'withdrawals'}
                        tabIndex={topTab === 'webhook' || ledgerTab === 'withdrawals' ? 0 : -1}
                    >
                        {(topTab === 'webhook' ? WEBHOOK_STATUS_OPTIONS : WITHDRAWAL_STATUS_OPTIONS).map(
                            (opt) => (
                                <option key={opt.value || 'all'} value={opt.value}>
                                    {opt.label}
                                </option>
                            )
                        )}
                    </select>
                </div>
                <button
                    type="button"
                    className={`admin-btn admin-btn--secondary ${dateFrom || dateTo ? 'admin-btn--active-filter' : ''}`}
                    onClick={() => setShowDateModal(true)}
                >
                    {dateRangeLabel}
                </button>
                <div
                    className={`admin-subtoolbar__control admin-subtoolbar__add-wrap ${
                        topTab === 'ledger' ? '' : 'admin-subtoolbar__control--hidden'
                    }`}
                >
                    <button
                        type="button"
                        className="admin-btn admin-btn--secondary admin-subtoolbar__add"
                        onClick={() => openTodoAction('export_csv')}
                        aria-hidden={topTab !== 'ledger'}
                        tabIndex={topTab === 'ledger' ? 0 : -1}
                    >
                        Export to CSV
                    </button>
                </div>
            </div>

            {topTab === 'ledger' ? (
                <div className="admin-finance-panel admin-card admin-card--chunky admin-panel--clip-visible">
                    <div className="admin-finance-panel__tabs" role="tablist" aria-label="Ledger views">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={ledgerTab === 'master'}
                            className={`admin-finance-panel__tab ${ledgerTab === 'master' ? 'admin-finance-panel__tab--active' : ''}`}
                            onClick={() => switchLedgerTab('master')}
                        >
                            Master ledger
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={ledgerTab === 'withdrawals'}
                            className={`admin-finance-panel__tab ${ledgerTab === 'withdrawals' ? 'admin-finance-panel__tab--active' : ''}`}
                            onClick={() => switchLedgerTab('withdrawals')}
                        >
                            Withdrawal management
                        </button>
                    </div>

                    <div key={`ledger-${ledgerTab}`} className="admin-finance-panel__view admin-panel-swap">
                    {ledgerTab === 'master' ? (
                        <>
                            <div className="admin-finance-panel__header admin-finance-panel__header--ledger">
                                <span>Timestamp</span>
                                <span>Transaction ID</span>
                                <span>Item sold</span>
                                <span>Creator</span>
                                <span>Gross</span>
                                <span>Platform cut</span>
                                <span>Creator cut</span>
                            </div>
                            <div className="admin-finance-panel__body">
                                {master_ledger.length === 0 ? (
                                    <p className="admin-empty" style={{ padding: '3rem' }}>
                                        No ledger entries found.
                                    </p>
                                ) : (
                                    masterLedgerPagination.paginatedItems.map((row) => (
                                        <article key={row.id} className="admin-finance-row admin-finance-row--ledger">
                                            <span className="admin-finance-row__cell">{formatFinanceTimestamp(row.timestamp)}</span>
                                            <span className="admin-finance-row__cell admin-finance-row__mono">{row.transaction_id}</span>
                                            <span className="admin-finance-row__cell">
                                                <span className="admin-finance-pill admin-finance-pill--info">{row.item_sold}</span>
                                            </span>
                                            <span className="admin-finance-row__cell">
                                                <span className="admin-finance-pill admin-finance-pill--info">{row.creator}</span>
                                            </span>
                                            <span className="admin-finance-row__cell admin-finance-row__amount">{formatCurrency(row.gross_amount)}</span>
                                            <span className="admin-finance-row__cell admin-finance-row__amount">{formatCurrency(row.platform_cut)}</span>
                                            <span className="admin-finance-row__cell admin-finance-row__amount">{formatCurrency(row.creator_cut)}</span>
                                        </article>
                                    ))
                                )}
                            </div>
                            <AdminTablePagination
                                page={masterLedgerPagination.page}
                                totalPages={masterLedgerPagination.totalPages}
                                totalItems={masterLedgerPagination.totalItems}
                                rangeStart={masterLedgerPagination.rangeStart}
                                rangeEnd={masterLedgerPagination.rangeEnd}
                                onPageChange={masterLedgerPagination.setPage}
                            />
                        </>
                    ) : (
                        <>
                            <div className="admin-finance-panel__header admin-finance-panel__header--withdrawals">
                                <span>Timestamp</span>
                                <span>Creator name</span>
                                <span>Requested amount</span>
                                <span>Payment method</span>
                                <span>Status</span>
                                <span>Actions</span>
                            </div>
                            <div className="admin-finance-panel__body">
                                {withdrawals.length === 0 ? (
                                    <p className="admin-empty" style={{ padding: '3rem' }}>
                                        No withdrawal requests found.
                                    </p>
                                ) : (
                                    withdrawalsPagination.paginatedItems.map((row, index) => {
                                        const popoverAbove = index >= withdrawalsPagination.paginatedItems.length - 2;
                                        return (
                                        <article key={row.id} className="admin-finance-row admin-finance-row--withdrawals">
                                            <span className="admin-finance-row__cell">{formatFinanceTimestamp(row.timestamp)}</span>
                                            <span className="admin-finance-row__cell admin-finance-row__name">{row.creator_name}</span>
                                            <span className="admin-finance-row__cell admin-finance-row__amount">{formatCurrency(row.requested_amount)}</span>
                                            <span className="admin-finance-row__cell">
                                                <span className="admin-finance-pill admin-finance-pill--payment">
                                                    {row.payment_method} {row.payment_detail}
                                                </span>
                                            </span>
                                            <span className="admin-finance-row__cell">
                                                <AdminBadge value={row.status === 'pending' ? 'pending' : row.status === 'processing' ? 'pending_review' : 'published'} label={row.status === 'paid' ? 'Paid' : row.status === 'processing' ? 'Processing' : 'Pending approval'} />
                                            </span>
                                            <span className="admin-finance-row__cell admin-finance-row__actions">
                                                <div className="admin-finance-action-wrap">
                                                    <button
                                                        type="button"
                                                        className="admin-cert-action admin-cert-action--finance admin-cert-action--compact"
                                                        disabled={statusProcessing}
                                                        onClick={() => setWithdrawalMenuId(withdrawalMenuId === row.id ? null : row.id)}
                                                    >
                                                        Update status
                                                    </button>
                                                    {withdrawalMenuId === row.id && (
                                                        <div className={`admin-finance-popover ${popoverAbove ? 'admin-finance-popover--above' : ''}`}>
                                                            {row.status === 'pending' && (
                                                                <>
                                                                    <button type="button" className="admin-finance-popover__btn admin-finance-popover__btn--process" onClick={() => updateWithdrawalStatus(row, 'processing')}>
                                                                        Mark as processing
                                                                    </button>
                                                                    <button type="button" className="admin-finance-popover__btn admin-finance-popover__btn--decline" onClick={() => updateWithdrawalStatus(row, 'declined')}>
                                                                        Decline request
                                                                    </button>
                                                                </>
                                                            )}
                                                            {row.status === 'processing' && (
                                                                <button type="button" className="admin-finance-popover__btn admin-finance-popover__btn--process" onClick={() => updateWithdrawalStatus(row, 'paid')}>
                                                                    Mark as paid
                                                                </button>
                                                            )}
                                                            {row.status === 'paid' && (
                                                                <p className="admin-table__muted">No actions available.</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </span>
                                        </article>
                                        );
                                    })
                                )}
                            </div>
                            <AdminTablePagination
                                page={withdrawalsPagination.page}
                                totalPages={withdrawalsPagination.totalPages}
                                totalItems={withdrawalsPagination.totalItems}
                                rangeStart={withdrawalsPagination.rangeStart}
                                rangeEnd={withdrawalsPagination.rangeEnd}
                                onPageChange={withdrawalsPagination.setPage}
                            />
                        </>
                    )}
                    </div>
                </div>
            ) : (
                <div className="admin-finance-panel admin-card admin-card--chunky admin-panel--clip-visible">
                    <div className="admin-finance-panel__header admin-finance-panel__header--webhook">
                        <span>Timestamp</span>
                        <span>Transaction ID</span>
                        <span>User details</span>
                        <span>Item purchased</span>
                        <span>Amount</span>
                        <span>Voucher</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>
                    <div className="admin-finance-panel__body">
                        {webhook_events.length === 0 ? (
                            <p className="admin-empty" style={{ padding: '3rem' }}>
                                No webhook events found.
                            </p>
                        ) : (
                            webhooksPagination.paginatedItems.map((row, index) => {
                                const popoverAbove = index >= webhooksPagination.paginatedItems.length - 2;
                                return (
                                <article key={row.id} className="admin-finance-row admin-finance-row--webhook">
                                    <span className="admin-finance-row__cell">{formatFinanceTimestamp(row.timestamp)}</span>
                                    <span className="admin-finance-row__cell admin-finance-row__mono">{row.transaction_id}</span>
                                    <span className="admin-finance-row__cell">
                                        <span className="admin-finance-row__name">{row.user_name}</span>
                                        <span className="admin-finance-row__sub">{row.user_email}</span>
                                    </span>
                                    <span className="admin-finance-row__cell">
                                        <span className="admin-finance-pill admin-finance-pill--info">{row.item_purchased}</span>
                                    </span>
                                    <span className="admin-finance-row__cell admin-finance-row__amount">{formatCurrency(row.amount)}</span>
                                    <span className="admin-finance-row__cell">{row.voucher || '—'}</span>
                                    <span className="admin-finance-row__cell">
                                        <AdminBadge value={row.status === 'success' ? 'published' : 'denied'} label={row.status === 'success' ? 'Success' : 'Failed'} />
                                    </span>
                                    <span className="admin-finance-row__cell admin-finance-row__actions">
                                        <div className="admin-finance-action-wrap">
                                            <button
                                                type="button"
                                                className="admin-action-btn admin-action-btn--info"
                                                onClick={() => setWebhookMenuId(webhookMenuId === row.id ? null : row.id)}
                                            >
                                                Actions
                                            </button>
                                            {webhookMenuId === row.id && (
                                                <div className={`admin-finance-popover admin-finance-popover--webhook ${popoverAbove ? 'admin-finance-popover--above' : ''}`}>
                                                    <button type="button" className="admin-finance-popover__btn admin-finance-popover__btn--process" onClick={() => openTodoAction('webhook_json', row)}>
                                                        View JSON payload
                                                    </button>
                                                    <button type="button" className="admin-finance-popover__btn admin-finance-popover__btn--process" onClick={() => openTodoAction('webhook_override', row)}>
                                                        Manual override
                                                    </button>
                                                    <button type="button" className="admin-finance-popover__btn admin-finance-popover__btn--decline" onClick={() => openTodoAction('webhook_revoke', row)}>
                                                        Revoke access
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </span>
                                </article>
                                );
                            })
                        )}
                    </div>
                    <AdminTablePagination
                        page={webhooksPagination.page}
                        totalPages={webhooksPagination.totalPages}
                        totalItems={webhooksPagination.totalItems}
                        rangeStart={webhooksPagination.rangeStart}
                        rangeEnd={webhooksPagination.rangeEnd}
                        onPageChange={webhooksPagination.setPage}
                    />
                </div>
            )}

            <AdminDateRangeModal
                show={showDateModal}
                onClose={() => setShowDateModal(false)}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onChangeFrom={setDateFrom}
                onChangeTo={setDateTo}
                onApply={applyDateRange}
                onClear={clearDateRange}
            />

            <AdminModal
                show={!!actionModal}
                onClose={() => setActionModal(null)}
                title="Finance action"
                footer={
                    <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setActionModal(null)}>
                        Close
                    </button>
                }
            >
                <p className="admin-table__muted">
                    {actionModal?.type === 'export_csv' && 'Export ledger data to CSV.'}
                    {actionModal?.type === 'webhook_json' && (
                        <>
                            Webhook payload for {actionModal.payload?.transaction_id}:
                            <pre style={{ marginTop: '12px', fontSize: '12px', overflow: 'auto' }}>
                                {actionModal.payload?.raw_payload || 'No payload stored.'}
                            </pre>
                        </>
                    )}
                    {actionModal?.type === 'webhook_override' && `Manual override for ${actionModal.payload?.transaction_id}.`}
                    {actionModal?.type === 'webhook_revoke' && `Revoke access for ${actionModal.payload?.user_name}.`}
                </p>
                {(actionModal?.type === 'webhook_override' || actionModal?.type === 'webhook_revoke' || actionModal?.type === 'export_csv') && (
                    <p className="admin-table__muted" style={{ marginTop: '12px' }}>
                        This action is not yet implemented.
                    </p>
                )}
            </AdminModal>
        </AdminLayout>
    );
}
