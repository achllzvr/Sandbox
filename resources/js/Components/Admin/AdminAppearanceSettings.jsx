import AdminThemeToggle from '@/Components/Admin/AdminThemeToggle';
import { useAdminTheme } from '@/hooks/useAdminTheme';

export default function AdminAppearanceSettings() {
    const { theme, highContrast, toggleTheme, setHighContrast, isLight } = useAdminTheme();

    return (
        <section className="admin-appearance-settings">
            <header className="admin-appearance-settings__header">
                <h2 className="admin-profile-card__title">Appearance</h2>
                <p className="admin-profile-card__subtitle">
                    Choose dark or light mode for the admin console. In light mode, optionally enable
                    high contrast for stronger dark-gray lines and borders.
                </p>
            </header>

            <div className="admin-appearance-settings__row">
                <span className="admin-appearance-settings__label">Color mode</span>
                <AdminThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>

            <div
                className={`admin-appearance-contrast ${isLight ? 'admin-appearance-contrast--visible' : ''}`}
                aria-hidden={!isLight}
            >
                <label className="admin-appearance-checkbox">
                    <input
                        type="checkbox"
                        checked={highContrast}
                        onChange={(e) => setHighContrast(e.target.checked)}
                        disabled={!isLight}
                    />
                    <span className="admin-appearance-checkbox__box" aria-hidden="true">
                        <svg viewBox="0 0 12 10" fill="none" className="admin-appearance-checkbox__icon">
                            <path
                                d="M1 5.5L4.5 9L11 1"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <span className="admin-appearance-checkbox__text">
                        <strong>High contrast</strong>
                        <span>Use dark gray lines and borders on white cards (profile-style strokes).</span>
                    </span>
                </label>
            </div>
        </section>
    );
}
