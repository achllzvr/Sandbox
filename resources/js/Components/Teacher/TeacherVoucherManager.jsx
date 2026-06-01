import { ChevronDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function TeacherVoucherManager({
    voucherGroups = [],
    selectedIds = [],
    onToggleSelect,
    onToggleSelectAll,
    onSendEmail,
    onCancelSelection,
    onUnlockExams,
}) {
    const [search, setSearch] = useState('');
    const [claimedOnly, setClaimedOnly] = useState(false);
    const [sort, setSort] = useState('recent');

    const filteredGroups = useMemo(() => {
        return voucherGroups
            .map((group) => ({
                ...group,
                vouchers: group.vouchers.filter((voucher) => {
                    if (claimedOnly && voucher.status !== 'claimed') {
                        return false;
                    }

                    if (!search.trim()) {
                        return true;
                    }

                    const needle = search.toLowerCase();
                    return (
                        voucher.code.toLowerCase().includes(needle) ||
                        (voucher.student_name ?? '').toLowerCase().includes(needle) ||
                        (voucher.student_email ?? '').toLowerCase().includes(needle)
                    );
                }),
            }))
            .filter((group) => group.vouchers.length > 0);
    }, [voucherGroups, search, claimedOnly]);

    const allVisibleIds = filteredGroups.flatMap((group) => group.vouchers.map((voucher) => voucher.id));
    const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));
    const hasSelection = selectedIds.length > 0;

    return (
        <section className="teacher-voucher-manager" aria-labelledby="teacher-voucher-manager-title">
            <h3 id="teacher-voucher-manager-title" className="teacher-voucher-manager__title">
                Voucher Manager
            </h3>

            <div className="teacher-voucher-manager__toolbar">
                <div className="teacher-voucher-manager__search">
                    <Search size={16} aria-hidden="true" />
                    <input
                        type="search"
                        placeholder="Search vouchers..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        aria-label="Search vouchers"
                    />
                </div>

                <label className="teacher-voucher-manager__filter">
                    <input type="checkbox" checked={claimedOnly} onChange={(event) => setClaimedOnly(event.target.checked)} />
                    <span>Show claimed only</span>
                </label>

                <div className="teacher-voucher-manager__sort-wrap">
                    <ChevronDown size={14} aria-hidden="true" />
                    <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort vouchers">
                        <option value="recent">Most Recent</option>
                        <option value="code">Voucher Code</option>
                    </select>
                </div>
            </div>

            {hasSelection ? (
                <div className="teacher-voucher-manager__bulk">
                    <button type="button" className="teacher-voucher-manager__bulk-btn" onClick={onUnlockExams}>
                        Unlock Final Exams
                    </button>
                    <button type="button" className="teacher-voucher-manager__bulk-btn teacher-voucher-manager__bulk-btn--ghost" onClick={onCancelSelection}>
                        Cancel Selection
                    </button>
                </div>
            ) : null}

            <div className="teacher-voucher-manager__table">
                <div className="teacher-voucher-manager__header" role="row">
                    <span>
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(event) => onToggleSelectAll(allVisibleIds, event.target.checked)}
                            aria-label="Select all visible vouchers"
                        />
                    </span>
                    <span>Voucher Code</span>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Last Update Time</span>
                </div>

                {filteredGroups.length === 0 ? (
                    <div className="teacher-voucher-manager__empty">No vouchers match your filters.</div>
                ) : (
                    filteredGroups.map((group) => (
                        <div key={group.batch_id} className="teacher-voucher-manager__group">
                            <div className="teacher-voucher-manager__group-label">{group.batch_label}</div>
                            {group.vouchers.map((voucher) => (
                                <div key={voucher.id} className="teacher-voucher-manager__row" role="row">
                                    <span>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(voucher.id)}
                                            onChange={() => onToggleSelect(voucher.id)}
                                            aria-label={`Select voucher ${voucher.code}`}
                                        />
                                    </span>
                                    <span className="teacher-voucher-manager__code">{voucher.code}</span>
                                    <span className={voucher.status === 'unclaimed' ? 'teacher-voucher-manager__unclaimed' : ''}>
                                        {voucher.student_name ?? 'Unclaimed'}
                                    </span>
                                    <span className="teacher-voucher-manager__email-cell">
                                        {voucher.email_status === 'sendable' ? (
                                            <button type="button" className="teacher-voucher-manager__send-btn" onClick={() => onSendEmail(voucher)}>
                                                Send to Email
                                            </button>
                                        ) : voucher.email_status === 'sent' ? (
                                            <button type="button" className="teacher-voucher-manager__send-btn teacher-voucher-manager__send-btn--sent" disabled>
                                                Sent to Email
                                            </button>
                                        ) : (
                                            <span title={voucher.student_email}>{voucher.student_email ?? '--'}</span>
                                        )}
                                    </span>
                                    <span>{voucher.updated_at ?? '--'}</span>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
