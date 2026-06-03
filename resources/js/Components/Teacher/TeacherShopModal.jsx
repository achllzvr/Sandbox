import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Minus, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { resolveShopTheme } from '@/utils/shellThemes';
import CheckoutPriceBreakdown, { computeCheckoutTotal } from '@/Components/CheckoutPriceBreakdown';
import { shopBadgeLabel, shopIsGithubVerified, shopProviderLine } from '@/utils/shopCatalog';

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

function formatBatchName(date = new Date()) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function TeacherShopModal({ cert, view, catalogIndex = 0, quantity: quantityProp = 9, onClose, onBack, onProceedToQuantity, onProceedToConfirm }) {
    const { errors: pageErrors = {} } = usePage().props;
    const { className: theme, style: themeStyle } = resolveShopTheme(cert, catalogIndex);
    const [quantity, setQuantity] = useState(quantityProp);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const provider = shopProviderLine(cert);
    const batchName = useMemo(() => `Batch ${formatBatchName()}`, []);

    const tosForm = useForm({
        certification_id: cert?.id ?? null,
        tos_action_irreversible: false,
        tos_privacy_act: false,
    });

    const checkoutForm = useForm({
        purchase_confirmed: false,
        batch_acknowledged: false,
    });

    useEffect(() => {
        if (!cert?.id) {
            return;
        }

        tosForm.setData({
            certification_id: cert.id,
            tos_action_irreversible: false,
            tos_privacy_act: false,
        });
        tosForm.clearErrors();
    }, [cert?.id]);

    if (!cert) {
        return null;
    }

    const canProceedTos = tosForm.data.tos_action_irreversible && tosForm.data.tos_privacy_act;
    const canProceedQuantity = quantity > 0;
    const canProceedConfirm = checkoutForm.data.purchase_confirmed && checkoutForm.data.batch_acknowledged;
    const checkoutError =
        submitError ||
        pageErrors.checkout ||
        checkoutForm.errors.checkout ||
        checkoutForm.errors.certification_id ||
        checkoutForm.errors.quantity;

    function handleTosProceed(event) {
        event.preventDefault();
        if (!canProceedTos) {
            return;
        }
        onProceedToQuantity?.();
    }

    function handleQuantityProceed(event) {
        event.preventDefault();
        if (!canProceedQuantity) {
            return;
        }
        onProceedToConfirm?.(quantity);
    }

    function handleConfirmSubmit(event) {
        event.preventDefault();
        if (!checkoutForm.data.purchase_confirmed || !checkoutForm.data.batch_acknowledged) {
            return;
        }

        if (!cert?.id || quantity < 1) {
            setSubmitError('Select a valid shell and quantity before checkout.');
            return;
        }

        setSubmitError(null);
        setIsSubmitting(true);

        router.post(
            route('teacher.checkout.bulk'),
            {
                certification_id: cert.id,
                quantity,
                expected_total: computeCheckoutTotal(cert.price, quantity),
            },
            {
                preserveScroll: true,
                preserveState: true,
                onError: (errors) => {
                    setSubmitError(
                        errors.checkout ||
                            errors.certification_id ||
                            errors.quantity ||
                            'Checkout failed. Please try again.',
                    );
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    }

    function handleHeaderBack() {
        onBack?.();
    }

    return (
        <div className="student-shop-modal-overlay student-fade-in-up" role="dialog" aria-modal="true">
            <div
                className={`student-shop-modal student-shop-modal--${theme} student-shop-modal--${view} teacher-shop-modal student-fade-in-up student-fade-in-up--delay-1`}
                style={themeStyle}
            >
                {view !== 'success' ? (
                    <button type="button" className="student-shop-modal__back" onClick={handleHeaderBack} aria-label="Go back">
                        <ArrowLeft size={20} strokeWidth={2.25} aria-hidden="true" />
                    </button>
                ) : null}

                <div className="student-shop-modal__content">
                    {view === 'enroll_tos' ? (
                        <form className="student-shop-flow" onSubmit={handleTosProceed}>
                            <h3 className="student-shop-modal__title">You are purchasing a voucher batch</h3>
                            <ShopCertBadge cert={cert} theme={theme} />

                            <label className="student-shop-check">
                                <input
                                    type="checkbox"
                                    checked={tosForm.data.tos_action_irreversible}
                                    onChange={(event) => tosForm.setData('tos_action_irreversible', event.target.checked)}
                                />
                                <span>
                                    Do you understand that this action is <strong>irreversible</strong> and{' '}
                                    <strong>refunds are not allowed</strong>?
                                </span>
                            </label>

                            <label className="student-shop-check">
                                <input
                                    type="checkbox"
                                    checked={tosForm.data.tos_privacy_act}
                                    onChange={(event) => tosForm.setData('tos_privacy_act', event.target.checked)}
                                />
                                <span>
                                    Do you accept the <strong>Terms of Service</strong> and you allow Sandbox to process your data with
                                    respect to the <strong>Data Privacy Act of 2012</strong>?
                                </span>
                            </label>

                            <button
                                type="submit"
                                className={`student-shop-btn student-shop-btn--primary ${canProceedTos ? 'is-ready' : ''}`}
                                disabled={!canProceedTos}
                            >
                                Proceed
                            </button>
                        </form>
                    ) : null}

                    {view === 'quantity' ? (
                        <form className="student-shop-flow teacher-shop-modal__quantity-flow" onSubmit={handleQuantityProceed}>
                            <h3 className="student-shop-modal__title">Voucher batch quantity</h3>
                            <p className="teacher-shop-modal__lead">How many vouchers would you want to purchase for this batch?</p>

                            <div className="teacher-shop-modal__stepper">
                                <button
                                    type="button"
                                    className="teacher-shop-modal__stepper-btn"
                                    onClick={() => setQuantity((current) => Math.max(0, current - 1))}
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={18} strokeWidth={2.5} />
                                </button>
                                <span className="teacher-shop-modal__stepper-value">{quantity}</span>
                                <button
                                    type="button"
                                    className="teacher-shop-modal__stepper-btn"
                                    onClick={() => setQuantity((current) => Math.min(100, current + 1))}
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={18} strokeWidth={2.5} />
                                </button>
                            </div>

                            <button
                                type="submit"
                                className={`student-shop-btn student-shop-btn--primary ${canProceedQuantity ? 'is-ready' : ''}`}
                                disabled={!canProceedQuantity}
                            >
                                Proceed
                            </button>
                        </form>
                    ) : null}

                    {view === 'batch_confirm' ? (
                        <form className="student-shop-flow" onSubmit={handleConfirmSubmit}>
                            <h3 className="student-shop-modal__title">Confirm voucher batch purchase</h3>

                            <CheckoutPriceBreakdown unitPrice={cert.price} quantity={quantity} totalLabel="Batch total" theme={theme} />

                            {checkoutError ? (
                                <div className="student-mock-banner" role="alert">
                                    {checkoutError}
                                </div>
                            ) : null}

                            <label className="student-shop-check">
                                <input
                                    type="checkbox"
                                    checked={checkoutForm.data.purchase_confirmed}
                                    onChange={(event) => checkoutForm.setData('purchase_confirmed', event.target.checked)}
                                />
                                <span>
                                    Do you confirm that you are buying <strong>{quantity} vouchers</strong> for{' '}
                                    <strong>{cert.title.toUpperCase()}</strong> from <strong>{provider.name}</strong>?
                                </span>
                            </label>

                            <label className="student-shop-check">
                                <input
                                    type="checkbox"
                                    checked={checkoutForm.data.batch_acknowledged}
                                    onChange={(event) => checkoutForm.setData('batch_acknowledged', event.target.checked)}
                                />
                                <span>
                                    Do you understand that by buying <strong>{quantity} vouchers</strong>, this will create a new batch
                                    for {cert.title} Shell under the name of the purchase date:{' '}
                                    <em className="teacher-shop-modal__batch-name">&apos;{batchName}&apos;</em>?
                                </span>
                            </label>

                            <button
                                type="submit"
                                className={`student-shop-btn student-shop-btn--primary ${canProceedConfirm ? 'is-ready' : ''}`}
                                disabled={!canProceedConfirm || isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Proceed'}
                            </button>
                        </form>
                    ) : null}

                    {view === 'success' ? (
                        <div className="student-shop-flow student-shop-flow--success teacher-shop-modal__success">
                            <h3 className="teacher-shop-success__title">
                                You have successfully bought <strong>{quantity}</strong> vouchers for
                            </h3>
                            <ShopCertBadge cert={cert} theme={theme} />
                            <Link href={route('teacher.shells.index')} className="student-shop-btn student-shop-btn--success">
                                See at My Shells
                            </Link>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
