export const SHELL_THEME_KEYS = ['pink', 'blue', 'green'];

const POPUP_LOCKED = {
    popupLockedBg: '#3d4654',
    popupLockedBorder: '#2d3540',
    popupLockedSurface: '#4a5568',
};

export const SHELL_THEMES = {
    pink: {
        header: '#f79b9b',
        headerBorder: '#e08484',
        headerShadow: '#d96347',
        body: '#f4a5a0',
        cta: '#e0756a',
        cardBorder: '#e8877f',
        cardShadow: '#c96a62',
        mediaBorder: '#e8877f',
        bubbleBg: '#fbe4d8',
        bubbleBorder: '#f07167',
        bubbleTitle: '#d65d4b',
        bubbleSub: '#8c5a52',
        btn: '#f07167',
        btnShadow: '#d96347',
        homeBg: '#fbe4d8',
        homeBorder: '#f0cbb5',
        homeShadow: '#e8b8a0',
        homeIcon: '#d65d4b',
        lockedBg: '#f5ebe6',
        popupBg: '#f07167',
        popupBgDark: '#d96347',
        ...POPUP_LOCKED,
    },
    blue: {
        header: '#9ec5e8',
        headerBorder: '#7eb0e0',
        headerShadow: '#5a8fc4',
        body: '#9ec5e8',
        cta: '#5a8fc4',
        cardBorder: '#7eb0e0',
        cardShadow: '#5a8fc4',
        mediaBorder: '#7eb0e0',
        bubbleBg: '#e3f0fb',
        bubbleBorder: '#7eb0e0',
        bubbleTitle: '#3d6a9a',
        bubbleSub: '#5a7a96',
        btn: '#5a8fc4',
        btnShadow: '#4a7ab0',
        homeBg: '#e3f0fb',
        homeBorder: '#b8d4ef',
        homeShadow: '#9ec5e8',
        homeIcon: '#3d6a9a',
        lockedBg: '#eef4fa',
        popupBg: '#5a8fc4',
        popupBgDark: '#4a7ab0',
        ...POPUP_LOCKED,
    },
    green: {
        header: '#a8d5a2',
        headerBorder: '#8ecf86',
        headerShadow: '#6aab62',
        body: '#a8d5a2',
        cta: '#6aab62',
        cardBorder: '#8ecf86',
        cardShadow: '#6aab62',
        mediaBorder: '#8ecf86',
        bubbleBg: '#e8f5e6',
        bubbleBorder: '#8ecf86',
        bubbleTitle: '#4a7a44',
        bubbleSub: '#5c8a56',
        btn: '#6aab62',
        btnShadow: '#589a52',
        homeBg: '#e8f5e6',
        homeBorder: '#c5e4c0',
        homeShadow: '#a8d5a2',
        homeIcon: '#4a7a44',
        lockedBg: '#f0f8ef',
        popupBg: '#6aab62',
        popupBgDark: '#589a52',
        ...POPUP_LOCKED,
    },
};

export function themeKeyForIndex(index = 0) {
    return SHELL_THEME_KEYS[Math.abs(index) % SHELL_THEME_KEYS.length];
}

export function themeKeyForShell(shell, fallbackIndex = 0) {
    if (shell?.theme && SHELL_THEMES[shell.theme]) {
        return shell.theme;
    }
    if (shell?.id != null) {
        return themeKeyForIndex(Number(shell.id) - 1);
    }
    return themeKeyForIndex(fallbackIndex);
}

export function shellThemeCssVars(themeKey) {
    const theme = SHELL_THEMES[themeKey] ?? SHELL_THEMES.pink;
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
