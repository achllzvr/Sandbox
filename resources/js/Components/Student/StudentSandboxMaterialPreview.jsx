import ModuleContentPreview, { moduleStorageUrl } from '@/Components/ModuleContentPreview';
import PptxViewer from '@/Components/PptxViewer';
import StudentPdfViewer from '@/Components/Student/StudentPdfViewer';
import { resolveModulePreviewKind } from '@/Utils/moduleFileKind';

export default function StudentSandboxMaterialPreview({
    item,
    pageIndex = 0,
    onPageCountChange,
    videoProps = {},
}) {
    if (!item) {
        return null;
    }

    const resolvedUrl = moduleStorageUrl(item.file_url, item.stream_url);
    const previewKind = resolveModulePreviewKind(
        item.type,
        item.file_url || item.stream_url,
        item.file_extension,
    );

    if (previewKind === 'pdf' && resolvedUrl) {
        return (
            <StudentPdfViewer
                fileUrl={resolvedUrl}
                pageIndex={pageIndex}
                onPageCountChange={onPageCountChange}
            />
        );
    }

    if ((previewKind === 'pptx' || previewKind === 'ppt') && resolvedUrl) {
        return (
            <PptxViewer
                fileUrl={resolvedUrl}
                slideIndex={pageIndex}
                onSlideCountChange={onPageCountChange}
                immersive
            />
        );
    }

    return (
        <ModuleContentPreview
            item={item}
            iframeClassName="student-sandbox__iframe student-sandbox__iframe--immersive"
            videoClassName="student-sandbox__iframe student-sandbox__iframe--immersive"
            pptxClassName="student-sandbox__pptx"
            videoProps={videoProps}
        />
    );
}

export function studentMaterialPreviewKind(item) {
    if (!item) {
        return null;
    }

    return resolveModulePreviewKind(
        item.type,
        item.file_url || item.stream_url,
        item.file_extension,
    );
}

export function studentMaterialHasPageNavigation(previewKind) {
    return previewKind === 'pdf' || previewKind === 'pptx' || previewKind === 'ppt';
}
