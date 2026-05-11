import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function FinanceIndex() {
    return (
        <AdminLayout pageTitle="Finance & Payments">
            <Head title="Finance" />
            <div className="mt-2 bg-white rounded-2xl border border-stone-200 shadow-sm p-12 text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-lg font-bold text-stone-700">Finance & Payments</h3>
                <p className="text-sm text-stone-400 mt-2 max-w-sm mx-auto">
                    Revenue monitoring, Xendit webhook logs, revenue splits, and withdrawal approvals will appear here once the payment system is integrated.
                </p>
            </div>
        </AdminLayout>
    );
}
