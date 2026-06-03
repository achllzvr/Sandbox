/**
 * Teacher batch analytics — cohort progress for one voucher batch.
 */
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import TeacherBatchAnalytics from '@/Components/Teacher/TeacherBatchAnalytics';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { resolveShopTheme } from '@/utils/shellThemes';

export default function Batch({ certification, analytics }) {
    const batchTitle = analytics?.batch_label ?? 'MAY 11, 2026';
    const { className: theme, style: themeStyle } = resolveShopTheme(certification, certification.id - 1);

    return (
        <TeacherLayout activeNav="shells" layoutMode="select">
            <Head title={`Batch ${batchTitle} Data`} />

            <div
                className={`teacher-select-page teacher-batch-page teacher-batch-page--themed student-shop-shell-page--${theme} student-fade-in-up`}
                style={themeStyle}
            >
                <Link href={route('teacher.shells.show', certification.id)} className="teacher-batch-page__back" aria-label="Back to shell data">
                    <ArrowLeft size={20} strokeWidth={2.25} aria-hidden="true" />
                </Link>

                <header className="student-home-header">
                    <h2 className="student-page-title">Batch &apos;{batchTitle}&apos; Data</h2>
                </header>

                <TeacherBatchAnalytics analytics={analytics} />
            </div>
        </TeacherLayout>
    );
}
