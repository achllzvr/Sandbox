import { Head, useForm } from '@inertiajs/react';
import CreatorLayout from '@/Layouts/CreatorLayout';

function formatMoney(amount) {
    return `₱${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusLabel(status) {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ?? '—';
}

export default function WalletIndex({ availableBalance = 0, pendingBalance = 0, earnings = [], withdrawals = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({ amount: '' });

    function submitWithdraw(e) {
        e.preventDefault();
        post(route('creator.wallet.withdraw'), {
            onSuccess: () => reset('amount'),
            preserveScroll: true,
        });
    }

    return (
        <CreatorLayout activeNav="wallet" pageTitle="Wallet">
            <Head title="Wallet" />

            <div className="admin-stats" style={{ marginBottom: '20px' }}>
                <div className="admin-stat">
                    <span className="admin-stat__value">{formatMoney(availableBalance)}</span>
                    <span className="admin-stat__label">Available balance</span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat__value">{formatMoney(pendingBalance)}</span>
                    <span className="admin-stat__label">Pending clearance</span>
                </div>
            </div>

            <div className="admin-card admin-card--chunky" style={{ marginBottom: '20px' }}>
                <div className="admin-card__header"><h3>Request withdrawal</h3></div>
                <form onSubmit={submitWithdraw} className="admin-card__body">
                    <label className="admin-field">
                        <span className="admin-field__label">Amount</span>
                        <input
                            type="number"
                            min="1"
                            step="0.01"
                            max={availableBalance || undefined}
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="input-field"
                            placeholder="0.00"
                            disabled={availableBalance <= 0}
                        />
                        {errors.amount ? <p className="admin-field__hint" style={{ color: 'var(--admin-danger-text)' }}>{errors.amount}</p> : null}
                    </label>
                    <button type="submit" disabled={processing || availableBalance <= 0} className="admin-btn admin-btn--primary">
                        Request withdrawal
                    </button>
                </form>
            </div>

            <div className="admin-card admin-card--chunky">
                <div className="admin-card__header"><h3>Recent earnings</h3></div>
                <div className="admin-card__body admin-card__body--flush">
                    {earnings.length === 0 ? (
                        <div className="admin-empty"><p>No earnings recorded yet.</p></div>
                    ) : (
                        earnings.map((row) => (
                            <div key={row.id} className="admin-list-row">
                                <div>
                                    <p className="admin-list-row__title">{row.certification}</p>
                                    <p className="admin-list-row__meta">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}</p>
                                </div>
                                <div className="admin-list-row__meta">{formatMoney(row.amount)}</div>
                                <div className="admin-list-row__meta">{statusLabel(row.status)}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {withdrawals.length > 0 ? (
                <div className="admin-card admin-card--chunky" style={{ marginTop: '20px' }}>
                    <div className="admin-card__header"><h3>Withdrawal history</h3></div>
                    <div className="admin-card__body admin-card__body--flush">
                        {withdrawals.map((row) => (
                            <div key={row.id} className="admin-list-row">
                                <div>
                                    <p className="admin-list-row__title">{formatMoney(row.amount)}</p>
                                    <p className="admin-list-row__meta">Requested {row.requested_at ? new Date(row.requested_at).toLocaleDateString() : '—'}</p>
                                </div>
                                <div className="admin-list-row__meta">{statusLabel(row.status)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </CreatorLayout>
    );
}
