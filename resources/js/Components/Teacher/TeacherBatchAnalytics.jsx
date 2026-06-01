import { useMemo, useState } from 'react';

const PAGE_SIZE = 5;

export default function TeacherBatchAnalytics({ analytics }) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

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

    const completionTotal = analytics.completion.reduce((sum, item) => sum + item.count, 0) || 1;
    const maxModuleCompletion = Math.max(...analytics.module_completion, 1);
    const maxModuleScore = Math.max(...analytics.module_scores, 1);

    return (
        <div className="teacher-batch-analytics">
            <div className="teacher-batch-analytics__charts">
                <div className="teacher-batch-analytics__chart teacher-batch-analytics__chart--donut">
                    <h4 className="teacher-batch-analytics__chart-title">Completion Status</h4>
                    <div className="teacher-batch-analytics__donut" aria-hidden="true">
                        {analytics.completion.map((segment, index) => {
                            const rotation = analytics.completion
                                .slice(0, index)
                                .reduce((sum, item) => sum + (item.count / completionTotal) * 360, 0);
                            const sweep = (segment.count / completionTotal) * 360;

                            return (
                                <span
                                    key={segment.key}
                                    className="teacher-batch-analytics__donut-segment"
                                    style={{
                                        '--segment-color': segment.color,
                                        '--segment-rotation': `${rotation}deg`,
                                        '--segment-sweep': `${sweep}deg`,
                                    }}
                                />
                            );
                        })}
                        <div className="teacher-batch-analytics__donut-hole" />
                    </div>
                    <ul className="teacher-batch-analytics__legend">
                        {analytics.completion.map((segment) => (
                            <li key={segment.key}>
                                <span style={{ background: segment.color }} />
                                {segment.label} ({String(segment.count).padStart(2, '0')})
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="teacher-batch-analytics__chart teacher-batch-analytics__chart--bars">
                    <h4 className="teacher-batch-analytics__chart-title">Module Completion Trend</h4>
                    <div className="teacher-batch-analytics__bars">
                        {analytics.module_completion.map((value, index) => (
                            <div key={index} className="teacher-batch-analytics__bar-wrap">
                                <div
                                    className="teacher-batch-analytics__bar"
                                    style={{ height: `${(value / maxModuleCompletion) * 100}%` }}
                                />
                                <span>{index}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="teacher-batch-analytics__chart teacher-batch-analytics__chart--line">
                    <h4 className="teacher-batch-analytics__chart-title">Module Scores Trend</h4>
                    <svg viewBox="0 0 320 120" className="teacher-batch-analytics__line-chart" aria-hidden="true">
                        <polyline
                            fill="none"
                            stroke="#706fd3"
                            strokeWidth="3"
                            points={analytics.module_scores
                                .map((score, index) => {
                                    const x = (index / Math.max(analytics.module_scores.length - 1, 1)) * 300 + 10;
                                    const y = 110 - (score / maxModuleScore) * 90;
                                    return `${x},${y}`;
                                })
                                .join(' ')}
                        />
                        {analytics.module_scores.map((score, index) => {
                            const x = (index / Math.max(analytics.module_scores.length - 1, 1)) * 300 + 10;
                            const y = 110 - (score / maxModuleScore) * 90;
                            return <circle key={index} cx={x} cy={y} r="4" fill="#58cc02" />;
                        })}
                    </svg>
                </div>
            </div>

            <section className="teacher-batch-analytics__students" aria-labelledby="teacher-batch-students-title">
                <h4 id="teacher-batch-students-title" className="teacher-batch-analytics__students-title">
                    Batch Student Data
                </h4>

                <div className="teacher-batch-analytics__search">
                    <input
                        type="search"
                        placeholder="Search students..."
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                        aria-label="Search batch students"
                    />
                </div>

                <div className="teacher-batch-analytics__table">
                    <div className="teacher-batch-analytics__table-header" role="row">
                        <span>Name</span>
                        <span>Email</span>
                        <span>Current Status</span>
                        <span>Average Quiz Score</span>
                        <span>Final Exam Attempts</span>
                    </div>
                    {pageRows.map((row) => (
                        <div key={row.id} className="teacher-batch-analytics__table-row" role="row">
                            <span>{row.name}</span>
                            <span>{row.email}</span>
                            <span>
                                <span className="teacher-batch-analytics__pill">{row.status}</span>
                            </span>
                            <span>
                                <span className="teacher-batch-analytics__pill">{row.avg_score}</span>
                            </span>
                            <span>
                                <span className="teacher-batch-analytics__pill">{row.exam_attempts}</span>
                            </span>
                        </div>
                    ))}
                </div>

                <nav className="teacher-batch-analytics__pagination" aria-label="Batch student pages">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            type="button"
                            className={pageNumber === currentPage ? 'is-active' : ''}
                            onClick={() => setPage(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </nav>
            </section>
        </div>
    );
}
