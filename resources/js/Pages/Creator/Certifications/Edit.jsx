import React, { useState, useEffect } from 'react';
import CreatorLayout from '@/Layouts/CreatorLayout';
import AdminBadge from '@/Components/Admin/AdminBadge';
import AdminModal from '@/Components/Admin/AdminModal';
import ModuleContentPreview from '@/Components/ModuleContentPreview';
import GenerateQuizModal from '@/Components/Creator/GenerateQuizModal';
import CreatorQuestionFields from '@/Components/Creator/CreatorQuestionFields';
import CreatorStatusPill from '@/Components/Creator/CreatorStatusPill';
import {
    estimatedDurationForStore,
    formatEstimatedDurationLabel,
    parseEstimatedDurationFromStored,
} from '@/utils/estimatedDuration';
import { Head, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Eye,
    GripVertical,
    Pencil,
    Plus,
    Sparkles,
    X,
} from 'lucide-react';

const MIN_MODULES = 10;
const MIN_QUIZ_ONLY_SANDBOXES = 2;
const MIN_QUIZ_ONLY_FOR_EXAM = 3;

function isQuizOnlySandbox(mod) {
    return (mod.contents || []).length === 0 && (mod.questions || []).length >= 5;
}

const COMPONENT_TYPE_LABELS = {
    video: 'Video',
    presentation: 'Presentation (PPT)',
    document: 'Document (PDF)',
    youtube_embed: 'YouTube embed',
};

