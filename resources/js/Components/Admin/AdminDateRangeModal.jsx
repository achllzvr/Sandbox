import AdminModal from '@/Components/Admin/AdminModal';

// TODO[backend]: Persist date range via query params once finance/audit APIs support date_from/date_to.

export default function AdminDateRangeModal({
    show,
    onClose,
    dateFrom,
    dateTo,
    onChangeFrom,
    onChangeTo,
    onApply,
    onClear,
}) {
    return (
        <AdminModal
            show={show}
            onClose={onClose}
            title="Date range"
            footer={
                <>
                    <button type="button" className="admin-btn admin-btn--ghost" onClick={onClear}>
                        Clear
                    </button>
                    <button type="button" className="admin-btn admin-btn--primary" onClick={onApply}>
                        Apply
                    </button>
                </>
            }
        >
            <p className="admin-table__muted" style={{ marginBottom: '16px' }}>
                Filter entries by date.{' '}
                <span className="admin-todo-badge admin-todo-badge--inline">TODO: backend persistence</span>
            </p>
            <div className="admin-form-group">
                <label htmlFor="date-from">From</label>
                <input
                    id="date-from"
                    type="date"
                    className="input-field"
                    value={dateFrom}
                    onChange={(e) => onChangeFrom(e.target.value)}
                />
            </div>
            <div className="admin-form-group">
                <label htmlFor="date-to">To</label>
                <input
                    id="date-to"
                    type="date"
                    className="input-field"
                    value={dateTo}
                    onChange={(e) => onChangeTo(e.target.value)}
                    min={dateFrom || undefined}
                />
            </div>
        </AdminModal>
    );
}
