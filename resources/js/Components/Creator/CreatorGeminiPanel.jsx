import { useEffect, useMemo, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { FileText, Sparkles, Upload, X } from 'lucide-react';
import AdminBadge from '@/Components/Admin/AdminBadge';
import CreatorGeminiLoading from '@/Components/Creator/CreatorGeminiLoading';
import CreatorQuestionFields, { INTERACTION_TYPES } from '@/Components/Creator/CreatorQuestionFields';
import { showAppToastError } from '@/Utils/appToast';
import { extractAxiosErrorMessage } from '@/Utils/extractAxiosErrorMessage';
import {
    canAddGeminiUploadFiles,
    formatFileSize,
    geminiBatchUsageLabel,
    geminiUploadHint,
    resolveGeminiUploadLimits,
    validateGeminiUploadBatch,
} from '@/Utils/geminiUploadLimits';

const LOADING_STEPS = [
    'Preparing source materials',
    'Reading files one by one',
    'Building combined study notes',
    'Drafting questions from notes',
    'Validating output',
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

function fileKey(file) {
    return `${file.name}-${file.size}-${file.lastModified}`;
}

export default function CreatorGeminiPanel({
    hasSystemApiKey = false,
    moduleId = null,
    moduleContents = [],
    onImport,
    importLabel = 'Generate questions',
    questionTypes = null,
    onBusyChange,
    preview: controlledPreview,
    onPreviewChange,
    loading: controlledLoading,
    onLoadingChange,
    generationError,
    onGenerationErrorChange,
}) {
    const { props: pageProps } = usePage();
    const uploadLimits = useMemo(() => resolveGeminiUploadLimits(pageProps), [pageProps]);

    const fixedTypes = useMemo(
        () => (Array.isArray(questionTypes) && questionTypes.length > 0 ? questionTypes : null),
        [questionTypes],
    );
    const selectableTypes = fixedTypes ?? DEFAULT_QUESTION_TYPES;

    const eligibleContents = useMemo(() => eligibleModuleContents(moduleContents), [moduleContents]);
    const canUseModuleMaterials = moduleId && eligibleContents.length > 0;

    const fileInputRef = useRef(null);
    const [sourceMode, setSourceMode] = useState(canUseModuleMaterials ? 'module_contents' : 'upload');
    const [aiKeyType, setAiKeyType] = useState(hasSystemApiKey ? 'system' : 'custom');
    const [aiKey, setAiKey] = useState(() => {
        if (typeof window === 'undefined') {
            return '';
        }
        return window.localStorage.getItem(GEMINI_KEY_STORAGE) || '';
    });
    const [aiFiles, setAiFiles] = useState([]);
    const [textPrompt, setTextPrompt] = useState('');
    const [promptType, setPromptType] = useState('file');
    const [selectedContentIds, setSelectedContentIds] = useState([]);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(selectableTypes);
    const [numQuestions, setNumQuestions] = useState(10);
    const [internalLoading, setInternalLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(8);
    const [internalPreview, setInternalPreview] = useState(null);

    const loading = controlledLoading ?? internalLoading;
    const preview = controlledPreview ?? internalPreview;

    const setLoading = (value) => {
        if (onLoadingChange) {
            onLoadingChange(value);
        } else {
            setInternalLoading(value);
        }
    };

    const setPreview = (value) => {
        const next = typeof value === 'function'
            ? value(controlledPreview ?? internalPreview)
            : value;

        if (onPreviewChange) {
            onPreviewChange(next);
        } else {
            setInternalPreview(next);
        }
    };

    const phase = loading ? 'loading' : preview?.length ? 'preview' : 'form';

    useEffect(() => {
        onBusyChange?.(loading);
    }, [loading, onBusyChange]);

    useEffect(() => {
        if (canUseModuleMaterials) {
            setSelectedContentIds(eligibleContents.map((item) => item.id));
        }
    }, [canUseModuleMaterials, eligibleContents]);

    useEffect(() => {
        setSelectedQuestionTypes(selectableTypes);
    }, [selectableTypes]);

    useEffect(() => {
        if (!loading) {
            return undefined;
        }

        setLoadingStep(0);
        setLoadingProgress(8);

        const stepInterval = window.setInterval(() => {
            setLoadingStep((current) => Math.min(current + 1, LOADING_STEPS.length - 2));
        }, 3200);

        const progressInterval = window.setInterval(() => {
            setLoadingProgress((current) => {
                if (current >= 90) {
                    return current;
                }
                return current + 3;
            });
        }, 900);

        return () => {
            window.clearInterval(stepInterval);
            window.clearInterval(progressInterval);
        };
    }, [loading]);

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

    function addUploadFiles(incoming) {
        if (!incoming?.length) {
            return;
        }

        setAiFiles((current) => {
            const seen = new Set(current.map(fileKey));
            const next = [...current];

            for (const file of incoming) {
                const key = fileKey(file);
                if (seen.has(key)) {
                    continue;
                }

                const gate = canAddGeminiUploadFiles(next, [file], uploadLimits);
                if (!gate.ok) {
                    showAppToastError(gate.message);
                    break;
                }

                seen.add(key);
                next.push(file);
            }

            return next;
        });
    }

    function removeUploadFile(index) {
        setAiFiles((current) => current.filter((_, i) => i !== index));
    }

    function clearUploadFiles() {
        setAiFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    async function handleGenerate() {
        if (sourceMode === 'upload') {
            if (promptType === 'file') {
                const fileError = validateGeminiUploadBatch(aiFiles, uploadLimits);
                if (fileError) {
                    showAppToastError(fileError);
                    return;
                }
            } else if (!textPrompt.trim()) {
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
        onGenerationErrorChange?.(null);

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
            } else {
                aiFiles.forEach((file) => formData.append('files[]', file));
            }
        }

        let succeeded = false;

        try {
            const { data } = await window.axios.post(route('creator.gemini.generate-questions'), formData, {
                timeout: 900000,
            });

            const formatted = (data.questions || []).map(normalizePreviewQuestion);

            if (formatted.length === 0) {
                const message = 'Gemini did not return any valid questions. Try fewer question types or a shorter source document.';
                onGenerationErrorChange?.(message);
                showAppToastError(message);
                return;
            }

            setLoadingStep(LOADING_STEPS.length - 1);
            setLoadingProgress(100);
            setPreview(formatted);
            clearUploadFiles();
            succeeded = true;
        } catch (error) {
            const errMsg = extractAxiosErrorMessage(error);
            onGenerationErrorChange?.(errMsg);
            showAppToastError(errMsg);
        } finally {
            setLoading(false);
            if (!succeeded) {
                setLoadingStep(0);
                setLoadingProgress(8);
            }
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
        onGenerationErrorChange?.(null);
    }

    if (loading) {
        return (
            <CreatorGeminiLoading
                steps={LOADING_STEPS}
                activeStep={loadingStep}
                progress={loadingProgress}
            />
        );
    }

    if (preview?.length) {
        return (
            <div className="creator-gemini-panel creator-gemini-panel--preview">
                <div className="creator-gemini-panel__intro">
                    <AdminBadge type="status" value="published" label={`${preview.length} questions ready`} />
                    <p className="admin-text-muted">Review each item, adjust types or wording, then import into the quiz editor.</p>
                </div>

                <div className="creator-gemini-preview-list">
                    {preview.map((q, qIdx) => (
                        <section key={qIdx} className="creator-gemini-preview-item admin-card admin-card--chunky">
                            <div className="creator-gemini-preview-item__head">
                                <span className="creator-gemini-preview-item__index">Q{qIdx + 1}</span>
                                <button type="button" onClick={() => removePreviewQuestion(qIdx)} className="admin-btn admin-btn--ghost admin-btn--sm">
                                    Remove
                                </button>
                            </div>
                            <CreatorQuestionFields
                                question={q}
                                onChange={(next) => updatePreviewQuestion(qIdx, next)}
                            />
                        </section>
                    ))}
                </div>

                <div className="creator-gemini-panel__actions">
                    <button type="button" onClick={() => setPreview(null)} className="admin-btn admin-btn--ghost">
                        Discard & start over
                    </button>
                    <div className="creator-gemini-panel__actions-end">
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
            {generationError ? (
                <div className="admin-flash admin-flash--error creator-gemini-panel__error" role="alert">
                    {generationError}
                </div>
            ) : null}

            <div className="creator-gemini-panel__intro">
                <p className="admin-text-muted">
                    Build a mixed short test from sandbox materials or temporary uploads. Multiple files are read one at a time and merged into study notes before questions are generated. Files are not saved to the shell.
                </p>
            </div>

            <div className="creator-gemini-panel__grid">
                <section className="creator-gemini-section admin-card admin-card--chunky">
                    <header className="creator-gemini-section__head">
                        <h3 className="admin-section-title">1. Source material</h3>
                    </header>

                    {canUseModuleMaterials ? (
                        <div className="admin-field">
                            <span className="admin-field__label">Input method</span>
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
                                    Temporary upload
                                </button>
                            </div>
                        </div>
                    ) : null}

                    {sourceMode === 'module_contents' ? (
                        <div className="admin-field">
                            <span className="admin-field__label">PDF / PPTX in this sandbox</span>
                            <div className="admin-checklist">
                                {eligibleContents.map((item) => (
                                    <label key={item.id} className="admin-checklist__item admin-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedContentIds.includes(item.id)}
                                            onChange={() => toggleContentId(item.id)}
                                        />
                                        <span>{item.title || componentTypeLabel(item.type)}</span>
                                    </label>
                                ))}
                            </div>
                            <p className="admin-field__hint">Video and YouTube sources are not available for AI generation yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="admin-field">
                                <span className="admin-field__label">Content type</span>
                                <div className="admin-segmented">
                                    <button
                                        type="button"
                                        className={`admin-segmented__btn ${promptType === 'file' ? 'admin-segmented__btn--active' : ''}`}
                                        onClick={() => setPromptType('file')}
                                    >
                                        Upload files
                                    </button>
                                    <button
                                        type="button"
                                        className={`admin-segmented__btn ${promptType === 'text' ? 'admin-segmented__btn--active' : ''}`}
                                        onClick={() => setPromptType('text')}
                                    >
                                        Paste text
                                    </button>
                                </div>
                            </div>

                            {promptType === 'file' ? (
                                <div className="admin-field">
                                    <span className="admin-field__label">Reference files</span>
                                    <div
                                        className="creator-gemini-dropzone"
                                        onDragOver={(event) => event.preventDefault()}
                                        onDrop={(event) => {
                                            event.preventDefault();
                                            addUploadFiles(Array.from(event.dataTransfer.files || []));
                                        }}
                                    >
                                        <Upload size={22} strokeWidth={2.25} aria-hidden="true" />
                                        <p className="creator-gemini-dropzone__title">Drop files here or browse</p>
                                        <p className="admin-field__hint">
                                            {geminiUploadHint(uploadLimits)}
                                        </p>
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn--secondary admin-btn--sm"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Choose files
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,application/pdf,image/*,text/plain"
                                            className="creator-gemini-dropzone__input"
                                            onChange={(e) => {
                                                addUploadFiles(Array.from(e.target.files || []));
                                                e.target.value = '';
                                            }}
                                        />
                                    </div>

                                    {aiFiles.length > 0 ? (
                                        <>
                                            <p className="admin-field__hint creator-gemini-batch-usage">
                                                {geminiBatchUsageLabel(aiFiles, uploadLimits)}
                                            </p>
                                            <ul className="creator-gemini-file-list">
                                            {aiFiles.map((file, index) => (
                                                <li key={fileKey(file)} className="creator-gemini-file-list__item">
                                                    <FileText size={16} strokeWidth={2.25} aria-hidden="true" />
                                                    <div className="creator-gemini-file-list__meta">
                                                        <span className="creator-gemini-file-list__name">{file.name}</span>
                                                        <span className="creator-gemini-file-list__size">{formatFileSize(file.size)}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="admin-btn admin-btn--ghost admin-btn--sm"
                                                        aria-label={`Remove ${file.name}`}
                                                        onClick={() => removeUploadFile(index)}
                                                    >
                                                        <X size={16} strokeWidth={2.25} />
                                                    </button>
                                                </li>
                                            ))}
                                            </ul>
                                        </>
                                    ) : null}
                                </div>
                            ) : (
                                <label className="admin-field">
                                    <span className="admin-field__label">Study text</span>
                                    <textarea
                                        className="input-field"
                                        rows={5}
                                        value={textPrompt}
                                        onChange={(e) => setTextPrompt(e.target.value)}
                                        placeholder="Paste notes, lecture copy, or reading excerpts..."
                                    />
                                </label>
                            )}
                        </>
                    )}
                </section>

                <section className="creator-gemini-section admin-card admin-card--chunky">
                    <header className="creator-gemini-section__head">
                        <h3 className="admin-section-title">2. Quiz settings</h3>
                    </header>

                    {!fixedTypes ? (
                        <div className="admin-field">
                            <span className="admin-field__label">Question types</span>
                            <div className="creator-gemini-type-grid">
                                {typeOptions.map((type) => (
                                    <label key={type.value} className="creator-gemini-type-chip admin-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedQuestionTypes.includes(type.value)}
                                            onChange={() => toggleQuestionType(type.value)}
                                        />
                                        <span>{type.label}</span>
                                    </label>
                                ))}
                            </div>
                            <p className="admin-field__hint">Gemini mixes the selected types across the generated set.</p>
                        </div>
                    ) : null}

                    <label className="admin-field">
                        <span className="admin-field__label">Number of questions</span>
                        <input
                            type="number"
                            min={10}
                            max={200}
                            className="input-field"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Number(e.target.value))}
                        />
                        <p className="admin-field__hint">Minimum 10, maximum 200.</p>
                    </label>

                    <fieldset className="admin-field">
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
                </section>
            </div>

            <div className="creator-gemini-panel__generate">
                <button
                    type="button"
                    onClick={handleGenerate}
                    className="admin-btn admin-btn--primary admin-btn--block"
                >
                    <Sparkles size={16} strokeWidth={2.25} aria-hidden="true" />
                    {importLabel}
                </button>
            </div>
        </div>
    );
}

function componentTypeLabel(type) {
    if (type === 'document') return 'PDF document';
    if (type === 'presentation') return 'Presentation';
    return type;
}
