import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/Admin/AdminBadge';
import { useMemo } from 'react';

export default function CertificationsIndex({ certifications }) {
    const pendingCount = useMemo(
        () => certifications.filter((c) => c.status === 'pending_review').length,
        [certifications],
    );

    return (
        <AdminLayout pageTitle="Certification Approval">
            <Head title="Certification Approval" />

            <div className="admin-notice">
                <span>
                    Pending for review: <strong>{pendingCount}</strong>
                </span>
            </div>

            <div className="admin-card admin-card__body--flush">
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Creator</th>
                                <th>Details</th>
                                <th>Materials</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th className="admin-table__actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certifications.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <p className="admin-table__name">{c.title}</p>
                                        <p className="admin-table__muted" style={{ fontSize: '0.75rem' }}>
                                            {c.category} · {c.difficulty}
                                        </p>
                                    </td>
                                    <td className="admin-table__muted">
                                        {c.creator
                                            ? `${c.creator.first_name} ${c.creator.last_name}`
                                            : '—'}
                                    </td>
                                    <td className="admin-table__muted" style={{ fontSize: '0.75rem' }}>
                                        <div>Quiz: {c.quiz_questions_count} Qs</div>
                                        <div>Exam: {c.exam_questions_count} Qs</div>
                                    </td>
                                    <td className="admin-table__name" style={{ textAlign: 'center' }}>
                                        {c.module_count}
                                    </td>
                                    <td>
                                        <AdminBadge value={c.status} />
                                    </td>
                                    <td className="admin-table__muted">
                                        {c.submitted_at
                                            ? new Date(c.submitted_at).toLocaleDateString()
                                            : '—'}
                                    </td>
                                    <td className="admin-table__actions">
                                        <Link
                                            href={`/admin/certifications/${c.id}`}
                                            className="admin-btn admin-btn--sm admin-btn--secondary"
                                        >
                                            Review
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {certifications.length === 0 && (
                    <p className="admin-empty" style={{ padding: '3rem' }}>
                        No certifications found.
                    </p>
                )}
            </div>
        </AdminLayout>
    );
}
