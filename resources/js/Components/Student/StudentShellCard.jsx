import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { assetUrl } from '@/utils/assetUrl';

const THEMES = ['pink', 'blue', 'green'];
const SHELL_IMAGES = [
    'images/shells/shell_var1.png',
    'images/shells/shell_var2.png',
    'images/shells/shell_var3.png',
    'images/shells/shell_var4.png',
];

export default function StudentShellCard({ shell, index = 0 }) {
    const theme = THEMES[index % THEMES.length];
    const progressTone = shell.progress >= 50 ? 'green' : 'red';
    const image = shell.image ?? SHELL_IMAGES[index % SHELL_IMAGES.length];
    const href = shell.is_mock
        ? route('marketplace.index')
        : route('student.shells.show', shell.id);

    return (
        <Link
            href={href}
            className={`student-shell-card student-shell-card--${theme}`}
        >
            <div className="student-shell-card__media">
                <img src={assetUrl(image)} alt="" />
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
                    <CheckCircle2 size={18} strokeWidth={2.5} aria-hidden="true" />
                </h3>
                {shell.github_verified ? (
                    <span className="student-shell-card__badge student-shell-card__badge--github">
                        GITHUB VERIFIED CERTIFICATE
                    </span>
                ) : (
                    <span className="student-shell-card__badge student-shell-card__badge--pro">
                        Professional Certificate
                    </span>
                )}
                <span className="student-shell-card__cta">CONTINUE THIS SANDBOX</span>
            </div>
        </Link>
    );
}
