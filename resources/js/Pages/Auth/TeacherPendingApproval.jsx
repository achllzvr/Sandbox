import { Head, Link } from '@inertiajs/react';
import { assetUrl } from '@/utils/assetUrl';

export default function TeacherPendingApproval({ verified = false }) {
    const heading = verified
        ? 'Your Affiliated Hermit has been verified!'
        : 'Your Affiliated Hermit is awaiting verification';

    return (
        <>
            <Head title={heading} />
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
                        <h1 className="success-heading">{heading}</h1>
                        <div className="success-mascot">
                            <img
                                src={assetUrl('images/HermyLanding.png')}
                                alt="Hermit mascot"
                            />
                            <Link
                                href={route('login')}
                                className={verified ? 'btn btn-primary' : 'btn btn-secondary'}
                            >
                                Proceed to Login
                            </Link>
                        </div>
                    </div>
                    {!verified && (
                        <p className="auth-subtitle" style={{ maxWidth: 520 }}>
                            We are reviewing your affiliation documents. You will be able to log in
                            once an administrator approves your account.
                        </p>
                    )}
                </section>
            </div>
        </>
    );
}
