import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, usePage } from '@inertiajs/react';

// TODO[backend]: ProfileController@update is a stub — persist name/email to users table (map name → first_name/last_name/full_name).
// TODO[backend]: password.update route/handler not registered — wire UpdatePasswordForm to a real password change endpoint for admins.

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.role === 'admin';

    if (isAdmin) {
        return (
            <AdminLayout pageTitle="Profile settings">
                <Head title="Profile settings" />
                <div className="admin-profile-stack">
                    {/* Profile information — form submits to profile.update (stub controller) */}
                    <div className="admin-card admin-card--chunky admin-profile-card">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                            variant="admin"
                        />
                    </div>
                    {/* Password change — TODO[backend]: route password.update not wired */}
                    <div className="admin-card admin-card--chunky admin-profile-card">
                        <UpdatePasswordForm className="max-w-xl" variant="admin" />
                    </div>
                </div>
            </AdminLayout>
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
