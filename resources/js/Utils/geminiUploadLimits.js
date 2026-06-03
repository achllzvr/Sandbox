import { formatFileSize } from '@/Utils/uploadLimits';

export { formatFileSize };

export const FALLBACK_GEMINI_UPLOAD_LIMITS = {
    maxFiles: 8,
    maxFileBytes: 50 * 1024 * 1024,
    maxFileLabel: '50 MB',
    maxBatchBytes: 126 * 1024 * 1024,
    maxBatchLabel: '126 MB',
};

export function resolveGeminiUploadLimits(pageProps) {
    return pageProps?.geminiUploadLimits ?? FALLBACK_GEMINI_UPLOAD_LIMITS;
}

function totalFileBytes(files) {
    return files.reduce((sum, file) => sum + (file?.size ?? 0), 0);
}

export function validateGeminiUploadFile(file, limits = FALLBACK_GEMINI_UPLOAD_LIMITS) {
    if (!file) {
        return null;
    }

    if (file.size > limits.maxFileBytes) {
        return `"${file.name}" is too large. Maximum size per file is ${limits.maxFileLabel}.`;
    }

    return null;
}

export function validateGeminiUploadBatch(files, limits = FALLBACK_GEMINI_UPLOAD_LIMITS) {
    if (!files?.length) {
        return 'Add at least one reference file.';
    }

    if (files.length > limits.maxFiles) {
        return `You can upload up to ${limits.maxFiles} files at a time.`;
    }

    let runningTotal = 0;

    for (const file of files) {
        const fileError = validateGeminiUploadFile(file, limits);
        if (fileError) {
            return fileError;
        }

        runningTotal += file.size;

        if (runningTotal > limits.maxBatchBytes) {
            return `Combined upload size exceeds ${limits.maxBatchLabel}. Remove a file or use smaller documents.`;
        }
    }

    return null;
}

/** @deprecated Use validateGeminiUploadBatch */
export function validateGeminiUploadFiles(files, limits = FALLBACK_GEMINI_UPLOAD_LIMITS) {
    return validateGeminiUploadBatch(files, limits);
}

export function canAddGeminiUploadFiles(currentFiles, incomingFiles, limits = FALLBACK_GEMINI_UPLOAD_LIMITS) {
    const next = [...currentFiles];

    for (const file of incomingFiles) {
        if (next.length >= limits.maxFiles) {
            return {
                ok: false,
                message: `You can upload up to ${limits.maxFiles} files at a time.`,
            };
        }

        const fileError = validateGeminiUploadFile(file, limits);
        if (fileError) {
            return { ok: false, message: fileError };
        }

        const projectedTotal = totalFileBytes(next) + file.size;
        if (projectedTotal > limits.maxBatchBytes) {
            return {
                ok: false,
                message: `Adding "${file.name}" would exceed the ${limits.maxBatchLabel} combined upload limit.`,
            };
        }

        next.push(file);
    }

    return { ok: true, message: null };
}

export function geminiUploadHint(limits = FALLBACK_GEMINI_UPLOAD_LIMITS) {
    return `Up to ${limits.maxFiles} files · ${limits.maxFileLabel} each · ${limits.maxBatchLabel} combined max`;
}

export function geminiBatchUsageLabel(files, limits = FALLBACK_GEMINI_UPLOAD_LIMITS) {
    return `${formatFileSize(totalFileBytes(files))} of ${limits.maxBatchLabel} used · ${files.length}/${limits.maxFiles} files`;
}
