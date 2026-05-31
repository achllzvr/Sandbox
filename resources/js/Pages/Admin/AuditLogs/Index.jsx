/**
 * Admin Audit Logs
 *
 * WIRED (backend + database):
 * - Live logs when audit_logs table exists and has rows → AuditLogController@index
 *
 * TODO (backend + database):
 * - Falls back to MOCK_AUDIT_LOGS when table empty/missing
 * - Search, action filter, date range → client-side only (not persisted to query string)
 * - Pagination not implemented
 * - Audit log writes on admin actions (suspend, finance, etc.) not implemented
 */
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminAuditLogRow from '@/Components/Admin/AdminAuditLogRow';
import AdminDateRangeModal from '@/Components/Admin/AdminDateRangeModal';
import {
    AUDIT_ACTION_OPTIONS,
    MOCK_AUDIT_LOGS,
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

export default function AuditLogsIndex({ logs, is_mock = true, filters = {} }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [actionFilter, setActionFilter] = useState(filters?.action || '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');
    const [showDateModal, setShowDateModal] = useState(false);

    const sourceLogs = is_mock || !logs?.length ? MOCK_AUDIT_LOGS : logs;

    const displayedLogs = useMemo(() => {
        let result = sourceLogs;
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (log) =>
                    log.action?.toLowerCase().includes(q) ||
                    log.details_summary?.toLowerCase().includes(q) ||
                    log.done_by?.toLowerCase().includes(q) ||
                    `${log.user?.first_name || ''} ${log.user?.last_name || ''}`
                        .toLowerCase()
                        .includes(q)
            );
        }
        if (actionFilter) {
            result = result.filter((log) =>
                log.action?.toLowerCase().includes(actionFilter)
            );
        }
        if (dateFrom || dateTo) {
            result = result.filter((log) => inDateRange(log.created_at, dateFrom, dateTo));
        }
        return result;
    }, [sourceLogs, search, actionFilter, dateFrom, dateTo]);

    const dateRangeLabel =
        dateFrom || dateTo
            ? `${dateFrom || '…'} – ${dateTo || '…'}`
            : 'Date range';

    return (
        <AdminLayout pageTitle="Audit log">
            <Head title="Audit Log" />

            {(is_mock || !logs?.length) && (
                <div className="admin-notice admin-notice--todo">
                    <span className="admin-todo-badge">TODO: live data</span>
                    <span>Audit log entries are mocked until the audit_logs table and API are wired.</span>
                </div>
            )}

            {/* Sub-toolbar: search/action/date — TODO[backend] persist filters via router.get when not mock */}
            <div className="admin-subtoolbar">
                <input
                    type="search"
                    placeholder="Search audit logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field admin-subtoolbar__search"
                    aria-label="Search audit logs"
                />
                <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="input-field admin-subtoolbar__role"
                    aria-label="Filter by action type"
                >
                    {AUDIT_ACTION_OPTIONS.map((opt) => (
                        <option key={opt.value || 'all'} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    className={`admin-btn admin-btn--secondary admin-subtoolbar__add ${dateFrom || dateTo ? 'admin-btn--active-filter' : ''}`}
                    onClick={() => setShowDateModal(true)}
                >
                    {dateRangeLabel}
                </button>
            </div>

            {/* Audit log rows — mock or live from AuditLogController */}
            <div className="admin-audit-panel admin-card admin-card--chunky admin-panel--clip-visible">
                <div className="admin-audit-panel__header">
                    <span>Action</span>
                    <span>Done by</span>
                    <span>Timestamp</span>
                </div>
                <div className="admin-audit-panel__body">
                    {displayedLogs.length === 0 ? (
                        <p className="admin-empty" style={{ padding: '3rem' }}>
                            No audit log entries match this filter.
                        </p>
                    ) : (
                        displayedLogs.map((log) => (
                            <AdminAuditLogRow key={log.id} log={log} />
                        ))
                    )}
                </div>
            </div>

            {/* Date range modal — client-side filter only; TODO[backend] query params + SQL date filter */}
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
        </AdminLayout>
    );
}
