import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminModal from '@/Components/Admin/AdminModal';
import AdminUserCard from '@/Components/Admin/AdminUserCard';
import CreateUserFlow from '@/Components/Admin/CreateUserFlow';
import { useCallback, useEffect, useState } from 'react';

const APPROVAL_STATUS_OPTIONS = [
    { value: '', label: 'All approval statuses' },
    { value: 'pending', label: 'Not yet approved' },
    { value: 'approved', label: 'Approved' },
    { value: 'declined', label: 'Declined' },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'name_asc', label: 'Name A–Z' },
    { value: 'name_desc', label: 'Name Z–A' },
    { value: 'email_asc', label: 'Email A–Z' },
    { value: 'role_asc', label: 'Role A–Z' },
    { value: 'status_asc', label: 'Status A–Z' },
];

const STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
];

export default function UsersIndex({ users, filters, pending_approvals_count = 0 }) {
    const [activeTab, setActiveTab] = useState(filters?.tab === 'approvals' ? 'approvals' : 'management');
    const [showCreateFlow, setShowCreateFlow] = useState(false);
    const [reviewUser, setReviewUser] = useState(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');
    const [approvalFilter, setApprovalFilter] = useState(filters?.approval_status || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [sortFilter, setSortFilter] = useState(filters?.sort || 'newest');
    const [verifyProcessing, setVerifyProcessing] = useState(false);

    useEffect(() => {
        setActiveTab(filters?.tab === 'approvals' ? 'approvals' : 'management');
    }, [filters?.tab]);

    useEffect(() => {
        setApprovalFilter(filters?.approval_status || '');
    }, [filters?.approval_status]);

    const applyFilters = useCallback(
        (nextSearch, nextRole, nextTab, nextApprovalStatus, nextStatus, nextSort) => {
            const tab = nextTab ?? activeTab;
            router.get(
                route('admin.users.index'),
                {
                    tab: tab === 'approvals' ? 'approvals' : undefined,
                    search: nextSearch || undefined,
                    role: tab === 'management' ? nextRole || undefined : undefined,
                    approval_status: tab === 'approvals' ? nextApprovalStatus || undefined : undefined,
                    status: tab === 'management' ? nextStatus || undefined : undefined,
                    sort: nextSort || undefined,
                },
                { preserveState: true, replace: true }
            );
        },
        [activeTab]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                applyFilters(search, roleFilter, activeTab, approvalFilter, statusFilter, sortFilter);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [search, filters?.search, roleFilter, activeTab, approvalFilter, statusFilter, sortFilter, applyFilters]);

    function switchTab(tab) {
        setActiveTab(tab);
        applyFilters(search, roleFilter, tab, approvalFilter, statusFilter, sortFilter);
    }

    function handleRoleChange(e) {
        const value = e.target.value;
        setRoleFilter(value);
        applyFilters(search, value, 'management', approvalFilter, statusFilter, sortFilter);
    }

    function handleApprovalStatusChange(e) {
        const value = e.target.value;
        setApprovalFilter(value);
        applyFilters(search, roleFilter, 'approvals', value, statusFilter, sortFilter);
    }

    function handleStatusChange(e) {
        const value = e.target.value;
        setStatusFilter(value);
        applyFilters(search, roleFilter, 'management', approvalFilter, value, sortFilter);
    }

    function handleSortChange(e) {
        const value = e.target.value;
        setSortFilter(value);
        applyFilters(search, roleFilter, activeTab, approvalFilter, statusFilter, value);
    }

    function handleVerify(action) {
        if (!reviewUser || verifyProcessing) {
            return;
        }

        setVerifyProcessing(true);

        router.put(
            route('admin.users.verify-teacher', reviewUser.id),
            { action },
            {
                preserveScroll: true,
                onSuccess: () => setReviewUser(null),
                onFinish: () => setVerifyProcessing(false),
            }
        );
    }

    const isPendingTeacher = (user) =>
        user.role === 'teacher' &&
        (user.status === 'pending_verification' || user.status === 'pending');

    const topbarTabs = (
        <div className="admin-page-tabs admin-page-tabs--topbar">
            <button
                type="button"
                className={`admin-page-tabs__btn ${activeTab === 'management' ? 'admin-page-tabs__btn--active' : ''}`}
                onClick={() => switchTab('management')}
            >
                User management
            </button>
            <button
                type="button"
                className={`admin-page-tabs__btn ${activeTab === 'approvals' ? 'admin-page-tabs__btn--active' : ''}`}
                onClick={() => switchTab('approvals')}
            >
                Approvals
                {pending_approvals_count > 0 && (
                    <span className="admin-page-tabs__count">{pending_approvals_count}</span>
                )}
            </button>
        </div>
    );

    return (
        <AdminLayout pageTitle="User Management" topbarEnd={topbarTabs}>
            <Head title="User Management" />

            {/* Sub-toolbar: search wired to backend; Add user opens invite flow */}
            <div className="admin-subtoolbar">
                <input
                    type="search"
                    placeholder={
                        activeTab === 'approvals'
                            ? 'Search teacher accounts...'
                            : 'Search users...'
                    }
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field admin-subtoolbar__search"
                    aria-label="Search users"
                />
                {activeTab === 'management' ? (
                    <>
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
                        <select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="input-field admin-subtoolbar__role"
                            aria-label="Filter by status"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value || 'all'} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortFilter}
                            onChange={handleSortChange}
                            className="input-field admin-subtoolbar__role"
                            aria-label="Sort users"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </>
                ) : (
                    <select
                        value={approvalFilter}
                        onChange={handleApprovalStatusChange}
                        className="input-field admin-subtoolbar__role"
                        aria-label="Filter by approval status"
                    >
                        {APPROVAL_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value || 'all'} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )}
                {activeTab === 'management' && (
                    <button
                        type="button"
                        onClick={() => setShowCreateFlow(true)}
                        className="admin-btn admin-btn--primary admin-subtoolbar__add"
                    >
                        + Add new user
                    </button>
                )}
            </div>

            <div className="admin-user-list">
                {users.data.length === 0 ? (
                    <div className="admin-card admin-card--chunky">
                        <p className="admin-empty" style={{ padding: '3rem' }}>
                            {activeTab === 'approvals'
                                ? 'No teacher accounts match this filter.'
                                : 'No users found.'}
                        </p>
                    </div>
                ) : (
                    users.data.map((u) => (
                        <AdminUserCard
                            key={u.id}
                            user={u}
                            mode={activeTab === 'approvals' ? 'approvals' : 'management'}
                            onReview={setReviewUser}
                        />
                    ))
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

            <CreateUserFlow show={showCreateFlow} onClose={() => setShowCreateFlow(false)} />

            {/* Teacher review modal — approve/decline wired; credential preview uses storage path */}
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
                    isPendingTeacher(reviewUser || {}) ? (
                        <div className="admin-btn-group">
                            <button
                                type="button"
                                onClick={() => handleVerify('decline')}
                                disabled={verifyProcessing}
                                className="admin-btn admin-btn--danger admin-btn--sm"
                            >
                                Decline
                            </button>
                            <button
                                type="button"
                                onClick={() => handleVerify('approve')}
                                disabled={verifyProcessing}
                                className="admin-btn admin-btn--success admin-btn--sm"
                            >
                                {verifyProcessing ? 'Saving…' : 'Approve & activate'}
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            onClick={() => setReviewUser(null)}
                        >
                            Close
                        </button>
                    )
                }
            >
                {reviewUser?.affiliation && (
                    <p className="admin-table__muted" style={{ marginBottom: '12px' }}>
                        Affiliation: <strong>{reviewUser.affiliation}</strong>
                    </p>
                )}
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

        </AdminLayout>
    );
}
