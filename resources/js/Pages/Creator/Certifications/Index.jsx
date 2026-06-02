import { Head, Link } from '@inertiajs/react';
import CreatorShellsTable from '@/Components/Creator/CreatorShellsTable';
import CreatorLayout from '@/Layouts/CreatorLayout';

export default function Index({ certifications }) {
    return (
        <CreatorLayout activeNav="shells" pageTitle="My shells">
            <Head title="My Shells" />

            <div className="admin-toolbar">
                <p className="admin-text-muted">
                    {certifications.length} shell{certifications.length !== 1 ? 's' : ''} total
                </p>
                <Link href={route('creator.certifications.create')} className="admin-btn admin-btn--primary">
                    + Create new shell
                </Link>
            </div>

            <CreatorShellsTable
                certifications={certifications}
                emptyMessage="No shells yet. Create your first certification shell to get started."
            />
        </CreatorLayout>
    );
}
