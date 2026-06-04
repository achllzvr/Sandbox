import { Head, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import StudentCertificateView from '@/Components/Student/StudentCertificateView';
import StudentExamDisclaimerModal from '@/Components/Student/StudentExamDisclaimerModal';
import StudentQuizResults from '@/Components/Student/StudentQuizResults';
import StudentSandboxQuiz from '@/Components/Student/StudentSandboxQuiz';
import StudentShellMap from '@/Components/Student/StudentShellMap';
import ReviewAssistantPanel from '@/Components/Student/ReviewAssistantPanel';
import StudentSandboxMaterialPreview, {
    studentMaterialHasPageNavigation,
    studentMaterialPreviewKind,
} from '@/Components/Student/StudentSandboxMaterialPreview';
import StudentLayout from '@/Layouts/StudentLayout';
import AppToastProvider from '@/Components/AppToastProvider';
import { clearExamDraft, hasExamDraft, loadExamDraft, saveExamDraft } from '@/utils/examProgressStorage';
import { resolveShellMapTheme } from '@/utils/shellThemes';
import { assetUrl } from '@/utils/assetUrl';
import { showAppToastError } from '@/Utils/appToast';

function readAssistantSidebarCollapsed() {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.localStorage.getItem('sandbox-review-assistant-collapsed') === '1';
}

function reviewAssistantLayoutModifier(reviewAssistantEnabled, assistantCollapsed) {
    if (!reviewAssistantEnabled) {
        return 'student-sandbox-layout--assistant-hidden';
    }

    if (assistantCollapsed) {
        return 'student-sandbox-layout--assistant-collapsed';
    }

    return '';
}

function ShowShellPage() {
    const {
        certification,
        progress,
        moduleProgress = {},
        moduleTypes = {},
        attemptHistory = {},
        latestQuizAttempts = {},
        shellMeta: shellMetaProp,
        examStatus = {},
        certificate = null,
        auth,
        flash,
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
    const [isViewingExamFinish, setIsViewingExamFinish] = useState(false);
    const [examFinishScore, setExamFinishScore] = useState(null);
    const [isTakingFinalExam, setIsTakingFinalExam] = useState(false);
    const [isViewingCertificate, setIsViewingCertificate] = useState(false);
    const [contentFinished, setContentFinished] = useState(false);
    const [previewPage, setPreviewPage] = useState(0);
    const [previewPageCount, setPreviewPageCount] = useState(0);
    const [examIntroOpen, setExamIntroOpen] = useState(false);
    const [examExitOpen, setExamExitOpen] = useState(false);
    const [examDraftAvailable, setExamDraftAvailable] = useState(() => hasExamDraft(certification.id, userId));
    const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
    const [flowKey, setFlowKey] = useState('map');
    const [assessmentResult, setAssessmentResult] = useState(null);
    const [assistantCollapsed, setAssistantCollapsed] = useState(readAssistantSidebarCollapsed);
    const [suppressMapEnterAnimation, setSuppressMapEnterAnimation] = useState(false);

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
    const { className: themeKey, style: themeVars } = resolveShellMapTheme(shellMeta);

    const resetSession = useCallback(() => {
        setViewingModule(null);
        setIsReviewMode(false);
        setContentIndex(0);
        setPreviewPage(0);
        setPreviewPageCount(0);
        setIsViewingQuiz(false);
        setIsViewingResults(false);
        setQuizIndex(0);
        setSelectedAnswer(null);
        setAnswerStatus('unanswered');
        setScore(0);
        setUserAnswers([]);
        setIsViewingSummary(false);
        setIsViewingExamFinish(false);
        setExamFinishScore(null);
        setIsTakingFinalExam(false);
        setContentFinished(false);
    }, []);

    const reloadShellProgress = useCallback(() => {
        router.reload({
            only: ['progress', 'moduleProgress', 'moduleTypes', 'attemptHistory', 'latestQuizAttempts', 'examStatus', 'certificate'],
            preserveScroll: true,
        });
    }, []);

    const getModuleType = useCallback(
        (module) => {
            if (!module) {
                return 'content_only';
            }
            if (moduleTypes[module.id]) {
                return moduleTypes[module.id];
            }
            const hasQuiz = (module.questions?.length ?? 0) >= 5;
            const hasContent = (module.contents?.length ?? 0) > 0;
            if (hasQuiz && hasContent) {
                return 'test';
            }
            if (hasQuiz) {
                return 'quiz';
            }
            return 'content_only';
        },
        [moduleTypes],
    );

    const isTestAssessmentActive = useCallback(
        (module) => {
            if (!module || getModuleType(module) !== 'test') {
                return false;
            }

            return isViewingQuiz || (isViewingResults && !isReviewMode);
        },
        [getModuleType, isViewingQuiz, isViewingResults, isReviewMode],
    );

    const showReviewAssistant = useCallback(
        (module) => {
            if (!module || isTakingFinalExam) {
                return false;
            }

            return !isTestAssessmentActive(module);
        },
        [isTakingFinalExam, isTestAssessmentActive],
    );

    useEffect(() => {
        if (flash?.assessment_result) {
            setAssessmentResult(flash.assessment_result);
        }
    }, [flash?.assessment_result]);

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
        setSuppressMapEnterAnimation(true);
        setFlowKey('map');
        reloadShellProgress();
    }, [resetSession, reloadShellProgress]);

    const openCertificate = useCallback(() => {
        setIsViewingExamFinish(false);
        setExamFinishScore(null);
        resetSession();
        setFlowKey('certificate');
        setIsViewingCertificate(true);
    }, [resetSession]);

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
        (module, { review = false, retake = false } = {}) => {
            resetSession();
            setAssessmentResult(null);
            setViewingModule(module);
            setIsReviewMode(review && !retake);
            setFlowKey(`module-${module.id}-${retake ? 'retake' : review ? 'review' : 'play'}`);

            const moduleType = getModuleType(module);
            const latestAttempt = latestQuizAttempts[module.id];
            const history = attemptHistory[module.id] ?? [];
            const savedAttempt = latestAttempt ?? history[history.length - 1] ?? null;

            if (review && !retake) {
                if (moduleType === 'test' && (module.contents?.length ?? 0) > 0) {
                    setContentFinished(true);

                    if (savedAttempt) {
                        setAssessmentResult({
                            type: moduleType,
                            module_id: module.id,
                            score: savedAttempt.score,
                            total: savedAttempt.total,
                            passed: savedAttempt.passed,
                            attempt_number: savedAttempt.attempt_number,
                            answers: savedAttempt.answers ?? [],
                        });
                    }

                    return;
                }

                const saved = moduleProgress[module.id];

                setAssessmentResult({
                    type: moduleType,
                    module_id: module.id,
                    score: savedAttempt?.score ?? saved?.score ?? 0,
                    total: savedAttempt?.total ?? module.questions?.length ?? 0,
                    passed: savedAttempt?.passed ?? null,
                    attempt_number: savedAttempt?.attempt_number,
                    answers: savedAttempt?.answers ?? [],
                });
                setIsViewingResults(true);
                setFlowKey(`results-${module.id}`);
            }
        },
        [attemptHistory, getModuleType, latestQuizAttempts, moduleProgress, resetSession],
    );

    const buildSubmission = useCallback(
        (questions) => {
            const current = questions[quizIndex];
            if (!current || selectedAnswer == null || selectedAnswer === '') {
                return userAnswers;
            }
            const withoutCurrent = userAnswers.filter((a) => a.question_id !== current.id);
            const interactionType = current.interaction_type || 'multiple_choice';
            const payload = interactionType === 'multiple_choice'
                ? { question_id: current.id, selected_option: selectedAnswer }
                : { question_id: current.id, value: selectedAnswer };

            return [...withoutCurrent, payload];
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

    if ((isViewingSummary && viewingModule) || isViewingExamFinish) {
        const isExamFinish = isViewingExamFinish;
        const videosCount = isExamFinish
            ? 0
            : viewingModule.contents?.filter((c) => c.content_type === 'video' || c.content_type === 'youtube_embed').length || 0;
        const presentationsCount = isExamFinish
            ? 0
            : viewingModule.contents?.filter((c) => c.content_type === 'presentation' || c.content_type === 'document').length || 0;
        const questionsCount = isExamFinish
            ? examFinishScore?.total ?? examStatus.latest_total ?? certification.exam_questions?.length ?? 0
            : viewingModule.questions?.length || 0;
        const displayScore = isExamFinish
            ? examFinishScore?.score ?? examStatus.latest_score ?? score
            : moduleProgress[viewingModule.id]?.score ?? score;

        return (
            <div key={flowKey} className={`student-finish student-finish--${themeKey}`} style={themeVars}>
                <Head title={isExamFinish ? 'Final Exam Finished' : 'Sandbox Finished'} />
                <div className="student-finish__content student-enter-stagger">
                <div className="student-finish__icon student-enter__item" style={{ '--student-enter-index': 0 }}>
                    <img src={assetUrl('images/shells/shell_var1.png')} alt="" />
                </div>
                <h1 className="student-finish__title student-enter__item" style={{ '--student-enter-index': 1 }}>
                    {isExamFinish ? (
                        <>
                            Final Exam
                            <br />
                            Finished!
                        </>
                    ) : (
                        <>
                            Sandbox
                            <br />
                            Finished!
                        </>
                    )}
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
                            <p className="student-finish__stat-label">{isExamFinish ? 'Final exam score' : 'Test score'}</p>
                            <p className="student-finish__stat-value">
                                {displayScore}/{questionsCount}
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
                    onClick={isExamFinish ? openCertificate : exitToShellMap}
                >
                    {isExamFinish ? 'View Hermit certificate' : 'Back to shell map'}
                </button>
                </div>
            </div>
        );
    }

    if (isViewingResults && (viewingModule || assessmentResult?.type === 'exam')) {
        const result = assessmentResult ?? {};
        const isExamResults = result.type === 'exam';
        const resultModule = isExamResults ? null : viewingModule;
        const saved = resultModule ? moduleProgress[resultModule.id] : null;
        const moduleType = resultModule ? getModuleType(resultModule) : 'exam';
        const resultScore = result.score ?? saved?.score ?? score;
        const resultTotal = result.total ?? resultModule?.questions?.length ?? certification.exam_questions?.length ?? 0;
        const resultAnswers = result.answers ?? [];
        const resultQuestions = isExamResults ? certification.exam_questions : resultModule?.questions;
        const moduleAttemptHistory = isExamResults
            ? (examStatus.attemptHistory ?? [])
            : (resultModule ? (attemptHistory[resultModule.id] ?? []) : []);

        return (
            <>
                <Head title={isExamResults ? 'Final Exam Results' : `${resultModule?.title ?? 'Sandbox'} — Results`} />
                <div key={flowKey} style={themeVars}>
                    <StudentQuizResults
                        module={resultModule ?? { title: 'Final exam' }}
                        questions={resultQuestions}
                        score={resultScore}
                        total={resultTotal}
                        passed={result.passed ?? null}
                        answers={resultAnswers}
                        attemptHistory={moduleAttemptHistory}
                        initialAttemptNumber={result.attempt_number ?? null}
                        assessmentType={isExamResults ? 'exam' : moduleType}
                        reviewOnly={isReviewMode && moduleType !== 'test'}
                        onRetake={
                            moduleType === 'test' && resultModule
                                ? () => openModule(resultModule, { retake: true })
                                : null
                        }
                        onReviewContent={
                            isReviewMode && moduleType === 'test' && resultModule
                                ? () => {
                                    setIsViewingResults(false);
                                    setFlowKey(`module-${resultModule.id}-review`);
                                }
                                : null
                        }
                        onBack={() => {
                            if (isExamResults && result.passed) {
                                openCertificate();
                                return;
                            }
                            exitToShellMap();
                        }}
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
                    onSuccess: (page) => {
                        clearExamDraft(certification.id, userId);
                        setExamDraftAvailable(false);
                        const result = page.props.flash?.assessment_result;
                        setAssessmentResult(result ?? { type: 'exam', score, total: questions.length, answers: [] });
                        setIsTakingFinalExam(false);
                        setIsViewingQuiz(false);
                        setViewingModule(null);
                        setFlowKey('exam-results');
                        setIsViewingResults(true);
                        reloadShellProgress();
                    },
                    onError: (errors) => {
                        clearExamDraft(certification.id, userId);
                        setExamDraftAvailable(false);
                        setIsTakingFinalExam(false);
                        reloadShellProgress();
                        const message = errors?.exam ?? 'Final exam failed! Review the sandboxes and try again.';
                        showAppToastError(message);
                    },
                });
                return;
            }

            router.post(route('student.modules.quiz.submit', viewingModule.id), { answers: finalAnswersList }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    const result = page.props.flash?.assessment_result;
                    const moduleType = getModuleType(viewingModule);
                    setAssessmentResult(
                        result ?? {
                            type: moduleType,
                            module_id: viewingModule.id,
                            score,
                            total: questions.length,
                            answers: finalAnswersList,
                        },
                    );
                    setIsViewingQuiz(false);
                    setUserAnswers([]);
                    setFlowKey(`results-${viewingModule.id}`);
                    setIsViewingResults(true);
                    reloadShellProgress();
                },
                onError: (errors) => {
                    const message = errors?.message ?? 'Could not submit this assessment.';
                    showAppToastError(message);
                },
            });
        };

        const handleCheckAnswer = async () => {
            const current = questions[quizIndex];
            const interactionType = current?.interaction_type || 'multiple_choice';
            const hasAnswer = interactionType === 'multiple_choice'
                ? Boolean(selectedAnswer)
                : selectedAnswer != null && selectedAnswer !== '';

            if (!hasAnswer || isCheckingAnswer) {
                return;
            }

            const checkRoute = isTakingFinalExam
                ? route('student.certifications.exam.check', certification.id)
                : route('student.modules.quiz.check', viewingModule.id);

            setIsCheckingAnswer(true);

            try {
                const payload = interactionType === 'multiple_choice'
                    ? { question_id: current.id, selected_option: selectedAnswer }
                    : { question_id: current.id, value: selectedAnswer };

                const { data } = await window.axios.post(checkRoute, payload);

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
                showAppToastError('Could not check your answer. Please try again.');
            } finally {
                setIsCheckingAnswer(false);
            }
        };

        const handleNext = () => {
            const finalAnswersList = buildSubmission(questions);
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
            setSuppressMapEnterAnimation(true);
            setFlowKey('map');
            reloadShellProgress();
        };

        const reviewAssistantEnabled = showReviewAssistant(viewingModule);
        const assistantLayoutClass = reviewAssistantLayoutModifier(reviewAssistantEnabled, assistantCollapsed);

        return (
            <>
                <Head title={isTakingFinalExam ? 'Final Exam' : viewingModule?.title} />
                <div
                    key={flowKey}
                    className={`student-sandbox-layout student-sandbox-layout--quiz ${assistantLayoutClass}`}
                    style={themeVars}
                >
                    <div className="student-sandbox-layout__main">
                        <StudentSandboxQuiz
                        key={flowKey}
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
                    {!isTakingFinalExam && reviewAssistantEnabled ? (
                        <ReviewAssistantPanel
                            moduleId={viewingModule.id}
                            moduleTitle={viewingModule.title}
                            themeVars={themeVars}
                            onCollapsedChange={setAssistantCollapsed}
                        />
                    ) : null}
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

            navigateToContent(contentIndex + 1);
        };

        const navigateToContent = (nextIndex) => {
            if (nextIndex < 0 || nextIndex >= contents.length || nextIndex === contentIndex) {
                return;
            }

            if (!isReviewMode && !contentFinished) {
                return;
            }

            setContentIndex(nextIndex);
            setPreviewPage(0);
            setPreviewPageCount(0);
            setFlowKey(`module-${viewingModule.id}-content-${nextIndex}`);

            if (!isReviewMode) {
                setContentFinished(false);
            }
        };

        const canGoPrevious = contentIndex > 0;
        const canGoNext = contentIndex < contents.length - 1;

        const currentContent = contents[contentIndex];
        const previewItem = currentContent
            ? {
                  type: currentContent.content_type,
                  title: currentContent.title,
                  file_url: currentContent.file_url,
                  stream_url: currentContent.stream_url,
                  file_extension: currentContent.file_extension,
              }
            : null;
        const currentPreviewKind = studentMaterialPreviewKind(previewItem);
        const hasPreviewPages = studentMaterialHasPageNavigation(currentPreviewKind) && previewPageCount > 1;
        const isEmbedPreview =
            previewItem && (previewItem.type === 'youtube_embed' || previewItem.type === 'video');
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
        const componentNavLocked = !isReviewMode && !contentFinished;
        const reviewAssistantEnabled = showReviewAssistant(viewingModule);
        const assistantLayoutClass = reviewAssistantLayoutModifier(reviewAssistantEnabled, assistantCollapsed);

        return (
            <div
                key={flowKey}
                className={`student-sandbox-layout student-sandbox-layout--material ${assistantLayoutClass}`}
                style={themeVars}
            >
                <div className="student-sandbox-layout__main">
                    <div className="student-sandbox student-sandbox--material">
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
                            {getModuleType(viewingModule) === 'test'
                                ? 'Review mode — browse materials and past results. Use Retake on the map for a new attempt.'
                                : 'Review mode — quiz results are saved and cannot be retaken.'}
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
                                    className={`student-sandbox__preview-frame ${hasPreviewPages ? 'student-sandbox__preview-frame--paged' : ''} student-enter__item`}
                                    style={{ '--student-enter-index': isReviewMode ? 2 : 1 }}
                                >
                                    {hasPreviewPages ? (
                                        <button
                                            type="button"
                                            className="student-sandbox__nav-btn student-sandbox__nav-btn--side"
                                            onClick={() => setPreviewPage((page) => Math.max(0, page - 1))}
                                            disabled={previewPage === 0}
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft size={20} strokeWidth={2.5} aria-hidden="true" />
                                        </button>
                                    ) : null}
                                    <div className="student-sandbox__viewer-column">
                                        <div
                                            className={`student-sandbox__viewer ${isEmbedPreview ? 'student-sandbox__viewer--embed' : ''}`}
                                        >
                                            {previewItem ? (
                                                <StudentSandboxMaterialPreview
                                                    item={previewItem}
                                                    pageIndex={previewPage}
                                                    onPageCountChange={setPreviewPageCount}
                                                    videoProps={{
                                                        onEnded: () => !isReviewMode && setContentFinished(true),
                                                    }}
                                                />
                                            ) : (
                                                <div className="student-sandbox__viewer-fallback">Unsupported content type.</div>
                                            )}
                                        </div>
                                        {hasPreviewPages ? (
                                            <p className="student-sandbox__preview-meta">
                                                Page {previewPage + 1} of {previewPageCount}
                                            </p>
                                        ) : null}
                                    </div>
                                    {hasPreviewPages ? (
                                        <button
                                            type="button"
                                            className="student-sandbox__nav-btn student-sandbox__nav-btn--side"
                                            onClick={() => setPreviewPage((page) => Math.min(previewPageCount - 1, page + 1))}
                                            disabled={previewPage >= previewPageCount - 1}
                                            aria-label="Next page"
                                        >
                                            <ChevronRight size={20} strokeWidth={2.5} aria-hidden="true" />
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                            {contents.length > 1 ? (
                                <div className="student-sandbox__component-nav student-enter__item" style={{ '--student-enter-index': 3 }}>
                                    <button
                                        type="button"
                                        className="student-sandbox__nav-btn"
                                        onClick={() => navigateToContent(contentIndex - 1)}
                                        disabled={!canGoPrevious || componentNavLocked}
                                        aria-label="Previous material"
                                    >
                                        <ChevronLeft size={20} strokeWidth={2.5} aria-hidden="true" />
                                    </button>
                                    <div className="student-sandbox__dots">
                                        {contents.map((_, i) => (
                                            <span
                                                key={i}
                                                className={`student-sandbox__dot ${i === contentIndex ? 'student-sandbox__dot--active' : i < contentIndex ? 'student-sandbox__dot--done' : ''}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="student-sandbox__nav-btn"
                                        onClick={() => navigateToContent(contentIndex + 1)}
                                        disabled={!canGoNext || componentNavLocked}
                                        aria-label="Next material"
                                    >
                                        <ChevronRight size={20} strokeWidth={2.5} aria-hidden="true" />
                                    </button>
                                </div>
                            ) : null}

                            <div className="student-sandbox__finish-row student-enter__item" style={{ '--student-enter-index': 4 }}>
                                {usesIframeGate && !isReviewMode && !contentFinished ? (
                                    <button
                                        type="button"
                                        className="student-sandbox__mark-complete"
                                        onClick={() => setContentFinished(true)}
                                    >
                                        I've finished this material
                                    </button>
                                ) : null}
                                <button
                                    type="button"
                                    disabled={actionDisabled}
                                    onClick={proceedFromContent}
                                    className={`student-sandbox__action ${actionDisabled ? 'student-sandbox__action--disabled' : 'student-sandbox__action--primary'}`}
                                >
                                {actionDisabled
                                    ? currentContent?.content_type === 'video' || currentContent?.content_type === 'youtube_embed'
                                        ? 'Finish video to proceed'
                                        : 'Finish material to proceed'
                                    : actionLabel}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                    </div>
                </div>
                {reviewAssistantEnabled ? (
                    <ReviewAssistantPanel
                        moduleId={viewingModule.id}
                        moduleTitle={viewingModule.title}
                        themeVars={themeVars}
                        onCollapsedChange={setAssistantCollapsed}
                    />
                ) : null}
            </div>
        );
    }

    return (
        <StudentLayout activeNav="shells" layoutMode="shell">
            <Head title={`${certification.title} — Shell Map`} />

            <StudentShellMap
                certification={certification}
                progress={progress}
                moduleTypes={moduleTypes}
                attemptHistory={attemptHistory}
                moduleProgress={moduleProgress}
                shellMeta={shellMeta}
                examStatus={examStatus}
                examDraftAvailable={examDraftAvailable}
                suppressEnterAnimation={suppressMapEnterAnimation}
                selectHref={route('student.dashboard', { select: 1 })}
                onPlayModule={(module, options = {}) => {
                    const completed = isCompleted(module.id);
                    if (options.retake) {
                        openModule(module, { retake: true });
                        return;
                    }
                    openModule(module, { review: options.review || (completed && !options.retake) });
                }}
                onTakeFinalExam={() => {
                    if (!examStatus.can_take_final_exam && !examStatus.has_passed && !examStatus.has_attempted) {
                        if (examStatus.exam_state === 'waiting_instructor') {
                            showAppToastError('Your instructor has not unlocked the final exam yet.');
                        } else {
                            showAppToastError('Complete all sandboxes before taking the final exam.');
                        }
                        return;
                    }
                    if (examStatus.has_attempted && !examStatus.has_passed) {
                        setAssessmentResult({
                            type: 'exam',
                            score: examStatus.latest_score,
                            total: examStatus.latest_total,
                            passed: examStatus.latest_passed,
                            answers: examStatus.latestAttempt?.answers ?? [],
                        });
                        setIsViewingResults(true);
                        setFlowKey('exam-results');
                        return;
                    }
                    if (examStatus.has_attempted && examStatus.has_passed) {
                        setAssessmentResult({
                            type: 'exam',
                            score: examStatus.latest_score,
                            total: examStatus.latest_total,
                            passed: true,
                            answers: examStatus.latestAttempt?.answers ?? [],
                        });
                        setIsViewingResults(true);
                        setFlowKey('exam-results');
                        return;
                    }
                    setExamIntroOpen(true);
                }}
                onViewExamResults={() => {
                    setAssessmentResult({
                        type: 'exam',
                        score: examStatus.latest_score,
                        total: examStatus.latest_total,
                        passed: examStatus.latest_passed,
                        attempt_number: examStatus.latestAttempt?.attempt_number ?? null,
                        answers: examStatus.latestAttempt?.answers ?? [],
                    });
                    setIsViewingResults(true);
                    setFlowKey('exam-results');
                }}
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
                    if (examStatus.has_attempted) {
                        return;
                    }
                    beginFinalExam({ resume: examDraftAvailable || hasExamDraft(certification.id, userId) });
                }}
                onCancel={() => setExamIntroOpen(false)}
            />

        </StudentLayout>
    );
}

export default function Show() {
    return (
        <AppToastProvider>
            <ShowShellPage />
        </AppToastProvider>
    );
}
