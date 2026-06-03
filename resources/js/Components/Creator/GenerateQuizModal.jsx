import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import AdminModal from '@/Components/Admin/AdminModal';
import CreatorGeminiPanel from '@/Components/Creator/CreatorGeminiPanel';

export default function GenerateQuizModal({
    show,
    onClose,
    mode = 'short_test',
    onApplyMock,
    hasSystemApiKey = false,
    moduleId = null,
    moduleContents = [],
}) {
    const [busy, setBusy] = useState(false);
    const [phase, setPhase] = useState('form');
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generationError, setGenerationError] = useState(null);

    const isFinalExam = mode === 'final_exam';
    const title = isFinalExam ? 'AI final exam generator' : 'AI short test generator';
    const subtitle = loading
        ? 'Please keep this window open while Gemini works.'
        : preview
            ? 'Review the generated questions before importing them into the quiz editor.'
            : isFinalExam
                ? 'Draft multiple-choice exam questions from your reference materials.'
                : 'Generate a mixed question set from sandbox materials or temporary uploads.';

    useEffect(() => {
        if (!show) {
            setPreview(null);
            setLoading(false);
            setGenerationError(null);
            setBusy(false);
            setPhase('form');
        }
    }, [show]);

    useEffect(() => {
        if (loading) {
            setPhase('loading');
            return;
        }
        if (preview?.length) {
            setPhase('preview');
            return;
        }
        setPhase('form');
    }, [loading, preview]);

    function handleImport(questions, importMode) {
        if (importMode === 'append') {
            onApplyMock?.(questions, 'append');
        } else {
            onApplyMock?.(questions, 'replace');
        }
        onClose();
    }

    function handleClose() {
        if (loading) {
            return;
        }
        onClose();
    }

    function handleLoadingChange(isLoading) {
        setLoading(isLoading);
        setBusy(isLoading);
    }

    return (
        <AdminModal
            show={show}
            onClose={handleClose}
            title={(
                <span className="creator-gemini-modal-title">
                    <Sparkles size={18} strokeWidth={2.25} aria-hidden="true" />
                    {title}
                </span>
            )}
            subtitle={subtitle}
            size={phase === 'preview' ? 'xl' : 'lg'}
            footer={phase === 'preview' ? null : (
                <button type="button" onClick={handleClose} className="admin-btn admin-btn--ghost" disabled={loading}>
                    {loading ? 'Generating…' : 'Close'}
                </button>
            )}
        >
            {show ? (
                <CreatorGeminiPanel
                    hasSystemApiKey={hasSystemApiKey}
                    moduleId={isFinalExam ? null : moduleId}
                    moduleContents={isFinalExam ? [] : moduleContents}
                    questionTypes={isFinalExam ? ['multiple_choice'] : null}
                    onImport={handleImport}
                    preview={preview}
                    onPreviewChange={setPreview}
                    loading={loading}
                    onLoadingChange={handleLoadingChange}
                    generationError={generationError}
                    onGenerationErrorChange={setGenerationError}
                    importLabel={isFinalExam ? 'Generate exam questions' : 'Generate quiz questions'}
                />
            ) : null}
        </AdminModal>
    );
}
