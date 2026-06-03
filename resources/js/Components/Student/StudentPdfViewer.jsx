import { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { viteBuildAssetUrl } from '@/utils/assetUrl';

pdfjs.GlobalWorkerOptions.workerSrc = viteBuildAssetUrl(pdfjsWorker);

export default function StudentPdfViewer({ fileUrl, pageIndex = 0, onPageCountChange, className = '' }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const pdfRef = useRef(null);
    const renderTaskRef = useRef(null);
    const onPageCountChangeRef = useRef(onPageCountChange);
    const [documentReady, setDocumentReady] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isRenderingPage, setIsRenderingPage] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        onPageCountChangeRef.current = onPageCountChange;
    }, [onPageCountChange]);

    useEffect(() => {
        if (!fileUrl) {
            return undefined;
        }

        let cancelled = false;

        const loadDocument = async () => {
            setInitialLoading(true);
            setError(null);
            setDocumentReady(false);

            try {
                pdfRef.current?.destroy?.();
                pdfRef.current = null;

                const task = pdfjs.getDocument({ url: fileUrl, withCredentials: true });
                const pdfDoc = await task.promise;

                if (cancelled) {
                    pdfDoc.destroy();
                    return;
                }

                pdfRef.current = pdfDoc;
                onPageCountChangeRef.current?.(pdfDoc.numPages);
                setDocumentReady(true);
            } catch (err) {
                if (!cancelled) {
                    setError(err?.message || 'Could not load this PDF.');
                    onPageCountChangeRef.current?.(0);
                    setInitialLoading(false);
                }
            }
        };

        loadDocument();

        return () => {
            cancelled = true;
            renderTaskRef.current?.cancel?.();
            pdfRef.current?.destroy?.();
            pdfRef.current = null;
        };
    }, [fileUrl]);

    useEffect(() => {
        if (!documentReady || !pdfRef.current || !canvasRef.current || !containerRef.current) {
            return undefined;
        }

        let cancelled = false;

        const renderPage = async () => {
            setIsRenderingPage(true);

            try {
                renderTaskRef.current?.cancel?.();

                const pdfDoc = pdfRef.current;
                const safePage = Math.min(Math.max(pageIndex, 0), pdfDoc.numPages - 1);
                const page = await pdfDoc.getPage(safePage + 1);

                if (cancelled || !canvasRef.current || !containerRef.current) {
                    return;
                }

                const containerWidth = containerRef.current.clientWidth || 640;
                const unscaled = page.getViewport({ scale: 1 });
                const scale = containerWidth / unscaled.width;
                const viewport = page.getViewport({ scale });

                const offscreen = document.createElement('canvas');
                offscreen.width = viewport.width;
                offscreen.height = viewport.height;

                const offscreenContext = offscreen.getContext('2d');
                const renderTask = page.render({
                    canvasContext: offscreenContext,
                    viewport,
                    background: '#ffffff',
                });

                renderTaskRef.current = renderTask;
                await renderTask.promise;

                if (cancelled || !canvasRef.current) {
                    return;
                }

                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                context.drawImage(offscreen, 0, 0);
            } catch (err) {
                if (!cancelled && err?.name !== 'RenderingCancelledException') {
                    setError(err?.message || 'Could not render this PDF page.');
                }
            } finally {
                if (!cancelled) {
                    setIsRenderingPage(false);
                    setInitialLoading(false);
                }
            }
        };

        renderPage();

        return () => {
            cancelled = true;
            renderTaskRef.current?.cancel?.();
        };
    }, [documentReady, pageIndex]);

    if (error) {
        return (
            <div className={`student-sandbox__viewer-fallback ${className}`.trim()}>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`student-sandbox__pdf ${className}`.trim()}>
            {initialLoading && !documentReady ? (
                <p className="student-sandbox__viewer-status">Loading document…</p>
            ) : null}
            <canvas
                ref={canvasRef}
                className={`student-sandbox__pdf-canvas ${isRenderingPage ? 'student-sandbox__pdf-canvas--rendering' : ''}`}
                aria-label="PDF page preview"
            />
        </div>
    );
}
