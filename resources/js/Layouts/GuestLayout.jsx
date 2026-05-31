import AuthLayout from '@/Layouts/AuthLayout';

/** @deprecated Use AuthLayout directly */
export default function GuestLayout({ children, title, subtitle }) {
    return (
        <AuthLayout title={title} subtitle={subtitle} showBack={false}>
            {children}
        </AuthLayout>
    );
}
