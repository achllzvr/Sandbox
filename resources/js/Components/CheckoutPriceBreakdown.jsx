import { formatShopPrice } from '@/utils/shopCatalog';

export function computeCheckoutTotal(unitPrice, quantity = 1) {
    const unit = parseFloat(unitPrice) || 0;
    const qty = Math.max(1, Number.parseInt(quantity, 10) || 1);

    return Math.round(unit * qty * 100) / 100;
}

export default function CheckoutPriceBreakdown({
    unitPrice,
    quantity = 1,
    totalLabel = 'Total due',
    className = '',
    theme = 'green',
}) {
    const unit = parseFloat(unitPrice) || 0;
    const qty = Math.max(1, Number.parseInt(quantity, 10) || 1);
    const total = computeCheckoutTotal(unit, qty);
    const showLineItems = qty > 1;

    return (
        <div className={`checkout-price-breakdown checkout-price-breakdown--${theme} ${className}`.trim()}>
            <p className="checkout-price-breakdown__heading">Price breakdown</p>
            <div className="checkout-price-breakdown__card">
                {showLineItems ? (
                    <>
                        <div className="checkout-price-breakdown__row">
                            <span>Price per voucher</span>
                            <span>{formatShopPrice(unit)}</span>
                        </div>
                        <div className="checkout-price-breakdown__row">
                            <span>Quantity</span>
                            <span>{qty}</span>
                        </div>
                    </>
                ) : (
                    <div className="checkout-price-breakdown__row">
                        <span>Shell price</span>
                        <span>{formatShopPrice(unit)}</span>
                    </div>
                )}
                <div className="checkout-price-breakdown__divider" aria-hidden="true" />
                <div className="checkout-price-breakdown__row checkout-price-breakdown__row--total">
                    <span>{totalLabel}</span>
                    <strong>{formatShopPrice(total)}</strong>
                </div>
            </div>
        </div>
    );
}
