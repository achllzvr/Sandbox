import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show() {
    const { certification, progress, auth } = usePage().props;

    return (
        <AuthenticatedLayout auth={auth} header={
            <div className="flex items-center gap-4">
                <Link
                    href={route('student.dashboard')}
                    className="bg-white border text-center border-stone-200 text-stone-500 hover:text-stone-700 hover:bg-stone-50 p-2.5 rounded-full transition-colors shadow-sm"
                    title="Back to Dashboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">{certification.title}</h2>
                    <p className="text-sm text-stone-500">{certification.creator ? certification.creator.first_name : 'Admin'}</p>
                </div>
            </div>
        }>
            <Head title={certification.title + ' — Shell'} />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold">Learning Map</h3>
                        <p className="text-sm text-stone-500">Progress: {progress.completed_modules}/{progress.total_modules}</p>
                    </div>

                    <div className="space-y-4">
                        {certification.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-start gap-4">
                                <div className="w-12 flex flex-col items-center">
                                    <div className="w-10 h-10 bg-amber-100 rounded-md flex items-center justify-center text-amber-700 font-bold">{lesson.title.charAt(0)}</div>
                                    <div className="h-full w-px bg-stone-200 mt-2"></div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-stone-800">{lesson.title}</h4>
                                    <p className="text-sm text-stone-500">{lesson.description || 'No description provided.'}</p>
                                    <div className="mt-2 flex gap-2">
                                        {lesson.modules.map((module) => (
                                            <Link key={module.id} href="#" className="px-3 py-1 bg-stone-100 rounded-full text-sm text-stone-600">{module.title}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
