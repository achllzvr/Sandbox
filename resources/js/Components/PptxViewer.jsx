import { useState, useEffect } from 'react';
import JSZip from 'jszip';

/**
 * PptxViewer — Client-side PowerPoint viewer.
 *
 * Parses the .pptx file (which is a ZIP archive of XML + media) directly
 * in the browser using JSZip.  Extracts text and embedded images from
 * each slide and renders them as navigable cards.
 *
 * Props:
 *   fileUrl  – path to the .pptx file (e.g. "/storage/module-contents/abc.pptx")
 */
export default function PptxViewer({ fileUrl }) {
    const [slides, setSlides]     = useState([]);
    const [current, setCurrent]   = useState(0);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    useEffect(() => {
        if (!fileUrl) return;
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(fileUrl);
                if (!res.ok) throw new Error(`Failed to fetch file (${res.status})`);

                const blob = await res.blob();
                const header = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
                const isZipArchive = header[0] === 0x50 && header[1] === 0x4b;

                if (!isZipArchive) {
                    const contentType = res.headers.get('content-type') || blob.type || '';
                    if (contentType.includes('pdf')) {
                        throw new Error('This file is a PDF. Use the Document component type, or upload a .pptx PowerPoint file.');
                    }

                    throw new Error('This file is not a valid PowerPoint (.pptx). Upload a .pptx file or use the Document type for PDFs.');
                }

                const zip  = await JSZip.loadAsync(blob);

                // ── Collect media blobs (images inside ppt/media/) ──────
                const mediaMap = {};
                const mediaFiles = Object.keys(zip.files).filter(n => n.startsWith('ppt/media/'));
                await Promise.all(
                    mediaFiles.map(async (name) => {
                        const data = await zip.files[name].async('blob');
                        mediaMap[name.split('/').pop()] = URL.createObjectURL(data);
                    })
                );

                // ── Discover rels per slide (so we can map rId → media) ─
                const relsMap = {}; // slideN → { rId → mediaFilename }
                const relFiles = Object.keys(zip.files).filter(n =>
                    /^ppt\/slides\/_rels\/slide\d+\.xml\.rels$/.test(n)
                );
                await Promise.all(
                    relFiles.map(async (name) => {
                        const xml  = await zip.files[name].async('text');
                        const doc  = new DOMParser().parseFromString(xml, 'application/xml');
                        const rels = {};
                        doc.querySelectorAll('Relationship').forEach(rel => {
                            const target = rel.getAttribute('Target') || '';
                            const rId    = rel.getAttribute('Id') || '';
                            // Target is like "../media/image1.png"
                            const match  = target.match(/media\/(.+)/);
                            if (match) rels[rId] = match[1];
                        });
                        const slideNum = name.match(/slide(\d+)/)?.[1];
                        if (slideNum) relsMap[slideNum] = rels;
                    })
                );

                // ── Parse each slide XML ────────────────────────────────
                const slideFiles = Object.keys(zip.files)
                    .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
                    .sort((a, b) => {
                        const na = parseInt(a.match(/slide(\d+)/)[1], 10);
                        const nb = parseInt(b.match(/slide(\d+)/)[1], 10);
                        return na - nb;
                    });

                const parsed = await Promise.all(
                    slideFiles.map(async (name) => {
                        const slideNum = name.match(/slide(\d+)/)?.[1];
                        const xml  = await zip.files[name].async('text');
                        const doc  = new DOMParser().parseFromString(xml, 'application/xml');

                        // Extract all text runs
                        const textParagraphs = [];
                        // Use getElementsByTagNameNS for namespaced XML
                        const aPs = doc.getElementsByTagNameNS('http://schemas.openxmlformats.org/drawingml/2006/main', 'p');
                        for (let i = 0; i < aPs.length; i++) {
                            const runs = aPs[i].getElementsByTagNameNS('http://schemas.openxmlformats.org/drawingml/2006/main', 't');
                            let line = '';
                            for (let j = 0; j < runs.length; j++) {
                                line += runs[j].textContent || '';
                            }
                            if (line.trim()) textParagraphs.push(line.trim());
                        }

                        // Extract image references (blipFill → blip → r:embed)
                        const images = [];
                        const blips = doc.getElementsByTagNameNS('http://schemas.openxmlformats.org/drawingml/2006/main', 'blip');
                        for (let i = 0; i < blips.length; i++) {
                            const rEmbed = blips[i].getAttribute('r:embed');
                            if (rEmbed && relsMap[slideNum]?.[rEmbed]) {
                                const filename = relsMap[slideNum][rEmbed];
                                if (mediaMap[filename]) {
                                    images.push(mediaMap[filename]);
                                }
                            }
                        }

                        return { slideNumber: parseInt(slideNum, 10), textParagraphs, images };
                    })
                );

                if (!cancelled) {
                    setSlides(parsed);
                    setCurrent(0);
                }
            } catch (err) {
                console.error('PptxViewer error:', err);
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [fileUrl]);

    // ── Loading state ───────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-16 space-y-3">
                <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                <p className="text-xs font-semibold text-slate-500">Parsing PowerPoint file…</p>
            </div>
        );
    }

    // ── Error state ─────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="w-full text-center py-10 space-y-3 bg-white rounded-xl border border-red-200 px-6">
                <span className="text-4xl block">⚠️</span>
                <p className="text-sm text-red-600 font-semibold">Could not parse PowerPoint</p>
                <p className="text-xs text-slate-500">{error}</p>
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                    📥 Download instead
                </a>
            </div>
        );
    }

    // ── Empty / no slides ───────────────────────────────────────────────────
    if (slides.length === 0) {
        return (
            <div className="w-full text-center py-10 space-y-3 bg-white rounded-xl border border-slate-200 px-6">
                <span className="text-4xl block">📊</span>
                <p className="text-sm text-slate-600 font-semibold">No slides found in this file</p>
            </div>
        );
    }

    // ── Slide viewer ────────────────────────────────────────────────────────
    const slide = slides[current];

    return (
        <div className="w-full space-y-4">
            {/* Slide card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Slide header */}
                <div className="px-5 py-3 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-700">
                        Slide {current + 1} of {slides.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            disabled={current === 0}
                            onClick={() => setCurrent(c => c - 1)}
                            className="px-2.5 py-1 rounded-lg border border-violet-200 bg-white text-violet-600 text-xs font-bold hover:bg-violet-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            ◀ Prev
                        </button>
                        <button
                            disabled={current === slides.length - 1}
                            onClick={() => setCurrent(c => c + 1)}
                            className="px-2.5 py-1 rounded-lg border border-violet-200 bg-white text-violet-600 text-xs font-bold hover:bg-violet-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Next ▶
                        </button>
                    </div>
                </div>

                {/* Slide content */}
                <div className="p-6 min-h-[280px] flex flex-col gap-4">
                    {/* Images */}
                    {slide.images.length > 0 && (
                        <div className="flex flex-wrap gap-3 justify-center">
                            {slide.images.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`Slide ${current + 1} image ${i + 1}`}
                                    className="max-h-52 rounded-lg border border-slate-200 shadow-sm object-contain"
                                />
                            ))}
                        </div>
                    )}

                    {/* Text content */}
                    {slide.textParagraphs.length > 0 ? (
                        <div className="space-y-2">
                            {slide.textParagraphs.map((para, i) => {
                                // First paragraph is likely the title
                                if (i === 0 && slide.textParagraphs.length > 1) {
                                    return (
                                        <h3 key={i} className="text-lg font-bold text-slate-800 leading-snug">
                                            {para}
                                        </h3>
                                    );
                                }
                                return (
                                    <p key={i} className="text-sm text-slate-600 leading-relaxed">
                                        {para}
                                    </p>
                                );
                            })}
                        </div>
                    ) : (
                        !slide.images.length && (
                            <p className="text-sm text-slate-400 italic text-center">
                                (This slide has no text content)
                            </p>
                        )
                    )}
                </div>
            </div>

            {/* Slide pagination dots */}
            {slides.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                                i === current
                                    ? 'bg-violet-600 scale-125'
                                    : 'bg-slate-300 hover:bg-violet-300'
                            }`}
                            title={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Download fallback */}
            <div className="text-center">
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-400 hover:text-violet-500 transition-colors"
                >
                    📥 Download original file
                </a>
            </div>
        </div>
    );
}
