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
    const isFinalExam = mode === 'final_exam';
    const title = isFinalExam ? 'Generate final exam (AI)' : 'Generate short test (AI)';

    function handleImport(questions, importMode) {
        if (importMode === 'append') {
            onApplyMock?.(questions, 'append');
        } else {
            onApplyMock?.(questions, 'replace');
        }
        onClose();
    }

    return (
        <AdminModal
            show={show}
            onClose={onClose}
            title={title}
            size="lg"
            footer={(
                <button type="button" onClick={onClose} className="admin-btn admin-btn--ghost">
                    Close
                </button>
            )}
        >
            <CreatorGeminiPanel
                hasSystemApiKey={hasSystemApiKey}
                moduleId={isFinalExam ? null : moduleId}
                moduleContents={isFinalExam ? [] : moduleContents}
                questionTypes={isFinalExam ? ['multiple_choice'] : null}
                onImport={handleImport}
                importLabel={isFinalExam ? 'Generate exam questions' : 'Generate quiz questions'}
            />
        </AdminModal>
    );
}
