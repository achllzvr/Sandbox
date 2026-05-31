export const Alert = ({ type = 'info', title, message, className = '', children }) => {
    if (type === 'error') {
        return (
            <div className={`error-banner alert-error ${className}`.trim()} role="alert">
                <p>{message || title || children}</p>
            </div>
        );
    }

    if (type === 'success') {
        return (
            <div className={`alert alert-success ${className}`.trim()} role="status">
                {message || title || children}
            </div>
        );
    }

    return (
        <div className={`alert ${className}`.trim()} role="status">
            {title && <strong>{title}</strong>}
            {message || children}
        </div>
    );
};

export default Alert;
