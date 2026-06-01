import { useLayoutEffect, useState } from 'react';

/**
 * Returns true shortly after triggerKey changes so enter animations can run.
 * Resets synchronously when triggerKey changes to avoid a stale "revealed" flash
 * that would start animations then leave content permanently hidden.
 */
export default function useEnterAnimation(triggerKey) {
    const [state, setState] = useState(() => ({ key: triggerKey, revealed: false }));

    if (state.key !== triggerKey) {
        setState({ key: triggerKey, revealed: false });
    }

    useLayoutEffect(() => {
        let frame2;
        const frame1 = requestAnimationFrame(() => {
            frame2 = requestAnimationFrame(() => {
                setState((current) => (current.key === triggerKey ? { ...current, revealed: true } : current));
            });
        });

        const fallback = window.setTimeout(() => {
            setState((current) => (current.key === triggerKey ? { ...current, revealed: true } : current));
        }, 150);

        return () => {
            cancelAnimationFrame(frame1);
            if (frame2) {
                cancelAnimationFrame(frame2);
            }
            window.clearTimeout(fallback);
        };
    }, [triggerKey]);

    return state.revealed;
}
