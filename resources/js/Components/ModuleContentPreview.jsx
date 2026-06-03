import PptxViewer from '@/Components/PptxViewer';
import { assetUrl } from '@/utils/assetUrl';

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
        return (
            <iframe
                src={item.file_url}
                title={item.title}
                className={videoClassName}
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

    if (item.type === 'presentation' && (item.file_url || item.stream_url)) {
        return (
            <div className={pptxClassName || undefined}>
                <PptxViewer fileUrl={moduleStorageUrl(item.file_url, item.stream_url)} />
            </div>
        );
    }

    if (item.type === 'document' && (item.file_url || item.stream_url)) {
        const pdfUrl = moduleStorageUrl(item.file_url, item.stream_url);

        return (
            <div className="admin-preview-pdf">
                <iframe src={pdfUrl} title={item.title} className={iframeClassName} />
                <p className="admin-preview-pdf__fallback">
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                        Open PDF in a new tab
                    </a>
                </p>
            </div>
        );
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
