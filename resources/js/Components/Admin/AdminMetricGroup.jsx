import { Link } from '@inertiajs/react';
import AdminStatLink from '@/Components/Admin/AdminStatLink';

export default function AdminMetricGroup({ title, linkHref, linkLabel = 'View all', metrics, metricsData }) {
    return (
        <section className="admin-metric-group admin-card admin-card--chunky">
            <div className="admin-card__header">
                <h3>{title}</h3>
                {linkHref && (
                    <Link href={linkHref} className="admin-card__link">
                        {linkLabel}
                    </Link>
                )}
            </div>
            <div className="admin-metric-group__grid">
                {metrics.map((item) => (
                    <AdminStatLink
                        key={item.key}
                        href={item.href()}
                        value={metricsData[item.key]}
                        label={item.label}
                        accent={item.accent}
                    />
                ))}
            </div>
        </section>
    );
}
