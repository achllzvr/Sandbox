import { Link, usePage } from '@inertiajs/react';
import AdminNavIcon from '@/Components/Admin/AdminNavIcon';
import { assetUrl } from '@/utils/assetUrl';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: 'dashboard', routeName: 'admin.dashboard' },
    { label: 'Users', icon: 'users', routeName: 'admin.users.index' },
    { label: 'Certifications', icon: 'certifications', routeName: 'admin.certifications.index' },
    { label: 'Teachers', icon: 'teachers', routeName: 'admin.teachers.index' },
    { label: 'Audit Logs', icon: 'audit', routeName: 'admin.audit-logs.index' },
    { label: 'Finance', icon: 'finance', routeName: 'admin.finance.index' },
];

export default function AdminLayout({ children, pageTitle, topbarEnd }) {
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
                            alt=""
                            className="admin-sidebar__logo-img"
                            width={36}
                            height={36}
                        />
                        <div>
                            <span className="admin-sidebar__logo-text">Sandbox</span>
                            <span className="admin-sidebar__badge">Administration</span>
                        </div>
                    </Link>
                </div>

                <nav className="admin-sidebar__nav" aria-label="Admin navigation">
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
                                <AdminNavIcon name={item.icon} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="admin-sidebar__footer">
                    <div className="admin-sidebar__user">
                        <span className="admin-sidebar__avatar">
                            {user.first_name?.charAt(0)}
                            {user.last_name?.charAt(0)}
                        </span>
                        <div className="admin-sidebar__user-meta">
                            <p className="admin-sidebar__user-name">
                                {user.first_name} {user.last_name}
                            </p>
                            <p className="admin-sidebar__user-email">{user.email}</p>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="admin-sidebar__logout"
                    >
                        Sign out
                    </Link>
                </div>
            </aside>

            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar__heading">
                        <p className="admin-topbar__eyebrow">Admin console</p>
                        <h1 className="admin-page-title">{pageTitle || 'Admin'}</h1>
                    </div>
                    {topbarEnd && <div className="admin-topbar__end">{topbarEnd}</div>}
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
