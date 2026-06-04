import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminConfirmModal from '@/Components/Admin/AdminConfirmModal';
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
    { value: 'archived', label: 'Archived' },
];

export default function CertificationsIndex({ certifications, filters }) {
    const [activeTab, setActiveTab] = useState('management');
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [declineTarget, setDeclineTarget] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
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
        setConfirmAction({ type: 'publish', cert });
    }

    function runConfirmAction() {
        if (!confirmAction) {
            return;
        }

        const { type, cert } = confirmAction;

        if (type === 'publish') {
            router.put(route('admin.certifications.status.update', cert.id), { status: 'published' });
        } else if (type === 'archive') {
            router.put(route('admin.certifications.archive', cert.id), {}, { preserveScroll: true });
        } else if (type === 'restore') {
            router.put(route('admin.certifications.restore', cert.id), {}, { preserveScroll: true });
        }

        setConfirmAction(null);
    }

    function handleArchive(cert) {
        setConfirmAction({ type: 'archive', cert });
    }

    function handleRestore(cert) {
        setConfirmAction({ type: 'restore', cert });
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

    const confirmCopy = confirmAction
        ? {
              publish: {
                  title: 'Publish certification',
                  body: `Publish "${confirmAction.cert.title}"? Students and teachers will be able to purchase or assign this shell.`,
                  confirmLabel: 'Publish',
              },
              archive: {
                  title: 'Archive certification',
                  body: `Archive "${confirmAction.cert.title}"? This removes it from active shop listings.`,
                  confirmLabel: 'Archive',
                  destructive: true,
              },
              restore: {
                  title: 'Restore certification',
                  body: `Restore "${confirmAction.cert.title}" to its previous published state?`,
                  confirmLabel: 'Restore',
              },
          }[confirmAction.type]
        : null;

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

            <AdminConfirmModal
                show={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                title={confirmCopy?.title}
                body={confirmCopy?.body}
                confirmLabel={confirmCopy?.confirmLabel}
                destructive={confirmCopy?.destructive}
                onConfirm={runConfirmAction}
            />

        </AdminLayout>
    );
}
