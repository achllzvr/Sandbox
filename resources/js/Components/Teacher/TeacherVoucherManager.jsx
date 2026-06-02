import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import TeacherSearchCombobox from '@/Components/Teacher/TeacherSearchCombobox';

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
    const [sortFocused, setSortFocused] = useState(false);
    const [highlightId, setHighlightId] = useState(null);

    const searchOptions = useMemo(
        () =>
            voucherGroups.flatMap((group) =>
                group.vouchers.map((voucher) => ({
                    id: voucher.id,
                    label: voucher.code,
                    sublabel: voucher.student_name ?? voucher.student_email ?? group.batch_label,
                    value: voucher.code,
                    voucher,
                })),
            ),
        [voucherGroups],
    );

    const filteredGroups = useMemo(() => {
        const groups = voucherGroups
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

        return groups.map((group) => ({
            ...group,
            vouchers: [...group.vouchers].sort((a, b) => {
                if (sort === 'code') {
                    return a.code.localeCompare(b.code);
                }

                return (b.updated_at ?? '').localeCompare(a.updated_at ?? '') || b.id - a.id;
            }),
        }));
    }, [voucherGroups, search, claimedOnly, sort]);

    const allVisibleIds = filteredGroups.flatMap((group) => group.vouchers.map((voucher) => voucher.id));
    const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));
    const hasSelection = selectedIds.length > 0;

    function handleSearchSelect(option) {
        setHighlightId(option.voucher?.id ?? option.id ?? null);
        const row = document.querySelector(`[data-voucher-id="${option.voucher?.id ?? option.id}"]`);
        row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return (
        <section className="teacher-voucher-manager" aria-labelledby="teacher-voucher-manager-title">
            <h3 id="teacher-voucher-manager-title" className="teacher-voucher-manager__title">
                Voucher Manager
            </h3>

            <div className="student-shop-toolbar teacher-voucher-manager__toolbar">
                <TeacherSearchCombobox
                    value={search}
                    onChange={setSearch}
                    onSelect={handleSearchSelect}
                    options={searchOptions}
                    placeholder="Search vouchers..."
                    ariaLabel="Search vouchers"
                    emptyLabel="No vouchers match"
                />

                <label className="teacher-voucher-manager__filter-check">
                    <input type="checkbox" checked={claimedOnly} onChange={(event) => setClaimedOnly(event.target.checked)} />
                    <span>Show claimed only</span>
                </label>

                <div className={`student-shop-select-wrap ${sortFocused ? 'is-focused' : ''}`}>
                    <ChevronDown size={16} aria-hidden="true" className="student-shop-select-wrap__icon" />
                    <select
                        className="student-shop-select"
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                        onFocus={() => setSortFocused(true)}
                        onBlur={() => setSortFocused(false)}
                        aria-label="Sort vouchers"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="code">Voucher Code</option>
                    </select>
                </div>
            </div>

            {hasSelection ? (
                <div className="teacher-voucher-manager__bulk">
                    <button type="button" className="student-shop-btn student-shop-btn--outline student-shop-btn--sm" onClick={onUnlockExams}>
                        Unlock Final Exams
                    </button>
                    <button
                        type="button"
                        className="student-shop-btn student-shop-btn--ghost student-shop-btn--sm"
                        onClick={onCancelSelection}
                    >
                        Cancel Selection
                    </button>
                </div>
            ) : null}

            <div className="teacher-data-table teacher-data-table--themed">
                <div className="teacher-data-row teacher-data-row--head teacher-data-row--themed" role="row">
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
                                <div
                                    key={voucher.id}
                                    data-voucher-id={voucher.id}
                                    className={`teacher-data-row teacher-data-row--themed ${highlightId === voucher.id ? 'teacher-data-row--highlight' : ''}`}
                                    role="row"
                                >
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
                                            <button
                                                type="button"
                                                className="student-shop-btn student-shop-btn--soft student-shop-btn--sm"
                                                onClick={() => onSendEmail(voucher)}
                                            >
                                                Send to Email
                                            </button>
                                        ) : voucher.email_status === 'sent' ? (
                                            <button
                                                type="button"
                                                className="student-shop-btn student-shop-btn--ghost student-shop-btn--sm"
                                                disabled
                                            >
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
