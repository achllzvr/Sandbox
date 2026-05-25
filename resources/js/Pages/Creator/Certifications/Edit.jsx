import React, { useState, useEffect } from 'react';
import CreatorLayout from '@/Layouts/CreatorLayout';
import { Head, useForm, router } from '@inertiajs/react';

const STATUS_STYLE = {
    draft:              { border: 'border-emerald-400', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    revision_required:  { border: 'border-amber-400',   bg: 'bg-amber-50',   badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
    denied:             { border: 'border-red-400',      bg: 'bg-red-50',     badge: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
    pending:            { border: 'border-sky-400',      bg: 'bg-sky-50',     badge: 'bg-sky-100 text-sky-700',       dot: 'bg-sky-500' },
    approved:           { border: 'border-violet-400',   bg: 'bg-violet-50',  badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
};

const COMPONENT_TYPE_META = {
    video: { icon: '🎬', label: 'Video' },
    presentation: { icon: '📄', label: 'Presentation (PPT)' },
    document: { icon: '📋', label: 'Document (PDF)' },
    youtube_embed: { icon: '🎥', label: 'YouTube Embed' },
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
    const [previewItem, setPreviewItem] = useState(null); // { type, title, file_url, questions }

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
        type: 'ppt', // 'ppt', 'video', 'pdf', 'youtube_embed'
        file: null,
        youtube_url: ''
    });

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
        if (confirm('Are you sure you want to delete this Sandbox and all of its components?')) {
            router.delete(route('creator.modules.destroy', modId), {
                onSuccess: () => {
                    if (activeModuleId === modId) {
                        setActiveModuleId(null);
                    }
                },
                preserveScroll: true
            });
        }
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
        if (confirm('Are you sure you want to delete this learning material?')) {
            router.delete(route('creator.modules.contents.destroy', [activeModule.id, contentId]), {
                preserveScroll: true
            });
        }
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
            answers: (q.answers || []).map(a => ({
                answer_text: a.answer_text,
                is_correct: !!a.is_correct
            }))
        }));

        if (existingQuestions.length === 0) {
            setQuestionsList(Array.from({ length: 5 }, () => ({
                question_text: '',
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

    // ── Submission validation ──────────────────────────────
    const submitForReview = () => {
        if (sortedModules.length === 0) {
            alert('Please configure at least one Sandbox module before submitting.');
            return;
        }

        for (let mod of sortedModules) {
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

        if (confirm('Submit this certification for approval? You will not be able to edit it until review is complete.')) {
            setIsSubmitting(true);
            router.post(route('creator.certifications.submit', certification.id), {}, {
                onFinish: () => setIsSubmitting(false)
            });
        }
    };

    // ── UI States & Metadata ───────────────────────────────
    const isEditable = ['draft', 'revision_required'].includes(certification.status);
    const ss = STATUS_STYLE[certification.status] || STATUS_STYLE.draft;
    const examQuestionsCount = (certification.exam_questions || []).length;

    // Component sorting helpers
    const activeModuleComponents = activeModule
        ? [...(activeModule.contents || [])].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        : [];

    return (
        <CreatorLayout pageTitle={activeModule ? `Creator Studio: ${activeModule.title}` : `Edit Shell: ${certification.title}`}>
            <Head title={activeModule ? `Studio - ${activeModule.title}` : `Edit - ${certification.title}`} />

            <div className="space-y-6 flex-grow flex flex-col pb-12">
                {/* ── Status Header Card ── */}
                <div className={`rounded-2xl border-l-4 ${ss.border} bg-white shadow-sm shadow-slate-200/60 p-6`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{certification.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-stone-500">
                                <span>Status:</span>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${ss.badge}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                                    {certification.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                </span>
                            </div>
                        </div>
                    </div>

                    {certification.status === 'revision_required' && certification.remarks && (
                        <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200/80 p-4">
                            <p className="text-sm font-semibold text-amber-800 flex items-center gap-1.5">
                                ⚠️ Admin Remarks for Revision
                            </p>
                            <p className="text-sm text-amber-700 mt-1.5 leading-relaxed">{certification.remarks}</p>
                        </div>
                    )}

                    {certification.status === 'denied' && certification.decline_reason && (
                        <div className="mt-5 rounded-xl bg-red-50 border border-red-200/80 p-4">
                            <p className="text-sm font-semibold text-red-800 flex items-center gap-1.5">
                                🚫 Reason for Denial
                            </p>
                            <p className="text-sm text-red-700 mt-1.5 leading-relaxed">{certification.decline_reason}</p>
                        </div>
                    )}
                </div>

                {/* ── Main View (Sandboxes list) ────────────────────── */}
                {!activeModule ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sandboxes Panel */}
                        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/60 shadow-sm shadow-slate-200/60 p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    🏝️ Course Sandboxes (Modules)
                                </h3>
                                {isEditable && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAddSandboxModal(true)}
                                        className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                                    >
                                        + ADD SANDBOX
                                    </button>
                                )}
                            </div>

                            {sortedModules.length > 0 ? (
                                <div className="space-y-3">
                                    {sortedModules.map((mod, index) => {
                                        const componentCount = (mod.contents || []).length;
                                        const hasQuiz = (mod.questions || []).length > 0;
                                        return (
                                            <div
                                                key={mod.id}
                                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/10 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-4 min-w-0 flex-grow">
                                                    <span className="text-xs font-bold text-violet-500 bg-violet-50 px-2.5 py-1 rounded-lg w-10 text-center flex-shrink-0">
                                                        #{index + 1}
                                                    </span>
                                                    <div className="min-w-0 flex-grow">
                                                        <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-violet-600 transition-colors">
                                                            {mod.title}
                                                        </h4>
                                                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                                                            <span>📁 {componentCount} Materials</span>
                                                            <span>•</span>
                                                            <span>📝 {hasQuiz ? `${(mod.questions || []).length} Quiz Qs` : 'No Quiz'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 ml-4 flex-shrink-0">
                                                    {isEditable && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                disabled={index === 0}
                                                                onClick={() => moveModule(index, 'up')}
                                                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-650 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                                                            >
                                                                ▲
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={index === sortedModules.length - 1}
                                                                onClick={() => moveModule(index, 'down')}
                                                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-650 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                                                            >
                                                                ▼
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveModuleId(mod.id)}
                                                        className="px-3 py-2 rounded-xl text-xs font-bold text-violet-600 hover:bg-violet-50 border border-violet-100 hover:border-violet-200 transition-colors"
                                                    >
                                                        Edit Sandbox ✎
                                                    </button>
                                                    {isEditable && (
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteModule(mod.id)}
                                                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <span className="text-4xl mb-3">🏖️</span>
                                    <p className="text-sm text-slate-400 max-w-xs">
                                        No Sandboxes created yet. Click "+ ADD SANDBOX" to begin crafting this shell.
                                    </p>
                                </div>
                            )}

                            {/* Final Exam Section at Bottom */}
                            <div className="mt-8 border-t border-slate-100 pt-6">
                                <div className="rounded-2xl border border-violet-100 bg-violet-50/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                            🏆 FINAL EXAM (Sandcastle Exam)
                                        </h4>
                                        <p className="text-xs text-slate-500 max-w-md">
                                            A comprehensive assessment required for certification approval. Min 5 questions.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                            examQuestionsCount >= 5
                                                ? 'bg-violet-100 text-violet-700 border-violet-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {examQuestionsCount > 0 ? `${examQuestionsCount} Questions` : 'Not Configured'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={openExamEditor}
                                            className="px-3.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/15 hover:brightness-110 transition-all"
                                        >
                                            {examQuestionsCount > 0 ? 'Edit Exam' : 'Configure Exam'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Details / Submission Panel */}
                        <div className="flex flex-col gap-4 h-fit">
                            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">Submit for Approval</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Please fulfill the following checklist items.</p>
                                </div>

                                <div className="flex flex-col gap-2 text-[11px] font-medium">
                                    <span className={`flex items-center gap-2 ${
                                        sortedModules.length > 0 ? 'text-emerald-600' : 'text-slate-400'
                                    }`}>
                                        {sortedModules.length > 0 ? '✅' : '⚪'} At least 1 Sandbox Created
                                    </span>
                                    <span className={`flex items-center gap-2 ${
                                        examQuestionsCount >= 5 ? 'text-emerald-600' : 'text-slate-400'
                                    }`}>
                                        {examQuestionsCount >= 5 ? '✅' : '⚪'} Final Exam Configured (Min 5 Qs)
                                    </span>
                                </div>

                                <button
                                    onClick={submitForReview}
                                    disabled={!isEditable || isSubmitting || !sortedModules.length || examQuestionsCount < 5}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-violet-500/25 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none"
                                >
                                    {isSubmitting ? 'Submitting…' : 'Submit for Review'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // ── Sandbox Editor / Studio View (Picture 2) ───────────
                    <div className="space-y-6">
                        {/* Back Arrow Header */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setActiveModuleId(null)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                🏢 Back to Certification List
                            </button>
                            <h3 className="text-lg font-bold text-slate-800 mt-2 flex items-center gap-2">
                                🏖️ Sandbox creator studio
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Panel: Module Info & Rules */}
                            <div className="rounded-2xl bg-white border border-slate-200/60 shadow-sm p-6 space-y-5 h-fit">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                                    Module Information & Rules
                                </h3>

                                <form onSubmit={isEditable ? submitUpdateModule : e => e.preventDefault()} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-stone-500 mb-1">MODULE TITLE</label>
                                        <input
                                            type="text"
                                            value={updateModuleForm.data.title}
                                            onChange={e => updateModuleForm.setData('title', e.target.value)}
                                            disabled={!isEditable}
                                            required
                                            className="block w-full rounded-xl border-slate-200 text-sm text-slate-850 shadow-sm focus:border-violet-400 focus:ring-violet-400 transition-all disabled:opacity-60"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-stone-500 mb-1">DESCRIPTION</label>
                                        <textarea
                                            rows="3"
                                            value={updateModuleForm.data.description}
                                            onChange={e => updateModuleForm.setData('description', e.target.value)}
                                            disabled={!isEditable}
                                            className="block w-full rounded-xl border-slate-200 text-sm text-slate-850 shadow-sm focus:border-violet-400 focus:ring-violet-400 transition-all disabled:opacity-60"
                                            placeholder="Optional sandbox brief..."
                                        />
                                    </div>

                                    <div className="flex items-start gap-2.5 pt-2">
                                        <input
                                            type="checkbox"
                                            id="strict_completion"
                                            checked={updateModuleForm.data.strict_completion}
                                            onChange={e => updateModuleForm.setData('strict_completion', e.target.checked)}
                                            disabled={!isEditable}
                                            className="text-violet-600 focus:ring-violet-450 w-4 h-4 rounded mt-0.5"
                                        />
                                        <label htmlFor="strict_completion" className="text-xs text-slate-600 font-medium select-none cursor-pointer">
                                            Strict Completion of Slides and Video duration
                                        </label>
                                    </div>

                                    {isEditable && (
                                        <button
                                            type="submit"
                                            disabled={updateModuleForm.processing}
                                            className="w-full py-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                                        >
                                            {updateModuleForm.processing ? 'Saving changes...' : 'SAVE MODULE CHANGES'}
                                        </button>
                                    )}
                                </form>
                            </div>

                            {/* Right Panel: Module Components */}
                            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/60 shadow-sm p-6 flex flex-col">
                                <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                                        Module Components
                                    </h3>
                                    {isEditable && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAddComponentModal(true)}
                                            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                                        >
                                            + ADD MODULE COMPONENT
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-3 flex-grow">
                                    {activeModuleComponents.map((comp, idx) => {
                                        const meta = COMPONENT_TYPE_META[comp.content_type] || { icon: '📁', label: comp.content_type };
                                        return (
                                            <div
                                                key={comp.id}
                                                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3.5 min-w-0 flex-grow">
                                                    <span className="text-xl flex-shrink-0">{meta.icon}</span>
                                                    <div className="min-w-0 flex-grow">
                                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{comp.title}</h4>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                            {meta.label}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2.5 ml-4 flex-shrink-0">
                                                    {isEditable && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                disabled={idx === 0}
                                                                onClick={() => moveComponent(idx, 'up')}
                                                                className="p-1.5 rounded bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 disabled:opacity-20"
                                                            >
                                                                ▲
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={idx === activeModuleComponents.length - 1}
                                                                onClick={() => moveComponent(idx, 'down')}
                                                                className="p-1.5 rounded bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 disabled:opacity-20"
                                                            >
                                                                ▼
                                                            </button>
                                                        </>
                                                    )}
                                                    
                                                    {/* Eye / Preview icon */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewItem({
                                                            type: comp.content_type,
                                                            title: comp.title,
                                                            file_url: comp.file_url
                                                        })}
                                                        className="p-2 rounded-lg border border-slate-100 bg-white text-slate-650 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm"
                                                        title="Preview Learning Material"
                                                    >
                                                        👁 Preview
                                                    </button>

                                                    {isEditable && (
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteComponent(comp.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete component"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Practice Quiz / Short Test component card */}
                                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-violet-100 bg-violet-50/10">
                                        <div className="flex items-center gap-3.5 min-w-0 flex-grow">
                                            <span className="text-xl flex-shrink-0">📝</span>
                                            <div className="min-w-0 flex-grow">
                                                <h4 className="font-bold text-slate-800 text-sm leading-tight">Short Test</h4>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                    Practice Quiz
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 ml-4 flex-shrink-0">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                                (activeModule.questions || []).length >= 5
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : (activeModule.questions || []).length > 0
                                                        ? 'bg-amber-50 text-amber-700 border-amber-250'
                                                        : 'bg-stone-150 text-slate-500 border-stone-200'
                                            }`}>
                                                {(activeModule.questions || []).length > 0 ? `${(activeModule.questions || []).length} Qs` : 'Empty (Min 5 Qs)'}
                                            </span>

                                            {/* Preview Quiz */}
                                            {(activeModule.questions || []).length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewItem({
                                                        type: 'quiz',
                                                        title: 'Short Test Practice Quiz',
                                                        questions: activeModule.questions
                                                    })}
                                                    className="p-2 rounded-lg border border-slate-100 bg-white text-slate-650 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm"
                                                    title="Preview quiz questions"
                                                >
                                                    👁 Preview
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={openQuizEditor}
                                                className="px-3 py-2 bg-white hover:bg-violet-50 border border-violet-200 hover:border-violet-300 text-violet-650 rounded-xl text-xs font-bold transition-all shadow-sm"
                                            >
                                                {isEditable ? '✎ Edit Quiz' : 'View Quiz'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Add Sandbox Modal ── */}
                {showAddSandboxModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 text-sm">🏝️ Add New Sandbox</h3>
                                <button onClick={() => setShowAddSandboxModal(false)} className="text-slate-400 hover:text-slate-650 font-bold">✕</button>
                            </div>
                            <form onSubmit={submitAddSandbox} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-stone-500 mb-1">SANDBOX TITLE</label>
                                    <input
                                        type="text"
                                        value={addSandboxForm.data.title}
                                        onChange={e => addSandboxForm.setData('title', e.target.value)}
                                        placeholder="e.g. Introduction to JSX"
                                        required
                                        className="w-full text-sm rounded-xl border-slate-200 focus:border-violet-400 focus:ring-violet-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-stone-500 mb-1">DESCRIPTION</label>
                                    <textarea
                                        rows="2"
                                        value={addSandboxForm.data.description}
                                        onChange={e => addSandboxForm.setData('description', e.target.value)}
                                        placeholder="Briefly state the goal of this sandbox"
                                        className="w-full text-sm rounded-xl border-slate-200 focus:border-violet-400 focus:ring-violet-400 resize-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddSandboxModal(false)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={addSandboxForm.processing}
                                        className="px-5 py-2 bg-violet-600 hover:bg-violet-750 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                    >
                                        {addSandboxForm.processing ? 'Creating...' : 'Create Sandbox'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Add Component Modal ── */}
                {showAddComponentModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 text-sm">📁 Add Module Component</h3>
                                <button onClick={() => setShowAddComponentModal(false)} className="text-slate-400 hover:text-slate-650 font-bold">✕</button>
                            </div>
                            <form onSubmit={submitAddComponent} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-stone-500 mb-1">COMPONENT TYPE</label>
                                    <select
                                        value={addComponentForm.data.type}
                                        onChange={e => addComponentForm.setData('type', e.target.value)}
                                        className="block w-full rounded-xl border-slate-250 text-sm bg-slate-50 focus:border-violet-400 focus:ring-violet-400"
                                    >
                                        <option value="ppt">📄 PowerPoint (PPT/PPTX)</option>
                                        <option value="pdf">📋 Document (PDF)</option>
                                        <option value="video">🎬 Local MP4 Video</option>
                                        <option value="youtube_embed">🎥 YouTube Embed URL</option>
                                    </select>
                                    {addComponentForm.errors.type && <div className="text-red-500 text-xs mt-1 font-semibold">{addComponentForm.errors.type}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-stone-500 mb-1">TITLE</label>
                                    <input
                                        type="text"
                                        value={addComponentForm.data.title}
                                        onChange={e => addComponentForm.setData('title', e.target.value)}
                                        placeholder="e.g. Module 1.PPTX"
                                        required
                                        className="w-full text-sm rounded-xl border-slate-200 focus:border-violet-400 focus:ring-violet-400"
                                    />
                                    {addComponentForm.errors.title && <div className="text-red-500 text-xs mt-1 font-semibold">{addComponentForm.errors.title}</div>}
                                </div>

                                {addComponentForm.data.type === 'youtube_embed' ? (
                                    <div>
                                        <label className="block text-xs font-semibold text-stone-500 mb-1">YOUTUBE EMBED URL</label>
                                        <input
                                            type="url"
                                            value={addComponentForm.data.youtube_url}
                                            onChange={e => addComponentForm.setData('youtube_url', e.target.value)}
                                            placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                            required
                                            className="w-full text-sm rounded-xl border-slate-200 focus:border-violet-400 focus:ring-violet-400"
                                        />
                                        {addComponentForm.errors.youtube_url && <div className="text-red-500 text-xs mt-1 font-semibold">{addComponentForm.errors.youtube_url}</div>}
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-semibold text-stone-500 mb-1">FILE ATTACHMENT</label>
                                        <input
                                            type="file"
                                            onChange={e => addComponentForm.setData('file', e.target.files[0])}
                                            required
                                            className="block w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-violet-50 file:text-violet-600 hover:file:bg-violet-100"
                                        />
                                        {addComponentForm.errors.file && <div className="text-red-500 text-xs mt-1 font-semibold">{addComponentForm.errors.file}</div>}
                                    </div>
                                )}
                                
                                {Object.keys(addComponentForm.errors).length > 0 && (
                                    <div className="text-red-500 text-xs font-bold border border-red-200 bg-red-50 p-2 rounded-lg">
                                        Check the form for errors above.
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddComponentModal(false)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={addComponentForm.processing}
                                        className="px-5 py-2 bg-violet-600 hover:bg-violet-750 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                    >
                                        {addComponentForm.processing ? 'Uploading...' : 'Add Component'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Quiz Modal (Practice Quiz Builder) ── */}
                {showQuizModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in duration-150">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Manage Practice Quiz for "{activeModule?.title}"</h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Add practice multiple-choice questions. Min 5 questions required.</p>
                                </div>
                                <button onClick={() => setShowQuizModal(false)} className="text-slate-400 hover:text-slate-650 font-bold">✕</button>
                            </div>

                            <form onSubmit={submitQuiz} className="flex-grow overflow-y-auto p-6 space-y-6">
                                {questionsList.map((q, qIdx) => (
                                    <div key={qIdx} className="p-4 bg-slate-50 border border-slate-250 rounded-xl space-y-3 relative">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-750 bg-slate-200 px-2 py-0.5 rounded-md">Question {qIdx + 1}</span>
                                            {questionsList.length > 5 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuizQuestion(qIdx)}
                                                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                                                >
                                                    Remove Question
                                                </button>
                                            )}
                                        </div>

                                        <input
                                            type="text"
                                            value={q.question_text}
                                            onChange={e => updateQuizQuestionText(qIdx, e.target.value)}
                                            placeholder="Enter practice question text"
                                            className="w-full text-sm rounded-xl border-slate-200 focus:border-violet-400 focus:ring-violet-400"
                                            required
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                            {q.answers.map((ans, aIdx) => (
                                                <div key={aIdx} className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                                                    <input
                                                        type="radio"
                                                        name={`quiz-correct-${qIdx}`}
                                                        checked={ans.is_correct}
                                                        onChange={() => setQuizCorrectAnswer(qIdx, aIdx)}
                                                        className="text-violet-600 focus:ring-violet-450 w-4 h-4"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={ans.answer_text}
                                                        onChange={e => updateQuizAnswerText(qIdx, aIdx, e.target.value)}
                                                        placeholder={`Choice Option ${aIdx + 1}`}
                                                        className="flex-grow text-xs border-0 p-0 focus:ring-0 focus:border-0"
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addQuizQuestion}
                                    className="w-full py-3 border border-dashed border-violet-300 text-violet-600 hover:bg-violet-50 rounded-xl text-xs font-bold transition-all"
                                >
                                    + Add Quiz Question
                                </button>

                                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowQuizModal(false)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-violet-500/15 hover:brightness-110"
                                    >
                                        Save Quiz
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Final Exam Modal (Exam Builder) ── */}
                {showExamModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in duration-150">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Manage Final Exam (Sandcastle Exam)</h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Add comprehensive exam options. Min 5 questions required.</p>
                                </div>
                                <button onClick={() => setShowExamModal(false)} className="text-slate-400 hover:text-slate-650 font-bold">✕</button>
                            </div>

                            <form onSubmit={submitExam} className="flex-grow overflow-y-auto p-6 space-y-6">
                                {examQuestionsList.map((q, qIdx) => (
                                    <div key={qIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-750 bg-slate-200 px-2 py-0.5 rounded-md">Exam Question {qIdx + 1}</span>
                                            {examQuestionsList.length > 5 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeExamQuestion(qIdx)}
                                                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                                                >
                                                    Remove Question
                                                </button>
                                            )}
                                        </div>

                                        <input
                                            type="text"
                                            value={q.question_text}
                                            onChange={e => updateExamQuestionText(qIdx, e.target.value)}
                                            placeholder="Enter comprehensive question text"
                                            className="w-full text-sm rounded-xl border-slate-200 focus:border-violet-400 focus:ring-violet-455"
                                            required
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                            {q.answers.map((ans, aIdx) => (
                                                <div key={aIdx} className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                                                    <input
                                                        type="radio"
                                                        name={`exam-correct-${qIdx}`}
                                                        checked={ans.is_correct}
                                                        onChange={() => setExamCorrectAnswer(qIdx, aIdx)}
                                                        className="text-violet-600 focus:ring-violet-450 w-4 h-4"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={ans.answer_text}
                                                        onChange={e => updateExamAnswerText(qIdx, aIdx, e.target.value)}
                                                        placeholder={`Choice Option ${aIdx + 1}`}
                                                        className="flex-grow text-xs border-0 p-0 focus:ring-0 focus:border-0"
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addExamQuestion}
                                    className="w-full py-3 border border-dashed border-violet-300 text-violet-600 hover:bg-violet-50 rounded-xl text-xs font-bold transition-all"
                                >
                                    + Add Exam Question
                                </button>

                                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowExamModal(false)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-violet-500/15 hover:brightness-110"
                                    >
                                        Save Final Exam
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Component Preview Modal ── */}
                {previewItem && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in duration-150">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 text-sm">Preview Component: {previewItem.title}</h3>
                                <button onClick={() => setPreviewItem(null)} className="text-slate-400 hover:text-slate-650 font-bold">✕</button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-grow bg-slate-50 flex items-center justify-center">
                                {previewItem.type === 'youtube_embed' ? (
                                    <iframe
                                        src={previewItem.file_url}
                                        className="w-full aspect-video rounded-xl shadow border border-slate-200"
                                        allowFullScreen
                                    />
                                ) : previewItem.type === 'video' ? (
                                    <video
                                        src={`/storage/${previewItem.file_url}`}
                                        controls
                                        className="w-full rounded-xl shadow border border-slate-200 max-h-[60vh]"
                                    />
                                ) : previewItem.type === 'presentation' && previewItem.file_url ? (
                                    <iframe
                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + '/storage/' + previewItem.file_url)}`}
                                        className="w-full h-[500px] rounded-xl shadow border border-slate-200"
                                        frameBorder="0"
                                    />
                                ) : previewItem.type === 'document' && previewItem.file_url ? (
                                    <iframe
                                        src={`/storage/${previewItem.file_url}`}
                                        className="w-full h-[500px] rounded-xl shadow border border-slate-200"
                                    />
                                ) : previewItem.type === 'quiz' ? (
                                    <div className="w-full space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow">
                                        <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Practice Quiz Questions</h4>
                                        {(previewItem.questions || []).map((q, qIdx) => (
                                            <div key={q.id || qIdx} className="space-y-1.5 pt-2">
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Q{qIdx + 1}. {q.question_text}
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                                                    {(q.answers || []).map((ans, aIdx) => (
                                                        <div
                                                            key={ans.id || aIdx}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                                                                ans.is_correct
                                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                                                    : 'bg-slate-50 border-slate-200 text-slate-600'
                                                            }`}
                                                        >
                                                            {ans.answer_text} {ans.is_correct && '✓'}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <span className="text-4xl">📁</span>
                                        <p className="text-xs font-semibold text-slate-450 mt-2">Preview not available for this file type</p>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setPreviewItem(null)}
                                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CreatorLayout>
    );
}
