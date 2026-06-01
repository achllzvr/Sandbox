import { useEffect, useRef, useState } from 'react';

const CHAR_MS = 26;

export default function QuizTypewriterText({ text, active, onComplete, className = '' }) {
    const [displayed, setDisplayed] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const completedRef = useRef(false);
    const onCompleteRef = useRef(onComplete);

    onCompleteRef.current = onComplete;

    useEffect(() => {
        completedRef.current = false;
        setDisplayed('');
        setIsTyping(false);

        if (!active) {
            return undefined;
        }

        let completeTimer;
        let tickTimer;

        const finish = () => {
            if (!completedRef.current) {
                completedRef.current = true;
                onCompleteRef.current?.();
            }
        };

        if (!text) {
            completeTimer = window.setTimeout(finish, 0);
            return () => window.clearTimeout(completeTimer);
        }

        setIsTyping(true);
        let index = 0;

        const tick = () => {
            index += 1;
            setDisplayed(text.slice(0, index));

            if (index >= text.length) {
                setIsTyping(false);
                completeTimer = window.setTimeout(finish, 120);
                return;
            }

            tickTimer = window.setTimeout(tick, CHAR_MS);
        };

        tickTimer = window.setTimeout(tick, CHAR_MS);

        return () => {
            window.clearTimeout(tickTimer);
            window.clearTimeout(completeTimer);
        };
    }, [text, active]);

    return (
        <p className={`${className} ${isTyping ? 'student-quiz__bubble-text--typing' : ''}`}>
            {displayed}
            {active && isTyping ? (
                <span className="student-quiz__typewriter-cursor" aria-hidden="true">
                    |
                </span>
            ) : null}
        </p>
    );
}
