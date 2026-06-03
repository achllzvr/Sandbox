const STATUS_MAP = {
    active: 'active',
    inactive: 'inactive',
    pending_verification: 'pending',
    pending_review: 'pending',
    revision_required: 'revision_required',
    published: 'published',
    approved: 'approved',
    denied: 'denied',
    declined: 'declined',
    draft: 'draft',
};

const ROLE_MAP = {
    admin: 'role-admin',
    content_creator: 'role-content_creator',
    teacher: 'role-teacher',
    user: 'role-user',
};

export default function AdminBadge({ type = 'status', value, label, className = '' }) {
    const normalized = String(value || '').toLowerCase().replace(/\s+/g, '_');
    const modifier =
        type === 'role'
            ? ROLE_MAP[normalized] || ''
            : STATUS_MAP[normalized] || normalized.replace(/_/g, '_');

    const badgeClassName = ['admin-badge', modifier && `admin-badge--${modifier}`, className]
        .filter(Boolean)
        .join(' ');

    const display =
        label ||
        String(value || '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

    return <span className={badgeClassName}>{display}</span>;
}
