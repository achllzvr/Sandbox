import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function TeacherPendingApproval() {
    return (
        <GuestLayout>
            <Head title="Pending Admin Approval" />

            <div className="text-center mb-8">
                <div className="text-6xl mb-4 text-green-500">✓</div>
                <h2 className="text-2xl font-bold text-stone-900">Email Verified!</h2>
                <div className="mt-6 text-stone-600 bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <p className="mb-2 font-medium">Thank you for confirming your email address.</p>
                    <p>
                        Your teacher registration form is currently <strong>on validation of the system admin</strong>. 
                        We will notify you once your account has been approved and you can log in.
                    </p>
                </div>
            </div>

            <div className="mt-8 text-center border-t border-stone-200 pt-6">
                <Link href={route('welcome')} className="text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors">
                    ← Return to Home
                </Link>
            </div>
        </GuestLayout>
    );
}
