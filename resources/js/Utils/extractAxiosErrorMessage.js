export function extractAxiosErrorMessage(error, fallback = 'Could not generate questions.') {
    const data = error?.response?.data;

    if (typeof data?.error === 'string' && data.error.trim()) {
        return data.error;
    }

    if (typeof data?.message === 'string' && data.message.trim()) {
        return data.message;
    }

    if (data?.errors && typeof data.errors === 'object') {
        const first = Object.values(data.errors).flat().find((value) => typeof value === 'string' && value.trim());
        if (first) {
            return first;
        }
    }

    if (typeof error?.message === 'string' && error.message.trim()) {
        if (error.message === 'Network Error') {
            return 'The server stopped responding before Gemini finished (often a PHP timeout). Restart the dev server and try again — generation can take 1–3 minutes.';
        }

        return error.message;
    }

    return fallback;
}
