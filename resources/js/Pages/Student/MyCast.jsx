import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function MyCast({ cast = [] }) {
    return (
        <StudentLayout activeNav="cast" layoutMode="select">
            <Head title="My Cast" />

            <h2 className="student-page-title">
                My Cast
                <span className="student-todo-badge">TODO</span>
            </h2>
            <p className="student-page-subtitle">Your learning crew and study buddies.</p>

            <div className="student-placeholder">
                <h2>Coming soon</h2>
                <p className="student-page-subtitle">
                    Cast members and co-op shells will show up here. Using mock data for layout preview.
                </p>
                <ul style={{ textAlign: 'left', marginTop: 24, paddingLeft: 20 }}>
                    {(cast.length ? cast : [
                        { name: 'Hermy', role: 'Study buddy' },
                        { name: 'Shell Squad', role: 'Co-op group' },
                    ]).map((member) => (
                        <li key={member.name} style={{ marginBottom: 8 }}>
                            {member.name} — {member.role}
                        </li>
                    ))}
                </ul>
            </div>
        </StudentLayout>
    );
}
