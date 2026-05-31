import { Head, Link } from '@inertiajs/react';
import StudentShellCard from '@/Components/Student/StudentShellCard';
import StudentShellMap from '@/Components/Student/StudentShellMap';
import StudentLayout from '@/Layouts/StudentLayout';

export default function Dashboard({
    myShells = [],
    selectMode = false,
    certification = null,
    progress = null,
    shellMeta = null,
}) {
    const selectHref = route('student.dashboard', { select: 1 });

    if (selectMode) {
        return (
            <StudentLayout activeNav="shells" layoutMode="select">
                <Head title="My Shells" />

                <div className="student-select-page">
                    <header className="student-home-header">
                        <h2 className="student-page-title">My Shells</h2>
                        <p className="student-page-subtitle">Pick up where you left off in your sandboxes.</p>
                    </header>

                    {myShells.length > 0 ? (
                        <div className="student-shells-grid student-stagger">
                            {myShells.map((shell, index) => (
                                <StudentShellCard
                                    key={`${shell.id}-${index}`}
                                    shell={shell}
                                    index={index}
                                    style={{ '--student-stagger': index }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="student-empty student-fade-in-up student-fade-in-up--delay-1">
                            <p className="student-empty__title">No active shells yet</p>
                            <p className="student-page-subtitle">
                                Browse the shop to enroll in your first certification shell.
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
                        window.alert('Enroll in this shell from the shop to play sandboxes.');
                    }}
                    onTakeFinalExam={() => {
                        window.alert('Complete all sandboxes to unlock the final exam.');
                    }}
                />
            ) : (
                <div className="student-empty student-fade-in-up">
                    <p className="student-empty__title">No active shells yet</p>
                    <Link href={selectHref} className="student-btn student-btn--coral">
                        Browse your shells
                    </Link>
                </div>
            )}
        </StudentLayout>
    );
}
