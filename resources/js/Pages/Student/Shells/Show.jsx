import { Head, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import StudentCertificateView from '@/Components/Student/StudentCertificateView';
import StudentExamDisclaimerModal from '@/Components/Student/StudentExamDisclaimerModal';
import StudentQuizResults from '@/Components/Student/StudentQuizResults';
import StudentSandboxQuiz from '@/Components/Student/StudentSandboxQuiz';
import StudentShellMap from '@/Components/Student/StudentShellMap';
import StudentLayout from '@/Layouts/StudentLayout';
import { clearExamDraft, hasExamDraft, loadExamDraft, saveExamDraft } from '@/utils/examProgressStorage';
import { shellThemeCssVars, themeKeyForShell } from '@/utils/shellThemes';
import { assetUrl } from '@/utils/assetUrl';

export default function Show() {
    const {
        certification,
        progress,
        moduleProgress = {},
        shellMeta: shellMetaProp,
        examStatus = {},
        certificate = null,
        auth,
    } = usePage().props;

    const userId = auth?.user?.id;

    const [viewingModule, setViewingModule] = useState(null);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [contentIndex, setContentIndex] = useState(0);
    const [isViewingQuiz, setIsViewingQuiz] = useState(false);
    const [isViewingResults, setIsViewingResults] = useState(false);
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerStatus, setAnswerStatus] = useState('unanswered');
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isViewingSummary, setIsViewingSummary] = useState(false);
    const [isTakingFinalExam, setIsTakingFinalExam] = useState(false);
    const [isViewingCertificate, setIsViewingCertificate] = useState(false);
    const [contentFinished, setContentFinished] = useState(false);
    const [examIntroOpen, setExamIntroOpen] = useState(false);
    const [examExitOpen, setExamExitOpen] = useState(false);
    const [examDraftAvailable, setExamDraftAvailable] = useState(() => hasExamDraft(certification.id, userId));
    const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
    const [flowKey, setFlowKey] = useState('map');

    const allModules = certification.lessons.flatMap((lesson) => lesson.modules);
    const isCompleted = (moduleId) => progress.completed_module_ids?.includes(moduleId);
    const isAllCompleted = progress.completed_modules >= progress.total_modules && progress.total_modules > 0;

    const shellMeta = shellMetaProp ?? {
        badge_type: 'pro',
        badge_label: 'Professional Certificate',
        github_verified: false,
        progress: progress.percentage,
        completed_modules: progress.completed_modules,
        total_modules: progress.total_modules,
        theme: 'pink',
    };
    const themeVars = shellThemeCssVars(themeKeyForShell(shellMeta));

    const resetSession = useCallback(() => {
        setViewingModule(null);
        setIsReviewMode(false);
        setContentIndex(0);
        setIsViewingQuiz(false);
        setIsViewingResults(false);
        setQuizIndex(0);
        setSelectedAnswer(null);
        setAnswerStatus('unanswered');
        setScore(0);
        setUserAnswers([]);
        setIsViewingSummary(false);
        setIsTakingFinalExam(false);
        setContentFinished(false);
    }, []);

    const reloadShellProgress = useCallback(() => {
        router.reload({ only: ['progress', 'moduleProgress', 'examStatus', 'certificate'], preserveScroll: true });
    }, []);

    useEffect(() => {
        if (!isTakingFinalExam || !userId) {
            return;
        }

        saveExamDraft(certification.id, userId, { quizIndex, userAnswers });
        setExamDraftAvailable(true);
    }, [isTakingFinalExam, quizIndex, userAnswers, certification.id, userId]);

    const beginFinalExam = useCallback(
        ({ resume = false } = {}) => {
            resetSession();
            setIsTakingFinalExam(true);

            if (resume) {
                const draft = loadExamDraft(certification.id, userId);
                if (draft) {
                    setQuizIndex(draft.quizIndex);
                    setUserAnswers(draft.userAnswers);
                    setSelectedAnswer(null);
                    setAnswerStatus('unanswered');
                    setScore(0);
                    return;
                }
            }

            setQuizIndex(0);
            setSelectedAnswer(null);
            setAnswerStatus('unanswered');
            setScore(0);
            setUserAnswers([]);
        },
        [certification.id, userId, resetSession],
    );

    const exitToShellMap = useCallback(() => {
        resetSession();
        setFlowKey('map');
        router.get(route('student.shells.show', certification.id), {}, {
            preserveScroll: true,
        });
    }, [resetSession, certification.id]);

    const markModuleComplete = useCallback(
        (moduleId) => {
            if (!moduleId || progress.completed_module_ids?.includes(moduleId)) {
                return Promise.resolve();
            }

            return new Promise((resolve) => {
                router.post(route('student.shells.modules.complete', moduleId), {}, {
                    preserveScroll: true,
                    preserveState: true,
                    onFinish: () => {
                        reloadShellProgress();
                        resolve();
                    },
                });
            });
        },
        [progress.completed_module_ids, reloadShellProgress],
    );

    const openModule = useCallback(
        (module, { review = false } = {}) => {
            resetSession();
            setViewingModule(module);
            setIsReviewMode(review);
            setFlowKey(`module-${module.id}-${review ? 'review' : 'play'}`);

            if (review) {
                const saved = moduleProgress[module.id];
                const hasQuiz = module.questions?.length > 0;
                const hasContent = module.contents?.length > 0;

                if (hasQuiz && !hasContent) {
                    setScore(saved?.score ?? 0);
                    setIsViewingResults(true);
                    setFlowKey(`results-${module.id}`);
                } else if (hasContent) {
                    setContentFinished(true);
                }
            }
        },
        [moduleProgress, resetSession],
    );

    const buildSubmission = useCallback(
        (questions) => {
            const current = questions[quizIndex];
            if (!current || !selectedAnswer) {
                return userAnswers;
            }
            const withoutCurrent = userAnswers.filter((a) => a.question_id !== current.id);
            return [...withoutCurrent, { question_id: current.id, selected_option: selectedAnswer }];
        },
        [quizIndex, selectedAnswer, userAnswers],
    );

    if (isViewingCertificate) {
        return (
            <StudentCertificateView
                key="certificate"
                certification={certification}
                user={auth?.user}
                certificate={certificate}
                themeVars={themeVars}
                onClose={() => {
                    setIsViewingCertificate(false);
                    setFlowKey('map');
                    resetSession();
                }}
            />
        );
    }

    if (isViewingSummary && viewingModule) {
        const videosCount =
            viewingModule.contents?.filter((c) => c.content_type === 'video' || c.content_type === 'youtube_embed').length || 0;
        const presentationsCount =
            viewingModule.contents?.filter((c) => c.content_type === 'presentation' || c.content_type === 'document').length || 0;
        const questionsCount = viewingModule.questions?.length || 0;

        return (
            <div key={flowKey} className="student-finish" style={themeVars}>
                <Head title="Sandbox Finished" />
                <div className="student-enter-stagger">
                <div className="student-finish__icon student-enter__item" style={{ '--student-enter-index': 0 }}>
                    <img src={assetUrl('images/shells/shell_var1.png')} alt="" />
                </div>
                <h1 className="student-finish__title student-enter__item" style={{ '--student-enter-index': 1 }}>
                    Sandbox
                    <br />
                    Finished!
                </h1>
                <div className="student-finish__stats student-enter__item" style={{ '--student-enter-index': 2 }}>
                    {videosCount > 0 && (
                        <div className="student-finish__stat">
                            <p className="student-finish__stat-label">Videos completed</p>
                            <p className="student-finish__stat-value">
                                {videosCount}/{videosCount}
                            </p>
                        </div>
                    )}
                    {presentationsCount > 0 && (
                        <div className="student-finish__stat">
                            <p className="student-finish__stat-label">Presentations completed</p>
                            <p className="student-finish__stat-value">
                                {presentationsCount}/{presentationsCount}
                            </p>
                        </div>
                    )}
                    {questionsCount > 0 && (
                        <div className="student-finish__stat">
                            <p className="student-finish__stat-label">Test score</p>
                            <p className="student-finish__stat-value">
                                {(moduleProgress[viewingModule.id]?.score ?? score)}/{questionsCount}
                            </p>
                        </div>
                    )}
                </div>
                <div className="student-finish__progress student-enter__item" style={{ '--student-enter-index': 3 }}>
                    <p className="student-finish__progress-title">Shell progress</p>
                    <div className="student-finish__progress-icons">
                        {allModules.map((module) => (
                            <img
                                key={module.id}
                                src={assetUrl(
                                    isCompleted(module.id)
                                        ? 'images/shells/shell_var1.png'
                                        : 'images/shells/shell_var2.png',
                                )}
                                className={isCompleted(module.id) ? 'is-done' : ''}
                                alt=""
                            />
                        ))}
                        <img
                            src={assetUrl('images/shells/castle_final_exam.png')}
                            className={examStatus.has_passed ? 'is-done' : ''}
                            alt=""
                        />
                    </div>
                </div>
                <button
                    type="button"
                    className="student-sandbox__action student-sandbox__action--primary student-finish__back student-enter__item"
                    style={{ '--student-enter-index': 4 }}
                    onClick={exitToShellMap}
                >
                    Back to shell map
                </button>
                </div>
            </div>
        );
    }

    if (isViewingResults && viewingModule) {
        const saved = moduleProgress[viewingModule.id];
        return (
            <>
                <Head title={`${viewingModule.title} — Results`} />
                <div key={flowKey} style={themeVars}>
                    <StudentQuizResults
                        module={viewingModule}
                        score={saved?.score ?? score}
                        total={viewingModule.questions?.length ?? 0}
                        reviewOnly
                        onBack={exitToShellMap}
                    />
                </div>
            </>
        );
    }

    if ((isViewingQuiz || isTakingFinalExam) && (viewingModule || isTakingFinalExam)) {
        const questionsSource = isTakingFinalExam ? certification.exam_questions : viewingModule?.questions;
        const questions = questionsSource || [];

        if (questions.length === 0) {
            return (
                <div key={flowKey} className="student-sandbox" style={themeVars}>
                    <Head title="Quiz" />
                    <div className="student-sandbox__content student-enter-stagger">
                        <p className="student-quiz__empty student-enter__item" style={{ '--student-enter-index': 0 }}>No questions available for this sandbox.</p>
                        <button type="button" className="student-sandbox__action student-sandbox__action--primary student-enter__item" style={{ '--student-enter-index': 1 }} onClick={exitToShellMap}>
                            Back to shell map
                        </button>
                    </div>
                </div>
            );
        }

        const submitAnswers = (finalAnswersList) => {
            if (isTakingFinalExam) {
                router.post(route('student.certifications.exam.submit', certification.id), { answers: finalAnswersList }, {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        clearExamDraft(certification.id, userId);
                        setExamDraftAvailable(false);
                        resetSession();
                        router.reload({
                            only: ['progress', 'moduleProgress', 'examStatus', 'certificate'],
                            preserveScroll: true,
                            onSuccess: () => {
                                setFlowKey('certificate');
                                setIsViewingCertificate(true);
                            },
                        });
                    },
                    onError: () => {
                        clearExamDraft(certification.id, userId);
                        setExamDraftAvailable(false);
                        setIsTakingFinalExam(false);
                        reloadShellProgress();
                        alert('Final exam failed! Review the sandboxes and try again.');
                    },
                });
                return;
            }

            router.post(route('student.modules.quiz.submit', viewingModule.id), { answers: finalAnswersList }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsViewingQuiz(false);
                    setUserAnswers([]);
                    setFlowKey(`summary-${viewingModule.id}`);
                    setIsViewingSummary(true);
                    reloadShellProgress();
                },
            });
        };

        const handleCheckAnswer = async () => {
            const current = questions[quizIndex];
            if (!selectedAnswer || isCheckingAnswer) {
                return;
            }

            const checkRoute = isTakingFinalExam
                ? route('student.certifications.exam.check', certification.id)
                : route('student.modules.quiz.check', viewingModule.id);

            setIsCheckingAnswer(true);

            try {
                const { data } = await window.axios.post(checkRoute, {
                    question_id: current.id,
                    selected_option: selectedAnswer,
                });

                if (data.correct) {
                    setAnswerStatus('correct');
                    setUserAnswers(buildSubmission(questions));
                    const alreadyRecorded = userAnswers.some((a) => a.question_id === current.id);
                    if (!alreadyRecorded) {
                        setScore((s) => s + 1);
                    }
                } else {
                    setAnswerStatus('incorrect');
                }
            } catch {
                alert('Could not check your answer. Please try again.');
            } finally {
                setIsCheckingAnswer(false);
            }
        };

        const handleNext = () => {
            const finalAnswersList = isTakingFinalExam || answerStatus === 'correct'
                ? buildSubmission(questions)
                : userAnswers;
            setUserAnswers(finalAnswersList);

            if (quizIndex >= questions.length - 1) {
                submitAnswers(finalAnswersList);
                return;
            }

            const nextIndex = quizIndex + 1;
            setQuizIndex(nextIndex);
            setSelectedAnswer(null);
            setAnswerStatus('unanswered');

            if (isTakingFinalExam && userId) {
                saveExamDraft(certification.id, userId, {
                    quizIndex: nextIndex,
                    userAnswers: finalAnswersList,
                });
            }
        };

        const handleExamCloseRequest = () => {
            if (isTakingFinalExam) {
                setExamExitOpen(true);
                return;
            }
            exitToShellMap();
        };

        const confirmExamExit = () => {
            if (userId) {
                saveExamDraft(certification.id, userId, { quizIndex, userAnswers });
                setExamDraftAvailable(true);
            }
            setExamExitOpen(false);
            resetSession();
            setFlowKey('map');
            router.get(route('student.shells.show', certification.id), {}, { preserveScroll: true });
        };

        return (
            <>
                <Head title={isTakingFinalExam ? 'Final Exam' : viewingModule?.title} />
                <div key={flowKey} style={themeVars}>
                    <StudentSandboxQuiz
                        title={viewingModule?.title}
                        questions={questions}
                        quizIndex={quizIndex}
                        selectedAnswer={selectedAnswer}
                        answerStatus={answerStatus}
                        onSelectAnswer={setSelectedAnswer}
                        onCheckAnswer={handleCheckAnswer}
                        isCheckingAnswer={isCheckingAnswer}
                        onNext={handleNext}
                        onRetry={() => {
                            setAnswerStatus('unanswered');
                            setSelectedAnswer(null);
                        }}
                        onClose={handleExamCloseRequest}
                        isFinalExam={isTakingFinalExam}
                    />
                </div>
                <StudentExamDisclaimerModal
                    show={examExitOpen}
                    variant="exit"
                    shellMeta={shellMeta}
                    onConfirm={confirmExamExit}
                    onCancel={() => setExamExitOpen(false)}
                />
            </>
        );
    }

    if (viewingModule) {
        const contents = viewingModule.contents || [];
        const hasQuiz = viewingModule.questions?.length > 0;

        const closeViewer = () => exitToShellMap();

        const proceedFromContent = () => {
            const atEnd = contents.length === 0 || contentIndex === contents.length - 1;

            if (atEnd) {
                if (isReviewMode && hasQuiz) {
                    setIsViewingResults(true);
                    return;
                }
                if (isReviewMode) {
                    exitToShellMap();
                    return;
                }
                setScore(0);
                setQuizIndex(0);
                setSelectedAnswer(null);
                setAnswerStatus('unanswered');
                setUserAnswers([]);
                if (hasQuiz) {
                    setFlowKey(`quiz-${viewingModule.id}`);
                    setIsViewingQuiz(true);
                } else {
                    markModuleComplete(viewingModule.id).then(() => {
                        setFlowKey(`summary-${viewingModule.id}`);
                        setIsViewingSummary(true);
                    });
                }
                return;
            }

            setContentIndex(contentIndex + 1);
            setFlowKey(`module-${viewingModule.id}-content-${contentIndex + 1}`);
            if (!isReviewMode) {
                setContentFinished(false);
            }
        };

        const currentContent = contents[contentIndex];
        const isLastContent = contentIndex === contents.length - 1;
        const iframeContentTypes = ['youtube_embed', 'presentation', 'document'];
        const usesIframeGate = currentContent && iframeContentTypes.includes(currentContent.content_type);

        let actionLabel = 'Next material';
        if (contents.length === 0) {
            actionLabel = hasQuiz ? 'Proceed to quiz' : 'Finish sandbox';
        } else if (isReviewMode && isLastContent) {
            actionLabel = hasQuiz ? 'View quiz results' : 'Back to shell map';
        } else if (isLastContent) {
            actionLabel = hasQuiz ? 'Proceed to quiz' : 'Finish sandbox';
        } else {
            const next = contents[contentIndex + 1];
            const typeMap = { video: 'video', youtube_embed: 'video', presentation: 'presentation', document: 'document' };
            actionLabel = `Next ${typeMap[next.content_type] || 'material'}`;
        }

        const actionDisabled = !isReviewMode && contents.length > 0 && !contentFinished;

        return (
            <div key={flowKey} className="student-sandbox student-sandbox--material" style={themeVars}>
                <Head title={`${viewingModule.title} — Sandbox`} />
                <header className="student-sandbox__header">
                    <button type="button" className="student-sandbox__header-btn" onClick={closeViewer} aria-label="Close">
                        ✕
                    </button>
                    <h2 className="student-sandbox__header-title">{viewingModule.title}</h2>
                    <div className="student-sandbox__header-spacer" aria-hidden="true" />
                </header>

                <div className="student-sandbox__content student-sandbox__content--material student-enter-stagger">
                    {isReviewMode && (
                        <p className="student-sandbox__review-banner student-enter__item" style={{ '--student-enter-index': 0 }}>
                            Review mode — quiz results are saved and cannot be retaken.
                        </p>
                    )}

                    {contents.length === 0 ? (
                        <div className="student-sandbox__empty-state">
                            <p className="student-enter__item" style={{ '--student-enter-index': isReviewMode ? 1 : 0 }}>
                                {hasQuiz ? 'This sandbox is a quiz only.' : 'No materials in this sandbox yet.'}
                            </p>
                            <button
                                type="button"
                                className="student-sandbox__action student-sandbox__action--primary student-enter__item"
                                style={{ '--student-enter-index': isReviewMode ? 2 : 1 }}
                                onClick={proceedFromContent}
                            >
                                {isReviewMode && hasQuiz ? 'View quiz results' : hasQuiz ? 'Proceed to quiz' : 'Finish sandbox'}
                            </button>
                        </div>
                    ) : (
                        <div className="student-sandbox__material-layout">
                            <div className="student-sandbox__viewer-wrap">
                                <p
                                    className="student-sandbox__viewer-label student-enter__item"
                                    style={{ '--student-enter-index': isReviewMode ? 1 : 0 }}
                                >
                                    {currentContent?.title || `Material ${contentIndex + 1} of ${contents.length}`}
                                </p>
                                <div
                                    className="student-sandbox__viewer student-enter__item"
                                    style={{ '--student-enter-index': isReviewMode ? 2 : 1 }}
                                >
                                    {currentContent.content_type === 'youtube_embed' ? (
                                        <iframe
                                            src={currentContent.file_url}
                                            title={viewingModule.title}
                                            className="student-sandbox__iframe"
                                            allowFullScreen
                                        />
                                    ) : currentContent.content_type === 'video' ? (
                                        <video
                                            src={`/storage/${currentContent.file_url}`}
                                            controls
                                            className="student-sandbox__iframe"
                                            onEnded={() => !isReviewMode && setContentFinished(true)}
                                        />
                                    ) : currentContent.content_type === 'presentation' && currentContent.file_url ? (
                                        <iframe
                                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`${window.location.origin}/storage/${currentContent.file_url}`)}`}
                                            title={viewingModule.title}
                                            className="student-sandbox__iframe"
                                        />
                                    ) : currentContent.content_type === 'document' && currentContent.file_url ? (
                                        <iframe
                                            src={`/storage/${currentContent.file_url}`}
                                            title={viewingModule.title}
                                            className="student-sandbox__iframe"
                                        />
                                    ) : (
                                        <div className="student-sandbox__viewer-fallback">Unsupported content type.</div>
                                    )}
                                </div>
                                {usesIframeGate && !isReviewMode && !contentFinished ? (
                                    <button
                                        type="button"
                                        className="student-sandbox__mark-complete student-enter__item"
                                        style={{ '--student-enter-index': 3 }}
                                        onClick={() => setContentFinished(true)}
                                    >
                                        I've finished this material
                                    </button>
                                ) : null}
                            </div>

                            {contents.length > 1 && (
                                <div className="student-sandbox__dots student-enter__item" style={{ '--student-enter-index': 3 }}>
                                    {contents.map((_, i) => (
                                        <span
                                            key={i}
                                            className={`student-sandbox__dot ${i === contentIndex ? 'student-sandbox__dot--active' : i < contentIndex ? 'student-sandbox__dot--done' : ''}`}
                                        />
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                disabled={actionDisabled}
                                onClick={proceedFromContent}
                                className={`student-sandbox__action student-enter__item ${actionDisabled ? 'student-sandbox__action--disabled' : 'student-sandbox__action--primary'}`}
                                style={{ '--student-enter-index': 4 }}
                            >
                                {actionDisabled
                                    ? currentContent?.content_type === 'video' || currentContent?.content_type === 'youtube_embed'
                                        ? 'Finish video to proceed'
                                        : 'Finish material to proceed'
                                    : actionLabel}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <StudentLayout activeNav="shells" layoutMode="shell">
            <Head title={`${certification.title} — Shell Map`} />

            <StudentShellMap
                certification={certification}
                progress={progress}
                shellMeta={shellMeta}
                examStatus={examStatus}
                examDraftAvailable={examDraftAvailable}
                selectHref={route('student.dashboard', { select: 1 })}
                onPlayModule={(module, options = {}) => {
                    const completed = isCompleted(module.id);
                    openModule(module, { review: options.review || completed });
                }}
                onTakeFinalExam={() => setExamIntroOpen(true)}
                onViewCertificate={() => {
                    resetSession();
                    setFlowKey('certificate');
                    setIsViewingCertificate(true);
                }}
            />

            <StudentExamDisclaimerModal
                show={examIntroOpen}
                variant="intro"
                attemptCount={examStatus.attempt_count ?? 0}
                shellMeta={shellMeta}
                onConfirm={() => {
                    setExamIntroOpen(false);
                    beginFinalExam({ resume: examDraftAvailable || hasExamDraft(certification.id, userId) });
                }}
                onCancel={() => setExamIntroOpen(false)}
            />
        </StudentLayout>
    );
}
