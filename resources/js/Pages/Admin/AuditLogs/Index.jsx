import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function EmptyStateIcon() {
    return (
        <div className="admin-empty__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
        </div>
    );
}

export default function AuditLogsIndex() {
    return (
        <AdminLayout pageTitle="Audit logs">
            <Head title="Audit Logs" />
            <div className="admin-card">
                <div className="admin-empty">
                    <EmptyStateIcon />
                    <h3>Audit logs</h3>
                    <p>
                        A read-only history of system changes will appear here once the audit
                        logs table is configured.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
