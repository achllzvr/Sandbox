import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Pending({ auth, certifications }) {
    function updateStatus(id, status) {
        router.put(route('admin.certifications.status.update', id), { status: status, decline_reason: '' });
    }
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pending Shells" />
            <div className="py-12"><div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <h1>Pending Approvals</h1>
                <ul>
                    {certifications.map(c => (
                        <li key={c.id}>
                            {c.title} by {c.creator?.name}
                            <button onClick={() => updateStatus(c.id, 'published')}>Publish</button>
                            <button onClick={() => updateStatus(c.id, 'declined')}>Decline</button>
                        </li>
                    ))}
                </ul>
            </div></div>
        </AuthenticatedLayout>
    );
}

