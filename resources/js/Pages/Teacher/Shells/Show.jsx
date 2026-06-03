/**
 * Teacher shell landing — batch data + voucher manager for one purchased shell.
 */
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import TeacherBatchDataPanel from '@/Components/Teacher/TeacherBatchDataPanel';
import TeacherPurchaseHistoryModal from '@/Components/Teacher/TeacherPurchaseHistoryModal';
import TeacherSendVoucherModal from '@/Components/Teacher/TeacherSendVoucherModal';
import TeacherVoucherManager from '@/Components/Teacher/TeacherVoucherManager';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { showAppToast } from '@/Utils/appToast';
import { assetUrl } from '@/utils/assetUrl';
import {
    shopBadgeLabel,
    shopDifficultyLabel,
    shopDurationLabel,
    shopProviderLine,
} from '@/utils/shopCatalog';
import { resolveShopTheme } from '@/utils/shellThemes';

const HERMYS_FALLBACK = 'images/Hermy.png';

export default function Show({
    certification,
    batches = [],
    voucherGroups: initialGroups = [],
    purchaseHistory = [],
    isMock = false,
}) {
    const { flash } = usePage().props;
    const { className: theme, style: themeStyle } = resolveShopTheme(certification, certification.id - 1);
    const provider = shopProviderLine(certification);
    const badgeLabel = shopBadgeLabel(certification);

    const [voucherGroups, setVoucherGroups] = useState(initialGroups);
    const [selectedIds, setSelectedIds] = useState([]);
    const [emailVoucher, setEmailVoucher] = useState(null);
    const [emailModalView, setEmailModalView] = useState(null);
    const [coverError, setCoverError] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);

    const coverSrc = !coverError && (certification?.thumbnail_url ?? null);

    useEffect(() => {
        setVoucherGroups(initialGroups);
    }, [initialGroups]);

    useEffect(() => {
        const sent = flash?.voucher_email_sent;
        if (!sent?.voucher_id) {
            return;
        }

        setVoucherGroups((current) =>
            current.map((group) => ({
                ...group,
                vouchers: group.vouchers.map((voucher) =>
                    voucher.id === sent.voucher_id
                        ? { ...voucher, email_status: 'sent', student_email: sent.email }
                        : voucher,
                ),
            })),
        );
        setEmailModalView('success');
    }, [flash?.voucher_email_sent]);

    function handleToggleSelect(id) {
        setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    }

    function handleToggleSelectAll(ids, checked) {
        if (!checked) {
            setSelectedIds((current) => current.filter((id) => !ids.includes(id)));
            return;
        }

        setSelectedIds((current) => [...new Set([...current, ...ids])]);
    }

    function handleSendEmail(voucher) {
        setEmailVoucher(voucher);
        setEmailModalView('form');
    }

    function handleEmailSuccess(voucherId, email) {
        setVoucherGroups((current) =>
            current.map((group) => ({
                ...group,
                vouchers: group.vouchers.map((voucher) =>
                    voucher.id === voucherId ? { ...voucher, email_status: 'sent', student_email: email } : voucher,
                ),
            })),
        );
    }

    function closeEmailModal() {
        setEmailVoucher(null);
        setEmailModalView(null);
    }

    return (
        <TeacherLayout activeNav="shells" layoutMode="shop-detail" workspaceModifier="shop-detail">
            <Head title={`${certification.title} — Shell Data`} />

            <div className={`teacher-shell-landing student-shop-shell-page student-shop-shell-page--${theme} student-fade-in-up`} style={themeStyle}>
                <div className="teacher-shell-landing__hero-bar">
                    <Link href={route('teacher.shells.index')} className="student-shop-shell-page__back" aria-label="Back to My Shells">
                        <ArrowLeft size={20} strokeWidth={2.25} aria-hidden="true" />
                    </Link>
                    <div className="teacher-shell-landing__hero-actions">
                        <button
                            type="button"
                            className="teacher-shell-landing__history-btn"
                            onClick={() => setHistoryOpen(true)}
                        >
                            Purchase history
                        </button>
                    </div>
                </div>

                <div className="student-shop-shell-page__hero">
                    {coverSrc ? (
                        <img src={coverSrc} alt="" className="student-shop-shell-page__hero-image" onError={() => setCoverError(true)} />
                    ) : (
                        <img src={assetUrl(HERMYS_FALLBACK)} alt="" className="student-shop-shell-page__hero-fallback" />
                    )}
                </div>

                <section className="student-shop-shell-page__info" aria-labelledby="teacher-shell-title">
                    <h1 id="teacher-shell-title" className="student-shop-shell-page__title">
                        <span className="student-shop-shell-page__title-main">{certification.title.toUpperCase()}</span>
                        <CheckCircle2 size={22} strokeWidth={2.5} aria-hidden="true" />
                        <span className="student-shop-shell-page__provider">
                            {provider.prefix} {provider.name}
                        </span>
                    </h1>
                    <p className="student-shop-shell-page__subtitle">{badgeLabel}</p>
                    <p className="student-shop-shell-page__desc">{certification.description}</p>
                </section>

                <div className="student-shop-shell-page__stats-shell teacher-shell-landing__stats">
                    <div className="student-shop-shell-page__stats">
                        <div className="student-shop-shell-page__stat">
                            <span className="student-shop-shell-page__stat-value">{shopDurationLabel(certification)}</span>
                            <span className="student-shop-shell-page__stat-label">Duration</span>
                        </div>
                        <div className="student-shop-shell-page__stat">
                            <span className="student-shop-shell-page__stat-value">{shopDifficultyLabel(certification)}</span>
                            <span className="student-shop-shell-page__stat-label">Difficulty rating</span>
                        </div>
                    </div>
                </div>

                <div className="teacher-shell-landing__panels">
                    <TeacherBatchDataPanel batches={batches} certificationId={certification.id} />
                    <TeacherVoucherManager
                        voucherGroups={voucherGroups}
                        selectedIds={selectedIds}
                        onToggleSelect={handleToggleSelect}
                        onToggleSelectAll={handleToggleSelectAll}
                        onSendEmail={handleSendEmail}
                        onCancelSelection={() => setSelectedIds([])}
                        onUnlockExams={() => showAppToast('info', 'Unlock final exams for selected vouchers — coming soon.')}
                    />
                </div>

                {isMock ? <p className="teacher-shell-landing__mock-note">Sample voucher data — TODO[backend] wire to teacher cohorts.</p> : null}
            </div>

            <TeacherPurchaseHistoryModal
                show={historyOpen}
                onClose={() => setHistoryOpen(false)}
                title={`Purchase history — ${certification.title}`}
                transactions={purchaseHistory}
                isMock={isMock}
            />

            {emailVoucher && emailModalView ? (
                <TeacherSendVoucherModal
                    voucher={emailVoucher}
                    view={emailModalView}
                    onBack={closeEmailModal}
                    onClose={closeEmailModal}
                    onSuccess={handleEmailSuccess}
                />
            ) : null}
        </TeacherLayout>
    );
}
