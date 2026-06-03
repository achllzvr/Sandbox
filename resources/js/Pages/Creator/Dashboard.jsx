import { Head, Link } from '@inertiajs/react';
import CreatorShellsTable from '@/Components/Creator/CreatorShellsTable';
import CreatorLayout from '@/Layouts/CreatorLayout';

export default function Dashboard({ metrics, certifications = [] }) {
    return (
        <CreatorLayout activeNav="dashboard" pageTitle="Dashboard">
            <Head title="Dashboard" />

            <div className="admin-stats">
                <div className="admin-stat">
                    <span className="admin-stat__value">{metrics?.total_students ?? 0}</span>
                    <span className="admin-stat__label">Total students</span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat__value">{metrics?.vouchers_unclaimed ?? 0}</span>
                    <span className="admin-stat__label">Vouchers unclaimed</span>
                </div>
            </div>

            <section className="creator-section">
                <div className="admin-toolbar">
                    <h2 className="admin-section-title">My shells</h2>
                    <Link href={route('creator.certifications.create')} className="admin-btn admin-btn--primary">
                        + Create new shell
                    </Link>
                </div>
                <CreatorShellsTable certifications={certifications} />
            </section>
        </CreatorLayout>
    );
}
