import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/Admin/AdminBadge';

const METRIC_CARDS = [
    { key: 'total_users', label: 'Students', icon: '👤' },
    { key: 'total_content_creator', label: 'Content Creators', icon: '✏️' },
    { key: 'total_teachers', label: 'Teachers', icon: '🎓' },
    { key: 'pending_teachers', label: 'Pending Teachers', icon: '⏳' },
    { key: 'total_certifications', label: 'Total Shells', icon: '🐚' },
    { key: 'pending_certifications', label: 'Pending Approval', icon: '📝' },
    { key: 'published_certifications', label: 'Published', icon: '✅' },
    { key: 'declined_certifications', label: 'Declined', icon: '❌' },
];

export default function Dashboard({ metrics, recent_certifications, recent_users }) {
    function formatDate(d) {
        return new Date(d).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    return (
        <AdminLayout pageTitle="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="admin-stats">
                {METRIC_CARDS.map((card) => (
                    <div key={card.key} className="admin-stat">
                        <div className="admin-stat__row">
                            <span className="admin-stat__icon">{card.icon}</span>
                            <span className="admin-stat__value">{metrics[card.key] ?? 0}</span>
                        </div>
                        <p className="admin-stat__label">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="admin-grid-2">
                <div className="admin-card">
                    <div className="admin-card__header">
                        <h3>Recent Users</h3>
                    </div>
                    <div className="admin-card__body admin-card__body--flush">
                        {recent_users.length === 0 ? (
                            <p className="admin-empty" style={{ padding: '2rem' }}>
                                No users yet.
                            </p>
                        ) : (
                            recent_users.map((u) => (
                                <div key={u.id} className="admin-list-row">
                                    <div>
                                        <p className="admin-list-row__title">
                                            {u.first_name} {u.last_name}
                                        </p>
                                        <p className="admin-list-row__meta">{u.email}</p>
                                    </div>
                                    <div className="admin-list-row__badges">
                                        <AdminBadge value={u.status} />
                                        <AdminBadge type="role" value={u.role} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card__header">
                        <h3>Recent Shells</h3>
                    </div>
                    <div className="admin-card__body admin-card__body--flush">
                        {recent_certifications.length === 0 ? (
                            <p className="admin-empty" style={{ padding: '2rem' }}>
                                No certifications yet.
                            </p>
                        ) : (
                            recent_certifications.map((c) => (
                                <div key={c.id} className="admin-list-row">
                                    <div>
                                        <p className="admin-list-row__title">{c.title}</p>
                                        <p className="admin-list-row__meta">
                                            by{' '}
                                            {c.creator
                                                ? `${c.creator.first_name} ${c.creator.last_name}`
                                                : 'Unknown'}
                                            {' · '}
                                            {formatDate(c.created_at)}
                                        </p>
                                    </div>
                                    <AdminBadge value={c.status} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
