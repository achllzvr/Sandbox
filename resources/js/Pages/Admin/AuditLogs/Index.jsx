import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminAuditLogRow from '@/Components/Admin/AdminAuditLogRow';
import AdminDateRangeModal from '@/Components/Admin/AdminDateRangeModal';
import AdminTablePagination from '@/Components/Admin/AdminTablePagination';
import { useAdminPagination } from '@/hooks/useAdminPagination';
import { AUDIT_ACTION_OPTIONS, MOCK_AUDIT_LOGS } from '@/Components/Admin/AdminFinanceMockData';
import { useCallback, useEffect, useState } from 'react';

export default function AuditLogsIndex({ logs, is_mock = true, filters = {} }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [actionFilter, setActionFilter] = useState(filters?.action || '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');
    const [showDateModal, setShowDateModal] = useState(false);

    const isPaginated = !is_mock && logs && Array.isArray(logs.data);
    const sourceLogs = is_mock ? MOCK_AUDIT_LOGS : isPaginated ? logs.data : [];

    const applyFilters = useCallback(
        (overrides = {}) => {
            router.get(
                route('admin.audit-logs.index'),
                {
                    search: search || undefined,
                    action: actionFilter || undefined,
                    date_from: dateFrom || undefined,
                    date_to: dateTo || undefined,
                    ...overrides,
                },
                { preserveState: true, replace: true }
            );
        },
        [search, actionFilter, dateFrom, dateTo]
    );

    useEffect(() => {
        if (is_mock) return;
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                applyFilters({ search: search || undefined });
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [search, filters?.search, applyFilters, is_mock]);

    const clientPagination = useAdminPagination(is_mock ? sourceLogs : []);

    const dateRangeLabel =
        dateFrom || dateTo
            ? `${dateFrom || '…'} – ${dateTo || '…'}`
            : 'Date range';

    function handleActionChange(e) {
        const value = e.target.value;
        setActionFilter(value);
        if (!is_mock) {
            applyFilters({ action: value || undefined });
        }
    }

    function applyDateRange() {
        setShowDateModal(false);
        if (!is_mock) {
            applyFilters({
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            });
        }
    }

    function clearDateRange() {
        setDateFrom('');
        setDateTo('');
        setShowDateModal(false);
        if (!is_mock) {
            applyFilters({ date_from: undefined, date_to: undefined });
        }
    }

    const displayedLogs = is_mock ? clientPagination.paginatedItems : sourceLogs;

    return (
        <AdminLayout pageTitle="Audit log">
            <Head title="Audit Log" />

            {is_mock && (
                <div className="admin-notice admin-notice--todo">
                    <span className="admin-todo-badge">Sample data</span>
                    <span>No audit log entries in the database yet. Showing sample rows.</span>
                </div>
            )}

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
                    onChange={handleActionChange}
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

            <div className="admin-audit-panel admin-card admin-card--chunky">
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
                        displayedLogs.map((log) => <AdminAuditLogRow key={log.id} log={log} />)
                    )}
                </div>
            </div>

            {is_mock ? (
                <AdminTablePagination
                    page={clientPagination.page}
                    totalPages={clientPagination.totalPages}
                    totalItems={clientPagination.totalItems}
                    rangeStart={clientPagination.rangeStart}
                    rangeEnd={clientPagination.rangeEnd}
                    onPageChange={clientPagination.setPage}
                />
            ) : (
                isPaginated &&
                logs.last_page > 1 && (
                    <nav className="admin-pagination">
                        {logs.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                preserveScroll
                                className={
                                    link.active
                                        ? 'admin-pagination__active'
                                        : !link.url
                                          ? 'admin-pagination__disabled'
                                          : ''
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                )
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
        </AdminLayout>
    );
}
