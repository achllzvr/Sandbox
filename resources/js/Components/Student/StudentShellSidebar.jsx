import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Lock, Trophy, Zap } from 'lucide-react';
import { assetUrl } from '@/utils/assetUrl';

const FOOTER_LINKS = [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
];

export default function StudentShellSidebar({ collapsed, onToggle, onEmptyClick }) {
    const { auth, studentGamification } = usePage().props;
    const user = auth?.user;
    const gamification = studentGamification ?? {};
    const questProgress = 1;
    const questGoal = 3;

    if (!user) {
        return null;
    }

    const handle = user.email?.split('@')[0] ?? 'student';
    const displayName = gamification.hermy_name ?? user.first_name ?? 'Hermy';

    function handlePanelClick() {
        if (collapsed) {
            onEmptyClick();
        }
    }

    function handleToggle(event) {
        event.stopPropagation();
        onToggle(event);
    }

    return (
        <aside
            className={`student-shell-sidebar ${collapsed ? 'student-shell-sidebar--collapsed' : ''}`}
            onClick={handlePanelClick}
            aria-label="Profile, quests, and stats"
        >
            <div className="student-shell-sidebar__rail-avatar" aria-hidden={!collapsed}>
                <img src={assetUrl('images/Hermy.png')} alt="" width={40} height={40} />
            </div>

            <div className="student-shell-sidebar__body">
                <div className="student-shell-sidebar__stats">
                    <div className="student-shell-sidebar__stats-row">
                        <div className="student-shell-sidebar__stat" title="Streak">
                            <span className="student-shell-sidebar__stat-icon" aria-hidden="true">
                                🔥
                            </span>
                            <span className="student-shell-sidebar__stat-value">{gamification.streak_days ?? 0}</span>
                        </div>
                        <div className="student-shell-sidebar__stat" title="Sand dollars">
                            <span className="student-shell-sidebar__stat-icon" aria-hidden="true">
                                🪙
                            </span>
                            <span className="student-shell-sidebar__stat-value">{gamification.sand_dollars ?? 0}</span>
                        </div>
                        <div className="student-shell-sidebar__stat" title="Rank">
                            <Trophy size={18} strokeWidth={2.25} aria-hidden="true" />
                            <span className="student-shell-sidebar__stat-value student-shell-sidebar__stat-value--short">
                                {gamification.rank ? 'Ranked' : '—'}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="student-shell-sidebar__collapse"
                        onClick={handleToggle}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-expanded={!collapsed}
                    >
                        {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>

                <div className="student-shell-sidebar__content">
                    <div className="student-shell-sidebar__card student-shell-sidebar__card--profile">
                        <div className="student-shell-sidebar__profile-top">
                            <div className="student-shell-sidebar__avatar">
                                <img src={assetUrl('images/Hermy.png')} alt="" width={72} height={72} />
                            </div>
                        </div>
                        <p className="student-shell-sidebar__name">{displayName}</p>
                        <p className="student-shell-sidebar__handle">@{handle}</p>
                    </div>

                    <div className="student-shell-sidebar__card">
                        <div className="student-shell-sidebar__card-icon student-shell-sidebar__card-icon--muted">
                            <Lock size={28} strokeWidth={2} aria-hidden="true" />
                        </div>
                        <h3 className="student-shell-sidebar__card-title">Unlock Leaderboards!</h3>
                        <p className="student-shell-sidebar__card-text">
                            Finish 2 more sandboxes to start competing with other Hermits.
                        </p>
                        <Link href={route('student.leaderboard')} className="student-shell-sidebar__card-link">
                            View leaderboards
                        </Link>
                    </div>

                    <div className="student-shell-sidebar__card">
                        <div className="student-shell-sidebar__card-header">
                            <h3 className="student-shell-sidebar__card-title student-shell-sidebar__card-title--inline">
                                Daily Quests
                            </h3>
                            <Link href="#" className="student-shell-sidebar__card-link student-shell-sidebar__card-link--small">
                                View all
                            </Link>
                        </div>
                        <div className="student-shell-sidebar__quest">
                            <Zap size={18} className="student-shell-sidebar__quest-icon" aria-hidden="true" />
                            <div className="student-shell-sidebar__quest-body">
                                <p className="student-shell-sidebar__quest-label">Complete 3 sandboxes</p>
                                <div className="student-shell-sidebar__quest-bar">
                                    <div
                                        className="student-shell-sidebar__quest-fill"
                                        style={{ width: `${(questProgress / questGoal) * 100}%` }}
                                    />
                                </div>
                                <p className="student-shell-sidebar__quest-count">
                                    {questProgress}/{questGoal}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        type="button"
                        className="student-shell-sidebar__logout"
                    >
                        Logout
                    </Link>

                    <footer className="student-shell-sidebar__footer">
                        {FOOTER_LINKS.map((link) => (
                            <a key={link.label} href={link.href} className="student-shell-sidebar__footer-link">
                                {link.label}
                            </a>
                        ))}
                    </footer>
                </div>
            </div>
        </aside>
    );
}
