import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { assetUrl } from '@/utils/assetUrl';

const PROFILE_KEY = 'sandbox-student-profile-collapsed';

const NAV_ITEMS = [
    { label: 'My Shells', short: 'S', routeName: 'student.dashboard', key: 'shells' },
    { label: 'Shop', short: 'P', routeName: 'marketplace.index', key: 'shop' },
    { label: 'Leaderboard', short: 'L', routeName: 'student.leaderboard', key: 'leaderboard' },
    { label: 'My Cast', short: 'C', routeName: 'student.cast', key: 'cast' },
];

function readProfileCollapsed() {
    if (typeof window === 'undefined') {
        return true;
    }
    return window.localStorage.getItem(PROFILE_KEY) !== '0';
}

export default function StudentLayout({ children, activeNav, pageTitle }) {
    const { auth, studentGamification, flash } = usePage().props;
    const user = auth.user;
    const gamification = studentGamification ?? {};
    const [profileCollapsed, setProfileCollapsed] = useState(readProfileCollapsed);

    useEffect(() => {
        window.localStorage.setItem(PROFILE_KEY, profileCollapsed ? '1' : '0');
    }, [profileCollapsed]);

    const toggleProfile = useCallback((event) => {
        event?.stopPropagation();
        setProfileCollapsed((current) => !current);
    }, []);

    function handleProfileEmptyClick() {
        if (profileCollapsed) {
            setProfileCollapsed(false);
        }
    }

    const handle = user.email?.split('@')[0] ?? 'student';
    const displayName = gamification.hermy_name ?? user.first_name ?? 'Hermy';

    return (
        <div className={`student-shell ${profileCollapsed ? 'student-shell--profile-collapsed' : ''}`}>
            <aside className="student-nav" aria-label="Student navigation">
                <Link href={route('student.dashboard')} className="student-nav__logo">
                    SANDBOX
                </Link>
                <nav className="student-nav__links">
                    {NAV_ITEMS.map((item) => {
                        let active = activeNav === item.key;
                        try {
                            active = active || route().current(item.routeName);
                        } catch {
                            // route may not exist in tests
                        }

                        return (
                            <Link
                                key={item.key}
                                href={route(item.routeName)}
                                className={`student-nav__link ${active ? 'student-nav__link--active' : ''}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <main className="student-main">
                {pageTitle && <h1 className="sr-only">{pageTitle}</h1>}
                {(flash?.success || flash?.error) && (
                    <div
                        className={`student-flash ${flash.success ? 'student-flash--success' : 'student-flash--error'}`}
                    >
                        {flash.success || flash.error}
                    </div>
                )}
                {children}
            </main>

            <aside
                className={`student-profile ${profileCollapsed ? 'student-profile--collapsed' : ''}`}
                onClick={handleProfileEmptyClick}
                aria-label="My Hermit profile"
            >
                <h2 className="student-profile__heading">my Hermit</h2>
                <div className="student-profile__avatar-wrap">
                    <div className="student-profile__avatar">
                        <img src={assetUrl('images/Hermy.png')} alt="" width={96} height={96} />
                    </div>
                </div>
                {!profileCollapsed && (
                    <div className="student-profile__meta">
                        <p className="student-profile__name">
                            {displayName}
                            <span aria-hidden="true">🐚</span>
                        </p>
                        <p className="student-profile__handle">@{handle}</p>
                        {(gamification.sand_dollars != null || gamification.streak_days != null) && (
                            <div className="student-profile__stats">
                                {gamification.streak_days != null && (
                                    <div>🔥 {gamification.streak_days} day streak</div>
                                )}
                                {gamification.sand_dollars != null && (
                                    <div>🪙 {gamification.sand_dollars} sand dollars</div>
                                )}
                                {gamification.rank && <div>🏅 {gamification.rank}</div>}
                            </div>
                        )}
                    </div>
                )}
                {!profileCollapsed && (
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        type="button"
                        className="student-profile__logout"
                        onClick={(event) => event.stopPropagation()}
                    >
                        LOGOUT
                    </Link>
                )}
                <button
                    type="button"
                    className="student-profile__toggle"
                    onClick={toggleProfile}
                    aria-label={profileCollapsed ? 'Expand profile panel' : 'Collapse profile panel'}
                    aria-expanded={!profileCollapsed}
                >
                    {profileCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
            </aside>
        </div>
    );
}
