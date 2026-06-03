import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
    chartPaletteFromTheme,
    completionChartColors,
    ensureChartsRegistered,
    readCssVar,
    themeRootFromElement,
} from '@/utils/chartSetup';

ensureChartsRegistered();

const BASE_FONT = {
    family: 'Roboto, sans-serif',
    size: 11,
};

function useThemePalette() {
    const containerRef = useRef(null);
    const [palette, setPalette] = useState(null);

    useLayoutEffect(() => {
        const root = themeRootFromElement(containerRef.current);
        setPalette(chartPaletteFromTheme(root));
    }, []);

    return [containerRef, palette];
}

function chartOptions(palette, extra = {}) {
    const text = palette?.text ?? readCssVar('--student-text', '#2d3540');
    const textMuted = palette?.textMuted ?? readCssVar('--student-text-muted', '#6b7280');
    const { plugins: extraPlugins, scales, ...rest } = extra;

    return {
        responsive: true,
        maintainAspectRatio: false,
        ...rest,
        plugins: {
            legend: {
                labels: {
                    font: BASE_FONT,
                    color: text,
                    boxWidth: 12,
                    padding: 10,
                },
            },
            tooltip: {
                bodyFont: BASE_FONT,
                titleFont: { ...BASE_FONT, weight: '700' },
            },
            ...extraPlugins,
        },
        scales: scales
            ? {
                  x: {
                      ...scales.x,
                      ticks: {
                          font: BASE_FONT,
                          color: textMuted,
                          ...scales.x?.ticks,
                      },
                  },
                  y: {
                      ...scales.y,
                      ticks: {
                          font: BASE_FONT,
                          color: textMuted,
                          ...scales.y?.ticks,
                      },
                  },
              }
            : scales,
    };
}

export function CompletionDonutChart({ completion = [] }) {
    const [containerRef, palette] = useThemePalette();
    const segmentColors = palette ? completionChartColors(palette) : completion.map((segment) => segment.color);

    const data = useMemo(
        () => ({
            labels: completion.map((segment) => segment.label),
            datasets: [
                {
                    data: completion.map((segment) => segment.count),
                    backgroundColor: completion.map((_, index) => segmentColors[index] ?? segmentColors.at(-1)),
                    borderColor: '#fff',
                    borderWidth: 2,
                    hoverOffset: 6,
                },
            ],
        }),
        [completion, segmentColors],
    );

    const options = useMemo(
        () =>
            chartOptions(palette, {
                cutout: '62%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: BASE_FONT,
                            color: palette?.text ?? readCssVar('--student-text', '#2d3540'),
                            boxWidth: 12,
                            padding: 12,
                        },
                    },
                },
            }),
        [palette],
    );

    return (
        <div ref={containerRef} className="teacher-chart-canvas" aria-label="Completion status chart">
            <Doughnut data={data} options={options} />
        </div>
    );
}

export function ModuleCompletionBarChart({ values = [] }) {
    const [containerRef, palette] = useThemePalette();
    const accent = palette?.accent ?? readCssVar('--shop-accent', '#706fd3');
    const accentDark = palette?.accentDark ?? readCssVar('--shop-accent-dark', '#5a6fd4');

    const data = useMemo(
        () => ({
            labels: values.map((_, index) => String(index)),
            datasets: [
                {
                    label: 'Completions',
                    data: values,
                    backgroundColor: accent,
                    borderColor: accentDark,
                    borderWidth: 2,
                    borderRadius: 6,
                },
            ],
        }),
        [values, accent, accentDark],
    );

    const options = useMemo(
        () =>
            chartOptions(palette, {
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { display: false },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(196, 172, 122, 0.25)' },
                    },
                },
            }),
        [palette],
    );

    return (
        <div ref={containerRef} className="teacher-chart-canvas" aria-label="Module completion trend">
            <Bar data={data} options={options} />
        </div>
    );
}

export function ModuleScoresLineChart({ values = [] }) {
    const [containerRef, palette] = useThemePalette();
    const accent = palette?.accent ?? readCssVar('--shop-accent', '#706fd3');

    const data = useMemo(
        () => ({
            labels: values.map((_, index) => String(index)),
            datasets: [
                {
                    label: 'Avg score',
                    data: values,
                    borderColor: accent,
                    backgroundColor: accent,
                    pointBackgroundColor: accent,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    tension: 0.35,
                    fill: false,
                },
            ],
        }),
        [values, accent],
    );

    const options = useMemo(
        () =>
            chartOptions(palette, {
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { display: false },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(196, 172, 122, 0.25)' },
                    },
                },
            }),
        [palette],
    );

    return (
        <div ref={containerRef} className="teacher-chart-canvas" aria-label="Module scores trend">
            <Line data={data} options={options} />
        </div>
    );
}
