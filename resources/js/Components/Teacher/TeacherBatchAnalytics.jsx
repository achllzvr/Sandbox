import { useMemo, useState } from 'react';
import AdminTablePagination from '@/Components/Admin/AdminTablePagination';
import {
    CompletionDonutChart,
    ModuleCompletionBarChart,
    ModuleScoresLineChart,
} from '@/Components/Teacher/TeacherBatchCharts';
import TeacherSearchCombobox from '@/Components/Teacher/TeacherSearchCombobox';

const PAGE_SIZE = 5;

export default function TeacherBatchAnalytics({ analytics }) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const searchOptions = useMemo(
        () =>
            analytics.students.map((row) => ({
                id: row.id,
                label: row.name ?? row.email ?? 'Student',
                sublabel: row.email,
                value: row.name ?? row.email ?? '',
            })),
        [analytics.students],
    );

    const filteredStudents = useMemo(() => {
        const needle = search.trim().toLowerCase();
        if (!needle) {
            return analytics.students;
        }

        return analytics.students.filter(
            (row) =>
                (row.name ?? '').toLowerCase().includes(needle) ||
                (row.email ?? '').toLowerCase().includes(needle) ||
                (row.status ?? '').toLowerCase().includes(needle),
        );
    }, [analytics.students, search]);

    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageRows = filteredStudents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const rangeStart = filteredStudents.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredStudents.length);

    return (
        <div className="teacher-batch-analytics">
            <div className="teacher-batch-analytics__charts">
                <article className="teacher-card teacher-card--chart">
                    <header className="teacher-card__header">
                        <h3 className="teacher-card__title">Completion Status</h3>
                    </header>
                    <div className="teacher-card__body">
                        <CompletionDonutChart completion={analytics.completion} />
                    </div>
                </article>

                <article className="teacher-card teacher-card--chart">
                    <header className="teacher-card__header">
                        <h3 className="teacher-card__title">Module Completion Trend</h3>
                    </header>
                    <div className="teacher-card__body">
                        <ModuleCompletionBarChart values={analytics.module_completion} />
                    </div>
                </article>

                <article className="teacher-card teacher-card--chart">
                    <header className="teacher-card__header">
                        <h3 className="teacher-card__title">Module Scores Trend</h3>
                    </header>
                    <div className="teacher-card__body">
                        <ModuleScoresLineChart values={analytics.module_scores} />
                    </div>
                </article>
            </div>

            <article className="teacher-card teacher-card--wide">
                <header className="teacher-card__header">
                    <h3 className="teacher-card__title">Batch Student Data</h3>
                </header>
                <div className="teacher-card__body">
                    <div className="teacher-leaderboard-toolbar">
                        <TeacherSearchCombobox
                            value={search}
                            onChange={(value) => {
                                setSearch(value);
                                setPage(1);
                            }}
                            options={searchOptions}
                            placeholder="Search students..."
                            ariaLabel="Search batch students"
                            emptyLabel="No students match"
                        />
                    </div>

                    <div className="teacher-data-table" role="table">
                        <div className="teacher-data-row teacher-data-row--head" role="row">
                            <span>Name</span>
                            <span>Email</span>
                            <span>Current Status</span>
                            <span>Average Quiz Score</span>
                            <span>Final Exam Attempts</span>
                        </div>
                        {pageRows.length === 0 ? (
                            <div className="student-empty student-empty--compact">
                                <p className="student-empty__title">No students match</p>
                            </div>
                        ) : (
                            pageRows.map((row) => (
                                <div key={row.id} className="teacher-data-row" role="row">
                                    <span>{row.name}</span>
                                    <span className="teacher-data-row__muted">{row.email}</span>
                                    <span>
                                        <span className="teacher-status-pill">{row.status}</span>
                                    </span>
                                    <span>
                                        <span className="teacher-status-pill">{row.avg_score}</span>
                                    </span>
                                    <span>
                                        <span className="teacher-status-pill teacher-status-pill--neutral">{row.exam_attempts}</span>
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <AdminTablePagination
                        page={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredStudents.length}
                        rangeStart={rangeStart}
                        rangeEnd={rangeEnd}
                        onPageChange={setPage}
                    />
                </div>
            </article>
        </div>
    );
}
