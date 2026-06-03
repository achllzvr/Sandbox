import { useEffect, useRef, useState } from 'react';
import QuizTypewriterText from '@/Components/Student/QuizTypewriterText';
import StudentQuestionRenderer from '@/Components/Student/StudentQuestionRenderer';
import useQuizRevealSequence from '@/hooks/useQuizRevealSequence';
import { assetUrl } from '@/utils/assetUrl';

const SCENE_TRANSITION_MS = 320;

function optionClassName({ answer, selectedAnswer, answerStatus }) {
    const isSelected = selectedAnswer === answer.id;

    if (answerStatus === 'correct' && isSelected) {
        return 'student-quiz__option student-quiz__option--correct';
    }

    if (answerStatus === 'incorrect' && isSelected) {
        return 'student-quiz__option student-quiz__option--wrong';
    }

    if (answerStatus === 'unanswered' && isSelected) {
        return 'student-quiz__option student-quiz__option--selected';
    }

    return 'student-quiz__option';
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
    isCheckingAnswer = false,
}) {
    const [renderIndex, setRenderIndex] = useState(quizIndex);
    const [isExiting, setIsExiting] = useState(false);
    const swapTimerRef = useRef(null);

    const currentQuestion = questions[renderIndex];
    const questionKey = `${renderIndex}-${currentQuestion?.id ?? 'none'}`;
    const answerCount = currentQuestion?.answers?.length ?? 0;

    const {
        onTypewriterComplete,
        typingActive,
        showOptions,
        canSelectOptions,
        showHermy,
        showBubble,
    } = useQuizRevealSequence(questionKey);

    useEffect(() => {
        if (quizIndex === renderIndex) {
            return undefined;
        }

        setIsExiting(true);

        swapTimerRef.current = window.setTimeout(() => {
            setRenderIndex(quizIndex);
            setIsExiting(false);
        }, SCENE_TRANSITION_MS);

        return () => {
            if (swapTimerRef.current) {
                window.clearTimeout(swapTimerRef.current);
            }
        };
    }, [quizIndex, renderIndex]);

    const isLastQuestion = quizIndex === questions.length - 1;
    const progressPct = ((quizIndex + 1) / questions.length) * 100;

    if (!currentQuestion) {
        return null;
    }

    const promptHeading = isFinalExam ? 'Complete the final exam' : 'Answer Hermy';

    const sceneClasses = [
        'student-quiz__scene',
        isExiting ? 'student-quiz__scene--exiting' : '',
        showHermy ? 'student-quiz__scene--hermy' : '',
        showBubble ? 'student-quiz__scene--bubble' : '',
        typingActive ? 'student-quiz__scene--typing' : '',
        showOptions ? 'student-quiz__scene--options' : '',
        answerStatus === 'correct' ? 'student-quiz__scene--result-correct' : '',
        answerStatus === 'incorrect' ? 'student-quiz__scene--result-incorrect' : '',
    ]
        .filter(Boolean)
        .join(' ');

    const sandboxClasses = [
        'student-sandbox',
        'student-sandbox--quiz',
        'student-quiz--duolingo',
        isFinalExam ? 'student-quiz--final' : '',
        answerStatus === 'correct' ? 'student-quiz--answered-correct' : '',
        answerStatus === 'incorrect' ? 'student-quiz--answered-incorrect' : '',
    ]
        .filter(Boolean)
        .join(' ');

    const interactionType = currentQuestion.interaction_type || 'multiple_choice';
    const isAlternateType = interactionType !== 'multiple_choice';
    const optionsLocked = !canSelectOptions || answerStatus !== 'unanswered';
    const hasSelection = isAlternateType
        ? (typeof selectedAnswer === 'string'
            ? selectedAnswer.trim().length > 0
            : selectedAnswer != null && selectedAnswer !== '')
        : Boolean(selectedAnswer);

    return (
        <div className={sandboxClasses}>
            <div className="student-quiz__topbar">
                <button type="button" className="student-quiz__close" onClick={onClose} aria-label="Close">
                    ✕
                </button>
                <div
                    className={`student-quiz__progress ${answerStatus === 'correct' ? 'student-quiz__progress--correct' : ''} ${answerStatus === 'incorrect' ? 'student-quiz__progress--incorrect' : ''}`}
                    role="progressbar"
                    aria-valuenow={progressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div className="student-quiz__progress-bar" style={{ width: `${progressPct}%` }} />
                </div>
            </div>

            <div className="student-sandbox__content student-sandbox__content--quiz">
                <h2 className="student-quiz__heading">{promptHeading}</h2>

                <div className={sceneClasses} key={questionKey}>
                    <div className="student-quiz__chat">
                        <div className="student-quiz__avatar-wrap">
                            <img className="student-quiz__avatar" src={assetUrl('images/Hermy.png')} alt="" />
                        </div>

                        <div className="student-quiz__bubble-shell">
                            <div className="student-quiz__bubble">
                                <p className="student-quiz__bubble-label">
                                    Hermy asks · Q{renderIndex + 1}/{questions.length}
                                </p>
                                <QuizTypewriterText
                                    text={currentQuestion.question_text}
                                    active={typingActive && !isExiting}
                                    onComplete={onTypewriterComplete}
                                    className="student-quiz__bubble-text"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className={`student-quiz__options ${showOptions ? 'student-quiz__options--visible' : ''}`}
                        aria-label="Answer choices"
                        aria-hidden={!showOptions}
                    >
                    {isAlternateType ? (
                        <StudentQuestionRenderer
                            question={currentQuestion}
                            selectedAnswer={selectedAnswer}
                            onSelectAnswer={onSelectAnswer}
                            answerStatus={answerStatus}
                            canSelectOptions={canSelectOptions}
                        />
                    ) : (
                        currentQuestion.answers?.map((answer, index) => (
                            <button
                                key={answer.id}
                                type="button"
                                disabled={optionsLocked}
                                onClick={() => onSelectAnswer(answer.id)}
                                className={optionClassName({
                                    answer,
                                    selectedAnswer,
                                    answerStatus,
                                })}
                                style={{ '--quiz-option-index': index }}
                            >
                                <span className="student-quiz__option-text">{answer.answer_text}</span>
                            </button>
                        ))
                    )}
                    </div>
                </div>

                <div
                    className={`student-quiz__footer ${showOptions ? 'student-quiz__footer--visible' : ''}`}
                    style={{ '--quiz-option-count': answerCount }}
                >
                    {answerStatus === 'unanswered' ? (
                        <button
                            type="button"
                            disabled={!hasSelection || !showOptions || isCheckingAnswer}
                            onClick={onCheckAnswer}
                            className={`student-quiz__cta ${hasSelection && showOptions && !isCheckingAnswer ? 'student-quiz__cta--primary' : 'student-quiz__cta--disabled'}`}
                        >
                            {isCheckingAnswer ? 'Checking…' : hasSelection ? 'Check' : 'Select an answer'}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onNext}
                            className={`student-quiz__cta student-quiz__cta--primary ${
                                answerStatus === 'correct' ? 'student-quiz__cta--success' : ''
                            }`}
                        >
                            {isLastQuestion
                                ? isFinalExam
                                    ? 'Submit exam'
                                    : 'Finish sandbox'
                                : 'Continue'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
