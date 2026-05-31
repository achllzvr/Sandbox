import { Head, Link } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Button } from '@/Components';

export default function PasswordResetSuccess() {
    return (
        <>
            <Head title="New Password Set — Sandbox" />
            <AuthLayout title="New Password Set!" showBack={false} showFooter={false} centered>
                <Link href={route('login')} className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }}>
                    Proceed to Login
                </Link>
            </AuthLayout>
        </>
    );
}
