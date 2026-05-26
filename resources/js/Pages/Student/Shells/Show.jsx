import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show() {
    const { certification, progress, auth } = usePage().props;
    const [viewingModule, setViewingModule] = useState(null);
    const [contentIndex, setContentIndex] = useState(0);

    // Quiz State
    const [isViewingQuiz, setIsViewingQuiz] = useState(false);
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerStatus, setAnswerStatus] = useState('unanswered');
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    
    // Completion Screens State
    const [isViewingSummary, setIsViewingSummary] = useState(false);
    const [isTakingFinalExam, setIsTakingFinalExam] = useState(false);
    const [isViewingCertificate, setIsViewingCertificate] = useState(false);

    // Flatten all modules into a single ordered array
    const allModules = certification.lessons.flatMap(lesson => lesson.modules);

    // Calculate progression states
    const isCompleted = (moduleId) => progress.completed_module_ids?.includes(moduleId);
    
    // A module is unlocked if it's the first one OR the previous one is completed
    const isUnlocked = (index) => {
        if (index === 0) return true;
        const prevModule = allModules[index - 1];
        return isCompleted(prevModule.id);
    };

    const isAllCompleted = progress.completed_modules === progress.total_modules;

    // ── 1. Certificate Screen ──
    if (isViewingCertificate) {
        return (
            <div className="min-h-screen bg-[#f79b9b] flex flex-col items-center justify-center p-4">
                <Head title="Certificate of Achievement" />
                <button 
                    onClick={() => {
                        import('@inertiajs/react').then(({ router }) => {
                            router.get(route('student.shells.show', certification.id));
                        });
                    }}
                    className="absolute top-6 left-6 w-10 h-10 rounded bg-white/30 text-white font-bold flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                    ✕
                </button>

                <div className="bg-white rounded-[2rem] max-w-4xl w-full p-12 shadow-2xl relative border-4 border-white">
                    <h1 className="text-4xl font-black text-stone-800 tracking-wider uppercase mb-2">Certificate of Achievement</h1>
                    <p className="text-stone-500 mb-8">is awarded to</p>
                    
                    <h2 className="text-5xl font-black text-[#f07167] mb-8">{auth.user.first_name} {auth.user.last_name}</h2>
                    
                    <p className="text-stone-500 mb-2">for successfully completing the certification requirements for</p>
                    <h3 className="text-3xl font-black text-[#f07167] mb-12">{certification.title}</h3>

                    <div className="flex gap-12 mt-12 border-t border-stone-200 pt-8 w-1/2">
                        <div>
                            <p className="font-bold text-stone-800">{certification.creator?.first_name || 'Admin'}</p>
                            <p className="text-xs text-stone-400">Creator</p>
                        </div>
                        <div>
                            <p className="font-bold text-stone-800">{new Date().toLocaleDateString()}</p>
                            <p className="text-xs text-stone-400">Date Completed</p>
                        </div>
                    </div>

                    {/* Dummy Mascot */}
                    <div className="absolute bottom-0 right-8 text-[12rem] leading-none drop-shadow-xl translate-y-4">
                        🦀
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <button className="bg-[#fdf6e3] text-stone-700 font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 hover:bg-white">
                        <span>🔗</span> COPY LINK
                    </button>
                    <button className="bg-[#fdf6e3] text-stone-700 font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 hover:bg-white">
                        <span>📥</span> DOWNLOAD
                    </button>
                    <button className="bg-[#fdf6e3] text-stone-700 font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 hover:bg-white">
                        <span>🔗</span> SHARE
                    </button>
                </div>
            </div>
        );
    }

    // ── 2. Sandbox Finished (Summary) Screen ──
    if (isViewingSummary) {
        // Calculate dummy stats for now (since we don't have granular content tracking yet)
        const videosCount = viewingModule?.contents?.filter(c => c.content_type === 'video' || c.content_type === 'youtube_embed').length || 0;
        const presentationsCount = viewingModule?.contents?.filter(c => c.content_type === 'presentation' || c.content_type === 'document').length || 0;
        const questionsCount = viewingModule?.questions?.length || 0;

        return (
            <div className="min-h-screen bg-[#f79b9b] flex flex-col items-center pt-24 px-4">
                <Head title="Sandbox Finished" />
                
                <div className="text-[8rem] leading-none drop-shadow-xl mb-4">
                    🐚
                </div>
                <h1 className="text-5xl font-black text-white tracking-widest uppercase mb-12 drop-shadow-sm text-center">
                    SANDBOX<br/>FINISHED!
                </h1>

                <div className="flex gap-4 mb-8">
                    {videosCount > 0 && (
                        <div className="bg-[#e08484] rounded-2xl p-4 text-center w-32 border-2 border-[#d67272]">
                            <p className="text-white/80 text-[10px] font-bold uppercase mb-2 h-8">VIDEOS COMPLETED</p>
                            <p className="text-white text-3xl font-black">{videosCount}/{videosCount}</p>
                        </div>
                    )}
                    {presentationsCount > 0 && (
                        <div className="bg-[#e08484] rounded-2xl p-4 text-center w-32 border-2 border-[#d67272]">
                            <p className="text-white/80 text-[10px] font-bold uppercase mb-2 h-8">PRESENTATIONS COMPLETED</p>
                            <p className="text-white text-3xl font-black">{presentationsCount}/{presentationsCount}</p>
                        </div>
                    )}
                    {questionsCount > 0 && (
                        <div className="bg-[#e08484] rounded-2xl p-4 text-center w-32 border-2 border-[#d67272]">
                            <p className="text-white/80 text-[10px] font-bold uppercase mb-2 h-8">TEST SCORE</p>
                            <p className="text-white text-3xl font-black">{score}/{questionsCount}</p>
                        </div>
                    )}
                    {videosCount === 0 && presentationsCount === 0 && questionsCount === 0 && (
                        <div className="bg-[#e08484] rounded-2xl p-4 text-center w-64 border-2 border-[#d67272]">
                            <p className="text-white font-bold uppercase tracking-wider text-sm">✓ Sandbox Complete</p>
                        </div>
                    )}
                </div>

                <div className="bg-[#e08484] rounded-2xl p-6 border-2 border-[#d67272] mb-12 w-[26rem] max-w-full">
                    <p className="text-white font-black uppercase text-sm mb-4 text-center">SHELL PROGRESS</p>
                    <div className="flex justify-center gap-3">
                        {allModules.map((m, i) => (
                            <div key={m.id} className={`w-12 h-10 rounded shadow-inner flex items-center justify-center text-xl ${isCompleted(m.id) || m.id === viewingModule?.id ? 'bg-[#d8c3a5]' : 'bg-[#e5a0a0] opacity-50'}`}>
                                {isCompleted(m.id) || m.id === viewingModule?.id ? '🐚' : ''}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => {
                        // Mark as completed and return to map (fallback for non-quiz modules)
                        import('@inertiajs/react').then(({ router }) => {
                            router.post(route('student.shells.modules.complete', viewingModule.id), {}, { preserveScroll: true, onSuccess: () => {
                                setIsViewingSummary(false);
                                setViewingModule(null);
                                setUserAnswers([]);
                            }});
                        });
                    }}
                    className="bg-[#fdf6e3] hover:bg-white text-stone-600 font-black px-12 py-4 rounded-xl shadow-lg transition-all active:scale-95 text-sm tracking-widest uppercase"
                >
                    BACK TO SHELL MENU
                </button>
            </div>
        );
    }

    // ── 3. Quiz / Exam Screen ──
    if (isViewingQuiz || isTakingFinalExam) {
        const questionsSource = isTakingFinalExam ? certification.exam_questions : viewingModule?.questions;
        const questions = questionsSource || [];
        const currentQuestion = questions[quizIndex];
        const isLastQuestion = quizIndex === questions.length - 1;

        if (!currentQuestion) {
            return (
                <div className="min-h-screen bg-[#fdf6e3] flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-stone-700">No questions available.</h2>
                    <button
                        onClick={() => {
                            if (isTakingFinalExam) setIsViewingCertificate(true);
                            else setIsViewingSummary(true);
                        }}
                        className="mt-6 bg-[#ef8a74] text-white font-bold px-8 py-3 rounded-xl shadow-sm"
                    >
                        FINISH
                    </button>
                </div>
            );
        }

        const submitAnswers = (finalAnswersList) => {
            import('@inertiajs/react').then(({ router }) => {
                if (isTakingFinalExam) {
                    router.post(route('student.certifications.exam.submit', certification.id), {
                        answers: finalAnswersList
                    }, {
                        preserveScroll: true,
                        onSuccess: () => {
                            setIsViewingCertificate(true);
                            setUserAnswers([]);
                        },
                        onError: () => {
                            setIsTakingFinalExam(false);
                            setUserAnswers([]);
                            alert("Final Exam Failed! Please review the sandboxes and try again.");
                        }
                    });
                } else {
                    router.post(route('student.modules.quiz.submit', viewingModule.id), {
                        answers: finalAnswersList
                    }, {
                        preserveScroll: true,
                        onSuccess: () => {
                            setIsViewingSummary(true);
                            setUserAnswers([]);
                        }
                    });
                }
            });
        };

        const handleCheckAnswer = () => {
            const answer = currentQuestion.answers.find(a => a.id === selectedAnswer);
            
            // Only add to userAnswers if we haven't answered this question yet
            if (userAnswers.length === quizIndex) {
                setUserAnswers([...userAnswers, { question_id: currentQuestion.id, selected_option: selectedAnswer }]);
            }

            if (answer && answer.is_correct) {
                setAnswerStatus('correct');
                setScore(score + 1);
            } else {
                setAnswerStatus('incorrect');
            }
        };

        const handleNext = () => {
            let finalAnswersList = userAnswers;
            
            // For final exam, we skip checkAnswer entirely, so we record it now.
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
            <div className="min-h-screen bg-[#fdf6e3] flex flex-col">
                <Head title={isTakingFinalExam ? "Final Exam" : "Quiz"} />
                
                {/* Header */}
                <div className="bg-[#f79b9b] px-6 py-4 flex items-center justify-between border-b-4 border-[#e08484]">
                    <button 
                        onClick={() => {
                            if (isTakingFinalExam) setIsTakingFinalExam(false);
                            else setIsViewingQuiz(false);
                        }}
                        className="w-8 h-8 rounded bg-white/30 text-white font-bold flex items-center justify-center hover:bg-white/40 transition-colors"
                    >
                        ✕
                    </button>
                    <h2 className="text-white font-black text-2xl tracking-widest uppercase" style={{ fontFamily: 'monospace' }}>
                        {isTakingFinalExam ? "Final Exam" : viewingModule?.title}
                    </h2>
                    <button className="w-8 h-8 rounded bg-white/30 text-white font-bold flex items-center justify-center hover:bg-white/40 transition-colors">
                        ↑
                    </button>
                </div>

                {/* Question Area */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
                    <div className="w-full max-w-3xl flex flex-col items-center">
                        {/* Progress Bar (Visual) */}
                        <div className="w-full max-w-sm h-2 bg-[#e5d5c5] rounded-full mb-12 overflow-hidden">
                            <div 
                                className="h-full bg-[#f07167] transition-all duration-500"
                                style={{ width: `${((quizIndex + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>

                        {/* Question */}
                        <h3 className="text-4xl font-black text-stone-700 text-center mb-16">{currentQuestion.question_text}</h3>

                        {/* Options Grid */}
                        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mb-16">
                            {currentQuestion.answers?.map((answer) => {
                                const isSelected = selectedAnswer === answer.id;
                                let bgClass = "bg-[#fdf6e3]";
                                let borderClass = "border-[#d8c3a5]";
                                let textClass = "text-stone-700";

                                if (isSelected) {
                                    if (answerStatus === 'unanswered') {
                                        bgClass = "bg-[#f79b9b]";
                                        borderClass = "border-[#e08484]";
                                        textClass = "text-white";
                                    } else if (answerStatus === 'correct') {
                                        bgClass = "bg-[#86d98c]";
                                        borderClass = "border-[#72bf77]";
                                        textClass = "text-white";
                                    } else if (answerStatus === 'incorrect') {
                                        bgClass = "bg-[#e0755f]";
                                        borderClass = "border-[#cc614c]";
                                        textClass = "text-white";
                                    }
                                } else if (answerStatus === 'correct' && answer.is_correct) {
                                    // Highlight the correct answer if they got it wrong? The UI in screenshots doesn't explicitly show this, it just says TRY AGAIN.
                                }

                                return (
                                    <button
                                        key={answer.id}
                                        disabled={answerStatus !== 'unanswered'}
                                        onClick={() => setSelectedAnswer(answer.id)}
                                        className={`p-6 rounded-xl border-4 font-bold text-lg shadow-sm transition-all active:scale-95 ${bgClass} ${borderClass} ${textClass} ${answerStatus !== 'unanswered' ? 'cursor-default opacity-90' : 'hover:bg-stone-50 hover:border-stone-300'}`}
                                    >
                                        {answer.answer_text}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Action Button */}
                        {answerStatus === 'unanswered' ? (
                            <button
                                disabled={!selectedAnswer}
                                onClick={handleCheckAnswer}
                                className={`px-12 py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all ${
                                    selectedAnswer 
                                    ? 'bg-[#ef8a74] hover:bg-[#e0755f] text-white shadow-md active:scale-95' 
                                    : 'bg-transparent border-2 border-[#d8c3a5] text-[#d8c3a5] cursor-not-allowed'
                                }`}
                            >
                                {selectedAnswer ? 'CHECK ANSWER' : 'SELECT THE CORRECT ANSWER'}
                            </button>
                        ) : answerStatus === 'correct' || isTakingFinalExam ? (
                            <button
                                onClick={handleNext}
                                className="bg-[#ef8a74] hover:bg-[#e0755f] text-white font-black text-sm px-12 py-4 rounded-xl tracking-widest uppercase shadow-md transition-all active:scale-95"
                            >
                                {isLastQuestion ? (isTakingFinalExam ? 'CLAIM CERTIFICATE' : 'FINISH SANDBOX') : 'NEXT QUESTION'}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setAnswerStatus('unanswered');
                                    setSelectedAnswer(null);
                                }}
                                className="bg-transparent border-2 border-[#d8c3a5] hover:bg-stone-50 text-stone-600 font-black text-sm px-12 py-4 rounded-xl tracking-widest uppercase shadow-sm transition-all"
                            >
                                TRY AGAIN!
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // If a module is selected, render the Full-Screen Viewer
    if (viewingModule) {
        return (
            <div className="min-h-screen bg-stone-50 flex flex-col">
                <Head title={viewingModule.title + ' — Viewer'} />
                
                {/* Header */}
                <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center shadow-sm">
                    <button 
                        onClick={() => setViewingModule(null)}
                        className="flex items-center gap-2 text-stone-500 hover:text-stone-800 font-semibold transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Map
                    </button>
                    <div className="flex-1 text-center pr-24">
                        <h2 className="font-bold text-stone-800 text-xl">{viewingModule.title}</h2>
                        <p className="text-xs text-stone-500 font-medium">Sandbox Viewer</p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center">
                    {(() => {
                        const contents = viewingModule.contents || [];
                        
                        if (contents.length === 0) {
                            return (
                                <div className="w-full max-w-xl text-center bg-white rounded-2xl p-16 border border-stone-200 shadow-sm mt-12">
                                    <h3 className="text-2xl font-bold text-stone-700 mb-8">No materials in this Sandbox</h3>
                                    <button
                                        onClick={() => {
                                            setIsViewingQuiz(true);
                                        }}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-xl shadow-md transition-all active:scale-95"
                                    >
                                        PROCEED TO QUIZ
                                    </button>
                                </div>
                            );
                        }

                        const currentContent = contents[contentIndex];
                        const isLast = contentIndex === contents.length - 1;
                        
                        let nextLabel = "PROCEED TO NEXT MATERIAL";
                        if (isLast) {
                            nextLabel = "PROCEED TO QUIZ";
                        } else {
                            const nextContent = contents[contentIndex + 1];
                            const typeMap = {
                                video: 'VIDEO',
                                youtube_embed: 'YOUTUBE VIDEO',
                                presentation: 'PRESENTATION',
                                document: 'DOCUMENT'
                            };
                            nextLabel = `PROCEED TO ${typeMap[nextContent.content_type] || 'NEXT MATERIAL'}`;
                        }

                        return (
                            <div className="w-full max-w-6xl h-full flex flex-col items-center gap-6">
                                <div className="w-full flex-grow bg-white rounded-2xl overflow-hidden shadow-md border border-stone-200 min-h-[60vh]">
                                    {currentContent.content_type === 'youtube_embed' ? (
                                        <iframe
                                            src={currentContent.file_url}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    ) : currentContent.content_type === 'video' ? (
                                        <video
                                            src={`/storage/${currentContent.file_url}`}
                                            controls
                                            className="w-full h-full object-contain bg-black"
                                        />
                                    ) : currentContent.content_type === 'presentation' && currentContent.file_url ? (
                                        <iframe
                                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + '/storage/' + currentContent.file_url)}`}
                                            className="w-full h-full"
                                            frameBorder="0"
                                        />
                                    ) : currentContent.content_type === 'document' && currentContent.file_url ? (
                                        <iframe
                                            src={`/storage/${currentContent.file_url}`}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-500">
                                            Unsupported content type.
                                        </div>
                                    )}
                                </div>

                                <div className="flex-shrink-0 pt-4 pb-8 flex flex-col items-center gap-6">
                                    {/* Progress Dots */}
                                    {contents.length > 1 && (
                                        <div className="flex items-center gap-3">
                                            {contents.map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`w-3 h-3 rounded-full transition-all ${
                                                        i === contentIndex ? 'bg-indigo-600 scale-125' : 
                                                        i < contentIndex ? 'bg-indigo-300' : 
                                                        'bg-stone-300'
                                                    }`}
                                                ></div>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {
                                            if (isLast) {
                                                const hasQuiz = viewingModule.questions && viewingModule.questions.length > 0;
                                                setScore(0);
                                                setQuizIndex(0);
                                                setSelectedAnswer(null);
                                                setAnswerStatus('unanswered');
                                                
                                                if (hasQuiz) {
                                                    setIsViewingQuiz(true);
                                                } else {
                                                    setIsViewingSummary(true);
                                                }
                                            } else {
                                                setContentIndex(contentIndex + 1);
                                            }
                                        }}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-12 py-4 rounded-2xl shadow-md transition-all active:scale-95 text-sm tracking-wide"
                                    >
                                        {nextLabel}
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout auth={auth} header={
            <div className="flex items-center gap-4">
                <Link
                    href={route('student.dashboard')}
                    className="bg-[#fbe4d8] border border-[#f0cbb5] text-[#d65d4b] hover:bg-[#f6d2c0] p-2.5 rounded-xl transition-colors shadow-sm"
                    title="Back to Dashboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div className="flex-1 text-center pr-12">
                    <h2 className="text-2xl font-black text-[#d65d4b] uppercase tracking-wide">{certification.title}</h2>
                    <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-[#1e293b] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Official Certificate
                    </div>
                </div>
            </div>
        }>
            <Head title={certification.title + ' — Sandbox'} />

            {/* Container mapping the Figma's beige background */}
            <div className="min-h-screen bg-[#fdf6e3] py-12 px-4 flex flex-col items-center overflow-x-hidden">
                
                {/* ── Progression Path ── */}
                <div className="relative w-full max-w-lg flex flex-col items-center">
                    
                    {/* The Path Line */}
                    <div className="absolute top-0 bottom-0 w-1.5 bg-[#e5d5c5] rounded-full -z-10 left-1/2 -translate-x-1/2"></div>

                    {allModules.map((module, index) => {
                        const completed = isCompleted(module.id);
                        const unlocked = isUnlocked(index);
                        const isActive = unlocked && !completed;

                        return (
                            <div key={module.id} className="relative flex flex-col items-center w-full mb-16 group">
                                
                                {/* Info Tooltip Bubble (always visible if active/completed, or on hover if locked) */}
                                <div className={`relative bg-white/90 backdrop-blur border-2 ${isActive ? 'border-[#f07167]' : completed ? 'border-emerald-400' : 'border-stone-300'} rounded-2xl p-4 shadow-xl mb-4 w-72 text-center transition-all ${!unlocked && 'opacity-60 grayscale'}`}>
                                    <h3 className={`font-black uppercase tracking-wider text-sm ${isActive ? 'text-[#f07167]' : completed ? 'text-emerald-500' : 'text-stone-500'}`}>
                                        {module.title}
                                    </h3>
                                    <p className="text-xs text-stone-500 mt-1 font-semibold">Sandbox {index + 1} of {allModules.length}</p>
                                    
                                    <div className="mt-3">
                                        {completed ? (
                                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                                                <span className="text-base">✅</span> Completed
                                            </div>
                                        ) : unlocked ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setViewingModule(module);
                                                    setContentIndex(0);
                                                }}
                                                className="w-full bg-[#f07167] hover:bg-[#e06056] text-white text-xs font-black uppercase tracking-wider py-2.5 rounded-xl shadow-sm transition-all"
                                            >
                                                Play This Sandbox
                                            </button>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
                                                🔒 Finish Previous First
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sandbox Visual (Placeholder) */}
                                <div className="relative">
                                    <div className={`w-32 h-20 bg-[#d8c3a5] rounded-[40px] border-b-8 border-[#c2b280] shadow-inner flex items-center justify-center text-4xl transition-all ${!unlocked && 'opacity-50 grayscale'}`}>
                                        {/* Show Hermy 🦀 if active, otherwise Shell 🐚 */}
                                        {isActive ? '🦀' : '🐚'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* ── Final Exam (Sandcastle) ── */}
                    <div className="relative flex flex-col items-center w-full mt-8">
                        <div className="w-full border-t-2 border-[#e5d5c5] absolute top-10 -z-20"></div>
                        
                        <div className={`relative bg-white/90 backdrop-blur border-2 ${isAllCompleted ? 'border-amber-400' : 'border-stone-300'} rounded-2xl p-5 shadow-xl mb-6 w-80 text-center transition-all ${!isAllCompleted && 'opacity-60 grayscale'}`}>
                            <h3 className={`font-black text-lg uppercase tracking-wider ${isAllCompleted ? 'text-amber-500' : 'text-stone-500'}`}>
                                Final Exam
                            </h3>
                            <p className="text-xs text-stone-500 mt-1 font-semibold">An exam covering all previous sandboxes</p>
                            
                            <div className="mt-4">
                                {isAllCompleted ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsTakingFinalExam(true);
                                            setQuizIndex(0);
                                            setSelectedAnswer(null);
                                            setAnswerStatus('unanswered');
                                            setScore(0);
                                        }}
                                        className="w-full bg-amber-400 hover:bg-amber-500 text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl shadow-md transition-all"
                                    >
                                        Take Sandcastle Exam
                                    </button>
                                ) : (
                                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 bg-stone-100 px-4 py-2 rounded-xl border border-stone-200">
                                        🔒 Finish All Sandboxes First
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sandcastle Visual */}
                        <div className={`text-8xl drop-shadow-xl transition-all ${!isAllCompleted && 'opacity-50 grayscale'}`}>
                            🏰
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
