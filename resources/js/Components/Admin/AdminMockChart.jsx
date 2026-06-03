// TODO: Replace mock chart data with live analytics from the backend.

const DEFAULT_COLORS = ['#cf7860', '#6b7fd4', '#8ecf9f', '#e0b078', '#a8bdd0', '#e09890'];

export function AdminBarChart({ title, subtitle, labels, values, maxValue, colors = DEFAULT_COLORS }) {
    const peak = maxValue || Math.max(...values, 1);

    return (
        <div className="admin-chart admin-card admin-card--chunky">
            <div className="admin-card__header">
                <div>
                    <h3>{title}</h3>
                    {subtitle && <p className="admin-chart__subtitle">{subtitle}</p>}
                </div>
                <span className="admin-todo-badge">TODO: live data</span>
            </div>
            <div className="admin-card__body">
                <div className="admin-bar-chart">
                    {labels.map((label, i) => {
                        const color = colors[i % colors.length];
                        return (
                            <div key={label} className="admin-bar-chart__item">
                                <div className="admin-bar-chart__track">
                                    <div
                                        className="admin-bar-chart__fill"
                                        style={{
                                            height: `${(values[i] / peak) * 100}%`,
                                            '--bar-color': color,
                                        }}
                                    />
                                </div>
                                <span className="admin-bar-chart__label">{label}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="admin-chart-legend">
                    {labels.map((label, i) => (
                        <span key={label} className="admin-chart-legend__item">
                            <span
                                className="admin-chart-legend__swatch"
                                style={{ background: colors[i % colors.length] }}
                            />
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function AdminLineChart({ title, subtitle, labels, values, colors = DEFAULT_COLORS }) {
    const max = Math.max(...values, 1);
    const width = 320;
    const height = 120;
    const pad = 8;
    const step = (width - pad * 2) / Math.max(values.length - 1, 1);

    const coords = values.map((v, i) => ({
        x: pad + i * step,
        y: height - pad - (v / max) * (height - pad * 2),
    }));

    return (
        <div className="admin-chart admin-card admin-card--chunky">
            <div className="admin-card__header">
                <div>
                    <h3>{title}</h3>
                    {subtitle && <p className="admin-chart__subtitle">{subtitle}</p>}
                </div>
                <span className="admin-todo-badge">TODO: live data</span>
            </div>
            <div className="admin-card__body">
                <svg
                    className="admin-line-chart"
                    viewBox={`0 0 ${width} ${height}`}
                    role="img"
                    aria-label={title}
                >
                    {coords.slice(0, -1).map((from, i) => {
                        const to = coords[i + 1];
                        const color = colors[i % colors.length];
                        return (
                            <line
                                key={i}
                                x1={from.x}
                                y1={from.y}
                                x2={to.x}
                                y2={to.y}
                                stroke={color}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        );
                    })}
                    {coords.map((pt, i) => (
                        <circle
                            key={i}
                            cx={pt.x}
                            cy={pt.y}
                            r="4.5"
                            fill={colors[i % colors.length]}
                            stroke="var(--admin-surface)"
                            strokeWidth="2"
                        />
                    ))}
                </svg>
                <div className="admin-line-chart__labels">
                    {labels.map((l) => (
                        <span key={l}>{l}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
