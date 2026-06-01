const CARD_THEMES = ['green', 'blue', 'pink'];

export function shopThemeForCert(cert, index = 0) {
    const title = (cert?.title ?? '').toLowerCase();

    if (title.includes('react') || title.includes('node')) {
        return 'blue';
    }

    if (title.includes('laravel') || title.includes('java') || title.includes('html')) {
        return 'green';
    }

    return CARD_THEMES[index % CARD_THEMES.length];
}

export function formatShopPrice(price) {
    const num = parseFloat(price);
    return num === 0 ? 'Free' : `₱${num.toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;
}

export function shopProviderLine(cert) {
    const title = (cert?.title ?? '').toLowerCase();

    if (title.includes('react')) {
        return { prefix: 'from', name: 'Meta' };
    }

    if (title.includes('laravel')) {
        return { prefix: 'by', name: 'LLC' };
    }

    if (cert?.creator) {
        const name = `${cert.creator.first_name ?? ''} ${cert.creator.last_name ?? ''}`.trim();
        return { prefix: 'by', name: name || 'Sandbox' };
    }

    return { prefix: 'by', name: 'Sandbox' };
}

export function shopBadgeLabel(cert) {
    const title = (cert?.title ?? '').toLowerCase();

    if (title.includes('java') || title.includes('github')) {
        return 'GitHub Verified Certificate';
    }

    return 'Professional Certificate';
}

export function shopIsGithubVerified(cert) {
    const title = (cert?.title ?? '').toLowerCase();
    return title.includes('java') || title.includes('github');
}

export function shopDurationLabel(cert) {
    if (cert?.estimated_duration) {
        return cert.estimated_duration;
    }

    return 'Self-Paced';
}

export function shopDifficultyLabel(cert) {
    if (cert?.difficulty) {
        return cert.difficulty;
    }

    return 'Beginner';
}

export function shopHeroLabel(cert) {
    const title = (cert?.title ?? '').trim();
    if (!title) {
        return 'SB';
    }

    const words = title.split(/\s+/);
    if (words.length >= 2) {
        return words
            .slice(0, 2)
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase();
    }

    return title.slice(0, 2).toUpperCase();
}

export function getShopCategoryLabel(cert) {
    if (cert?.category?.trim()) {
        return cert.category.trim();
    }

    const title = (cert?.title ?? '').toLowerCase();

    if (title.includes('react') || title.includes('node')) {
        return 'React';
    }

    if (title.includes('laravel')) {
        return 'Laravel';
    }

    if (title.includes('java')) {
        return 'Java';
    }

    return 'Other Shells';
}

export function groupShopCatalog(catalog, enrolledCertificationIds = [], activeCategoryFilter = 'all') {
    const enrolledSet = new Set(enrolledCertificationIds);
    const owned = catalog.filter((cert) => enrolledSet.has(cert.id));
    const available = catalog.filter((cert) => !enrolledSet.has(cert.id));

    const purchasedSection =
        owned.length > 0 ? { id: 'purchased', title: 'Already Purchased', items: owned } : null;

    if (activeCategoryFilter === 'purchased') {
        return purchasedSection ? [purchasedSection] : [];
    }

    const sections = [];

    if (activeCategoryFilter !== 'all') {
        if (available.length > 0) {
            sections.push({
                id: activeCategoryFilter.toLowerCase().replace(/\s+/g, '-'),
                title: activeCategoryFilter,
                items: available,
            });
        }
    } else {
        const availableByCategory = new Map();

        for (const cert of available) {
            const label = getShopCategoryLabel(cert);
            if (!availableByCategory.has(label)) {
                availableByCategory.set(label, []);
            }
            availableByCategory.get(label).push(cert);
        }

        for (const title of [...availableByCategory.keys()].sort((a, b) => a.localeCompare(b))) {
            sections.push({
                id: title.toLowerCase().replace(/\s+/g, '-'),
                title,
                items: availableByCategory.get(title),
            });
        }
    }

    if (purchasedSection) {
        sections.push(purchasedSection);
    }

    return sections;
}
