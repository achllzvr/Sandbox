import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function FinanceIndex() {
    return (
        <AdminLayout pageTitle="Finance & Payments">
            <Head title="Finance" />
            <div className="admin-card">
                <div className="admin-empty">
                    <div className="admin-empty__icon">💰</div>
                    <h3>Finance & Payments</h3>
                    <p>
                        Revenue monitoring, Xendit webhook logs, revenue splits, and withdrawal
                        approvals will appear here once the payment system is integrated.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
