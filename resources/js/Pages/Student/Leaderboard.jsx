import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function Leaderboard({ entries = [] }) {
    return (
        <StudentLayout activeNav="leaderboard" layoutMode="select">
            <Head title="Leaderboard" />

            <h2 className="student-page-title">
                Leaderboard
                <span className="student-todo-badge">TODO</span>
            </h2>
            <p className="student-page-subtitle">See who is building the tallest sandcastles this week.</p>

            <div className="student-placeholder">
                <h2>Coming soon</h2>
                <p className="student-page-subtitle">
                    Leaderboard rankings will appear here once the backend is wired. Mock preview below.
                </p>
                <ol style={{ textAlign: 'left', marginTop: 24, paddingLeft: 20 }}>
                    {(entries.length ? entries : [
                        { rank: 1, name: 'Hermy', score: 4200 },
                        { rank: 2, name: 'Sand Surfer', score: 3800 },
                        { rank: 3, name: 'Castle King', score: 3500 },
                    ]).map((entry) => (
                        <li key={entry.rank} style={{ marginBottom: 8 }}>
                            #{entry.rank} {entry.name} — {entry.score} pts
                        </li>
                    ))}
                </ol>
            </div>
        </StudentLayout>
    );
}
