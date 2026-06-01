export default function TeacherClaimLogsPanel({ claimLogs = [] }) {
    return (
        <section className="teacher-dashboard__logs student-fade-in-up student-fade-in-up--delay-1" aria-labelledby="teacher-claim-logs-title">
            <h3 id="teacher-claim-logs-title" className="teacher-dashboard__logs-title">
                Claim Logs
            </h3>

            <div className="teacher-claim-logs">
                <div className="teacher-claim-logs__header" role="row">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Voucher for</span>
                    <span>Timestamp</span>
                </div>

                {claimLogs.length === 0 ? (
                    <div className="teacher-claim-logs__empty">No voucher claims recorded yet.</div>
                ) : (
                    claimLogs.map((log) => (
                        <div key={log.id} className="teacher-claim-logs__row" role="row">
                            <span className="teacher-claim-logs__name">{log.name}</span>
                            <span className="teacher-claim-logs__email" title={log.email}>
                                {log.email}
                            </span>
                            <span className="teacher-claim-logs__shell">
                                <span
                                    className="teacher-claim-logs__shell-badge"
                                    style={log.shell_accent ? { '--teacher-shell-accent': log.shell_accent } : undefined}
                                >
                                    {log.shell_title}
                                </span>
                            </span>
                            <span className="teacher-claim-logs__time">{log.claimed_at}</span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
