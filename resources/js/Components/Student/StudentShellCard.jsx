import { Link, router } from '@inertiajs/react';
import { CheckCircle2, Home } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { themeKeyForShell } from '@/utils/shellThemes';
import { assetUrl } from '@/utils/assetUrl';

const HERMYS_FALLBACK = 'images/Hermy.png';

export default function StudentShellCard({ shell, index = 0, style, defaultShellId = null, showDefaultAction = false }) {
    const theme = themeKeyForShell(shell, index);
    const progressTone = shell.progress >= 50 ? 'green' : 'red';
    const [coverError, setCoverError] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const confirmRef = useRef(null);
    const isDefault = defaultShellId === shell.id;
    const canSetDefault = showDefaultAction && !shell.is_mock;

    const coverSrc =
        !coverError && shell.cover_image ? shell.cover_image : assetUrl(HERMYS_FALLBACK);
    const useCoverFill = !coverError && shell.cover_image;

    const href = shell.is_mock
        ? route('student.dashboard', { shell: shell.id })
        : route('student.shells.show', shell.id);
    const badgeType = shell.badge_type ?? (shell.github_verified ? 'github' : 'pro');
    const badgeLabel = shell.badge_label ?? (badgeType === 'github' ? 'GITHUB VERIFIED CERTIFICATE' : 'Professional Certificate');

    useEffect(() => {
        if (!confirmOpen) {
            return undefined;
        }

        function handlePointerDown(event) {
            if (confirmRef.current && !confirmRef.current.contains(event.target)) {
                setConfirmOpen(false);
            }
        }

        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [confirmOpen]);

    function handleOpenConfirm(event) {
        event.preventDefault();
        event.stopPropagation();
        setConfirmOpen(true);
    }

    function handleCancelConfirm(event) {
        event.preventDefault();
        event.stopPropagation();
        setConfirmOpen(false);
    }

    function handleConfirmDefault(event) {
        event.preventDefault();
        event.stopPropagation();
        setConfirmOpen(false);

        router.post(route('student.preferences.default-shell'), {
            certification_id: shell.id,
        }, {
            preserveScroll: true,
        });
    }

    return (
        <div
            className={`student-shell-card student-shell-card--${theme} ${isDefault ? 'student-shell-card--default' : ''}`}
            style={style}
        >
            {isDefault ? (
                <span className="student-shell-card__default-badge">
                    <Home size={14} strokeWidth={2.5} aria-hidden="true" />
                    Home shell
                </span>
            ) : null}

            {canSetDefault && !isDefault ? (
                <div className="student-shell-card__home-wrap" ref={confirmRef}>
                    <button
                        type="button"
                        className="student-shell-card__home-btn"
                        onClick={handleOpenConfirm}
                        aria-label={`Set ${shell.title} as home shell`}
                        aria-expanded={confirmOpen}
                    >
                        <Home size={18} strokeWidth={2.25} aria-hidden="true" />
                    </button>

                    {confirmOpen ? (
                        <div className="student-shell-card__home-confirm" role="dialog" aria-label="Confirm home shell">
                            <p className="student-shell-card__home-confirm-text">Set as your home shell?</p>
                            <div className="student-shell-card__home-confirm-actions">
                                <button type="button" className="student-shell-card__home-confirm-yes" onClick={handleConfirmDefault}>
                                    Yes
                                </button>
                                <button type="button" className="student-shell-card__home-confirm-no" onClick={handleCancelConfirm}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}

            <Link href={href} className="student-shell-card__link">
                <div className={`student-shell-card__media ${useCoverFill ? 'student-shell-card__media--cover' : ''}`}>
                    <img
                        src={coverSrc}
                        alt=""
                        onError={() => setCoverError(true)}
                    />
                </div>
                <div className="student-shell-card__progress">
                    <div
                        className={`student-shell-card__progress-bar student-shell-card__progress-bar--${progressTone}`}
                        style={{ width: `${shell.progress}%` }}
                    />
                </div>
                <div className="student-shell-card__body">
                    <h3 className="student-shell-card__title">
                        {shell.title}
                        <CheckCircle2 className="student-shell-card__verified" size={20} strokeWidth={2.5} aria-hidden="true" />
                    </h3>
                    {badgeType === 'github' ? (
                        <span className="student-shell-card__badge student-shell-card__badge--github">
                            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.778-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                            {badgeLabel}
                        </span>
                    ) : (
                        <span className="student-shell-card__badge student-shell-card__badge--pro">{badgeLabel}</span>
                    )}
                    <span className="student-shell-card__cta">
                        {isDefault ? 'CONTINUE THIS SANDBOX' : 'OPEN THIS SHELL'}
                    </span>
                </div>
            </Link>
        </div>
    );
}
