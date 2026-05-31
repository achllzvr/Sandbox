/**
 * Admin Finance
 *
 * WIRED (backend + database): none — FinanceController returns is_mock: true only
 *
 * TODO (backend + database):
 * - All metric cards → payment/ledger aggregates
 * - Master ledger table → transactions table
 * - Withdrawal management → withdrawals table + WithdrawalController (empty)
 * - Update status popover actions → withdrawal status API
 * - Webhook monitor → webhook_events table + retry/revoke handlers
 * - Export CSV → download endpoint
 * - Date range → server-side filter on all tabs
 */
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/Admin/AdminBadge';
import AdminModal from '@/Components/Admin/AdminModal';
import AdminDateRangeModal from '@/Components/Admin/AdminDateRangeModal';
import {
    formatCurrency,
    formatFinanceTimestamp,
    MOCK_LEDGER_METRICS,
    MOCK_MASTER_LEDGER,
    MOCK_WEBHOOK_EVENTS,
    MOCK_WEBHOOK_METRICS,
    MOCK_WITHDRAWALS,
    WITHDRAWAL_STATUS_OPTIONS,
    WEBHOOK_STATUS_OPTIONS,
} from '@/Components/Admin/AdminFinanceMockData';
import { useMemo, useState } from 'react';

function inDateRange(isoDate, from, to) {
    if (!from && !to) return true;
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return true;
    if (from) {
        const start = new Date(`${from}T00:00:00`);
        if (d < start) return false;
    }
    if (to) {
        const end = new Date(`${to}T23:59:59`);
        if (d > end) return false;
    }
    return true;
}

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

