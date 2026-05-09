import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Edit({ auth, certification }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Shell" />
            <div className="py-12"><div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <h1>Edit {certification.title}</h1>
                <p>Status: {certification.status}</p>
                <button onClick={() => router.post(route('creator.certifications.submit', certification.id))}>
                    Submit for Approval
                </button>
            </div></div>
        </AuthenticatedLayout>
    );
}

