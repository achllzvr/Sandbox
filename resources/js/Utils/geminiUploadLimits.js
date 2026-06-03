export const MAX_GEMINI_UPLOAD_BYTES = 50 * 1024 * 1024;
export const MAX_GEMINI_UPLOAD_LABEL = '50 MB';
export const MAX_GEMINI_FILES = 8;

export { formatFileSize } from '@/Utils/uploadLimits';

export function validateGeminiUploadFile(file) {
    if (!file) {
        return null;
    }

    if (file.size > MAX_GEMINI_UPLOAD_BYTES) {
        return `"${file.name}" is too large. Maximum size per file is ${MAX_GEMINI_UPLOAD_LABEL}.`;
    }

    return null;
}

export function validateGeminiUploadFiles(files) {
    if (!files?.length) {
        return 'Add at least one reference file.';
    }

    if (files.length > MAX_GEMINI_FILES) {
        return `You can upload up to ${MAX_GEMINI_FILES} files at a time.`;
    }

    for (const file of files) {
        const error = validateGeminiUploadFile(file);
        if (error) {
            return error;
        }
    }

    return null;
}
