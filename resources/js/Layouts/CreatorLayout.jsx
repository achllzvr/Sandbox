import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

const NAV_ITEMS = [
    { label: 'Dashboard',       icon: '🏠', routeName: 'creator.dashboard' },
    { label: 'My Shells',       icon: '🐚', routeName: 'creator.certifications.index' },
    { label: 'Create Shell',    icon: '✨', routeName: 'creator.certifications.create' },
];

export default function CreatorLayout({ children, pageTitle }) {
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
        <div className="min-h-screen flex bg-slate-50">
            {/* ── Sidebar ────────────────────────────────── */}
            <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-slate-300 flex flex-col fixed inset-y-0 left-0 z-40">
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/25">
                        S
                    </div>
                    <div>
                        <span className="font-bold text-white text-sm tracking-tight">Sandbox</span>
                        <span className="ml-2 text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                            Creator
                        </span>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        Navigation
                    </p>
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
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? 'bg-violet-500/15 text-violet-300 shadow-sm shadow-violet-500/10'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                                {active && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom user info + Logout */}
                <div className="px-4 py-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/25">
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate">
                                {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
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
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 sticky top-0 z-30">
                    <h1 className="text-lg font-bold text-slate-900">
                        {pageTitle || 'Creator Studio'}
                    </h1>

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                                </div>
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
                        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 font-medium flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-medium flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {flash.error}
                        </div>
                    )}
                </div>

                {/* Page content */}
                <main className="flex-1 px-6 pb-8 flex flex-col">
                    {children}
                </main>
            </div>
        </div>
    );
}
