import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';

const THEME_KEY = 'sandbox-admin-theme';
const CONTRAST_KEY = 'sandbox-admin-high-contrast';

const AdminThemeContext = createContext(null);

function readStoredTheme() {
    if (typeof window === 'undefined') {
        return 'dark';
    }
    const htmlTheme = document.documentElement.getAttribute('data-admin-theme');
    if (htmlTheme === 'light' || htmlTheme === 'dark') {
        return htmlTheme;
    }
    const stored = window.localStorage.getItem(THEME_KEY);
    return stored === 'light' ? 'light' : 'dark';
}

function readStoredHighContrast() {
    if (typeof window === 'undefined') {
        return false;
    }
    if (document.documentElement.getAttribute('data-admin-contrast') === 'high') {
        return true;
    }
    return window.localStorage.getItem(CONTRAST_KEY) === '1';
}

function applyThemeSettings(theme, highContrast) {
    document.documentElement.setAttribute('data-admin-theme', theme);
    if (theme === 'light' && highContrast) {
        document.documentElement.setAttribute('data-admin-contrast', 'high');
    } else {
        document.documentElement.removeAttribute('data-admin-contrast');
    }
}

export function AdminThemeProvider({ children }) {
    const [theme, setTheme] = useState(readStoredTheme);
    const [highContrast, setHighContrast] = useState(readStoredHighContrast);

    useLayoutEffect(() => {
        applyThemeSettings(theme, highContrast);
        window.localStorage.setItem(THEME_KEY, theme);
        window.localStorage.setItem(CONTRAST_KEY, highContrast ? '1' : '0');
    }, [theme, highContrast]);

    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
    }, []);

    const toggleHighContrast = useCallback(() => {
        setHighContrast((current) => !current);
    }, []);

    const value = useMemo(
        () => ({
            theme,
            highContrast,
            isDark: theme === 'dark',
            isLight: theme === 'light',
            isLightHighContrast: theme === 'light' && highContrast,
            setTheme,
            setHighContrast,
            toggleTheme,
            toggleHighContrast,
        }),
        [theme, highContrast, toggleTheme, toggleHighContrast],
    );

    return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>;
}

export function useAdminTheme() {
    const context = useContext(AdminThemeContext);
    if (!context) {
        throw new Error('useAdminTheme must be used within AdminThemeProvider');
    }
    return context;
}
