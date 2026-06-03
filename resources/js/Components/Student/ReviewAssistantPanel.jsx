import { useCallback, useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import AssistantMessageContent from '@/Components/Student/AssistantMessageContent';
import HermySpeechBubble from '@/Components/Student/HermySpeechBubble';
import StudentRightSidebar from '@/Components/Student/StudentRightSidebar';
import { assetUrl } from '@/utils/assetUrl';

const HERMYS_AVATAR = 'images/Hermy.png';
const ASSISTANT_KEY = 'sandbox-review-assistant-collapsed';

const STARTER_PROMPTS = [
    'Summarize this sandbox.',
    'What should I focus on?',
    'Explain the trickiest part.',
];

function readAssistantCollapsed(fallback = false) {
    if (typeof window === 'undefined') {
        return fallback;
    }

    const stored = window.localStorage.getItem(ASSISTANT_KEY);
    if (stored === '1') {
        return true;
    }
    if (stored === '0') {
        return false;
    }

    return fallback;
}

function HermyIcon({ className = '' }) {
    return <img src={assetUrl(HERMYS_AVATAR)} alt="" className={className} width={48} height={48} />;
}

function HermyLauncher({ onClick, themeVars = {} }) {
    return (
        <button
            type="button"
            className="student-review-assistant__launcher"
            onClick={onClick}
            aria-label="Open Hermy review assistant"
            style={themeVars}
        >
            <HermySpeechBubble
                label="Hermy"
                avatarPosition="bottom"
                compact
                className="student-review-assistant__launcher-bubble"
            >
                Review assistance is available — click Hermy to open.
            </HermySpeechBubble>
        </button>
    );
}

function TypingTurn({ enterIndex = 0 }) {
    return (
        <div
            className="student-review-assistant__turn student-review-assistant__turn--assistant student-review-assistant__turn--typing-state student-review-assistant__turn--enter"
            style={{ '--review-msg-index': enterIndex }}
            aria-live="polite"
            aria-busy="true"
        >
            <HermyIcon className="student-review-assistant__hermy student-review-assistant__hermy--thinking" />
            <div className="student-review-assistant__turn-stack">
                <div className="student-review-assistant__bubble student-review-assistant__bubble--assistant student-review-assistant__bubble--typing">
                    <span className="student-review-assistant__typing-dots student-review-assistant__typing-dots--large" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                    </span>
                    <span className="student-review-assistant__sr-only">Hermy is thinking</span>
                </div>
            </div>
        </div>
    );
}

function AssistantTurn({ children, options = null, enterIndex = 0 }) {
    return (
        <div
            className="student-review-assistant__turn student-review-assistant__turn--assistant student-review-assistant__turn--enter"
            style={{ '--review-msg-index': enterIndex }}
        >
            <HermyIcon className="student-review-assistant__hermy" />
            <div className="student-review-assistant__turn-stack">
                <div className="student-review-assistant__bubble student-review-assistant__bubble--assistant">
                    {children}
                </div>
                {options}
            </div>
        </div>
    );
}

function UserTurn({ children, enterIndex = 0 }) {
    return (
        <div
            className="student-review-assistant__turn student-review-assistant__turn--user student-review-assistant__turn--enter"
            style={{ '--review-msg-index': enterIndex }}
        >
            <div className="student-review-assistant__bubble student-review-assistant__bubble--user">{children}</div>
        </div>
    );
}

export default function ReviewAssistantPanel({
    moduleId,
    moduleTitle = 'this sandbox',
    themeVars = {},
    onCollapsedChange,
}) {
    const [collapsed, setCollapsed] = useState(() => readAssistantCollapsed(false));
    const [status, setStatus] = useState({
        ready: false,
        has_context: false,
        unavailable_reason: null,
    });
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);
    const [chatError, setChatError] = useState(null);
    const scrollRef = useRef(null);

    const fetchStatus = useCallback(async () => {
        if (!moduleId) {
            setStatus({ ready: false, has_context: false, unavailable_reason: null });
            setLoadingStatus(false);
            return;
        }

        setLoadingStatus(true);

        try {
            const { data } = await window.axios.get(route('student.modules.review-assistant.status', moduleId));
            setStatus({
                ready: Boolean(data.ready),
                has_context: Boolean(data.has_context),
                unavailable_reason: data.unavailable_reason || null,
            });
        } catch {
            setStatus({ ready: false, has_context: false, unavailable_reason: null });
        } finally {
            setLoadingStatus(false);
        }
    }, [moduleId]);

    useEffect(() => {
        setHistory([]);
        setMessage('');
        setChatError(null);
        fetchStatus();
    }, [moduleId, fetchStatus]);

    useEffect(() => {
        window.localStorage.setItem(ASSISTANT_KEY, collapsed ? '1' : '0');
        onCollapsedChange?.(collapsed);
    }, [collapsed, onCollapsedChange]);

    useEffect(() => {
        const container = scrollRef.current;

        if (!container || collapsed) {
            return;
        }

        const frame = window.requestAnimationFrame(() => {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: history.length > 1 || sending ? 'smooth' : 'auto',
            });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [history, sending, chatError, collapsed]);

    const toggleCollapsed = useCallback((event) => {
        event?.stopPropagation();
        setCollapsed((current) => !current);
    }, []);

    const expandFromRail = useCallback(() => {
        if (collapsed) {
            setCollapsed(false);
        }
    }, [collapsed]);

    const sendMessage = async (text) => {
        const trimmed = text.trim();

        if (!trimmed || sending || !status.ready || !moduleId) {
            return;
        }

        setChatError(null);
        const nextHistory = [...history, { role: 'user', content: trimmed }];
        setHistory(nextHistory);
        setMessage('');
        setSending(true);

        try {
            const { data } = await window.axios.post(route('student.modules.review-assistant.chat', moduleId), {
                message: trimmed,
                history: history.slice(-18),
            });

            setHistory([...nextHistory, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            setHistory(history);
            const apiMessage = error?.response?.data?.error;

            if (error?.response?.status === 503 && apiMessage) {
                setStatus((current) => ({ ...current, ready: false, unavailable_reason: apiMessage }));
            }

            setChatError(apiMessage || 'Hermy could not respond right now. Please try again in a moment.');
        } finally {
            setSending(false);
        }
    };

    if (!moduleId || loadingStatus || !status.has_context) {
        return null;
    }

    const unavailableMessage =
        status.unavailable_reason ||
        (!status.ready ? 'Hermy is resting — AI review is temporarily unavailable.' : null);

    const starterOptions = (
        <div className="student-review-assistant__options">
            {STARTER_PROMPTS.map((prompt) => (
                <button
                    key={prompt}
                    type="button"
                    className="student-review-assistant__option"
                    onClick={() => sendMessage(prompt)}
                    disabled={sending || !status.ready}
                >
                    {prompt}
                </button>
            ))}
        </div>
    );

    return (
        <div className="student-review-assistant-wrap">
            {collapsed ? <HermyLauncher onClick={expandFromRail} themeVars={themeVars} /> : null}
            <StudentRightSidebar
                collapsed={collapsed}
                onToggle={toggleCollapsed}
                hideWhenCollapsed
                ariaLabel="Hermy review assistant"
                className="student-review-assistant"
                style={themeVars}
            >
            <div className="student-review-assistant__layout">
                <div className="student-review-assistant__messages" ref={scrollRef}>
                    {(unavailableMessage || chatError) && (
                        <div className="student-review-assistant__alert" role="alert">
                            {chatError || unavailableMessage}
                        </div>
                    )}

                    {history.length === 0 ? (
                        <AssistantTurn enterIndex={0} options={starterOptions}>
                            Ask about this sandbox&apos;s materials or quiz topics.
                        </AssistantTurn>
                    ) : (
                        history.map((turn, index) =>
                            turn.role === 'assistant' ? (
                                <AssistantTurn key={`${turn.role}-${index}`} enterIndex={index}>
                                    <AssistantMessageContent content={turn.content} />
                                </AssistantTurn>
                            ) : (
                                <UserTurn key={`${turn.role}-${index}`} enterIndex={index}>
                                    {turn.content}
                                </UserTurn>
                            ),
                        )
                    )}

                    {sending ? <TypingTurn enterIndex={history.length} /> : null}
                </div>

                <form
                    className="student-review-assistant__composer"
                    onSubmit={(event) => {
                        event.preventDefault();
                        sendMessage(message);
                    }}
                >
                    <input
                        type="text"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder={status.ready ? 'Ask Hermy…' : 'Hermy is unavailable right now'}
                        maxLength={2000}
                        disabled={sending || !status.ready}
                        className="student-review-assistant__input"
                        aria-label={`Message Hermy about ${moduleTitle}`}
                    />
                    <button
                        type="submit"
                        className="student-review-assistant__send"
                        disabled={sending || !status.ready || !message.trim()}
                        aria-label="Send message to Hermy"
                    >
                        <Send size={18} strokeWidth={2.25} />
                    </button>
                </form>
            </div>
        </StudentRightSidebar>
        </div>
    );
}
