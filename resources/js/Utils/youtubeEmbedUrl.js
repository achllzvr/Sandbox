export function extractYoutubeVideoId(url) {
    if (!url) {
        return null;
    }

    const trimmed = String(url).trim();

    let match = trimmed.match(/(?:youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([\w-]{11})/i);
    if (match) {
        return match[1];
    }

    match = trimmed.match(/youtu\.be\/([\w-]{11})/i);
    if (match) {
        return match[1];
    }

    match = trimmed.match(/youtube\.com\/(?:shorts\/|v\/)([\w-]{11})/i);
    if (match) {
        return match[1];
    }

    try {
        const parsed = new URL(trimmed);
        const videoId = parsed.searchParams.get('v');
        if (videoId && /^[\w-]{11}$/.test(videoId)) {
            return videoId;
        }
    } catch {
        return null;
    }

    return null;
}

export function toYoutubeEmbedUrl(url) {
    const videoId = extractYoutubeVideoId(url);

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}
