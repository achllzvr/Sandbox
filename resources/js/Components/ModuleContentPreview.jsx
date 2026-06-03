import PptxViewer from '@/Components/PptxViewer';
import { assetUrl } from '@/utils/assetUrl';
import { resolveModulePreviewKind } from '@/Utils/moduleFileKind';
import { toYoutubeEmbedUrl } from '@/Utils/youtubeEmbedUrl';

export function moduleStorageUrl(relativePath, streamUrl = null) {
    if (streamUrl) {
        return streamUrl;
    }

    if (!relativePath) {
        return null;
    }

    if (/^https?:\/\//i.test(relativePath)) {
        return relativePath;
    }

    const normalized = String(relativePath).replace(/^storage\//, '');

    return assetUrl(`storage/${normalized}`);
}

export default function ModuleContentPreview({
    item,
    iframeClassName = 'admin-preview-iframe admin-preview-iframe--doc',
    videoClassName = 'admin-preview-iframe admin-preview-iframe--video',
    videoProps = {},
    pptxClassName = '',
}) {
    if (!item) {
        return null;
    }

    if (item.type === 'youtube_embed') {
        const embedUrl = toYoutubeEmbedUrl(item.file_url);

        if (!embedUrl) {
            return (
                <div className="admin-empty">
                    <p>Could not load this YouTube link. Check the URL and try again.</p>
                </div>
            );
        }

        return (
            <iframe
                src={embedUrl}
                title={item.title}
                className={videoClassName}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        );
    }

    if (item.type === 'video') {
        return (
            <video
                src={moduleStorageUrl(item.file_url, item.stream_url)}
                controls
                className={videoClassName}
                {...videoProps}
            />
        );
    }

    const resolvedUrl = moduleStorageUrl(item.file_url, item.stream_url);
    const previewKind = resolveModulePreviewKind(
        item.type,
        item.file_url || item.stream_url,
        item.file_extension,
    );

    if (resolvedUrl && (item.type === 'presentation' || item.type === 'document' || previewKind === 'pdf' || previewKind === 'pptx' || previewKind === 'ppt')) {
        if (previewKind === 'pdf') {
            return (
                <div className="admin-preview-pdf">
                    <iframe src={resolvedUrl} title={item.title} className={iframeClassName} />
                    <p className="admin-preview-pdf__fallback">
                        <a href={resolvedUrl} target="_blank" rel="noopener noreferrer">
                            Open PDF in a new tab
                        </a>
                    </p>
                </div>
            );
        }

        if (previewKind === 'ppt') {
            return (
                <div className="admin-empty">
                    <p>Legacy .ppt files cannot be previewed in the browser.</p>
                    <p className="admin-text-muted">Save the file as .pptx and re-upload, or download it below.</p>
                    <p className="admin-preview-pdf__fallback">
                        <a href={resolvedUrl} target="_blank" rel="noopener noreferrer">
                            Download PowerPoint file
                        </a>
                    </p>
                </div>
            );
        }

        if (previewKind === 'pptx' || item.type === 'presentation') {
            return (
                <div className={pptxClassName || undefined}>
                    <PptxViewer fileUrl={resolvedUrl} />
                </div>
            );
        }
    }

    if (item.type === 'quiz') {
        return (
            <div className="admin-preview-quiz">
                <h4 className="admin-preview-quiz__title">Practice quiz questions</h4>
                {(item.questions || []).map((q, qIdx) => (
                    <div key={q.id || qIdx} className="admin-preview-quiz__question">
                        <p className="admin-preview-quiz__prompt">
                            Q{qIdx + 1}. {q.question_text}
                        </p>
                        <div className="admin-answer-grid">
                            {(q.answers || []).map((ans, aIdx) => (
                                <div
                                    key={ans.id || aIdx}
                                    className={`admin-answer ${ans.is_correct ? 'admin-answer--correct' : ''}`}
                                >
                                    {ans.answer_text} {ans.is_correct ? '✓' : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="admin-empty">
            <p>Preview not available for this file type.</p>
        </div>
    );
}
