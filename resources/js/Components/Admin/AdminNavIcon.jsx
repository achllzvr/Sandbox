const icons = {
    dashboard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 01-1.5 1.5H5.5A1.5 1.5 0 014 19v-8.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 20.5V14h5v6.5" />
        </svg>
    ),
    users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11a4 4 0 10-8 0 4 4 0 008 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5a7 7 0 0116 0" />
        </svg>
    ),
    certifications: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8l2 4v12H6V8l2-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h4" />
        </svg>
    ),
    teachers: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7l7-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12.5l2 2 3.5-4" />
        </svg>
    ),
    audit: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
    ),
    finance: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16v10H4V7z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M8 14h3" />
        </svg>
    ),
};

export default function AdminNavIcon({ name }) {
    return <span className="admin-nav-link__icon">{icons[name] || icons.dashboard}</span>;
}
