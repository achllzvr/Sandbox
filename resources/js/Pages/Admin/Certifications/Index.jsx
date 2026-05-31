/**
 * Admin Certifications (Shells) Index
 *
 * WIRED (backend + database):
 * - Certification list + search/status filters → CertificationApprovalController@index
 * - Accept (publish) / Decline → update status endpoint → certifications table
 * - View certification path → show page with lessons/modules/exam
 *
 * TODO (backend + database):
 * - Archive / Restore buttons → no dedicated endpoints (placeholder modal)
 * - Approvals tab filters pending_review client-side from full list (consider server-side tab)
 * - See finances link → finance index without certification_id filter
 */
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminModal from '@/Components/Admin/AdminModal';
import AdminCertificationCard from '@/Components/Admin/AdminCertificationCard';
import AdminTablePagination from '@/Components/Admin/AdminTablePagination';
import { useAdminPagination } from '@/hooks/useAdminPagination';
import { useCallback, useEffect, useMemo, useState } from 'react';

const STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending_review', label: 'Pending review' },
    { value: 'revision_required', label: 'Revision required' },
    { value: 'published', label: 'Published' },
    { value: 'approved', label: 'Approved' },
    { value: 'denied', label: 'Denied' },
];

export default function CertificationsIndex({ certifications, filters }) {
    const [activeTab, setActiveTab] = useState('management');
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [declineTarget, setDeclineTarget] = useState(null);
    const [actionModal, setActionModal] = useState(null);

    const declineForm = useForm({ status: 'denied', decline_reason: '' });

    // TODO[backend]: Approvals tab uses client-side filter; consider server tab=approvals query
    const approvalCerts = useMemo(
        () => certifications.filter((c) => c.status === 'pending_review'),
        [certifications]
    );

    const displayedCerts = activeTab === 'approvals' ? approvalCerts : certifications;

    const {
        page,
        setPage,
        totalPages,
        totalItems,
        paginatedItems,
        rangeStart,
        rangeEnd,
    } = useAdminPagination(displayedCerts);

    const applyFilters = useCallback((nextSearch, nextStatus) => {
        router.get(
            route('admin.certifications.index'),
            {
                search: nextSearch || undefined,
                status: nextStatus || undefined,
            },
            { preserveState: true, replace: true }
        );
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                applyFilters(search, statusFilter);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [search, filters?.search, statusFilter, applyFilters]);

    function handleStatusChange(e) {
        const value = e.target.value;
        setStatusFilter(value);
        applyFilters(search, value);
    }

    function handleAccept(cert) {
        if (!confirm(`Publish "${cert.title}"?`)) return;
        router.put(route('admin.certifications.status.update', cert.id), { status: 'published' });
    }

    function handleDeclineSubmit(e) {
        e.preventDefault();
        declineForm.put(route('admin.certifications.status.update', declineTarget.id), {
            onSuccess: () => {
                setDeclineTarget(null);
                declineForm.reset();
            },
        });
    }

    function openDecline(cert) {
        setDeclineTarget(cert);
        declineForm.setData({ status: 'denied', decline_reason: '' });
    }

    function handleArchive(cert) {
        setActionModal({ type: 'archive', cert });
    }

    function handleRestore(cert) {
        setActionModal({ type: 'restore', cert });
    }

    const topbarTabs = (
        <div className="admin-page-tabs admin-page-tabs--topbar">
            <button
                type="button"
                className={`admin-page-tabs__btn ${activeTab === 'management' ? 'admin-page-tabs__btn--active' : ''}`}
                onClick={() => setActiveTab('management')}
            >
                Certification management
            </button>
            <button
                type="button"
                className={`admin-page-tabs__btn ${activeTab === 'approvals' ? 'admin-page-tabs__btn--active' : ''}`}
                onClick={() => setActiveTab('approvals')}
            >
                Approvals
                {approvalCerts.length > 0 && (
                    <span className="admin-page-tabs__count">{approvalCerts.length}</span>
                )}
            </button>
        </div>
    );

    return (
        <AdminLayout pageTitle="Certifications" topbarEnd={topbarTabs}>
            <Head title="Certifications" />

            <div className="admin-subtoolbar">
                <input
                    type="search"
                    placeholder="Search certifications..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field admin-subtoolbar__search"
                    aria-label="Search certifications"
                />
                <div
                    className={`admin-subtoolbar__control admin-subtoolbar__role-wrap ${
                        activeTab === 'management' ? '' : 'admin-subtoolbar__control--hidden'
                    }`}
                >
                    <select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="input-field admin-subtoolbar__role"
                        aria-label="Filter by status"
                        aria-hidden={activeTab !== 'management'}
                        tabIndex={activeTab === 'management' ? 0 : -1}
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value || 'all'} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Certification panel — list wired; archive/restore actions TODO[backend] */}
            <div className="admin-cert-panel admin-card admin-card--chunky">
                <div className="admin-cert-panel__header">
                    <span>Name</span>
                    <span>Author</span>
                    <span>Description</span>
                    <span>Actions</span>
                </div>

                <div key={activeTab} className="admin-cert-panel__body admin-panel-swap">
                    {displayedCerts.length === 0 ? (
                        <p className="admin-empty" style={{ padding: '3rem' }}>
                            {activeTab === 'approvals'
                                ? 'No certifications pending approval.'
                                : 'No certifications found.'}
                        </p>
                    ) : (
                        paginatedItems.map((cert, i) => (
                            <AdminCertificationCard
                                key={cert.id}
                                cert={cert}
                                variantIndex={i}
                                mode={activeTab === 'approvals' ? 'approvals' : 'management'}
                                onAccept={handleAccept}
                                onDecline={openDecline}
                                onArchive={handleArchive}
                                onRestore={handleRestore}
                                processing={declineForm.processing}
                            />
                        ))
                    )}
                </div>
            </div>

            <AdminTablePagination
                page={page}
                totalPages={totalPages}
                totalItems={totalItems}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onPageChange={setPage}
            />

            {/* Decline modal — wired to admin.certifications.status.update */}
            <AdminModal
                show={!!declineTarget}
                onClose={() => setDeclineTarget(null)}
                title="Decline certification"
                subtitle={declineTarget ? declineTarget.title : ''}
                footer={
                    <>
                        <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            onClick={() => setDeclineTarget(null)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="decline-cert-form"
                            disabled={declineForm.processing}
                            className="admin-btn admin-btn--danger"
                        >
                            Decline
                        </button>
                    </>
                }
            >
                <form id="decline-cert-form" onSubmit={handleDeclineSubmit}>
                    <div className="admin-form-group">
                        <label htmlFor="decline-reason">Reason for declining</label>
                        <textarea
                            id="decline-reason"
                            className="input-field"
                            rows={4}
                            value={declineForm.data.decline_reason}
                            onChange={(e) => declineForm.setData('decline_reason', e.target.value)}
                            required
                        />
                        {declineForm.errors.decline_reason && (
                            <p className="admin-form-error">{declineForm.errors.decline_reason}</p>
                        )}
                    </div>
                </form>
            </AdminModal>

            {/* TODO[backend]: Archive / restore certification — placeholder modal only */}
            <AdminModal
                show={!!actionModal}
                onClose={() => setActionModal(null)}
                title={
                    actionModal?.type === 'archive'
                        ? 'Archive certification'
                        : 'Restore certification'
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
                    {actionModal?.cert && (
                        <>
                            {actionModal.cert.title} — {actionModal.cert.status}
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
