import { Link } from '@inertiajs/react';
import { CheckCircle2, ChevronDown, ChevronUp, Home } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import StudentShellInfoModal from '@/Components/Student/StudentShellInfoModal';
import scrollNodeIntoShellView from '@/utils/scrollNodeIntoShellView';
import { resolveShellMapTheme } from '@/utils/shellThemes';
import { assetUrl } from '@/utils/assetUrl';

const CANVAS_WIDTH = 560;
const PATH_CENTER_X = 148;
const NODE_START_Y = 56;
const NODE_GAP_Y = 108;
const SWAY = 72;

function moduleVisual(module, index, { completed, unlocked }) {
    if (!unlocked) {
        return assetUrl('images/shells/shell_var2.png');
    }
    const hasQuiz = module.questions?.length > 0;
    const hasVideo = module.contents?.some(
        (c) => c.content_type === 'video' || c.content_type === 'youtube_embed',
    );
    if (hasQuiz && !hasVideo) {
        return assetUrl('images/shells/shovel_quiz.png');
    }
    return assetUrl(`images/shells/shell_var${(index % 4) + 1}.png`);
}

function layoutCurveNodes(count) {
    if (count === 0) {
        return { nodes: [], height: 160, path: '' };
    }

    const nodes = Array.from({ length: count }, (_, index) => {
        const y = NODE_START_Y + index * NODE_GAP_Y;
        const x = PATH_CENTER_X + Math.sin(index * 0.9 + 0.4) * SWAY;
        return { x, y, index };
    });

    const height = NODE_START_Y + (count - 1) * NODE_GAP_Y + 120;

    let path = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i += 1) {
        const prev = nodes[i - 1];
        const curr = nodes[i];
        const midY = (prev.y + curr.y) / 2;
        path += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
    }

    return { nodes, height, path };
}

