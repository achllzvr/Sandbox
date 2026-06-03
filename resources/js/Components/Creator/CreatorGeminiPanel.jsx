import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import CreatorQuestionFields, { INTERACTION_TYPES } from '@/Components/Creator/CreatorQuestionFields';
import { showAppToastError } from '@/Utils/appToast';

const LOADING_MESSAGES = [
    'Connecting to Gemini API...',
    'Uploading document...',
    'Scanning contents with Gemini AI...',
    'Analyzing concepts and patterns...',
    'Generating question types...',
    'Verifying answers and metadata...',
    'Structuring question data...',
];

const GEMINI_KEY_STORAGE = 'gemini_api_key';
const DEFAULT_QUESTION_TYPES = INTERACTION_TYPES.map((type) => type.value);

function eligibleModuleContents(contents = []) {
    return contents.filter((item) => item.type === 'document' || item.type === 'presentation');
}

function normalizePreviewQuestion(raw) {
    const type = raw.interaction_type || 'multiple_choice';
    const base = {
        question_text: raw.question_text || '',
        interaction_type: type,
        metadata: raw.metadata ?? null,
    };

    if (type === 'multiple_choice') {
        const answers = (raw.answers || []).map((ans) => ({
            answer_text: ans.answer_text || '',
            is_correct: !!ans.is_correct,
        }));
        while (answers.length < 4) {
            answers.push({ answer_text: '', is_correct: answers.length === 0 });
        }
        return { ...base, answers: answers.slice(0, 4) };
    }

    return base;
}

