export default function AdminModal({
    show,
    onClose,
    title,
    subtitle,
    children,
    footer,
    size = 'md',
}) {
    if (!show) return null;

    const sizeClass =
        size === 'xl' ? 'admin-modal--xl' : size === 'lg' ? 'admin-modal--lg' : 'admin-modal--md';

    return (
        <div
            className="admin-modal-backdrop"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className={`admin-modal ${sizeClass}`}
                onClick={(e) => e.stopPropagation()}
            >
                {(title || onClose) && (
                    <div className="admin-modal__header">
                        <div>
                            {title && <h2 className="admin-modal__title">{title}</h2>}
                            {subtitle && <p className="admin-modal__subtitle">{subtitle}</p>}
                        </div>
                        {onClose && (
                            <button
                                type="button"
                                className="admin-modal__close"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
                <div className="admin-modal__body">{children}</div>
                {footer && <div className="admin-modal__footer">{footer}</div>}
            </div>
        </div>
    );
}
