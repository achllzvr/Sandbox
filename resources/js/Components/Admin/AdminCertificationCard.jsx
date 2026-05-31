import { Link } from '@inertiajs/react';
import AdminBadge from '@/Components/Admin/AdminBadge';

const DESC_VARIANTS = ['blue', 'green'];

function authorLabel(cert) {
    if (cert.creator) {
        return `${cert.creator.first_name} ${cert.creator.last_name}`;
    }
    return cert.category || '—';
}

export default function AdminCertificationCard({
    cert,
    variantIndex = 0,
    mode = 'management',
    onAccept,
    onDecline,
    onArchive,
    onRestore,
    processing = false,
}) {
    const descVariant = DESC_VARIANTS[variantIndex % DESC_VARIANTS.length];
    const isDenied = cert.status === 'denied';
    const isPending = cert.status === 'pending_review';

    return (
        <article className="admin-cert-row admin-card--chunky">
            <div className="admin-cert-row__name">
                <p className="admin-cert-row__title">{cert.title}</p>
                <AdminBadge value={cert.status} />
            </div>

            <div className="admin-cert-row__author">
                <p className="admin-cert-row__author-label">Author</p>
                <p className="admin-cert-row__author-value">{authorLabel(cert)}</p>
            </div>

            <div className={`admin-cert-row__description admin-cert-row__description--${descVariant}`}>
                <p>{cert.description || 'No description provided.'}</p>
            </div>

            <div className="admin-cert-row__actions">
                <Link
                    href={route('admin.certifications.show', cert.id)}
                    className="admin-cert-action admin-cert-action--view"
                >
                    View certification path, modules, and final exam
                </Link>

                {mode === 'management' ? (
                    <>
                        <Link
                            href={route('admin.finance.index')}
                            className="admin-cert-action admin-cert-action--finance"
                        >
                            See finances
                        </Link>
                        {isDenied ? (
                            <button
                                type="button"
                                className="admin-cert-action admin-cert-action--restore"
                                disabled={processing}
                                onClick={() => onRestore?.(cert)}
                            >
                                Restore
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="admin-cert-action admin-cert-action--archive"
                                disabled={processing}
                                onClick={() => onArchive?.(cert)}
                            >
                                Archive
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            className="admin-cert-action admin-cert-action--accept"
                            disabled={processing || !isPending}
                            onClick={() => onAccept?.(cert)}
                        >
                            Accept
                        </button>
                        <button
                            type="button"
                            className="admin-cert-action admin-cert-action--decline"
                            disabled={processing || !isPending}
                            onClick={() => onDecline?.(cert)}
                        >
                            Decline
                        </button>
                    </>
                )}
            </div>
        </article>
    );
}
