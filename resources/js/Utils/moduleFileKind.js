export function moduleFileExtension(fileUrl) {
    if (!fileUrl) {
        return null;
    }

    const path = String(fileUrl).split('?')[0];
    const match = path.match(/\.([a-z0-9]+)$/i);

    return match ? match[1].toLowerCase() : null;
}

export function resolveModulePreviewKind(contentType, fileUrl, fileExtension = null) {
    const ext = (fileExtension || moduleFileExtension(fileUrl) || '').toLowerCase();

    if (ext === 'pdf') {
        return 'pdf';
    }

    if (ext === 'pptx') {
        return 'pptx';
    }

    if (ext === 'ppt') {
        return 'ppt';
    }

    if (ext === 'bin') {
        if (contentType === 'document') {
            return 'pdf';
        }

        if (contentType === 'presentation') {
            return 'pptx';
        }
    }

    if (contentType === 'document') {
        return 'pdf';
    }

    if (contentType === 'presentation') {
        return 'pptx';
    }

    if (contentType === 'video') {
        return 'video';
    }

    return 'unknown';
}
