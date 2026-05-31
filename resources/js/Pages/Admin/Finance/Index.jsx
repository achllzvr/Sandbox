import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function EmptyStateIcon() {
    return (
        <div className="admin-empty__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16v10H4V7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M8 14h3" />
            </svg>
        </div>
    );
}

export default function FinanceIndex() {
    return (
        <AdminLayout pageTitle="Finance & payments">
            <Head title="Finance" />
            <div className="admin-card">
                <div className="admin-empty">
                    <EmptyStateIcon />
                    <h3>Finance & payments</h3>
                    <p>
                        Revenue monitoring, webhook logs, revenue splits, and withdrawal approvals
                        will appear here once the payment system is integrated.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
