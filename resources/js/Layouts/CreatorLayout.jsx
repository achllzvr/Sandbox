import { Link, usePage } from '@inertiajs/react';
import {
    ClipboardList,
    LayoutDashboard,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    Shell,
    Wallet,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AdminCollapsedSidebarItem from '@/Components/Admin/AdminCollapsedSidebarItem';
import AppToastProvider from '@/Components/AppToastProvider';
import { AdminThemeProvider, useAdminTheme } from '@/hooks/useAdminTheme';
import { assetUrl } from '@/utils/assetUrl';

const SIDEBAR_KEY = 'sandbox-creator-sidebar-collapsed';

const NAV_ITEMS = [
    { label: 'Dashboard', routeName: 'creator.dashboard', key: 'dashboard', Icon: LayoutDashboard },
    { label: 'Shell Builder', routeName: 'creator.certifications.index', key: 'shells', Icon: Shell },
    { label: 'Auditor', routeName: 'creator.auditor.index', key: 'auditor', Icon: ClipboardList },
    { label: 'Wallet', routeName: 'creator.wallet.index', key: 'wallet', Icon: Wallet },
];

function readSidebarCollapsed() {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.localStorage.getItem(SIDEBAR_KEY) === '1';
}

export default function CreatorLayout({ children, activeNav, pageTitle }) {
    return (
        <AdminThemeProvider>
            <CreatorLayoutShell activeNav={activeNav} pageTitle={pageTitle}>
                {children}
            </CreatorLayoutShell>
        </AdminThemeProvider>
    );
}

function CreatorLayoutShell({ children, activeNav, pageTitle }) {
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

    function isNavActive(item) {
        if (activeNav === item.key) {
            return true;
        }
        try {
            if (item.key === 'shells') {
                return route().current('creator.certifications.*');
            }
            return route().current(item.routeName);
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
            className={`admin-shell creator-studio-shell ${sidebarCollapsed ? 'admin-shell--sidebar-collapsed' : ''}`}
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
                        <Link href={route('creator.dashboard')} className="admin-sidebar__brand-link">
                            <img
                                src={assetUrl('images/Hermy.png')}
                                alt=""
                                className="admin-sidebar__logo-img"
                                width={36}
                                height={36}
                            />
                            <div className="admin-sidebar__brand-text">
                                <span className="admin-sidebar__logo-text">Sandbox</span>
                                <span className="admin-sidebar__badge">Creator Studio</span>
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
                            <PanelLeftOpen className="admin-sidebar__collapse-icon" size={18} strokeWidth={2} aria-hidden="true" />
                        ) : (
                            <PanelLeftClose className="admin-sidebar__collapse-icon" size={18} strokeWidth={2} aria-hidden="true" />
                        )}
                    </button>
                </div>

                <nav className="admin-sidebar__nav" aria-label="Creator navigation">
                    {NAV_ITEMS.map((item) => {
                        const active = isNavActive(item);
                        const href = resolveRoute(item.routeName);
                        const Icon = item.Icon;

                        if (sidebarCollapsed) {
                            return (
                                <AdminCollapsedSidebarItem
                                    key={item.key}
                                    label={item.label}
                                    href={href}
                                    className={`admin-nav-link ${active ? 'admin-nav-link--active' : ''}`}
                                >
                                    <span className="admin-nav-link__icon">
                                        <Icon size={20} strokeWidth={2} aria-hidden="true" />
                                    </span>
                                    <span className="admin-nav-link__label">{item.label}</span>
                                </AdminCollapsedSidebarItem>
                            );
                        }

                        return (
                            <Link
                                key={item.key}
                                href={href}
                                className={`admin-nav-link ${active ? 'admin-nav-link--active' : ''}`}
                            >
                                <span className="admin-nav-link__icon">
                                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                                </span>
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
                                <LogOut className="admin-sidebar__collapse-icon" size={18} strokeWidth={2} aria-hidden="true" />
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
                            <Link href={route('logout')} method="post" as="button" className="admin-sidebar__logout">
                                <span className="admin-sidebar__logout-text">Sign out</span>
                            </Link>
                        </>
                    )}
                </div>
            </aside>

            <div className="admin-main">
                {pageTitle ? (
                    <header className="admin-topbar admin-fade-in-up">
                        <div className="admin-topbar__heading">
                            <p className="admin-topbar__eyebrow">Creator studio</p>
                            <h1 className="admin-page-title">{pageTitle}</h1>
                        </div>
                    </header>
                ) : null}

                <main className="admin-content admin-content--animated">{children}</main>
            </div>
        </div>
        </AppToastProvider>
    );
}
