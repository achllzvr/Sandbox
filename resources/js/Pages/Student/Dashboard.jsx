import { Head, Link, router } from '@inertiajs/react';
import StudentShellCard from '@/Components/Student/StudentShellCard';
import StudentShellMap from '@/Components/Student/StudentShellMap';
import StudentLayout from '@/Layouts/StudentLayout';

export default function Dashboard({
    myShells = [],
    selectMode = false,
    certification = null,
    progress = null,
    shellMeta = null,
    defaultShellId = null,
}) {
    const selectHref = route('student.dashboard', { select: 1 });

    if (selectMode) {
        return (
            <StudentLayout activeNav="shells" layoutMode="select">
                <Head title="My Shells" />

                <div className="student-select-page">
                    <header className="student-home-header">
                        <h2 className="student-page-title">My Shells</h2>
                        <p className="student-page-subtitle">
                            Pick up where you left off, or choose a shell to open when you sign in.
                        </p>
                    </header>

                    {myShells.length > 0 ? (
                        <div className="student-shells-grid student-stagger">
                            {myShells.map((shell, index) => (
                                <StudentShellCard
                                    key={`${shell.id}-${index}`}
                                    shell={shell}
                                    index={index}
                                    style={{ '--student-stagger': index }}
                                    defaultShellId={defaultShellId}
                                    showDefaultAction
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="student-empty student-cast-empty student-fade-in-up student-fade-in-up--delay-1">
                            <p className="student-empty__title">No active shells yet</p>
                            <p className="student-page-subtitle">
                                Browse the shop to enroll in your first certification shell, or redeem a group voucher from
                                your teacher.
                            </p>
                            <Link
                                href={route('marketplace.index')}
                                className="student-btn student-btn--coral student-empty__cta"
                            >
                                Browse available shells
                            </Link>
                        </div>
                    )}
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout activeNav="shells" layoutMode="shell">
            <Head title={certification?.title ?? 'My Shells'} />

            {certification && progress ? (
                <StudentShellMap
                    certification={certification}
                    progress={progress}
                    shellMeta={shellMeta}
                    selectHref={selectHref}
                    onPlayModule={() => {
                        if (certification?.id) {
                            router.visit(route('student.shells.show', certification.id));
                        }
                    }}
                    onTakeFinalExam={() => {
                        if (certification?.id) {
                            router.visit(route('student.shells.show', certification.id));
                        }
                    }}
                />
            ) : (
                <div className="student-empty student-cast-empty student-fade-in-up">
                    <p className="student-empty__title">No active shells yet</p>
                    <p className="student-page-subtitle">
                        Browse the shop to enroll in your first certification shell, or redeem a group voucher from your
                        teacher.
                    </p>
                    <Link href={route('marketplace.index')} className="student-btn student-btn--coral student-empty__cta">
                        Browse available shells
                    </Link>
                    <Link href={selectHref} className="student-btn student-btn--ghost" style={{ marginTop: '0.75rem' }}>
                        My shells
                    </Link>
                </div>
            )}
        </StudentLayout>
    );
}
