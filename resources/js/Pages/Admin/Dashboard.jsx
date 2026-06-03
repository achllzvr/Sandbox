import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/Admin/AdminBadge';
import AdminMetricGroup from '@/Components/Admin/AdminMetricGroup';
import { AdminBarChart, AdminLineChart } from '@/Components/Admin/AdminMockChart';

const CHART_COLORS = ['#cf7860', '#6b7fd4', '#8ecf9f', '#e0b078', '#a8bdd0', '#e09890'];

const USER_METRICS = [
    {
        key: 'total_users',
        label: 'Students',
        accent: '#6b9fd4',
        href: () => route('admin.users.index', { role: 'user' }),
    },
    {
        key: 'total_content_creator',
        label: 'Content creators',
        accent: '#6b7fd4',
        href: () => route('admin.users.index', { role: 'content_creator' }),
    },
    {
        key: 'total_teachers',
        label: 'Teachers',
        accent: '#8ecf9f',
        href: () => route('admin.users.index', { role: 'teacher' }),
    },
    {
        key: 'pending_teachers',
        label: 'Pending teachers',
        accent: '#e0b078',
        href: () => route('admin.users.index', { tab: 'approvals', approval_status: 'pending' }),
    },
];

const SHELL_METRICS = [
    {
        key: 'total_certifications',
        label: 'Total shells',
        accent: '#cf7860',
        href: () => route('admin.certifications.index'),
    },
    {
        key: 'pending_certifications',
        label: 'Pending approval',
        accent: '#e0b078',
        href: () => route('admin.certifications.index', { status: 'pending_review' }),
    },
    {
        key: 'published_certifications',
        label: 'Published',
        accent: '#8ecf9f',
        href: () => route('admin.certifications.index', { status: 'published' }),
    },
    {
        key: 'declined_certifications',
        label: 'Declined',
        accent: '#e09890',
        href: () => route('admin.certifications.index', { status: 'denied' }),
    },
];

export default function Dashboard({
    metrics,
    recent_certifications,
    recent_users,
    enrollment_trend = { labels: [], values: [] },
    role_split = { labels: [], values: [] },
    weekly_revenue = { labels: [], values: [] },
}) {
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

            <div className="admin-metric-groups">
                <AdminMetricGroup
                    title="Users"
                    linkHref={route('admin.users.index')}
                    metrics={USER_METRICS}
                    metricsData={metrics}
                />
                <AdminMetricGroup
                    title="Shells"
                    linkHref={route('admin.certifications.index')}
                    metrics={SHELL_METRICS}
                    metricsData={metrics}
                />
            </div>

            <div className="admin-grid-3 admin-grid-3--charts">
                <AdminLineChart
                    title="Enrollment trend"
                    subtitle="Monthly enrollments (last 6 months)"
                    labels={enrollment_trend.labels}
                    values={enrollment_trend.values}
                    colors={CHART_COLORS}
                />
                <AdminBarChart
                    title="Users by role"
                    subtitle="Current platform role distribution"
                    labels={role_split.labels}
                    values={role_split.values}
                    colors={CHART_COLORS}
                />
                <AdminBarChart
                    title="Weekly revenue"
                    subtitle="Certification purchase totals (₱)"
                    labels={weekly_revenue.labels}
                    values={weekly_revenue.values}
                    colors={CHART_COLORS}
                />
            </div>

            <div className="admin-grid-2">
                <div className="admin-card admin-card--chunky">
                    <div className="admin-card__header">
                        <h3>Recent users</h3>
                        <Link href={route('admin.users.index')} className="admin-card__link">
                            View all
                        </Link>
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

                <div className="admin-card admin-card--chunky">
                    <div className="admin-card__header">
                        <h3>Recent shells</h3>
                        <Link href={route('admin.certifications.index')} className="admin-card__link">
                            View all
                        </Link>
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
