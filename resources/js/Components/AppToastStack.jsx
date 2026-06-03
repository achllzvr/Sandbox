export default function AppToastStack({ toasts, className = 'app-toast-stack' }) {
    if (!toasts?.length) {
        return null;
    }

    return (
        <div className={className} role="status" aria-live="polite">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`app-toast app-toast--${toast.type}${toast.leaving ? ' app-toast--leaving' : ''}`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
}
