export function creatorStatusKey(status) {
    const map = {
        draft: 'draft',
        pending_approval: 'pending',
        pending_review: 'pending',
        published: 'published',
        approved: 'published',
        declined: 'declined',
        denied: 'declined',
        revision_required: 'revision',
    };

    return map[status] || 'draft';
}

export function creatorStatusLabel(status) {
    const labels = {
        draft: 'Draft',
        pending_approval: 'Pending',
        pending_review: 'Pending',
        published: 'Published',
        approved: 'Published',
        declined: 'Declined',
        denied: 'Declined',
        revision_required: 'Revision',
    };

    return labels[status] || status?.replace(/_/g, ' ') || 'Draft';
}
