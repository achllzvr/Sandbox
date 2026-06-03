let pushHandler = null;

export function registerAppToastPush(handler) {
    pushHandler = typeof handler === 'function' ? handler : null;
}

export function showAppToast(type, message) {
    if (typeof pushHandler === 'function' && message) {
        pushHandler(type, message);
        return;
    }

    window.alert(message);
}

export function showAppToastError(message) {
    showAppToast('error', message);
}

export function showAppToastSuccess(message) {
    showAppToast('success', message);
}
