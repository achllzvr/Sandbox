import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminAppearanceSettings from '@/Components/Admin/AdminAppearanceSettings';
import CreatorLayout from '@/Layouts/CreatorLayout';
import TeacherLayout from '@/Layouts/TeacherLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const role = auth.user?.role;
    const isAdmin = role === 'admin';
    const isTeacher = role === 'teacher';
    const isCreator = role === 'content_creator';

    if (isAdmin) {
        return (
            <AdminLayout pageTitle="Profile settings">
                <Head title="Profile settings" />
                <div className="admin-profile-stack">
                    <div className="admin-card admin-card--chunky admin-profile-card">
                        <AdminAppearanceSettings />
                    </div>
                    <div className="admin-card admin-card--chunky admin-profile-card">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                            variant="admin"
                        />
                    </div>
                    <div className="admin-card admin-card--chunky admin-profile-card">
                        <UpdatePasswordForm className="max-w-xl" variant="admin" />
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (isTeacher) {
        return (
            <TeacherLayout>
                <Head title="Account settings" />
                <div className="teacher-profile-page">
                    <Link href={route('teacher.dashboard')} className="teacher-profile-page__back" aria-label="Back to dashboard">
                        <ArrowLeft size={20} strokeWidth={2.25} aria-hidden="true" />
                    </Link>
                    <header className="student-home-header">
                        <h2 className="student-page-title">Account settings</h2>
                        <p className="student-page-subtitle">Update your profile and password.</p>
                    </header>
                    <div className="teacher-profile-page__stack">
                        <article className="teacher-card">
                            <div className="teacher-card__body">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                    variant="teacher"
                                />
                            </div>
                        </article>
                        <article className="teacher-card">
                            <div className="teacher-card__body">
                                <UpdatePasswordForm className="max-w-xl" variant="teacher" />
                            </div>
                        </article>
                    </div>
                </div>
            </TeacherLayout>
        );
    }

    if (isCreator) {
        return (
            <CreatorLayout pageTitle="Profile settings">
                <Head title="Profile settings" />
                <div className="admin-profile-stack">
                    <div className="admin-card admin-card--chunky admin-profile-card">
                        <AdminAppearanceSettings />
                    </div>
                    <div className="admin-card admin-card--chunky admin-profile-card">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                            variant="admin"
                        />
                    </div>
                    <div className="admin-card admin-card--chunky admin-profile-card">
                        <UpdatePasswordForm className="max-w-xl" variant="admin" />
                    </div>
                </div>
            </CreatorLayout>
        );
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
