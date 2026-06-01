import { Head } from '@inertiajs/react';
import TeacherShellCard from '@/Components/Teacher/TeacherShellCard';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Index({ shells = [], isMock = false }) {
    return (
        <TeacherLayout activeNav="shells" layoutMode="select">
            <Head title="My Shells" />

            <div className="teacher-shells-page">
                <header className="student-home-header">
                    <h2 className="student-page-title">My Shells</h2>
                    <p className="student-page-subtitle">
                        {isMock
                            ? 'Shells with purchased voucher batches. Open one to manage vouchers and view batch data.'
                            : 'Shells you have purchased voucher batches for.'}
                    </p>
                </header>

                {shells.length > 0 ? (
                    <div className="student-shells-grid student-stagger">
                        {shells.map((shell, index) => (
                            <TeacherShellCard key={shell.id} shell={shell} index={index} style={{ '--student-stagger': index }} />
                        ))}
                    </div>
                ) : (
                    <div className="student-empty student-fade-in-up">
                        <p className="student-empty__title">No purchased shells yet</p>
                        <p className="student-page-subtitle">Buy a voucher batch from the shop to get started.</p>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
