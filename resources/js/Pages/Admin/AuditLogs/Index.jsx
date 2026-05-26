import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AuditLogsIndex({ logs }) {
    return (
        <AdminLayout pageTitle="Audit Logs">
            <Head title="Audit Logs" />
            <div className="mt-2 bg-white rounded-2xl border border-stone-200 shadow-sm p-12 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-bold text-stone-700">Audit Logs</h3>
                <p className="text-sm text-stone-400 mt-2 max-w-sm mx-auto">
                    This section will display a read-only history of all system changes once the audit_logs table is configured.
                </p>
            </div>
        </AdminLayout>
    );
}
