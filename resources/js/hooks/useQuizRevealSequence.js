import { useCallback, useEffect, useState } from 'react';

export const QUIZ_SEQ = {
    IDLE: 0,
    HERMY: 1,
    BUBBLE: 2,
    TYPING: 3,
    OPTIONS: 4,
};

const HERMY_DELAY = 380;
const BUBBLE_DELAY = 1050;
const TYPING_DELAY = 1580;
const OPTIONS_FALLBACK = TYPING_DELAY + 8000;

export default function useQuizRevealSequence(questionKey) {
    const [step, setStep] = useState(QUIZ_SEQ.IDLE);

    useEffect(() => {
        setStep(QUIZ_SEQ.IDLE);

        const hermyTimer = window.setTimeout(() => setStep(QUIZ_SEQ.HERMY), HERMY_DELAY);
        const bubbleTimer = window.setTimeout(() => setStep(QUIZ_SEQ.BUBBLE), BUBBLE_DELAY);
        const typingTimer = window.setTimeout(() => setStep(QUIZ_SEQ.TYPING), TYPING_DELAY);
        const optionsFallbackTimer = window.setTimeout(() => {
            setStep((current) => (current >= QUIZ_SEQ.TYPING ? QUIZ_SEQ.OPTIONS : current));
        }, OPTIONS_FALLBACK);

        return () => {
            window.clearTimeout(hermyTimer);
            window.clearTimeout(bubbleTimer);
            window.clearTimeout(typingTimer);
            window.clearTimeout(optionsFallbackTimer);
        };
    }, [questionKey]);

    const onTypewriterComplete = useCallback(() => {
        setStep(QUIZ_SEQ.OPTIONS);
    }, []);

    return {
        step,
        onTypewriterComplete,
        showHermy: step >= QUIZ_SEQ.HERMY,
        showBubble: step >= QUIZ_SEQ.BUBBLE,
        typingActive: step >= QUIZ_SEQ.TYPING,
        showOptions: step >= QUIZ_SEQ.OPTIONS,
        canSelectOptions: step >= QUIZ_SEQ.OPTIONS,
    };
}
