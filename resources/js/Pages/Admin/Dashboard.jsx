import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const METRIC_CARDS = [
    { key: 'total_users',              label: 'Students',               icon: '👤', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'total_content_creator',              label: 'Content Creators',       icon: '✏️', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'total_teachers',           label: 'Teachers',               icon: '🎓', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { key: 'pending_teachers',         label: 'Pending Teachers',       icon: '⏳', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'total_certifications',     label: 'Total Shells',           icon: '🐚', color: 'bg-stone-50 text-stone-700 border-stone-200' },
    { key: 'pending_certifications',   label: 'Pending Approval',       icon: '📝', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { key: 'published_certifications', label: 'Published',              icon: '✅', color: 'bg-green-50 text-green-700 border-green-200' },
    { key: 'declined_certifications',  label: 'Declined',               icon: '❌', color: 'bg-red-50 text-red-700 border-red-200' },
];

export default function Dashboard({ metrics, recent_certifications, recent_users }) {

    function formatDate(d) {
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function statusBadge(status) {
        const map = {
            active:               'bg-green-100 text-green-700',
            inactive:             'bg-red-100 text-red-700',
            pending_verification: 'bg-amber-100 text-amber-700',
            pending_approval:     'bg-amber-100 text-amber-700',
            published:            'bg-green-100 text-green-700',
            declined:             'bg-red-100 text-red-700',
            draft:                'bg-stone-100 text-stone-600',
        };
        return map[status] || 'bg-stone-100 text-stone-600';
    }

    return (
        <AdminLayout pageTitle="Dashboard">
            <Head title="Admin Dashboard" />

            {/* ── Metric Cards ──────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                {METRIC_CARDS.map((card) => (
                    <div key={card.key} className={`rounded-2xl border p-5 ${card.color}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl">{card.icon}</span>
                            <span className="text-2xl font-bold">{metrics[card.key] ?? 0}</span>
                        </div>
                        <p className="text-sm font-medium mt-2 opacity-80">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* ── Recent Users ───────────────── */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-stone-100">
                        <h3 className="font-bold text-stone-900">Recent Users</h3>
                    </div>
                    <div className="divide-y divide-stone-100">
                        {recent_users.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-stone-400 text-center">No users yet.</p>
                        ) : (
                            recent_users.map((u) => (
                                <div key={u.id} className="px-6 py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-stone-900">
                                            {u.first_name} {u.last_name}
                                        </p>
                                        <p className="text-xs text-stone-400">{u.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(u.status)}`}>
                                            {u.status}
                                        </span>
                                        <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                                            {u.role}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ── Recent Certifications ──────── */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-stone-100">
                        <h3 className="font-bold text-stone-900">Recent Shells</h3>
                    </div>
                    <div className="divide-y divide-stone-100">
                        {recent_certifications.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-stone-400 text-center">No certifications yet.</p>
                        ) : (
                            recent_certifications.map((c) => (
                                <div key={c.id} className="px-6 py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-stone-900">{c.title}</p>
                                        <p className="text-xs text-stone-400">
                                            by {c.creator ? `${c.creator.first_name} ${c.creator.last_name}` : 'Unknown'}
                                            {' · '}{formatDate(c.created_at)}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(c.status)}`}>
                                        {c.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
