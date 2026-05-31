import { Head, Link } from '@inertiajs/react';

function assetUrl(path) {
    const base = typeof window !== 'undefined' && window.__SANDBOX_ASSET_BASE__
        ? window.__SANDBOX_ASSET_BASE__
        : '';
    return `${base}/${path.replace(/^\//, '')}`;
}

export default function Welcome({ canLogin, canRegister, authUser }) {
    const isLoggedIn = !!authUser;

    return (
        <>
            <Head title="Welcome to Sandbox" />

            <header className="navbar app-header">
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
                                        <li>
                                            <Link href={route('login')} className="nav-link">
                                                Log In
                                            </Link>
                                        </li>
                                    )}
                                    {canRegister && (
                                        <li>
                                            <Link href={route('register')} className="btn btn-primary nav-btn">
                                                Get Started
                                            </Link>
                                        </li>
                                    )}
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <section className="hero">
                    <div className="hero-mascot">
                        <img
                            src={assetUrl('images/HermyLanding.png')}
                            alt="Hermy the Hermit Crab"
                            className="hero-image"
                        />
                    </div>
                    <div className="hero-content">
                        <h1 className="hero-heading">
                            Break out of your shell and start learning!
                        </h1>
                        <p className="hero-subtitle">
                            A warm, playful place to earn certifications, explore lessons, and grow at your own pace.
                        </p>
                        <div className="hero-actions">
                            {isLoggedIn ? (
                                <Link href={route('dashboard')} className="btn btn-primary btn-block btn-lg">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link href={route('register')} className="btn btn-primary btn-block btn-lg">
                                            Get Started
                                        </Link>
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
                            <a href="#roles" className="hero-link">
                                Learn about platform roles
                            </a>
                        )}
                    </div>
                </section>

                {!isLoggedIn && (
                    <section className="roles-section" id="roles">
                        <div className="container">
                            <h2 className="section-title">Platform Roles</h2>
                            <div className="grid-3">
                                <div className="card role-card">
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

                                <div className="card role-card">
                                    <h3>Educator / Affiliate</h3>
                                    <p>
                                        Create affiliated hermit accounts, purchase vouchers, and track learner progress.
                                    </p>
                                    <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                                        Requires verification after registration.
                                    </p>
                                    {canRegister && (
                                        <Link href={route('register.teacher')} className="btn btn-secondary btn-block">
                                            Register as Educator
                                        </Link>
                                    )}
                                </div>

                                <div className="card role-card">
                                    <h3>Admin</h3>
                                    <p>
                                        Manage certifications, users, vouchers, and platform-wide settings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="roles-section sandbox-feature-section">
                    <div className="container">
                        <div className="card sandbox-feature-card">
                            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                                Keep your streak. Spend your Sand Dollars.
                            </h2>
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                                Complete modules daily to maintain your learning streak. Earn Sand Dollars and spend them
                                in the Hermy shop to customize your avatar.
                            </p>
                            <div className="grid-3">
                                <div className="sandbox-feature-item">
                                    <span className="sandbox-feature-icon" aria-hidden="true">🔥</span>
                                    <h4>Streaks</h4>
                                    <p className="text-muted">Daily learning rewards</p>
                                </div>
                                <div className="sandbox-feature-item">
                                    <span className="sandbox-feature-icon" aria-hidden="true">💰</span>
                                    <h4>Sand Dollars</h4>
                                    <p className="text-muted">Platform currency</p>
                                </div>
                                <div className="sandbox-feature-item">
                                    <span className="sandbox-feature-icon" aria-hidden="true">🦀</span>
                                    <h4>Hermy</h4>
                                    <p className="text-muted">Your avatar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="app-footer footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Sandbox. All rights reserved.</p>
                    <p style={{ marginTop: '0.5rem' }}>
                        <a href="#">Privacy</a>
                        {' · '}
                        <a href="#">Terms</a>
                        {' · '}
                        <a href="#">Contact</a>
                    </p>
                </div>
            </footer>
        </>
    );
}
