const STORAGE_PREFIX = 'sandbox-exam-draft';

function storageKey(certificationId, userId) {
    return `${STORAGE_PREFIX}:${userId}:${certificationId}`;
}

export function loadExamDraft(certificationId, userId) {
    if (!certificationId || !userId) {
        return null;
    }

    try {
        const raw = localStorage.getItem(storageKey(certificationId, userId));
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
            return null;
        }

        return {
            quizIndex: Number(parsed.quizIndex) || 0,
            userAnswers: Array.isArray(parsed.userAnswers) ? parsed.userAnswers : [],
            savedAt: parsed.savedAt ?? null,
        };
    } catch {
        return null;
    }
}

export function saveExamDraft(certificationId, userId, { quizIndex, userAnswers }) {
    if (!certificationId || !userId) {
        return;
    }

    try {
        localStorage.setItem(
            storageKey(certificationId, userId),
            JSON.stringify({
                quizIndex,
                userAnswers,
                savedAt: new Date().toISOString(),
            }),
        );
    } catch {
        // Ignore quota / private mode errors.
    }
}

export function clearExamDraft(certificationId, userId) {
    if (!certificationId || !userId) {
        return;
    }

    try {
        localStorage.removeItem(storageKey(certificationId, userId));
    } catch {
        // Ignore.
    }
}

export function hasExamDraft(certificationId, userId) {
    return loadExamDraft(certificationId, userId) !== null;
}
