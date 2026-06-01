import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { assetUrl } from '@/utils/assetUrl';
import { resolveShellCardTheme } from '@/utils/shellThemes';

const HERMYS_FALLBACK = 'images/Hermy.png';

export default function TeacherShellCard({ shell, index = 0, style }) {
    const { className: theme, style: themeStyle } = resolveShellCardTheme(shell, index);
    const [coverError, setCoverError] = useState(false);

    const coverSrc = !coverError && shell.cover_image ? shell.cover_image : assetUrl(HERMYS_FALLBACK);
    const useCoverFill = !coverError && shell.cover_image;

    const badgeType = shell.badge_type ?? 'pro';
    const badgeLabel = shell.badge_label ?? 'Professional Certificate';

    return (
        <div
            className={`student-shell-card student-shell-card--${theme} teacher-shell-card`}
            style={{ ...themeStyle, ...style }}
        >
            <Link href={route('teacher.shells.show', shell.id)} className="student-shell-card__link">
                <div className={`student-shell-card__media ${useCoverFill ? 'student-shell-card__media--cover' : ''}`}>
                    <img src={coverSrc} alt="" onError={() => setCoverError(true)} />
                </div>
                <div className="student-shell-card__body">
                    <h3 className="student-shell-card__title">
                        {shell.title}
                        <CheckCircle2 className="student-shell-card__verified" size={20} strokeWidth={2.5} aria-hidden="true" />
                    </h3>
                    {badgeType === 'github' ? (
                        <span className="student-shell-card__badge student-shell-card__badge--github">{badgeLabel}</span>
                    ) : (
                        <span className="student-shell-card__badge student-shell-card__badge--pro">{badgeLabel}</span>
                    )}
                    <span className="student-shell-card__cta teacher-shell-card__cta">See shell data</span>
                </div>
            </Link>
        </div>
    );
}
