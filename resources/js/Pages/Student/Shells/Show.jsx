import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import StudentShellMap from '@/Components/Student/StudentShellMap';
import StudentLayout from '@/Layouts/StudentLayout';
import { assetUrl } from '@/utils/assetUrl';

export default function Show() {
    const { certification, progress, shellMeta: shellMetaProp, auth } = usePage().props;
    const [viewingModule, setViewingModule] = useState(null);
    const [contentIndex, setContentIndex] = useState(0);
    const [isViewingQuiz, setIsViewingQuiz] = useState(false);
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerStatus, setAnswerStatus] = useState('unanswered');
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isViewingSummary, setIsViewingSummary] = useState(false);
    const [isTakingFinalExam, setIsTakingFinalExam] = useState(false);
    const [isViewingCertificate, setIsViewingCertificate] = useState(false);
    const [contentFinished, setContentFinished] = useState(false);

    const allModules = certification.lessons.flatMap((lesson) => lesson.modules);
    const isCompleted = (moduleId) => progress.completed_module_ids?.includes(moduleId);
    const isUnlocked = (index) => {
        if (index === 0) {
            return true;
        }
        return isCompleted(allModules[index - 1].id);
    };
    const isAllCompleted = progress.completed_modules === progress.total_modules;

    if (isViewingCertificate) {
        return (
            <div className="student-certificate">
                <Head title="Certificate of Achievement" />
                <button
                    type="button"
                    className="student-sandbox__header-btn"
                    style={{ position: 'absolute', top: 24, left: 24 }}
                    onClick={() => router.get(route('student.shells.show', certification.id))}
                >
                    ✕
                </button>
                <div className="student-certificate__card">
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: '0 0 8px' }}>
                        CERTIFICATE OF ACHIEVEMENT
                    </h1>
                    <p style={{ color: '#78716c' }}>is awarded to</p>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: '#f07167', margin: '16px 0' }}>
                        {auth.user.first_name} {auth.user.last_name}
                    </h2>
                    <p style={{ color: '#78716c' }}>for successfully completing the certification requirements for</p>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: '#f07167' }}>
                        {certification.title}
                    </h3>
                    <img
                        src={assetUrl('images/Hermy.png')}
                        alt=""
                        style={{ position: 'absolute', right: 32, bottom: 0, width: 160 }}
                    />
                </div>
                <div className="student-certificate__actions">
                    <button type="button" className="student-certificate__action-btn" onClick={() => alert('TODO: Copy certificate link')}>
                        COPY LINK <span className="student-todo-badge">TODO</span>
                    </button>
                    <button type="button" className="student-certificate__action-btn" onClick={() => alert('TODO: Download PDF')}>
                        DOWNLOAD <span className="student-todo-badge">TODO</span>
                    </button>
                    <button type="button" className="student-certificate__action-btn" onClick={() => alert('TODO: Share certificate')}>
                        SHARE <span className="student-todo-badge">TODO</span>
                    </button>
                </div>
            </div>
        );
    }

    if (isViewingSummary) {
        const videosCount =
            viewingModule?.contents?.filter(
                (c) => c.content_type === 'video' || c.content_type === 'youtube_embed',
            ).length || 0;
        const presentationsCount =
            viewingModule?.contents?.filter(
                (c) => c.content_type === 'presentation' || c.content_type === 'document',
            ).length || 0;
        const questionsCount = viewingModule?.questions?.length || 0;

        return (
            <div className="student-finish">
                <Head title="Sandbox Finished" />
                <div className="student-finish__icon">
                    <img src={assetUrl('images/shells/shell_var1.png')} alt="" />
                </div>
                <h1 className="student-finish__title">
                    Sandbox
                    <br />
                    Finished!
                </h1>
                <div className="student-finish__stats">
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
                                {score}/{questionsCount}
                            </p>
                        </div>
                    )}
                </div>
                <div className="student-finish__progress">
                    <p className="student-finish__progress-title">Shell progress</p>
                    <div className="student-finish__progress-icons">
                        {allModules.map((m) => (
                            <img
                                key={m.id}
                                src={assetUrl('images/shells/shell_var2.png')}
                                alt=""
                                className={isCompleted(m.id) || m.id === viewingModule?.id ? 'is-done' : ''}
                            />
                        ))}
                        <img src={assetUrl('images/shells/castle_final_exam.png')} alt="" className={isAllCompleted ? 'is-done' : ''} />
                    </div>
                </div>
                <button
                    type="button"
                    className="student-sandbox__action student-sandbox__action--primary"
                    style={{ background: '#fdf6e3', color: '#57534e', boxShadow: '0 4px 0 0 #c4ac7a' }}
                    onClick={() => {
                        router.post(
                            route('student.shells.modules.complete', viewingModule.id),
                            {},
                            {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setIsViewingSummary(false);
                                    setViewingModule(null);
                                    setUserAnswers([]);
                                },
                            },
                        );
                    }}
                >
                    BACK TO SHELL MENU
                </button>
            </div>
        );
    }

    if (isViewingQuiz || isTakingFinalExam) {
        const questionsSource = isTakingFinalExam ? certification.exam_questions : viewingModule?.questions;
        const questions = questionsSource || [];
        const currentQuestion = questions[quizIndex];
        const isLastQuestion = quizIndex === questions.length - 1;

        if (!currentQuestion) {
            return (
                <div className="student-sandbox">
                    <Head title="Quiz" />
                    <div className="student-sandbox__content">
                        <h2 className="student-quiz__question">No questions available.</h2>
                        <button
                            type="button"
                            className="student-sandbox__action student-sandbox__action--primary"
                            onClick={() => (isTakingFinalExam ? setIsViewingCertificate(true) : setIsViewingSummary(true))}
                        >
                            Finish
                        </button>
                    </div>
                </div>
            );
        }

        const submitAnswers = (finalAnswersList) => {
            if (isTakingFinalExam) {
                router.post(
                    route('student.certifications.exam.submit', certification.id),
                    { answers: finalAnswersList },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setIsViewingCertificate(true);
                            setUserAnswers([]);
                        },
                        onError: () => {
                            setIsTakingFinalExam(false);
                            setUserAnswers([]);
                            alert('Final exam failed! Review the sandboxes and try again.');
                        },
                    },
                );
            } else {
                router.post(
                    route('student.modules.quiz.submit', viewingModule.id),
                    { answers: finalAnswersList },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setIsViewingSummary(true);
                            setUserAnswers([]);
                        },
                    },
                );
            }
        };

        const handleCheckAnswer = () => {
            const answer = currentQuestion.answers.find((a) => a.id === selectedAnswer);
            if (userAnswers.length === quizIndex) {
                setUserAnswers([...userAnswers, { question_id: currentQuestion.id, selected_option: selectedAnswer }]);
            }
            if (answer?.is_correct) {
                setAnswerStatus('correct');
                setScore(score + 1);
            } else {
                setAnswerStatus('incorrect');
            }
        };

        const handleNext = () => {
            let finalAnswersList = userAnswers;
            if (isTakingFinalExam && userAnswers.length === quizIndex) {
                finalAnswersList = [...userAnswers, { question_id: currentQuestion.id, selected_option: selectedAnswer }];
                setUserAnswers(finalAnswersList);
            }
            if (isLastQuestion) {
                submitAnswers(finalAnswersList);
            } else {
                setQuizIndex(quizIndex + 1);
                setSelectedAnswer(null);
                setAnswerStatus('unanswered');
            }
        };

        return (
            <div className="student-sandbox">
                <Head title={isTakingFinalExam ? 'Final Exam' : viewingModule?.title} />
                <header className="student-sandbox__header">
                    <button
                        type="button"
                        className="student-sandbox__header-btn"
                        onClick={() => (isTakingFinalExam ? setIsTakingFinalExam(false) : setIsViewingQuiz(false))}
                    >
                        ✕
                    </button>
                    <h2 className="student-sandbox__header-title">
                        {isTakingFinalExam ? 'Final Exam' : viewingModule?.title}
                    </h2>
                    <button type="button" className="student-sandbox__header-btn">
                        ↑
                    </button>
                </header>
                <div className="student-sandbox__content">
                    <div className="student-quiz__progress">
                        <div
                            className="student-quiz__progress-bar"
                            style={{ width: `${((quizIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                    <h3 className="student-quiz__question">{currentQuestion.question_text}</h3>
                    <div className="student-quiz__grid">
                        {currentQuestion.answers?.map((answer) => {
                            const isSelected = selectedAnswer === answer.id;
                            let stateClass = '';
                            if (isSelected) {
                                if (answerStatus === 'unanswered') {
                                    stateClass = 'student-quiz__option--selected';
                                } else if (answerStatus === 'correct') {
                                    stateClass = 'student-quiz__option--correct';
                                } else {
                                    stateClass = 'student-quiz__option--wrong';
                                }
                            }
                            return (
                                <button
                                    key={answer.id}
                                    type="button"
                                    disabled={answerStatus !== 'unanswered'}
                                    onClick={() => setSelectedAnswer(answer.id)}
                                    className={`student-quiz__option ${stateClass}`}
                                >
                                    {answer.answer_text}
                                </button>
                            );
                        })}
                    </div>
                    {answerStatus === 'unanswered' ? (
                        <button
                            type="button"
                            disabled={!selectedAnswer}
                            onClick={handleCheckAnswer}
                            className={`student-sandbox__action ${selectedAnswer ? 'student-sandbox__action--primary' : 'student-sandbox__action--disabled'}`}
                        >
                            {selectedAnswer ? 'CHECK ANSWER' : 'SELECT THE CORRECT ANSWER'}
                        </button>
                    ) : answerStatus === 'correct' || isTakingFinalExam ? (
                        <button type="button" onClick={handleNext} className="student-sandbox__action student-sandbox__action--primary">
                            {isLastQuestion
                                ? isTakingFinalExam
                                    ? 'CLAIM CERTIFICATE'
                                    : 'FINISH SANDBOX'
                                : 'NEXT QUESTION'}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setAnswerStatus('unanswered');
                                setSelectedAnswer(null);
                            }}
                            className="student-sandbox__action student-sandbox__action--disabled"
                        >
                            TRY AGAIN!
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (viewingModule) {
        const contents = viewingModule.contents || [];

        const closeViewer = () => {
            setViewingModule(null);
            setContentIndex(0);
            setContentFinished(false);
        };

        const proceedFromContent = () => {
            const atEnd = contents.length === 0 || contentIndex === contents.length - 1;

            if (atEnd) {
                const hasQuiz = viewingModule.questions?.length > 0;
                setScore(0);
                setQuizIndex(0);
                setSelectedAnswer(null);
                setAnswerStatus('unanswered');
                if (hasQuiz) {
                    setIsViewingQuiz(true);
                } else {
                    setIsViewingSummary(true);
                }
                return;
            }

            setContentIndex(contentIndex + 1);
            setContentFinished(false);
        };

        const currentContent = contents[contentIndex];
        const isLastContent = contentIndex === contents.length - 1;

        let actionLabel = 'PROCEED TO NEXT MATERIAL';
        if (contents.length === 0) {
            actionLabel = 'PROCEED TO QUIZ';
        } else if (isLastContent) {
            actionLabel = viewingModule.questions?.length ? 'PROCEED TO QUIZ' : 'FINISH SANDBOX';
        } else {
            const next = contents[contentIndex + 1];
            const typeMap = { video: 'VIDEO', youtube_embed: 'VIDEO', presentation: 'PRESENTATION', document: 'DOCUMENT' };
            actionLabel = `PROCEED TO ${typeMap[next.content_type] || 'NEXT MATERIAL'}`;
        }

        const actionDisabled = contents.length > 0 && !contentFinished;

        return (
            <div className="student-sandbox">
                <Head title={`${viewingModule.title} — Sandbox`} />
                <header className="student-sandbox__header">
                    <button type="button" className="student-sandbox__header-btn" onClick={closeViewer}>
                        ✕
                    </button>
                    <h2 className="student-sandbox__header-title">{viewingModule.title}</h2>
                    <button type="button" className="student-sandbox__header-btn">
                        ↑
                    </button>
                </header>
                <div className="student-sandbox__content">
                    {contents.length === 0 ? (
                        <>
                            <p className="student-quiz__question" style={{ fontSize: '1.25rem' }}>
                                {viewingModule.questions?.length
                                    ? 'This sandbox is a quiz — no materials to review first.'
                                    : 'No materials in this sandbox yet.'}
                            </p>
                            <button
                                type="button"
                                className="student-sandbox__action student-sandbox__action--primary"
                                onClick={proceedFromContent}
                            >
                                {viewingModule.questions?.length ? 'PROCEED TO QUIZ' : 'FINISH SANDBOX'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="student-sandbox__viewer">
                                {currentContent.content_type === 'youtube_embed' ? (
                                    <iframe
                                        src={currentContent.file_url}
                                        title={viewingModule.title}
                                        className="w-full h-full min-h-[50vh]"
                                        allowFullScreen
                                        onLoad={() => setContentFinished(true)}
                                    />
                                ) : currentContent.content_type === 'video' ? (
                                    <video
                                        src={`/storage/${currentContent.file_url}`}
                                        controls
                                        className="w-full h-full min-h-[50vh] object-contain bg-black"
                                        onEnded={() => setContentFinished(true)}
                                    />
                                ) : currentContent.content_type === 'presentation' && currentContent.file_url ? (
                                    <iframe
                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`${window.location.origin}/storage/${currentContent.file_url}`)}`}
                                        title={viewingModule.title}
                                        className="w-full h-full min-h-[50vh]"
                                        onLoad={() => setContentFinished(true)}
                                    />
                                ) : currentContent.content_type === 'document' && currentContent.file_url ? (
                                    <iframe
                                        src={`/storage/${currentContent.file_url}`}
                                        title={viewingModule.title}
                                        className="w-full h-full min-h-[50vh]"
                                        onLoad={() => setContentFinished(true)}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center min-h-[50vh] text-stone-500">
                                        Unsupported content type.
                                    </div>
                                )}
                            </div>
                            {contents.length > 1 && (
                                <div className="student-sandbox__dots">
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
                                className={`student-sandbox__action ${actionDisabled ? 'student-sandbox__action--disabled' : 'student-sandbox__action--primary'}`}
                            >
                                {actionDisabled
                                    ? currentContent?.content_type === 'video' ||
                                      currentContent?.content_type === 'youtube_embed'
                                        ? 'FINISH VIDEO TO PROCEED'
                                        : 'FINISH ALL SLIDES TO PROCEED'
                                    : actionLabel}
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    const githubVerified = certification.title?.toLowerCase().includes('java');
    const shellMeta = shellMetaProp ?? {
        badge_type: githubVerified ? 'github' : 'pro',
        badge_label: githubVerified ? 'GITHUB VERIFIED CERTIFICATE' : 'Professional Certificate',
        github_verified: githubVerified,
        progress: progress.percentage,
        completed_modules: progress.completed_modules,
        total_modules: progress.total_modules,
        theme: 'pink',
    };

    return (
        <StudentLayout activeNav="shells" layoutMode="shell">
            <Head title={`${certification.title} — Shell Map`} />

            <StudentShellMap
                certification={certification}
                progress={progress}
                shellMeta={shellMeta}
                selectHref={route('student.dashboard', { select: 1 })}
                onPlayModule={(module) => {
                    setViewingModule(module);
                    setContentIndex(0);
                    setContentFinished(false);
                }}
                onTakeFinalExam={() => {
                    setIsTakingFinalExam(true);
                    setQuizIndex(0);
                    setSelectedAnswer(null);
                    setAnswerStatus('unanswered');
                    setScore(0);
                }}
            />
        </StudentLayout>
    );
}
