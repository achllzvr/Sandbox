import { Link } from '@inertiajs/react';
import { CheckCircle2, X } from 'lucide-react';
import Modal from '@/Components/Modal';
import { shellThemeCssVars, themeKeyForShell } from '@/utils/shellThemes';
import { assetUrl } from '@/utils/assetUrl';

export default function StudentShellInfoModal({
    show,
    onClose,
    certification,
    progress,
    shellMeta = {},
    selectHref,
}) {
    if (!certification) {
        return null;
    }

    const themeKey = themeKeyForShell(shellMeta);
    const badgeType = shellMeta.badge_type ?? 'pro';
    const badgeLabel = shellMeta.badge_label ?? 'Professional Certificate';
    const githubVerified = shellMeta.github_verified ?? badgeType === 'github';
    const progressPct = progress?.percentage ?? shellMeta.progress ?? 0;
    const completed = progress?.completed_modules ?? shellMeta.completed_modules ?? 0;
    const total = progress?.total_modules ?? shellMeta.total_modules ?? 0;
    const cover = shellMeta.cover_image ?? null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div
                className={`student-shell-modal student-shell-modal--${themeKey}`}
                style={shellThemeCssVars(themeKey)}
            >
                <button type="button" className="student-shell-modal__close" onClick={onClose} aria-label="Close">
                    <X size={18} strokeWidth={2.5} />
                </button>

                {cover ? (
                    <div className="student-shell-modal__cover">
                        <img src={cover} alt="" />
                    </div>
                ) : (
                    <div className="student-shell-modal__cover student-shell-modal__cover--fallback">
                        <img src={assetUrl('images/Hermy.png')} alt="" />
                    </div>
                )}

                <div className="student-shell-modal__body">
                    <h2 className="student-shell-modal__title">
                        {certification.title}
                        {githubVerified && (
                            <CheckCircle2 size={22} strokeWidth={2.5} className="student-shell-modal__verified" aria-hidden="true" />
                        )}
                    </h2>

                    {badgeType === 'github' ? (
                        <span className="student-shell-modal__badge student-shell-modal__badge--github">
                            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                            {badgeLabel}
                        </span>
                    ) : (
                        <span className="student-shell-modal__badge student-shell-modal__badge--pro">{badgeLabel}</span>
                    )}

                    <div className="student-shell-modal__progress">
                        <div className="student-shell-modal__progress-label">
                            <span>Shell progress</span>
                            <span>{Math.round(progressPct)}%</span>
                        </div>
                        <div className="student-shell-modal__progress-track">
                            <div className="student-shell-modal__progress-fill" style={{ width: `${progressPct}%` }} />
                        </div>
                        <p className="student-shell-modal__progress-meta">
                            {completed} of {total} sandboxes completed
                        </p>
                    </div>

                    <p className="student-shell-modal__description">
                        Continue your certification journey through interactive sandboxes, quizzes, and a final sandcastle
                        exam.
                    </p>

                    {selectHref && (
                        <Link href={selectHref} className="student-shell-modal__switch" onClick={onClose}>
                            Switch to another shell
                        </Link>
                    )}
                </div>
            </div>
        </Modal>
    );
}
