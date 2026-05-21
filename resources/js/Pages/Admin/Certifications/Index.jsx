import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useMemo } from 'react';

export default function CertificationsIndex({ certifications }) {
    function statusBadge(status) {
        const map = {
            pending_review: 'bg-amber-100 text-amber-700',
            revision_required: 'bg-orange-100 text-orange-700',
            approved: 'bg-blue-100 text-blue-700',
            published: 'bg-green-100 text-green-700',
            denied: 'bg-red-100 text-red-700',
            draft: 'bg-stone-100 text-stone-600',
        };
        return map[status] || 'bg-stone-100 text-stone-600';
    }

    const pendingCount = useMemo(
        () => certifications.filter(c => c.status === 'pending_review').length,
        [certifications]
    );

    return (
        <AdminLayout pageTitle="Certification Approval">
            <Head title="Certification Approval" />
            <div className="mt-2 mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex justify-between items-center">
                <div>Pending for review: <span className="font-semibold">{pendingCount}</span></div>
            </div>

            <div className="mt-2 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-stone-100 bg-stone-50">
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Title</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Creator</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Details</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Materials</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Status</th>
                            <th className="text-left px-6 py-3 font-semibold text-stone-500">Submitted</th>
                            <th className="text-right px-6 py-3 font-semibold text-stone-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {certifications.map(c => (
                            <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                                <td className="px-6 py-3">
                                    <p className="font-medium text-stone-900 line-clamp-1">{c.title}</p>
                                    <p className="text-xs text-stone-400">{c.category} • {c.difficulty}</p>
                                </td>
                                <td className="px-6 py-3 text-stone-500">
                                    {c.creator ? `${c.creator.first_name} ${c.creator.last_name}` : '—'}
                                </td>
                                <td className="px-6 py-3 text-xs text-stone-500">
                                    <div>Quiz: {c.quiz_questions_count} Qs</div>
                                    <div>Exam: {c.exam_questions_count} Qs</div>
                                </td>
                                <td className="px-6 py-3 text-stone-500 text-center font-semibold">
                                    {c.learning_materials_count}
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusBadge(c.status)}`}>
                                        {c.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-stone-400">
                                    {c.submitted_at ? new Date(c.submitted_at).toLocaleDateString() : '—'}
                                </td>
                                <td className="px-6 py-3 text-right">
                                    {/* Usually we'd route to a detailed show page. For now, since we only have index, let's pretend we have a show page or just implement actions inline. Wait, prompt requested Certification review detail page. I need to make a show page route. */}
                                    <Link href={`/admin/certifications/${c.id}`} className="text-blue-600 hover:text-blue-800 font-bold px-3 py-1 bg-blue-50 rounded-md">
                                        Review
                                    </Link>
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
