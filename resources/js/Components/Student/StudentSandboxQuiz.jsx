import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { assetUrl } from '@/utils/assetUrl';

function useEnterAnimation(triggerKey) {
    const [isEntering, setIsEntering] = useState(false);

    useLayoutEffect(() => {
        setIsEntering(false);

        let enterTimer;
        const frame = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsEntering(true);
                enterTimer = window.setTimeout(() => setIsEntering(false), 780);
            });
        });

        return () => {
            cancelAnimationFrame(frame);
            if (enterTimer) {
                window.clearTimeout(enterTimer);
            }
        };
    }, [triggerKey]);

    return isEntering;
}

export default function StudentSandboxQuiz({
    questions,
    quizIndex,
    selectedAnswer,
    answerStatus,
    onSelectAnswer,
    onCheckAnswer,
    onNext,
    onClose,
    onRetry,
    isFinalExam = false,
}) {
    const [renderIndex, setRenderIndex] = useState(quizIndex);
    const [isExiting, setIsExiting] = useState(false);
    const swapTimerRef = useRef(null);

    const isEntering = useEnterAnimation(`${renderIndex}-${questions[renderIndex]?.id ?? 'none'}`);

    useEffect(() => {
        if (quizIndex === renderIndex) {
            return undefined;
        }

        setIsExiting(true);

        swapTimerRef.current = window.setTimeout(() => {
            setRenderIndex(quizIndex);
            setIsExiting(false);
        }, 240);

        return () => {
            if (swapTimerRef.current) {
                window.clearTimeout(swapTimerRef.current);
            }
        };
    }, [quizIndex, renderIndex]);

    const currentQuestion = questions[renderIndex];
    const isLastQuestion = quizIndex === questions.length - 1;
    const progressPct = ((quizIndex + 1) / questions.length) * 100;

    if (!currentQuestion) {
        return null;
    }

    const promptHeading = isFinalExam ? 'Complete the final exam' : 'Answer Hermy';
    const sceneClasses = [
        'student-quiz__scene',
        isExiting ? 'student-quiz__scene--exiting' : '',
        isEntering ? 'student-quiz__scene--entering' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={`student-sandbox student-sandbox--quiz student-quiz--duolingo ${isFinalExam ? 'student-quiz--final' : ''} ${isEntering ? 'student-quiz--entering' : ''}`}
        >
            <div className="student-quiz__topbar">
                <button type="button" className="student-quiz__close" onClick={onClose} aria-label="Close">
                    ✕
                </button>
                <div className="student-quiz__progress" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
                    <div className="student-quiz__progress-bar" style={{ width: `${progressPct}%` }} />
                </div>
            </div>

            <div className="student-sandbox__content student-sandbox__content--quiz">
                <h2 className="student-quiz__heading">{promptHeading}</h2>

                <div className={sceneClasses} key={`${currentQuestion.id}-${renderIndex}`}>
                    <div className="student-quiz__chat">
                        <div className="student-quiz__avatar-wrap">
                            <img className="student-quiz__avatar" src={assetUrl('images/Hermy.png')} alt="" />
                        </div>
                        <div className="student-quiz__bubble-shell">
                            <div className="student-quiz__bubble">
                                <p className="student-quiz__bubble-label">
                                    Hermy asks · Q{renderIndex + 1}/{questions.length}
                                </p>
                                <p className="student-quiz__bubble-text">{currentQuestion.question_text}</p>
                            </div>
                        </div>
                    </div>

                    <div className="student-quiz__options" aria-label="Answer choices">
                        {currentQuestion.answers?.map((answer, index) => (
                            <button
                                key={answer.id}
                                type="button"
                                disabled={answerStatus !== 'unanswered'}
                                onClick={() => onSelectAnswer(answer.id)}
                                className={`student-quiz__option ${
                                    selectedAnswer === answer.id
                                        ? answerStatus === 'unanswered'
                                            ? 'student-quiz__option--selected'
                                            : answerStatus === 'correct'
                                              ? 'student-quiz__option--correct'
                                              : 'student-quiz__option--wrong'
                                        : ''
                                }`}
                                style={{ '--quiz-option-delay': `${index * 80}ms` }}
                            >
                                <span className="student-quiz__option-text">{answer.answer_text}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="student-quiz__footer">
                    {answerStatus === 'unanswered' ? (
                        <button
                            type="button"
                            disabled={!selectedAnswer}
                            onClick={onCheckAnswer}
                            className={`student-quiz__cta ${selectedAnswer ? 'student-quiz__cta--primary' : 'student-quiz__cta--disabled'}`}
                        >
                            {selectedAnswer ? 'Check' : 'Select an answer'}
                        </button>
                    ) : answerStatus === 'correct' || isFinalExam ? (
                        <button type="button" onClick={onNext} className="student-quiz__cta student-quiz__cta--primary">
                            {isLastQuestion
                                ? isFinalExam
                                    ? 'Submit exam'
                                    : 'Finish sandbox'
                                : 'Continue'}
                        </button>
                    ) : (
                        <button type="button" onClick={onRetry} className="student-quiz__cta student-quiz__cta--retry">
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
