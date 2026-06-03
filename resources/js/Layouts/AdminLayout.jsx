import { Link, usePage } from '@inertiajs/react';
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AdminCollapsedSidebarItem from '@/Components/Admin/AdminCollapsedSidebarItem';
import AdminNavIcon from '@/Components/Admin/AdminNavIcon';
import AppToastProvider from '@/Components/AppToastProvider';
import { AdminThemeProvider, useAdminTheme } from '@/hooks/useAdminTheme';
import { assetUrl } from '@/utils/assetUrl';

const SIDEBAR_KEY = 'sandbox-admin-sidebar-collapsed';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: 'dashboard', routeName: 'admin.dashboard' },
    { label: 'Users', icon: 'users', routeName: 'admin.users.index' },
    { label: 'Certifications', icon: 'certifications', routeName: 'admin.certifications.index' },
    { label: 'Audit Logs', icon: 'audit', routeName: 'admin.audit-logs.index' },
    { label: 'Finance', icon: 'finance', routeName: 'admin.finance.index' },
];

function readSidebarCollapsed() {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.localStorage.getItem(SIDEBAR_KEY) === '1';
}

export default function AdminLayout({ children, pageTitle, topbarEnd }) {
    return (
        <AdminThemeProvider>
            <AdminLayoutShell pageTitle={pageTitle} topbarEnd={topbarEnd}>
                {children}
            </AdminLayoutShell>
        </AdminThemeProvider>
    );
}

function AdminLayoutShell({ children, pageTitle, topbarEnd }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const { theme, highContrast } = useAdminTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(readSidebarCollapsed);

    useEffect(() => {
        window.localStorage.setItem(SIDEBAR_KEY, sidebarCollapsed ? '1' : '0');
    }, [sidebarCollapsed]);

    const expandSidebar = useCallback(() => {
        setSidebarCollapsed(false);
    }, []);

    const toggleSidebar = useCallback((event) => {
        event.stopPropagation();
        setSidebarCollapsed((current) => !current);
    }, []);

    function handleSidebarEmptyClick(event) {
        if (!sidebarCollapsed) {
            return;
        }
        if (event.target.closest('.admin-sidebar-collapsed-item, .admin-sidebar__collapse')) {
            return;
        }
        expandSidebar();
    }

    function isActive(routeName) {
        try {
            return route().current(routeName) || route().current(`${routeName}.*`);
        } catch {
            return false;
        }
    }

    function resolveRoute(routeName) {
        try {
            return route(routeName);
        } catch {
            return '#';
        }
    }

    return (
        <AppToastProvider>
        <div
            className={`admin-shell ${sidebarCollapsed ? 'admin-shell--sidebar-collapsed' : ''}`}
            data-admin-theme={theme}
            data-admin-contrast={theme === 'light' && highContrast ? 'high' : undefined}
        >
            <aside
                className={`admin-sidebar ${sidebarCollapsed ? 'admin-sidebar--collapsed' : ''}`}
                onClick={handleSidebarEmptyClick}
            >
                <div className="admin-sidebar__brand">
                    {sidebarCollapsed ? (
                        <div className="admin-sidebar__brand-link admin-sidebar__brand-link--icon-only">
                            <img
                                src={assetUrl('images/Hermy.png')}
                                alt="Sandbox"
                                className="admin-sidebar__logo-img"
                                width={36}
                                height={36}
                            />
                        </div>
                    ) : (
                        <Link href={route('admin.dashboard')} className="admin-sidebar__brand-link">
                            <img
                                src={assetUrl('images/Hermy.png')}
                                alt=""
                                className="admin-sidebar__logo-img"
                                width={36}
                                height={36}
                            />
                            <div className="admin-sidebar__brand-text">
                                <span className="admin-sidebar__logo-text">Sandbox</span>
                                <span className="admin-sidebar__badge">Administration</span>
                            </div>
                        </Link>
                    )}
                    <button
                        type="button"
                        className="admin-sidebar__collapse"
                        onClick={toggleSidebar}
                        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-expanded={!sidebarCollapsed}
                    >
                        {sidebarCollapsed ? (
                            <PanelLeftOpen
                                className="admin-sidebar__collapse-icon"
                                size={18}
                                stroke="currentColor"
                                fill="none"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            />
                        ) : (
                            <PanelLeftClose
                                className="admin-sidebar__collapse-icon"
                                size={18}
                                stroke="currentColor"
                                fill="none"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            />
                        )}
                    </button>
                </div>

                <nav className="admin-sidebar__nav" aria-label="Admin navigation">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.routeName);
                        const href = resolveRoute(item.routeName);

                        if (sidebarCollapsed) {
                            return (
                                <AdminCollapsedSidebarItem
                                    key={item.routeName}
                                    label={item.label}
                                    href={href}
                                    className={`admin-nav-link ${active ? 'admin-nav-link--active' : ''}`}
                                >
                                    <AdminNavIcon name={item.icon} />
                                    <span className="admin-nav-link__label">{item.label}</span>
                                </AdminCollapsedSidebarItem>
                            );
                        }

                        return (
                            <Link
                                key={item.routeName}
                                href={href}
                                className={`admin-nav-link ${active ? 'admin-nav-link--active' : ''}`}
                            >
                                <AdminNavIcon name={item.icon} />
                                <span className="admin-nav-link__label">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="admin-sidebar__footer">
                    {sidebarCollapsed ? (
                        <>
                            <AdminCollapsedSidebarItem
                                label="Profile settings"
                                href={route('profile.edit')}
                                className="admin-sidebar__user admin-sidebar__user-link admin-sidebar__user-link--icon-only"
                            >
                                <span className="admin-sidebar__avatar">
                                    {user.first_name?.charAt(0)}
                                    {user.last_name?.charAt(0)}
                                </span>
                            </AdminCollapsedSidebarItem>
                            <AdminCollapsedSidebarItem
                                label="Sign out"
                                href={route('logout')}
                                method="post"
                                className="admin-sidebar__logout admin-sidebar__logout--icon-only"
                            >
                                <LogOut
                                    className="admin-sidebar__collapse-icon"
                                    size={18}
                                    stroke="currentColor"
                                    fill="none"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                />
                            </AdminCollapsedSidebarItem>
                        </>
                    ) : (
                        <>
                            <Link href={route('profile.edit')} className="admin-sidebar__user admin-sidebar__user-link">
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
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="admin-sidebar__logout"
                            >
                                <span className="admin-sidebar__logout-text">Sign out</span>
                            </Link>
                        </>
                    )}
                </div>
            </aside>

            <div className="admin-main">
                <header className="admin-topbar admin-fade-in-up">
                    <div className="admin-topbar__heading">
                        <p className="admin-topbar__eyebrow">Admin console</p>
                        <h1 className="admin-page-title">{pageTitle || 'Admin'}</h1>
                    </div>
                    <div className="admin-topbar__actions">
                        {topbarEnd && <div className="admin-topbar__end">{topbarEnd}</div>}
                    </div>
                </header>

                <main className="admin-content admin-content--animated">{children}</main>
            </div>
        </div>
        </AppToastProvider>
    );
}
