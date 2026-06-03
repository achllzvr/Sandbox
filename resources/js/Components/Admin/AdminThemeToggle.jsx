export default function AdminThemeToggle({ theme, onToggle }) {
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            className="admin-theme-toggle"
            onClick={onToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
        >
            <span className="admin-theme-toggle__track" aria-hidden="true">
                <span className={`admin-theme-toggle__thumb ${isDark ? '' : 'admin-theme-toggle__thumb--light'}`} />
            </span>
            <span className="admin-theme-toggle__label">{isDark ? 'Dark' : 'Light'}</span>
        </button>
    );
}
