import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';

export default function Edit({ auth, certification }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        type: 'ppt',
        file: null,
        youtube_embed_url: '',
        description: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitMaterial = (e) => {
        e.preventDefault();
        post(route('creator.certifications.materials.store', certification.id), {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    };

    const removeMaterial = (materialId) => {
        if(confirm('Remove this material?')) {
            router.delete(route('creator.certifications.materials.destroy', [certification.id, materialId]), {
                preserveScroll: true
            });
        }
    };

    const submitForReview = () => {
        if(confirm('Submit this certification for Admin review? You cannot edit it while it is pending.')) {
            setIsSubmitting(true);
            router.post(route('creator.certifications.submit', certification.id), {}, {
                onFinish: () => setIsSubmitting(false)
            });
        }
    };

    const isEditable = ['draft', 'revision_required'].includes(certification.status);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Edit ${certification.title}`} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Status Banner */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 flex justify-between items-center border-l-4 border-blue-500">
                        <div>
                            <h2 className="text-xl font-bold">{certification.title}</h2>
                            <p className="text-sm text-gray-500">Status: <span className="uppercase font-bold">{certification.status.replace('_', ' ')}</span></p>
                            
                            {certification.status === 'revision_required' && certification.remarks && (
                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <p className="font-bold text-yellow-800">Admin Remarks for Revision:</p>
                                    <p className="text-yellow-700 mt-1">{certification.remarks}</p>
                                </div>
                            )}
                            
                            {certification.status === 'denied' && certification.decline_reason && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="font-bold text-red-800">Reason for Denial:</p>
                                    <p className="text-red-700 mt-1">{certification.decline_reason}</p>
                                </div>
                            )}
                        </div>
                        
                        {isEditable && (
                            <button 
                                onClick={submitForReview}
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold shadow-sm disabled:opacity-50"
                            >
                                Submit for Review
                            </button>
                        )}
                    </div>

                    {/* Learning Materials Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* List of Materials */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold mb-4">Attached Learning Materials</h3>
                            
                            {certification.learning_materials && certification.learning_materials.length > 0 ? (
                                <div className="space-y-4">
                                    {certification.learning_materials.map((mat) => (
                                        <div key={mat.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg font-bold uppercase text-xs">
                                                    {mat.type === 'youtube_video' ? 'YT' : mat.type}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{mat.title}</h4>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{mat.description}</p>
                                                </div>
                                            </div>
                                            {isEditable && (
                                                <button onClick={() => removeMaterial(mat.id)} className="text-red-500 hover:text-red-700 p-2">
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic text-center py-8">No materials attached yet. You must attach at least one to submit.</p>
                            )}
                        </div>

                        {/* Add Material Form */}
                        {isEditable && (
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 h-fit">
                                <h3 className="text-lg font-bold mb-4">Add New Material</h3>
                                
                                <form onSubmit={submitMaterial} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Material Type</label>
                                        <select 
                                            value={data.type} 
                                            onChange={e => setData('type', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="ppt">PowerPoint (PPT/PPTX)</option>
                                            <option value="document">Document (PDF/DOC)</option>
                                            <option value="youtube_video">YouTube Embed Video</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input 
                                            type="text" 
                                            value={data.title} 
                                            onChange={e => setData('title', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required 
                                        />
                                        {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                                    </div>

                                    {data.type === 'youtube_video' ? (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">YouTube Embed URL</label>
                                            <input 
                                                type="url" 
                                                value={data.youtube_embed_url} 
                                                onChange={e => setData('youtube_embed_url', e.target.value)}
                                                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required 
                                            />
                                            {errors.youtube_embed_url && <div className="text-red-500 text-xs mt-1">{errors.youtube_embed_url}</div>}
                                            <p className="text-xs text-gray-500 mt-1">Must be an embed format url.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">File Upload</label>
                                            <input 
                                                type="file" 
                                                onChange={e => setData('file', e.target.files[0])}
                                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                required 
                                            />
                                            {errors.file && <div className="text-red-500 text-xs mt-1">{errors.file}</div>}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Short Description</label>
                                        <textarea 
                                            rows="2"
                                            value={data.description} 
                                            onChange={e => setData('description', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-bold disabled:opacity-50 mt-4"
                                    >
                                        Attach Material
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
