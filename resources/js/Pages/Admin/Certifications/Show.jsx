import { Head, router, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Show({ certification }) {
    const [action, setAction] = useState(null); // 'deny' or 'revise'
    const form = useForm({
        status: '',
        decline_reason: '',
        remarks: ''
    });

    const handleApprove = () => {
        if (confirm('Approve and publish this certification?')) {
            router.put(route('admin.certifications.status.update', certification.id), { status: 'approved' });
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (action === 'deny') {
            form.put(route('admin.certifications.status.update', certification.id), {
                onSuccess: () => setAction(null)
            });
        } else if (action === 'revise') {
            form.put(route('admin.certifications.request_revision', certification.id), {
                onSuccess: () => setAction(null)
            });
        }
    };

    return (
        <AdminLayout pageTitle="Certification Review Detail">
            <Head title={`Review: ${certification.title}`} />
            
            <div className="mb-4">
                <Link href={route('admin.certifications.index')} className="text-blue-600 hover:underline">
                    &larr; Back to Requests
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900">{certification.title}</h1>
                        <p className="text-stone-500 mt-1">By {certification.creator?.first_name} {certification.creator?.last_name}</p>
                        <div className="flex gap-2 mt-3">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">{certification.category}</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">{certification.difficulty}</span>
                            <span className="px-3 py-1 bg-amber-100 rounded-full text-xs font-bold text-amber-700 uppercase">{certification.status.replace('_', ' ')}</span>
                        </div>
                    </div>
                    
                    {certification.status === 'pending_review' && (
                        <div className="flex gap-3">
                            <button onClick={handleApprove} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm">
                                Approve & Publish
                            </button>
                            <button onClick={() => { setAction('revise'); form.setData('status', 'revision_required'); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-sm">
                                Request Revision
                            </button>
                            <button onClick={() => { setAction('deny'); form.setData('status', 'denied'); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm">
                                Deny
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-2">Description</h3>
                    <p className="text-stone-700 whitespace-pre-wrap">{certification.description}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
                <h3 className="text-lg font-bold mb-4">Attached Learning Materials ({certification.learning_materials_count})</h3>
                
                {certification.learning_materials?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {certification.learning_materials.map(mat => (
                            <div key={mat.id} className="border border-stone-200 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg font-bold text-xs uppercase">
                                        {mat.type === 'youtube_video' ? 'YT' : mat.type}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{mat.title}</h4>
                                        <p className="text-xs text-gray-500">{mat.description}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-stone-100">
                                    {mat.type === 'youtube_video' ? (
                                        <a href={mat.youtube_embed_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-bold hover:underline">
                                            Preview Video ↗
                                        </a>
                                    ) : (
                                        <a href={`/storage/${mat.file_path}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-bold hover:underline">
                                            View / Download File ↗
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No materials attached.</p>
                )}
            </div>

            {/* Modal for Revise/Deny */}
            {action && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-2 text-stone-900">
                            {action === 'deny' ? 'Deny Certification' : 'Request Revision'}
                        </h2>
                        <p className="text-sm text-stone-500 mb-4">
                            {action === 'deny' 
                                ? 'Provide a reason for denying this certification. This will be shown to the creator.'
                                : 'Explain what the creator needs to change before resubmitting.'}
                        </p>
                        
                        <form onSubmit={submitForm}>
                            {action === 'deny' ? (
                                <textarea
                                    className="w-full rounded-xl border-stone-300 focus:border-red-500 focus:ring-red-500"
                                    rows="4"
                                    required
                                    value={form.data.decline_reason}
                                    onChange={e => form.setData('decline_reason', e.target.value)}
                                    placeholder="Reason for denial..."
                                />
                            ) : (
                                <textarea
                                    className="w-full rounded-xl border-stone-300 focus:border-orange-500 focus:ring-orange-500"
                                    rows="4"
                                    required
                                    value={form.data.remarks}
                                    onChange={e => form.setData('remarks', e.target.value)}
                                    placeholder="Revision remarks..."
                                />
                            )}
                            
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setAction(null)} className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100">
                                    Cancel
                                </button>
                                <button type="submit" disabled={form.processing} className={`px-4 py-2 rounded-lg text-white font-bold ${action === 'deny' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}`}>
                                    {form.processing ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
