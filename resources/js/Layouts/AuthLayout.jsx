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
                    className="back-btn auth-back-btn fade-in-up"
                    style={{ '--delay': '40ms' }}
                    onClick={handleBack}
                    aria-label="Go back"
                >
                    ←
                </button>
            )}

            <div className={`auth-page-wrap ${centered ? 'auth-page-wrap--centered' : ''}`}>
                <div className="auth-container fade-in-up" style={{ '--delay': '60ms' }}>
                    <div className="auth-card">
                        {title && (
                            <h1 className="page-title fade-in-up" style={{ '--delay': '120ms' }}>
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="auth-subtitle fade-in-up" style={{ '--delay': '180ms' }}>
                                {subtitle}
                            </p>
                        )}
                        <div className="auth-card__body fade-in-up" style={{ '--delay': '240ms' }}>
                            {children}
                        </div>
                        {showFooter && (
                            <div className="fade-in-up" style={{ '--delay': '320ms' }}>
                                <AuthFooter />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