function resolveModuleType(module, moduleTypes) {
    if (moduleTypes?.[module.id]) {
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
}

function SandboxBubble({ module, globalIndex, totalModules, completed, unlocked, moduleTypes = {}, attemptHistory = {}, moduleProgress = {}, onPlay }) {
    const moduleType = resolveModuleType(module, moduleTypes);
    const history = attemptHistory[module.id] ?? [];
    const bestScore = moduleProgress[module.id]?.score;
    const isTest = moduleType === 'test';
    const isQuiz = moduleType === 'quiz';

    const stateClass = completed
        ? 'student-shell-map__bubble--done'
        : unlocked
          ? 'student-shell-map__bubble--ready'
          : 'student-shell-map__bubble--locked';

    let subcopy = completed
        ? `Lesson ${globalIndex + 1} of ${totalModules}`
        : unlocked
          ? `Lesson ${globalIndex + 1} of ${totalModules}`
          : 'Complete all sandboxes above to unlock this!';

    if (completed && isTest && history.length > 0) {
        subcopy = `Best score ${bestScore ?? history[history.length - 1]?.score}/${history[history.length - 1]?.total} · ${history.length} attempt${history.length === 1 ? '' : 's'}`;
    } else if (completed && isQuiz) {
        subcopy = `Quiz complete · ${bestScore ?? '—'}/${module.questions?.length ?? 0}`;
    }

    return (
        <div className={`student-shell-map__bubble ${stateClass}`} role="dialog" aria-label={module.title}>
            <h3 className="student-shell-map__bubble-title">{module.title}</h3>
            <p className="student-shell-map__bubble-sub">{subcopy}</p>
            {completed ? (
                <div className="student-shell-map__bubble-actions">
                    <button type="button" className="student-shell-map__play-btn student-shell-map__play-btn--review" onClick={() => onPlay?.(module, { review: true })}>
                        {isQuiz ? 'View results' : 'Review'}
                    </button>
                    {isTest && (
                        <button type="button" className="student-shell-map__play-btn student-shell-map__play-btn--retake" onClick={() => onPlay?.(module, { retake: true })}>
                            Retake test
                        </button>
                    )}
                </div>
            ) : unlocked ? (
                <button type="button" className="student-shell-map__play-btn" onClick={() => onPlay?.(module)}>
                    Start
                </button>
            ) : (
                <span className="student-shell-map__status-pill student-shell-map__status-pill--locked">Locked</span>
            )}
        </div>
    );
}

function FinalExamBubble({ isAllCompleted, examStatus = {}, hasDraft = false, onTakeFinalExam, onViewCertificate, onViewExamResults }) {
    const {
        has_passed: hasPassed = false,
        has_attempted: hasAttempted = false,
        attempt_count: attemptCount = 0,
        latest_score: latestScore,
        latest_total: latestTotal,
    } = examStatus;

    let ctaLabel = 'Start final exam';
    let ctaAction = onTakeFinalExam;
    let subcopy = 'An exam covering all previous sandboxes';

    if (hasPassed) {
        ctaLabel = 'View Hermit certificate';
        ctaAction = onViewCertificate;
        subcopy = 'You passed! View your Hermit certificate anytime.';
    } else if (hasAttempted) {
        ctaLabel = 'View exam results';
        ctaAction = onViewExamResults ?? onTakeFinalExam;
        subcopy = `Final exam submitted · Score ${latestScore ?? '—'}/${latestTotal ?? '—'}`;
    } else if (hasDraft) {
        ctaLabel = 'Continue final exam';
        subcopy = 'Pick up where you left off — your progress is saved.';
    } else if (attemptCount > 0) {
        subcopy = `An exam covering all previous sandboxes · ${attemptCount} attempt${attemptCount === 1 ? '' : 's'} recorded`;
    }

    return (
        <div
            className={`student-shell-map__bubble ${isAllCompleted ? 'student-shell-map__bubble--ready' : 'student-shell-map__bubble--locked'}`}
            role="dialog"
            aria-label="Final exam"
        >
            <h3 className="student-shell-map__bubble-title">Final exam</h3>
            <p className="student-shell-map__bubble-sub">
                {isAllCompleted ? subcopy : 'Finish all sandboxes above to unlock this!'}
            </p>
            {isAllCompleted ? (
                <button
                    type="button"
                    className={`student-shell-map__play-btn student-shell-map__play-btn--exam ${hasPassed ? 'student-shell-map__play-btn--certificate' : ''}`}
                    onClick={() => ctaAction?.()}
                >
                    {ctaLabel}
                </button>
            ) : (
                <span className="student-shell-map__status-pill student-shell-map__status-pill--locked">Locked</span>
            )}
        </div>
    );
}

function MapNodeStack({
    x,
    y,
    isActive,
    isCastle = false,
    nodeId,
    nodeIndex = 0,
    visualClassName = '',
    ariaLabel,
    onToggle,
    visualSrc,
    children,
}) {
    return (
        <div
            className={`student-shell-map__stack ${isCastle ? 'student-shell-map__stack--castle' : ''} ${isActive ? 'student-shell-map__stack--active' : ''}`}
            style={{ left: `${x}px`, top: `${y}px`, '--shell-node-index': nodeIndex }}
            data-shell-node={nodeId}
        >
            <button
                type="button"
                className={`student-shell-map__visual ${visualClassName} ${isActive ? 'student-shell-map__visual--selected' : ''}`}
                onClick={onToggle}
                aria-label={ariaLabel}
                aria-expanded={isActive}
            >
                <img src={visualSrc} alt="" />
            </button>
            <div
                className={`student-shell-map__bubble-wrap ${isActive ? 'student-shell-map__bubble-wrap--open' : ''}`}
                aria-hidden={!isActive}
            >
                {children}
            </div>
        </div>
    );
}

export default function StudentShellMap({
    certification,
    progress,
    moduleTypes = {},
    attemptHistory = {},
    moduleProgress = {},
    shellMeta = {},
    examStatus = {},
    examDraftAvailable = false,
    suppressEnterAnimation = false,
    selectHref,
    onPlayModule,
    onTakeFinalExam,
    onViewCertificate,
    onViewExamResults,
}) {
    const allModules = useMemo(
        () => certification.lessons.flatMap((lesson) => lesson.modules),
        [certification.lessons],
    );

    const isCompleted = (moduleId) => progress.completed_module_ids?.includes(moduleId);
    const isUnlocked = (index) => {
        if (index === 0) {
            return true;
        }
        return isCompleted(allModules[index - 1].id);
    };
    const isAllCompleted = progress.completed_modules >= progress.total_modules && progress.total_modules > 0;

    const [activeNode, setActiveNode] = useState(null);
    const [shellModalOpen, setShellModalOpen] = useState(false);
    const [mapEntered, setMapEntered] = useState(false);
    const hasAutoScrolledRef = useRef(false);

    const currentNodeId = useMemo(() => {
        const firstActive = allModules.findIndex((module, index) => isUnlocked(index) && !isCompleted(module.id));
        if (firstActive >= 0) {
            return allModules[firstActive].id;
        }
        if (isAllCompleted) {
            return 'final';
        }
        return allModules[0]?.id ?? null;
    }, [allModules, progress.completed_module_ids, isAllCompleted]);

    useLayoutEffect(() => {
        hasAutoScrolledRef.current = false;

        if (suppressEnterAnimation) {
            setMapEntered(true);
            return undefined;
        }

        setMapEntered(false);

        const frame = requestAnimationFrame(() => {
            requestAnimationFrame(() => setMapEntered(true));
        });

        return () => cancelAnimationFrame(frame);
    }, [certification.id, suppressEnterAnimation]);

    useEffect(() => {
        const firstActive = allModules.findIndex((module, index) => isUnlocked(index) && !isCompleted(module.id));
        if (firstActive >= 0) {
            setActiveNode(allModules[firstActive].id);
        } else if (isAllCompleted) {
            setActiveNode('final');
        }
    }, [certification.id]);

    const getScrollContainer = useCallback(() => {
        return document.getElementById('student-shell-scroll');
    }, []);

    const scrollToNode = useCallback(
        (nodeId, { behavior = 'smooth' } = {}) => {
            const container = getScrollContainer();
            const node = document.querySelector(`[data-shell-node="${nodeId}"]`);
            scrollNodeIntoShellView(container, node, { behavior });
        },
        [getScrollContainer],
    );

    const scrollToTop = useCallback(() => {
        const container = getScrollContainer();
        container?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [getScrollContainer]);

    const scrollToCurrent = useCallback(() => {
        if (currentNodeId) {
            scrollToNode(currentNodeId);
            setActiveNode(currentNodeId);
        }
    }, [currentNodeId, scrollToNode]);

    useEffect(() => {
        if (!mapEntered || !currentNodeId || hasAutoScrolledRef.current) {
            return undefined;
        }

        hasAutoScrolledRef.current = true;

        let frame2;
        const frame1 = requestAnimationFrame(() => {
            frame2 = requestAnimationFrame(() => {
                scrollToNode(currentNodeId, { behavior: 'auto' });
            });
        });

        return () => {
            cancelAnimationFrame(frame1);
            if (frame2) {
                cancelAnimationFrame(frame2);
            }
        };
    }, [mapEntered, currentNodeId, scrollToNode]);

    function toggleNode(nodeId) {
        setActiveNode((current) => (current === nodeId ? null : nodeId));
    }

    const badgeType = shellMeta.badge_type ?? 'pro';
    const badgeLabel = shellMeta.badge_label ?? 'Professional Certificate';
    const githubVerified = shellMeta.github_verified ?? badgeType === 'github';
    const { className: themeKey, style: themeStyle } = resolveShellMapTheme(shellMeta);

    let globalModuleIndex = 0;
    const lessonOffsets = certification.lessons.map((lesson) => {
        const start = globalModuleIndex;
        globalModuleIndex += lesson.modules.length;
        return start;
    });

    const finalNode = { x: CANVAS_WIDTH / 2, y: 100 };

    const finalCastleClassName = [
        'student-shell-map__visual--castle',
        examStatus.has_passed ? 'student-shell-map__visual--done' : '',
        isAllCompleted ? 'student-shell-map__visual--unlocked' : '',
    ]
        .filter(Boolean)
        .join(' ');

    let globalNodeIndex = 0;

    return (
        <div
            className={`student-shell-map student-shell-map--${themeKey} ${mapEntered ? 'student-shell-map--entered' : ''}`}
            style={themeStyle}
        >
            <div className="student-shell-map__header">
                <Link href={selectHref} className="student-shell-map__home" title="My Shells home">
                    <Home size={22} strokeWidth={2.25} aria-hidden="true" />
                    <span className="sr-only">My Shells home</span>
                </Link>
                <button
                    type="button"
                    className="student-shell-map__title-banner"
                    onClick={() => setShellModalOpen(true)}
                    aria-haspopup="dialog"
                >
                    <h2 className="student-shell-map__title">{certification.title}</h2>
                    {githubVerified && (
                        <CheckCircle2 className="student-shell-map__verified-icon" size={20} strokeWidth={2.5} aria-hidden="true" />
                    )}
                    {badgeType === 'github' ? (
                        <span className="student-shell-map__badge student-shell-map__badge--github">
                            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                            {badgeLabel}
                        </span>
                    ) : (
                        <span className="student-shell-map__badge student-shell-map__badge--pro">{badgeLabel}</span>
                    )}
                </button>
            </div>

            <div className="student-shell-map__scroll">
                <div className="student-shell-map__groups">
                    {certification.lessons.map((lesson, lessonIndex) => {
                        const { nodes, height, path } = layoutCurveNodes(lesson.modules.length);
                        const groupStartIndex = lessonOffsets[lessonIndex];

                        return (
                            <section
                                key={lesson.id}
                                className="student-shell-group"
                                style={{ '--shell-group-index': lessonIndex }}
                            >
                                <div className="student-shell-group__divider">
                                    <span>{lesson.title}</span>
                                </div>

                                <div
                                    className="student-shell-group__canvas"
                                    style={{ height: `${height}px`, width: `${CANVAS_WIDTH}px` }}
                                >
                                    {path && (
                                        <svg
                                            className="student-shell-group__curve"
                                            viewBox={`0 0 ${CANVAS_WIDTH} ${height}`}
                                            preserveAspectRatio="none"
                                            aria-hidden="true"
                                        >
                                            <path d={path} />
                                        </svg>
                                    )}

                                    <img
                                        className="student-shell-group__hermy"
                                        src={assetUrl('images/Hermy.png')}
                                        alt=""
                                    />

                                    {lesson.modules.map((module, moduleIndex) => {
                                        const node = nodes[moduleIndex];
                                        const globalIndex = groupStartIndex + moduleIndex;
                                        const completed = isCompleted(module.id);
                                        const unlocked = isUnlocked(globalIndex);
                                        const isActive = activeNode === module.id;

                                        const nodeIndex = globalNodeIndex;
                                        globalNodeIndex += 1;

                                        return (
                                            <MapNodeStack
                                                key={module.id}
                                                x={node.x}
                                                y={node.y}
                                                nodeId={module.id}
                                                nodeIndex={nodeIndex}
                                                isActive={isActive}
                                                visualClassName={`${completed ? 'student-shell-map__visual--done' : unlocked ? 'student-shell-map__visual--unlocked' : ''}`}
                                                ariaLabel={`${module.title}, lesson ${globalIndex + 1} of ${allModules.length}`}
                                                onToggle={() => toggleNode(module.id)}
                                                visualSrc={moduleVisual(module, globalIndex, { completed, unlocked })}
                                            >
                                                <SandboxBubble
                                                    module={module}
                                                    globalIndex={globalIndex}
                                                    totalModules={allModules.length}
                                                    completed={completed}
                                                    unlocked={unlocked}
                                                    moduleTypes={moduleTypes}
                                                    attemptHistory={attemptHistory}
                                                    moduleProgress={moduleProgress}
                                                    onPlay={onPlayModule}
                                                />
                                            </MapNodeStack>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}

                    <section className="student-shell-group student-shell-group--final" style={{ '--shell-group-index': certification.lessons.length }}>
                        <div className="student-shell-group__divider">
                            <span>Final exam</span>
                        </div>

                        <div
                            className="student-shell-group__canvas student-shell-group__canvas--final"
                            style={{ height: '240px', width: `${CANVAS_WIDTH}px` }}
                        >
                            <MapNodeStack
                                x={finalNode.x}
                                y={finalNode.y}
                                nodeId="final"
                                nodeIndex={globalNodeIndex}
                                isActive={activeNode === 'final'}
                                isCastle
                                visualClassName={finalCastleClassName}
                                ariaLabel="Final exam"
                                onToggle={() => toggleNode('final')}
                                visualSrc={assetUrl('images/shells/castle_final_exam.png')}
                            >
                                <FinalExamBubble
                                    isAllCompleted={isAllCompleted}
                                    examStatus={examStatus}
                                    hasDraft={examDraftAvailable}
                                    onTakeFinalExam={onTakeFinalExam}
                                    onViewCertificate={onViewCertificate}
                                    onViewExamResults={onViewExamResults}
                                />
                            </MapNodeStack>
                        </div>
                    </section>
                </div>
            </div>

            <div className="student-shell-map__jump-nav" aria-label="Shell map navigation">
                <button
                    type="button"
                    className="student-shell-map__jump-btn"
                    onClick={scrollToTop}
                    aria-label="Jump to top"
                    title="Jump to top"
                >
                    <ChevronUp size={22} strokeWidth={2.5} aria-hidden="true" />
                </button>
                <button
                    type="button"
                    className="student-shell-map__jump-btn student-shell-map__jump-btn--current"
                    onClick={scrollToCurrent}
                    aria-label="Jump to current sandbox"
                    title="Jump to current sandbox"
                >
                    <ChevronDown size={22} strokeWidth={2.5} aria-hidden="true" />
                </button>
            </div>

            <StudentShellInfoModal
                show={shellModalOpen}
                onClose={() => setShellModalOpen(false)}
                certification={certification}
                progress={progress}
                shellMeta={shellMeta}
                selectHref={selectHref}
            />
        </div>
    );
}
