export default function ProgressButton({
    progressPercent = 33,
    isFilled = false,
    children,
    type = 'submit',
    disabled = false,
    isLoading = false,
    finalLabel,
    className = '',
}) {
    const isFinal = progressPercent >= 100;

    if (isFinal) {
        return (
            <button
                type={type}
                disabled={disabled || !isFilled || isLoading}
                className={`btn btn-primary btn-block btn-form-gated ${isFilled ? 'is-filled' : ''} ${className}`.trim()}
            >
                {isLoading ? 'Loading...' : finalLabel || children}
            </button>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled || !isFilled || isLoading}
            className={`btn btn-progress btn-form-gated ${isFilled ? 'is-filled' : ''} ${className}`.trim()}
            style={{ '--progress': `${progressPercent}%` }}
        >
            <span>{isLoading ? 'Loading...' : children}</span>
        </button>
    );
}
