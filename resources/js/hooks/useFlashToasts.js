import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

const TOAST_DURATION_MS = 4000;

function buildFlashMessages(flash, errors = {}) {
    const messages = [];

    if (flash?.success) {
        messages.push({ type: 'success', message: flash.success });
    }

    if (flash?.error) {
        messages.push({ type: 'error', message: flash.error });
    }

    if (flash?.info) {
        messages.push({ type: 'info', message: flash.info });
    }

    if (flash?.warning) {
        messages.push({ type: 'warning', message: flash.warning });
    }

    if (errors?.checkout) {
        messages.push({ type: 'error', message: errors.checkout });
    }

    if (flash?.teacher_purchase_success) {
        const qty = flash.teacher_purchase_success.quantity ?? 0;
        messages.push({
            type: 'success',
            message: `Purchase complete — ${qty} voucher${qty === 1 ? '' : 's'}.`,
        });
    }

    if (flash?.voucher_email_sent) {
        messages.push({
            type: 'success',
            message: `Voucher sent to ${flash.voucher_email_sent.email}.`,
        });
    }

    if (flash?.shop_success && typeof flash.shop_success === 'string') {
        messages.push({ type: 'success', message: flash.shop_success });
    }

    return messages;
}

export function useFlashToasts() {
    const { flash, errors = {} } = usePage().props;
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const incoming = buildFlashMessages(flash, errors);

        if (incoming.length === 0) {
            return undefined;
        }

        const stamped = incoming.map((toast, index) => ({
            id: `${toast.type}-${Date.now()}-${index}`,
            ...toast,
        }));

        setToasts(stamped);

        const timer = window.setTimeout(() => {
            setToasts((current) => current.map((toast) => ({ ...toast, leaving: true })));
            window.setTimeout(() => setToasts([]), 250);
        }, TOAST_DURATION_MS);

        return () => window.clearTimeout(timer);
    }, [
        flash?.success,
        flash?.error,
        flash?.info,
        flash?.warning,
        flash?.shop_success,
        flash?.teacher_purchase_success,
        flash?.voucher_email_sent,
        errors?.checkout,
    ]);

    const pushToast = (type, message) => {
        const id = `${type}-${Date.now()}`;
        setToasts([{ id, type, message }]);
        window.setTimeout(() => {
            setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)));
            window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 250);
        }, TOAST_DURATION_MS);
    };

    return { toasts, pushToast };
}

export function flashToToastMessage(flash, errors = {}) {
    const messages = buildFlashMessages(flash, errors);
    return messages[0]?.message ?? null;
}
