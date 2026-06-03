import AdminBadge from '@/Components/Admin/AdminBadge';

function formatTimestamp(iso) {
    return new Date(iso).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export default function AdminAuditLogRow({ log }) {
    const doneBy = log.user
        ? `${log.user.first_name} ${log.user.last_name}`
        : log.done_by || 'System';

    return (
        <article className="admin-audit-row">
            <div className="admin-audit-row__action">
                <p className="admin-audit-row__action-text">{log.action}</p>
                {log.details_summary && (
                    <p className="admin-audit-row__details">{log.details_summary}</p>
                )}
            </div>
            <div className="admin-audit-row__user">
                <p className="admin-audit-row__label">Done by</p>
                <p className="admin-audit-row__value">{doneBy}</p>
            </div>
            <div className="admin-audit-row__time">
                <p className="admin-audit-row__label">Timestamp</p>
                <p className="admin-audit-row__value">{formatTimestamp(log.created_at)}</p>
            </div>
            {log.severity && (
                <div className="admin-audit-row__badge">
                    <AdminBadge value={log.severity} />
                </div>
            )}
        </article>
    );
}
