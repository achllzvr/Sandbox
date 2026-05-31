import { useEffect, useMemo, useState } from 'react';

export const ADMIN_TABLE_PAGE_SIZE = 10;

export function useAdminPagination(items, pageSize = ADMIN_TABLE_PAGE_SIZE) {
    const [page, setPage] = useState(1);
    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    useEffect(() => {
        setPage(1);
    }, [items, pageSize]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const safePage = Math.min(page, totalPages);

    const paginatedItems = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, safePage, pageSize]);

    const rangeStart = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const rangeEnd = Math.min(safePage * pageSize, totalItems);

    return {
        page: safePage,
        setPage,
        totalPages,
        totalItems,
        pageSize,
        paginatedItems,
        rangeStart,
        rangeEnd,
    };
}