export default function CreatorGeminiPanel({
    hasSystemApiKey = false,
    moduleId = null,
    moduleContents = [],
    onImport,
    importLabel = 'Import questions',
    questionTypes = null,
}) {
    const fixedTypes = useMemo(
        () => (Array.isArray(questionTypes) && questionTypes.length > 0 ? questionTypes : null),
        [questionTypes],
    );
    const selectableTypes = fixedTypes ?? DEFAULT_QUESTION_TYPES;

    const eligibleContents = useMemo(() => eligibleModuleContents(moduleContents), [moduleContents]);
    const canUseModuleMaterials = moduleId && eligibleContents.length > 0;

    const [sourceMode, setSourceMode] = useState(canUseModuleMaterials ? 'module_contents' : 'upload');
    const [aiKeyType, setAiKeyType] = useState(hasSystemApiKey ? 'system' : 'custom');
    const [aiKey, setAiKey] = useState(() => {
        if (typeof window === 'undefined') {
            return '';
        }
        return window.localStorage.getItem(GEMINI_KEY_STORAGE) || '';
    });
    const [aiFile, setAiFile] = useState(null);
    const [textPrompt, setTextPrompt] = useState('');
    const [promptType, setPromptType] = useState('file');
    const [selectedContentIds, setSelectedContentIds] = useState([]);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(selectableTypes);
    const [numQuestions, setNumQuestions] = useState(5);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (canUseModuleMaterials) {
            setSelectedContentIds(eligibleContents.map((item) => item.id));
        }
    }, [canUseModuleMaterials, eligibleContents]);

    useEffect(() => {
        setSelectedQuestionTypes(selectableTypes);
    }, [selectableTypes]);

    function persistKey(value) {
        setAiKey(value);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(GEMINI_KEY_STORAGE, value);
        }
    }

    function toggleContentId(id) {
        setSelectedContentIds((current) => (
            current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
        ));
    }

    function toggleQuestionType(type) {
        if (fixedTypes) {
            return;
        }
        setSelectedQuestionTypes((current) => {
            if (current.includes(type)) {
                if (current.length === 1) {
                    return current;
                }
                return current.filter((value) => value !== type);
            }
            return [...current, type];
        });
    }

    async function handleGenerate() {
        if (sourceMode === 'upload') {
            if (promptType === 'file' && !aiFile) {
                showAppToastError('Please select a file to scan.');
                return;
            }
            if (promptType === 'text' && !textPrompt.trim()) {
                showAppToastError('Please enter text to generate questions from.');
                return;
            }
        } else if (selectedContentIds.length === 0) {
            showAppToastError('Select at least one sandbox material (PDF or PPTX).');
            return;
        }

        if (selectedQuestionTypes.length === 0) {
            showAppToastError('Select at least one question type to generate.');
            return;
        }

        if (aiKeyType === 'custom' && !aiKey.trim()) {
            showAppToastError('Please paste your personal Gemini API key.');
            return;
        }

        setLoading(true);
        setLoadingMessage(LOADING_MESSAGES[0]);

        let msgIdx = 0;
        const interval = window.setInterval(() => {
            msgIdx = Math.min(msgIdx + 1, LOADING_MESSAGES.length - 1);
            setLoadingMessage(LOADING_MESSAGES[msgIdx]);
        }, 2500);

        const formData = new FormData();
        formData.append('source_mode', sourceMode);
        formData.append('num_questions', String(numQuestions));
        formData.append('api_key_type', aiKeyType);
        if (aiKeyType === 'custom') {
            formData.append('api_key', aiKey.trim());
        }
        selectedQuestionTypes.forEach((type) => formData.append('question_types[]', type));

        if (sourceMode === 'module_contents') {
            formData.append('module_id', String(moduleId));
            selectedContentIds.forEach((id) => formData.append('module_content_ids[]', String(id)));
        } else {
            formData.append('prompt_type', promptType);
            if (promptType === 'text') {
                formData.append('text_prompt', textPrompt.trim());
            } else if (aiFile) {
                formData.append('file', aiFile);
            }
        }

        try {
            const { data } = await window.axios.post(route('creator.gemini.generate-questions'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const formatted = (data.questions || []).map(normalizePreviewQuestion);

            if (formatted.length === 0) {
                showAppToastError('Gemini did not return any valid questions.');
                return;
            }

            setPreview(formatted);
            setAiFile(null);
        } catch (error) {
            const errMsg = error.response?.data?.error || error.message || 'Could not generate questions.';
            showAppToastError(errMsg);
        } finally {
            window.clearInterval(interval);
            setLoading(false);
        }
    }

    function updatePreviewQuestion(idx, next) {
        setPreview((current) => {
            const copy = [...current];
            copy[idx] = next;
            return copy;
        });
    }

    function removePreviewQuestion(idx) {
        setPreview((current) => current.filter((_, i) => i !== idx));
    }

    function handleImport(mode) {
        if (!preview?.length) {
            showAppToastError('No questions to import.');
            return;
        }
        onImport?.(preview, mode);
        setPreview(null);
    }

    if (preview) {
        return (
            <div className="creator-gemini-panel">
                <div className="admin-flash admin-flash--success" style={{ marginBottom: '16px' }}>
                    <Sparkles size={16} strokeWidth={2.25} aria-hidden="true" style={{ display: 'inline', marginRight: '6px' }} />
                    Preview generated questions ({preview.length}). Edit types and content before importing.
                </div>
                <div className="admin-preview-quiz">
                    {preview.map((q, qIdx) => (
                        <div key={qIdx} className="admin-preview-quiz__question">
                            <div className="admin-toolbar" style={{ marginBottom: '8px' }}>
                                <strong>Question {qIdx + 1}</strong>
                                <button type="button" onClick={() => removePreviewQuestion(qIdx)} className="admin-btn admin-btn--ghost admin-btn--sm">
                                    Remove
                                </button>
                            </div>
                            <CreatorQuestionFields
                                question={q}
                                onChange={(next) => updatePreviewQuestion(qIdx, next)}
                            />
                        </div>
                    ))}
                </div>
                <div className="admin-toolbar" style={{ marginTop: '16px' }}>
                    <button type="button" onClick={() => setPreview(null)} className="admin-btn admin-btn--ghost">
                        Discard & start over
                    </button>
                    <div className="admin-toolbar__end">
                        <button type="button" onClick={() => handleImport('append')} className="admin-btn admin-btn--secondary">
                            Approve & append
                        </button>
                        <button type="button" onClick={() => handleImport('replace')} className="admin-btn admin-btn--primary">
                            Approve & replace
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const typeOptions = INTERACTION_TYPES.filter((type) => selectableTypes.includes(type.value));

    return (
        <div className="creator-gemini-panel">
            {loading ? (
                <div className="creator-gemini-panel__loading" role="status">
                    <Sparkles size={20} strokeWidth={2.25} aria-hidden="true" />
                    <p>{loadingMessage}</p>
                </div>
            ) : null}

            <div className="admin-flash admin-flash--info" style={{ marginBottom: '16px' }}>
                Generate a mixed quiz from your materials — multiple choice, true/false, matching, sequence, AI explain-why, and code completion.
            </div>

            {canUseModuleMaterials ? (
                <fieldset className="admin-field" style={{ marginBottom: '16px' }}>
                    <legend className="admin-field__label">Source</legend>
                    <div className="admin-segmented">
                        <button
                            type="button"
                            className={`admin-segmented__btn ${sourceMode === 'module_contents' ? 'admin-segmented__btn--active' : ''}`}
                            onClick={() => setSourceMode('module_contents')}
                        >
                            Sandbox materials
                        </button>
                        <button
                            type="button"
                            className={`admin-segmented__btn ${sourceMode === 'upload' ? 'admin-segmented__btn--active' : ''}`}
                            onClick={() => setSourceMode('upload')}
                        >
                            Upload file
                        </button>
                    </div>
                </fieldset>
            ) : null}

            {sourceMode === 'module_contents' ? (
                <div className="admin-field" style={{ marginBottom: '16px' }}>
                    <span className="admin-field__label">Select materials (PDF / PPTX)</span>
                    <div className="admin-checklist">
                        {eligibleContents.map((item) => (
                            <label key={item.id} className="admin-checklist__item">
                                <input
                                    type="checkbox"
                                    checked={selectedContentIds.includes(item.id)}
                                    onChange={() => toggleContentId(item.id)}
                                />
                                <span>{item.title || componentTypeLabel(item.type)}</span>
                            </label>
                        ))}
                    </div>
                    <p className="admin-field__hint">Video and YouTube materials are not supported for AI generation yet.</p>
                </div>
            ) : (
                <>
                    <div className="admin-segmented" style={{ marginBottom: '16px' }}>
                        <button
                            type="button"
                            className={`admin-segmented__btn ${promptType === 'file' ? 'admin-segmented__btn--active' : ''}`}
                            onClick={() => setPromptType('file')}
                        >
                            File upload
                        </button>
                        <button
                            type="button"
                            className={`admin-segmented__btn ${promptType === 'text' ? 'admin-segmented__btn--active' : ''}`}
                            onClick={() => setPromptType('text')}
                        >
                            Paste text
                        </button>
                    </div>
                    {promptType === 'file' ? (
                        <label className="admin-field">
                            <span className="admin-field__label">Reference file (PDF, image, or text — max 10 MB)</span>
                            <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,application/pdf,image/*,text/plain"
                                className="input-field"
                                onChange={(e) => setAiFile(e.target.files?.[0] ?? null)}
                            />
                            {aiFile ? <p className="admin-field__hint">Selected: {aiFile.name}</p> : null}
                        </label>
                    ) : (
                        <label className="admin-field">
                            <span className="admin-field__label">Study text</span>
                            <textarea
                                className="input-field"
                                rows={5}
                                value={textPrompt}
                                onChange={(e) => setTextPrompt(e.target.value)}
                                placeholder="Paste notes or reading material..."
                            />
                        </label>
                    )}
                </>
            )}

            {!fixedTypes ? (
                <fieldset className="admin-field" style={{ marginBottom: '16px' }}>
                    <legend className="admin-field__label">Question types to include</legend>
                    <div className="admin-checklist">
                        {typeOptions.map((type) => (
                            <label key={type.value} className="admin-checklist__item">
                                <input
                                    type="checkbox"
                                    checked={selectedQuestionTypes.includes(type.value)}
                                    onChange={() => toggleQuestionType(type.value)}
                                />
                                <span>{type.label}</span>
                            </label>
                        ))}
                    </div>
                    <p className="admin-field__hint">Gemini will mix the selected types across the generated set.</p>
                </fieldset>
            ) : null}

            <label className="admin-field">
                <span className="admin-field__label">Number of questions (5–20)</span>
                <input
                    type="number"
                    min={5}
                    max={20}
                    className="input-field"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                />
            </label>

            <fieldset className="admin-field" style={{ marginTop: '16px' }}>
                <legend className="admin-field__label">Gemini API key</legend>
                <div className="admin-segmented">
                    <button
                        type="button"
                        disabled={!hasSystemApiKey}
                        className={`admin-segmented__btn ${aiKeyType === 'system' ? 'admin-segmented__btn--active' : ''}`}
                        onClick={() => setAiKeyType('system')}
                    >
                        System key {hasSystemApiKey ? '✓' : '(unavailable)'}
                    </button>
                    <button
                        type="button"
                        className={`admin-segmented__btn ${aiKeyType === 'custom' ? 'admin-segmented__btn--active' : ''}`}
                        onClick={() => setAiKeyType('custom')}
                    >
                        Personal key
                    </button>
                </div>
                {aiKeyType === 'custom' ? (
                    <input
                        type="password"
                        className="input-field"
                        style={{ marginTop: '8px' }}
                        value={aiKey}
                        onChange={(e) => persistKey(e.target.value)}
                        placeholder="Paste your Gemini API key"
                    />
                ) : null}
            </fieldset>

            <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="admin-btn admin-btn--primary admin-btn--block"
                style={{ marginTop: '16px' }}
            >
                <Sparkles size={16} strokeWidth={2.25} aria-hidden="true" />
                {importLabel}
            </button>
        </div>
    );
}

function componentTypeLabel(type) {
    if (type === 'document') return 'PDF document';
    if (type === 'presentation') return 'Presentation';
    return type;
}
