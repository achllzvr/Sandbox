import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminBadge from '@/Components/Admin/AdminBadge';
import AdminConfirmModal from '@/Components/Admin/AdminConfirmModal';

function IconPause() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <rect x="2" y="1" width="3" height="12" rx="1" />
            <rect x="9" y="1" width="3" height="12" rx="1" />
        </svg>
    );
}

function IconEye() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
                d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z"
                stroke="currentColor"
                strokeWidth="1.4"
            />
            <circle cx="7" cy="7" r="2" fill="currentColor" />
        </svg>
    );
}

function IconTrash() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
                d="M2 4h10M5 4V2.5h4V4M5.5 6v4M8.5 6v4M3.5 4l.5 7h6l.5-7"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconCheck() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
                d="M2.5 7l3 3 6-6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function isPendingTeacher(user) {
    return (
        user.role === 'teacher' &&
        (user.status === 'pending_verification' || user.status === 'pending')
    );
}

export default function AdminUserCard({ user, onReview, mode = 'management', processing = false }) {
    const [pendingAction, setPendingAction] = useState(null);
    const initials = `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`;
    const approvalsMode = mode === 'approvals';
    const canReview =
        user.role === 'teacher' &&
        (isPendingTeacher(user) || user.institutional_credentials_url);
    const canManage = user.role !== 'admin';

    function runPendingAction() {
        if (!pendingAction) {
            return;
        }

        router.put(route(`admin.users.${pendingAction}`, user.id), {}, { preserveScroll: true });
        setPendingAction(null);
    }

    const actionCopy = pendingAction === 'suspend'
        ? {
              title: 'Suspend user',
              body: `Suspend ${user.first_name} ${user.last_name}? They will lose access until reactivated.`,
              confirmLabel: 'Suspend',
              destructive: true,
          }
        : {
              title: 'Archive user',
              body: `Archive ${user.first_name} ${user.last_name}? This marks the account inactive.`,
              confirmLabel: 'Archive',
              destructive: true,
          };

    return (
        <>
            <article className="admin-user-card admin-card--chunky">
                <div className="admin-user-card__main">
                    <span className="admin-user-card__avatar">{initials}</span>
                    <div className="admin-user-card__info">
                        <p className="admin-user-card__name">
                            {user.first_name} {user.last_name}
                        </p>
                        <p className="admin-user-card__email">{user.email}</p>
                        {approvalsMode && user.affiliation && (
                            <p className="admin-user-card__affiliation">{user.affiliation}</p>
                        )}
                        <div className="admin-user-card__badges">
                            <AdminBadge type="role" value={user.role} />
                            <AdminBadge value={user.status} />
                        </div>
                    </div>
                    <p className="admin-user-card__date">
                        {user.verified_at
                            ? `Verified ${new Date(user.verified_at).toLocaleDateString()}`
                            : `Joined ${new Date(user.created_at).toLocaleDateString()}`}
                    </p>
                </div>
                <div className="admin-user-card__actions">
                    {canReview && onReview && (
                        <button
                            type="button"
                            className="admin-action-btn admin-action-btn--accent"
                            onClick={() => onReview(user)}
                        >
                            <IconCheck />
                            <span>{isPendingTeacher(user) ? 'Review' : 'View credentials'}</span>
                        </button>
                    )}
                    {!approvalsMode && canManage && (
                        <>
                            <button
                                type="button"
                                className="admin-action-btn admin-action-btn--warning"
                                disabled={processing || user.status === 'inactive'}
                                onClick={() => setPendingAction('suspend')}
                            >
                                <IconPause />
                                <span>Suspend</span>
                            </button>
                            <Link
                                href={route('admin.users.show', user.id)}
                                className="admin-action-btn admin-action-btn--info"
                            >
                                <IconEye />
                                <span>View</span>
                            </Link>
                            <button
                                type="button"
                                className="admin-action-btn admin-action-btn--danger"
                                disabled={processing}
                                onClick={() => setPendingAction('archive')}
                            >
                                <IconTrash />
                                <span>Archive</span>
                            </button>
                        </>
                    )}
                </div>
            </article>

            <AdminConfirmModal
                show={!!pendingAction}
                onClose={() => setPendingAction(null)}
                title={actionCopy.title}
                body={actionCopy.body}
                confirmLabel={actionCopy.confirmLabel}
                destructive={actionCopy.destructive}
                onConfirm={runPendingAction}
            />
        </>
    );
}
