import { useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function TeacherSendVoucherModal({ voucher, view, onBack, onClose, onSuccess }) {
    const form = useForm({
        email: '',
        irreversible_acknowledged: false,
    });

    useEffect(() => {
        if (voucher?.id) {
            form.setData({ email: '', irreversible_acknowledged: false });
            form.clearErrors();
        }
    }, [voucher?.id, view]);

    if (!voucher) {
        return null;
    }

    const canSubmit = form.data.email.trim().length > 0 && form.data.irreversible_acknowledged && !form.processing;

    function handleSubmit(event) {
        event.preventDefault();
        if (!canSubmit) {
            return;
        }

        form.post(route('teacher.vouchers.send-email', voucher.id), {
            preserveScroll: true,
            onSuccess: () => onSuccess?.(voucher.id, form.data.email),
        });
    }

    return (
        <div className="student-shop-modal-overlay student-fade-in-up" role="dialog" aria-modal="true">
            <div className="student-shop-modal teacher-send-voucher-modal student-fade-in-up student-fade-in-up--delay-1">
                {view === 'form' ? (
                    <button type="button" className="student-shop-modal__back" onClick={onBack} aria-label="Go back">
                        <ArrowLeft size={20} strokeWidth={2.25} aria-hidden="true" />
                    </button>
                ) : null}

                <div className="student-shop-modal__content">
                    {view === 'form' ? (
                        <form className="student-shop-flow teacher-send-voucher-modal__form" onSubmit={handleSubmit}>
                            <h3 className="student-shop-modal__title">Send voucher to email</h3>

                            <input
                                type="email"
                                className="teacher-send-voucher-modal__input"
                                placeholder="Email"
                                value={form.data.email}
                                onChange={(event) => form.setData('email', event.target.value)}
                                required
                            />

                            <label className="student-shop-check">
                                <input
                                    type="checkbox"
                                    checked={form.data.irreversible_acknowledged}
                                    onChange={(event) => form.setData('irreversible_acknowledged', event.target.checked)}
                                />
                                <span>
                                    Do you understand that this action is <strong>irreversible</strong> and once the code is sent,{' '}
                                    <strong>you cannot modify or send it to a different email</strong>?
                                </span>
                            </label>

                            <button
                                type="submit"
                                className={`student-shop-btn student-shop-btn--primary ${canSubmit ? 'is-ready' : ''}`}
                                disabled={!canSubmit}
                            >
                                {form.processing ? 'Sending...' : 'Proceed'}
                            </button>
                        </form>
                    ) : null}

                    {view === 'success' ? (
                        <div className="student-shop-flow student-shop-flow--success teacher-send-voucher-modal__success">
                            <h3 className="teacher-send-voucher-modal__success-title">Voucher code has been sent to email</h3>
                            <button type="button" className="student-shop-btn student-shop-btn--success" onClick={onClose}>
                                Done
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
