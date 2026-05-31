import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components';
import { colors, typography, shadows, borderRadius, spacing } from '@/Styles/theme';

export default function Welcome({ canLogin, canRegister, authUser }) {
    const isLoggedIn = !!authUser;

    return (
        <div style={{ 
            backgroundColor: colors.bg.primary, 
            minHeight: '100vh', 
            color: colors.text.primary,
            fontFamily: typography.fontFamily.primary,
        }}>
            <Head title="Welcome to Sandbox" />
            
            <style>{`
                @font-face {
                    font-family: 'Sparky Stones';
                    src: url('/fonts/SparkyStones.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap;
                }
                @font-face {
                    font-family: 'Montley Forces';
                    src: url('/fonts/MotleyForces.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap;
                }
                @font-face {
                    font-family: 'Roboto';
                    src: url('/fonts/Roboto.ttf') format('truetype');
                    font-weight: 400;
                    font-style: normal;
                    font-display: swap;
                }
                * {
                    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
                h1, h2, h3, .heading {
                    font-family: 'Montley Forces', Georgia, serif;
                }
            `}</style>

            {/* Navigation Bar */}
            <nav
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: colors.bg.primary,
                    borderBottom: `1px solid ${colors.border.light}`,
                    padding: `${spacing.md} ${spacing.lg}`,
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: `0 ${spacing.lg}`,
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.sm,
                            fontSize: '1.75rem',
                            fontFamily: typography.fontFamily.brand,
                            fontWeight: 'normal',
                            color: colors.button.primary,
                            letterSpacing: '0.02em',
                        }}
                    >
                        🦀 SANDBOX
                    </div>

                    {/* Auth Links */}
                    <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'center' }}>
                        {isLoggedIn ? (
                            <>
                                <span style={{ fontSize: '0.9rem', color: colors.text.primary }}>
                                    Hi, {authUser.first_name}!
                                </span>
                                <Link
                                    href={route('dashboard')}
                                    style={{
                                        padding: `${spacing.md} ${spacing.lg}`,
                                        backgroundColor: colors.button.primary,
                                        color: 'white',
                                        borderRadius: borderRadius.lg,
                                        textDecoration: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        textTransform: 'uppercase',
                                        boxShadow: shadows.btnPrimary,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: colors.text.secondary,
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        style={{
                                            color: colors.text.primary,
                                            textDecoration: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Login
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        style={{
                                            padding: `${spacing.md} ${spacing.lg}`,
                                            backgroundColor: colors.button.primary,
                                            color: 'white',
                                            borderRadius: borderRadius.lg,
                                            textDecoration: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            textTransform: 'uppercase',
                                            boxShadow: shadows.btnPrimary,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: `${spacing.xl} ${spacing.lg}`,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: spacing.xl,
                    alignItems: 'center',
                }}
            >
                {/* Hero Image */}
                <div style={{ textAlign: 'center', order: 2 }}>
                    <img
                        src="/images/HermyLanding.png"
                        alt="Hermy the Hermit Crab"
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            height: 'auto',
                            borderRadius: borderRadius.lg,
                        }}
                    />
                </div>

                {/* Hero Content */}
                <div style={{ order: 1 }}>
                    <h1
                        style={{
                            fontFamily: typography.fontFamily.heading,
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: colors.text.primary,
                            marginBottom: spacing.lg,
                            lineHeight: 1.2,
                            margin: 0,
                        }}
                    >
                        Break out of your shell, expand and learn playfully!
                    </h1>

                    <p
                        style={{
                            color: colors.text.secondary,
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            marginBottom: spacing.xl,
                            margin: `0 0 ${spacing.xl} 0`,
                        }}
                    >
                        Sandbox turns learning into an adventure — earn Sand Dollars, customize your hermit avatar, and grow your skills one shell at a time.
                    </p>

                    {/* CTA Buttons */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: spacing.md,
                        }}
                    >
                        {isLoggedIn ? (
                            <Link href={route('dashboard')} style={{ textDecoration: 'none' }}>
                                <Button variant="filled" size="lg" style={{ width: '100%' }}>
                                    GO TO DASHBOARD
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={canRegister ? route('register') : '#'} style={{ textDecoration: 'none' }}>
                                    <Button variant="filled" size="lg" style={{ width: '100%' }}>
                                        GET STARTED
                                    </Button>
                                </Link>
                                <Link
                                    href={canLogin ? route('login') : '#'}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        style={{
                                            width: '100%',
                                            backgroundColor: colors.button.secondary,
                                        }}
                                    >
                                        I ALREADY HAVE A SHELL
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Role Cards Section */}
            {!isLoggedIn && (
                <section
                    style={{
                        maxWidth: '1200px',
                        margin: `${spacing.xl} auto`,
                        padding: `0 ${spacing.lg}`,
                    }}
                >
                    <p
                        style={{
                            textAlign: 'center',
                            fontSize: typography.fontSize.xs,
                            color: colors.text.secondary,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: spacing.lg,
                            fontWeight: 600,
                            margin: `0 0 ${spacing.lg} 0`,
                        }}
                    >
                        Join as
                    </p>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: spacing.xl,
                        }}
                    >
                        {/* Learner Card */}
                        <div
                            style={{
                                border: `3px solid ${colors.button.primary}`,
                                borderRadius: borderRadius.lg,
                                padding: spacing.xl,
                                backgroundColor: '#FFFFFF',
                                boxShadow: shadows.card,
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: borderRadius.sm,
                                    backgroundColor: colors.button.primaryLight,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    marginBottom: spacing.md,
                                }}
                            >
                                🎓
                            </div>
                            <h3
                                style={{
                                    fontFamily: typography.fontFamily.heading,
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    color: colors.text.primary,
                                    marginBottom: spacing.sm,
                                    margin: `0 0 ${spacing.sm} 0`,
                                }}
                            >
                                Learner
                            </h3>
                            <p
                                style={{
                                    color: colors.text.secondary,
                                    fontSize: '0.9rem',
                                    lineHeight: 1.6,
                                    marginBottom: spacing.lg,
                                    margin: `0 0 ${spacing.lg} 0`,
                                }}
                            >
                                Browse certifications, earn Sand Dollars, and customize your hermit avatar.
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
                                {['Marketplace', 'Sand Dollars', 'Streaks'].map((tag) => (
                                    <span
                                        key={tag}
                                        style={{
                                            backgroundColor: colors.button.primaryLight,
                                            color: colors.button.primary,
                                            fontSize: typography.fontSize.xs,
                                            padding: `${spacing.sm} ${spacing.md}`,
                                            borderRadius: borderRadius.full,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {canRegister && (
                                <Link href={route('register')} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                                    <Button variant="filled" size="lg" style={{ width: '100%' }}>
                                        Register as Learner
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Educator Card */}
                        <div
                            style={{
                                border: `3px solid #6DB5D4`,
                                borderRadius: borderRadius.lg,
                                padding: spacing.xl,
                                backgroundColor: '#FFFFFF',
                                boxShadow: '0 5px 0 0 #5A9BAF',
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: borderRadius.sm,
                                    backgroundColor: '#E0F5F0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    marginBottom: spacing.md,
                                }}
                            >
                                👥
                            </div>
                            <h3
                                style={{
                                    fontFamily: typography.fontFamily.heading,
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    color: colors.text.primary,
                                    marginBottom: spacing.sm,
                                    margin: `0 0 ${spacing.sm} 0`,
                                }}
                            >
                                Educator / Affiliate
                            </h3>
                            <p
                                style={{
                                    color: colors.text.secondary,
                                    fontSize: '0.9rem',
                                    lineHeight: 1.6,
                                    marginBottom: spacing.lg,
                                    margin: `0 0 ${spacing.lg} 0`,
                                }}
                            >
                                Create affiliated hermit accounts, purchase vouchers, and track progress.
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
                                {['Bulk Vouchers', 'Analytics', 'Affiliate'].map((tag) => (
                                    <span
                                        key={tag}
                                        style={{
                                            backgroundColor: '#E0F5F0',
                                            color: '#008080',
                                            fontSize: typography.fontSize.xs,
                                            padding: `${spacing.sm} ${spacing.md}`,
                                            borderRadius: borderRadius.full,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <p
                                style={{
                                    fontSize: typography.fontSize.xs,
                                    color: colors.text.secondary,
                                    fontStyle: 'italic',
                                    marginBottom: spacing.lg,
                                    margin: `0 0 ${spacing.lg} 0`,
                                }}
                            >
                                Requires verification after registration.
                            </p>

                            {canRegister && (
                                <Link href={route('register')} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                                    <Button
                                        variant="filled"
                                        size="lg"
                                        style={{ width: '100%' }}
                                    >
                                        Register as Educator
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Gamification Section */}
            <section
                style={{
                    backgroundColor: 'white',
                    padding: `${spacing.xl} ${spacing.lg}`,
                    margin: `${spacing.xl} 0 0 0`,
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                >
                    <div style={{ display: 'flex', gap: spacing.lg, marginBottom: spacing.lg }}>
                        <div style={{ fontSize: '2rem' }}>🏆</div>
                        <div>
                            <h2
                                style={{
                                    fontFamily: typography.fontFamily.heading,
                                    fontSize: '1.5rem',
                                    color: colors.text.primary,
                                    marginBottom: spacing.md,
                                    margin: `0 0 ${spacing.md} 0`,
                                }}
                            >
                                Keep your streak. Spend your Sand Dollars.
                            </h2>
                            <p
                                style={{
                                    color: colors.text.secondary,
                                    fontSize: '1rem',
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                Complete modules daily to maintain your learning streak. Every completed certification earns Sand Dollars — spend them in the Hermy shop to customize your avatar.
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: spacing.xl,
                        }}
                    >
                        {[
                            { icon: '🔥', label: 'Streaks', desc: 'Daily learning rewards' },
                            { icon: '💰', label: 'Sand Dollars', desc: 'Platform currency' },
                            { icon: '🦀', label: 'Hermy', desc: 'Your avatar' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: spacing.md }}>
                                    {item.icon}
                                </div>
                                <h4
                                    style={{
                                        fontFamily: typography.fontFamily.heading,
                                        fontSize: '1rem',
                                        color: colors.text.primary,
                                        fontWeight: 'bold',
                                        marginBottom: spacing.sm,
                                        margin: `0 0 ${spacing.sm} 0`,
                                    }}
                                >
                                    {item.label}
                                </h4>
                                <p
                                    style={{
                                        fontSize: typography.fontSize.sm,
                                        color: colors.text.secondary,
                                        margin: 0,
                                    }}
                                >
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                style={{
                    backgroundColor: colors.bg.primary,
                    borderTop: `1px solid ${colors.border.light}`,
                    padding: `${spacing.xl} ${spacing.lg}`,
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                >
                    <p
                        style={{
                            color: colors.text.secondary,
                            fontSize: typography.fontSize.sm,
                            margin: `0 0 ${spacing.md} 0`,
                        }}
                    >
                        © 2026 Sandbox — Learning Platform
                    </p>
                    <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
                        <a
                            href="#"
                            style={{
                                color: colors.text.link,
                                textDecoration: 'underline',
                                fontSize: typography.fontSize.xs,
                                cursor: 'pointer',
                            }}
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            style={{
                                color: colors.text.link,
                                textDecoration: 'underline',
                                fontSize: typography.fontSize.xs,
                                cursor: 'pointer',
                            }}
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            style={{
                                color: colors.text.link,
                                textDecoration: 'underline',
                                fontSize: typography.fontSize.xs,
                                cursor: 'pointer',
                            }}
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
