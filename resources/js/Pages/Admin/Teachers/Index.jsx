import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/Admin/AdminBadge';
import AdminModal from '@/Components/Admin/AdminModal';

export default function TeachersIndex({ teachers }) {
    const [selectedFileUrl, setSelectedFileUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AdminLayout pageTitle="Teacher Verification">
            <Head title="Teacher Verification" />

            <div className="admin-card admin-card__body--flush">
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Affiliation</th>
                                <th>Credentials</th>
                                <th>Status</th>
                                <th className="admin-table__actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.data.map((t) => (
                                <tr key={t.id}>
                                    <td className="admin-table__name">
                                        {t.first_name} {t.last_name}
                                    </td>
                                    <td className="admin-table__muted">{t.email}</td>
                                    <td className="admin-table__muted">{t.affiliation || '—'}</td>
                                    <td>
                                        {t.institutional_credentials_url ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFileUrl(
                                                        `/storage/${t.institutional_credentials_url}`,
                                                    );
                                                    setIsModalOpen(true);
                                                }}
                                                className="admin-link"
                                            >
                                                View file
                                            </button>
                                        ) : (
                                            <span className="admin-table__muted">None</span>
                                        )}
                                    </td>
                                    <td>
                                        <AdminBadge value={t.status} />
                                    </td>
                                    <td className="admin-table__actions">
                                        {t.status === 'pending_verification' && (
                                            <div className="admin-btn-group">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.put(route('admin.teachers.approve', t.id))
                                                    }
                                                    className="admin-btn admin-btn--sm admin-btn--success"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.put(route('admin.teachers.decline', t.id))
                                                    }
                                                    className="admin-btn admin-btn--sm admin-btn--danger"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        )}
                                        {t.status === 'active' && t.verified_at && (
                                            <span
                                                className="admin-table__muted"
                                                style={{ fontSize: '0.75rem' }}
                                            >
                                                Verified {new Date(t.verified_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {teachers.data.length === 0 && (
                    <p className="admin-empty" style={{ padding: '3rem' }}>
                        No teacher accounts found.
                    </p>
                )}
            </div>

            <AdminModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Credential Proof"
                size="xl"
                footer={
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="admin-btn admin-btn--secondary"
                    >
                        Close
                    </button>
                }
            >
                <div className="admin-modal__body--preview">
                    {selectedFileUrl ? (
                        selectedFileUrl.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                            <img
                                src={selectedFileUrl}
                                alt="Credential Proof"
                                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                            />
                        ) : (
                            <iframe
                                src={selectedFileUrl}
                                style={{
                                    width: '100%',
                                    height: '70vh',
                                    border: 'none',
                                    borderRadius: '12px',
                                }}
                                title="Credential Document"
                            />
                        )
                    ) : (
                        <p className="admin-table__muted">File cannot be loaded.</p>
                    )}
                </div>
            </AdminModal>
        </AdminLayout>
    );
}
