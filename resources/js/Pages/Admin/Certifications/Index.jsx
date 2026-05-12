import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useMemo, useState } from 'react';

export default function CertificationsIndex({ certifications }) {
    const [selectedCert, setSelectedCert] = useState(null);
    const declineForm = useForm({
        status: 'declined',
        decline_reason: '',
    });

    function statusBadge(status) {
        const map = {
            pending_approval: 'bg-amber-100 text-amber-700',
            published:        'bg-green-100 text-green-700',
            declined:         'bg-red-100 text-red-700',
            draft:            'bg-stone-100 text-stone-600',
        };
        return map[status] || 'bg-stone-100 text-stone-600';
    }

    const pendingCount = useMemo(
        () => certifications.filter(c => c.status === 'pending_approval').length,
        [certifications]
    );

    function handlePublish(certId) {
        router.put(route('admin.certifications.status.update', certId), { status: 'published' });
    }

    function openDeclineModal(certification) {
        setSelectedCert(certification);
        declineForm.setData('decline_reason', '');
        declineForm.clearErrors();
    }

    function closeDeclineModal() {
        if (declineForm.processing) return;
        setSelectedCert(null);
    }

    function submitDecline() {
        if (!selectedCert) return;
        declineForm.put(route('admin.certifications.status.update', selectedCert.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedCert(null);
                declineForm.reset();
            },
        });
    }

    return (
        <AdminLayout pageTitle="Certification Approval">
            <Head title="Certification Approval" />
            <div className="mt-2 mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Pending for review: <span className="font-semibold">{pendingCount}</span>
            </div>

            <div className="mt-2 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-stone-100 bg-stone-50">
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Title</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Creator</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Content Check</th>
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
                                <td className="px-6 py-3 text-xs text-stone-500">
                                    <div>Sandboxes: {c.lessons_count}</div>
                                    <div>Modules: {c.modules_count}</div>
                                    <div>Content: {c.contents_count}</div>
                                    <div>Questions: {c.questions_count}</div>
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
                                            <button onClick={() => handlePublish(c.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                                                Publish
                                            </button>
                                            <button onClick={() => openDeclineModal(c)}
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

            {selectedCert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-stone-900">Decline Shell</h2>
                        <p className="mt-1 text-sm text-stone-500">
                            Provide feedback for <span className="font-medium">{selectedCert.title}</span>.
                        </p>
                        <textarea
                            className="mt-4 w-full rounded-xl border border-stone-300 p-3 text-sm focus:border-amber-400 focus:ring-amber-400"
                            rows={5}
                            placeholder="Explain what must be fixed before resubmission."
                            value={declineForm.data.decline_reason}
                            onChange={(e) => declineForm.setData('decline_reason', e.target.value)}
                        />
                        {declineForm.errors.decline_reason && (
                            <p className="mt-2 text-xs text-red-600">{declineForm.errors.decline_reason}</p>
                        )}
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={closeDeclineModal}
                                className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitDecline}
                                disabled={declineForm.processing}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                            >
                                {declineForm.processing ? 'Submitting...' : 'Decline with Feedback'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
