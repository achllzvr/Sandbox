import { Link } from '@inertiajs/react';

/** Border and hard shadow use the same accent (--stat-stroke). */
export default function AdminStatLink({ href, value, label, accent = 'rgba(255, 255, 255, 0.1)' }) {
    return (
        <Link
            href={href}
            className="admin-stat admin-stat--link"
            style={{ '--stat-stroke': accent }}
        >
            <span className="admin-stat__value">{value ?? 0}</span>
            <p className="admin-stat__label">{label}</p>
            <span className="admin-stat__arrow" aria-hidden="true">
                →
            </span>
        </Link>
    );
}
