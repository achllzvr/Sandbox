/**
 * Teacher My Shells — purchased voucher batches (live cohort + voucher data).
 */
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import TeacherPurchaseHistoryModal from '@/Components/Teacher/TeacherPurchaseHistoryModal';
import TeacherShellCard from '@/Components/Teacher/TeacherShellCard';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Index({ shells = [], purchaseHistory = [], isMock = false }) {
    const [historyOpen, setHistoryOpen] = useState(false);

    return (
        <TeacherLayout activeNav="shells" layoutMode="select">
            <Head title="My Shells" />

            <div className="teacher-shells-page">
                <header className="teacher-shells-page__header student-home-header">
                    <div className="teacher-shells-page__header-main">
                        <h2 className="student-page-title">My Shells</h2>
                        <p className="student-page-subtitle">
                            {isMock
                                ? 'Shells with purchased voucher batches. Open one to manage vouchers and view batch data.'
                                : 'Shells you have purchased voucher batches for.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="teacher-shell-landing__history-btn"
                        onClick={() => setHistoryOpen(true)}
                    >
                        Purchase history
                    </button>
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

            <TeacherPurchaseHistoryModal
                show={historyOpen}
                onClose={() => setHistoryOpen(false)}
                title="Purchase history"
                transactions={purchaseHistory}
                isMock={isMock}
            />
        </TeacherLayout>
    );
}
