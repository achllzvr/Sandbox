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
    const label = isLoading ? 'Loading...' : isFinal && finalLabel ? finalLabel : children;

    const classes = [
        'btn',
        'btn-block',
        'btn-step-cta',
        isFilled ? 'is-filled' : '',
        isFinal ? 'btn-step-cta--solid' : 'btn-step-cta--progress',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            disabled={disabled || !isFilled || isLoading}
            className={classes}
            style={{ '--progress': `${progressPercent}%` }}
        >
            <span className="btn-step-cta__fill" aria-hidden="true" />
            <span className="btn-step-cta__track" aria-hidden="true" />
            <span className="btn-step-cta__label">{label}</span>
        </button>
    );
}
