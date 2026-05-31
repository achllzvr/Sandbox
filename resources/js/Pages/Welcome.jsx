import { Head, Link } from '@inertiajs/react';
import { GetStartedButton } from '@/Components';

function assetUrl(path) {
    const base =
        typeof window !== 'undefined' && window.__SANDBOX_ASSET_BASE__
            ? window.__SANDBOX_ASSET_BASE__
            : '';
    return `${base}/${path.replace(/^\//, '')}`;
}

export default function Welcome({ canLogin, canRegister, authUser }) {
    const isLoggedIn = !!authUser;

    return (
        <div className="landing-page">
            <Head title="Welcome to Sandbox" />

            <header className="navbar app-header landing-header fade-in-up" style={{ '--delay': '0ms' }}>
                <div className="container flex-between">
                    <div className="navbar-logo logo">
                        <a href={assetUrl('/')}>
                            <img
                                src={assetUrl('images/Hermy.png')}
                                alt="Hermit mascot"
                                className="navbar-logo-img"
                                width={48}
                                height={48}
                            />
                            <span className="navbar-logo-text">SANDBOX</span>
                        </a>
                    </div>

                    <nav className="main-nav">
                        <ul>
                            {isLoggedIn ? (
                                <>
                                    <li className="nav-user">
                                        <span>Hi, {authUser.first_name}!</span>
                                    </li>
                                    <li>
                                        <Link href={route('dashboard')} className="btn btn-primary nav-btn">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="btn btn-secondary nav-btn"
                                        >
                                            Logout
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {canLogin && (
                                        <li className="fade-in-up" style={{ '--delay': '80ms' }}>
                                            <Link href={route('login')} className="nav-link nav-link--uppercase">
                                                Log In
                                            </Link>
                                        </li>
                                    )}
                                    {canRegister && (
                                        <li className="fade-in-up" style={{ '--delay': '140ms' }}>
                                            <GetStartedButton size="nav" />
                                        </li>
                                    )}
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="main-content landing-main">
                <section className="hero landing-hero">
                    <div
                        className="hero-mascot landing-hero__visual fade-in-up"
                        style={{ '--delay': '120ms' }}
                    >
                        <img
                            src={assetUrl('images/HermyLanding.png')}
                            alt="Hermy the Hermit Crab surrounded by learning tools"
                            className="hero-image landing-hero__image"
                        />
                    </div>

                    <div className="hero-content landing-hero__copy">
                        <h1
                            className="hero-heading landing-hero__title fade-in-up"
                            style={{ '--delay': '200ms' }}
                        >
                            Break out of your shell, expand and learn playfully!
                        </h1>

                        <div
                            className="hero-actions landing-hero__actions fade-in-up"
                            style={{ '--delay': '320ms' }}
                        >
                            {isLoggedIn ? (
                                <Link href={route('dashboard')} className="btn btn-primary btn-block btn-lg">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <GetStartedButton block variant="primary" />
                                    )}
                                    {canLogin && (
                                        <Link href={route('login')} className="btn btn-secondary btn-block btn-lg">
                                            I Already Have a Shell
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {!isLoggedIn && (
                            <p
                                className="hero-partnership fade-in-up"
                                style={{ '--delay': '420ms' }}
                            >
                                <Link href={route('register.teacher')}>
                                    Are you looking for an affiliated partnership with Sandbox for your
                                    organization/ institution?
                                </Link>
                            </p>
                        )}
                    </div>
                </section>

                {!isLoggedIn && (
                    <section className="roles-section landing-roles fade-in-up" id="roles" style={{ '--delay': '500ms' }}>
                        <div className="container">
                            <h2 className="section-title">Platform Roles</h2>
                            <div className="grid-3 landing-roles__grid">
                                <div className="card role-card fade-in-up" style={{ '--delay': '560ms' }}>
                                    <h3>Learner</h3>
                                    <p>
                                        Browse certifications, earn Sand Dollars, and customize your hermit avatar.
                                    </p>
                                    {canRegister && (
                                        <Link href={route('register')} className="btn btn-primary btn-block">
                                            Register as Learner
                                        </Link>
                                    )}
                                </div>

                                <div className="card role-card fade-in-up" style={{ '--delay': '640ms' }}>
                                    <h3>Educator / Affiliate</h3>
                                    <p>
                                        Create affiliated hermit accounts, purchase vouchers, and track learner progress.
                                    </p>
                                    {canRegister && (
                                        <Link href={route('register.teacher')} className="btn btn-secondary btn-block">
                                            Register as Educator
                                        </Link>
                                    )}
                                </div>

                                <div className="card role-card fade-in-up" style={{ '--delay': '720ms' }}>
                                    <h3>Admin</h3>
                                    <p>
                                        Manage certifications, users, vouchers, and platform-wide settings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section
                    className="roles-section sandbox-feature-section landing-features fade-in-up"
                    style={{ '--delay': '780ms' }}
                >
                    <div className="container">
                        <div className="card sandbox-feature-card">
                            <h2 className="section-title landing-features__title">
                                Keep your streak. Spend your Sand Dollars.
                            </h2>
                            <p className="text-muted landing-features__lead">
                                Complete modules daily to maintain your learning streak. Earn Sand Dollars and spend them
                                in the Hermy shop to customize your avatar.
                            </p>
                            <div className="grid-3">
                                <div className="sandbox-feature-item fade-in-up" style={{ '--delay': '860ms' }}>
                                    <span className="sandbox-feature-icon" aria-hidden="true">
                                        🔥
                                    </span>
                                    <h4>Streaks</h4>
                                    <p className="text-muted">Daily learning rewards</p>
                                </div>
                                <div className="sandbox-feature-item fade-in-up" style={{ '--delay': '920ms' }}>
                                    <span className="sandbox-feature-icon" aria-hidden="true">
                                        💰
                                    </span>
                                    <h4>Sand Dollars</h4>
                                    <p className="text-muted">Platform currency</p>
                                </div>
                                <div className="sandbox-feature-item fade-in-up" style={{ '--delay': '980ms' }}>
                                    <span className="sandbox-feature-icon" aria-hidden="true">
                                        🦀
                                    </span>
                                    <h4>Hermy</h4>
                                    <p className="text-muted">Your avatar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="app-footer footer landing-footer fade-in-up" style={{ '--delay': '1040ms' }}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Sandbox. All rights reserved.</p>
                    <p className="landing-footer__links">
                        <a href="#">Privacy</a>
                        <span aria-hidden="true"> · </span>
                        <a href="#">Terms</a>
                        <span aria-hidden="true"> · </span>
                        <a href="#">Contact</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
