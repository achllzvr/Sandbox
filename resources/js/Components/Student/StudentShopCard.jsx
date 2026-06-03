import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { assetUrl } from '@/utils/assetUrl';
import {
    formatShopPrice,
    shopBadgeLabel,
    shopIsGithubVerified,
    shopProviderLine,
} from '@/utils/shopCatalog';
import { resolveShopTheme } from '@/utils/shellThemes';

const HERMYS_FALLBACK = 'images/Hermy.png';

export default function StudentShopCard({ cert, index = 0, isOwned = false, onOpenDetails }) {
    const { className: theme, style: themeStyle } = resolveShopTheme(cert, index);
    const provider = shopProviderLine(cert);
    const badgeLabel = shopBadgeLabel(cert);
    const githubVerified = shopIsGithubVerified(cert);
    const [coverError, setCoverError] = useState(false);

    const coverSrc = !coverError && (cert?.thumbnail_url ?? (cert?.thumbnail ? assetUrl(`storage/${cert.thumbnail}`) : null));
    const useCoverFill = Boolean(coverSrc);

    const cardBody = (
        <>
            <div
                className={`student-shell-card__media ${useCoverFill ? 'student-shell-card__media--cover' : ''} student-shell-card__media--shop`}
            >
                <span className="student-shop-card__price">{formatShopPrice(cert.price)}</span>
                {coverSrc ? (
                    <img src={coverSrc} alt="" onError={() => setCoverError(true)} />
                ) : (
                    <img src={assetUrl(HERMYS_FALLBACK)} alt="" />
                )}
            </div>

            <div className="student-shell-card__body student-shell-card__body--shop">
                <h3 className="student-shell-card__title student-shell-card__title--shop">
                    <span className="student-shell-card__title-main">{cert.title.toUpperCase()}</span>
                    <CheckCircle2 className="student-shell-card__verified" size={20} strokeWidth={2.5} aria-hidden="true" />
                    <span className="student-shell-card__provider">
                        {provider.prefix} {provider.name}
                    </span>
                </h3>

                {githubVerified ? (
                    <span className="student-shell-card__badge student-shell-card__badge--github">{badgeLabel}</span>
                ) : (
                    <span className="student-shell-card__badge student-shell-card__badge--pro">{badgeLabel}</span>
                )}

                <p className="student-shop-card__desc">
                    {cert.description || 'An exam covering foundational skills for this technology.'}
                </p>

                {isOwned ? (
                    <Link href={route('student.shells.show', cert.id)} className="student-shell-card__cta">
                        See at My Shells
                    </Link>
                ) : (
                    <span className="student-shell-card__cta">More details</span>
                )}
            </div>
        </>
    );

    return (
        <article
            className={`student-shell-card student-shell-card--${theme} student-shell-card--shop ${isOwned ? 'student-shell-card--shop-owned' : ''} student-enter__item`}
            style={{ '--student-enter-index': index, ...themeStyle }}
        >
            {isOwned ? (
                <div className="student-shell-card__shop-link student-shell-card__shop-link--owned">{cardBody}</div>
            ) : (
                <button type="button" className="student-shell-card__shop-link" onClick={() => onOpenDetails(cert)}>
                    {cardBody}
                </button>
            )}
        </article>
    );
}
