import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { resolveShopTheme } from '@/utils/shellThemes';
import CheckoutPriceBreakdown, { computeCheckoutTotal } from '@/Components/CheckoutPriceBreakdown';
import {
    formatShopPrice,
    shopBadgeLabel,
    shopIsGithubVerified,
    shopProviderLine,
} from '@/utils/shopCatalog';

function ShopCertBadge({ cert, theme, className = '' }) {
    const provider = shopProviderLine(cert);
    const badgeLabel = shopBadgeLabel(cert);
    const githubVerified = shopIsGithubVerified(cert);

    return (
        <div className={`student-shop-badge student-shop-badge--${theme} ${className}`.trim()}>
            <div className="student-shop-badge__title-row">
                <p className="student-shop-badge__title">{cert.title.toUpperCase()}</p>
                <CheckCircle2 className="student-shop-badge__verified" size={18} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <p className="student-shop-badge__provider">
                {provider.prefix} {provider.name}
            </p>
            {githubVerified ? (
                <p className="student-shop-badge__github">GitHub Verified Certificate</p>
            ) : (
                <p className="student-shop-badge__subtitle">{badgeLabel}</p>
            )}
        </div>
    );
}

export default function StudentShopModal({
    cert,
    view,
    catalogIndex = 0,
    flashError = null,
    checkoutError = null,
    onClose,
    onBack,
    onOpenEnroll,
    onOpenVoucher,
}) {
    const { className: theme, style: themeStyle } = resolveShopTheme(cert, catalogIndex);

    const enrollForm = useForm({
        certification_id: cert?.id ?? null,
        expected_total: 0,
        payment_method: 'xendit',
        tos_action_irreversible: false,
        tos_privacy_act: false,
    });

    const voucherForm = useForm({
        certification_id: cert?.id ?? null,
        code: '',
        tos_action_irreversible: false,
        tos_privacy_act: false,
    });

    useEffect(() => {
        if (!cert?.id) {
            return;
        }

        enrollForm.setData({
            certification_id: cert.id,
            expected_total: computeCheckoutTotal(cert.price, 1),
            payment_method: 'xendit',
            tos_action_irreversible: false,
            tos_privacy_act: false,
        });

        voucherForm.setData({
            certification_id: cert.id,
            code: '',
            tos_action_irreversible: false,
            tos_privacy_act: false,
        });
        enrollForm.clearErrors();
        voucherForm.clearErrors();
    }, [cert?.id]);

    if (!cert) {
        return null;
    }

    function handleEnrollSubmit(event) {
        event.preventDefault();
        enrollForm.post(route('student.enrollments.checkout'));
    }

    function handleVoucherSubmit(event) {
        event.preventDefault();
        voucherForm.post(route('student.vouchers.redeem'));
    }

    function handleHeaderBack() {
        onBack?.();
    }

    const canSubmitEnroll =
        enrollForm.data.tos_action_irreversible && enrollForm.data.tos_privacy_act && !enrollForm.processing;

    const canSubmitVoucherClaim =
        voucherForm.data.code.trim().length > 0 &&
        voucherForm.data.tos_action_irreversible &&
        voucherForm.data.tos_privacy_act &&
        !voucherForm.processing;

    return (
        <div className="student-shop-modal-overlay student-fade-in-up" role="dialog" aria-modal="true">
            <div
                className={`student-shop-modal student-shop-modal--${theme} student-shop-modal--${view} student-fade-in-up student-fade-in-up--delay-1`}
                style={themeStyle}
            >
                {view !== 'success' ? (
                    <button type="button" className="student-shop-modal__back" onClick={handleHeaderBack} aria-label="Go back">
                        <ArrowLeft size={20} strokeWidth={2.25} aria-hidden="true" />
                    </button>
                ) : null}

                <div className="student-shop-modal__content">
                        {view === 'enroll_tos' ? (
                            <form className="student-shop-flow" onSubmit={handleEnrollSubmit}>
                                <h3 className="student-shop-modal__title">You are enrolling</h3>
                                <ShopCertBadge cert={cert} theme={theme} />
                                <CheckoutPriceBreakdown unitPrice={cert.price} />

                                {(checkoutError || enrollForm.errors.checkout) && (
                                    <div className="student-shop-alert student-shop-alert--error">
                                        {checkoutError || enrollForm.errors.checkout}
                                    </div>
                                )}

                                <label className="student-shop-check">
                                    <input
                                        type="checkbox"
                                        checked={enrollForm.data.tos_action_irreversible}
                                        onChange={(event) =>
                                            enrollForm.setData('tos_action_irreversible', event.target.checked)
                                        }
                                    />
                                    <span>
                                        Do you understand that this action is <strong>irreversible</strong> and{' '}
                                        <strong>refunds are not allowed</strong>?
                                    </span>
                                </label>

                                <label className="student-shop-check">
                                    <input
                                        type="checkbox"
                                        checked={enrollForm.data.tos_privacy_act}
                                        onChange={(event) => enrollForm.setData('tos_privacy_act', event.target.checked)}
                                    />
                                    <span>
                                        Do you accept the <strong>Terms of Service</strong> and you allow Sandbox to
                                        process your data with respect to the <strong>Data Privacy Act of 2012</strong>?
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    className={`student-shop-btn student-shop-btn--primary ${canSubmitEnroll ? 'is-ready' : ''}`}
                                    disabled={!canSubmitEnroll}
                                >
                                    {enrollForm.processing ? 'Processing...' : `Enroll for ${formatShopPrice(cert.price)}`}
                                </button>

                                <button type="button" className="student-shop-btn student-shop-btn--outline" onClick={onOpenVoucher}>
                                    Have a voucher?
                                </button>
                            </form>
                        ) : null}

                        {view === 'voucher_claim' ? (
                            <form className="student-shop-flow" onSubmit={handleVoucherSubmit}>
                                <h3 className="student-shop-modal__title">Your voucher is for</h3>

                                {(voucherForm.errors.code || flashError) && (
                                    <div className="student-shop-alert student-shop-alert--error">
                                        {voucherForm.errors.code || flashError || 'Invalid code. Please double check.'}
                                    </div>
                                )}

                                <ShopCertBadge cert={cert} theme={theme} />

                                <label className="student-shop-check">
                                    <input
                                        type="checkbox"
                                        checked={voucherForm.data.tos_action_irreversible}
                                        onChange={(event) =>
                                            voucherForm.setData('tos_action_irreversible', event.target.checked)
                                        }
                                    />
                                    <span>
                                        Do you understand that this action is <strong>irreversible</strong> and{' '}
                                        <strong>refunds are not allowed</strong>?
                                    </span>
                                </label>

                                <label className="student-shop-check">
                                    <input
                                        type="checkbox"
                                        checked={voucherForm.data.tos_privacy_act}
                                        onChange={(event) =>
                                            voucherForm.setData('tos_privacy_act', event.target.checked)
                                        }
                                    />
                                    <span>
                                        Do you accept the <strong>Terms of Service</strong> and you allow Sandbox to
                                        process your data with respect to the <strong>Data Privacy Act of 2012</strong>?
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    className="student-shop-input"
                                    placeholder="Voucher Code"
                                    value={voucherForm.data.code}
                                    onChange={(event) => voucherForm.setData('code', event.target.value.toUpperCase())}
                                    required
                                />

                                <button
                                    type="submit"
                                    className={`student-shop-btn student-shop-btn--primary ${canSubmitVoucherClaim ? 'is-ready' : ''}`}
                                    disabled={!canSubmitVoucherClaim}
                                >
                                    {voucherForm.processing ? 'Claiming...' : 'Claim shell and start learning'}
                                </button>
                            </form>
                        ) : null}

                        {view === 'success' ? (
                            <div className="student-shop-flow student-shop-flow--success">
                                <h3 className="student-shop-success__title">You have successfully enrolled into</h3>
                                <ShopCertBadge cert={cert} theme={theme} />
                                <Link href={route('student.dashboard')} className="student-shop-btn student-shop-btn--success">
                                    See at my shells
                                </Link>
                            </div>
                        ) : null}
                </div>
            </div>
        </div>
    );
}
