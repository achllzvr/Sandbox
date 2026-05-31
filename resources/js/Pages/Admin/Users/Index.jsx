import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBadge from '@/Components/Admin/AdminBadge';
import AdminModal from '@/Components/Admin/AdminModal';
import { useState } from 'react';

export default function UsersIndex({ users, filters }) {
    const [showInvite, setShowInvite] = useState(false);
    const [reviewUser, setReviewUser] = useState(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');

    const inviteForm = useForm({
        email: '',
        role: 'content_creator',
    });

    const verifyForm = useForm({
        action: '',
    });

    function handleFilter(e) {
        e?.preventDefault();
        router.get(route('admin.users.index'), { search, role: roleFilter }, { preserveState: true });
    }

    function handleInvite(e) {
        e.preventDefault();
        inviteForm.post(route('admin.users.invite'), {
            onSuccess: () => {
                setShowInvite(false);
                inviteForm.reset();
            },
        });
    }

    function handleVerify(action) {
        verifyForm
            .transform((data) => ({ ...data, action }))
            .put(route('admin.users.verify-teacher', reviewUser.id), {
                onSuccess: () => setReviewUser(null),
            });
    }

    return (
        <AdminLayout pageTitle="User Management">
            <Head title="User Management" />

            <div className="admin-toolbar">
                <form onSubmit={handleFilter} className="admin-toolbar__filters">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="">All Roles</option>
                        <option value="user">Student</option>
                        <option value="content_creator">Content Creator</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="admin-btn admin-btn--secondary">
                        Filter
                    </button>
                </form>
                <button
                    type="button"
                    onClick={() => setShowInvite(true)}
                    className="admin-btn admin-btn--primary"
                >
                    + Invite User
                </button>
            </div>

            <div className="admin-card admin-card__body--flush">
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th className="admin-table__actions">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((u) => (
                                <tr key={u.id}>
                                    <td className="admin-table__name">
                                        {u.first_name} {u.last_name}
                                    </td>
                                    <td className="admin-table__muted">{u.email}</td>
                                    <td>
                                        <AdminBadge type="role" value={u.role} />
                                    </td>
                                    <td>
                                        <AdminBadge value={u.status} />
                                    </td>
                                    <td className="admin-table__muted">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="admin-table__actions">
                                        {u.role === 'teacher' &&
                                            u.status === 'pending_verification' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setReviewUser(u)}
                                                    className="admin-btn admin-btn--sm admin-btn--secondary"
                                                >
                                                    Review
                                                </button>
                                            )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.data.length === 0 && (
                    <p className="admin-empty" style={{ padding: '3rem' }}>
                        No users found.
                    </p>
                )}
            </div>

            {users.last_page > 1 && (
                <nav className="admin-pagination">
                    {users.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            preserveScroll
                            className={
                                link.active
                                    ? 'admin-pagination__active'
                                    : !link.url
                                      ? 'admin-pagination__disabled'
                                      : ''
                            }
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </nav>
            )}

            <AdminModal
                show={showInvite}
                onClose={() => setShowInvite(false)}
                title={
                    <>
                        Invite <span className="admin-highlight">New</span> User
                    </>
                }
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowInvite(false)}
                            className="admin-btn admin-btn--ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="invite-user-form"
                            disabled={inviteForm.processing}
                            className="admin-btn admin-btn--primary"
                        >
                            Send Invite
                        </button>
                    </>
                }
            >
                <form id="invite-user-form" onSubmit={handleInvite}>
                    <div className="admin-form-group">
                        <label htmlFor="invite-email">Email</label>
                        <input
                            id="invite-email"
                            type="email"
                            value={inviteForm.data.email}
                            onChange={(e) => inviteForm.setData('email', e.target.value)}
                            className="input-field"
                            required
                        />
                        {inviteForm.errors.email && (
                            <p className="admin-form-error">{inviteForm.errors.email}</p>
                        )}
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="invite-role">Role</label>
                        <select
                            id="invite-role"
                            value={inviteForm.data.role}
                            onChange={(e) => inviteForm.setData('role', e.target.value)}
                            className="input-field"
                        >
                            <option value="content_creator">Content Creator</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                </form>
            </AdminModal>

            <AdminModal
                show={!!reviewUser}
                onClose={() => setReviewUser(null)}
                title="Review Teacher Registration"
                subtitle={
                    reviewUser
                        ? `${reviewUser.first_name} ${reviewUser.last_name} · ${reviewUser.email}`
                        : ''
                }
                size="xl"
                footer={
                    <div className="admin-btn-group">
                        <button
                            type="button"
                            onClick={() => handleVerify('decline')}
                            disabled={verifyForm.processing}
                            className="admin-btn admin-btn--danger admin-btn--sm"
                        >
                            Decline
                        </button>
                        <button
                            type="button"
                            onClick={() => handleVerify('approve')}
                            disabled={verifyForm.processing}
                            className="admin-btn admin-btn--success admin-btn--sm"
                        >
                            Approve & Activate
                        </button>
                    </div>
                }
            >
                <div className="admin-modal__body--preview" style={{ minHeight: '50vh' }}>
                    {reviewUser?.institutional_credentials_url ? (
                        reviewUser.institutional_credentials_url.endsWith('.pdf') ? (
                            <iframe
                                src={`/storage/${reviewUser.institutional_credentials_url}`}
                                className="w-full"
                                style={{ height: '55vh', border: 'none', borderRadius: '12px' }}
                                title="Credential Document"
                            />
                        ) : (
                            <img
                                src={`/storage/${reviewUser.institutional_credentials_url}`}
                                alt="Credential Document"
                                style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }}
                            />
                        )
                    ) : (
                        <p className="admin-table__muted">No credential file attached.</p>
                    )}
                </div>
            </AdminModal>
        </AdminLayout>
    );
}
