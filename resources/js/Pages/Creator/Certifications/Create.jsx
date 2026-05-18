import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        estimated_duration: '',
        learning_objectives: '',
        prerequisites: '',
        tags: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('creator.certifications.store'));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Request New Certification" />
            
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-bold mb-6">Start a New Certification Request</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={data.title} 
                                        onChange={e => setData('title', e.target.value)} 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required 
                                    />
                                    {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                                </div>

                                {/* Category & Difficulty */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                                        <select 
                                            value={data.category} 
                                            onChange={e => setData('category', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Business">Business</option>
                                            <option value="Design">Design</option>
                                            <option value="Marketing">Marketing</option>
                                        </select>
                                        {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Difficulty <span className="text-red-500">*</span></label>
                                        <select 
                                            value={data.difficulty} 
                                            onChange={e => setData('difficulty', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                        {errors.difficulty && <div className="text-red-500 text-sm mt-1">{errors.difficulty}</div>}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                                    <textarea 
                                        rows="4"
                                        value={data.description} 
                                        onChange={e => setData('description', e.target.value)} 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required 
                                    />
                                    {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                                </div>
                                
                                {/* Estimated Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estimated Duration (e.g. "4 weeks", "10 hours")</label>
                                    <input 
                                        type="text" 
                                        value={data.estimated_duration} 
                                        onChange={e => setData('estimated_duration', e.target.value)} 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                
                                {/* Learning Objectives */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Learning Objectives</label>
                                    <textarea 
                                        rows="3"
                                        value={data.learning_objectives} 
                                        onChange={e => setData('learning_objectives', e.target.value)} 
                                        placeholder="What will students learn?"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-8">
                                    <Link href={route('creator.dashboard')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                        Cancel
                                    </Link>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-bold"
                                    >
                                        Save & Continue to Materials
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
