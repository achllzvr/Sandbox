/**
 * Teacher dashboard — affiliate metrics and recent voucher claims.
 *
 * WIRED (UI + mock):
 * - Metric cards, claim logs from TeacherDashboardMockData
 *
 * TODO[backend]: Real aggregates from cohort_students, vouchers, enrollments.
 */
import { Head } from '@inertiajs/react';
import TeacherClaimLogsPanel from '@/Components/Teacher/TeacherClaimLogsPanel';
import TeacherMetricCards from '@/Components/Teacher/TeacherMetricCards';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Dashboard({ metrics, claimLogs = [], isMock = false }) {
    return (
        <TeacherLayout activeNav="dashboard">
            <Head title="Dashboard" />

            <div className="teacher-dashboard">
                <header className="student-home-header">
                    <h2 className="student-page-title">Dashboard</h2>
                    {isMock ? <p className="student-page-subtitle">Sample affiliate metrics and recent voucher claims.</p> : null}
                </header>

                <TeacherMetricCards metrics={metrics} />
                <TeacherClaimLogsPanel claimLogs={claimLogs} />
            </div>
        </TeacherLayout>
    );
}
