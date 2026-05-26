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

    const getCalculatedDate = (hoursStr) => {
        const hours = parseFloat(hoursStr);
        if (isNaN(hours) || hours <= 0) return '';
        const date = new Date();
        date.setHours(date.getHours() + hours);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const getDurationBreakdown = (hoursStr) => {
        const totalHours = parseInt(hoursStr, 10);
        if (isNaN(totalHours) || totalHours <= 0) return '= 0 months, 0 weeks, 0 days';
        
        let hours = totalHours;
        const months = Math.floor(hours / 720);
        hours %= 720;
        
        const weeks = Math.floor(hours / 168);
        hours %= 168;
        
        const days = Math.floor(hours / 24);
        
        return `= ${months} months, ${weeks} weeks, ${days} days`;
    };

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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Estimated Time{data.estimated_duration ? ` - ${data.estimated_duration}hrs` : ''}
                                        </label>
                                        <div className="relative mt-1 rounded-md shadow-sm">
                                            <input 
                                                type="number" 
                                                min="0"
                                                placeholder="e.g. 48"
                                                value={data.estimated_duration} 
                                                onChange={e => setData('estimated_duration', e.target.value)} 
                                                className="block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <span className="text-gray-400 sm:text-sm font-medium">hrs</span>
                                            </div>
                                        </div>
                                        {errors.estimated_duration && <div className="text-red-500 text-sm mt-1">{errors.estimated_duration}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Time Conversion</label>
                                        <div className="mt-1 flex items-center h-[38px] px-3 rounded-md border border-gray-300 bg-gray-50 text-gray-900 text-sm shadow-sm">
                                            <svg className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="truncate">
                                                {data.estimated_duration && getDurationBreakdown(data.estimated_duration) ? (
                                                    <span className="text-indigo-600 font-semibold">{getDurationBreakdown(data.estimated_duration)}</span>
                                                ) : (
                                                    <span className="text-gray-400 italic">Enter hours to calculate conversion</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
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
