export function parseEstimatedDurationHours(value) {
    if (value === '' || value == null) {
        return null;
    }

    const numeric = parseFloat(String(value).replace(/[^\d.]/g, ''));

    if (!Number.isFinite(numeric) || numeric < 0) {
        return null;
    }

    return numeric;
}

export function formatEstimatedDurationLabel(value) {
    const hours = parseEstimatedDurationHours(value);

    if (hours == null) {
        return null;
    }

    const hourLabel = hours === 1 ? '1 hour' : `${hours} hours`;
    const hints = [hourLabel];

    if (hours >= 168 && hours % 168 === 0) {
        const weeks = hours / 168;
        hints.push(`≈ ${weeks} week${weeks === 1 ? '' : 's'}`);
    } else if (hours >= 40) {
        const weeks = Math.round((hours / 40) * 10) / 10;
        hints.push(`≈ ${weeks} week${weeks === 1 ? '' : 's'} at 40 hrs/week`);
    } else if (hours >= 24) {
        const days = Math.round((hours / 24) * 10) / 10;
        hints.push(`≈ ${days} day${days === 1 ? '' : 's'}`);
    }

    return hints.join(' · ');
}

export function estimatedDurationForStore(value) {
    const hours = parseEstimatedDurationHours(value);

    if (hours == null) {
        return '';
    }

    return hours === 1 ? '1 hour' : `${hours} hours`;
}

export function parseEstimatedDurationFromStored(stored) {
    if (!stored) {
        return '';
    }

    const hours = parseEstimatedDurationHours(stored);

    return hours != null ? String(hours) : '';
}
