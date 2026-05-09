import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Marketplace({ auth, certifications }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Marketplace" />
            <div className="py-12"><div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <h1>Marketplace</h1>
                <div className="grid grid-cols-3 gap-4">
                    {certifications.map(c => (
                        <div key={c.id} className="border p-4">
                            <h2>{c.title}</h2>
                            <p>By: {c.creator?.name}</p>
                        </div>
                    ))}
                </div>
            </div></div>
        </AuthenticatedLayout>
    );
}

