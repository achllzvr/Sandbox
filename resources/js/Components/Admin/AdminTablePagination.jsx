function pageNumbers(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = new Set([1, total, current, current - 1, current + 1]);
    return [...pages]
        .filter((n) => n >= 1 && n <= total)
        .sort((a, b) => a - b)
        .reduce((acc, n, i, arr) => {
            if (i > 0 && n - arr[i - 1] > 1) {
                acc.push('…');
            }
            acc.push(n);
            return acc;
        }, []);
}

export default function AdminTablePagination({
    page,
    totalPages,
    totalItems,
    rangeStart,
    rangeEnd,
    onPageChange,
}) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = pageNumbers(page, totalPages);

    return (
        <nav className="admin-table-pagination" aria-label="Table pagination">
            <p className="admin-table-pagination__summary">
                Showing {rangeStart}–{rangeEnd} of {totalItems}
            </p>
            <div className="admin-pagination">
                <button
                    type="button"
                    className="admin-pagination__btn"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    Previous
                </button>
                {pages.map((label, index) =>
                    label === '…' ? (
                        <span key={`ellipsis-${index}`} className="admin-pagination__ellipsis" aria-hidden="true">
                            …
                        </span>
                    ) : (
                        <button
                            key={label}
                            type="button"
                            className={label === page ? 'admin-pagination__btn admin-pagination__active' : 'admin-pagination__btn'}
                            onClick={() => onPageChange(label)}
                            aria-current={label === page ? 'page' : undefined}
                        >
                            {label}
                        </button>
                    )
                )}
                <button
                    type="button"
                    className="admin-pagination__btn"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                </button>
            </div>
        </nav>
    );
}
