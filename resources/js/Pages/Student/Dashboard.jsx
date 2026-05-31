import { Head, Link } from '@inertiajs/react';
import StudentShellCard from '@/Components/Student/StudentShellCard';
import StudentLayout from '@/Layouts/StudentLayout';

export default function Dashboard({ myShells }) {
    return (
        <StudentLayout activeNav="shells" pageTitle="My Shells">
            <Head title="My Shells" />

            <h2 className="student-page-title">My Shells</h2>
            <p className="student-page-subtitle">Pick up where you left off in your sandboxes.</p>

            {myShells.length > 0 ? (
                <div className="student-shells-grid">
                    {myShells.map((shell, index) => (
                        <StudentShellCard key={shell.id} shell={shell} index={index} />
                    ))}
                </div>
            ) : (
                <div className="student-empty">
                    <p className="student-empty__title">No active shells yet</p>
                    <p className="student-page-subtitle">
                        Browse the shop to enroll in your first certification shell.
                    </p>
                    <Link href={route('marketplace.index')} className="student-btn student-btn--coral" style={{ display: 'inline-block', width: 'auto', marginTop: 16 }}>
                        Browse available shells
                    </Link>
                </div>
            )}
        </StudentLayout>
    );
}
