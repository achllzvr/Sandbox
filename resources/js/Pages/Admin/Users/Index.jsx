import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminModal from '@/Components/Admin/AdminModal';
import AdminUserCard from '@/Components/Admin/AdminUserCard';
import CreateUserFlow from '@/Components/Admin/CreateUserFlow';
import { useCallback, useEffect, useMemo, useState } from 'react';

// TODO: Wire suspend, view, and archive user actions to backend endpoints.

export default function UsersIndex({ users, filters }) {
    const [activeTab, setActiveTab] = useState('management');
    const [showCreateFlow, setShowCreateFlow] = useState(false);
    const [reviewUser, setReviewUser] = useState(null);
    const [actionModal, setActionModal] = useState(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');

    const verifyForm = useForm({ action: '' });

    const approvalUsers = useMemo(
        () =>
            users.data.filter(
                (u) => u.status === 'pending_verification' || u.status === 'pending'
            ),
        [users.data]
    );

    const displayedUsers = activeTab === 'approvals' ? approvalUsers : users.data;

    const applyFilters = useCallback(
        (nextSearch, nextRole) => {
            router.get(
                route('admin.users.index'),
                { search: nextSearch || undefined, role: nextRole || undefined },
                { preserveState: true, replace: true }
            );
        },
        []
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                applyFilters(search, roleFilter);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [search, filters?.search, roleFilter, applyFilters]);

    function handleRoleChange(e) {
        const value = e.target.value;
        setRoleFilter(value);
        applyFilters(search, value);
    }

    function handleVerify(action) {
        verifyForm
            .transform((data) => ({ ...data, action }))
            .put(route('admin.users.verify-teacher', reviewUser.id), {
                onSuccess: () => setReviewUser(null),
            });
    }

    // TODO: Replace placeholder modal with real suspend/view/archive API calls.
    function handleUserAction(type, user) {
        setActionModal({ type, user });
    }

    const topbarTabs = (
        <div className="admin-page-tabs admin-page-tabs--topbar">
            <button
                type="button"
                className={`admin-page-tabs__btn ${activeTab === 'management' ? 'admin-page-tabs__btn--active' : ''}`}
                onClick={() => setActiveTab('management')}
            >
                User management
            </button>
            <button
                type="button"
                className={`admin-page-tabs__btn ${activeTab === 'approvals' ? 'admin-page-tabs__btn--active' : ''}`}
                onClick={() => setActiveTab('approvals')}
            >
                Approvals
                {approvalUsers.length > 0 && (
                    <span className="admin-page-tabs__count">{approvalUsers.length}</span>
                )}
            </button>
        </div>
    );

    return (
        <AdminLayout pageTitle="User Management" topbarEnd={topbarTabs}>
            <Head title="User Management" />

            <div className="admin-subtoolbar">
                <input
                    type="search"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field admin-subtoolbar__search"
                    aria-label="Search users"
                />
                <select
                    value={roleFilter}
                    onChange={handleRoleChange}
                    className="input-field admin-subtoolbar__role"
                    aria-label="Filter by role"
                >
                    <option value="">All roles</option>
                    <option value="user">Student</option>
                    <option value="content_creator">Content creator</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
                <button
                    type="button"
                    onClick={() => setShowCreateFlow(true)}
                    className="admin-btn admin-btn--primary admin-subtoolbar__add"
                >
                    + Add new user
                </button>
            </div>

            <div className="admin-user-list">
                {displayedUsers.length === 0 ? (
                    <div className="admin-card admin-card--chunky">
                        <p className="admin-empty" style={{ padding: '3rem' }}>
                            {activeTab === 'approvals'
                                ? 'No pending approvals.'
                                : 'No users found.'}
                        </p>
                    </div>
                ) : (
                    displayedUsers.map((u) => (
                        <AdminUserCard
                            key={u.id}
                            user={u}
                            onReview={setReviewUser}
                            onAction={handleUserAction}
                        />
                    ))
                )}
            </div>

            {activeTab === 'management' && users.last_page > 1 && (
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

            <CreateUserFlow show={showCreateFlow} onClose={() => setShowCreateFlow(false)} />

            <AdminModal
                show={!!reviewUser}
                onClose={() => setReviewUser(null)}
                title="Review teacher registration"
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
                            Approve & activate
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
                                title="Credential document"
                            />
                        ) : (
                            <img
                                src={`/storage/${reviewUser.institutional_credentials_url}`}
                                alt="Credential document"
                                style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }}
                            />
                        )
                    ) : (
                        <p className="admin-table__muted">No credential file attached.</p>
                    )}
                </div>
            </AdminModal>

            <AdminModal
                show={!!actionModal}
                onClose={() => setActionModal(null)}
                title={
                    actionModal?.type === 'suspend'
                        ? 'Suspend user'
                        : actionModal?.type === 'archive'
                          ? 'Archive user'
                          : 'View user'
                }
                footer={
                    <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        onClick={() => setActionModal(null)}
                    >
                        Close
                    </button>
                }
            >
                <p className="admin-table__muted">
                    {actionModal?.user && (
                        <>
                            {actionModal.user.first_name} {actionModal.user.last_name} (
                            {actionModal.user.email})
                        </>
                    )}
                </p>
                <p className="admin-table__muted" style={{ marginTop: '12px' }}>
                    <span className="admin-todo-badge admin-todo-badge--inline">
                        TODO: wire {actionModal?.type} action to backend
                    </span>
                </p>
            </AdminModal>
        </AdminLayout>
    );
}
