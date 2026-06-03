/**
 * Teacher dashboard — live voucher metrics and recent claims.
 */
import { Head, Link } from '@inertiajs/react';
import TeacherClaimLogsPanel from '@/Components/Teacher/TeacherClaimLogsPanel';
import TeacherMetricCards from '@/Components/Teacher/TeacherMetricCards';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Dashboard({ metrics, claimLogs = [] }) {
    return (
        <TeacherLayout activeNav="dashboard">
            <Head title="Dashboard" />

            <div className="teacher-dashboard">
                <header className="student-home-header">
                    <div className="teacher-dashboard__header-row">
                        <div>
                            <h2 className="student-page-title">Dashboard</h2>
                            <p className="student-page-subtitle">Overview of your voucher distribution and cohort activity.</p>
                        </div>
                        <Link href={route('teacher.purchasing')} className="student-btn student-btn--primary">
                            Buy vouchers
                        </Link>
                    </div>
                </header>

                <TeacherMetricCards metrics={metrics} />
                <TeacherClaimLogsPanel claimLogs={claimLogs} />
            </div>
        </TeacherLayout>
    );
}
