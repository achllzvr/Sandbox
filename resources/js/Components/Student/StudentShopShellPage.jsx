import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { showAppToast } from '@/Utils/appToast';
import { assetUrl } from '@/utils/assetUrl';
import { resolveShopTheme } from '@/utils/shellThemes';
import {
    formatShopPrice,
    shopBadgeLabel,
    shopDifficultyLabel,
    shopDurationLabel,
    shopProviderLine,
} from '@/utils/shopCatalog';

const HERMYS_FALLBACK = 'images/Hermy.png';

export default function StudentShopShellPage({ cert, catalogIndex = 0, onBack, onOpenEnroll, onOpenVoucher }) {
    const { className: theme, style: themeStyle } = resolveShopTheme(cert, catalogIndex);
    const provider = shopProviderLine(cert);
    const badgeLabel = shopBadgeLabel(cert);
    const [coverError, setCoverError] = useState(false);

    const coverSrc = !coverError && (cert?.thumbnail_url ?? (cert?.thumbnail ? assetUrl(`storage/${cert.thumbnail}`) : null));

    return (
        <div className={`student-shop-shell-page student-shop-shell-page--${theme} student-fade-in-up`} style={themeStyle}>
            <div className="student-shop-shell-page__hero">
                <button type="button" className="student-shop-shell-page__back" onClick={onBack} aria-label="Back to shop">
                    <ArrowLeft size={20} strokeWidth={2.25} aria-hidden="true" />
                </button>

                {coverSrc ? (
                    <img src={coverSrc} alt="" className="student-shop-shell-page__hero-image" onError={() => setCoverError(true)} />
                ) : (
                    <img src={assetUrl(HERMYS_FALLBACK)} alt="" className="student-shop-shell-page__hero-fallback" />
                )}
            </div>

            <section className="student-shop-shell-page__info" aria-labelledby="shop-shell-title">
                <h1 id="shop-shell-title" className="student-shop-shell-page__title">
                    <span className="student-shop-shell-page__title-main">{cert.title.toUpperCase()}</span>
                    <CheckCircle2 size={22} strokeWidth={2.5} aria-hidden="true" />
                    <span className="student-shop-shell-page__provider">
                        {provider.prefix} {provider.name}
                    </span>
                </h1>

                <p className="student-shop-shell-page__subtitle">{badgeLabel}</p>

                <p className="student-shop-shell-page__desc">
                    {cert.description ||
                        'An exam that covers the basics and foundational skills required. Ensure that you learn the fundamentals and modern technologies associated.'}
                </p>
            </section>

            <div className="student-shop-shell-page__actions">
                <div className="student-shop-shell-page__cta-stack">
                    <button type="button" className="student-shop-btn student-shop-btn--primary" onClick={onOpenEnroll}>
                        Enroll for {formatShopPrice(cert.price)}
                    </button>
                    <button type="button" className="student-shop-btn student-shop-btn--soft" onClick={onOpenVoucher}>
                        Have a voucher?
                    </button>
                </div>

                <button
                    type="button"
                    className="student-shop-shell-page__quick-test"
                    onClick={() => showAppToast('info', 'Diagnostic pre-assessment coming soon.')}
                >
                    Try a quick test
                </button>

                <div className="student-shop-shell-page__stats-shell">
                    <div className="student-shop-shell-page__stats">
                        <div className="student-shop-shell-page__stat">
                            <span className="student-shop-shell-page__stat-value">{shopDurationLabel(cert)}</span>
                            <span className="student-shop-shell-page__stat-label">Duration</span>
                        </div>
                        <div className="student-shop-shell-page__stat">
                            <span className="student-shop-shell-page__stat-value">{shopDifficultyLabel(cert)}</span>
                            <span className="student-shop-shell-page__stat-label">Difficulty rating</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
