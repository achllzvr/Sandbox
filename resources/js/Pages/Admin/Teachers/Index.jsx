import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function TeachersIndex({ teachers }) {

    function statusBadge(status) {
        const map = {
            pending_verification: 'bg-amber-100 text-amber-700',
            active:               'bg-green-100 text-green-700',
            inactive:             'bg-red-100 text-red-700',
        };
        return map[status] || 'bg-stone-100 text-stone-600';
    }

    return (
        <AdminLayout pageTitle="Teacher Verification">
            <Head title="Teacher Verification" />

            <div className="mt-2 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-stone-100 bg-stone-50">
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Name</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Email</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Affiliation</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Credentials</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Status</th>
                            <th className="text-right px-6 py-3 font-semibold text-stone-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {teachers.data.map(t => (
                            <tr key={t.id} className="hover:bg-stone-50 transition-colors">
                                <td className="px-6 py-3 font-medium text-stone-900">{t.first_name} {t.last_name}</td>
                                <td className="px-6 py-3 text-stone-500">{t.email}</td>
                                <td className="px-6 py-3 text-stone-500">{t.affiliation || '—'}</td>
                                <td className="px-6 py-3">
                                    {t.institutional_credentials_url ? (
                                        <a href={`/storage/${t.institutional_credentials_url}`} target="_blank" rel="noopener noreferrer"
                                            className="text-amber-600 hover:text-amber-800 text-xs font-medium underline">
                                            View file
                                        </a>
                                    ) : <span className="text-stone-400 text-xs">None</span>}
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusBadge(t.status)}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    {t.status === 'pending_verification' && (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => router.put(route('admin.teachers.approve', t.id))}
                                                className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                                                Approve
                                            </button>
                                            <button onClick={() => router.put(route('admin.teachers.decline', t.id))}
                                                className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                    {t.status === 'active' && t.verified_at && (
                                        <span className="text-xs text-green-600">
                                            Verified {new Date(t.verified_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {teachers.data.length === 0 && (
                    <p className="text-center py-12 text-stone-400 text-sm">No teacher accounts found.</p>
                )}
            </div>
        </AdminLayout>
    );
}
