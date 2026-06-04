import AdminModal from '@/Components/Admin/AdminModal';

export default function AdminConfirmModal({
    show,
    onClose,
    title,
    body,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    processing = false,
    destructive = false,
}) {
    return (
        <AdminModal
            show={show}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <button type="button" className="admin-btn admin-btn--secondary" onClick={onClose} disabled={processing}>
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={`admin-btn ${destructive ? 'admin-btn--danger' : 'admin-btn--primary'}`}
                        onClick={onConfirm}
                        disabled={processing}
                    >
                        {processing ? 'Working…' : confirmLabel}
                    </button>
                </>
            }
        >
            <p className="admin-modal__body-text">{body}</p>
        </AdminModal>
    );
}
