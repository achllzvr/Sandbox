import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/Admin/AdminBadge';

export default function UserShow({ user }) {
    return (
        <AdminLayout pageTitle="User details">
            <Head title={`${user.first_name} ${user.last_name}`} />

            <div className="admin-card admin-card--chunky" style={{ maxWidth: '640px' }}>
                <div className="admin-card__header">
                    <h3>
                        {user.first_name} {user.last_name}
                    </h3>
                    <Link href={route('admin.users.index')} className="admin-card__link">
                        Back to users
                    </Link>
                </div>
                <div className="admin-card__body">
                    <p className="admin-list-row__meta">{user.email}</p>
                    <div className="admin-user-card__badges" style={{ marginTop: '12px' }}>
                        <AdminBadge type="role" value={user.role} />
                        <AdminBadge value={user.status} />
                    </div>
                    {user.affiliation && (
                        <p className="admin-table__muted" style={{ marginTop: '16px' }}>
                            Affiliation: <strong>{user.affiliation}</strong>
                        </p>
                    )}
                    {user.contact_no && (
                        <p className="admin-table__muted" style={{ marginTop: '8px' }}>
                            Contact: {user.contact_no}
                        </p>
                    )}
                    <p className="admin-table__muted" style={{ marginTop: '8px' }}>
                        Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
