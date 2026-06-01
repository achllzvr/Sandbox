import { Link, usePage } from '@inertiajs/react';
import { Shell, ShoppingBag, Trophy, Users } from 'lucide-react';
import StudentWorkspace from '@/Components/Student/StudentWorkspace';
import { assetUrl } from '@/utils/assetUrl';

const NAV_ITEMS = [
    { label: 'My Shells', routeName: 'student.dashboard', key: 'shells', Icon: Shell },
    { label: 'Shop', routeName: 'marketplace.index', key: 'shop', Icon: ShoppingBag },
    { label: 'Leaderboard', routeName: 'student.leaderboard', key: 'leaderboard', Icon: Trophy },
    { label: 'My Cast', routeName: 'student.cast', key: 'cast', Icon: Users },
];

export default function StudentLayout({ children, activeNav, layoutMode = 'standard', workspaceModifier }) {
    const { flash } = usePage().props;
    const usesWorkspace = layoutMode === 'shell' || layoutMode === 'select';
    const isShellPage = layoutMode === 'shell';

    function isNavActive(item) {
        if (activeNav === item.key) {
            return true;
        }
        try {
            return route().current(item.routeName);
        } catch {
            return false;
        }
    }

    return (
        <div className={`student-shell ${isShellPage ? 'student-shell--shell-page' : ''}`}>
            <aside className="student-nav student-fade-in-up" aria-label="Student navigation">
                <div className="student-nav__inner">
                    <Link href={route('student.dashboard')} className="student-nav__logo">
                        <img
                            src={assetUrl('images/Hermy.png')}
                            alt=""
                            className="student-nav__logo-mark"
                            width={32}
                            height={32}
                        />
                        <span>Sandbox</span>
                    </Link>

                    <nav className="student-nav__links">
                        {NAV_ITEMS.map((item) => {
                            const active = isNavActive(item);
                            const Icon = item.Icon;

                            return (
                                <Link
                                    key={item.key}
                                    href={route(item.routeName)}
                                    className={`student-nav__link ${active ? 'student-nav__link--active' : ''}`}
                                >
                                    <span className="student-nav__link-icon-wrap">
                                        <Icon className="student-nav__link-icon" size={22} strokeWidth={2} aria-hidden="true" />
                                    </span>
                                    <span className="student-nav__link-text">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            <main className="student-main student-content--animated">
                {usesWorkspace ? (
                    <StudentWorkspace layoutMode={layoutMode} modifier={workspaceModifier}>
                        {children}
                    </StudentWorkspace>
                ) : (
                    children
                )}
            </main>

            {flash?.success || flash?.error ? (
                <div
                    className={`student-flash student-flash--floating ${flash.success ? 'student-flash--success' : 'student-flash--error'} student-fade-in-up`}
                    role="status"
                >
                    {flash.success || flash.error}
                </div>
            ) : null}
        </div>
    );
}
