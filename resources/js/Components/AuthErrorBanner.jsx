export default function AuthErrorBanner({ message }) {
    if (!message) {
        return null;
    }

    return (
        <div className="error-banner alert-error" role="alert">
            <p>{message}</p>
        </div>
    );
}
