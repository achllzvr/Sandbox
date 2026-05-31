import { Link } from '@inertiajs/react';
import { assetUrl } from '@/utils/assetUrl';
import AuthFooter from '@/Components/AuthFooter';

export default function AuthLayout({
    children,
    title,
    subtitle,
    showBack = true,
    onBack,
    showFooter = true,
    centered = true,
    className = '',
}) {
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    return (
        <div className={`auth-shell ${className}`.trim()}>
            <header className="navbar app-header auth-header">
                <div className="container flex-between">
                    <div className="navbar-logo logo">
                        <Link href="/">
                            <img
                                src={assetUrl('images/Hermy.png')}
                                alt="Hermit mascot"
                                className="navbar-logo-img"
                                width={48}
                                height={48}
                            />
                            <span className="navbar-logo-text">SANDBOX</span>
                        </Link>
                    </div>
                </div>
            </header>

            {showBack && (
                <button
                    type="button"
                    className="back-btn auth-back-btn"
                    onClick={handleBack}
                    aria-label="Go back"
                >
                    ←
                </button>
            )}

            <div className={`auth-page-wrap ${centered ? 'auth-page-wrap--centered' : ''}`}>
                <div className="auth-container">
                    <div className="auth-card">
                        {title && <h1 className="page-title">{title}</h1>}
                        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
                        {children}
                        {showFooter && <AuthFooter />}
                    </div>
                </div>
            </div>
        </div>
    );
}
