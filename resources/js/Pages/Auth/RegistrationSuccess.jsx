import { Head, Link } from '@inertiajs/react';
import { assetUrl } from '@/utils/assetUrl';

export default function RegistrationSuccess({ title, message, isAffiliate = false }) {
    const heading = title || (isAffiliate
        ? 'Your Affiliated Hermit has been created!'
        : 'Your Hermit has been created!');

    return (
        <>
            <Head title="Success — Sandbox" />
            <div className="auth-shell">
                <header className="navbar app-header auth-header">
                    <div className="container flex-between">
                        <div className="navbar-logo logo">
                            <Link href="/">
                                <img
                                    src={assetUrl('images/Hermy.png')}
                                    alt=""
                                    className="navbar-logo-img"
                                    width={48}
                                    height={48}
                                />
                                <span className="navbar-logo-text">SANDBOX</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <section className="success-screen">
                    <div className="success-content">
                        <h1 className="success-heading fade-in-up" style={{ '--delay': '100ms' }}>
                            {heading}
                        </h1>
                        <div className="success-mascot fade-in-up" style={{ '--delay': '220ms' }}>
                            <img
                                src={assetUrl('images/HermyLanding.png')}
                                alt="Hermit mascot"
                            />
                            {isAffiliate ? (
                                <Link
                                    href={route('teacher.pending-approval')}
                                    className="btn btn-primary"
                                >
                                    Continue
                                </Link>
                            ) : (
                                <Link href={route('login')} className="btn btn-primary">
                                    Proceed to Login
                                </Link>
                            )}
                        </div>
                    </div>
                    {message && (
                        <p className="auth-subtitle" style={{ maxWidth: 480 }}>
                            {message}
                        </p>
                    )}
                </section>
            </div>
        </>
    );
}
