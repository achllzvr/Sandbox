const POPUP_LOCKED = {
    popupLockedBg: '#3d4654',
    popupLockedBorder: '#2d3540',
    popupLockedSurface: '#4a5568',
};

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export function normalizeHex(hex) {
    if (!hex || typeof hex !== 'string') {
        return null;
    }

    const raw = hex.trim().replace(/^#/, '');

    if (raw.length === 3) {
        return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`.toLowerCase();
    }

    if (/^[0-9a-f]{6}$/i.test(raw)) {
        return `#${raw.toLowerCase()}`;
    }

    return null;
}

export function hexToRgb(hex) {
    const normalized = normalizeHex(hex);
    if (!normalized) {
        return null;
    }

    const value = parseInt(normalized.slice(1), 16);

    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255,
    };
}

export function rgbToHsl(r, g, b) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        switch (max) {
            case rn:
                h = ((gn - bn) / delta) % 6;
                break;
            case gn:
                h = (bn - rn) / delta + 2;
                break;
            default:
                h = (rn - gn) / delta + 4;
                break;
        }

        h *= 60;
        if (h < 0) {
            h += 360;
        }
    }

    return {
        h,
        s: s * 100,
        l: l * 100,
    };
}

export function hslToHex(h, s, l) {
    const hue = ((h % 360) + 360) % 360;
    const sat = clamp(s, 0, 100) / 100;
    const light = clamp(l, 0, 100) / 100;
    const chroma = (1 - Math.abs(2 * light - 1)) * sat;
    const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = light - chroma / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (hue < 60) {
        [r, g, b] = [chroma, x, 0];
    } else if (hue < 120) {
        [r, g, b] = [x, chroma, 0];
    } else if (hue < 180) {
        [r, g, b] = [0, chroma, x];
    } else if (hue < 240) {
        [r, g, b] = [0, x, chroma];
    } else if (hue < 300) {
        [r, g, b] = [x, 0, chroma];
    } else {
        [r, g, b] = [chroma, 0, x];
    }

    const toByte = (channel) => Math.round((channel + m) * 255);

    return `#${[toByte(r), toByte(g), toByte(b)].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

export function adjustHex(hex, { h = 0, sMul = 1, lDelta = 0, sMin = 8, sMax = 100, lMin = 8, lMax = 96 } = {}) {
    const rgb = hexToRgb(hex);
    if (!rgb) {
        return null;
    }

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return hslToHex(hsl.h + h, clamp(hsl.s * sMul, sMin, sMax), clamp(hsl.l + lDelta, lMin, lMax));
}

export function contrastTextForBg(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) {
        return '#ffffff';
    }

    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    return luminance > 0.58 ? '#2d3540' : '#ffffff';
}

export function contrastMutedForBg(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) {
        return 'rgba(255, 255, 255, 0.88)';
    }

    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    return luminance > 0.58 ? 'rgba(45, 53, 64, 0.72)' : 'rgba(255, 255, 255, 0.88)';
}

export function buildShellThemeFromAccent(accentHex) {
    const accent = normalizeHex(accentHex);
    if (!accent) {
        return null;
    }

    const rgb = hexToRgb(accent);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return {
        header: adjustHex(accent, { sMul: 0.85, lDelta: 8, lMax: 84 }),
        headerBorder: adjustHex(accent, { sMul: 0.9, lDelta: -2 }),
        headerShadow: adjustHex(accent, { sMul: 0.95, lDelta: -12, lMin: 22 }),
        body: adjustHex(accent, { sMul: 0.88, lDelta: 4, lMax: 80 }),
        cta: adjustHex(accent, { sMul: 0.92, lDelta: -6, lMin: 28 }),
        cardBorder: accent,
        cardShadow: adjustHex(accent, { sMul: 0.95, lDelta: -14, lMin: 22 }),
        mediaBorder: accent,
        bubbleBg: hslToHex(hsl.h, clamp(hsl.s * 0.45, 18, 55), 92),
        bubbleBorder: accent,
        bubbleTitle: adjustHex(accent, { sMul: 0.85, lDelta: -18, lMin: 24 }),
        bubbleSub: hslToHex(hsl.h, clamp(hsl.s * 0.4, 12, 45), 45),
        btn: adjustHex(accent, { sMul: 0.95, lDelta: -10, lMin: 26 }),
        btnShadow: adjustHex(accent, { sMul: 0.95, lDelta: -16, lMin: 22 }),
        homeBg: hslToHex(hsl.h, clamp(hsl.s * 0.45, 18, 55), 92),
        homeBorder: hslToHex(hsl.h, clamp(hsl.s * 0.35, 14, 40), 85),
        homeShadow: hslToHex(hsl.h, clamp(hsl.s * 0.55, 20, 60), 75),
        homeIcon: adjustHex(accent, { sMul: 0.85, lDelta: -18, lMin: 24 }),
        lockedBg: hslToHex(hsl.h, clamp(hsl.s * 0.25, 8, 30), 94),
        popupBg: adjustHex(accent, { sMul: 0.95, lDelta: -10, lMin: 26 }),
        popupBgDark: adjustHex(accent, { sMul: 0.95, lDelta: -16, lMin: 22 }),
        ...POPUP_LOCKED,
    };
}

export function buildShopThemeFromAccent(accentHex) {
    const accent = normalizeHex(accentHex);
    if (!accent) {
        return null;
    }

    const rgb = hexToRgb(accent);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const pageBg = hslToHex(hsl.h, clamp(hsl.s * 0.55, 20, 65), 82);
    const heroBg = hslToHex(hsl.h, clamp(hsl.s * 0.42, 16, 55), 14);
    const heroBorder = hslToHex(hsl.h, clamp(hsl.s * 0.45, 18, 58), 10);
    const infoBg = adjustHex(accent, { sMul: 0.85, lDelta: -8, lMin: 30 });
    const infoBorder = adjustHex(accent, { sMul: 0.9, lDelta: -14, lMin: 26 });
    const shopAccent = adjustHex(accent, { sMul: 0.9, lDelta: -12, lMin: 28 });
    const shopAccentDark = adjustHex(accent, { sMul: 0.92, lDelta: -18, lMin: 22 });
    const statInnerBg = shopAccent;
    const statInnerBorder = shopAccentDark;
    const shellTheme = buildShellThemeFromAccent(accent);

    return {
        pageBg,
        heroBg,
        heroBorder,
        infoBg,
        infoBorder,
        accent: shopAccent,
        accentDark: shopAccentDark,
        onInfo: contrastTextForBg(infoBg),
        onInfoMuted: contrastMutedForBg(infoBg),
        onStat: contrastTextForBg(statInnerBg),
        onStatMuted: contrastMutedForBg(statInnerBg),
        onPage: contrastTextForBg(pageBg),
        onAccent: contrastTextForBg(shopAccent),
        toolbarBg: 'rgba(255, 255, 255, 0.96)',
        toolbarText: '#2d3540',
        toolbarBorder: 'rgba(255, 255, 255, 0.55)',
        btnSoftBg: hslToHex(hsl.h, clamp(hsl.s * 0.35, 12, 45), 92),
        btnSoftText: adjustHex(accent, { sMul: 0.85, lDelta: -20, lMin: 20 }),
        statShellBg: adjustHex(accent, { sMul: 0.9, lDelta: -4, lMin: 30 }),
        statShellBorder: adjustHex(accent, { sMul: 0.92, lDelta: -10, lMin: 26 }),
        statInnerBg,
        statInnerBorder,
        panel: shellTheme?.body ?? pageBg,
        panelDark: shellTheme?.cardBorder ?? accent,
        hero: hsl.l > 62 ? heroBg : '#ffffff',
        stat: shellTheme?.btn ?? shopAccent,
        mediaBg: heroBg,
        priceBg: hsl.l > 58 ? 'rgba(255, 255, 255, 0.94)' : adjustHex(accent, { sMul: 0.88, lDelta: -6, lMin: 24 }),
        priceText: hsl.l > 58 ? shopAccentDark : '#ffffff',
    };
}

export function shellThemeCssVarsFromAccent(accentHex) {
    const theme = buildShellThemeFromAccent(accentHex);
    if (!theme) {
        return {};
    }

    return {
        '--shell-card-border': theme.cardBorder,
        '--shell-card-shadow': theme.cardShadow,
        '--shell-header': theme.header,
        '--shell-header-border': theme.headerBorder,
        '--shell-header-shadow': theme.headerShadow,
        '--shell-body': theme.body,
        '--shell-cta': theme.cta,
        '--shell-bubble-bg': theme.bubbleBg,
        '--shell-bubble-border': theme.bubbleBorder,
        '--shell-bubble-title': theme.bubbleTitle,
        '--shell-bubble-sub': theme.bubbleSub,
        '--shell-btn': theme.btn,
        '--shell-btn-shadow': theme.btnShadow,
        '--shell-home-bg': theme.homeBg,
        '--shell-home-border': theme.homeBorder,
        '--shell-home-shadow': theme.homeShadow,
        '--shell-home-icon': theme.homeIcon,
        '--shell-locked-bg': theme.lockedBg,
        '--shell-popup-bg': theme.popupBg,
        '--shell-popup-bg-dark': theme.popupBgDark,
        '--shell-popup-locked-bg': theme.popupLockedBg,
        '--shell-popup-locked-border': theme.popupLockedBorder,
        '--shell-popup-locked-surface': theme.popupLockedSurface,
    };
}

export function shellCardCssVarsFromAccent(accentHex) {
    const theme = buildShellThemeFromAccent(accentHex);
    if (!theme) {
        return {};
    }

    return {
        '--shell-card-border': theme.cardBorder,
        '--shell-card-shadow': theme.cardShadow,
        '--shell-body': theme.body,
        '--shell-cta': theme.cta,
    };
}

export function shopThemeCssVarsFromAccent(accentHex) {
    const theme = buildShopThemeFromAccent(accentHex);
    if (!theme) {
        return {};
    }

    return {
        '--shop-page-bg': theme.pageBg,
        '--shop-hero-bg': theme.heroBg,
        '--shop-hero-border': theme.heroBorder,
        '--shop-info-bg': theme.infoBg,
        '--shop-info-border': theme.infoBorder,
        '--shop-accent': theme.accent,
        '--shop-accent-dark': theme.accentDark,
        '--shop-on-info': theme.onInfo,
        '--shop-on-info-muted': theme.onInfoMuted,
        '--shop-on-stat': theme.onStat,
        '--shop-on-stat-muted': theme.onStatMuted,
        '--shop-on-page': theme.onPage,
        '--shop-on-accent': theme.onAccent,
        '--shop-toolbar-bg': theme.toolbarBg,
        '--shop-toolbar-text': theme.toolbarText,
        '--shop-toolbar-border': theme.toolbarBorder,
        '--shop-btn-soft-bg': theme.btnSoftBg,
        '--shop-btn-soft-text': theme.btnSoftText,
        '--shop-stat-shell-bg': theme.statShellBg,
        '--shop-stat-shell-border': theme.statShellBorder,
        '--shop-stat-inner-bg': theme.statInnerBg,
        '--shop-stat-inner-border': theme.statInnerBorder,
        '--shop-panel': theme.panel,
        '--shop-panel-dark': theme.panelDark,
        '--shop-hero': theme.hero,
        '--shop-stat': theme.stat,
        '--shop-card-media-bg': theme.mediaBg,
        '--shop-card-price-bg': theme.priceBg,
        '--shop-card-price-text': theme.priceText,
        '--creator-row-bg': theme.infoBg,
        '--creator-row-border': theme.infoBorder,
        '--creator-row-shadow': theme.accentDark,
        '--creator-row-text': theme.onInfo,
        '--creator-row-text-muted': theme.onInfoMuted,
        '--shell-card-border': theme.panelDark,
        '--shell-card-shadow': theme.accentDark,
        '--shell-body': theme.panel,
        '--shell-cta': theme.accent,
    };
}
