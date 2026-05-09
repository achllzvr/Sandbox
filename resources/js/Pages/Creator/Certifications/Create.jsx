import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post } = useForm({ title: '', description: '' });
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Shell" />
            <div className="py-12"><div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <form onSubmit={e => { e.preventDefault(); post(route('creator.certifications.store')); }}>
                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Title" />
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Description" />
                    <button type="submit">Save</button>
                </form>
            </div></div>
        </AuthenticatedLayout>
    );
}