export default function FinanceIndex({ filters = {}, is_mock = true }) {
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

    const webhookMetrics = MOCK_WEBHOOK_METRICS;

    const filteredMasterLedger = useMemo(() => {
        let rows = MOCK_MASTER_LEDGER;
        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter(
                (row) =>
                    row.transaction_id.toLowerCase().includes(q) ||
                    row.item_sold.toLowerCase().includes(q) ||
                    row.creator.toLowerCase().includes(q)
            );
        }
        if (dateFrom || dateTo) {
            rows = rows.filter((row) => inDateRange(row.timestamp, dateFrom, dateTo));
        }
        return rows;
    }, [search, dateFrom, dateTo]);

    const filteredWithdrawals = useMemo(() => {
        let rows = MOCK_WITHDRAWALS;
        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter(
                (row) =>
                    row.creator_name.toLowerCase().includes(q) ||
                    row.payment_detail.includes(q)
            );
        }
        if (statusFilter) {
            rows = rows.filter((row) => row.status === statusFilter);
        }
        if (dateFrom || dateTo) {
            rows = rows.filter((row) => inDateRange(row.timestamp, dateFrom, dateTo));
        }
        return rows;
    }, [search, statusFilter, dateFrom, dateTo]);

    const filteredWebhooks = useMemo(() => {
        let rows = MOCK_WEBHOOK_EVENTS;
        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter(
                (row) =>
                    row.transaction_id.toLowerCase().includes(q) ||
                    row.user_name.toLowerCase().includes(q) ||
                    row.user_email.toLowerCase().includes(q) ||
                    row.item_purchased.toLowerCase().includes(q)
            );
        }
        if (statusFilter) {
            rows = rows.filter((row) => row.status === statusFilter);
        }
        if (dateFrom || dateTo) {
            rows = rows.filter((row) => inDateRange(row.timestamp, dateFrom, dateTo));
        }
        return rows;
    }, [search, statusFilter, dateFrom, dateTo]);

    function openTodoAction(type, payload) {
        setActionModal({ type, payload });
        setWithdrawalMenuId(null);
        setWebhookMenuId(null);
    }

    const topbarTabs = (
        <div className="admin-page-tabs admin-page-tabs--topbar">
            <button
                type="button"
                className={`admin-page-tabs__btn ${topTab === 'ledger' ? 'admin-page-tabs__btn--active' : ''}`}
                onClick={() => setTopTab('ledger')}
            >
                Financial ledger
            </button>
            <button
                type="button"
                className={`admin-page-tabs__btn ${topTab === 'webhook' ? 'admin-page-tabs__btn--active' : ''}`}
                onClick={() => setTopTab('webhook')}
            >
                Webhook monitor
            </button>
        </div>
    );

    const metricItems = topTab === 'ledger' ? LEDGER_METRIC_ITEMS : WEBHOOK_METRIC_ITEMS;
    const metricData = topTab === 'ledger' ? MOCK_LEDGER_METRICS : webhookMetrics;

    function formatMetricValue(key) {
        const val = metricData[key];
        if (
            ['gross_volume', 'platform_net_profit', 'total_creator_earnings', 'sales_24h'].includes(
                key
            )
        ) {
            return formatCurrency(val);
        }
        return val;
    }

    const dateRangeLabel =
        dateFrom || dateTo
            ? `${dateFrom || '…'} – ${dateTo || '…'}`
            : 'Date range';

    return (
        <AdminLayout pageTitle="Finance" topbarEnd={topbarTabs}>
            <Head title="Finance" />

            {is_mock && (
                <div className="admin-notice admin-notice--todo">
                    <span className="admin-todo-badge">TODO: live data</span>
                    <span>
                        Finance metrics, ledger entries, withdrawals, and webhook events are mocked
                        until the payment system is integrated.
                    </span>
                </div>
            )}

            {/* TODO[backend]: Finance metric cards — MOCK_LEDGER_METRICS / MOCK_WEBHOOK_METRICS */}
            <div className={`admin-finance-metrics ${topTab === 'webhook' ? 'admin-finance-metrics--3' : ''}`}>
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
                {(topTab === 'webhook' || ledgerTab === 'withdrawals') && (
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field admin-subtoolbar__role"
                        aria-label="Filter by status"
                    >
                        {(topTab === 'webhook' ? WEBHOOK_STATUS_OPTIONS : WITHDRAWAL_STATUS_OPTIONS).map(
                            (opt) => (
                                <option key={opt.value || 'all'} value={opt.value}>
                                    {opt.label}
                                </option>
                            )
                        )}
                    </select>
                )}
                <button
                    type="button"
                    className={`admin-btn admin-btn--secondary ${dateFrom || dateTo ? 'admin-btn--active-filter' : ''}`}
                    onClick={() => setShowDateModal(true)}
                >
                    {dateRangeLabel}
                </button>
                {/* TODO[backend]: Export CSV — openTodoAction placeholder only */}
                {topTab === 'ledger' && (
                    <button
                        type="button"
                        className="admin-btn admin-btn--secondary admin-subtoolbar__add"
                        onClick={() => openTodoAction('export_csv')}
                    >
                        Export to CSV
                    </button>
                )}
            </div>

            {/* Ledger panel: master ledger + withdrawal tabs — mock row data */}
            {topTab === 'ledger' ? (
                <div className="admin-finance-panel admin-card admin-card--chunky admin-panel--clip-visible">
                    <div className="admin-finance-panel__tabs">
                        <button
                            type="button"
                            className={`admin-finance-panel__tab ${ledgerTab === 'master' ? 'admin-finance-panel__tab--active' : ''}`}
                            onClick={() => setLedgerTab('master')}
                        >
                            Master ledger
                        </button>
                        <button
                            type="button"
                            className={`admin-finance-panel__tab ${ledgerTab === 'withdrawals' ? 'admin-finance-panel__tab--active' : ''}`}
                            onClick={() => setLedgerTab('withdrawals')}
                        >
                            Withdrawal management
                        </button>
                    </div>

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
                                {filteredMasterLedger.length === 0 ? (
                                    <p className="admin-empty" style={{ padding: '3rem' }}>
                                        No ledger entries found.
                                    </p>
                                ) : (
                                    filteredMasterLedger.map((row) => (
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
                                {filteredWithdrawals.length === 0 ? (
                                    <p className="admin-empty" style={{ padding: '3rem' }}>
                                        No withdrawal requests found.
                                    </p>
                                ) : (
                                    filteredWithdrawals.map((row, index) => {
                                        const popoverAbove = index >= filteredWithdrawals.length - 2;
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
                                                        onClick={() => setWithdrawalMenuId(withdrawalMenuId === row.id ? null : row.id)}
                                                    >
                                                        Update status
                                                    </button>
                                                    {/* TODO[backend]: Withdrawal status updates → WithdrawalController */}
                                                    {withdrawalMenuId === row.id && (
                                                        <div className={`admin-finance-popover ${popoverAbove ? 'admin-finance-popover--above' : ''}`}>
                                                            {row.status === 'pending' && (
                                                                <>
                                                                    <button type="button" className="admin-finance-popover__btn admin-finance-popover__btn--process" onClick={() => openTodoAction('withdrawal_processing', row)}>
                                                                        Mark as processing
                                                                    </button>
                                                                    <button type="button" className="admin-finance-popover__btn admin-finance-popover__btn--decline" onClick={() => openTodoAction('withdrawal_decline', row)}>
                                                                        Decline request
                                                                    </button>
                                                                </>
                                                            )}
                                                            {row.status === 'processing' && (
                                                                <button type="button" className="admin-finance-popover__btn admin-finance-popover__btn--process" onClick={() => openTodoAction('withdrawal_paid', row)}>
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
                        </>
                    )}
                </div>
            ) : (
                /* TODO[backend]: Webhook monitor table — MOCK_WEBHOOK_EVENTS; action popover not wired */
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
                        {filteredWebhooks.length === 0 ? (
                            <p className="admin-empty" style={{ padding: '3rem' }}>
                                No webhook events found.
                            </p>
                        ) : (
                            filteredWebhooks.map((row, index) => {
                                const popoverAbove = index >= filteredWebhooks.length - 2;
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
                </div>
            )}

            {/* Date range — client-side filter on mock data; TODO[backend] persist to FinanceController */}
            <AdminDateRangeModal
                show={showDateModal}
                onClose={() => setShowDateModal(false)}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onChangeFrom={setDateFrom}
                onChangeTo={setDateTo}
                onApply={() => setShowDateModal(false)}
                onClear={() => {
                    setDateFrom('');
                    setDateTo('');
                    setShowDateModal(false);
                }}
            />

            {/* TODO[backend]: Finance action modal — withdrawal/webhook/export handlers not implemented */}
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
                    {actionModal?.type === 'withdrawal_processing' && `Mark withdrawal for ${actionModal.payload?.creator_name} as processing.`}
                    {actionModal?.type === 'withdrawal_decline' && `Decline withdrawal for ${actionModal.payload?.creator_name}.`}
                    {actionModal?.type === 'withdrawal_paid' && `Mark withdrawal for ${actionModal.payload?.creator_name} as paid.`}
                    {actionModal?.type === 'webhook_json' && `View webhook payload for ${actionModal.payload?.transaction_id}.`}
                    {actionModal?.type === 'webhook_override' && `Manual override for ${actionModal.payload?.transaction_id}.`}
                    {actionModal?.type === 'webhook_revoke' && `Revoke access for ${actionModal.payload?.user_name}.`}
                </p>
                <p className="admin-table__muted" style={{ marginTop: '12px' }}>
                    <span className="admin-todo-badge admin-todo-badge--inline">
                        TODO: wire {actionModal?.type?.replace(/_/g, ' ')} to backend
                    </span>
                </p>
            </AdminModal>
        </AdminLayout>
    );
}
