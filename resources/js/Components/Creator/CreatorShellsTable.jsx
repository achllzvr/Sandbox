import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import CreatorStatusPill from '@/Components/Creator/CreatorStatusPill';
import { assetUrl } from '@/utils/assetUrl';
import { resolveShopTheme } from '@/utils/shellThemes';

const HERMYS_FALLBACK = 'images/Hermy.png';

export default function CreatorShellsTable({ certifications, emptyMessage = 'No shells created yet.' }) {
    return (
        <div className="creator-shells-table admin-card admin-card--chunky">
            <div className="creator-shells-table__head">
                <span>Preview</span>
                <span>Course shell</span>
                <span>Status</span>
            </div>
            <div className="creator-shells-table__body">
                {certifications.length === 0 ? (
                    <div className="admin-empty">
                        <p>{emptyMessage}</p>
                    </div>
                ) : (
                    certifications.map((cert, index) => (
                        <CreatorShellRow key={cert.id} cert={cert} index={index} />
                    ))
                )}
            </div>
        </div>
    );
}

function CreatorShellRow({ cert, index }) {
    const [coverError, setCoverError] = useState(false);
    const { className: theme, style: themeStyle } = resolveShopTheme(cert, index);
    const coverSrc = !coverError && cert.thumbnail_url ? cert.thumbnail_url : assetUrl(HERMYS_FALLBACK);

    return (
        <Link
            href={route('creator.certifications.edit', cert.id)}
            className={`creator-shell-row creator-shell-row--${theme}`}
            style={themeStyle}
        >
            <div className="creator-shell-row__preview">
                <img src={coverSrc} alt="" onError={() => setCoverError(true)} />
            </div>
            <div className="creator-shell-row__body">
                <div className="creator-shell-row__title">
                    {cert.title}
                    {['published', 'approved'].includes(cert.status) ? (
                        <CheckCircle2 size={18} strokeWidth={2.5} aria-hidden="true" />
                    ) : null}
                </div>
                {cert.description ? <p className="creator-shell-row__desc">{cert.description}</p> : null}
            </div>
            <div className="creator-shell-row__status">
                <CreatorStatusPill status={cert.status} className="creator-status-pill" />
            </div>
        </Link>
    );
}
