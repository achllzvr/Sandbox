import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';

let registered = false;

export function ensureChartsRegistered() {
    if (registered) {
        return;
    }

    ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);
    registered = true;
}

export function readCssVar(name, fallback, element = null) {
    if (typeof window === 'undefined') {
        return fallback;
    }

    const target = element ?? document.documentElement;
    const value = getComputedStyle(target).getPropertyValue(name).trim();

    return value || fallback;
}

export function themeRootFromElement(element) {
    if (!element) {
        return document.documentElement;
    }

    return (
        element.closest('.teacher-batch-page--themed, .student-shop-shell-page, [style*="--shop-accent"]') ??
        document.documentElement
    );
}

export function chartPaletteFromTheme(root) {
    return {
        accent: readCssVar('--shop-accent', '#706fd3', root),
        accentDark: readCssVar('--shop-accent-dark', '#5a6fd4', root),
        infoBg: readCssVar('--shop-info-bg', '#6b7ad4', root),
        panel: readCssVar('--shop-panel', '#8896e8', root),
        soft: readCssVar('--shop-btn-soft-bg', '#d4daf8', root),
        statInner: readCssVar('--shop-stat-inner-bg', '#5a69c4', root),
        textMuted: readCssVar('--student-text-muted', '#6b7280', root),
        text: readCssVar('--student-text', '#2d3540', root),
    };
}

export function completionChartColors(palette) {
    return [palette.accentDark, palette.accent, palette.soft];
}
