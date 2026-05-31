import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AuditLogsIndex() {
    return (
        <AdminLayout pageTitle="Audit Logs">
            <Head title="Audit Logs" />
            <div className="admin-card">
                <div className="admin-empty">
                    <div className="admin-empty__icon">📋</div>
                    <h3>Audit Logs</h3>
                    <p>
                        This section will display a read-only history of all system changes once the
                        audit_logs table is configured.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
