import React, { useState } from 'react';
import CreatorLayout from '@/Layouts/CreatorLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';

const TYPE_META = {
    ppt:           { icon: '📄', label: 'PPT' },
    document:      { icon: '📋', label: 'DOC' },
    youtube_video: { icon: '🎬', label: 'YouTube' },
};

const STATUS_STYLE = {
    draft:              { border: 'border-emerald-400', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    revision_required:  { border: 'border-amber-400',   bg: 'bg-amber-50',   badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
    denied:             { border: 'border-red-400',      bg: 'bg-red-50',     badge: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
    pending:            { border: 'border-sky-400',      bg: 'bg-sky-50',     badge: 'bg-sky-100 text-sky-700',       dot: 'bg-sky-500' },
    approved:           { border: 'border-violet-400',   bg: 'bg-violet-50',  badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
};

export default function Edit({ certification }) {
    // ── Forms & State ───────────────────────────────────────
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        type: 'ppt',
        file: null,
        youtube_embed_url: '',
        description: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [arrangingMaterials, setArrangingMaterials] = useState(null);
    const [hasSavedSequence, setHasSavedSequence] = useState(() => {
        if ((certification.learning_materials || []).length <= 1) {
            return true;
        }
        return localStorage.getItem(`sequenced_${certification.id}`) === 'true';
    });

    // ── Quiz / Assessment States ────────────────────────────
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [questionsList, setQuestionsList] = useState([]);

    // ── Final Exam States ───────────────────────────────────
    const [showExamModal, setShowExamModal] = useState(false);
    const [examQuestionsList, setExamQuestionsList] = useState([]);

    // ── Material Actions ────────────────────────────────────
    const moveItem = (index, direction) => {
        if (!arrangingMaterials) return;
        const newItems = [...arrangingMaterials];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        const temp = newItems[index];
        newItems[index] = newItems[targetIndex];
        newItems[targetIndex] = temp;
        setArrangingMaterials(newItems);
    };

    const saveSequence = () => {
        if (!arrangingMaterials) return;
        router.post(route('creator.certifications.materials.reorder', certification.id), {
            materials: arrangingMaterials.map((mat, index) => ({
                id: mat.id,
                order_number: index + 1
            }))
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setArrangingMaterials(null);
                setHasSavedSequence(true);
                localStorage.setItem(`sequenced_${certification.id}`, 'true');
            }
        });
    };

    const filteredMaterials = (certification.learning_materials || []).filter(mat => {
        if (filterType === 'all') return true;
        if (filterType === 'ppt') return mat.type === 'ppt';
        if (filterType === 'pdf') return mat.type === 'document';
        if (filterType === 'youtube_video') return mat.type === 'youtube_video';
        return true;
    });

    const submitMaterial = (e) => {
        e.preventDefault();
        post(route('creator.certifications.materials.store', certification.id), {
            onSuccess: () => {
                reset();
                if ((certification.learning_materials || []).length >= 1) {
                    setHasSavedSequence(false);
                    localStorage.removeItem(`sequenced_${certification.id}`);
                }
            },
            preserveScroll: true,
        });
    };

    const removeMaterial = (materialId) => {
        if(confirm('Remove this material?')) {
            router.delete(route('creator.certifications.materials.destroy', [certification.id, materialId]), {
                preserveScroll: true,
                onSuccess: () => {
                    const remainingCount = (certification.learning_materials || []).length - 1;
                    if (remainingCount <= 1) {
                        setHasSavedSequence(true);
                        localStorage.setItem(`sequenced_${certification.id}`, 'true');
                    } else {
                        setHasSavedSequence(false);
                        localStorage.removeItem(`sequenced_${certification.id}`);
                    }
                }
            });
        }
    };

    // ── Quiz / Assessment Actions ───────────────────────────
    const openQuizEditor = () => {
        const existingQuestions = (certification.quiz_questions || []).map(q => ({
            question_text: q.question_text,
            answers: (q.answers || []).map(a => ({
                answer_text: a.answer_text,
                is_correct: !!a.is_correct
            }))
        }));

        if (existingQuestions.length === 0) {
            // Start with 5 default questions (to help meet Laravel validations)
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

    const removeQuizQuestion = (qIdx) => {
        setQuestionsList(questionsList.filter((_, i) => i !== qIdx));
    };

    const updateQuizQuestionText = (qIdx, text) => {
        const list = [...questionsList];
        list[qIdx].question_text = text;
        setQuestionsList(list);
    };

    const updateQuizAnswerText = (qIdx, aIdx, text) => {
        const list = [...questionsList];
        list[qIdx].answers[aIdx].answer_text = text;
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

    const submitQuiz = (e) => {
        e.preventDefault();
        if (questionsList.length < 5) {
            alert('Quiz must contain at least 5 questions.');
            return;
        }

        // Validate complete inputs
        for (let i = 0; i < questionsList.length; i++) {
            const q = questionsList[i];
            if (!q.question_text.trim()) {
                alert(`Question ${i + 1} has empty text.`);
                return;
            }
            if (q.answers.length !== 4) {
                alert(`Question ${i + 1} must have exactly 4 choices.`);
                return;
            }
            let correctCount = 0;
            for (let j = 0; j < q.answers.length; j++) {
                if (!q.answers[j].answer_text.trim()) {
                    alert(`Choice ${j + 1} for Question ${i + 1} is empty.`);
                    return;
                }
                if (q.answers[j].is_correct) correctCount++;
            }
            if (correctCount !== 1) {
                alert(`Question ${i + 1} must have exactly one correct answer.`);
                return;
            }
        }

        router.post(route('creator.certifications.quiz-questions.store', certification.id), {
            questions: questionsList
        }, {
            onSuccess: () => setShowQuizModal(false),
            preserveScroll: true
        });
    };

    // ── Final Exam Actions ──────────────────────────────────
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

    const removeExamQuestion = (qIdx) => {
        setExamQuestionsList(examQuestionsList.filter((_, i) => i !== qIdx));
    };

    const updateExamQuestionText = (qIdx, text) => {
        const list = [...examQuestionsList];
        list[qIdx].question_text = text;
        setExamQuestionsList(list);
    };

    const updateExamAnswerText = (qIdx, aIdx, text) => {
        const list = [...examQuestionsList];
        list[qIdx].answers[aIdx].answer_text = text;
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
                    alert(`Choice ${j + 1} for Question ${i + 1} is empty.`);
                    return;
                }
                if (q.answers[j].is_correct) correctCount++;
            }
            if (correctCount !== 1) {
                alert(`Question ${i + 1} must have exactly one correct answer.`);
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

    const submitForReview = () => {
        if ((certification.learning_materials || []).length === 0) {
            alert('Please attach at least one learning material before submitting.');
            return;
        }
        if (!hasSavedSequence) {
            alert('Please arrange the sequence of learning materials first.');
            return;
        }
        if ((certification.exam_questions || []).length < 5) {
            alert('Please configure the Final Exam (Sandcastle Exam) with at least 5 questions before submitting.');
            return;
        }

        if(confirm('Submit this certification for Admin review? You cannot edit it while it is pending.')) {
            setIsSubmitting(true);
            router.post(route('creator.certifications.submit', certification.id), {}, {
                onFinish: () => setIsSubmitting(false)
            });
        }
    };

    const isEditable = ['draft', 'revision_required'].includes(certification.status);
    const ss = STATUS_STYLE[certification.status] || STATUS_STYLE.draft;

    const quizQuestionsCount = (certification.quiz_questions || []).length;
    const examQuestionsCount = (certification.exam_questions || []).length;

    return (
        <CreatorLayout pageTitle={`Edit: ${certification.title}`}>
            <Head title={`Edit ${certification.title}`} />

            <div className="space-y-6 flex-grow flex flex-col pb-12">
                <div className={`rounded-2xl border-l-4 ${ss.border} bg-white shadow-sm shadow-slate-200/60 p-6`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{certification.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-stone-500">
                                <span>Status</span>
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
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                Admin Remarks for Revision
                            </p>
                            <p className="text-sm text-amber-700 mt-1.5 leading-relaxed">{certification.remarks}</p>
                        </div>
                    )}

                    {certification.status === 'denied' && certification.decline_reason && (
                        <div className="mt-5 rounded-xl bg-red-50 border border-red-200/80 p-4">
                            <p className="text-sm font-semibold text-red-800 flex items-center gap-1.5">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                Reason for Denial
                            </p>
                            <p className="text-sm text-red-700 mt-1.5 leading-relaxed">{certification.decline_reason}</p>
                        </div>
                    )}
                </div>

                {/* ── Attached Learning Materials + Right Sidebar ──────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* List of Materials */}
                    <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/60 shadow-sm shadow-slate-200/60 p-6 flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                Attached Learning Materials
                            </h3>

                            {!arrangingMaterials && certification.learning_materials && certification.learning_materials.length > 0 && (
                                <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                                    {[
                                        { id: 'all', label: 'All' },
                                        { id: 'ppt', label: 'PPT' },
                                        { id: 'pdf', label: 'PDF/DOC' },
                                        { id: 'youtube_video', label: 'YouTube' }
                                    ].map(pill => (
                                        <button
                                            key={pill.id}
                                            type="button"
                                            onClick={() => setFilterType(pill.id)}
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                                filterType === pill.id 
                                                    ? 'bg-white text-violet-600 shadow-sm' 
                                                    : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            {pill.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {arrangingMaterials ? (
                            <div className="space-y-3 flex-grow flex flex-col justify-start">
                                {arrangingMaterials.map((mat, index) => {
                                    const meta = TYPE_META[mat.type] || TYPE_META.document;
                                    return (
                                        <div
                                            key={mat.id}
                                            className="rounded-xl border border-violet-100 bg-violet-50/10 shadow-sm transition-all duration-200 hover:border-violet-200 hover:bg-violet-50/20 overflow-hidden"
                                        >
                                            {/* Header row */}
                                            <div className="flex items-center justify-between p-3.5">
                                                <div className="flex items-center gap-3.5 min-w-0 flex-grow">
                                                    <span className="text-xs font-bold text-violet-500 bg-violet-100/60 px-2 py-1 rounded-lg w-9 text-center flex-shrink-0">
                                                        #{index + 1}
                                                    </span>
                                                    <span className="text-xl flex-shrink-0" title={meta.label}>{meta.icon}</span>
                                                    <div className="min-w-0 flex-grow">
                                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{mat.title}</h4>
                                                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{mat.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 ml-4 flex-shrink-0">
                                                    <button
                                                        type="button"
                                                        disabled={index === 0}
                                                        onClick={() => moveItem(index, 'up')}
                                                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all duration-200 hover:border-violet-300 hover:text-violet-600 active:scale-95"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={index === arrangingMaterials.length - 1}
                                                        onClick={() => moveItem(index, 'down')}
                                                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all duration-200 hover:border-violet-300 hover:text-violet-600 active:scale-95"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Content Preview */}
                                            <div className="border-t border-violet-100 bg-white overflow-hidden">
                                                {mat.type === 'youtube_video' ? (
                                                    <iframe
                                                        src={mat.youtube_embed_url}
                                                        className="w-full aspect-video"
                                                        title="YouTube Preview"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : mat.type === 'ppt' && mat.file_path ? (
                                                    <iframe
                                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + '/storage/' + mat.file_path)}`}
                                                        className="w-full h-[420px]"
                                                        title="PowerPoint Preview"
                                                        frameBorder="0"
                                                    />
                                                ) : mat.file_path && mat.file_path.toLowerCase().endsWith('.pdf') ? (
                                                    <iframe
                                                        src={`/storage/${mat.file_path}`}
                                                        className="w-full h-[420px]"
                                                        title="PDF Preview"
                                                    />
                                                ) : mat.file_path ? (
                                                    <iframe
                                                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + '/storage/' + mat.file_path)}&embedded=true`}
                                                        className="w-full h-[420px]"
                                                        title="Document Preview"
                                                        frameBorder="0"
                                                    />
                                                ) : (
                                                    <div className="w-full py-10 flex items-center justify-center flex-col text-slate-400">
                                                        <span className="text-3xl mb-1">📁</span>
                                                        <span className="text-xs font-semibold uppercase tracking-wider">No Inline Preview</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : filteredMaterials.length > 0 ? (
                            <div className="space-y-3 flex-grow flex flex-col justify-start">
                                {filteredMaterials.map((mat) => {
                                    const meta = TYPE_META[mat.type] || TYPE_META.document;
                                    return (
                                        <div key={mat.id} className="group flex items-start justify-between p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-200">
                                            <div className="flex items-start gap-3.5 min-w-0 flex-grow">
                                                <span className="text-2xl flex-shrink-0" title={meta.label}>{meta.icon}</span>
                                                <div className="min-w-0 flex-grow">
                                                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{mat.title}</h4>
                                                    <p className="text-xs text-slate-500 line-clamp-1 mb-2">{mat.description}</p>
                                                    
                                                    <div className="mt-2 w-full rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                                                        {mat.type === 'youtube_video' ? (
                                                            <iframe
                                                                src={mat.youtube_embed_url}
                                                                className="w-full aspect-video"
                                                                title="YouTube Preview"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            />
                                                        ) : mat.type === 'ppt' && mat.file_path ? (
                                                            <iframe
                                                                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + '/storage/' + mat.file_path)}`}
                                                                className="w-full h-[480px]"
                                                                title="PowerPoint Preview"
                                                                frameBorder="0"
                                                            />
                                                        ) : mat.file_path && mat.file_path.toLowerCase().endsWith('.pdf') ? (
                                                            <iframe
                                                                src={`/storage/${mat.file_path}`}
                                                                className="w-full h-[500px]"
                                                                title="PDF Preview"
                                                            />
                                                        ) : mat.file_path && (mat.file_path.toLowerCase().endsWith('.jpg') || mat.file_path.toLowerCase().endsWith('.png') || mat.file_path.toLowerCase().endsWith('.jpeg') || mat.file_path.toLowerCase().endsWith('.webp')) ? (
                                                            <img src={`/storage/${mat.file_path}`} className="w-full object-cover max-h-[500px]" alt="Preview" />
                                                        ) : mat.file_path ? (
                                                            <iframe
                                                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + '/storage/' + mat.file_path)}&embedded=true`}
                                                                className="w-full h-[480px]"
                                                                title="Document Preview"
                                                                frameBorder="0"
                                                            />
                                                        ) : (
                                                            <div className="w-full py-12 flex items-center justify-center flex-col text-slate-400">
                                                                <span className="text-3xl mb-1">📁</span>
                                                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">No Inline Preview</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-3 mt-3">
                                                        {mat.type === 'youtube_video' ? (
                                                            <a href={mat.youtube_embed_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-violet-600 hover:text-violet-800">
                                                                Open Video ↗
                                                            </a>
                                                        ) : (
                                                            <>
                                                                <a href={`/storage/${mat.file_path}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-600 hover:text-slate-900">
                                                                    View File ↗
                                                                </a>
                                                                <a href={`/storage/${mat.file_path}`} download className="text-xs font-bold text-violet-600 hover:text-violet-800">
                                                                    Download ↓
                                                                </a>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                                                    {meta.label}
                                                </span>
                                                {isEditable && (
                                                    <button
                                                        onClick={() => removeMaterial(mat.id)}
                                                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-all border border-red-100 hover:border-red-200"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                                    <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <p className="text-sm text-stone-400">
                                    {filterType === 'all' 
                                        ? 'No materials attached yet.' 
                                        : `No materials of type "${filterType === 'youtube_video' ? 'YouTube' : filterType.toUpperCase()}" attached.`}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── Right Sidebar ── */}
                    <div className="flex flex-col gap-4 h-fit">
                        {/* Add Material Form */}
                        <div className="rounded-2xl bg-white border border-slate-200/60 shadow-sm p-6">
                            <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Add New Material
                            </h3>

                            <form onSubmit={isEditable ? submitMaterial : e => e.preventDefault()} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Material Type</label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        disabled={!isEditable}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 text-sm text-slate-800 shadow-sm focus:border-violet-400 focus:ring-violet-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <option value="ppt">📄  PowerPoint (PPT/PPTX)</option>
                                        <option value="document">📋  Document (PDF/DOC)</option>
                                        <option value="youtube_video">🎬  YouTube Embed Video</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        disabled={!isEditable}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 text-sm text-slate-800 shadow-sm focus:border-violet-400 focus:ring-violet-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                        placeholder="e.g. Course Overview"
                                        required={isEditable}
                                    />
                                    {errors.title && (
                                        <div className="mt-1.5 rounded-lg bg-red-50 border border-red-100 px-3 py-1.5 text-xs text-red-600 font-medium">{errors.title}</div>
                                    )}
                                </div>

                                {data.type === 'youtube_video' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-stone-600 mb-1">YouTube Embed URL</label>
                                        <input
                                            type="url"
                                            value={data.youtube_embed_url}
                                            onChange={e => setData('youtube_embed_url', e.target.value)}
                                            placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                            disabled={!isEditable}
                                            className="block w-full rounded-xl border-slate-200 bg-slate-50/50 text-sm text-slate-800 shadow-sm focus:border-violet-400 focus:ring-violet-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            required={isEditable}
                                        />
                                        {errors.youtube_embed_url && (
                                            <div className="mt-1.5 rounded-lg bg-red-50 border border-red-100 px-3 py-1.5 text-xs text-red-600 font-medium">{errors.youtube_embed_url}</div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-stone-600 mb-1">File Upload</label>
                                        <input
                                            type="file"
                                            onChange={e => setData('file', e.target.files[0])}
                                            disabled={!isEditable}
                                            className="block w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-600 hover:file:bg-violet-100 file:cursor-pointer file:transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            required={isEditable}
                                        />
                                        {errors.file && (
                                            <div className="mt-1.5 rounded-lg bg-red-50 border border-red-100 px-3 py-1.5 text-xs text-red-600 font-medium">{errors.file}</div>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Short Description</label>
                                    <textarea
                                        rows="2"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        disabled={!isEditable}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 text-sm text-slate-800 shadow-sm focus:border-violet-400 focus:ring-violet-400 transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                                        placeholder="Optional – briefly describe this material"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isEditable || processing}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/30 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                >
                                    {processing ? 'Uploading…' : 'Attach Material'}
                                </button>
                            </form>
                        </div>

                        {/* Certification Assessments */}
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">Certification Assessments</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Design the learning validation items: a practice quiz (optional) and the required Final Exam.</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* 1. Optional Practice Quiz Card */}
                                <div className="rounded-2xl border border-slate-200 p-4 flex flex-col justify-between space-y-3 bg-slate-50/30">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-base">📝</span>
                                            <h4 className="font-bold text-slate-800 text-sm">Practice Quiz (Optional)</h4>
                                            <span className="text-[9px] font-bold tracking-wider uppercase bg-slate-100 text-slate-650 px-2 py-0.5 rounded-full border border-slate-200">Optional</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Add multiple-choice practice quiz questions for students to test their understanding before taking the final exam.
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                            quizQuestionsCount > 0 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                : 'bg-stone-50 text-stone-500 border-stone-200'
                                        }`}>
                                            {quizQuestionsCount > 0 ? `${quizQuestionsCount} Questions Configured` : 'Not Configured'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={openQuizEditor}
                                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-sm transition-all"
                                        >
                                            {quizQuestionsCount > 0 ? 'Manage Quiz' : 'Configure Quiz'}
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Required Final Exam Card */}
                                <div className="rounded-2xl border border-violet-100 bg-violet-50/15 p-4 flex flex-col justify-between space-y-3">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-base">🏆</span>
                                            <h4 className="font-bold text-slate-800 text-sm">Final Exam (Sandcastle Exam)</h4>
                                            <span className="text-[9px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-250">Required</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Every certification must have a comprehensive final assessment. Requires a minimum of 5 questions with 4 choices each.
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                            examQuestionsCount >= 5 
                                                ? 'bg-violet-55/10 text-violet-750 border-violet-200' 
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {examQuestionsCount > 0 ? `${examQuestionsCount} Questions Configured` : 'Required (Min 5 Questions)'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={openExamEditor}
                                            className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/15 hover:brightness-110 transition-all"
                                        >
                                            {examQuestionsCount > 0 ? 'Manage Final Exam' : 'Configure Exam'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Arrange Sequence */}
                        {certification.learning_materials && certification.learning_materials.length > 1 && (
                            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                                <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                                    Arrange Materials
                                </h3>
                                <p className="text-xs text-slate-500 mb-3">Set the learning order before submitting.</p>
                                {arrangingMaterials ? (
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={saveSequence}
                                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                                        >
                                            Save Order
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setArrangingMaterials(null)}
                                            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={!isEditable}
                                        onClick={() => setArrangingMaterials([...(certification.learning_materials || [])])}
                                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                            !isEditable
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : hasSavedSequence
                                                    ? 'border border-violet-200 text-violet-600 hover:bg-violet-50'
                                                    : 'bg-amber-50 border border-amber-300 text-amber-700 hover:bg-amber-100'
                                        }`}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                                        {hasSavedSequence ? 'Re-arrange Order' : 'Arrange Order'}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Submit for Review */}
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 space-y-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Submit for Approval</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Make sure everything is ready before submitting.</p>
                            </div>

                            <div className="flex flex-col gap-1.5 text-[11px] font-medium">
                                <span className={`flex items-center gap-1.5 ${
                                    (certification.learning_materials || []).length > 0 ? 'text-emerald-600' : 'text-slate-400'
                                }`}>
                                    {(certification.learning_materials || []).length > 0 ? '✅' : '⚪'} Learning Materials Attached
                                </span>
                                <span className={`flex items-center gap-1.5 ${
                                    hasSavedSequence ? 'text-emerald-600' : 'text-slate-400'
                                }`}>
                                    {hasSavedSequence ? '✅' : '⚪'} Sequence Arranged
                                </span>
                                <span className={`flex items-center gap-1.5 ${
                                    examQuestionsCount >= 5 ? 'text-emerald-600' : 'text-slate-400'
                                }`}>
                                    {examQuestionsCount >= 5 ? '✅' : '⚪'} Final Exam Configured (Min 5 Qs)
                                </span>
                            </div>

                            <button
                                onClick={submitForReview}
                                disabled={!isEditable || isSubmitting || !(certification.learning_materials || []).length || !hasSavedSequence || examQuestionsCount < 5}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-violet-500/25 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none"
                            >
                                {isSubmitting ? 'Submitting…' : 'Submit for Review'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Quiz Modal (Practice Quiz Builder) ────── */}
                {showQuizModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Manage Practice Quiz</h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Add practice multiple-choice questions. Min 5 questions required.</p>
                                </div>
                                <button onClick={() => setShowQuizModal(false)} className="text-slate-400 hover:text-slate-650 font-bold">✕</button>
                            </div>
                            
                            <form onSubmit={submitQuiz} className="flex-grow overflow-y-auto p-6 space-y-6">
                                {questionsList.map((q, qIdx) => (
                                    <div key={qIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">Question {qIdx + 1}</span>
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

                {/* ── Final Exam Modal (Exam Builder) ───────── */}
                {showExamModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
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
                                            <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">Exam Question {qIdx + 1}</span>
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


            </div>
        </CreatorLayout>
    );
}
