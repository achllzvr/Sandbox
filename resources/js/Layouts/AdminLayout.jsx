import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import { assetUrl } from '@/utils/assetUrl';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: '📊', routeName: 'admin.dashboard' },
    { label: 'Users', icon: '👥', routeName: 'admin.users.index' },
    { label: 'Certifications', icon: '📜', routeName: 'admin.certifications.index' },
    { label: 'Teachers', icon: '🎓', routeName: 'admin.teachers.index' },
    { label: 'Audit Logs', icon: '📋', routeName: 'admin.audit-logs.index' },
    { label: 'Finance', icon: '💰', routeName: 'admin.finance.index' },
];

export default function AdminLayout({ children, pageTitle }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    function isActive(routeName) {
        try {
            return route().current(routeName) || route().current(`${routeName}.*`);
        } catch {
            return false;
        }
    }

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-sidebar__brand">
                    <Link href={route('admin.dashboard')} className="admin-sidebar__brand-link">
                        <img
                            src={assetUrl('images/Hermy.png')}
                            alt="Sandbox mascot"
                            className="admin-sidebar__logo-img"
                            width={40}
                            height={40}
                        />
                        <div>
                            <span className="admin-sidebar__logo-text">SANDBOX</span>
                            <span className="admin-sidebar__badge">Admin</span>
                        </div>
                    </Link>
                </div>

                <nav className="admin-sidebar__nav">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.routeName);
                        let href;
                        try {
                            href = route(item.routeName);
                        } catch {
                            href = '#';
                        }
                        return (
                            <Link
                                key={item.routeName}
                                href={href}
                                className={`admin-nav-link ${active ? 'admin-nav-link--active' : ''}`}
                            >
                                <span className="admin-nav-link__icon">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="admin-sidebar__footer">
                    <p className="admin-sidebar__user-name">
                        {user.first_name} {user.last_name}
                    </p>
                    <p className="admin-sidebar__user-email">{user.email}</p>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="admin-sidebar__logout"
                    >
                        Log Out
                    </Link>
                </div>
            </aside>

            <div className="admin-main">
                <header className="admin-topbar">
                    <h1 className="admin-page-title">{pageTitle || 'Admin'}</h1>

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button type="button" className="admin-topbar__user-btn">
                                {user.first_name} {user.last_name}
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content contentClasses="admin-dropdown-panel py-1">
                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </header>

                {(flash?.success || flash?.error) && (
                    <div className="admin-flash-wrap">
                        {flash?.success && (
                            <div className="admin-flash admin-flash--success">{flash.success}</div>
                        )}
                        {flash?.error && (
                            <div className="admin-flash admin-flash--error">{flash.error}</div>
                        )}
                    </div>
                )}

                <main className="admin-content">{children}</main>
            </div>
        </div>
    );
}