export default function Edit({ certification }) {
    // ── Extract modules from default lesson ────────────────
    const defaultLesson = certification.lessons?.[0] || null;
    const modules = defaultLesson ? (defaultLesson.modules || []) : [];
    
    // Sort modules by order_index
    const sortedModules = [...modules].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

    // ── Navigation / Page View State ───────────────────────
    // If activeModuleId is set, we display the Sandbox Creator Studio view.
    const [activeModuleId, setActiveModuleId] = useState(null);
    const activeModule = sortedModules.find(m => m.id === activeModuleId) || null;

    // ── Modals State ───────────────────────────────────────
    const [showAddSandboxModal, setShowAddSandboxModal] = useState(false);
    const [showAddComponentModal, setShowAddComponentModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showExamModal, setShowExamModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [pendingDeleteModuleId, setPendingDeleteModuleId] = useState(null);
    const [pendingDeleteComponentId, setPendingDeleteComponentId] = useState(null);
    const [previewItem, setPreviewItem] = useState(null);
    const [showGenerateShortTestModal, setShowGenerateShortTestModal] = useState(false);
    const [showGenerateExamModal, setShowGenerateExamModal] = useState(false);
    const [showExamRequirementsModal, setShowExamRequirementsModal] = useState(false);

    // ── Forms ──────────────────────────────────────────────
    const addSandboxForm = useForm({
        title: '',
        description: ''
    });

    const updateModuleForm = useForm({
        title: '',
        description: '',
        strict_completion: false
    });

    // Sync form values when active module changes
    useEffect(() => {
        if (activeModule) {
            updateModuleForm.setData({
                title: activeModule.title || '',
                description: activeModule.description || '',
                strict_completion: !!activeModule.strict_completion
            });
        }
    }, [activeModuleId]);

    const addComponentForm = useForm({
        title: '',
        type: 'ppt',
        file: null,
        youtube_url: '',
    });

    const shellSettingsForm = useForm({
        title: certification.title ?? '',
        description: certification.description ?? '',
        category: certification.category ?? '',
        difficulty: certification.difficulty ?? 'Beginner',
        estimated_duration: parseEstimatedDurationFromStored(certification.estimated_duration),
        learning_objectives: certification.learning_objectives ?? '',
        price: certification.price != null ? String(certification.price) : '',
        cover_image: null,
    });

    const [coverPreview, setCoverPreview] = useState(certification.thumbnail_url ?? null);
    const durationPreview = formatEstimatedDurationLabel(shellSettingsForm.data.estimated_duration);

    useEffect(() => {
        shellSettingsForm.setData({
            title: certification.title ?? '',
            description: certification.description ?? '',
            category: certification.category ?? '',
            difficulty: certification.difficulty ?? 'Beginner',
            estimated_duration: parseEstimatedDurationFromStored(certification.estimated_duration),
            learning_objectives: certification.learning_objectives ?? '',
            price: certification.price != null ? String(certification.price) : '',
            cover_image: null,
        });
        setCoverPreview(certification.thumbnail_url ?? null);
    }, [certification.id, certification.updated_at]);

    const [questionsList, setQuestionsList] = useState([]);
    const [examQuestionsList, setExamQuestionsList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── Module Handlers ────────────────────────────────────
    const submitAddSandbox = (e) => {
        e.preventDefault();
        addSandboxForm.post(route('creator.modules.store', certification.id), {
            onSuccess: () => {
                setShowAddSandboxModal(false);
                addSandboxForm.reset();
            },
            preserveScroll: true
        });
    };

    const submitUpdateModule = (e) => {
        e.preventDefault();
        updateModuleForm.put(route('creator.modules.update', activeModule.id), {
            preserveScroll: true
        });
    };

    const deleteModule = (modId) => {
        setPendingDeleteModuleId(modId);
    };

    const confirmDeleteModule = () => {
        if (!pendingDeleteModuleId) {
            return;
        }

        router.delete(route('creator.modules.destroy', pendingDeleteModuleId), {
            onSuccess: () => {
                if (activeModuleId === pendingDeleteModuleId) {
                    setActiveModuleId(null);
                }
                setPendingDeleteModuleId(null);
            },
            preserveScroll: true,
        });
    };

    const moveModule = (index, direction) => {
        const newModules = [...sortedModules];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newModules.length) return;

        const temp = newModules[index];
        newModules[index] = newModules[targetIndex];
        newModules[targetIndex] = temp;

        router.post(route('creator.modules.reorder', certification.id), {
            modules: newModules.map((m, idx) => ({
                id: m.id,
                order_index: idx + 1
            }))
        }, { preserveScroll: true });
    };

    // ── Component Handlers ─────────────────────────────────
    const submitAddComponent = (e) => {
        e.preventDefault();
        addComponentForm.post(route('creator.modules.contents.store', activeModule.id), {
            onSuccess: () => {
                setShowAddComponentModal(false);
                addComponentForm.reset();
            },
            preserveScroll: true
        });
    };

    const deleteComponent = (contentId) => {
        setPendingDeleteComponentId(contentId);
    };

    const confirmDeleteComponent = () => {
        if (!pendingDeleteComponentId || !activeModule) {
            return;
        }

        router.delete(route('creator.modules.contents.destroy', [activeModule.id, pendingDeleteComponentId]), {
            onSuccess: () => setPendingDeleteComponentId(null),
            preserveScroll: true,
        });
    };

    const moveComponent = (index, direction) => {
        if (!activeModule) return;
        const items = [...(activeModule.contents || [])].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const temp = items[index];
        items[index] = items[targetIndex];
        items[targetIndex] = temp;

        router.post(route('creator.modules.contents.reorder', activeModule.id), {
            contents: items.map((c, idx) => ({
                id: c.id,
                order_index: idx + 1
            }))
        }, { preserveScroll: true });
    };

    // ── Practice Quiz (Short Test) Handlers ────────────────
    const openQuizEditor = () => {
        const existingQuestions = (activeModule.questions || []).map(q => ({
            question_text: q.question_text,
            interaction_type: q.interaction_type || 'multiple_choice',
            metadata: q.metadata || null,
            answers: (q.answers || []).map(a => ({
                answer_text: a.answer_text,
                is_correct: !!a.is_correct
            }))
        }));

        if (existingQuestions.length === 0) {
            setQuestionsList(Array.from({ length: 5 }, () => ({
                question_text: '',
                interaction_type: 'multiple_choice',
                metadata: null,
                answers: [
                    { answer_text: '', is_correct: true },
                    { answer_text: '', is_correct: false },
                    { answer_text: '', is_correct: false },
                    { answer_text: '', is_correct: false }
                ]
            })));
        } else {
            setQuestionsList(existingQuestions);
        }
        setShowQuizModal(true);
    };

    const submitQuiz = (e) => {
        e.preventDefault();
        if (questionsList.length < 5) {
            alert('Practice quiz must contain at least 5 questions.');
            return;
        }

        // Validate
        for (let i = 0; i < questionsList.length; i++) {
            const q = questionsList[i];
            if (!q.question_text.trim()) {
                alert(`Question ${i + 1} has empty text.`);
                return;
            }

            const type = q.interaction_type || 'multiple_choice';
            if (type !== 'multiple_choice') {
                continue;
            }

            let correctCount = 0;
            for (let j = 0; j < (q.answers || []).length; j++) {
                if (!q.answers[j].answer_text.trim()) {
                    alert(`Choice option ${j + 1} for Question ${i + 1} is empty.`);
                    return;
                }
                if (q.answers[j].is_correct) correctCount++;
            }
            if (correctCount !== 1) {
                alert(`Question ${i + 1} must have exactly one correct answer selected.`);
                return;
            }
        }

        router.post(route('creator.modules.questions.store', activeModule.id), {
            questions: questionsList
        }, {
            onSuccess: () => setShowQuizModal(false),
            preserveScroll: true
        });
    };

    const addQuizQuestion = () => {
        setQuestionsList([...questionsList, {
            question_text: '',
            interaction_type: 'multiple_choice',
            metadata: null,
            answers: [
                { answer_text: '', is_correct: true },
                { answer_text: '', is_correct: false },
                { answer_text: '', is_correct: false },
                { answer_text: '', is_correct: false }
            ]
        }]);
    };

    const removeQuizQuestion = (idx) => {
        setQuestionsList(questionsList.filter((_, i) => i !== idx));
    };

    const updateQuizQuestionText = (idx, val) => {
        const list = [...questionsList];
        list[idx].question_text = val;
        setQuestionsList(list);
    };

    const updateQuizAnswerText = (qIdx, aIdx, val) => {
        const list = [...questionsList];
        list[qIdx].answers[aIdx].answer_text = val;
        setQuestionsList(list);
    };

    const setQuizCorrectAnswer = (qIdx, aIdx) => {
        const list = [...questionsList];
        list[qIdx].answers = list[qIdx].answers.map((ans, idx) => ({
            ...ans,
            is_correct: idx === aIdx
        }));
        setQuestionsList(list);
    };

    // ── Final Exam Handlers ────────────────────────────────
    const openExamEditor = () => {
        const existingQuestions = (certification.exam_questions || []).map(q => ({
            question_text: q.question_text,
            answers: (q.answers || []).map(a => ({
                answer_text: a.answer_text,
                is_correct: !!a.is_correct
            }))
        }));

        if (existingQuestions.length === 0) {
            setExamQuestionsList(Array.from({ length: 5 }, () => ({
                question_text: '',
                answers: [
                    { answer_text: '', is_correct: true },
                    { answer_text: '', is_correct: false },
                    { answer_text: '', is_correct: false },
                    { answer_text: '', is_correct: false }
                ]
            })));
        } else {
            setExamQuestionsList(existingQuestions);
        }
        setShowExamModal(true);
    };

    const submitExam = (e) => {
        e.preventDefault();
        if (examQuestionsList.length < 5) {
            alert('Final exam must contain at least 5 questions.');
            return;
        }

        // Validate
        for (let i = 0; i < examQuestionsList.length; i++) {
            const q = examQuestionsList[i];
            if (!q.question_text.trim()) {
                alert(`Question ${i + 1} has empty text.`);
                return;
            }
            let correctCount = 0;
            for (let j = 0; j < q.answers.length; j++) {
                if (!q.answers[j].answer_text.trim()) {
                    alert(`Choice option ${j + 1} for Question ${i + 1} is empty.`);
                    return;
                }
                if (q.answers[j].is_correct) correctCount++;
            }
            if (correctCount !== 1) {
                alert(`Question ${i + 1} must have exactly one correct answer selected.`);
                return;
            }
        }

        router.post(route('creator.certifications.exam-questions.store', certification.id), {
            questions: examQuestionsList
        }, {
            onSuccess: () => setShowExamModal(false),
            preserveScroll: true
        });
    };

    const addExamQuestion = () => {
        setExamQuestionsList([...examQuestionsList, {
            question_text: '',
            answers: [
                { answer_text: '', is_correct: true },
                { answer_text: '', is_correct: false },
                { answer_text: '', is_correct: false },
                { answer_text: '', is_correct: false }
            ]
        }]);
    };

    const removeExamQuestion = (idx) => {
        setExamQuestionsList(examQuestionsList.filter((_, i) => i !== idx));
    };

    const updateExamQuestionText = (idx, val) => {
        const list = [...examQuestionsList];
        list[idx].question_text = val;
        setExamQuestionsList(list);
    };

    const updateExamAnswerText = (qIdx, aIdx, val) => {
        const list = [...examQuestionsList];
        list[qIdx].answers[aIdx].answer_text = val;
        setExamQuestionsList(list);
    };

    const setExamCorrectAnswer = (qIdx, aIdx) => {
        const list = [...examQuestionsList];
        list[qIdx].answers = list[qIdx].answers.map((ans, idx) => ({
            ...ans,
            is_correct: idx === aIdx
        }));
        setExamQuestionsList(list);
    };

    const submitShellSettings = (e) => {
        e.preventDefault();

        const payload = {
            title: shellSettingsForm.data.title,
            description: shellSettingsForm.data.description,
            category: shellSettingsForm.data.category,
            difficulty: shellSettingsForm.data.difficulty,
            estimated_duration: estimatedDurationForStore(shellSettingsForm.data.estimated_duration),
            learning_objectives: shellSettingsForm.data.learning_objectives,
            price: shellSettingsForm.data.price === '' ? 0 : shellSettingsForm.data.price,
        };

        if (shellSettingsForm.data.cover_image) {
            router.post(route('creator.certifications.update', certification.id), {
                ...payload,
                cover_image: shellSettingsForm.data.cover_image,
                _method: 'put',
            }, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => shellSettingsForm.setData('cover_image', null),
                onError: (errors) => {
                    Object.entries(errors).forEach(([key, message]) => {
                        shellSettingsForm.setError(key, message);
                    });
                },
            });
            return;
        }

        router.put(route('creator.certifications.update', certification.id), payload, {
            preserveScroll: true,
            onError: (errors) => {
                Object.entries(errors).forEach(([key, message]) => {
                    shellSettingsForm.setError(key, message);
                });
            },
        });
    };

    const handleCoverChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        shellSettingsForm.setData('cover_image', file);
        if (file) {
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    // ── Submission validation ──────────────────────────────
    const quizOnlySandboxCount = sortedModules.filter(isQuizOnlySandbox).length;
    const canGenerateFinalExam = sortedModules.length >= MIN_MODULES && quizOnlySandboxCount >= MIN_QUIZ_ONLY_FOR_EXAM;

    const openGenerateFinalExam = () => {
        if (!canGenerateFinalExam) {
            setShowExamRequirementsModal(true);
            return;
        }

        setShowGenerateExamModal(true);
    };

    const applyGeneratedShortTest = (mockQuestions) => {
        setQuestionsList(mockQuestions);
        setShowQuizModal(true);
    };

    const applyGeneratedExam = (mockQuestions) => {
        setExamQuestionsList(mockQuestions);
        setShowExamModal(true);
    };

    const submitForReview = () => {
        if (sortedModules.length < MIN_MODULES) {
            alert(`Please configure at least ${MIN_MODULES} sandbox modules before submitting.`);
            return;
        }

        if (quizOnlySandboxCount < MIN_QUIZ_ONLY_SANDBOXES) {
            alert(`Please configure at least ${MIN_QUIZ_ONLY_SANDBOXES} quiz-only sandboxes (short test only, no uploaded materials).`);
            return;
        }

        for (const mod of sortedModules) {
            const totalComponents = (mod.contents || []).length + ((mod.questions || []).length > 0 ? 1 : 0);
            if (totalComponents === 0) {
                alert(`Sandbox "${mod.title}" must have at least one component (file or practice quiz) before submitting.`);
                return;
            }

            const qCount = (mod.questions || []).length;
            if (qCount > 0 && qCount < 5) {
                alert(`Practice quiz for Sandbox "${mod.title}" must have at least 5 questions.`);
                return;
            }
        }

        if ((certification.exam_questions || []).length < 5) {
            alert('Please configure the Final Exam with at least 5 questions before submitting.');
            return;
        }

        setShowSubmitModal(true);
    };

    const confirmSubmitForReview = () => {
        setShowSubmitModal(false);
        setIsSubmitting(true);
        router.post(route('creator.certifications.submit', certification.id), {}, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    // ── UI States & Metadata ───────────────────────────────
    const isEditable = ['draft', 'revision_required'].includes(certification.status);
    const examQuestionsCount = (certification.exam_questions || []).length;
    const modulesReady = sortedModules.length >= MIN_MODULES;
    const quizOnlyReady = quizOnlySandboxCount >= MIN_QUIZ_ONLY_SANDBOXES;
    const examReady = examQuestionsCount >= 5;
    const canSubmit = isEditable && modulesReady && quizOnlyReady && examReady;

    // Component sorting helpers
    const activeModuleComponents = activeModule
        ? [...(activeModule.contents || [])].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        : [];

    return (
        <CreatorLayout activeNav="shells" pageTitle={activeModule ? `Sandbox ${sortedModules.findIndex((m) => m.id === activeModuleId) + 1}` : certification.title}>
            <Head title={activeModule ? `Studio - ${activeModule.title}` : `Edit - ${certification.title}`} />

            {!activeModule ? (
                <>
                    <div className="admin-toolbar">
                        <CreatorStatusPill status={certification.status} className="creator-shell-status" />
                    </div>

                    {certification.status === 'revision_required' && certification.remarks ? (
                        <div className="admin-flash admin-flash--warning" style={{ marginBottom: '16px' }}>
                            <strong>Admin remarks:</strong> {certification.remarks}
                        </div>
                    ) : null}

                    {certification.status === 'denied' && certification.decline_reason ? (
                        <div className="admin-flash admin-flash--error" style={{ marginBottom: '16px' }}>
                            <strong>Reason for denial:</strong> {certification.decline_reason}
                        </div>
                    ) : null}

                    {isEditable ? (
                        <div className="admin-card admin-card--chunky" style={{ marginBottom: '20px' }}>
                            <div className="admin-card__header">
                                <h3>Shell details</h3>
                            </div>
                            <form onSubmit={submitShellSettings} className="admin-card__body">
                                <label className="admin-field">
                                    <span className="admin-field__label">Shell title *</span>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={shellSettingsForm.data.title}
                                        onChange={(e) => shellSettingsForm.setData('title', e.target.value)}
                                        required
                                    />
                                    {shellSettingsForm.errors.title ? (
                                        <p className="admin-field__hint" style={{ color: 'var(--admin-danger-text)' }}>{shellSettingsForm.errors.title}</p>
                                    ) : null}
                                </label>

                                <label className="admin-field">
                                    <span className="admin-field__label">Description *</span>
                                    <textarea
                                        rows={3}
                                        className="input-field"
                                        value={shellSettingsForm.data.description}
                                        onChange={(e) => shellSettingsForm.setData('description', e.target.value)}
                                        required
                                    />
                                    {shellSettingsForm.errors.description ? (
                                        <p className="admin-field__hint" style={{ color: 'var(--admin-danger-text)' }}>{shellSettingsForm.errors.description}</p>
                                    ) : null}
                                </label>

                                <div className="admin-form-grid">
                                    <label className="admin-field">
                                        <span className="admin-field__label">Category *</span>
                                        <select
                                            className="input-field"
                                            value={shellSettingsForm.data.category}
                                            onChange={(e) => shellSettingsForm.setData('category', e.target.value)}
                                            required
                                        >
                                            <option value="">Select category</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Business">Business</option>
                                            <option value="Design">Design</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Demo">Demo</option>
                                        </select>
                                    </label>
                                    <label className="admin-field">
                                        <span className="admin-field__label">Difficulty *</span>
                                        <select
                                            className="input-field"
                                            value={shellSettingsForm.data.difficulty}
                                            onChange={(e) => shellSettingsForm.setData('difficulty', e.target.value)}
                                            required
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </label>
                                </div>

                                <label className="admin-field">
                                    <span className="admin-field__label">Estimated time (hours)</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        className="input-field"
                                        value={shellSettingsForm.data.estimated_duration}
                                        onChange={(e) => shellSettingsForm.setData('estimated_duration', e.target.value)}
                                        placeholder="e.g. 120"
                                    />
                                    {durationPreview ? (
                                        <p className="admin-field__hint">Displays as: <strong>{durationPreview}</strong></p>
                                    ) : null}
                                </label>

                                <label className="admin-field">
                                    <span className="admin-field__label">Learning objectives</span>
                                    <textarea
                                        rows={2}
                                        className="input-field"
                                        value={shellSettingsForm.data.learning_objectives}
                                        onChange={(e) => shellSettingsForm.setData('learning_objectives', e.target.value)}
                                        placeholder="What will students learn?"
                                    />
                                </label>

                                <div className="admin-form-grid">
                                    <label className="admin-field">
                                        <span className="admin-field__label">Price (PHP)</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="input-field"
                                            value={shellSettingsForm.data.price}
                                            onChange={(e) => shellSettingsForm.setData('price', e.target.value)}
                                        />
                                    </label>
                                    <label className="admin-field">
                                        <span className="admin-field__label">Cover image</span>
                                        <input type="file" accept="image/*" className="input-field" onChange={handleCoverChange} />
                                    </label>
                                </div>
                                {coverPreview ? (
                                    <div style={{ marginTop: '12px' }}>
                                        <img src={coverPreview} alt="Shell cover preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--admin-chrome-divider)' }} />
                                    </div>
                                ) : certification.thumbnail_url ? (
                                    <div style={{ marginTop: '12px' }}>
                                        <img src={certification.thumbnail_url} alt="Current shell cover" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--admin-chrome-divider)' }} />
                                    </div>
                                ) : null}
                                {shellSettingsForm.errors.price ? (
                                    <p className="admin-field__hint" style={{ color: 'var(--admin-danger-text)' }}>{shellSettingsForm.errors.price}</p>
                                ) : null}
                                {shellSettingsForm.errors.cover_image ? (
                                    <p className="admin-field__hint" style={{ color: 'var(--admin-danger-text)' }}>{shellSettingsForm.errors.cover_image}</p>
                                ) : null}
                                <div style={{ marginTop: '16px' }}>
                                    <button type="submit" disabled={shellSettingsForm.processing} className="admin-btn admin-btn--primary">
                                        {shellSettingsForm.processing ? 'Saving…' : 'Save shell details'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : null}

                    <div className="creator-editor-grid creator-editor-grid--overview">
                        <div className="admin-card admin-card--chunky">
                            <div className="admin-card__header">
                                <h3>Course sandboxes</h3>
                                {isEditable ? (
                                    <button type="button" onClick={() => setShowAddSandboxModal(true)} className="admin-btn admin-btn--primary admin-btn--sm">
                                        <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
                                        Add sandbox
                                    </button>
                                ) : null}
                            </div>
                            <div className="admin-card__body admin-card__body--flush">
                                {sortedModules.length > 0 ? (
                                    sortedModules.map((mod, index) => {
                                        const componentCount = (mod.contents || []).length;
                                        const hasQuiz = (mod.questions || []).length > 0;
                                        return (
                                            <div key={mod.id} className="admin-list-row">
                                                <div>
                                                    <p className="admin-list-row__title">#{index + 1} {mod.title}</p>
                                                    <p className="admin-list-row__meta">
                                                        {componentCount} materials · {hasQuiz ? `${(mod.questions || []).length} quiz Qs` : 'No quiz'}
                                                        {isQuizOnlySandbox(mod) ? ' · Quiz-only' : ''}
                                                    </p>
                                                </div>
                                                <div className="admin-btn-group">
                                                    {isEditable ? (
                                                        <>
                                                            <button type="button" disabled={index === 0} onClick={() => moveModule(index, 'up')} className="admin-btn admin-btn--ghost admin-btn--sm" aria-label="Move up">
                                                                <ChevronUp size={16} strokeWidth={2.25} />
                                                            </button>
                                                            <button type="button" disabled={index === sortedModules.length - 1} onClick={() => moveModule(index, 'down')} className="admin-btn admin-btn--ghost admin-btn--sm" aria-label="Move down">
                                                                <ChevronDown size={16} strokeWidth={2.25} />
                                                            </button>
                                                        </>
                                                    ) : null}
                                                    <button type="button" onClick={() => setActiveModuleId(mod.id)} className="admin-btn admin-btn--secondary admin-btn--sm">
                                                        Edit sandbox
                                                    </button>
                                                    {isEditable ? (
                                                        <button type="button" onClick={() => deleteModule(mod.id)} className="admin-btn admin-btn--danger admin-btn--sm" aria-label="Delete">
                                                            <X size={16} strokeWidth={2.25} />
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="admin-empty">
                                        <p>No sandboxes yet. Add your first sandbox to begin.</p>
                                    </div>
                                )}
                            </div>
                            <div className="admin-card__header" style={{ borderTop: '2px solid var(--admin-chrome-divider)' }}>
                                <div>
                                    <h3>Final exam</h3>
                                    <p className="admin-list-row__meta">Minimum 5 questions required for approval.</p>
                                </div>
                                <div className="admin-btn-group">
                                    <AdminBadge type="status" value={examReady ? 'published' : 'draft'} label={examQuestionsCount > 0 ? `${examQuestionsCount} Qs` : 'Not configured'} />
                                    {isEditable ? (
                                        <button type="button" onClick={openGenerateFinalExam} className="admin-btn admin-btn--secondary admin-btn--sm">
                                            <Sparkles size={16} strokeWidth={2.25} aria-hidden="true" />
                                            Generate final exam
                                        </button>
                                    ) : null}
                                    <button type="button" onClick={openExamEditor} className="admin-btn admin-btn--primary admin-btn--sm">
                                        {examQuestionsCount > 0 ? 'Edit exam' : 'Configure exam'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="admin-card admin-card--chunky">
                            <div className="admin-card__header">
                                <h3>Submit for approval</h3>
                            </div>
                            <div className="admin-card__body">
                                <p className="admin-text-muted">Complete the checklist before submitting.</p>
                                <ul className="admin-checklist" style={{ margin: '16px 0' }}>
                                    <li className={modulesReady ? 'admin-checklist__done' : ''}>
                                        {modulesReady ? '✓' : '○'} At least {MIN_MODULES} sandboxes ({sortedModules.length}/{MIN_MODULES})
                                    </li>
                                    <li className={quizOnlyReady ? 'admin-checklist__done' : ''}>
                                        {quizOnlyReady ? '✓' : '○'} At least {MIN_QUIZ_ONLY_SANDBOXES} quiz-only sandboxes ({quizOnlySandboxCount}/{MIN_QUIZ_ONLY_SANDBOXES})
                                    </li>
                                    <li className={examReady ? 'admin-checklist__done' : ''}>
                                        {examReady ? '✓' : '○'} Final exam configured (min 5 Qs)
                                    </li>
                                </ul>
                                <button type="button" onClick={submitForReview} disabled={!canSubmit || isSubmitting} className="admin-btn admin-btn--primary admin-btn--block">
                                    {isSubmitting ? 'Submitting…' : 'Submit for review'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="admin-toolbar">
                        <button type="button" onClick={() => setActiveModuleId(null)} className="admin-btn admin-btn--back admin-btn--sm" aria-label="Back">
                            <ArrowLeft size={18} strokeWidth={2.25} />
                            Back to shell
                        </button>
                        <span className="admin-badge admin-badge--draft">
                            {certification.title} · Sandbox {sortedModules.findIndex((m) => m.id === activeModuleId) + 1}: {activeModule?.title}
                        </span>
                    </div>

                    <div className="creator-editor-grid creator-editor-grid--studio">
                        <div className="admin-card admin-card--chunky">
                            <div className="admin-card__header">
                                <h3>Module information &amp; rules</h3>
                            </div>
                            <form onSubmit={isEditable ? submitUpdateModule : (e) => e.preventDefault()} className="admin-card__body">
                                <label className="admin-field">
                                    <span className="admin-field__label">Module title</span>
                                    <input
                                        type="text"
                                        value={updateModuleForm.data.title}
                                        onChange={(e) => updateModuleForm.setData('title', e.target.value)}
                                        disabled={!isEditable}
                                        required
                                        className="input-field"
                                    />
                                </label>
                                <label className="admin-field">
                                    <span className="admin-field__label">Description</span>
                                    <textarea
                                        rows={3}
                                        value={updateModuleForm.data.description}
                                        onChange={(e) => updateModuleForm.setData('description', e.target.value)}
                                        disabled={!isEditable}
                                        className="input-field"
                                        placeholder="Optional sandbox brief…"
                                    />
                                </label>
                                <label className="admin-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={updateModuleForm.data.strict_completion}
                                        onChange={(e) => updateModuleForm.setData('strict_completion', e.target.checked)}
                                        disabled={!isEditable}
                                    />
                                    Strict completion of slides and video duration
                                </label>
                                {isEditable ? (
                                    <button type="submit" disabled={updateModuleForm.processing} className="admin-btn admin-btn--primary" style={{ marginTop: '16px' }}>
                                        {updateModuleForm.processing ? 'Saving…' : 'Save module changes'}
                                    </button>
                                ) : null}
                            </form>
                        </div>

                        <div className="admin-card admin-card--chunky">
                            <div className="admin-card__header">
                                <h3>Module components</h3>
                                {isEditable ? (
                                    <button type="button" onClick={() => setShowAddComponentModal(true)} className="admin-btn admin-btn--primary admin-btn--sm">
                                        <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
                                        Add component
                                    </button>
                                ) : null}
                            </div>
                            <div className="admin-card__body admin-card__body--flush">
                                {activeModuleComponents.map((comp, idx) => (
                                    <div key={comp.id} className="admin-list-row">
                                        <div className="admin-list-row__title-wrap">
                                            <GripVertical size={16} strokeWidth={2} className="admin-list-row__grip" aria-hidden="true" />
                                            <span className="admin-list-row__title">{comp.title || COMPONENT_TYPE_LABELS[comp.content_type] || comp.content_type}</span>
                                        </div>
                                        <div className="admin-btn-group">
                                            {isEditable ? (
                                                <>
                                                    <button type="button" disabled={idx === 0} onClick={() => moveComponent(idx, 'up')} className="admin-btn admin-btn--ghost admin-btn--sm" aria-label="Move up">
                                                        <ChevronUp size={16} strokeWidth={2.25} />
                                                    </button>
                                                    <button type="button" disabled={idx === activeModuleComponents.length - 1} onClick={() => moveComponent(idx, 'down')} className="admin-btn admin-btn--ghost admin-btn--sm" aria-label="Move down">
                                                        <ChevronDown size={16} strokeWidth={2.25} />
                                                    </button>
                                                </>
                                            ) : null}
                                            <button
                                                type="button"
                                                onClick={() => setPreviewItem({ type: comp.content_type, title: comp.title, file_url: comp.file_url })}
                                                className="admin-btn admin-btn--ghost admin-btn--sm"
                                                aria-label="Preview"
                                            >
                                                <Eye size={16} strokeWidth={2.25} />
                                            </button>
                                            {isEditable ? (
                                                <button type="button" onClick={() => deleteComponent(comp.id)} className="admin-btn admin-btn--danger admin-btn--sm" aria-label="Delete">
                                                    <X size={16} strokeWidth={2.25} />
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}

                                <div className="admin-list-row">
                                    <div className="admin-list-row__title-wrap">
                                        <GripVertical size={16} strokeWidth={2} className="admin-list-row__grip" aria-hidden="true" />
                                        <span className="admin-list-row__title">Short test</span>
                                    </div>
                                    <div className="admin-btn-group">
                                        <AdminBadge
                                            type="status"
                                            value={(activeModule.questions || []).length >= 5 ? 'published' : 'draft'}
                                            label={(activeModule.questions || []).length > 0 ? `${(activeModule.questions || []).length} Qs` : 'Empty'}
                                        />
                                        {(activeModule.questions || []).length > 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => setPreviewItem({ type: 'quiz', title: 'Short test', questions: activeModule.questions })}
                                                className="admin-btn admin-btn--ghost admin-btn--sm"
                                                aria-label="Preview quiz"
                                            >
                                                <Eye size={16} strokeWidth={2.25} />
                                            </button>
                                        ) : null}
                                        {isEditable ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowGenerateShortTestModal(true)}
                                                className="admin-btn admin-btn--secondary admin-btn--sm"
                                            >
                                                <Sparkles size={16} strokeWidth={2.25} aria-hidden="true" />
                                                Generate short test
                                            </button>
                                        ) : null}
                                        <button type="button" onClick={openQuizEditor} className="admin-btn admin-btn--secondary admin-btn--sm" aria-label="Edit quiz">
                                            <Pencil size={16} strokeWidth={2.25} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {isEditable ? (
                                <div className="admin-card__footer">
                                    <button type="button" onClick={() => setShowAddComponentModal(true)} className="admin-btn admin-btn--primary">
                                        <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
                                        Add module component
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </>
            )}

            <AdminModal
                show={showAddSandboxModal}
                onClose={() => setShowAddSandboxModal(false)}
                title="Add new sandbox"
                footer={(
                    <>
                        <button type="button" onClick={() => setShowAddSandboxModal(false)} className="admin-btn admin-btn--ghost">Cancel</button>
                        <button type="submit" form="add-sandbox-form" disabled={addSandboxForm.processing} className="admin-btn admin-btn--primary">
                            {addSandboxForm.processing ? 'Creating…' : 'Create sandbox'}
                        </button>
                    </>
                )}
            >
                <form id="add-sandbox-form" onSubmit={submitAddSandbox}>
                    <label className="admin-field">
                        <span className="admin-field__label">Sandbox title</span>
                        <input type="text" value={addSandboxForm.data.title} onChange={(e) => addSandboxForm.setData('title', e.target.value)} required className="input-field" placeholder="e.g. Introduction to JSX" />
                    </label>
                    <label className="admin-field">
                        <span className="admin-field__label">Description</span>
                        <textarea rows={2} value={addSandboxForm.data.description} onChange={(e) => addSandboxForm.setData('description', e.target.value)} className="input-field" placeholder="Briefly state the goal of this sandbox" />
                    </label>
                </form>
            </AdminModal>

            <AdminModal
                show={showAddComponentModal}
                onClose={() => setShowAddComponentModal(false)}
                title="Add a module component"
                size="lg"
                footer={(
                    <>
                        <button type="button" onClick={() => setShowAddComponentModal(false)} className="admin-btn admin-btn--ghost">Cancel</button>
                        <button type="submit" form="add-component-form" disabled={addComponentForm.processing} className="admin-btn admin-btn--primary">
                            {addComponentForm.processing ? 'Uploading…' : 'Proceed'}
                        </button>
                    </>
                )}
            >
                <form id="add-component-form" onSubmit={submitAddComponent}>
                    <label className="admin-field">
                        <span className="admin-field__label">Component type</span>
                        <select value={addComponentForm.data.type} onChange={(e) => addComponentForm.setData('type', e.target.value)} className="input-field">
                            <option value="ppt">PowerPoint (PPT/PPTX)</option>
                            <option value="pdf">Document (PDF)</option>
                            <option value="video">Local MP4 video</option>
                            <option value="youtube_embed">YouTube embed URL</option>
                        </select>
                    </label>
                    <label className="admin-field">
                        <span className="admin-field__label">Title</span>
                        <input type="text" value={addComponentForm.data.title} onChange={(e) => addComponentForm.setData('title', e.target.value)} required className="input-field" placeholder="e.g. Module 1.PPTX" />
                    </label>
                    {addComponentForm.data.type === 'youtube_embed' ? (
                        <label className="admin-field">
                            <span className="admin-field__label">YouTube video link</span>
                            <input type="url" value={addComponentForm.data.youtube_url} onChange={(e) => addComponentForm.setData('youtube_url', e.target.value)} required className="input-field" placeholder="Paste YouTube video link" />
                        </label>
                    ) : (
                        <label className="admin-field">
                            <span className="admin-field__label">File</span>
                            <input type="file" onChange={(e) => addComponentForm.setData('file', e.target.files[0])} required className="input-field" />
                            <p className="admin-field__hint">Accepted: PPTX, PDF, and video files.</p>
                        </label>
                    )}
                </form>
            </AdminModal>

            <AdminModal
                show={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                title="Submit for approval"
                footer={(
                    <>
                        <button type="button" onClick={() => setShowSubmitModal(false)} className="admin-btn admin-btn--ghost">Cancel</button>
                        <button type="button" onClick={confirmSubmitForReview} className="admin-btn admin-btn--primary">Proceed</button>
                    </>
                )}
            >
                <p>Submit this certification for approval? You will not be able to edit it until review is complete.</p>
            </AdminModal>

            <AdminModal
                show={!!pendingDeleteModuleId}
                onClose={() => setPendingDeleteModuleId(null)}
                title="Delete sandbox"
                footer={(
                    <>
                        <button type="button" onClick={() => setPendingDeleteModuleId(null)} className="admin-btn admin-btn--ghost">Cancel</button>
                        <button type="button" onClick={confirmDeleteModule} className="admin-btn admin-btn--danger">Delete</button>
                    </>
                )}
            >
                <p>Are you sure you want to delete this sandbox and all of its components?</p>
            </AdminModal>

            <AdminModal
                show={!!pendingDeleteComponentId}
                onClose={() => setPendingDeleteComponentId(null)}
                title="Delete component"
                footer={(
                    <>
                        <button type="button" onClick={() => setPendingDeleteComponentId(null)} className="admin-btn admin-btn--ghost">Cancel</button>
                        <button type="button" onClick={confirmDeleteComponent} className="admin-btn admin-btn--danger">Delete</button>
                    </>
                )}
            >
                <p>Are you sure you want to delete this learning material?</p>
            </AdminModal>

            <GenerateQuizModal
                show={showGenerateShortTestModal}
                onClose={() => setShowGenerateShortTestModal(false)}
                mode="short_test"
                onApplyMock={applyGeneratedShortTest}
            />

            <GenerateQuizModal
                show={showGenerateExamModal}
                onClose={() => setShowGenerateExamModal(false)}
                mode="final_exam"
                onApplyMock={applyGeneratedExam}
            />

            <AdminModal
                show={showExamRequirementsModal}
                onClose={() => setShowExamRequirementsModal(false)}
                title="Final exam requirements"
                footer={(
                    <button type="button" onClick={() => setShowExamRequirementsModal(false)} className="admin-btn admin-btn--primary">
                        Got it
                    </button>
                )}
            >
                <p className="admin-text-muted">
                    Before generating a final exam draft, complete the shell structure below.
                </p>
                <ul className="admin-checklist" style={{ marginTop: '16px' }}>
                    <li className={sortedModules.length >= MIN_MODULES ? 'admin-checklist__done' : ''}>
                        {sortedModules.length >= MIN_MODULES ? '✓' : '○'} At least {MIN_MODULES} sandboxes ({sortedModules.length}/{MIN_MODULES})
                    </li>
                    <li className={quizOnlySandboxCount >= MIN_QUIZ_ONLY_FOR_EXAM ? 'admin-checklist__done' : ''}>
                        {quizOnlySandboxCount >= MIN_QUIZ_ONLY_FOR_EXAM ? '✓' : '○'} At least {MIN_QUIZ_ONLY_FOR_EXAM} quiz-only sandboxes ({quizOnlySandboxCount}/{MIN_QUIZ_ONLY_FOR_EXAM})
                    </li>
                </ul>
            </AdminModal>

            <AdminModal
                show={!!previewItem}
                onClose={() => setPreviewItem(null)}
                title={previewItem ? `Preview: ${previewItem.title}` : ''}
                size="xl"
                footer={(
                    <button type="button" onClick={() => setPreviewItem(null)} className="admin-btn admin-btn--primary">Close</button>
                )}
            >
                <ModuleContentPreview item={previewItem} />
            </AdminModal>

            <AdminModal
                show={showQuizModal}
                onClose={() => setShowQuizModal(false)}
                title="Modify short test"
                size="xl"
                footer={(
                    <>
                        <button type="button" onClick={() => setShowQuizModal(false)} className="admin-btn admin-btn--ghost">Cancel</button>
                        <button type="submit" form="quiz-form" className="admin-btn admin-btn--primary">Finish</button>
                    </>
                )}
            >
                <form id="quiz-form" onSubmit={submitQuiz}>
                    {questionsList.map((q, qIdx) => (
                        <div key={qIdx} className="admin-question-block">
                            <div className="admin-toolbar" style={{ marginBottom: '8px' }}>
                                <strong>Question {qIdx + 1}</strong>
                                {questionsList.length > 5 ? (
                                    <button type="button" onClick={() => removeQuizQuestion(qIdx)} className="admin-btn admin-btn--ghost admin-btn--sm">Remove</button>
                                ) : null}
                            </div>
                            <CreatorQuestionFields
                                question={q}
                                onChange={(next) => {
                                    const list = [...questionsList];
                                    list[qIdx] = next;
                                    setQuestionsList(list);
                                }}
                            />
                        </div>
                    ))}
                    <button type="button" onClick={addQuizQuestion} className="admin-btn admin-btn--secondary admin-btn--block" style={{ marginTop: '12px' }}>+ Add question</button>
                </form>
            </AdminModal>

            <AdminModal
                show={showExamModal}
                onClose={() => setShowExamModal(false)}
                title="Final exam"
                size="xl"
                footer={(
                    <>
                        <button type="button" onClick={() => setShowExamModal(false)} className="admin-btn admin-btn--ghost">Cancel</button>
                        <button type="submit" form="exam-form" className="admin-btn admin-btn--primary">Finish</button>
                    </>
                )}
            >
                <form id="exam-form" onSubmit={submitExam}>
                    {examQuestionsList.map((q, qIdx) => (
                        <div key={qIdx} className="admin-question-block">
                            <div className="admin-toolbar" style={{ marginBottom: '8px' }}>
                                <strong>Question {qIdx + 1}</strong>
                                {examQuestionsList.length > 5 ? (
                                    <button type="button" onClick={() => removeExamQuestion(qIdx)} className="admin-btn admin-btn--ghost admin-btn--sm">Remove</button>
                                ) : null}
                            </div>
                            <label className="admin-field">
                                <span className="admin-field__label">Question</span>
                                <input type="text" value={q.question_text} onChange={(e) => updateExamQuestionText(qIdx, e.target.value)} className="input-field" required />
                            </label>
                            {q.answers.map((ans, aIdx) => (
                                <label key={aIdx} className="admin-field">
                                    <span className="admin-field__label">Choice {aIdx + 1}{ans.is_correct ? ' (correct)' : ''}</span>
                                    <div className="admin-inline-choice">
                                        <input type="radio" name={`exam-correct-${qIdx}`} checked={ans.is_correct} onChange={() => setExamCorrectAnswer(qIdx, aIdx)} />
                                        <input type="text" value={ans.answer_text} onChange={(e) => updateExamAnswerText(qIdx, aIdx, e.target.value)} className="input-field" required />
                                    </div>
                                </label>
                            ))}
                        </div>
                    ))}
                    <button type="button" onClick={addExamQuestion} className="admin-btn admin-btn--secondary admin-btn--block" style={{ marginTop: '12px' }}>+ Add exam question</button>
                </form>
            </AdminModal>
        </CreatorLayout>
    );
}
