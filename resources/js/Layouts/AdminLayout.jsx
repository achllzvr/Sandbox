import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

const NAV_ITEMS = [
    { label: 'Dashboard',      icon: '📊', routeName: 'admin.dashboard' },
    { label: 'Users',           icon: '👥', routeName: 'admin.users.index' },
    { label: 'Certifications',  icon: '📜', routeName: 'admin.certifications.index' },
    { label: 'Teachers',        icon: '🎓', routeName: 'admin.teachers.index' },
    { label: 'Audit Logs',      icon: '📋', routeName: 'admin.audit-logs.index' },
    { label: 'Finance',         icon: '💰', routeName: 'admin.finance.index' },
];

export default function AdminLayout({ children, pageTitle }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    function isActive(routeName) {
        try {
            return route().current(routeName) || route().current(routeName + '.*');
        } catch {
            return false;
        }
    }

    return (
        <div className="min-h-screen flex bg-stone-100">
            {/* ── Sidebar ────────────────────────────────── */}
            <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col fixed inset-y-0 left-0 z-40">
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-5 border-b border-stone-800">
                    <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-white font-bold text-sm">
                        S
                    </div>
                    <div>
                        <span className="font-bold text-white text-sm tracking-tight">Sandbox</span>
                        <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                            Admin
                        </span>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
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
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                    active
                                        ? 'bg-amber-500/15 text-amber-400'
                                        : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom user info + Logout */}
                <div className="px-4 py-4 border-t border-stone-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-200 truncate">
                                {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-stone-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-stone-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log Out
                    </Link>
                </div>
            </aside>

            {/* ── Main content ───────────────────────────── */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 sticky top-0 z-30">
                    <h1 className="text-lg font-bold text-stone-900">
                        {pageTitle || 'Admin'}
                    </h1>

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors">
                                {user.first_name} {user.last_name}
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </header>

                {/* Flash messages */}
                <div className="px-6 pt-4">
                    {flash?.success && (
                        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 font-medium">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-medium">
                            {flash.error}
                        </div>
                    )}
                </div>

                {/* Page content */}
                <main className="flex-1 px-6 pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
