import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import TeacherBatchAnalytics from '@/Components/Teacher/TeacherBatchAnalytics';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Batch({ certification, analytics, isMock = false }) {
    const batchTitle = analytics?.batch_label ?? 'MAY 11, 2026';

    return (
        <TeacherLayout activeNav="shells" layoutMode="select">
            <Head title={`Batch ${batchTitle} Data`} />

            <div className="teacher-batch-page">
                <Link href={route('teacher.shells.show', certification.id)} className="teacher-batch-page__back" aria-label="Back to shell data">
                    <ArrowLeft size={20} strokeWidth={2.25} aria-hidden="true" />
                </Link>

                <header className="teacher-batch-page__header">
                    <h2 className="teacher-batch-page__title">Batch &apos;{batchTitle}&apos; Data</h2>
                    {isMock ? <p className="student-page-subtitle">Sample cohort analytics — TODO[backend] wire to progress tables.</p> : null}
                </header>

                <TeacherBatchAnalytics analytics={analytics} />
            </div>
        </TeacherLayout>
    );
}
