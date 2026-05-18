import { Head, Link } from '@inertiajs/react';
import CreatorLayout from '@/Layouts/CreatorLayout';

/* ── Stat card config ────────────────────────────────── */
const STAT_CARDS = [
    {
        key: 'total_certifications',
        label: 'My Shells',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        ),
        gradient: 'from-violet-500 to-indigo-600',
        bg: 'bg-violet-50',
        text: 'text-violet-700',
        ring: 'ring-violet-200',
    },
    {
        key: 'total_lessons',
        label: 'Lessons Created',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
        ),
        gradient: 'from-cyan-500 to-blue-600',
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        ring: 'ring-cyan-200',
    },
    {
        key: 'total_modules',
        label: 'Modules Uploaded',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
        gradient: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        ring: 'ring-emerald-200',
    },
    {
        key: 'total_questions',
        label: 'Questions Added',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
        ),
        gradient: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        ring: 'ring-amber-200',
    },
];

/* ── Quick action cards ──────────────────────────────── */
const QUICK_ACTIONS = [
    {
        label: 'Create New Shell',
        description: 'Start building a new certification shell from scratch',
        routeName: 'creator.certifications.create',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        ),
        gradient: 'from-violet-500 to-indigo-600',
    },
    {
        label: 'View My Shells',
        description: 'Manage and edit your existing certification shells',
        routeName: 'creator.certifications.index',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
        ),
        gradient: 'from-cyan-500 to-blue-600',
    },
    {
        label: 'Edit Profile',
        description: 'Update your personal information and preferences',
        routeName: 'profile.edit',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        gradient: 'from-emerald-500 to-teal-600',
    },
];

/* ── Status badge helper ─────────────────────────────── */
function statusClasses(status) {
    const map = {
        draft:              'bg-slate-100 text-slate-600',
        pending_approval:   'bg-amber-100 text-amber-700',
        published:          'bg-emerald-100 text-emerald-700',
        declined:           'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-slate-100 text-slate-600';
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
}

function formatTime(d) {
    return new Date(d).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit',
    });
}

/* ── Dashboard Component ─────────────────────────────── */
export default function Dashboard({ metrics, recent_certifications, recent_lessons }) {
    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    })();

    return (
        <CreatorLayout pageTitle="Dashboard">
            <Head title="Creator Dashboard" />

            {/* ── Welcome Banner ──────────────────── */}
            <div className="mt-2 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-6 sm:p-8 text-white relative overflow-hidden">
                {/* Decorative shapes */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg" />

                <div className="relative z-10">
                    <p className="text-violet-200 text-sm font-medium">{greeting} 👋</p>
                    <h2 className="text-2xl sm:text-3xl font-bold mt-1">Welcome to Creator Studio</h2>
                    <p className="text-violet-200/80 mt-2 max-w-xl text-sm sm:text-base">
                        Build and manage certification shells, create lessons, upload modules, and craft assessment questions — all from one place.
                    </p>
                    <Link
                        href={route('creator.certifications.create')}
                        className="mt-4 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 border border-white/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create New Shell
                    </Link>
                </div>
            </div>

            {/* ── Stats Grid ─────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {STAT_CARDS.map((card) => (
                    <div
                        key={card.key}
                        className={`relative rounded-2xl border ${card.ring} ring-1 ${card.bg} p-5 overflow-hidden group hover:shadow-lg hover:shadow-${card.gradient.split('-')[1]}-500/10 transition-all duration-300`}
                    >
                        <div className={`absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br ${card.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`} />
                        <div className="relative z-10">
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
                                {card.icon}
                            </div>
                            <p className="text-3xl font-bold text-slate-900 mt-3">
                                {metrics[card.key] ?? 0}
                            </p>
                            <p className={`text-sm font-medium mt-1 ${card.text} opacity-80`}>
                                {card.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Quick Actions ──────────────────── */}
            <div className="mt-8">
                <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {QUICK_ACTIONS.map((action) => {
                        let href;
                        try {
                            href = route(action.routeName);
                        } catch {
                            href = '#';
                        }
                        return (
                            <Link
                                key={action.routeName}
                                href={href}
                                className="group relative rounded-2xl border border-slate-200 bg-white p-6 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 overflow-hidden"
                            >
                                <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${action.gradient} rounded-full opacity-0 group-hover:opacity-10 transition-all duration-300 group-hover:scale-110`} />
                                <div className="relative z-10">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {action.icon}
                                    </div>
                                    <h4 className="font-bold text-slate-900 mt-4 group-hover:text-violet-700 transition-colors">
                                        {action.label}
                                    </h4>
                                    <p className="text-sm text-slate-500 mt-1">{action.description}</p>
                                </div>
                                <div className="absolute top-5 right-5 text-slate-300 group-hover:text-violet-400 transition-colors">
                                    <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ── Recent Activity Grid ───────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Recent Certifications / Shells */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-violet-500" />
                            Recent Shells
                        </h3>
                        <Link
                            href={route('creator.certifications.index')}
                            className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {(!recent_certifications || recent_certifications.length === 0) ? (
                            <div className="px-6 py-12 text-center">
                                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-slate-400">No shells created yet.</p>
                                <Link
                                    href={route('creator.certifications.create')}
                                    className="mt-3 inline-flex text-xs font-semibold text-violet-600 hover:text-violet-800"
                                >
                                    Create your first shell →
                                </Link>
                            </div>
                        ) : (
                            recent_certifications.map((cert) => (
                                <Link
                                    key={cert.id}
                                    href={route('creator.certifications.edit', cert.id)}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-violet-700 transition-colors">
                                            {cert.title}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {formatDate(cert.created_at)}
                                            {cert.price && <span> · ₱{parseFloat(cert.price).toLocaleString()}</span>}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${statusClasses(cert.status)}`}>
                                        {cert.status?.replace(/_/g, ' ')}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Lessons */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500" />
                            Recent Lessons
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {(!recent_lessons || recent_lessons.length === 0) ? (
                            <div className="px-6 py-12 text-center">
                                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                    </svg>
                                </div>
                                <p className="text-sm text-slate-400">No lessons created yet.</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Lessons are created inside certification shells.
                                </p>
                            </div>
                        ) : (
                            recent_lessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                            {lesson.title}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {lesson.certification?.title && (
                                                <span className="text-cyan-600 font-medium">{lesson.certification.title}</span>
                                            )}
                                            {lesson.certification?.title && ' · '}
                                            {formatDate(lesson.created_at)}
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full font-medium">
                                        {lesson.modules_count ?? 0} module{(lesson.modules_count ?? 0) !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ── Status Breakdown ────────────────── */}
            {metrics && (metrics.draft > 0 || metrics.pending > 0 || metrics.published > 0 || metrics.declined > 0) && (
                <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Shell Status Breakdown</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { key: 'draft',     label: 'Drafts',           color: 'bg-slate-200',   text: 'text-slate-700' },
                            { key: 'pending',   label: 'Pending Approval', color: 'bg-amber-400',   text: 'text-amber-700' },
                            { key: 'published', label: 'Published',        color: 'bg-emerald-400', text: 'text-emerald-700' },
                            { key: 'declined',  label: 'Declined',         color: 'bg-red-400',     text: 'text-red-700' },
                        ].map((s) => (
                            <div key={s.key} className="text-center">
                                <div className={`w-14 h-14 mx-auto rounded-2xl ${s.color}/20 flex items-center justify-center`}>
                                    <span className={`text-2xl font-bold ${s.text}`}>{metrics[s.key] ?? 0}</span>
                                </div>
                                <p className="text-xs font-medium text-slate-500 mt-2">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </CreatorLayout>
    );
}
