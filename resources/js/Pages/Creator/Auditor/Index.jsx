import { Head, router } from '@inertiajs/react';
import CreatorLayout from '@/Layouts/CreatorLayout';

export default function AuditorIndex({ certifications = [], selectedCertificationId, students = [] }) {
    function onCertChange(e) {
        router.get(
            route('creator.auditor.index'),
            { certification_id: e.target.value },
            { preserveState: true, preserveScroll: true },
        );
    }

    return (
        <CreatorLayout activeNav="auditor" pageTitle="Auditor">
            <Head title="Student Progress Auditor" />

            <p className="admin-text-muted" style={{ marginBottom: '16px' }}>
                Track student progress across your published shells.
            </p>

            <div className="admin-toolbar">
                <select value={selectedCertificationId ?? ''} onChange={onCertChange} className="input-field" aria-label="Select shell" disabled={certifications.length === 0}>
                    {certifications.length === 0 ? (
                        <option value="">No published shells yet</option>
                    ) : (
                        certifications.map((cert) => (
                            <option key={cert.id} value={cert.id}>{cert.title}</option>
                        ))
                    )}
                </select>
            </div>

            <div className="admin-card admin-card--chunky">
                <div className="admin-card__header">
                    <h3>Student progress</h3>
                </div>
                <div className="admin-card__body admin-card__body--flush">
                    {students.length === 0 ? (
                        <div className="admin-empty"><p>No enrolled students for this shell yet.</p></div>
                    ) : (
                        students.map((student) => (
                            <div key={student.id} className="admin-list-row">
                                <div>
                                    <p className="admin-list-row__title">{student.name}</p>
                                    <p className="admin-list-row__meta">{student.email}</p>
                                </div>
                                <div style={{ minWidth: '140px' }}>
                                    <div className="creator-progress-bar" aria-hidden="true">
                                        <div className="creator-progress-bar__fill" style={{ width: `${student.progress_pct}%` }} />
                                    </div>
                                    <p className="admin-list-row__meta">{student.progress_pct}% complete</p>
                                </div>
                                <div className="admin-list-row__meta">{student.modules_completed}/{student.modules_total} modules</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </CreatorLayout>
    );
}
