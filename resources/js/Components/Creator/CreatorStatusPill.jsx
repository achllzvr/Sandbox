import AdminBadge from '@/Components/Admin/AdminBadge';
import { creatorStatusKey, creatorStatusLabel } from '@/utils/creatorStatus';

const BADGE_VALUE = {
    draft: 'draft',
    pending: 'pending_review',
    published: 'published',
    declined: 'denied',
    revision: 'revision_required',
};

export default function CreatorStatusPill({ status, className = '' }) {
    const key = creatorStatusKey(status);

    return (
        <AdminBadge
            type="status"
            value={BADGE_VALUE[key] || status}
            label={creatorStatusLabel(status)}
            className={className}
        />
    );
}
