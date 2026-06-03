export const MAX_MODULE_UPLOAD_BYTES = 50 * 1024 * 1024;
export const MAX_MODULE_UPLOAD_LABEL = '50 MB';

export function formatFileSize(bytes) {
    if (!bytes) {
        return '0 B';
    }

    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (bytes >= 1024) {
        return `${Math.round(bytes / 1024)} KB`;
    }

    return `${bytes} B`;
}

export function validateModuleUploadFile(file) {
    if (!file) {
        return null;
    }

    if (file.size > MAX_MODULE_UPLOAD_BYTES) {
        return `File is too large (${formatFileSize(file.size)}). Maximum size is ${MAX_MODULE_UPLOAD_LABEL}.`;
    }

    return null;
}
