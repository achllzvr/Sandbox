import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, certifications }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="My Shells" />
            <div className="py-12"><div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between">
                    <h1>My Shells</h1>
                    <Link href={route('creator.certifications.create')}>Create New</Link>
                </div>
                <ul>
                    {certifications.map(cert => <li key={cert.id}><Link href={route('creator.certifications.edit', cert.id)}>{cert.title} - {cert.status}</Link></li>)}
                </ul>
            </div></div>
        </AuthenticatedLayout>
    );
}

