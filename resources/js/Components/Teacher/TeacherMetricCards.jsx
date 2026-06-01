export default function TeacherMetricCards({ metrics }) {
    const items = [
        { label: 'Total Students', value: metrics?.total_students ?? 0 },
        { label: 'Vouchers Claimed', value: metrics?.vouchers_claimed ?? 0 },
        { label: 'Vouchers Unclaimed', value: metrics?.vouchers_unclaimed ?? 0 },
    ];

    return (
        <div className="teacher-dashboard__metrics student-stagger">
            {items.map((item, index) => (
                <div
                    key={item.label}
                    className="teacher-dashboard__metric student-enter__item"
                    style={{ '--student-stagger': index, '--student-enter-index': index }}
                >
                    <span className="teacher-dashboard__metric-label">{item.label}</span>
                    <span className="teacher-dashboard__metric-value">{item.value}</span>
                </div>
            ))}
        </div>
    );
}
