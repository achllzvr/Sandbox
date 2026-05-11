import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CertificationsIndex({ certifications }) {

    function statusBadge(status) {
        const map = {
            pending_approval: 'bg-amber-100 text-amber-700',
            published:        'bg-green-100 text-green-700',
            declined:         'bg-red-100 text-red-700',
            draft:            'bg-stone-100 text-stone-600',
        };
        return map[status] || 'bg-stone-100 text-stone-600';
    }

    function handleAction(certId, status, reason = null) {
        const data = { status };
        if (reason) data.decline_reason = reason;

        router.put(route('admin.certifications.status.update', certId), data);
    }

    function handleDecline(certId) {
        const reason = prompt('Reason for declining (optional):');
        handleAction(certId, 'declined', reason);
    }

    return (
        <AdminLayout pageTitle="Certification Approval">
            <Head title="Certification Approval" />

            <div className="mt-2 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-stone-100 bg-stone-50">
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Title</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Creator</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Status</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Date</th>
                            <th className="text-right px-6 py-3 font-semibold text-stone-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {certifications.map(c => (
                            <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                                <td className="px-6 py-3">
                                    <p className="font-medium text-stone-900">{c.title}</p>
                                    <p className="text-xs text-stone-400 line-clamp-1">{c.description}</p>
                                </td>
                                <td className="px-6 py-3 text-stone-500">
                                    {c.creator ? `${c.creator.first_name} ${c.creator.last_name}` : '—'}
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusBadge(c.status)}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-stone-400">
                                    {new Date(c.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-3 text-right">
                                    {c.status === 'pending_approval' && (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleAction(c.id, 'published')}
                                                className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                                                Publish
                                            </button>
                                            <button onClick={() => handleDecline(c.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                    {c.status === 'declined' && c.decline_reason && (
                                        <span className="text-xs text-red-400 italic">"{c.decline_reason}"</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {certifications.length === 0 && (
                    <p className="text-center py-12 text-stone-400 text-sm">No certifications found.</p>
                )}
            </div>
        </AdminLayout>
    );
}
