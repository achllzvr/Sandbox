import { useEffect } from 'react';

function formatAmount(amount) {
    if (amount === 0) {
        return 'Free';
    }

    return `₱${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TeacherPurchaseHistoryModal({ show, onClose, title, transactions = [], isMock = false }) {
    useEffect(() => {
        if (!show) {
            return undefined;
        }

        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [show, onClose]);

    if (!show) {
        return null;
    }

    return (
        <div className="student-shop-modal-overlay student-fade-in-up" role="presentation" onClick={onClose}>
            <div
                className="student-shop-modal student-shop-modal--neutral student-fade-in-up student-fade-in-up--delay-1"
                role="dialog"
                aria-modal="true"
                aria-labelledby="teacher-purchase-history-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="student-shop-modal__content">
                    <h3 id="teacher-purchase-history-title" className="student-shop-modal__title">
                        {title}
                    </h3>
                    <p className="teacher-purchase-history-modal__lead">Voucher batch purchases linked to your affiliate account.</p>

                    {transactions.length === 0 ? (
                        <div className="student-empty student-empty--compact">
                            <p className="student-empty__title">No purchases recorded yet</p>
                        </div>
                    ) : (
                        <div className="teacher-data-table teacher-data-table--modal" role="table">
                            <div className="teacher-data-row teacher-data-row--head teacher-data-row--purchase" role="row">
                                <span>Date</span>
                                <span>Shell / Batch</span>
                                <span>Qty</span>
                                <span className="teacher-data-row__align-end">Amount</span>
                            </div>
                            {transactions.map((row) => (
                                <div key={row.id} className="teacher-data-row teacher-data-row--purchase" role="row">
                                    <span>{row.purchased_at}</span>
                                    <span>
                                        <span className="teacher-data-row__primary">{row.shell_title}</span>
                                        <span className="teacher-data-row__muted">{row.batch_label}</span>
                                    </span>
                                    <span>{row.quantity}</span>
                                    <span className="teacher-data-row__align-end">{formatAmount(row.amount)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {isMock ? <p className="student-mock-banner">Sample purchase log until payment persistence is wired.</p> : null}

                    <div className="teacher-purchase-history-modal__footer">
                        <button type="button" className="student-shop-btn student-shop-btn--outline" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
